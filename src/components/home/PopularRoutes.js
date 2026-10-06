"use client";
import { FaRoute, FaArrowRight } from "react-icons/fa";

const routes = [
  { from: "Dhaka", to: "Chittagong", trips: "48 daily trips", price: "from ৳350", color: "#00d4ff" },
  { from: "Dhaka", to: "Cox's Bazar", trips: "22 daily trips", price: "from ৳650", color: "#7c3aed" },
  { from: "Dhaka", to: "Sylhet", trips: "35 daily trips", price: "from ৳280", color: "#f59e0b" },
  { from: "Dhaka", to: "Rajshahi", trips: "18 daily trips", price: "from ৳490", color: "#10b981" },
  { from: "Dhaka", to: "Barishal", trips: "12 daily trips", price: "from ৳320", color: "#ef4444" },
  { from: "Chittagong", to: "Cox's Bazar", trips: "30 daily trips", price: "from ৳280", color: "#00d4ff" },
];

export default function PopularRoutes() {
  return (
    <section style={{ padding: "80px 24px", background: "var(--bg-surface)", position: "relative", overflow: "hidden" }}>
      <div className="bg-glow" style={{ width: "500px", height: "500px", background: "rgba(0,212,255,0.05)", top: "0", left: "50%", transform: "translateX(-50%)" }} />

      <div style={{ maxWidth: "1280px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "52px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "14px" }}>
            <div style={{ width: "36px", height: "36px", background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.25)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <FaRoute size={16} color="#00d4ff" />
            </div>
            <span style={{ fontSize: "13px", fontWeight: "700", color: "#00d4ff", letterSpacing: "1.5px", textTransform: "uppercase" }}>
              Top Destinations
            </span>
          </div>
          <h2 className="section-title" style={{ marginBottom: "12px" }}>
            <span className="gradient-text">Popular</span> Routes
          </h2>
          <p className="section-subtitle" style={{ maxWidth: "480px", margin: "0 auto" }}>
            The most traveled routes in Bangladesh — pick yours and book instantly
          </p>
        </div>

        {/* Route cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
          {routes.map((route, i) => (
            <div
              key={i}
              className="ticket-card"
              style={{
                padding: "24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
                background: `linear-gradient(135deg, rgba(${route.color === "#00d4ff" ? "0,212,255" : route.color === "#7c3aed" ? "124,58,237" : route.color === "#f59e0b" ? "245,158,11" : route.color === "#10b981" ? "16,185,129" : "239,68,68"},0.06) 0%, var(--bg-card) 100%)`,
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                  <span style={{ fontSize: "16px", fontWeight: "800", color: "var(--text-primary)", fontFamily: "Space Grotesk, sans-serif" }}>
                    {route.from}
                  </span>
                  <FaArrowRight size={12} color={route.color} />
                  <span style={{ fontSize: "16px", fontWeight: "800", color: "var(--text-primary)", fontFamily: "Space Grotesk, sans-serif" }}>
                    {route.to}
                  </span>
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "4px" }}>{route.trips}</div>
                <div style={{ fontSize: "14px", fontWeight: "700", color: route.color }}>{route.price}</div>
              </div>
              <div style={{
                width: "40px", height: "40px",
                background: `rgba(${route.color === "#00d4ff" ? "0,212,255" : route.color === "#7c3aed" ? "124,58,237" : route.color === "#f59e0b" ? "245,158,11" : route.color === "#10b981" ? "16,185,129" : "239,68,68"},0.12)`,
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}>
                <FaRoute size={18} color={route.color} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
