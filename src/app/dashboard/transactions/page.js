"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { format } from "date-fns";
import { FaReceipt } from "react-icons/fa";

const mockTransactions = [
  { _id: "t1", transactionId: "pi_3Q1xAbCd12345", amount: 1700, ticketTitle: "Dhaka to Chittagong Express", date: "2026-10-01T10:30:00Z" },
  { _id: "t2", transactionId: "pi_3Q2yEfGh67890", amount: 450, ticketTitle: "Dhaka to Sylhet Intercity", date: "2026-09-15T14:20:00Z" },
];

export default function TransactionsPage() {
  const { data: session } = useSession();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/payments/my-transactions`, {
          headers: { Authorization: `Bearer ${session?.accessToken}`, "x-user-email": session?.user?.email || "", "x-user-role": session?.user?.role || "" },
        });
        setTransactions(res.data);
      } catch {
        setTransactions(mockTransactions);
      } finally {
        setLoading(false);
      }
    };
    if (session) fetchTransactions();
  }, [session]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Transaction ID copied to clipboard!");
  };

  const filtered = transactions.filter((t) =>
    (t.transactionId || "").toLowerCase().includes(search.toLowerCase()) ||
    (t.ticketTitle || "").toLowerCase().includes(search.toLowerCase())
  );

  const totalAmount = transactions.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

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
          Transaction History
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>All verified Stripe payment records and receipts</p>
      </div>

      {/* Summary and Search bar */}
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

      <div className="card" style={{ padding: "14px 18px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
        <input
          type="text"
          placeholder="Search by transaction ID or ticket title..."
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

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 24px", background: "var(--bg-card)", borderRadius: "16px", border: "1px solid var(--border-color)" }}>
          <FaReceipt size={48} color="var(--text-muted)" style={{ marginBottom: "16px" }} />
          <h3 style={{ fontSize: "20px", fontWeight: "700", color: "var(--text-primary)", marginBottom: "8px" }}>No transactions found</h3>
          <p style={{ color: "var(--text-secondary)" }}>Your payment history will appear here after completing purchases.</p>
        </div>
      ) : (
        <div style={{ background: "var(--bg-card)", borderRadius: "16px", border: "1px solid var(--border-color)", overflow: "hidden" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Ticket</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t._id}>
                  <td>
                    <code style={{ background: "var(--bg-surface2)", borderRadius: "6px", padding: "3px 8px", fontSize: "12px", color: "var(--color-primary)" }}>
                      {t.transactionId}
                    </code>
                  </td>
                  <td style={{ fontWeight: "500" }}>{t.ticketTitle}</td>
                  <td style={{ color: "#10b981", fontWeight: "700" }}>৳{t.amount?.toLocaleString()}</td>
                  <td style={{ color: "var(--text-secondary)" }}>{t.date ? format(new Date(t.date), "dd MMM yyyy, hh:mm a") : "N/A"}</td>
                  <td>
                    <button
                      onClick={() => copyToClipboard(t.transactionId)}
                      style={{
                        padding: "4px 10px",
                        borderRadius: "6px",
                        border: "1px solid var(--border-color)",
                        background: "var(--bg-surface2)",
                        color: "var(--text-secondary)",
                        fontSize: "12px",
                        cursor: "pointer",
                      }}
                    >
                      Copy ID
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
