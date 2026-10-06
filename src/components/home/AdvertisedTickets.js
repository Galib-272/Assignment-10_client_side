"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import TicketCard from "@/components/tickets/TicketCard";
import { FaBullhorn, FaArrowRight } from "react-icons/fa";

// Mock data for when API is not yet connected
const mockAdvertised = [
  { _id: "1", title: "Dhaka to Chittagong Express", from: "Dhaka", to: "Chittagong", price: 850, transportType: "bus", quantity: 45, perks: ["AC", "WiFi", "Snacks"], image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=200&fit=crop" },
  { _id: "2", title: "Dhaka to Cox's Bazar Direct", from: "Dhaka", to: "Cox's Bazar", price: 1200, transportType: "bus", quantity: 30, perks: ["AC", "Breakfast", "Movie"], image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400&h=200&fit=crop" },
  { _id: "3", title: "Dhaka to Sylhet Intercity", from: "Dhaka", to: "Sylhet", price: 450, transportType: "train", quantity: 120, perks: ["AC", "Dining Car"], image: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=400&h=200&fit=crop" },
  { _id: "4", title: "Dhaka to Barishal Launch", from: "Dhaka", to: "Barishal", price: 350, transportType: "launch", quantity: 200, perks: ["Cabin", "Restaurant"], image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=200&fit=crop" },
  { _id: "5", title: "Dhaka to Rajshahi Flight", from: "Dhaka", to: "Rajshahi", price: 3500, transportType: "plane", quantity: 60, perks: ["Meal", "Lounge"], image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=200&fit=crop" },
  { _id: "6", title: "Dhaka to Khulna Express", from: "Dhaka", to: "Khulna", price: 600, transportType: "train", quantity: 80, perks: ["AC", "Breakfast"], image: "https://images.unsplash.com/photo-1565793279042-ab0ddf5a57f0?w=400&h=200&fit=crop" },
];

export default function AdvertisedTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdvertised = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/tickets/advertised`);
        const data = Array.isArray(res.data) ? res.data : [];
        setTickets(data.length > 0 ? data.slice(0, 6) : mockAdvertised);
      } catch {
        setTickets(mockAdvertised);
      } finally {
        setLoading(false);
      }
    };
    fetchAdvertised();
  }, []);

  return (
    <section style={{ padding: "80px 24px", background: "var(--bg-surface)", position: "relative", overflow: "hidden" }}>
      {/* Background glow */}
      <div className="bg-glow" style={{ width: "500px", height: "500px", background: "rgba(0,212,255,0.04)", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />

      <div style={{ maxWidth: "1280px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Section header */}
        <div style={{ textAlign: "center", marginBottom: "52px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "14px" }}>
            <div style={{ width: "36px", height: "36px", background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <FaBullhorn size={16} color="#f59e0b" />
            </div>
            <span style={{ fontSize: "13px", fontWeight: "700", color: "#f59e0b", letterSpacing: "1.5px", textTransform: "uppercase" }}>
              Featured Picks
            </span>
          </div>
          <h2 className="section-title" style={{ marginBottom: "12px" }}>
            <span className="gradient-text-gold">Top Advertised</span> Tickets
          </h2>
          <p className="section-subtitle" style={{ maxWidth: "520px", margin: "0 auto" }}>
            Hand-picked deals selected by our team — the best fares and routes just for you
          </p>
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: "24px" }}>
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
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: "24px" }}>
              {tickets.map((ticket) => (
                <TicketCard key={ticket._id} ticket={ticket} />
              ))}
            </div>
            {/* View All CTA */}
            <div style={{ textAlign: "center", marginTop: "48px" }}>
              <Link href="/tickets">
                <button className="btn-accent" style={{ display: "inline-flex", alignItems: "center", gap: "10px", padding: "14px 36px", fontSize: "15px" }}>
                  Browse All Tickets <FaArrowRight size={13} />
                </button>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
