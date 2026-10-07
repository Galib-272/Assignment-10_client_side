"use client";
import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";
import { FaBus, FaTrain, FaPlane, FaShip, FaMapMarkerAlt, FaClock, FaArrowLeft, FaLock } from "react-icons/fa";
import { MdAirlineSeatReclineNormal } from "react-icons/md";
import { format, isPast, differenceInSeconds } from "date-fns";

const transportIcon = { bus: <FaBus />, train: <FaTrain />, plane: <FaPlane />, launch: <FaShip /> };

function Countdown({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    const calc = () => {
      const diff = differenceInSeconds(new Date(targetDate), new Date());
      if (diff <= 0) return setTimeLeft({ expired: true });
      setTimeLeft({
        days: Math.floor(diff / 86400),
        hours: Math.floor((diff % 86400) / 3600),
        mins: Math.floor((diff % 3600) / 60),
        secs: diff % 60,
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  if (timeLeft.expired) return <span style={{ color: "var(--color-error)", fontWeight: "700" }}>Departed</span>;

  return (
    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
      {[
        { val: timeLeft.days, label: "Days" },
        { val: timeLeft.hours, label: "Hours" },
        { val: timeLeft.mins, label: "Mins" },
        { val: timeLeft.secs, label: "Secs" },
      ].map(({ val, label }) => (
        <div key={label} style={{ background: "var(--bg-surface2)", border: "1px solid var(--border-color)", borderRadius: "12px", padding: "12px 16px", minWidth: "68px", textAlign: "center" }}>
          <div style={{ fontSize: "24px", fontWeight: "800", color: "#00d4ff", fontFamily: "Space Grotesk, sans-serif", lineHeight: 1 }}>
            {String(val ?? 0).padStart(2, "0")}
          </div>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px", letterSpacing: "0.5px" }}>{label}</div>
        </div>
      ))}
    </div>
  );
}

function BookingModal({ ticket, onClose, onSuccess }) {
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

  const total = ticket.price * qty;

  const handleBook = async () => {
    if (qty < 1 || qty > ticket.quantity) return;
    setLoading(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/bookings`,
        { ticketId: ticket._id, quantity: qty },
        {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
            "x-user-email": session?.user?.email || "",
            "x-user-role": session?.user?.role || "",
            "x-user-name": session?.user?.name || "",
          },
        }
      );
      toast.success("Booking submitted! Check your dashboard.");
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <h2 style={{ fontSize: "22px", fontWeight: "800", color: "var(--text-primary)", marginBottom: "6px", fontFamily: "Space Grotesk, sans-serif" }}>
          Book Tickets
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginBottom: "24px" }}>
          {ticket.title}
        </p>

        <div style={{ marginBottom: "20px" }}>
          <label className="form-label">Ticket Quantity (Max available: {ticket.quantity})</label>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "8px" }}>
            <button
              type="button"
              onClick={() => setQty(q => Math.max(1, q - 1))}
              disabled={qty <= 1}
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "10px",
                border: "1px solid var(--border-color)",
                background: "var(--bg-surface2)",
                color: "var(--text-primary)",
                fontSize: "20px",
                fontWeight: "700",
                cursor: qty <= 1 ? "not-allowed" : "pointer",
                opacity: qty <= 1 ? 0.4 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              -
            </button>
            <div
              style={{
                flex: 1,
                height: "42px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "10px",
                border: "1px solid var(--border-color)",
                background: "var(--bg-surface)",
                fontSize: "18px",
                fontWeight: "700",
                color: "#00d4ff",
              }}
            >
              {qty} {qty === 1 ? "Seat" : "Seats"}
            </div>
            <button
              type="button"
              onClick={() => setQty(q => Math.min(ticket.quantity, q + 1))}
              disabled={qty >= ticket.quantity}
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "10px",
                border: "1px solid var(--border-color)",
                background: "var(--bg-surface2)",
                color: "var(--text-primary)",
                fontSize: "20px",
                fontWeight: "700",
                cursor: qty >= ticket.quantity ? "not-allowed" : "pointer",
                opacity: qty >= ticket.quantity ? 0.4 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              +
            </button>
          </div>
        </div>

        <div style={{ background: "var(--bg-surface2)", borderRadius: "12px", padding: "16px", marginBottom: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <span style={{ color: "var(--text-secondary)", fontSize: "14px" }}>Unit Price</span>
            <span style={{ color: "var(--text-primary)", fontWeight: "600" }}>৳{ticket.price?.toLocaleString()}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <span style={{ color: "var(--text-secondary)", fontSize: "14px" }}>Quantity</span>
            <span style={{ color: "var(--text-primary)", fontWeight: "600" }}>×{qty}</span>
          </div>
          <div style={{ height: "1px", background: "var(--border-color)", margin: "10px 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "var(--text-primary)", fontWeight: "700" }}>Total</span>
            <span style={{ color: "#00d4ff", fontWeight: "800", fontSize: "18px" }}>৳{total.toLocaleString()}</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <button onClick={onClose} className="btn-outline" style={{ flex: 1 }}>Cancel</button>
          <button
            onClick={handleBook}
            disabled={loading}
            className="btn-primary"
            id="confirm-booking"
            style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
          >
            {loading ? <><div className="spinner" style={{ width: "18px", height: "18px", borderWidth: "2px" }} /> Booking...</> : "Confirm Booking"}
          </button>
        </div>
      </div>
    </div>
  );
}

import { getMockTicketById } from "@/data/mockTickets";

export default function TicketDetailsPage() {
  const { id } = useParams();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace(`/login?callbackUrl=/tickets/${id}`);
    }
  }, [status, id, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    const fetchTicket = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/tickets/${id}`);
        if (res.data) {
          setTicket(res.data);
        } else {
          const fallback = getMockTicketById(id);
          setTicket(fallback);
        }
      } catch {
        const fallback = getMockTicketById(id);
        setTicket(fallback);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchTicket();
  }, [id, status]);

  if (status === "loading" || status === "unauthenticated" || loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", paddingTop: "80px", background: "var(--bg-primary)" }}>
        <div className="spinner" />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", paddingTop: "80px" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "64px", marginBottom: "16px" }}>🎫</div>
          <h2 style={{ fontSize: "24px", fontWeight: "700", color: "var(--text-primary)", marginBottom: "8px" }}>Ticket not found</h2>
          <Link href="/tickets"><button className="btn-primary" style={{ marginTop: "16px" }}>Browse Tickets</button></Link>
        </div>
      </div>
    );
  }

  const isExpired = isPast(new Date(ticket.departureDate));
  const isOutOfStock = ticket.quantity === 0;
  const type = ticket.transportType?.toLowerCase() || "bus";

  return (
    <div style={{ minHeight: "100vh", paddingTop: "80px", background: "var(--bg-primary)" }}>
      {/* Back button */}
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "24px 24px 0" }}>
        <Link href="/tickets" style={{ textDecoration: "none" }}>
          <button style={{ display: "flex", alignItems: "center", gap: "8px", background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", fontFamily: "Outfit, sans-serif", fontSize: "14px", fontWeight: "500", transition: "color 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#00d4ff")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
          >
            <FaArrowLeft size={13} /> Back to All Tickets
          </button>
        </Link>
      </div>

      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "32px" }}>
          {/* Left: Details */}
          <div>
            {/* Image */}
            <div style={{ borderRadius: "20px", overflow: "hidden", marginBottom: "28px", position: "relative", height: "360px" }}>
              <img
                src={ticket.image}
                alt={ticket.title}
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1568514328861-5465017e40fc?q=80&w=800&auto=format&fit=crop";
                }}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div style={{ position: "absolute", top: "16px", left: "16px", background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", color: "#fff", borderRadius: "10px", padding: "6px 14px", fontSize: "13px", fontWeight: "700", display: "flex", alignItems: "center", gap: "6px" }}>
                {transportIcon[type]} {ticket.transportType}
              </div>
            </div>

            {/* Title & Route */}
            <div style={{ marginBottom: "24px" }}>
              <h1 style={{ fontSize: "2rem", fontWeight: "900", color: "var(--text-primary)", fontFamily: "Space Grotesk, sans-serif", lineHeight: "1.2", marginBottom: "12px" }}>
                {ticket.title}
              </h1>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "16px" }}>
                <FaMapMarkerAlt color="#00d4ff" />
                <span style={{ color: "#00d4ff", fontWeight: "700" }}>{ticket.from}</span>
                <span style={{ color: "var(--text-muted)", fontSize: "20px" }}>→</span>
                <span style={{ color: "#00d4ff", fontWeight: "700" }}>{ticket.to}</span>
              </div>
            </div>

            {/* Info grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "16px", marginBottom: "28px" }}>
              {[
                { label: "Departure", value: format(new Date(ticket.departureDate), "dd MMM yyyy, hh:mm a"), icon: <FaClock size={16} color="#f59e0b" /> },
                { label: "Available Seats", value: `${ticket.quantity} seats`, icon: <MdAirlineSeatReclineNormal size={16} color="#10b981" /> },
                { label: "Vendor", value: ticket.vendorName || "TicketBari Vendor", icon: <FaBus size={14} color="#7c3aed" /> },
              ].map((info) => (
                <div key={info.label} style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "12px", padding: "16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>{info.icon}<span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "600" }}>{info.label}</span></div>
                  <div style={{ fontSize: "15px", color: "var(--text-primary)", fontWeight: "700" }}>{info.value}</div>
                </div>
              ))}
            </div>

            {/* Perks */}
            <div style={{ marginBottom: "28px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "700", color: "var(--text-primary)", marginBottom: "14px", fontFamily: "Space Grotesk, sans-serif" }}>Included Perks</h3>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {ticket.perks?.map((perk) => (
                  <span key={perk} style={{ background: "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.2)", color: "#00d4ff", borderRadius: "8px", padding: "7px 16px", fontSize: "13px", fontWeight: "600" }}>
                    ✓ {perk}
                  </span>
                ))}
              </div>
            </div>

            {/* Countdown */}
            <div style={{ marginBottom: "28px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "700", color: "var(--text-primary)", marginBottom: "14px", fontFamily: "Space Grotesk, sans-serif" }}>
                {isExpired ? "Departure Status" : "Departure Countdown"}
              </h3>
              <Countdown targetDate={ticket.departureDate} />
            </div>
          </div>

          {/* Right: Booking card */}
          <div>
            <div className="glass-card" style={{ padding: "28px", position: "sticky", top: "90px" }}>
              <div style={{ fontSize: "2rem", fontWeight: "900", color: "#00d4ff", fontFamily: "Space Grotesk, sans-serif", marginBottom: "4px" }}>
                ৳{ticket.price?.toLocaleString()}
              </div>
              <div style={{ color: "var(--text-muted)", fontSize: "13px", marginBottom: "20px" }}>per seat</div>

              <div className="divider" />

              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
                {[
                  { label: "From", val: ticket.from },
                  { label: "To", val: ticket.to },
                  { label: "Transport", val: ticket.transportType },
                  { label: "Departure", val: format(new Date(ticket.departureDate), "dd MMM yyyy") },
                  { label: "Time", val: format(new Date(ticket.departureDate), "hh:mm a") },
                  { label: "Available", val: `${ticket.quantity} seats` },
                ].map(({ label, val }) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "var(--text-muted)", fontSize: "13px" }}>{label}</span>
                    <span style={{ color: "var(--text-primary)", fontWeight: "600", fontSize: "14px" }}>{val}</span>
                  </div>
                ))}
              </div>

              {!session ? (
                <Link href={`/login?callbackUrl=/tickets/${id}`}>
                  <button className="btn-primary" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                    <FaLock size={13} /> Login to Book
                  </button>
                </Link>
              ) : ticket.vendorEmail === session?.user?.email ? (
                <div>
                  <Link href="/dashboard/my-tickets" style={{ textDecoration: "none" }}>
                    <button className="btn-primary" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                      Manage This Ticket in Dashboard ⚙️
                    </button>
                  </Link>
                  <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "12px", marginTop: "8px" }}>
                    You are the vendor for this ticket
                  </p>
                </div>
              ) : (
                <button
                  onClick={() => setShowModal(true)}
                  disabled={isExpired || isOutOfStock}
                  className="btn-primary"
                  id="book-now-btn"
                  style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
                >
                  {isExpired ? "Departure Passed" : isOutOfStock ? "Sold Out" : "Book Now 🎫"}
                </button>
              )}

              {isExpired && (
                <p style={{ textAlign: "center", color: "var(--color-error)", fontSize: "12px", marginTop: "10px" }}>
                  This ticket has expired
                </p>
              )}
              {isOutOfStock && !isExpired && (
                <p style={{ textAlign: "center", color: "var(--color-error)", fontSize: "12px", marginTop: "10px" }}>
                  No seats available
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <BookingModal
          ticket={ticket}
          onClose={() => setShowModal(false)}
          onSuccess={() => router.push("/dashboard/my-bookings")}
        />
      )}
    </div>
  );
}
