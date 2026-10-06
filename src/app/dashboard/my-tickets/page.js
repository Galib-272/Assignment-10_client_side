"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaEdit, FaTrash, FaTicketAlt } from "react-icons/fa";

const mockVendorTickets = [
  { _id: "v1", title: "Dhaka to Chittagong Express", from: "Dhaka", to: "Chittagong", price: 850, transportType: "Bus", quantity: 45, verificationStatus: "approved", image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=300&h=150&fit=crop" },
  { _id: "v2", title: "Dhaka to Sylhet Intercity", from: "Dhaka", to: "Sylhet", price: 450, transportType: "Train", quantity: 120, verificationStatus: "pending", image: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=300&h=150&fit=crop" },
  { _id: "v3", title: "Dhaka to Cox's Bazar", from: "Dhaka", to: "Cox's Bazar", price: 1200, transportType: "Bus", quantity: 30, verificationStatus: "rejected", image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=300&h=150&fit=crop" },
];

const statusStyle = {
  approved: { bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.3)", color: "#10b981" },
  pending: { bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.3)", color: "#f59e0b" },
  rejected: { bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.3)", color: "#ef4444" },
};

export default function MyTicketsPage() {
  const { data: session } = useSession();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTicket, setEditingTicket] = useState(null);
  const [editPrice, setEditPrice] = useState("");
  const [editQty, setEditQty] = useState("");

  const fetchTickets = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/tickets/vendor`, {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
          "x-user-email": session?.user?.email || "",
          "x-user-role": session?.user?.role || "vendor",
        },
      });
      if (Array.isArray(res.data)) {
        setTickets(res.data);
      } else {
        setTickets([]);
      }
    } catch (err) {
      console.error("Error fetching vendor tickets:", err);
      // Fallback only if totally offline
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (session) fetchTickets(); }, [session]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this ticket?")) return;
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/tickets/${id}`, {
        headers: { Authorization: `Bearer ${session?.accessToken}`, "x-user-email": session?.user?.email || "", "x-user-role": session?.user?.role || "" },
      });
      toast.success("Ticket deleted");
      fetchTickets();
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleUpdate = async (id) => {
    try {
      await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/tickets/${id}`,
        { price: Number(editPrice), quantity: Number(editQty) },
        { headers: { Authorization: `Bearer ${session?.accessToken}`, "x-user-email": session?.user?.email || "", "x-user-role": session?.user?.role || "" } }
      );
      toast.success("Ticket updated");
      setEditingTicket(null);
      fetchTickets();
    } catch {
      toast.error("Update failed");
    }
  };

  if (loading) return <div style={{ display: "flex", justifyContent: "center", paddingTop: "60px" }}><div className="spinner" /></div>;

  return (
    <div>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "800", color: "var(--text-primary)", fontFamily: "Space Grotesk, sans-serif", marginBottom: "6px" }}>My Added Tickets</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>{tickets.length} ticket(s) submitted</p>
      </div>

      {tickets.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 24px", background: "var(--bg-card)", borderRadius: "16px", border: "1px solid var(--border-color)" }}>
          <FaTicketAlt size={48} color="var(--text-muted)" style={{ marginBottom: "16px" }} />
          <h3 style={{ fontSize: "20px", fontWeight: "700", color: "var(--text-primary)", marginBottom: "8px" }}>No tickets added yet</h3>
          <p style={{ color: "var(--text-secondary)" }}>Go to "Add Ticket" to submit your first ticket!</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px" }}>
          {tickets.map((ticket) => {
            const s = statusStyle[ticket.verificationStatus] || statusStyle.pending;
            const isRejected = ticket.verificationStatus === "rejected";
            const isEditing = editingTicket === ticket._id;

            return (
              <div key={ticket._id} className="ticket-card" style={{ overflow: "hidden" }}>
                <div style={{ position: "relative", height: "150px" }}>
                  <img src={ticket.image} alt={ticket.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{ position: "absolute", top: "10px", right: "10px" }}>
                    <span style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color, borderRadius: "6px", padding: "4px 10px", fontSize: "11px", fontWeight: "700", letterSpacing: "0.5px" }}>
                      {ticket.verificationStatus?.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div style={{ padding: "16px" }}>
                  <h3 style={{ fontSize: "15px", fontWeight: "700", color: "var(--text-primary)", fontFamily: "Space Grotesk, sans-serif", marginBottom: "6px", lineHeight: "1.3" }}>{ticket.title}</h3>
                  <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "12px" }}>
                    {ticket.from} → {ticket.to} | {ticket.transportType}
                  </div>

                  {isEditing ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "12px" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                        <div>
                          <label className="form-label" style={{ fontSize: "11px" }}>Price (৳)</label>
                          <input value={editPrice} onChange={e => setEditPrice(e.target.value)} type="number" className="input-field" style={{ fontSize: "13px", padding: "8px 12px" }} />
                        </div>
                        <div>
                          <label className="form-label" style={{ fontSize: "11px" }}>Quantity</label>
                          <input value={editQty} onChange={e => setEditQty(e.target.value)} type="number" className="input-field" style={{ fontSize: "13px", padding: "8px 12px" }} />
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button onClick={() => handleUpdate(ticket._id)} className="btn-success" style={{ flex: 1, fontSize: "13px", padding: "8px" }}>Save</button>
                        <button onClick={() => setEditingTicket(null)} className="btn-outline" style={{ flex: 1, fontSize: "13px", padding: "7px" }}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                      <span style={{ color: "#00d4ff", fontWeight: "800", fontSize: "16px" }}>৳{ticket.price?.toLocaleString()}</span>
                      <span style={{ color: "var(--text-secondary)", fontSize: "13px" }}>{ticket.quantity} seats</span>
                    </div>
                  )}

                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => { setEditingTicket(ticket._id); setEditPrice(ticket.price); setEditQty(ticket.quantity); }}
                      disabled={isRejected || isEditing}
                      style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "9px", borderRadius: "8px", border: "1.5px solid rgba(0,212,255,0.3)", background: "rgba(0,212,255,0.08)", color: "#00d4ff", fontSize: "13px", fontWeight: "600", cursor: isRejected ? "not-allowed" : "pointer", opacity: isRejected ? 0.5 : 1, fontFamily: "Outfit, sans-serif" }}
                    >
                      <FaEdit size={12} /> Update
                    </button>
                    <button
                      onClick={() => handleDelete(ticket._id)}
                      disabled={isRejected}
                      className="btn-danger"
                      style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "9px", fontSize: "13px", opacity: isRejected ? 0.5 : 1, cursor: isRejected ? "not-allowed" : "pointer" }}
                    >
                      <FaTrash size={11} /> Delete
                    </button>
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
