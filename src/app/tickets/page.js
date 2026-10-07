"use client";
import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import TicketCard from "@/components/tickets/TicketCard";
import { FaSearch, FaFilter, FaSortAmountDown, FaSortAmountUp, FaBus, FaTrain, FaPlane, FaShip, FaTimes } from "react-icons/fa";

const TRANSPORT_TYPES = ["All", "Bus", "Train", "Plane", "Launch"];
const PAGE_SIZE = 9;

import { MOCK_TICKETS } from "@/data/mockTickets";

function TicketsContent() {
  const searchParams = useSearchParams();
  const initialFrom = searchParams.get("from") || "";
  const initialTo = searchParams.get("to") || "";
  const initialType = searchParams.get("type") || "All";

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState({ from: initialFrom, to: initialTo });
  const [transport, setTransport] = useState(initialType);
  const [sort, setSort] = useState("none");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (searchParams.get("from") || searchParams.get("to") || searchParams.get("type")) {
      setSearch({
        from: searchParams.get("from") || "",
        to: searchParams.get("to") || "",
      });
      if (searchParams.get("type")) {
        setTransport(searchParams.get("type"));
      }
    }
  }, [searchParams]);

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
      if (res.data?.tickets && res.data.tickets.length > 0) {
        let loaded = [...res.data.tickets];
        if (sort === "price-asc" || sort === "asc") {
          loaded.sort((a, b) => Number(a.price) - Number(b.price));
        } else if (sort === "price-desc" || sort === "desc") {
          loaded.sort((a, b) => Number(b.price) - Number(a.price));
        }
        setTickets(loaded);
        setTotalPages(res.data.totalPages || 1);
      } else {
        throw new Error("No tickets in DB");
      }
    } catch {
      let filtered = [...MOCK_TICKETS];
      if (search.from) filtered = filtered.filter(t => t.from.toLowerCase().includes(search.from.toLowerCase()));
      if (search.to) filtered = filtered.filter(t => t.to.toLowerCase().includes(search.to.toLowerCase()));
      if (transport !== "All") filtered = filtered.filter(t => t.transportType?.toLowerCase() === transport.toLowerCase());
      if (sort === "price-asc" || sort === "asc") filtered.sort((a, b) => Number(a.price) - Number(b.price));
      if (sort === "price-desc" || sort === "desc") filtered.sort((a, b) => Number(b.price) - Number(a.price));
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
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "13px", color: "var(--text-secondary)", fontWeight: "600" }}>Sort:</span>
              <button
                type="button"
                id="sort-price-low-to-high"
                onClick={() => {
                  setSort(s => s === "price-asc" ? "none" : "price-asc");
                  setPage(1);
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 14px",
                  borderRadius: "8px",
                  border: `1.5px solid ${sort === "price-asc" ? "rgba(0,212,255,0.6)" : "var(--border-color)"}`,
                  background: sort === "price-asc" ? "rgba(0,212,255,0.15)" : "transparent",
                  color: sort === "price-asc" ? "#00d4ff" : "var(--text-secondary)",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontFamily: "Outfit, sans-serif",
                  transition: "all 0.2s",
                }}
              >
                <FaSortAmountUp size={11} /> Price: Low to High
              </button>
              <button
                type="button"
                id="sort-price-high-to-low"
                onClick={() => {
                  setSort(s => s === "price-desc" ? "none" : "price-desc");
                  setPage(1);
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 14px",
                  borderRadius: "8px",
                  border: `1.5px solid ${sort === "price-desc" ? "rgba(0,212,255,0.6)" : "var(--border-color)"}`,
                  background: sort === "price-desc" ? "rgba(0,212,255,0.15)" : "transparent",
                  color: sort === "price-desc" ? "#00d4ff" : "var(--text-secondary)",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontFamily: "Outfit, sans-serif",
                  transition: "all 0.2s",
                }}
              >
                <FaSortAmountDown size={11} /> Price: High to Low
              </button>
              {(search.from || search.to || transport !== "All" || sort !== "none") && (
                <button
                  type="button"
                  onClick={clearFilters}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                    padding: "6px 12px",
                    borderRadius: "8px",
                    border: "1.5px solid rgba(239,68,68,0.3)",
                    background: "rgba(239,68,68,0.08)",
                    color: "#ef4444",
                    fontSize: "12px",
                    fontWeight: "600",
                    cursor: "pointer",
                    fontFamily: "Outfit, sans-serif"
                  }}
                >
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
          <div className="ticket-grid">
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
          <div className="ticket-grid">
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

export default function AllTicketsPage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: "100vh", paddingTop: "120px", textAlign: "center", color: "var(--text-secondary)" }}>
          <div className="skeleton" style={{ width: "300px", height: "40px", margin: "0 auto 20px" }} />
          Loading tickets...
        </div>
      }
    >
      <TicketsContent />
    </Suspense>
  );
}
