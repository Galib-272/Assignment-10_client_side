"use client";
import { useSession } from "next-auth/react";
import { FaEnvelope, FaUserShield, FaCalendarAlt } from "react-icons/fa";

export default function ProfilePage() {
  const { data: session } = useSession();
  const user = session?.user;

  const roleColor = user?.role === "admin" ? "#f59e0b" : user?.role === "vendor" ? "#7c3aed" : "#00d4ff";
  const roleLabel = user?.role === "admin" ? "Administrator" : user?.role === "vendor" ? "Ticket Vendor" : "Traveler";

  return (
    <div>
      {/* Page header */}
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "800", color: "var(--text-primary)", fontFamily: "Space Grotesk, sans-serif", marginBottom: "6px" }}>
          My Profile
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>Manage your account information</p>
      </div>

      {/* Profile card */}
      <div style={{ maxWidth: "700px" }}>
        <div className="glass-card" style={{ padding: "0", overflow: "hidden" }}>
          {/* Banner */}
          <div style={{ height: "140px", background: `linear-gradient(135deg, rgba(${user?.role === "admin" ? "245,158,11" : user?.role === "vendor" ? "124,58,237" : "0,212,255"},0.2), rgba(5,8,26,0.8))`, position: "relative" }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 30% 50%, rgba(255,255,255,0.03) 0%, transparent 60%)" }} />
          </div>

          {/* Avatar + Info */}
          <div style={{ padding: "0 32px 32px", position: "relative" }}>
            <div style={{ position: "relative", display: "inline-block", marginTop: "-50px", marginBottom: "16px" }}>
              <img
                src={user?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "U")}&background=00d4ff&color=fff&size=100`}
                alt={user?.name}
                style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover", border: `3px solid ${roleColor}`, boxShadow: `0 0 20px ${roleColor}44` }}
              />
              <div style={{ position: "absolute", bottom: "4px", right: "4px", width: "18px", height: "18px", background: "#10b981", borderRadius: "50%", border: "2px solid var(--bg-surface)" }} />
            </div>

            <h2 style={{ fontSize: "24px", fontWeight: "800", color: "var(--text-primary)", fontFamily: "Space Grotesk, sans-serif", marginBottom: "6px" }}>
              {user?.name}
            </h2>
            <span style={{ display: "inline-block", background: `rgba(${user?.role === "admin" ? "245,158,11" : user?.role === "vendor" ? "124,58,237" : "0,212,255"},0.12)`, border: `1px solid ${roleColor}44`, color: roleColor, borderRadius: "6px", padding: "4px 12px", fontSize: "12px", fontWeight: "700", letterSpacing: "0.5px", marginBottom: "24px" }}>
              {roleLabel}
            </span>

            <div className="divider" />

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
              {[
                { icon: <FaEnvelope size={16} color={roleColor} />, label: "Email Address", value: user?.email },
                { icon: <FaUserShield size={16} color={roleColor} />, label: "Account Role", value: roleLabel },
                { icon: <FaCalendarAlt size={16} color={roleColor} />, label: "Member Since", value: new Date().getFullYear() },
              ].map((item) => (
                <div key={item.label} style={{ background: "var(--bg-surface2)", borderRadius: "12px", padding: "16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                    {item.icon}
                    <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" }}>{item.label}</span>
                  </div>
                  <div style={{ fontSize: "15px", color: "var(--text-primary)", fontWeight: "600" }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
