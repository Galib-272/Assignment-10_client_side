"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import TicketCard from "@/components/tickets/TicketCard";
import Link from "next/link";
import { FaTicketAlt, FaArrowRight } from "react-icons/fa";

import { MOCK_LATEST } from "@/data/mockTickets";


export default function LatestTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/tickets/latest`);
        const data = Array.isArray(res.data) ? res.data : [];
        setTickets(data.length > 0 ? data.slice(0, 8) : MOCK_LATEST);
      } catch {
        setTickets(MOCK_LATEST);
      } finally {
        setLoading(false);
      }
    };
    fetchLatest();
  }, []);

  return (
    <section style={{ padding: "80px 24px", background: "var(--bg-primary)", position: "relative", overflow: "hidden" }}>
      <div className="bg-glow" style={{ width: "400px", height: "400px", background: "rgba(124,58,237,0.06)", bottom: "-100px", right: "-100px" }} />

      <div style={{ maxWidth: "1280px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "48px", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
              <div style={{ width: "36px", height: "36px", background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.25)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <FaTicketAlt size={16} color="#00d4ff" />
              </div>
              <span style={{ fontSize: "13px", fontWeight: "700", color: "#00d4ff", letterSpacing: "1.5px", textTransform: "uppercase" }}>
                Fresh Listings
              </span>
            </div>
            <h2 className="section-title">
              <span className="gradient-text">Latest</span> Tickets
            </h2>
          </div>
          <Link href="/tickets">
            <button className="btn-outline" style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 22px", fontSize: "14px" }}>
              View All <FaArrowRight size={12} />
            </button>
          </Link>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="ticket-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{ borderRadius: "16px", overflow: "hidden" }}>
                <div className="skeleton" style={{ height: "200px" }} />
                <div style={{ padding: "18px", background: "var(--bg-card)", display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div className="skeleton" style={{ height: "20px", borderRadius: "6px" }} />
                  <div className="skeleton" style={{ height: "14px", borderRadius: "6px", width: "70%" }} />
                  <div className="skeleton" style={{ height: "36px", borderRadius: "10px", marginTop: "8px" }} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="ticket-grid">
            {tickets.map((ticket) => (
              <TicketCard key={ticket._id} ticket={ticket} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
