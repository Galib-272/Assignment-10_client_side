"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FaCheckCircle, FaTicketAlt, FaArrowRight } from "react-icons/fa";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <div style={{
      maxWidth: "550px",
      margin: "40px auto",
      textAlign: "center",
      padding: "40px 24px"
    }}>
      <div className="card" style={{ padding: "40px 32px", position: "relative" }}>
        <div style={{
          width: "72px",
          height: "72px",
          borderRadius: "50%",
          background: "rgba(16, 185, 129, 0.15)",
          color: "var(--color-success)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "36px",
          margin: "0 auto 24px"
        }}>
          <FaCheckCircle />
        </div>

        <h1 style={{ fontSize: "26px", fontWeight: "800", color: "var(--text-primary)", fontFamily: "Space Grotesk, sans-serif", marginBottom: "12px" }}>
          Payment Successful!
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "15px", lineHeight: "1.6", marginBottom: "28px" }}>
          Your payment has been processed securely via Stripe. Your tickets are now confirmed and ready for your upcoming journey.
        </p>

        {sessionId && (
          <div style={{
            background: "var(--surface-2)",
            borderRadius: "10px",
            padding: "12px 16px",
            fontSize: "12px",
            color: "var(--text-muted)",
            marginBottom: "28px",
            fontFamily: "monospace"
          }}>
            Ref: {sessionId}
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <Link
            href="/dashboard/my-bookings"
            className="btn btn-primary"
            style={{ width: "100%", justifyContent: "center", gap: "8px" }}
          >
            <FaTicketAlt /> View My Bookings
          </Link>
          <Link
            href="/tickets"
            style={{
              padding: "12px",
              color: "var(--text-secondary)",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: "600"
            }}
          >
            Book Another Journey →
          </Link>
        </div>
      </div>
    </div>
  );
}
