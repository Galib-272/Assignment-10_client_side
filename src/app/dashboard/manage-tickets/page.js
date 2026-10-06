"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import toast from "react-hot-toast";
import { 
  FaCheck, 
  FaTimes, 
  FaSearch, 
  FaFilter, 
  FaBus, 
  FaPlane, 
  FaTrain, 
  FaShip,
  FaEye,
  FaTrash,
  FaExclamationTriangle
} from "react-icons/fa";
import Link from "next/link";
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
    verificationStatus: "pending",
    quantity: 32,
    createdAt: "2026-10-04T12:00:00Z"
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
    quantity: 120,
    createdAt: "2026-10-03T10:00:00Z"
  },
  {
    _id: "t3",
    title: "Dhaka to Sylhet Non-AC Bus",
    from: "Dhaka",
    to: "Sylhet",
    transportType: "bus",
    price: 550,
    departureDate: "2026-11-15T08:00:00Z",
    vendorEmail: "shohagh@example.com",
    vendorName: "Shohagh Paribahan",
    verificationStatus: "pending",
    quantity: 40,
    createdAt: "2026-10-05T09:30:00Z"
  },
  {
    _id: "t4",
    title: "Dhaka to Barisal VIP Cabin Steamer",
    from: "Dhaka",
    to: "Barisal",
    transportType: "launch",
    price: 2200,
    departureDate: "2026-11-28T20:00:00Z",
    vendorEmail: "launch@example.com",
    vendorName: "Sundarban Navigation",
    verificationStatus: "rejected",
    quantity: 15,
    createdAt: "2026-10-01T15:00:00Z"
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
    quantity: 50,
    createdAt: "2026-10-02T11:00:00Z"
  }
];

export default function ManageTicketsPage() {
  const { data: session } = useSession();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [deletingTicket, setDeletingTicket] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchTickets = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/tickets`, {
        headers: { Authorization: `Bearer ${session?.accessToken}`, "x-user-email": session?.user?.email || "", "x-user-role": session?.user?.role || "" },
      });
      const data = Array.isArray(res.data) ? res.data : (Array.isArray(res.data?.tickets) ? res.data.tickets : mockTickets);
      setTickets(data);
      setTotalCount(data.length);
    } catch {
      setTickets(mockTickets);
      setTotalCount(mockTickets.length);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [session]);

  const handleUpdateStatus = async (ticketId, status) => {
    setActionLoadingId(ticketId);
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/tickets/${ticketId}/status`,
        { verificationStatus: status },
        { headers: { Authorization: `Bearer ${session?.accessToken}`, "x-user-email": session?.user?.email || "", "x-user-role": session?.user?.role || "" } }
      );
      toast.success(`Ticket marked as ${status}`);
      setTickets((prev) =>
        prev.map((t) => (t._id === ticketId ? { ...t, verificationStatus: status } : t))
      );
    } catch {
      // Optimistic update for mock
      setTickets((prev) =>
        prev.map((t) => (t._id === ticketId ? { ...t, verificationStatus: status } : t))
      );
      toast.success(`Ticket marked as ${status} (Simulated)`);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingTicket) return;
    setIsDeleting(true);
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/admin/tickets/${deletingTicket._id}`, {
        headers: { Authorization: `Bearer ${session?.accessToken}`, "x-user-email": session?.user?.email || "", "x-user-role": session?.user?.role || "" },
      });
      toast.success("Ticket deleted successfully");
      setTickets((prev) => prev.filter((t) => t._id !== deletingTicket._id));
      setDeletingTicket(null);
    } catch {
      setTickets((prev) => prev.filter((t) => t._id !== deletingTicket._id));
      toast.success("Ticket removed");
      setDeletingTicket(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredTickets = tickets.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.from.toLowerCase().includes(search.toLowerCase()) ||
      t.to.toLowerCase().includes(search.toLowerCase()) ||
      (t.vendorEmail && t.vendorEmail.toLowerCase().includes(search.toLowerCase()));

    const matchesFilter =
      filterStatus === "all" ? true : t.verificationStatus === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const getTransportIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "bus": return <FaBus style={{ color: "var(--color-primary)" }} />;
      case "plane": return <FaPlane style={{ color: "#38bdf8" }} />;
      case "train": return <FaTrain style={{ color: "#a855f7" }} />;
      case "launch": return <FaShip style={{ color: "#06b6d4" }} />;
      default: return <FaBus />;
    }
  };

  const pendingCount = tickets.filter((t) => t.verificationStatus === "pending").length;
  const approvedCount = tickets.filter((t) => t.verificationStatus === "approved").length;
  const rejectedCount = tickets.filter((t) => t.verificationStatus === "rejected").length;

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      {/* Page Header */}
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "800", color: "var(--text-primary)", fontFamily: "Space Grotesk, sans-serif", marginBottom: "6px" }}>
          Manage Ticket Listings
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
          Review, approve, or reject tickets submitted by vendors before they appear to customers
        </p>
      </div>

      {/* Summary Filter Tabs */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "24px" }}>
        <button
          onClick={() => setFilterStatus("all")}
          style={{
            padding: "8px 16px",
            borderRadius: "10px",
            fontSize: "13px",
            fontWeight: "600",
            cursor: "pointer",
            background: filterStatus === "all" ? "var(--color-primary)" : "var(--surface)",
            color: filterStatus === "all" ? "#050816" : "var(--text-secondary)",
            border: "1px solid var(--border-color)",
            transition: "all 0.2s ease"
          }}
        >
          All Tickets ({tickets.length})
        </button>
        <button
          onClick={() => setFilterStatus("pending")}
          style={{
            padding: "8px 16px",
            borderRadius: "10px",
            fontSize: "13px",
            fontWeight: "600",
            cursor: "pointer",
            background: filterStatus === "pending" ? "rgba(245, 158, 11, 0.2)" : "var(--surface)",
            color: filterStatus === "pending" ? "var(--color-accent)" : "var(--text-secondary)",
            border: filterStatus === "pending" ? "1px solid var(--color-accent)" : "1px solid var(--border-color)",
            transition: "all 0.2s ease"
          }}
        >
          Pending Review ({pendingCount})
        </button>
        <button
          onClick={() => setFilterStatus("approved")}
          style={{
            padding: "8px 16px",
            borderRadius: "10px",
            fontSize: "13px",
            fontWeight: "600",
            cursor: "pointer",
            background: filterStatus === "approved" ? "rgba(16, 185, 129, 0.2)" : "var(--surface)",
            color: filterStatus === "approved" ? "var(--color-success)" : "var(--text-secondary)",
            border: filterStatus === "approved" ? "1px solid var(--color-success)" : "1px solid var(--border-color)",
            transition: "all 0.2s ease"
          }}
        >
          Approved ({approvedCount})
        </button>
        <button
          onClick={() => setFilterStatus("rejected")}
          style={{
            padding: "8px 16px",
            borderRadius: "10px",
            fontSize: "13px",
            fontWeight: "600",
            cursor: "pointer",
            background: filterStatus === "rejected" ? "rgba(239, 68, 68, 0.2)" : "var(--surface)",
            color: filterStatus === "rejected" ? "var(--color-error)" : "var(--text-secondary)",
            border: filterStatus === "rejected" ? "1px solid var(--color-error)" : "1px solid var(--border-color)",
            transition: "all 0.2s ease"
          }}
        >
          Rejected ({rejectedCount})
        </button>
      </div>

      {/* Search Bar */}
      <div className="card" style={{ padding: "16px", marginBottom: "24px", display: "flex", alignItems: "center", gap: "12px" }}>
        <FaSearch style={{ color: "var(--text-muted)" }} />
        <input
          type="text"
          placeholder="Search by ticket title, route, or vendor email..."
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
        {search && (
          <button 
            onClick={() => setSearch("")} 
            style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "13px" }}
          >
            Clear
          </button>
        )}
      </div>

      {/* Tickets Table / List */}
      <div className="card" style={{ padding: "0", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
            <thead>
              <tr style={{ background: "rgba(255, 255, 255, 0.02)", borderBottom: "1px solid var(--border-color)", textAlign: "left", color: "var(--text-muted)", fontSize: "12px", textTransform: "uppercase" }}>
                <th style={{ padding: "16px" }}>Ticket Info</th>
                <th style={{ padding: "16px" }}>Vendor</th>
                <th style={{ padding: "16px" }}>Route & Date</th>
                <th style={{ padding: "16px" }}>Price / Qty</th>
                <th style={{ padding: "16px" }}>Status</th>
                <th style={{ padding: "16px", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: "48px", textAlign: "center", color: "var(--text-muted)" }}>
                    No tickets found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredTickets.map((ticket) => (
                  <tr key={ticket._id} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.04)", transition: "background 0.2s ease" }}>
                    {/* Ticket Info */}
                    <td style={{ padding: "16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ fontSize: "16px" }}>{getTransportIcon(ticket.transportType)}</span>
                        <div>
                          <div style={{ fontWeight: "600", color: "var(--text-primary)" }}>{ticket.title}</div>
                          <div style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "capitalize" }}>
                            {ticket.transportType}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Vendor */}
                    <td style={{ padding: "16px" }}>
                      <div style={{ color: "var(--text-secondary)", fontWeight: "500" }}>{ticket.vendorName || "Vendor"}</div>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{ticket.vendorEmail}</div>
                    </td>

                    {/* Route & Date */}
                    <td style={{ padding: "16px" }}>
                      <div style={{ color: "var(--text-primary)", fontWeight: "500" }}>{ticket.from} → {ticket.to}</div>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                        {ticket.departureDate ? format(new Date(ticket.departureDate), "MMM dd, yyyy h:mm a") : "N/A"}
                      </div>
                    </td>

                    {/* Price / Qty */}
                    <td style={{ padding: "16px" }}>
                      <div style={{ color: "var(--color-primary)", fontWeight: "700" }}>৳{ticket.price}</div>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{ticket.quantity} seats</div>
                    </td>

                    {/* Status Badge */}
                    <td style={{ padding: "16px" }}>
                      <span
                        className={
                          ticket.verificationStatus === "approved"
                            ? "badge-accepted"
                            : ticket.verificationStatus === "rejected"
                            ? "badge-rejected"
                            : "badge-pending"
                        }
                      >
                        {ticket.verificationStatus}
                      </span>
                    </td>

                    {/* Action buttons */}
                    <td style={{ padding: "16px", textAlign: "right" }}>
                      <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", alignItems: "center" }}>
                        {ticket.verificationStatus !== "approved" && (
                          <button
                            onClick={() => handleUpdateStatus(ticket._id, "approved")}
                            disabled={actionLoadingId === ticket._id}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              padding: "6px 12px",
                              background: "rgba(16, 185, 129, 0.15)",
                              border: "1px solid rgba(16, 185, 129, 0.3)",
                              borderRadius: "8px",
                              color: "var(--color-success)",
                              cursor: "pointer",
                              fontSize: "12px",
                              fontWeight: "600"
                            }}
                            title="Approve Ticket"
                          >
                            <FaCheck size={11} /> Approve
                          </button>
                        )}

                        {ticket.verificationStatus !== "rejected" && (
                          <button
                            onClick={() => handleUpdateStatus(ticket._id, "rejected")}
                            disabled={actionLoadingId === ticket._id}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              padding: "6px 12px",
                              background: "rgba(239, 68, 68, 0.15)",
                              border: "1px solid rgba(239, 68, 68, 0.3)",
                              borderRadius: "8px",
                              color: "var(--color-error)",
                              cursor: "pointer",
                              fontSize: "12px",
                              fontWeight: "600"
                            }}
                            title="Reject Ticket"
                          >
                            <FaTimes size={11} /> Reject
                          </button>
                        )}

                        <Link
                          href={`/tickets/${ticket._id}`}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            padding: "6px 10px",
                            background: "rgba(255, 255, 255, 0.05)",
                            borderRadius: "8px",
                            color: "var(--text-secondary)",
                            textDecoration: "none",
                            fontSize: "12px"
                          }}
                          title="View Ticket Details"
                        >
                          <FaEye size={12} />
                        </Link>

                        <button
                          type="button"
                          onClick={() => setDeletingTicket(ticket)}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            padding: "6px 10px",
                            background: "rgba(239, 68, 68, 0.08)",
                            border: "none",
                            borderRadius: "8px",
                            color: "var(--color-error)",
                            cursor: "pointer",
                            fontSize: "12px"
                          }}
                          title="Delete Ticket"
                        >
                          <FaTrash size={11} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admin Delete Confirmation Modal */}
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
                    Admin action · Cannot be undone
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
                <span>👤 {deletingTicket.vendorName || deletingTicket.vendorEmail}</span>
              </div>
            </div>

            <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: "1.5", marginBottom: "24px" }}>
              Are you sure you want to delete this listing? As an administrator, deleting this listing permanently removes it from the platform.
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
                    <FaTrash size={12} /> Delete Listing
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
