"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
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
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/payments/create-checkout`,
        { bookingId: booking._id },
        { headers: { Authorization: `Bearer ${session?.accessToken}`, "x-user-email": session?.user?.email || "", "x-user-role": session?.user?.role || "" } }
      );
      window.location.href = res.data.url;
    } catch {
      toast.error("Payment initiation failed");
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

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", paddingTop: "60px" }}>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "800", color: "var(--text-primary)", fontFamily: "Space Grotesk, sans-serif", marginBottom: "6px" }}>
          My Booked Tickets
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
          {bookings.length} booking{bookings.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {bookings.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 24px", background: "var(--bg-card)", borderRadius: "16px", border: "1px solid var(--border-color)" }}>
          <FaTicketAlt size={48} color="var(--text-muted)" style={{ marginBottom: "16px" }} />
          <h3 style={{ fontSize: "20px", fontWeight: "700", color: "var(--text-primary)", marginBottom: "8px" }}>No bookings yet</h3>
          <p style={{ color: "var(--text-secondary)" }}>Start exploring tickets and make your first booking!</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px" }}>
          {bookings.map((booking) => {
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
                      <button onClick={() => handlePay(booking)} className="btn-success" style={{ flex: 1, fontSize: "13px", padding: "9px" }}>
                        💳 Pay Now
                      </button>
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
