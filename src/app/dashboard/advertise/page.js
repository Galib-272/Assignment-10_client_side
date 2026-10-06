"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import toast from "react-hot-toast";
import { 
  FaBullhorn, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaInfoCircle, 
  FaBus, 
  FaPlane, 
  FaTrain, 
  FaShip,
  FaSearch
} from "react-icons/fa";
import { format } from "date-fns";

const mockTickets = [
  {
    _id: "t1",
    title: "Dhaka to Cox's Bazar Express Sleeper",
    from: "Dhaka",
    to: "Cox's Bazar",
    transportType: "bus",
    price: 1800,
    departureDate: "2026-11-20T22:30:00Z",
    vendorEmail: "greenline@example.com",
    vendorName: "Green Line Paribahan",
    verificationStatus: "approved",
    isAdvertised: true,
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&h=400&fit=crop"
  },
  {
    _id: "t2",
    title: "Dhaka to Chittagong AC Train (Subarna)",
    from: "Dhaka",
    to: "Chittagong",
    transportType: "train",
    price: 750,
    departureDate: "2026-12-10T07:00:00Z",
    vendorEmail: "railway@example.com",
    vendorName: "Bangladesh Railway",
    verificationStatus: "approved",
    isAdvertised: true,
    image: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=600&h=400&fit=crop"
  },
  {
    _id: "t5",
    title: "Dhaka to Saidpur Domestic Flight",
    from: "Dhaka",
    to: "Saidpur",
    transportType: "plane",
    price: 3800,
    departureDate: "2026-12-05T14:00:00Z",
    vendorEmail: "usbangla@example.com",
    vendorName: "US-Bangla Airlines",
    verificationStatus: "approved",
    isAdvertised: true,
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&h=400&fit=crop"
  },
  {
    _id: "t6",
    title: "Dhaka to Sylhet Green Deluxe",
    from: "Dhaka",
    to: "Sylhet",
    transportType: "bus",
    price: 900,
    departureDate: "2026-11-25T08:00:00Z",
    vendorEmail: "greenline@example.com",
    vendorName: "Green Line Paribahan",
    verificationStatus: "approved",
    isAdvertised: false,
    image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=600&h=400&fit=crop"
  },
  {
    _id: "t7",
    title: "Chittagong to Cox's Bazar Coastal Express",
    from: "Chittagong",
    to: "Cox's Bazar",
    transportType: "train",
    price: 350,
    departureDate: "2026-12-15T09:00:00Z",
    vendorEmail: "railway@example.com",
    vendorName: "Bangladesh Railway",
    verificationStatus: "approved",
    isAdvertised: false,
    image: "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=600&h=400&fit=crop"
  },
  {
    _id: "t8",
    title: "Dhaka to Barisal Kuakata Luxury Steamer",
    from: "Dhaka",
    to: "Barisal",
    transportType: "launch",
    price: 2400,
    departureDate: "2026-12-20T21:00:00Z",
    vendorEmail: "launch@example.com",
    vendorName: "Sundarban Navigation",
    verificationStatus: "approved",
    isAdvertised: false,
    image: "https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=600&h=400&fit=crop"
  }
];

export default function AdvertisePage() {
  const { data: session } = useSession();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [togglingId, setTogglingId] = useState(null);

  const fetchTickets = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/tickets`, {
        headers: { Authorization: `Bearer ${session?.accessToken}`, "x-user-email": session?.user?.email || "", "x-user-role": session?.user?.role || "" },
      });
      // Filter for approved tickets
      const approvedOnly = res.data.filter((t) => t.verificationStatus === "approved");
      setTickets(approvedOnly);
    } catch {
      setTickets(mockTickets);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [session]);

  const advertisedTickets = tickets.filter((t) => t.isAdvertised);
  const advertisedCount = advertisedTickets.length;

  const handleToggleAdvertise = async (ticket) => {
    const willAdvertise = !ticket.isAdvertised;

    if (willAdvertise && advertisedCount >= 6) {
      toast.error("Maximum 6 tickets can be advertised simultaneously on the home page!");
      return;
    }

    setTogglingId(ticket._id);
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/tickets/${ticket._id}/advertise`,
        { isAdvertised: willAdvertise },
        { headers: { Authorization: `Bearer ${session?.accessToken}`, "x-user-email": session?.user?.email || "", "x-user-role": session?.user?.role || "" } }
      );
      toast.success(willAdvertise ? "Ticket added to homepage showcase!" : "Ticket removed from showcase");
      setTickets((prev) =>
        prev.map((t) => (t._id === ticket._id ? { ...t, isAdvertised: willAdvertise } : t))
      );
    } catch {
      setTickets((prev) =>
        prev.map((t) => (t._id === ticket._id ? { ...t, isAdvertised: willAdvertise } : t))
      );
      toast.success(willAdvertise ? "Added to homepage showcase (Simulated)!" : "Removed from showcase (Simulated)");
    } finally {
      setTogglingId(null);
    }
  };

  const filteredTickets = tickets.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.from.toLowerCase().includes(search.toLowerCase()) ||
    t.to.toLowerCase().includes(search.toLowerCase()) ||
    (t.vendorName && t.vendorName.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "800", color: "var(--text-primary)", fontFamily: "Space Grotesk, sans-serif", marginBottom: "6px" }}>
          Advertise Tickets on Homepage
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
          Select up to 6 approved tickets to feature prominently in the &quot;Advertised Tickets&quot; section on the landing page
        </p>
      </div>

      {/* Slots Banner */}
      <div style={{
        background: "linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%)",
        border: "1px solid rgba(0, 212, 255, 0.25)",
        borderRadius: "16px",
        padding: "20px 24px",
        marginBottom: "32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "16px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{
            width: "48px",
            height: "48px",
            borderRadius: "12px",
            background: "rgba(0, 212, 255, 0.15)",
            color: "var(--color-primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "22px"
          }}>
            <FaBullhorn />
          </div>
          <div>
            <div style={{ fontSize: "16px", fontWeight: "700", color: "var(--text-primary)" }}>
              Showcase Allocation: {advertisedCount} / 6 Slots Active
            </div>
            <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
              {6 - advertisedCount > 0
                ? `${6 - advertisedCount} more tickets can be featured right now`
                : "All 6 advertisement slots are currently filled"}
            </div>
          </div>
        </div>

        {/* Visual Progress Dots */}
        <div style={{ display: "flex", gap: "8px" }}>
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <div
              key={index}
              style={{
                width: "14px",
                height: "14px",
                borderRadius: "50%",
                background: index < advertisedCount ? "var(--color-primary)" : "var(--surface-2)",
                border: index < advertisedCount ? "none" : "1px solid var(--border-color)",
                boxShadow: index < advertisedCount ? "0 0 10px rgba(0, 212, 255, 0.6)" : "none",
                transition: "all 0.3s ease"
              }}
            />
          ))}
        </div>
      </div>

      {/* Search Filter */}
      <div className="card" style={{ padding: "16px", marginBottom: "28px", display: "flex", alignItems: "center", gap: "12px" }}>
        <FaSearch style={{ color: "var(--text-muted)" }} />
        <input
          type="text"
          placeholder="Filter approved tickets by title, route, or vendor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            background: "transparent",
            border: "none",
            color: "var(--text-primary)",
            fontSize: "14px",
            width: "100%",
            outline: "none"
          }}
        />
      </div>

      {/* Tickets Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
        gap: "24px"
      }}>
        {filteredTickets.map((ticket) => {
          const isAdv = ticket.isAdvertised;
          return (
            <div
              key={ticket._id}
              className="card"
              style={{
                padding: "0",
                overflow: "hidden",
                border: isAdv ? "1px solid rgba(0, 212, 255, 0.4)" : "1px solid var(--border-color)",
                boxShadow: isAdv ? "0 0 20px rgba(0, 212, 255, 0.1)" : "none",
                transition: "all 0.3s ease"
              }}
            >
              {/* Thumbnail Image */}
              <div style={{ position: "relative", height: "160px", width: "100%" }}>
                <img
                  src={ticket.image || "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&h=400&fit=crop"}
                  alt={ticket.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div style={{
                  position: "absolute",
                  top: "12px",
                  right: "12px",
                  padding: "4px 10px",
                  borderRadius: "999px",
                  fontSize: "11px",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  background: isAdv ? "var(--color-primary)" : "rgba(0, 0, 0, 0.6)",
                  color: isAdv ? "#050816" : "#fff",
                  backdropFilter: "blur(4px)"
                }}>
                  {isAdv ? "Featured Ad" : "Standard"}
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                  <h3 style={{ fontSize: "16px", fontWeight: "700", color: "var(--text-primary)", lineHeight: 1.3 }}>
                    {ticket.title}
                  </h3>
                  <span style={{ fontSize: "16px", fontWeight: "800", color: "var(--color-primary)" }}>
                    ৳{ticket.price}
                  </span>
                </div>

                <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "6px" }}>
                  {ticket.from} → {ticket.to}
                </div>

                <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "16px" }}>
                  Vendor: {ticket.vendorName || ticket.vendorEmail}
                </div>

                {/* Toggle Button */}
                <button
                  onClick={() => handleToggleAdvertise(ticket)}
                  disabled={togglingId === ticket._id || (!isAdv && advertisedCount >= 6)}
                  style={{
                    width: "100%",
                    padding: "10px 16px",
                    borderRadius: "10px",
                    fontSize: "13px",
                    fontWeight: "600",
                    cursor: (!isAdv && advertisedCount >= 6) ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    transition: "all 0.2s ease",
                    background: isAdv
                      ? "rgba(239, 68, 68, 0.15)"
                      : "linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)",
                    color: isAdv ? "var(--color-error)" : "#fff",
                    border: isAdv ? "1px solid rgba(239, 68, 68, 0.3)" : "none",
                    opacity: (!isAdv && advertisedCount >= 6) ? 0.5 : 1
                  }}
                >
                  {isAdv ? (
                    <>
                      <FaTimesCircle /> Remove from Showcase
                    </>
                  ) : (
                    <>
                      <FaCheckCircle /> Advertise on Homepage
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
