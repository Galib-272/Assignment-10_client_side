"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "@/providers/ThemeProvider";
import {
  FaBus, FaBars, FaTimes, FaSun, FaMoon, FaUser,
  FaChevronDown, FaTicketAlt, FaSignOutAlt, FaTachometerAlt
} from "react-icons/fa";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/tickets", label: "All Tickets" },
];

export default function Navbar() {
  const { data: session } = useSession();
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isDark = theme === "dark";

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 999,
        transition: "all 0.3s ease",
        background: scrolled
          ? isDark
            ? "rgba(5, 8, 26, 0.92)"
            : "rgba(255, 255, 255, 0.94)"
          : isDark
            ? "rgba(5, 8, 26, 0.55)"
            : "rgba(255, 255, 255, 0.75)",
        backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${scrolled ? "var(--border-color)" : "transparent"}`,
        padding: "0 24px",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "70px",
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              background: "linear-gradient(135deg, #00d4ff, #7c3aed)",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 20px rgba(0,212,255,0.4)",
            }}
          >
            <FaBus color="#fff" size={18} />
          </div>
          <span
            style={{
              fontFamily: "Space Grotesk, sans-serif",
              fontSize: "22px",
              fontWeight: "800",
              background: "linear-gradient(135deg, #00d4ff, #7c3aed)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            TicketBari
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }} className="hidden md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                color: "var(--text-secondary)",
                textDecoration: "none",
                padding: "8px 16px",
                borderRadius: "8px",
                fontWeight: "500",
                fontSize: "14px",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--color-primary)";
                e.currentTarget.style.background = "rgba(0,212,255,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--text-secondary)";
                e.currentTarget.style.background = "transparent";
              }}
            >
              {link.label}
            </Link>
          ))}
          {session && (
            <Link
              href="/dashboard"
              style={{
                color: "var(--text-secondary)",
                textDecoration: "none",
                padding: "8px 16px",
                borderRadius: "8px",
                fontWeight: "500",
                fontSize: "14px",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--color-primary)";
                e.currentTarget.style.background = "rgba(0,212,255,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--text-secondary)";
                e.currentTarget.style.background = "transparent";
              }}
            >
              Dashboard
            </Link>
          )}
        </div>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Light/Dark Theme"
            style={{
              background: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.05)",
              border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.1)"}`,
              borderRadius: "10px",
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: isDark ? "#f59e0b" : "#475569",
              transition: "all 0.2s",
            }}
          >
            {theme === "dark" ? <FaSun size={17} /> : <FaMoon size={17} />}
          </button>

          {/* Auth buttons / User menu */}
          {!session ? (
            <div className="hidden md:flex" style={{ gap: "10px", display: "flex" }}>
              <Link href="/login">
                <button className="btn-outline" style={{ padding: "9px 22px", fontSize: "14px" }}>
                  Login
                </button>
              </Link>
              <Link href="/register">
                <button className="btn-primary" style={{ padding: "9px 22px", fontSize: "14px" }}>
                  Register
                </button>
              </Link>
            </div>
          ) : (
            <div ref={dropdownRef} style={{ position: "relative" }}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  padding: "6px 14px 6px 6px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                <img
                  src={session.user?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(session.user?.name || "U")}&background=00d4ff&color=fff&size=40`}
                  alt={session.user?.name || "User Avatar"}
                  referrerPolicy="no-referrer"
                  crossOrigin="anonymous"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(session.user?.name || "U")}&background=00d4ff&color=fff&size=40`;
                  }}
                  style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover" }}
                />
                <span style={{ color: "var(--text-primary)", fontSize: "14px", fontWeight: "500" }}>
                  {session.user?.name?.split(" ")[0]}
                </span>
                <FaChevronDown size={12} color="var(--text-muted)" />
              </button>

              {dropdownOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 10px)",
                    right: 0,
                    background: "var(--bg-surface)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "14px",
                    padding: "8px",
                    minWidth: "190px",
                    boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
                    zIndex: 1000,
                  }}
                >
                  <Link
                    href="/dashboard/profile"
                    style={{ textDecoration: "none" }}
                    onClick={() => setDropdownOpen(false)}
                  >
                    <div className="sidebar-link" style={{ padding: "10px 14px", borderRadius: "8px" }}>
                      <FaUser size={14} />
                      <span>My Profile</span>
                    </div>
                  </Link>
                  <Link
                    href="/dashboard"
                    style={{ textDecoration: "none" }}
                    onClick={() => setDropdownOpen(false)}
                  >
                    <div className="sidebar-link" style={{ padding: "10px 14px", borderRadius: "8px" }}>
                      <FaTachometerAlt size={14} />
                      <span>Dashboard</span>
                    </div>
                  </Link>
                  <div style={{ height: "1px", background: "var(--border-color)", margin: "6px 0" }} />
                  <button
                    onClick={() => { signOut({ callbackUrl: "/" }); setDropdownOpen(false); }}
                    style={{
                      width: "100%",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <div className="sidebar-link" style={{ padding: "10px 14px", borderRadius: "8px", color: "var(--color-error)" }}>
                      <FaSignOutAlt size={14} />
                      <span>Logout</span>
                    </div>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px",
              width: "38px",
              height: "38px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "var(--text-primary)",
            }}
          >
            {mobileOpen ? <FaTimes size={16} /> : <FaBars size={16} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          style={{
            background: isDark ? "rgba(5, 8, 26, 0.98)" : "rgba(255, 255, 255, 0.98)",
            backdropFilter: "blur(20px)",
            borderTop: "1px solid var(--border-color)",
            padding: "16px 24px 24px",
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              style={{
                display: "block",
                color: "var(--text-secondary)",
                textDecoration: "none",
                padding: "12px 0",
                fontWeight: "500",
                borderBottom: "1px solid rgba(255,255,255,0.04)",
                transition: "color 0.2s",
              }}
            >
              {link.label}
            </Link>
          ))}
          {session && (
            <Link href="/dashboard" onClick={() => setMobileOpen(false)}
              style={{ display: "block", color: "var(--text-secondary)", textDecoration: "none", padding: "12px 0", fontWeight: "500", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              Dashboard
            </Link>
          )}
          {!session ? (
            <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
              <Link href="/login" onClick={() => setMobileOpen(false)} style={{ flex: 1 }}>
                <button className="btn-outline" style={{ width: "100%" }}>Login</button>
              </Link>
              <Link href="/register" onClick={() => setMobileOpen(false)} style={{ flex: 1 }}>
                <button className="btn-primary" style={{ width: "100%" }}>Register</button>
              </Link>
            </div>
          ) : (
            <button
              onClick={() => { signOut({ callbackUrl: "/" }); setMobileOpen(false); }}
              className="btn-danger"
              style={{ width: "100%", marginTop: "16px" }}
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
