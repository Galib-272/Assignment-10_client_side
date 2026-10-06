"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaEdit, FaTrash, FaTicketAlt, FaSync, FaExclamationTriangle, FaTimes } from "react-icons/fa";

const STATUS_FILTERS = ["all", "approved", "pending", "rejected"];

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
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingTicket, setEditingTicket] = useState(null);
  const [editPrice, setEditPrice] = useState("");
  const [editQty, setEditQty] = useState("");
  const [deletingTicket, setDeletingTicket] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredTickets = statusFilter === "all"
    ? tickets
    : tickets.filter((t) => t.verificationStatus === statusFilter);

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

  const handleConfirmDelete = async () => {
    if (!deletingTicket) return;
    setIsDeleting(true);
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/tickets/${deletingTicket._id}`, {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
          "x-user-email": session?.user?.email || "",
          "x-user-role": session?.user?.role || "vendor",
        },
      });
      toast.success("Ticket deleted successfully");
      setDeletingTicket(null);
      fetchTickets();
    } catch (err) {
      const msg = err.response?.data?.message || "Delete failed";
      toast.error(msg);
    } finally {
      setIsDeleting(false);
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
      <div style={{ marginBottom: "24px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: "800", color: "var(--text-primary)", fontFamily: "Space Grotesk, sans-serif", marginBottom: "6px" }}>My Added Tickets</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>{tickets.length} ticket(s) submitted · {filteredTickets.length} shown</p>
        </div>
        <button onClick={fetchTickets} className="btn-outline" style={{ display: "flex", alignItems: "center", gap: "8px", padding: "9px 20px", fontSize: "13px" }}>
          <FaSync size={12} /> Refresh
        </button>
      </div>

      {/* Status filter tabs */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
        {STATUS_FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setStatusFilter(f)}
            style={{
              padding: "7px 18px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer", border: "1.5px solid",
              fontFamily: "Outfit, sans-serif", transition: "all 0.2s",
              background: statusFilter === f ? "rgba(0,212,255,0.15)" : "transparent",
              borderColor: statusFilter === f ? "rgba(0,212,255,0.4)" : "var(--border-color)",
              color: statusFilter === f ? "#00d4ff" : "var(--text-secondary)",
            }}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {filteredTickets.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 24px", background: "var(--bg-card)", borderRadius: "16px", border: "1px solid var(--border-color)" }}>
          <FaTicketAlt size={48} color="var(--text-muted)" style={{ marginBottom: "16px" }} />
          <h3 style={{ fontSize: "20px", fontWeight: "700", color: "var(--text-primary)", marginBottom: "8px" }}>
            {tickets.length === 0 ? "No tickets added yet" : `No ${statusFilter} tickets`}
          </h3>
          <p style={{ color: "var(--text-secondary)" }}>
            {tickets.length === 0 ? "Go to \"Add Ticket\" to submit your first ticket!" : "Try a different filter above."}
          </p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px" }}>
          {filteredTickets.map((ticket) => {
            const s = statusStyle[ticket.verificationStatus] || statusStyle.pending;
            const isRejected = ticket.verificationStatus === "rejected";
            const isEditing = editingTicket === ticket._id;

            return (
              <div key={ticket._id} className="ticket-card" style={{ overflow: "hidden" }}>
                <div style={{ position: "relative", height: "150px" }}>
                  <img
                    src={ticket.image}
                    alt={ticket.title}
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1568514328861-5465017e40fc?q=80&w=800&auto=format&fit=crop";
                    }}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
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
                      onClick={() => setDeletingTicket(ticket)}
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

      {/* Delete Confirmation Modal */}
      {deletingTicket && (
        <div
          className="modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget && !isDeleting) {
              setDeletingTicket(null);
            }
          }}
        >
          <div className="modal-box" style={{ maxWidth: "460px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "12px",
                    background: "rgba(239,68,68,0.15)",
                    border: "1px solid rgba(239,68,68,0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ef4444",
                    flexShrink: 0,
                  }}
                >
                  <FaExclamationTriangle size={20} />
                </div>
                <div>
                  <h3
                    style={{
                      fontSize: "18px",
                      fontWeight: "800",
                      color: "var(--text-primary)",
                      fontFamily: "Space Grotesk, sans-serif",
                      margin: 0,
                    }}
                  >
                    Delete Ticket Listing?
                  </h3>
                  <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                    This action cannot be undone
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => !isDeleting && setDeletingTicket(null)}
                disabled={isDeleting}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--text-muted)",
                  cursor: isDeleting ? "not-allowed" : "pointer",
                  fontSize: "16px",
                  padding: "4px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <FaTimes />
              </button>
            </div>

            {/* Ticket Summary Box */}
            <div
              style={{
                background: "var(--bg-surface2)",
                border: "1px solid var(--border-color)",
                borderRadius: "12px",
                padding: "14px 16px",
                marginBottom: "20px",
              }}
            >
              <div style={{ fontWeight: "700", color: "var(--text-primary)", fontSize: "15px", marginBottom: "6px" }}>
                {deletingTicket.title}
              </div>
              <div style={{ fontSize: "13px", color: "var(--text-secondary)", display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <span>📍 {deletingTicket.from} → {deletingTicket.to}</span>
                <span>🏷️ ৳{deletingTicket.price?.toLocaleString()}</span>
                <span>💺 {deletingTicket.quantity} seats</span>
              </div>
            </div>

            <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: "1.5", marginBottom: "24px" }}>
              Are you sure you want to permanently delete this ticket listing? It will be removed from customer search, homepage showcases, and all active listings.
            </p>

            <div style={{ display: "flex", gap: "12px" }}>
              <button
                type="button"
                onClick={() => setDeletingTicket(null)}
                disabled={isDeleting}
                className="btn-outline"
                style={{ flex: 1, padding: "10px", fontSize: "14px" }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="btn-danger"
                style={{
                  flex: 1,
                  padding: "10px",
                  fontSize: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                {isDeleting ? (
                  <>
                    <div className="spinner" style={{ width: "16px", height: "16px", borderWidth: "2px" }} />
                    Deleting...
                  </>
                ) : (
                  <>
                    <FaTrash size={12} /> Delete Permanently
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
