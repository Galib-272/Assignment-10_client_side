"use client";
import Link from "next/link";
import { FaHome, FaCompass } from "react-icons/fa";

export default function NotFound() {
  return (
    <div style={{
      minHeight: "75vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 20px",
      textAlign: "center"
    }}>
      <div style={{ maxWidth: "560px" }}>
        {/* Glow & 404 number */}
        <div style={{ position: "relative", marginBottom: "24px" }}>
          <div style={{
            fontSize: "120px",
            fontWeight: "900",
            fontFamily: "Space Grotesk, sans-serif",
            lineHeight: 1,
            background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "-4px"
          }}>
            404
          </div>
          <div style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "180px",
            height: "180px",
            background: "radial-gradient(circle, rgba(0,212,255,0.2) 0%, rgba(0,0,0,0) 70%)",
            pointerEvents: "none",
            filter: "blur(20px)"
          }} />
        </div>

        <h1 style={{ fontSize: "28px", fontWeight: "800", color: "var(--text-primary)", fontFamily: "Space Grotesk, sans-serif", marginBottom: "14px" }}>
          Lost in Transit?
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "16px", lineHeight: "1.6", marginBottom: "32px" }}>
          We couldn&apos;t find the route or page you are looking for. It might have departed, been rescheduled, or never existed in our schedule.
        </p>

        <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/"
            className="btn btn-primary"
            style={{ padding: "12px 24px", gap: "8px", textDecoration: "none" }}
          >
            <FaHome /> Return Home
          </Link>
          <Link
            href="/tickets"
            className="btn btn-outline"
            style={{ padding: "12px 24px", gap: "8px", textDecoration: "none" }}
          >
            <FaCompass /> Explore Tickets
          </Link>
        </div>
      </div>
    </div>
  );
}
