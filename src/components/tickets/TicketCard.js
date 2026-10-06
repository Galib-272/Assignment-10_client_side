"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { FaBus, FaTrain, FaPlane, FaShip, FaStar, FaMapMarkerAlt, FaArrowRight } from "react-icons/fa";
import { MdAirlineSeatReclineNormal } from "react-icons/md";

const transportIcon = {
  bus: <FaBus size={14} />,
  train: <FaTrain size={14} />,
  plane: <FaPlane size={14} />,
  launch: <FaShip size={14} />,
};

const transportColor = {
  bus: "#00d4ff",
  train: "#7c3aed",
  plane: "#f59e0b",
  launch: "#10b981",
};

export default function TicketCard({ ticket, compact = false }) {
  const { data: session } = useSession();
  if (!ticket) return null;

  const detailsHref = session ? `/tickets/${ticket._id}` : `/login?callbackUrl=/tickets/${ticket._id}`;

  const type = ticket.transportType?.toLowerCase() || "bus";
  const color = transportColor[type] || "#00d4ff";

  return (
    <div className="ticket-card" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Image */}
      <div style={{ position: "relative", overflow: "hidden", height: compact ? "160px" : "200px" }}>
        <img
          src={ticket.image || `https://picsum.photos/seed/${ticket._id || Math.random()}/400/200`}
          alt={ticket.title}
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&h=400&fit=crop";
          }}
          style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease" }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        />
        {/* Transport type badge */}
        <div
          style={{
            position: "absolute",
            top: "12px",
            left: "12px",
            background: `rgba(${type === "bus" ? "0,212,255" : type === "train" ? "124,58,237" : type === "plane" ? "245,158,11" : "16,185,129"},0.9)`,
            backdropFilter: "blur(8px)",
            color: "#fff",
            borderRadius: "8px",
            padding: "5px 10px",
            fontSize: "12px",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          {transportIcon[type]}
          {ticket.transportType}
        </div>
        {/* Price tag */}
        <div
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            background: "rgba(5,8,26,0.85)",
            backdropFilter: "blur(8px)",
            color: "#00d4ff",
            borderRadius: "8px",
            padding: "5px 12px",
            fontSize: "14px",
            fontWeight: "700",
          }}
        >
          ৳{ticket.price?.toLocaleString()}
        </div>
      </div>

      {/* Card body */}
      <div style={{ padding: "18px", display: "flex", flexDirection: "column", flex: 1, gap: "10px" }}>
        <h3 style={{
          fontSize: "16px",
          fontWeight: "700",
          color: "var(--text-primary)",
          fontFamily: "Space Grotesk, sans-serif",
          lineHeight: "1.3",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}>
          {ticket.title}
        </h3>

        {/* Route */}
        {ticket.from && (
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-secondary)" }}>
            <FaMapMarkerAlt size={11} color={color} />
            <span style={{ color, fontWeight: "600" }}>{ticket.from}</span>
            <span style={{ color: "var(--text-muted)" }}>→</span>
            <span style={{ color, fontWeight: "600" }}>{ticket.to}</span>
          </div>
        )}

        {/* Seats & Perks */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", color: "var(--text-secondary)" }}>
            <MdAirlineSeatReclineNormal size={14} color={color} />
            <span>{ticket.quantity} seats</span>
          </div>
          {ticket.perks?.slice(0, 2).map((perk) => (
            <span key={perk} className="tag">{perk}</span>
          ))}
          {ticket.perks?.length > 2 && (
            <span className="tag">+{ticket.perks.length - 2}</span>
          )}
        </div>

        <div style={{ flex: 1 }} />

        {/* See details button */}
        <Link href={detailsHref} style={{ textDecoration: "none", marginTop: "4px" }}>
          <button
            className="btn-primary"
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "10px",
              fontSize: "14px",
            }}
          >
            See Details <FaArrowRight size={12} />
          </button>
        </Link>
      </div>
    </div>
  );
}
