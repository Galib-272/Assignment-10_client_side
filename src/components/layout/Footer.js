"use client";
import Link from "next/link";
import { FaBus, FaEnvelope, FaPhone, FaFacebook, FaCreditCard, FaStripe } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        background: "var(--bg-surface)",
        borderTop: "1px solid var(--border-color)",
        paddingTop: "64px",
      }}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "48px",
            paddingBottom: "48px",
          }}
        >
          {/* Column 1: Logo + Description */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  background: "linear-gradient(135deg, #00d4ff, #7c3aed)",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FaBus color="#fff" size={18} />
              </div>
              <span
                style={{
                  fontFamily: "Space Grotesk, sans-serif",
                  fontSize: "20px",
                  fontWeight: "800",
                  background: "linear-gradient(135deg, #00d4ff, #7c3aed)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                TicketBari
              </span>
            </div>
            <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: "1.7", marginBottom: "20px" }}>
              Book bus, train, launch & flight tickets easily. Your journey starts here — safe, fast, and hassle-free.
            </p>
            {/* Social links */}
            <div style={{ display: "flex", gap: "10px" }}>
              {[
                { icon: <FaFacebook size={16} />, href: "#" },
                { icon: <FaXTwitter size={16} />, href: "#" },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "8px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid var(--border-color)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--text-secondary)",
                    textDecoration: "none",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(0,212,255,0.1)";
                    e.currentTarget.style.color = "#00d4ff";
                    e.currentTarget.style.borderColor = "rgba(0,212,255,0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                    e.currentTarget.style.color = "var(--text-secondary)";
                    e.currentTarget.style.borderColor = "var(--border-color)";
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 style={{ fontSize: "16px", fontWeight: "700", color: "var(--text-primary)", marginBottom: "20px", fontFamily: "Space Grotesk, sans-serif" }}>
              Quick Links
            </h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                { href: "/", label: "Home" },
                { href: "/tickets", label: "All Tickets" },
                { href: "/contact", label: "Contact Us" },
                { href: "/about", label: "About" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    style={{ color: "var(--text-secondary)", textDecoration: "none", fontSize: "14px", transition: "color 0.2s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#00d4ff")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
                  >
                    → {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h4 style={{ fontSize: "16px", fontWeight: "700", color: "var(--text-primary)", marginBottom: "20px", fontFamily: "Space Grotesk, sans-serif" }}>
              Contact Info
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                { icon: <FaEnvelope size={14} />, text: "support@ticketbari.com" },
                { icon: <FaPhone size={14} />, text: "+880 1700-000000" },
                { icon: <FaFacebook size={14} />, text: "facebook.com/ticketbari" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ color: "var(--color-primary)" }}>{item.icon}</span>
                  <span style={{ color: "var(--text-secondary)", fontSize: "14px" }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Column 4: Payment Methods */}
          <div>
            <h4 style={{ fontSize: "16px", fontWeight: "700", color: "var(--text-primary)", marginBottom: "20px", fontFamily: "Space Grotesk, sans-serif" }}>
              Payment Methods
            </h4>
            <p style={{ color: "var(--text-secondary)", fontSize: "13px", marginBottom: "14px" }}>
              We use industry-leading payment security
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "10px",
                  padding: "10px 14px",
                }}
              >
                <FaStripe size={28} color="#6772e5" />
                <div>
                  <div style={{ color: "var(--text-primary)", fontSize: "13px", fontWeight: "600" }}>Stripe</div>
                  <div style={{ color: "var(--text-muted)", fontSize: "11px" }}>Secure Payment</div>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "10px",
                  padding: "10px 14px",
                }}
              >
                <FaCreditCard size={22} color="#00d4ff" />
                <div>
                  <div style={{ color: "var(--text-primary)", fontSize: "13px", fontWeight: "600" }}>Credit / Debit</div>
                  <div style={{ color: "var(--text-muted)", fontSize: "11px" }}>Visa, Mastercard</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: "1px solid var(--border-color)",
            padding: "20px 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>
            © {currentYear} TicketBari. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: "20px" }}>
            {["Privacy Policy", "Terms of Service"].map((t) => (
              <Link key={t} href="#" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: "13px", transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#00d4ff")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
              >
                {t}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
