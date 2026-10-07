"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaCheck, FaTimes, FaClipboardList } from "react-icons/fa";

const mockRequests = [
  { _id: "r1", userId: { name: "Rahim Uddin", email: "rahim@email.com" }, ticketId: { title: "Dhaka to Chittagong", price: 850 }, quantity: 2, status: "pending" },
  { _id: "r2", userId: { name: "Karim Hossain", email: "karim@email.com" }, ticketId: { title: "Dhaka to Sylhet", price: 450 }, quantity: 3, status: "pending" },
  { _id: "r3", userId: { name: "Fatima Begum", email: "fatima@email.com" }, ticketId: { title: "Dhaka to Cox's Bazar", price: 1200 }, quantity: 1, status: "accepted" },
];

export default function RequestedBookingsPage() {
  const { data: session } = useSession();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/bookings/vendor`, {
        headers: { Authorization: `Bearer ${session?.accessToken}`, "x-user-email": session?.user?.email || "", "x-user-role": session?.user?.role || "" },
      });
      setRequests(res.data);
    } catch {
      setRequests(mockRequests);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (session) fetchRequests(); }, [session]);

  const handleAction = async (id, action) => {
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/bookings/${id}/status`,
        { status: action },
        { headers: { Authorization: `Bearer ${session?.accessToken}`, "x-user-email": session?.user?.email || "", "x-user-role": session?.user?.role || "" } }
      );
      toast.success(`Booking ${action}`);
      fetchRequests();
    } catch {
      toast.error("Action failed");
    }
  };

  if (loading) return <div style={{ display: "flex", justifyContent: "center", paddingTop: "60px" }}><div className="spinner" /></div>;

  return (
    <div>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "800", color: "var(--text-primary)", fontFamily: "Space Grotesk, sans-serif", marginBottom: "6px" }}>
          Requested Bookings
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>Manage booking requests from users</p>
      </div>

      {requests.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 24px", background: "var(--bg-card)", borderRadius: "16px", border: "1px solid var(--border-color)" }}>
          <FaClipboardList size={48} color="var(--text-muted)" style={{ marginBottom: "16px" }} />
          <h3 style={{ fontSize: "20px", fontWeight: "700", color: "var(--text-primary)", marginBottom: "8px" }}>No booking requests</h3>
          <p style={{ color: "var(--text-secondary)" }}>Users haven't requested any bookings yet.</p>
        </div>
      ) : (
        <div style={{ background: "var(--bg-card)", borderRadius: "16px", border: "1px solid var(--border-color)", overflow: "hidden" }}>
          <div className="table-responsive-wrapper">
            <table className="data-table" style={{ width: "100%", minWidth: "660px" }}>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Ticket</th>
                  <th>Qty</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => {
                  const total = req.ticketId?.price * req.quantity;
                  return (
                    <tr key={req._id}>
                      <td>
                        <div style={{ fontWeight: "600", color: "var(--text-primary)" }}>{req.userId?.name}</div>
                        <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{req.userId?.email}</div>
                      </td>
                      <td style={{ fontWeight: "500", maxWidth: "200px" }}>{req.ticketId?.title}</td>
                      <td style={{ fontWeight: "700" }}>{req.quantity}</td>
                      <td style={{ color: "#00d4ff", fontWeight: "700" }}>৳{total?.toLocaleString()}</td>
                      <td>
                        <span className={`badge ${req.status === "accepted" ? "badge-accepted" : req.status === "rejected" ? "badge-rejected" : "badge-pending"}`}>
                          {req.status}
                        </span>
                      </td>
                      <td>
                        {req.status === "pending" && (
                          <div style={{ display: "flex", gap: "8px", whiteSpace: "nowrap" }}>
                            <button onClick={() => handleAction(req._id, "accepted")} className="btn-success" style={{ display: "flex", alignItems: "center", gap: "5px", padding: "7px 14px", fontSize: "12px" }}>
                              <FaCheck size={11} /> Accept
                            </button>
                            <button onClick={() => handleAction(req._id, "rejected")} className="btn-danger" style={{ display: "flex", alignItems: "center", gap: "5px", padding: "7px 14px", fontSize: "12px" }}>
                              <FaTimes size={11} /> Reject
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
