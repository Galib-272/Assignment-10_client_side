"use client";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import TicketCard from "@/components/tickets/TicketCard";
import { FaSearch, FaFilter, FaSortAmountDown, FaSortAmountUp, FaBus, FaTrain, FaPlane, FaShip, FaTimes } from "react-icons/fa";

const TRANSPORT_TYPES = ["All", "Bus", "Train", "Plane", "Launch"];
const PAGE_SIZE = 9;

const mockTickets = [
  { _id: "1", title: "Dhaka to Chittagong Express", from: "Dhaka", to: "Chittagong", price: 850, transportType: "Bus", quantity: 45, perks: ["AC", "WiFi"], image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=200&fit=crop", departureDate: "2026-11-01T08:00:00Z" },
  { _id: "2", title: "Dhaka to Cox's Bazar Direct", from: "Dhaka", to: "Cox's Bazar", price: 1200, transportType: "Bus", quantity: 30, perks: ["AC", "Breakfast"], image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400&h=200&fit=crop", departureDate: "2026-11-02T09:00:00Z" },
  { _id: "3", title: "Dhaka to Sylhet Intercity", from: "Dhaka", to: "Sylhet", price: 450, transportType: "Train", quantity: 120, perks: ["AC", "Dining Car"], image: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=400&h=200&fit=crop", departureDate: "2026-11-03T07:00:00Z" },
  { _id: "4", title: "Dhaka to Barishal Launch", from: "Dhaka", to: "Barishal", price: 350, transportType: "Launch", quantity: 200, perks: ["Cabin"], image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=200&fit=crop", departureDate: "2026-11-04T18:00:00Z" },
  { _id: "5", title: "Dhaka to Rajshahi Flight", from: "Dhaka", to: "Rajshahi", price: 3500, transportType: "Plane", quantity: 60, perks: ["Meal"], image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=200&fit=crop", departureDate: "2026-11-05T10:00:00Z" },
  { _id: "6", title: "Dhaka to Khulna Express", from: "Dhaka", to: "Khulna", price: 600, transportType: "Train", quantity: 80, perks: ["AC", "Breakfast"], image: "https://images.unsplash.com/photo-1565793279042-ab0ddf5a57f0?w=400&h=200&fit=crop", departureDate: "2026-11-06T06:00:00Z" },
  { _id: "7", title: "Chittagong to Cox's Bazar", from: "Chittagong", to: "Cox's Bazar", price: 280, transportType: "Bus", quantity: 50, perks: ["AC"], image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&h=200&fit=crop", departureDate: "2026-11-07T08:30:00Z" },
  { _id: "8", title: "Dhaka to Jessore Flight", from: "Dhaka", to: "Jessore", price: 2800, transportType: "Plane", quantity: 40, perks: ["Meal"], image: "https://images.unsplash.com/photo-1529074963764-98f45c47344b?w=400&h=200&fit=crop", departureDate: "2026-11-08T11:00:00Z" },
  { _id: "9", title: "Narayanganj to Dhaka Water", from: "Narayanganj", to: "Dhaka", price: 120, transportType: "Launch", quantity: 300, perks: ["Scenic"], image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=400&h=200&fit=crop", departureDate: "2026-11-09T07:00:00Z" },
  { _id: "10", title: "Sylhet to Dhaka Express", from: "Sylhet", to: "Dhaka", price: 480, transportType: "Train", quantity: 90, perks: ["AC"], image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&h=200&fit=crop", departureDate: "2026-11-10T09:00:00Z" },
  { _id: "11", title: "Rajshahi to Dhaka Bus", from: "Rajshahi", to: "Dhaka", price: 520, transportType: "Bus", quantity: 45, perks: ["AC", "WiFi"], image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=200&fit=crop", departureDate: "2026-11-11T08:00:00Z" },
  { _id: "12", title: "Dhaka to Tangail AC Bus", from: "Dhaka", to: "Tangail", price: 180, transportType: "Bus", quantity: 55, perks: ["AC"], image: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=400&h=200&fit=crop", departureDate: "2026-11-12T08:00:00Z" },
];

export default function AllTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState({ from: "", to: "" });
  const [transport, setTransport] = useState("All");
  const [sort, setSort] = useState("none");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        limit: PAGE_SIZE,
        ...(search.from && { from: search.from }),
        ...(search.to && { to: search.to }),
        ...(transport !== "All" && { transportType: transport }),
        ...(sort !== "none" && { sort }),
      });
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/tickets?${params}`);
      setTickets(res.data.tickets);
      setTotalPages(res.data.totalPages || 1);
    } catch {
      let filtered = [...mockTickets];
      if (search.from) filtered = filtered.filter(t => t.from.toLowerCase().includes(search.from.toLowerCase()));
      if (search.to) filtered = filtered.filter(t => t.to.toLowerCase().includes(search.to.toLowerCase()));
      if (transport !== "All") filtered = filtered.filter(t => t.transportType === transport);
      if (sort === "asc") filtered.sort((a, b) => a.price - b.price);
      if (sort === "desc") filtered.sort((a, b) => b.price - a.price);
      setTotalPages(Math.ceil(filtered.length / PAGE_SIZE));
      setTickets(filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE));
    } finally {
      setLoading(false);
    }
  }, [search, transport, sort, page]);

  useEffect(() => { fetchTickets(); }, [fetchTickets]);

  const handleSearch = (e) => { e.preventDefault(); setPage(1); fetchTickets(); };
  const clearFilters = () => { setSearch({ from: "", to: "" }); setTransport("All"); setSort("none"); setPage(1); };

  return (
    <div style={{ minHeight: "100vh", paddingTop: "80px", background: "var(--bg-primary)" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, rgba(0,212,255,0.08), rgba(124,58,237,0.06))", borderBottom: "1px solid var(--border-color)", padding: "40px 24px 48px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <h1 className="section-title" style={{ marginBottom: "8px" }}>
            <span className="gradient-text">All</span> Tickets
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "15px" }}>
            Browse all approved tickets from our verified vendors
          </p>
        </div>
      </div>

      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Search & Filters */}
        <div className="glass-card" style={{ padding: "24px", marginBottom: "32px" }}>
          <form onSubmit={handleSearch}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: "12px", alignItems: "end", flexWrap: "wrap" }}>
              <div>
                <label className="form-label">From</label>
                <div style={{ position: "relative" }}>
                  <FaSearch size={13} color="var(--text-muted)" style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)" }} />
                  <input
                    value={search.from}
                    onChange={(e) => setSearch(s => ({ ...s, from: e.target.value }))}
                    placeholder="Departure city..."
                    className="input-field"
                    style={{ paddingLeft: "38px" }}
                  />
                </div>
              </div>
              <div>
                <label className="form-label">To</label>
                <div style={{ position: "relative" }}>
                  <FaSearch size={13} color="var(--text-muted)" style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)" }} />
                  <input
                    value={search.to}
                    onChange={(e) => setSearch(s => ({ ...s, to: e.target.value }))}
                    placeholder="Destination city..."
                    className="input-field"
                    style={{ paddingLeft: "38px" }}
                  />
                </div>
              </div>
              <button type="submit" className="btn-primary" style={{ height: "44px", display: "flex", alignItems: "center", gap: "8px", padding: "0 24px" }}>
                <FaSearch size={13} /> Search
              </button>
            </div>
          </form>

          {/* Filter row */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "16px", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <FaFilter size={13} color="var(--text-muted)" />
              <span style={{ fontSize: "13px", color: "var(--text-secondary)", fontWeight: "600" }}>Filter:</span>
            </div>
            {TRANSPORT_TYPES.map((t) => (
              <button
                key={t}
                onClick={() => { setTransport(t); setPage(1); }}
                style={{
                  padding: "6px 14px",
                  borderRadius: "8px",
                  border: `1.5px solid ${transport === t ? "rgba(0,212,255,0.5)" : "var(--border-color)"}`,
                  background: transport === t ? "rgba(0,212,255,0.1)" : "transparent",
                  color: transport === t ? "#00d4ff" : "var(--text-secondary)",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  fontFamily: "Outfit, sans-serif",
                }}
              >
                {t}
              </button>
            ))}
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "13px", color: "var(--text-secondary)", fontWeight: "600" }}>Sort:</span>
              <button
                onClick={() => setSort(s => s === "asc" ? "desc" : s === "desc" ? "none" : "asc")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 14px",
                  borderRadius: "8px",
                  border: `1.5px solid ${sort !== "none" ? "rgba(0,212,255,0.5)" : "var(--border-color)"}`,
                  background: sort !== "none" ? "rgba(0,212,255,0.1)" : "transparent",
                  color: sort !== "none" ? "#00d4ff" : "var(--text-secondary)",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontFamily: "Outfit, sans-serif",
                }}
              >
                {sort === "asc" ? <FaSortAmountUp size={12} /> : <FaSortAmountDown size={12} />}
                Price {sort === "asc" ? "↑" : sort === "desc" ? "↓" : ""}
              </button>
              {(search.from || search.to || transport !== "All" || sort !== "none") && (
                <button onClick={clearFilters} style={{ display: "flex", alignItems: "center", gap: "5px", padding: "6px 12px", borderRadius: "8px", border: "1.5px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.08)", color: "#ef4444", fontSize: "12px", fontWeight: "600", cursor: "pointer", fontFamily: "Outfit, sans-serif" }}>
                  <FaTimes size={11} /> Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results count */}
        <div style={{ marginBottom: "20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
            Showing <strong style={{ color: "var(--text-primary)" }}>{tickets.length}</strong> tickets
          </span>
          <span style={{ color: "var(--text-muted)", fontSize: "13px" }}>
            Page {page} of {totalPages}
          </span>
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: "24px" }}>
            {[...Array(PAGE_SIZE)].map((_, i) => (
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
        ) : tickets.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 24px" }}>
            <div style={{ fontSize: "64px", marginBottom: "16px" }}>🎫</div>
            <h3 style={{ fontSize: "22px", fontWeight: "700", color: "var(--text-primary)", marginBottom: "8px" }}>No tickets found</h3>
            <p style={{ color: "var(--text-secondary)" }}>Try adjusting your search filters</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: "24px" }}>
            {tickets.map((ticket) => (
              <TicketCard key={ticket._id} ticket={ticket} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "40px" }}>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="btn-outline"
              style={{ padding: "8px 18px", fontSize: "14px" }}
            >
              ← Prev
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                style={{
                  width: "40px", height: "40px",
                  borderRadius: "8px",
                  border: `1.5px solid ${page === i + 1 ? "rgba(0,212,255,0.5)" : "var(--border-color)"}`,
                  background: page === i + 1 ? "rgba(0,212,255,0.15)" : "transparent",
                  color: page === i + 1 ? "#00d4ff" : "var(--text-secondary)",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontFamily: "Outfit, sans-serif",
                  fontSize: "14px",
                }}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="btn-outline"
              style={{ padding: "8px 18px", fontSize: "14px" }}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
