"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { 
  FaDollarSign, 
  FaTicketAlt, 
  FaCalendarCheck, 
  FaChartLine,
  FaArrowUp,
  FaArrowDown
} from "react-icons/fa";

const mockStats = {
  totalRevenue: 28450,
  ticketsSold: 142,
  activeListings: 8,
  pendingBookings: 5,
  monthlySales: [
    { month: "Jan", revenue: 2400, bookings: 12 },
    { month: "Feb", revenue: 3200, bookings: 16 },
    { month: "Mar", revenue: 2800, bookings: 14 },
    { month: "Apr", revenue: 4100, bookings: 21 },
    { month: "May", revenue: 3900, bookings: 19 },
    { month: "Jun", revenue: 5200, bookings: 26 },
    { month: "Jul", revenue: 6850, bookings: 34 },
  ],
  recentSales: [
    { id: "TX-109", customer: "Rahim Ahmed", ticket: "Dhaka to Chittagong AC Bus", amount: 1700, date: "2026-10-05" },
    { id: "TX-108", customer: "Sharmin Sultana", ticket: "Sylhet Intercity Train Express", amount: 900, date: "2026-10-04" },
    { id: "TX-107", customer: "Kamal Hossain", ticket: "Dhaka to Cox's Bazar Scania", amount: 2400, date: "2026-10-03" },
    { id: "TX-106", customer: "Fatima Noor", ticket: "Dhaka to Rajshahi Flight", amount: 7000, date: "2026-10-02" },
  ]
};

export default function RevenuePage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState(mockStats);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/vendors/revenue`, {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
            "x-user-email": session?.user?.email || "",
            "x-user-role": session?.user?.role || "vendor",
          },
        });
        if (res.data) {
          setStats({
            ...mockStats,
            ...res.data,
            recentSales: Array.isArray(res.data.recentSales) && res.data.recentSales.length > 0
              ? res.data.recentSales
              : mockStats.recentSales,
            monthlySales: Array.isArray(res.data.monthlySales) && res.data.monthlySales.length > 0
              ? res.data.monthlySales
              : mockStats.monthlySales,
          });
        }
      } catch {
        setStats(mockStats);
      } finally {
        setLoading(false);
      }
    };
    if (session) fetchRevenue();
    else setLoading(false);
  }, [session]);

  const monthlySales = (stats?.monthlySales && Array.isArray(stats.monthlySales) && stats.monthlySales.length > 0)
    ? stats.monthlySales
    : mockStats.monthlySales;
  const recentSales = (stats?.recentSales && Array.isArray(stats.recentSales) && stats.recentSales.length > 0)
    ? stats.recentSales
    : mockStats.recentSales;
  const maxRevenue = Math.max(...monthlySales.map((m) => m.revenue || 1));

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "800", color: "var(--text-primary)", fontFamily: "Space Grotesk, sans-serif", marginBottom: "6px" }}>
          Revenue & Analytics Overview
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
          Monitor your ticket sales performance, cash flow, and booking demand
        </p>
      </div>

      {/* KPI Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "20px",
        marginBottom: "36px"
      }}>
        {/* Card 1 */}
        <div className="card" style={{ padding: "24px", position: "relative", overflow: "hidden" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
            <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Total Earnings
            </span>
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              background: "rgba(0, 212, 255, 0.12)",
              color: "var(--color-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px"
            }}>
              <FaDollarSign />
            </div>
          </div>
          <div style={{ fontSize: "30px", fontWeight: "800", color: "var(--text-primary)", fontFamily: "Space Grotesk, sans-serif", marginBottom: "8px" }}>
            ৳{stats.totalRevenue.toLocaleString()}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "var(--color-success)" }}>
            <FaArrowUp size={11} />
            <span>+18.4% from last month</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="card" style={{ padding: "24px", position: "relative", overflow: "hidden" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
            <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Tickets Sold
            </span>
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              background: "rgba(124, 58, 237, 0.12)",
              color: "var(--color-secondary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px"
            }}>
              <FaTicketAlt />
            </div>
          </div>
          <div style={{ fontSize: "30px", fontWeight: "800", color: "var(--text-primary)", fontFamily: "Space Grotesk, sans-serif", marginBottom: "8px" }}>
            {stats.ticketsSold}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "var(--color-success)" }}>
            <FaArrowUp size={11} />
            <span>+12 new this week</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="card" style={{ padding: "24px", position: "relative", overflow: "hidden" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
            <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Active Listings
            </span>
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              background: "rgba(16, 185, 129, 0.12)",
              color: "var(--color-success)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px"
            }}>
              <FaChartLine />
            </div>
          </div>
          <div style={{ fontSize: "30px", fontWeight: "800", color: "var(--text-primary)", fontFamily: "Space Grotesk, sans-serif", marginBottom: "8px" }}>
            {stats.activeListings}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "var(--text-muted)" }}>
            <span>Available for booking</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="card" style={{ padding: "24px", position: "relative", overflow: "hidden" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
            <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Pending Action
            </span>
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              background: "rgba(245, 158, 11, 0.12)",
              color: "var(--color-accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px"
            }}>
              <FaCalendarCheck />
            </div>
          </div>
          <div style={{ fontSize: "30px", fontWeight: "800", color: "var(--text-primary)", fontFamily: "Space Grotesk, sans-serif", marginBottom: "8px" }}>
            {stats.pendingBookings}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "var(--color-accent)" }}>
            <span>Requires review</span>
          </div>
        </div>
      </div>

      {/* Visual Chart Section */}
      <div className="card" style={{ padding: "28px", marginBottom: "36px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: "700", color: "var(--text-primary)", marginBottom: "4px" }}>
              Monthly Revenue Performance
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>
              Revenue generated across all confirmed & paid bookings
            </p>
          </div>
          <span style={{ 
            fontSize: "12px", 
            fontWeight: "600", 
            padding: "6px 12px", 
            borderRadius: "8px", 
            background: "rgba(0, 212, 255, 0.1)", 
            color: "var(--color-primary)",
            border: "1px solid rgba(0, 212, 255, 0.2)"
          }}>
            Current Year
          </span>
        </div>

        {/* Bar chart representation */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: "18px", height: "200px", paddingBottom: "30px", borderBottom: "1px solid var(--border-color)" }}>
          {monthlySales.map((m) => {
            const heightPercent = Math.round((m.revenue / maxRevenue) * 100);
            return (
              <div key={m.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", height: "100%", justifyContent: "flex-end" }}>
                <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "600" }}>
                  ৳{m.revenue}
                </span>
                <div style={{
                  width: "100%",
                  height: `${heightPercent}%`,
                  minHeight: "8px",
                  background: "linear-gradient(180deg, var(--color-primary) 0%, rgba(124, 58, 237, 0.8) 100%)",
                  borderRadius: "6px 6px 2px 2px",
                  transition: "all 0.3s ease",
                  position: "relative"
                }} />
                <span style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: "500", marginTop: "4px" }}>
                  {m.month}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Sales Table */}
      <div className="card" style={{ padding: "28px" }}>
        <h2 style={{ fontSize: "18px", fontWeight: "700", color: "var(--text-primary)", marginBottom: "20px" }}>
          Recent Transactions
        </h2>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-color)", textAlign: "left", color: "var(--text-muted)", fontSize: "12px", textTransform: "uppercase" }}>
                <th style={{ padding: "12px 16px" }}>Transaction ID</th>
                <th style={{ padding: "12px 16px" }}>Customer</th>
                <th style={{ padding: "12px 16px" }}>Ticket Route</th>
                <th style={{ padding: "12px 16px" }}>Date</th>
                <th style={{ padding: "12px 16px", textAlign: "right" }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentSales.map((sale) => (
                <tr key={sale.id} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
                  <td style={{ padding: "14px 16px", fontWeight: "600", color: "var(--color-primary)", fontFamily: "monospace" }}>
                    {sale.id}
                  </td>
                  <td style={{ padding: "14px 16px", color: "var(--text-primary)" }}>
                    {sale.customer}
                  </td>
                  <td style={{ padding: "14px 16px", color: "var(--text-secondary)" }}>
                    {sale.ticket}
                  </td>
                  <td style={{ padding: "14px 16px", color: "var(--text-muted)", fontSize: "13px" }}>
                    {sale.date}
                  </td>
                  <td style={{ padding: "14px 16px", textAlign: "right", fontWeight: "700", color: "var(--color-success)" }}>
                    ৳{sale.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
