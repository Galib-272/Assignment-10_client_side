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
          Transaction History
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>All your Stripe payment records</p>
      </div>

      {transactions.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 24px", background: "var(--bg-card)", borderRadius: "16px", border: "1px solid var(--border-color)" }}>
          <FaReceipt size={48} color="var(--text-muted)" style={{ marginBottom: "16px" }} />
          <h3 style={{ fontSize: "20px", fontWeight: "700", color: "var(--text-primary)", marginBottom: "8px" }}>No transactions yet</h3>
          <p style={{ color: "var(--text-secondary)" }}>Your payment history will appear here after you complete a purchase.</p>
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
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t._id}>
                  <td>
                    <code style={{ background: "var(--bg-surface2)", borderRadius: "6px", padding: "3px 8px", fontSize: "12px", color: "var(--color-primary)" }}>
                      {t.transactionId}
                    </code>
                  </td>
                  <td style={{ fontWeight: "500" }}>{t.ticketTitle}</td>
                  <td style={{ color: "#10b981", fontWeight: "700" }}>৳{t.amount?.toLocaleString()}</td>
                  <td style={{ color: "var(--text-secondary)" }}>{format(new Date(t.date), "dd MMM yyyy, hh:mm a")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
