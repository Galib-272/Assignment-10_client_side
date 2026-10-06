"use client";
import { FaShieldAlt, FaBolt, FaHeadset, FaMobileAlt, FaTag, FaCheckCircle } from "react-icons/fa";

const features = [
  { icon: <FaBolt size={24} />, title: "Instant Booking", desc: "Book tickets in seconds with our streamlined checkout process. No waiting, no hassle.", color: "#00d4ff" },
  { icon: <FaShieldAlt size={24} />, title: "100% Secure", desc: "All transactions are protected with industry-leading Stripe encryption and SSL.", color: "#7c3aed" },
  { icon: <FaTag size={24} />, title: "Best Prices", desc: "We compare prices from multiple vendors to ensure you always get the best deal.", color: "#f59e0b" },
  { icon: <FaHeadset size={24} />, title: "24/7 Support", desc: "Our dedicated support team is available round the clock to assist you.", color: "#10b981" },
  { icon: <FaMobileAlt size={24} />, title: "Mobile Friendly", desc: "Book on any device — our platform is fully responsive and optimized for mobile.", color: "#ef4444" },
  { icon: <FaCheckCircle size={24} />, title: "Verified Vendors", desc: "All vendors are verified by our admin team to ensure quality and reliability.", color: "#00d4ff" },
];

export default function WhyChooseUs() {
  return (
    <section style={{ padding: "80px 24px", background: "var(--bg-primary)", position: "relative", overflow: "hidden" }}>
      {/* Grid lines background */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.025,
        backgroundImage: "linear-gradient(rgba(0,212,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.8) 1px, transparent 1px)",
        backgroundSize: "80px 80px",
        pointerEvents: "none",
      }} />
      <div className="bg-glow" style={{ width: "600px", height: "600px", background: "rgba(124,58,237,0.05)", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />

      <div style={{ maxWidth: "1280px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <span style={{
            display: "inline-block",
            background: "rgba(124,58,237,0.1)",
            border: "1px solid rgba(124,58,237,0.3)",
            color: "#7c3aed",
            borderRadius: "50px",
            padding: "6px 18px",
            fontSize: "13px",
            fontWeight: "700",
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            marginBottom: "16px",
          }}>
            Why TicketBari?
          </span>
          <h2 className="section-title" style={{ marginBottom: "16px" }}>
            The Smarter Way to{" "}
            <span style={{
              background: "linear-gradient(135deg, #7c3aed, #00d4ff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              Travel
            </span>
          </h2>
          <p className="section-subtitle" style={{ maxWidth: "520px", margin: "0 auto" }}>
            We built TicketBari with a focus on simplicity, security, and savings — so every journey is stress-free
          </p>
        </div>

        {/* Features grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
          {features.map((feat, i) => (
            <div
              key={i}
              className="stat-card"
              style={{
                cursor: "default",
                background: `linear-gradient(135deg, rgba(${feat.color === "#00d4ff" ? "0,212,255" : feat.color === "#7c3aed" ? "124,58,237" : feat.color === "#f59e0b" ? "245,158,11" : feat.color === "#10b981" ? "16,185,129" : "239,68,68"},0.05) 0%, var(--bg-card) 100%)`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.borderColor = `${feat.color}44`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "var(--border-color)";
              }}
            >
              <div style={{
                width: "52px", height: "52px",
                background: `rgba(${feat.color === "#00d4ff" ? "0,212,255" : feat.color === "#7c3aed" ? "124,58,237" : feat.color === "#f59e0b" ? "245,158,11" : feat.color === "#10b981" ? "16,185,129" : "239,68,68"},0.12)`,
                border: `1px solid ${feat.color}33`,
                borderRadius: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: feat.color,
                marginBottom: "16px",
              }}>
                {feat.icon}
              </div>
              <h3 style={{ fontSize: "18px", fontWeight: "700", color: "var(--text-primary)", marginBottom: "8px", fontFamily: "Space Grotesk, sans-serif" }}>
                {feat.title}
              </h3>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: "1.6" }}>
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
