"use client";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FaUser, FaTicketAlt, FaHistory, FaPlusCircle, FaList,
  FaClipboardList, FaChartBar, FaUsersCog, FaBullhorn,
  FaBus, FaSignOutAlt, FaBars, FaTimes, FaChevronLeft, FaCreditCard
} from "react-icons/fa";
import { signOut } from "next-auth/react";

const userLinks = [
  { href: "/dashboard/profile", icon: <FaUser size={15} />, label: "My Profile" },
  { href: "/dashboard/my-bookings", icon: <FaTicketAlt size={15} />, label: "My Bookings" },
  { href: "/dashboard/payment", icon: <FaCreditCard size={15} />, label: "Payment" },
  { href: "/dashboard/transactions", icon: <FaHistory size={15} />, label: "Transactions" },
];

const vendorLinks = [
  { href: "/dashboard/profile", icon: <FaUser size={15} />, label: "Vendor Profile" },
  { href: "/dashboard/add-ticket", icon: <FaPlusCircle size={15} />, label: "Add Ticket" },
  { href: "/dashboard/my-tickets", icon: <FaList size={15} />, label: "My Tickets" },
  { href: "/dashboard/requested-bookings", icon: <FaClipboardList size={15} />, label: "Requested Bookings" },
  { href: "/dashboard/revenue", icon: <FaChartBar size={15} />, label: "Revenue Overview" },
  { href: "/dashboard/transactions", icon: <FaHistory size={15} />, label: "Transactions" },
  { href: "/dashboard/advertise", icon: <FaBullhorn size={15} />, label: "Advertise Tickets" },
];

const adminLinks = [
  { href: "/dashboard/profile", icon: <FaUser size={15} />, label: "Admin Profile" },
  { href: "/dashboard/manage-tickets", icon: <FaTicketAlt size={15} />, label: "Manage Tickets" },
  { href: "/dashboard/manage-users", icon: <FaUsersCog size={15} />, label: "Manage Users" },
  { href: "/dashboard/transactions", icon: <FaHistory size={15} />, label: "Transactions" },
  { href: "/dashboard/advertise", icon: <FaBullhorn size={15} />, label: "Advertise Tickets" },
];

function getRoleLinks(role) {
  if (role === "admin") return adminLinks;
  if (role === "vendor") return vendorLinks;
  return userLinks;
}

export default function DashboardLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  // Sidebar open by default on desktop, closed on mobile
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
  }, [status, router]);

  // Track window width for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close sidebar on route change on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [pathname, isMobile]);

  if (status === "loading") {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-primary)" }}>
        <div className="spinner" />
      </div>
    );
  }

  if (!session) return null;

  const role = session.user?.role || "user";
  const links = getRoleLinks(role);

  const roleLabel = role === "admin" ? "Admin" : role === "vendor" ? "Vendor" : "User";
  const roleColor = role === "admin" ? "#f59e0b" : role === "vendor" ? "#7c3aed" : "#00d4ff";

  return (
    <div
      className="dashboard-container"
      style={{
        minHeight: "calc(100vh - 70px)",
        display: "flex",
        background: "var(--bg-primary)",
        paddingTop: "70px",
        position: "relative",
      }}
    >
      {/* Mobile Backdrop Overlay */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.65)",
            zIndex: 140,
            backdropFilter: "blur(2px)",
          }}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`dashboard-sidebar ${sidebarOpen ? "open" : "closed"}`}
        style={
          isMobile
            ? {
                position: "fixed",
                top: 0,
                left: 0,
                bottom: 0,
                width: "270px",
                background: "var(--bg-surface)",
                borderRight: "1px solid var(--border-color)",
                display: "flex",
                flexDirection: "column",
                zIndex: 200,
                transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
                transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: sidebarOpen ? "8px 0 24px rgba(0,0,0,0.4)" : "none",
              }
            : {
                width: sidebarOpen ? "270px" : "0px",
                flexShrink: 0,
                background: "var(--bg-surface)",
                borderRight: sidebarOpen ? "1px solid var(--border-color)" : "none",
                display: "flex",
                flexDirection: "column",
                position: "sticky",
                top: "70px",
                height: "calc(100vh - 70px)",
                alignSelf: "flex-start",
                overflowY: "auto",
                overflowX: "hidden",
                transition: "width 0.25s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease",
                opacity: sidebarOpen ? 1 : 0,
                visibility: sidebarOpen ? "visible" : "hidden",
                zIndex: 50,
              }
        }
      >
        {/* User info Header with Close / Toggle Button on TOP RIGHT CORNER */}
        <div
          style={{
            padding: "20px 16px 18px",
            borderBottom: "1px solid var(--border-color)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "10px",
            minWidth: "260px",
          }}
        >
          {/* User Avatar + Name */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0, flex: 1 }}>
            <img
              src={session.user?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(session.user?.name || "U")}&background=00d4ff&color=fff&size=80`}
              alt={session.user?.name || "User Avatar"}
              referrerPolicy="no-referrer"
              crossOrigin="anonymous"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(session.user?.name || "U")}&background=00d4ff&color=fff&size=80`;
              }}
              style={{ width: "42px", height: "42px", borderRadius: "50%", objectFit: "cover", border: `2px solid ${roleColor}`, flexShrink: 0 }}
            />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: "14px", fontWeight: "700", color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {session.user?.name}
              </div>
              <div style={{ fontSize: "11px", fontWeight: "700", color: roleColor, letterSpacing: "0.5px", marginTop: "2px" }}>
                {roleLabel}
              </div>
            </div>
          </div>

          {/* Close Sidebar Button on TOP RIGHT CORNER */}
          <button
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
            title="Close sidebar"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid var(--border-color)",
              borderRadius: "8px",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "var(--text-secondary)",
              transition: "all 0.2s",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(0,212,255,0.15)";
              e.currentTarget.style.color = "#00d4ff";
              e.currentTarget.style.borderColor = "rgba(0,212,255,0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.06)";
              e.currentTarget.style.color = "var(--text-secondary)";
              e.currentTarget.style.borderColor = "var(--border-color)";
            }}
          >
            {isMobile ? <FaTimes size={14} /> : <FaChevronLeft size={13} />}
          </button>
        </div>

        {/* Nav links */}
        <nav style={{ padding: "12px 8px", flex: 1, minWidth: "260px" }}>
          <div style={{ fontSize: "10px", fontWeight: "700", color: "var(--text-muted)", letterSpacing: "1.5px", textTransform: "uppercase", padding: "8px 10px", marginBottom: "4px" }}>
            {roleLabel} Dashboard
          </div>
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link key={link.href} href={link.href} style={{ textDecoration: "none" }}>
                <div
                  className={`sidebar-link ${isActive ? "active" : ""}`}
                  style={isActive ? { borderRight: "3px solid var(--color-primary)", color: "var(--color-primary)", background: "rgba(0,212,255,0.1)" } : {}}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </div>
              </Link>
            );
          })}

          {/* Separator & Home link */}
          <div style={{ height: "1px", background: "var(--border-color)", margin: "12px 0" }} />
          <Link href="/" style={{ textDecoration: "none" }}>
            <div className="sidebar-link">
              <FaBus size={15} />
              <span>Back to Home</span>
            </div>
          </Link>
        </nav>

        {/* Logout */}
        <div style={{ padding: "12px 8px 18px", borderTop: "1px solid var(--border-color)", minWidth: "260px" }}>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            style={{ width: "100%", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
          >
            <div className="sidebar-link" style={{ color: "var(--color-error)" }}>
              <FaSignOutAlt size={15} />
              <span>Logout</span>
            </div>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main
        className="dashboard-main"
        style={{
          flex: 1,
          padding: "28px 32px 48px",
          minHeight: "calc(100vh - 70px)",
          overflowX: "hidden",
          transition: "margin 0.25s ease, padding 0.25s ease",
          width: "100%",
        }}
      >
        {/* Top bar trigger when sidebar is closed */}
        {!sidebarOpen && (
          <div style={{ marginBottom: "20px" }}>
            <button
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
              title="Open sidebar"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 14px",
                borderRadius: "8px",
                border: "1px solid var(--border-color)",
                background: "var(--bg-surface)",
                color: "#00d4ff",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(0,212,255,0.4)";
                e.currentTarget.style.background = "rgba(0,212,255,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border-color)";
                e.currentTarget.style.background = "var(--bg-surface)";
              }}
            >
              <FaBars size={13} />
              <span>Open Sidebar</span>
            </button>
          </div>
        )}

        {children}
      </main>
    </div>
  );
}
