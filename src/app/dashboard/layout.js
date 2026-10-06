"use client";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import {
  FaUser, FaTicketAlt, FaHistory, FaPlusCircle, FaList,
  FaClipboardList, FaChartBar, FaUsersCog, FaBullhorn,
  FaShieldAlt, FaBus, FaSignOutAlt, FaTachometerAlt
} from "react-icons/fa";
import { signOut } from "next-auth/react";

const userLinks = [
  { href: "/dashboard/profile", icon: <FaUser size={15} />, label: "My Profile" },
  { href: "/dashboard/my-bookings", icon: <FaTicketAlt size={15} />, label: "My Bookings" },
  { href: "/dashboard/transactions", icon: <FaHistory size={15} />, label: "Transactions" },
];

const vendorLinks = [
  { href: "/dashboard/profile", icon: <FaUser size={15} />, label: "Vendor Profile" },
  { href: "/dashboard/add-ticket", icon: <FaPlusCircle size={15} />, label: "Add Ticket" },
  { href: "/dashboard/my-tickets", icon: <FaList size={15} />, label: "My Tickets" },
  { href: "/dashboard/requested-bookings", icon: <FaClipboardList size={15} />, label: "Requested Bookings" },
  { href: "/dashboard/revenue", icon: <FaChartBar size={15} />, label: "Revenue Overview" },
  { href: "/dashboard/advertise", icon: <FaBullhorn size={15} />, label: "Advertise Tickets" },
];

const adminLinks = [
  { href: "/dashboard/profile", icon: <FaUser size={15} />, label: "Admin Profile" },
  { href: "/dashboard/manage-tickets", icon: <FaTicketAlt size={15} />, label: "Manage Tickets" },
  { href: "/dashboard/manage-users", icon: <FaUsersCog size={15} />, label: "Manage Users" },
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

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
  }, [status, router]);

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
    <div style={{ minHeight: "100vh", display: "flex", background: "var(--bg-primary)", paddingTop: "70px" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: "260px",
          flexShrink: 0,
          background: "var(--bg-surface)",
          borderRight: "1px solid var(--border-color)",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          top: "70px",
          left: 0,
          bottom: 0,
          overflowY: "auto",
          zIndex: 100,
        }}
      >
        {/* User info */}
        <div style={{ padding: "24px 16px 20px", borderBottom: "1px solid var(--border-color)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <img
              src={session.user?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(session.user?.name || "U")}&background=00d4ff&color=fff&size=80`}
              alt={session.user?.name}
              style={{ width: "44px", height: "44px", borderRadius: "50%", objectFit: "cover", border: `2px solid ${roleColor}` }}
            />
            <div style={{ overflow: "hidden" }}>
              <div style={{ fontSize: "14px", fontWeight: "700", color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {session.user?.name}
              </div>
              <div style={{ fontSize: "11px", fontWeight: "700", color: roleColor, letterSpacing: "0.5px", marginTop: "2px" }}>
                {roleLabel}
              </div>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav style={{ padding: "12px 8px", flex: 1 }}>
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
        <div style={{ padding: "12px 8px 20px", borderTop: "1px solid var(--border-color)" }}>
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

      {/* Main content */}
      <main style={{ flex: 1, marginLeft: "260px", padding: "32px", minHeight: "calc(100vh - 70px)", overflowX: "hidden" }}>
        {children}
      </main>
    </div>
  );
}
