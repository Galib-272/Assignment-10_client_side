"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaImage, FaUpload, FaTrashAlt, FaLink, FaBan } from "react-icons/fa";

const TRANSPORT_OPTIONS = ["Bus", "Train", "Plane", "Launch"];
const PERKS_OPTIONS = [
  "AC",
  "WiFi",
  "Breakfast",
  "Lunch",
  "Dinner",
  "Snacks",
  "Movie",
  "Reclining Seats",
  "Lounge Access",
  "Priority Boarding",
  "Cabin",
  "Scenic View",
];

export default function AddTicketPage() {
  const { data: session } = useSession();
  const [perks, setPerks] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [customUrl, setCustomUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFraud, setIsFraud] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Check if this vendor is marked as fraud
  useEffect(() => {
    if (!session?.accessToken) return;
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "x-user-email": session?.user?.email || "",
          "x-user-role": session?.user?.role || "",
        },
      })
      .then((res) => {
        if (res.data?.isFraud) setIsFraud(true);
      })
      .catch(() => {});
  }, [session]);

  const togglePerk = (p) => {
    setPerks((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  };

  // Compress image to ensure reliable fast upload & db storage
  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 1000;
          const MAX_HEIGHT = 1000;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", 0.75));
        };
      };
      reader.onerror = () => resolve(null);
    });
  };

  const processFile = async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      return toast.error("Please select a valid image file (PNG, JPG, WEBP)");
    }

    setUploading(true);

    const imgbbKey =
      process.env.NEXT_PUBLIC_IMGBB_API_KEY ||
      process.env.NEXT_PUBLIC_IMGBB_KEY;

    // Try ImgBB if key exists and is not placeholder
    if (imgbbKey && !imgbbKey.includes("placeholder")) {
      try {
        const formData = new FormData();
        formData.append("image", file);
        const res = await axios.post(
          `https://api.imgbb.com/1/upload?key=${imgbbKey}`,
          formData
        );
        if (res.data?.data?.url) {
          setImageUrl(res.data.data.url);
          toast.success("Image uploaded to ImgBB!");
          setUploading(false);
          return;
        }
      } catch (err) {
        console.warn("ImgBB upload failed, falling back to local compressed reader:", err);
      }
    }

    // Reliable fallback: Compress locally and read as Data URL
    try {
      const compressedDataUrl = await compressImage(file);
      if (compressedDataUrl) {
        setImageUrl(compressedDataUrl);
        toast.success("Image uploaded successfully!");
      } else {
        toast.error("Failed to read image file");
      }
    } catch {
      toast.error("Error processing image file");
    } finally {
      setUploading(false);
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleApplyCustomUrl = async () => {
    let raw = customUrl.trim();
    if (!raw) return toast.error("Please enter an image link");

    // Extract URL if user pasted HTML tag like <img src="..."> or [img]...[/img]
    const htmlMatch = raw.match(/src=["']([^"']+)["']/i);
    if (htmlMatch && htmlMatch[1]) raw = htmlMatch[1];
    const bbMatch = raw.match(/\[img\](.*?)\[\/img\]/i);
    if (bbMatch && bbMatch[1]) raw = bbMatch[1];

    // If it's an ImgBB viewer link (ibb.co/XYZ), resolve it automatically to direct image
    if (raw.includes("ibb.co/") && !raw.includes("i.ibb.co/")) {
      const loadingToast = toast.loading("Resolving ImgBB direct image...");
      try {
        const res = await fetch(`/api/resolve-image?url=${encodeURIComponent(raw)}`);
        const data = await res.json();
        toast.dismiss(loadingToast);
        if (data.directUrl && data.directUrl !== raw) {
          setImageUrl(data.directUrl);
          setShowUrlInput(false);
          setCustomUrl("");
          toast.success("ImgBB direct image applied!");
          return;
        }
      } catch {
        toast.dismiss(loadingToast);
      }
    }

    setImageUrl(raw);
    setShowUrlInput(false);
    setCustomUrl("");
    toast.success("Image URL applied!");
  };

  const onSubmit = async (data) => {
    if (!imageUrl) return toast.error("Please upload or provide an image");
    if (perks.length === 0) return toast.error("Select at least one perk");
    setLoading(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/tickets`,
        {
          ...data,
          perks,
          image: imageUrl,
          price: Number(data.price),
          quantity: Number(data.quantity),
        },
        {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
            "x-user-email": session?.user?.email || "",
            "x-user-role": session?.user?.role || "vendor",
            "x-user-name": session?.user?.name || "",
          },
        }
      );
      toast.success("Ticket submitted for admin approval!");
      reset();
      setPerks([]);
      setImageUrl("");
    } catch (err) {
      // Extract error message robustly — handles empty objects, network errors, and 403s
      const responseData = err.response?.data;
      const msg =
        (typeof responseData === "object" && responseData !== null
          ? responseData.message || responseData.error
          : null) ||
        err.message ||
        "Failed to add ticket";
      console.error("Ticket submission error:", msg, err.response?.status);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Show blocked UI if this vendor is marked as fraud
  if (isFraud) {
    return (
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div
          className="card"
          style={{
            padding: "60px 40px",
            textAlign: "center",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            background: "rgba(239, 68, 68, 0.05)",
          }}
        >
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              background: "rgba(239, 68, 68, 0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
              border: "1px solid rgba(239, 68, 68, 0.3)",
            }}
          >
            <FaBan size={32} color="#ef4444" />
          </div>
          <h2
            style={{
              fontSize: "22px",
              fontWeight: "800",
              color: "#ef4444",
              fontFamily: "Space Grotesk, sans-serif",
              marginBottom: "12px",
            }}
          >
            Account Suspended
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "15px", maxWidth: "420px", margin: "0 auto 8px" }}>
            Your vendor account has been flagged as <strong style={{ color: "#ef4444" }}>fraudulent</strong> by an administrator.
          </p>
          <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>
            You can no longer add or modify tickets. Please contact support if you believe this is a mistake.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1
          style={{
            fontSize: "28px",
            fontWeight: "800",
            color: "var(--text-primary)",
            fontFamily: "Space Grotesk, sans-serif",
            marginBottom: "6px",
          }}
        >
          Add New Ticket
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
          Submit a new travel schedule and ticket listing for admin review
        </p>
      </div>

      <div className="card" style={{ padding: "36px" }}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ display: "flex", flexDirection: "column", gap: "22px" }}
        >
          {/* Ticket Title */}
          <div>
            <label className="form-label">Ticket Title *</label>
            <input
              {...register("title", { required: "Title is required" })}
              placeholder="e.g. Dhaka to Chittagong Express Sleeper"
              className="input-field"
              id="ticket-title"
            />
            {errors.title && (
              <p
                style={{
                  color: "var(--color-error)",
                  fontSize: "12px",
                  marginTop: "4px",
                }}
              >
                {errors.title.message}
              </p>
            )}
          </div>

          {/* From → To */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            <div>
              <label className="form-label">From (Departure City) *</label>
              <input
                {...register("from", { required: "Required" })}
                placeholder="e.g. Dhaka"
                className="input-field"
                id="ticket-from"
              />
              {errors.from && (
                <p
                  style={{
                    color: "var(--color-error)",
                    fontSize: "12px",
                    marginTop: "4px",
                  }}
                >
                  {errors.from.message}
                </p>
              )}
            </div>
            <div>
              <label className="form-label">To (Destination City) *</label>
              <input
                {...register("to", { required: "Required" })}
                placeholder="e.g. Cox's Bazar"
                className="input-field"
                id="ticket-to"
              />
              {errors.to && (
                <p
                  style={{
                    color: "var(--color-error)",
                    fontSize: "12px",
                    marginTop: "4px",
                  }}
                >
                  {errors.to.message}
                </p>
              )}
            </div>
          </div>

          {/* Transport type */}
          <div>
            <label className="form-label">Transport Type *</label>
            <select
              {...register("transportType", { required: "Required" })}
              className="input-field"
              id="ticket-transport"
            >
              <option value="">Select transport type</option>
              {TRANSPORT_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            {errors.transportType && (
              <p
                style={{
                  color: "var(--color-error)",
                  fontSize: "12px",
                  marginTop: "4px",
                }}
              >
                {errors.transportType.message}
              </p>
            )}
          </div>

          {/* Price & Quantity */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            <div>
              <label className="form-label">Price per Ticket (৳ BDT) *</label>
              <input
                {...register("price", {
                  required: "Required",
                  min: { value: 1, message: "Price must be > 0" },
                })}
                type="number"
                placeholder="e.g. 1200"
                className="input-field"
                id="ticket-price"
              />
              {errors.price && (
                <p
                  style={{
                    color: "var(--color-error)",
                    fontSize: "12px",
                    marginTop: "4px",
                  }}
                >
                  {errors.price.message}
                </p>
              )}
            </div>
            <div>
              <label className="form-label">Available Seats / Quantity *</label>
              <input
                {...register("quantity", {
                  required: "Required",
                  min: { value: 1, message: "Quantity must be > 0" },
                })}
                type="number"
                placeholder="e.g. 40"
                className="input-field"
                id="ticket-quantity"
              />
              {errors.quantity && (
                <p
                  style={{
                    color: "var(--color-error)",
                    fontSize: "12px",
                    marginTop: "4px",
                  }}
                >
                  {errors.quantity.message}
                </p>
              )}
            </div>
          </div>

          {/* Departure Date & Time */}
          <div>
            <label className="form-label">Departure Date & Time *</label>
            <input
              {...register("departureDate", {
                required: "Departure date is required",
                validate: (v) =>
                  new Date(v) > new Date() || "Departure date must be in the future",
              })}
              type="datetime-local"
              className="input-field"
              id="ticket-departure"
            />
            {errors.departureDate && (
              <p
                style={{
                  color: "var(--color-error)",
                  fontSize: "12px",
                  marginTop: "4px",
                }}
              >
                {errors.departureDate.message}
              </p>
            )}
          </div>

          {/* Perks */}
          <div>
            <label className="form-label">Perks & Amenities Included *</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {PERKS_OPTIONS.map((perk) => (
                <button
                  key={perk}
                  type="button"
                  onClick={() => togglePerk(perk)}
                  style={{
                    padding: "7px 14px",
                    borderRadius: "8px",
                    border: `1.5px solid ${
                      perks.includes(perk)
                        ? "rgba(0,212,255,0.5)"
                        : "var(--border-color)"
                    }`,
                    background: perks.includes(perk)
                      ? "rgba(0,212,255,0.12)"
                      : "transparent",
                    color: perks.includes(perk)
                      ? "#00d4ff"
                      : "var(--text-secondary)",
                    fontSize: "13px",
                    fontWeight: "600",
                    cursor: "pointer",
                    fontFamily: "Outfit, sans-serif",
                    transition: "all 0.2s",
                  }}
                >
                  {perks.includes(perk) ? "✓ " : ""}
                  {perk}
                </button>
              ))}
            </div>
          </div>

          {/* Image upload area with Drag & Drop */}
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <label className="form-label" style={{ marginBottom: 0 }}>
                Ticket Image *
              </label>
              <button
                type="button"
                onClick={() => setShowUrlInput(!showUrlInput)}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--color-primary)",
                  fontSize: "12px",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <FaLink size={10} />
                {showUrlInput ? "Hide URL Input" : "Paste Image URL instead"}
              </button>
            </div>

            {showUrlInput && (
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  marginBottom: "12px",
                }}
              >
                <input
                  type="url"
                  placeholder="Paste direct image link (e.g. https://images.unsplash.com/...)"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  className="input-field"
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  onClick={handleApplyCustomUrl}
                  className="btn btn-primary"
                  style={{ padding: "8px 16px", fontSize: "13px" }}
                >
                  Apply
                </button>
              </div>
            )}

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              style={{
                border: isDragging
                  ? "2px dashed var(--color-primary)"
                  : "2px dashed var(--border-color)",
                borderRadius: "14px",
                padding: "28px",
                textAlign: "center",
                background: isDragging
                  ? "rgba(0, 212, 255, 0.08)"
                  : "var(--surface-2)",
                transition: "all 0.2s ease",
                position: "relative",
              }}
            >
              {imageUrl ? (
                <div>
                  <img
                    src={imageUrl}
                    alt="Ticket Preview"
                    style={{
                      maxHeight: "180px",
                      maxWidth: "100%",
                      borderRadius: "10px",
                      objectFit: "cover",
                      marginBottom: "12px",
                      border: "1px solid var(--border-color)",
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        color: "var(--color-success)",
                        fontSize: "13px",
                        fontWeight: "600",
                      }}
                    >
                      ✓ Image ready for upload
                    </span>
                    <button
                      type="button"
                      onClick={() => setImageUrl("")}
                      style={{
                        background: "rgba(239, 68, 68, 0.15)",
                        border: "1px solid rgba(239, 68, 68, 0.3)",
                        color: "var(--color-error)",
                        borderRadius: "6px",
                        padding: "4px 8px",
                        cursor: "pointer",
                        fontSize: "12px",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <FaTrashAlt size={11} /> Remove
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <FaImage
                    size={38}
                    color="var(--text-muted)"
                    style={{ marginBottom: "12px" }}
                  />
                  <p
                    style={{
                      color: "var(--text-primary)",
                      fontSize: "14px",
                      fontWeight: "600",
                      marginBottom: "4px",
                    }}
                  >
                    {isDragging
                      ? "Drop your image here!"
                      : "Drag & drop your ticket photo here"}
                  </p>
                  <p
                    style={{
                      color: "var(--text-muted)",
                      fontSize: "12px",
                      marginBottom: "16px",
                    }}
                  >
                    PNG, JPG, or WEBP supported
                  </p>
                  <label style={{ cursor: "pointer" }}>
                    <span
                      className="btn btn-outline"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "8px 20px",
                        fontSize: "13px",
                      }}
                    >
                      <FaUpload size={12} />
                      {uploading ? "Processing..." : "Browse Local File"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileInput}
                      style={{ display: "none" }}
                      id="ticket-image-input"
                    />
                  </label>
                </>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="form-label">Trip Description & Details</label>
            <textarea
              {...register("description")}
              rows={3}
              placeholder="e.g. Boarding points, luggage guidelines, travel guidelines..."
              className="input-field"
              style={{ resize: "vertical" }}
            />
          </div>

          {/* Vendor info (readonly) */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            <div>
              <label className="form-label">Vendor Name</label>
              <input
                value={session?.user?.name || "Green Line Paribahan"}
                readOnly
                className="input-field"
                style={{ opacity: 0.7, cursor: "not-allowed" }}
              />
            </div>
            <div>
              <label className="form-label">Vendor Email</label>
              <input
                value={session?.user?.email || "vendor@ticketbari.com"}
                readOnly
                className="input-field"
                style={{ opacity: 0.7, cursor: "not-allowed" }}
              />
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading || uploading}
            className="btn btn-primary"
            style={{
              width: "100%",
              padding: "14px",
              fontSize: "16px",
              justifyContent: "center",
              marginTop: "8px",
            }}
          >
            {loading ? "Submitting Ticket..." : "🚀 Publish Ticket for Approval"}
          </button>
        </form>
      </div>
    </div>
  );
}
