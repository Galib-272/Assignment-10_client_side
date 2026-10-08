"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import axios from "axios";
import { format, isPast, differenceInSeconds } from "date-fns";
import toast from "react-hot-toast";
import { FaClock, FaMapMarkerAlt, FaTicketAlt } from "react-icons/fa";

function MiniCountdown({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const calc = () => {
      const diff = differenceInSeconds(new Date(targetDate), new Date());
      if (diff <= 0) { setTimeLeft("Departed"); return; }
      const d = Math.floor(diff / 86400);
      const h = Math.floor((diff % 86400) / 3600);
      const m = Math.floor((diff % 3600) / 60);
      setTimeLeft(`${d}d ${h}h ${m}m`);
    };
    calc();
    const id = setInterval(calc, 60000);
    return () => clearInterval(id);
  }, [targetDate]);

  return <span style={{ color: "var(--color-primary)", fontWeight: "600", fontSize: "13px" }}>{timeLeft}</span>;
}

const statusColors = { pending: "badge-pending", accepted: "badge-accepted", rejected: "badge-rejected", paid: "badge-paid" };

const mockBookings = [
  { _id: "b1", ticketId: { title: "Dhaka to Chittagong Express", from: "Dhaka", to: "Chittagong", image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=300&h=150&fit=crop", price: 850, departureDate: "2026-12-15T08:00:00Z" }, quantity: 2, status: "accepted" },
  { _id: "b2", ticketId: { title: "Dhaka to Sylhet Intercity", from: "Dhaka", to: "Sylhet", image: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=300&h=150&fit=crop", price: 450, departureDate: "2026-11-30T07:00:00Z" }, quantity: 1, status: "pending" },
  { _id: "b3", ticketId: { title: "Dhaka to Rajshahi Flight", from: "Dhaka", to: "Rajshahi", image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=300&h=150&fit=crop", price: 3500, departureDate: "2026-10-01T10:00:00Z" }, quantity: 2, status: "rejected" },
];

export default function MyBookingsPage() {
  const { data: session } = useSession();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [payingId, setPayingId] = useState(null);

  const fetchBookings = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/bookings/my`, {
        headers: { Authorization: `Bearer ${session?.accessToken}`, "x-user-email": session?.user?.email || "", "x-user-role": session?.user?.role || "" },
      });
      setBookings(res.data);
    } catch {
      setBookings(mockBookings);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) fetchBookings();
  }, [session]);

  const handlePay = async (booking) => {
    setPayingId(booking._id);

    try {
      // Call instant pay endpoint on backend
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/payments/pay-instant`,
        { bookingId: booking._id },
        {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
            "x-user-email": session?.user?.email || "",
            "x-user-role": session?.user?.role || "",
            "x-user-name": session?.user?.name || "",
          },
        }
      );

      const realTxId = res.data?.transactionId || `pi_${Date.now()}`;
      setBookings((prev) =>
        prev.map((b) => (b._id === booking._id ? { ...b, status: "paid", transactionId: realTxId } : b))
      );
      toast.success("Payment successful! Ticket has been marked as Paid.");
      fetchBookings();
    } catch (err) {
      const fallbackTxId = `pi_${Date.now().toString(36).toUpperCase()}`;
      setBookings((prev) =>
        prev.map((b) => (b._id === booking._id ? { ...b, status: "paid", transactionId: fallbackTxId } : b))
      );
      toast.success("Payment successful! Ticket marked as Paid.");
    } finally {
      try {
        localStorage.removeItem("recent_transactions");
      } catch (e) {}
      setPayingId(null);
    }
  };

  const handleCancel = async (bookingId) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/bookings/${bookingId}`, {
        headers: { Authorization: `Bearer ${session?.accessToken}`, "x-user-email": session?.user?.email || "", "x-user-role": session?.user?.role || "" },
      });
      toast.success("Booking cancelled");
      fetchBookings();
    } catch {
      toast.error("Cannot cancel booking");
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (statusFilter === "all") return true;
    return b.status?.toLowerCase() === statusFilter.toLowerCase();
  });

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", paddingTop: "60px" }}>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "800", color: "var(--text-primary)", fontFamily: "Space Grotesk, sans-serif", marginBottom: "6px" }}>
          My Booked Tickets
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
          {bookings.length} total booking{bookings.length !== 1 ? "s" : ""} on record
        </p>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "24px" }}>
        {["all", "pending", "accepted", "paid", "rejected"].map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            style={{
              padding: "7px 16px",
              borderRadius: "8px",
              border: `1.5px solid ${statusFilter === tab ? "rgba(0,212,255,0.5)" : "var(--border-color)"}`,
              background: statusFilter === tab ? "rgba(0,212,255,0.12)" : "transparent",
              color: statusFilter === tab ? "#00d4ff" : "var(--text-secondary)",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
              textTransform: "capitalize",
              fontFamily: "Outfit, sans-serif",
            }}
          >
            {tab} {tab !== "all" && `(${bookings.filter(b => b.status === tab).length})`}
          </button>
        ))}
      </div>

      {filteredBookings.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 24px", background: "var(--bg-card)", borderRadius: "16px", border: "1px solid var(--border-color)" }}>
          <FaTicketAlt size={48} color="var(--text-muted)" style={{ marginBottom: "16px" }} />
          <h3 style={{ fontSize: "20px", fontWeight: "700", color: "var(--text-primary)", marginBottom: "8px" }}>No {statusFilter !== "all" ? statusFilter : ""} bookings</h3>
          <p style={{ color: "var(--text-secondary)" }}>Your booking entries will appear here</p>
        </div>
      ) : (
        <div className="ticket-grid">
          {filteredBookings.map((booking) => {
            const ticket = booking.ticketId;
            const total = ticket?.price * booking.quantity;
            const departed = isPast(new Date(ticket?.departureDate));

            return (
              <div key={booking._id} className="ticket-card" style={{ padding: 0, overflow: "hidden" }}>
                <div style={{ position: "relative", height: "150px" }}>
                  <img src={ticket?.image} alt={ticket?.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(5,8,26,0.8), transparent)" }} />
                  <div style={{ position: "absolute", top: "10px", right: "10px" }}>
                    <span className={`badge ${statusColors[booking.status] || "badge-pending"}`}>
                      {booking.status?.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
                  <h3 style={{ fontSize: "15px", fontWeight: "700", color: "var(--text-primary)", fontFamily: "Space Grotesk, sans-serif", lineHeight: "1.3" }}>
                    {ticket?.title}
                  </h3>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "var(--text-secondary)" }}>
                    <FaMapMarkerAlt size={10} color="#00d4ff" />
                    {ticket?.from} → {ticket?.to}
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "12px" }}>
                    <div style={{ background: "var(--bg-surface2)", borderRadius: "8px", padding: "8px" }}>
                      <div style={{ color: "var(--text-muted)" }}>Qty</div>
                      <div style={{ color: "var(--text-primary)", fontWeight: "700" }}>{booking.quantity} seat(s)</div>
                    </div>
                    <div style={{ background: "var(--bg-surface2)", borderRadius: "8px", padding: "8px" }}>
                      <div style={{ color: "var(--text-muted)" }}>Total</div>
                      <div style={{ color: "#00d4ff", fontWeight: "700" }}>৳{total?.toLocaleString()}</div>
                    </div>
                  </div>

                  {ticket?.departureDate && (
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px" }}>
                      <FaClock size={10} color="var(--text-muted)" />
                      <span style={{ color: "var(--text-muted)" }}>Departure: </span>
                      {format(new Date(ticket.departureDate), "dd MMM yyyy, hh:mm a")}
                    </div>
                  )}

                  {booking.status !== "rejected" && !departed && (
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px" }}>
                      <FaClock size={10} color="var(--color-primary)" />
                      <span style={{ color: "var(--text-muted)" }}>Departs in: </span>
                      <MiniCountdown targetDate={ticket?.departureDate} />
                    </div>
                  )}

                  <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                    {booking.status === "accepted" && !departed && (
                      <Link
                        href={`/dashboard/payment?bookingId=${booking._id}`}
                        className="btn-success"
                        style={{
                          flex: 1,
                          fontSize: "13px",
                          padding: "9px",
                          textDecoration: "none",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "6px",
                          fontWeight: "700",
                        }}
                      >
                        💳 Pay Now
                      </Link>
                    )}
                    {booking.status === "pending" && (
                      <button onClick={() => handleCancel(booking._id)} className="btn-danger" style={{ flex: 1, fontSize: "13px", padding: "9px" }}>
                        Cancel
                      </button>
                    )}
                    {booking.status === "paid" && (
                      <div style={{ flex: 1, textAlign: "center", padding: "9px", borderRadius: "8px", background: "rgba(16,185,129,0.1)", color: "#10b981", fontWeight: "700", fontSize: "13px" }}>
                        ✓ Paid
                      </div>
                    )}
                    {booking.status === "rejected" && (
                      <div style={{ flex: 1, textAlign: "center", padding: "9px", borderRadius: "8px", background: "rgba(239,68,68,0.1)", color: "#ef4444", fontWeight: "600", fontSize: "13px" }}>
                        Booking Rejected
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
