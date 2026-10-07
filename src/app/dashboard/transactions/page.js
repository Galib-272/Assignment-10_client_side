"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { format } from "date-fns";
import { FaReceipt, FaCopy, FaCheck } from "react-icons/fa";
import toast from "react-hot-toast";

export default function TransactionsPage() {
  const { data: session } = useSession();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    // Clear out any old local duplicate records
    try {
      localStorage.removeItem("recent_transactions");
    } catch (e) {}

    const fetchTransactions = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/payments/my-transactions`, {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
            "x-user-email": session?.user?.email || "",
            "x-user-role": session?.user?.role || "",
            "x-user-name": session?.user?.name || "",
          },
        });

        const serverTx = Array.isArray(res.data) ? res.data : [];

        // Deduplicate records strictly by bookingId or transactionId
        const map = new Map();
        serverTx.forEach((item) => {
          const key = item.bookingId || item.transactionId || item._id;
          if (!map.has(key)) {
            map.set(key, item);
          }
        });

        const combined = Array.from(map.values()).sort(
          (a, b) => new Date(b.date || b.createdAt || 0) - new Date(a.date || a.createdAt || 0)
        );

        setTransactions(combined);
      } catch (err) {
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    if (session) fetchTransactions();
  }, [session]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    toast.success("Transaction ID copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filtered = transactions.filter((t) =>
    (t.transactionId || "").toLowerCase().includes(search.toLowerCase()) ||
    (t.ticketTitle || "").toLowerCase().includes(search.toLowerCase()) ||
    (t.userEmail || "").toLowerCase().includes(search.toLowerCase())
  );

  const totalAmount = transactions.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", paddingTop: "60px" }}>
        <div className="spinner" />
      </div>
    );
  }

  const role = session?.user?.role || "user";
  const roleTitle = role === "admin" ? "All System Transactions" : role === "vendor" ? "Vendor Sales Transactions" : "My Transactions";

  return (
    <div>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "800", color: "var(--text-primary)", fontFamily: "Space Grotesk, sans-serif", marginBottom: "6px" }}>
          {roleTitle}
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
          Real-time verified payment records and receipts ({transactions.length} total)
        </p>
      </div>

      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "24px" }}>
        <div className="card" style={{ padding: "18px" }}>
          <div style={{ color: "var(--text-muted)", fontSize: "12px", textTransform: "uppercase", fontWeight: "600", marginBottom: "4px" }}>Total Volume</div>
          <div style={{ fontSize: "24px", fontWeight: "800", color: "#10b981", fontFamily: "Space Grotesk, sans-serif" }}>৳{totalAmount.toLocaleString()}</div>
        </div>
        <div className="card" style={{ padding: "18px" }}>
          <div style={{ color: "var(--text-muted)", fontSize: "12px", textTransform: "uppercase", fontWeight: "600", marginBottom: "4px" }}>Total Records</div>
          <div style={{ fontSize: "24px", fontWeight: "800", color: "#00d4ff", fontFamily: "Space Grotesk, sans-serif" }}>{transactions.length}</div>
        </div>
      </div>

      {/* Search Input */}
      <div className="card" style={{ padding: "14px 18px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
        <input
          type="text"
          placeholder="Search by transaction ID, ticket title or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ background: "transparent", border: "none", color: "var(--text-primary)", fontSize: "14px", width: "100%", outline: "none" }}
        />
        {search && (
          <button onClick={() => setSearch("")} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "13px" }}>
            Clear
          </button>
        )}
      </div>

      {/* Transactions Table or Empty State */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 24px", background: "var(--bg-card)", borderRadius: "16px", border: "1px solid var(--border-color)" }}>
          <FaReceipt size={48} color="var(--text-muted)" style={{ marginBottom: "16px" }} />
          <h3 style={{ fontSize: "20px", fontWeight: "700", color: "var(--text-primary)", marginBottom: "8px" }}>No transactions found</h3>
          <p style={{ color: "var(--text-secondary)" }}>Your payment records will appear here as tickets are paid.</p>
        </div>
      ) : (
        <div style={{ background: "var(--bg-card)", borderRadius: "16px", border: "1px solid var(--border-color)", overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table className="data-table" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Ticket</th>
                  {role === "admin" && <th>Customer</th>}
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => (
                  <tr key={t._id || t.transactionId}>
                    <td>
                      <code style={{ background: "var(--bg-surface2)", borderRadius: "6px", padding: "4px 8px", fontSize: "12px", color: "var(--color-primary)", fontWeight: "600" }}>
                        {t.transactionId}
                      </code>
                    </td>
                    <td style={{ fontWeight: "600", color: "var(--text-primary)" }}>{t.ticketTitle || "Ticket Booking"}</td>
                    {role === "admin" && (
                      <td style={{ color: "var(--text-secondary)", fontSize: "13px" }}>{t.userEmail || "Customer"}</td>
                    )}
                    <td style={{ color: "#10b981", fontWeight: "700", fontSize: "14px" }}>৳{Number(t.amount || 0).toLocaleString()}</td>
                    <td>
                      <span className="badge badge-paid" style={{ fontSize: "11px", padding: "3px 8px" }}>
                        {t.status || "PAID"}
                      </span>
                    </td>
                    <td style={{ color: "var(--text-secondary)", fontSize: "13px" }}>
                      {t.date || t.createdAt ? format(new Date(t.date || t.createdAt), "dd MMM yyyy, hh:mm a") : "Recent"}
                    </td>
                    <td>
                      <button
                        onClick={() => copyToClipboard(t.transactionId)}
                        title="Copy Transaction ID"
                        style={{
                          padding: "6px 12px",
                          borderRadius: "6px",
                          border: "1px solid var(--border-color)",
                          background: "var(--bg-surface2)",
                          color: copiedId === t.transactionId ? "#10b981" : "var(--text-secondary)",
                          fontSize: "12px",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          transition: "all 0.2s",
                        }}
                      >
                        {copiedId === t.transactionId ? <FaCheck size={11} color="#10b981" /> : <FaCopy size={11} />}
                        <span>{copiedId === t.transactionId ? "Copied" : "Copy"}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
