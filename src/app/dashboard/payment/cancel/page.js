"use client";
import Link from "next/link";
import { FaTimesCircle, FaArrowLeft } from "react-icons/fa";

export default function PaymentCancelPage() {
  return (
    <div style={{
      maxWidth: "550px",
      margin: "40px auto",
      textAlign: "center",
      padding: "40px 24px"
    }}>
      <div className="card" style={{ padding: "40px 32px" }}>
        <div style={{
          width: "72px",
          height: "72px",
          borderRadius: "50%",
          background: "rgba(239, 68, 68, 0.15)",
          color: "var(--color-error)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "36px",
          margin: "0 auto 24px"
        }}>
          <FaTimesCircle />
        </div>

        <h1 style={{ fontSize: "26px", fontWeight: "800", color: "var(--text-primary)", fontFamily: "Space Grotesk, sans-serif", marginBottom: "12px" }}>
          Payment Cancelled
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "15px", lineHeight: "1.6", marginBottom: "28px" }}>
          You have cancelled the Stripe checkout session. No funds were debited. You can retry paying whenever you are ready.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <Link
            href="/dashboard/my-bookings"
            className="btn btn-primary"
            style={{ width: "100%", justifyContent: "center", gap: "8px" }}
          >
            <FaArrowLeft /> Back to My Bookings
          </Link>
        </div>
      </div>
    </div>
  );
}
