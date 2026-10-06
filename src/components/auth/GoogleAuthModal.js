"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FaGoogle, FaCopy, FaCheck, FaTimes, FaExternalLinkAlt } from "react-icons/fa";

export default function GoogleAuthModal({ isOpen, onClose, redirectUrl = "/" }) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

  if (!isOpen) return null;

  const callbackUrl = typeof window !== "undefined"
    ? `${window.location.origin}/api/auth/callback/google`
    : "http://localhost:3000/api/auth/callback/google";

  const handleCopy = () => {
    navigator.clipboard.writeText(callbackUrl);
    setCopied(true);
    toast.success("Callback URL copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDemoSignIn = async () => {
    setDemoLoading(true);
    try {
      const res = await signIn("credentials", {
        email: "google.demo@ticketbari.com",
        password: "demo",
        isGoogleDemo: "true",
        redirect: false,
      });
      if (res?.error) {
        toast.error("Demo login failed");
      } else {
        toast.success("Signed in with Google (Demo account)!");
        onClose();
        router.push(redirectUrl);
      }
    } catch {
      toast.error("Error signing in with demo account");
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        background: "rgba(5, 8, 22, 0.85)",
        backdropFilter: "blur(8px)",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="glass-card"
        style={{
          width: "100%",
          maxWidth: "520px",
          padding: "32px",
          borderRadius: "20px",
          border: "1px solid rgba(0, 212, 255, 0.25)",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.6)",
          position: "relative",
          animation: "scaleIn 0.25s ease-out",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            background: "none",
            border: "none",
            color: "var(--text-muted)",
            cursor: "pointer",
            fontSize: "18px",
          }}
        >
          <FaTimes />
        </button>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              background: "rgba(234, 67, 53, 0.12)",
              border: "1px solid rgba(234, 67, 53, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FaGoogle size={20} color="#ea4335" />
          </div>
          <div>
            <h3 style={{ fontSize: "18px", fontWeight: "700", color: "var(--text-primary)", fontFamily: "Space Grotesk, sans-serif" }}>
              Google Console Setup Needed
            </h3>
            <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
              Add your Google OAuth credentials in .env.local
            </p>
          </div>
        </div>

        <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: "1.6", marginBottom: "18px" }}>
          Real Google sign-in requires a <strong>Google Client ID</strong> and <strong>Secret</strong> from Google Cloud Console.
        </p>

        {/* Callback URI box */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>
            Authorized Redirect URI (for Google Console):
          </label>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "var(--bg-surface2)",
              border: "1px solid var(--border-color)",
              borderRadius: "8px",
              padding: "8px 12px",
              gap: "8px",
            }}
          >
            <code style={{ fontSize: "12px", color: "#00d4ff", flex: 1, wordBreak: "break-all" }}>
              {callbackUrl}
            </code>
            <button
              onClick={handleCopy}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                padding: "4px 10px",
                borderRadius: "6px",
                background: copied ? "rgba(16,185,129,0.2)" : "rgba(0,212,255,0.15)",
                border: "none",
                color: copied ? "#10b981" : "#00d4ff",
                fontSize: "12px",
                fontWeight: "600",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {copied ? <><FaCheck size={11} /> Copied</> : <><FaCopy size={11} /> Copy</>}
            </button>
          </div>
        </div>

        {/* Quick steps */}
        <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: "10px", padding: "14px", marginBottom: "24px", fontSize: "12px", color: "var(--text-secondary)" }}>
          <div style={{ fontWeight: "700", color: "var(--text-primary)", marginBottom: "6px" }}>Quick Setup Steps:</div>
          <ol style={{ paddingLeft: "16px", margin: 0, display: "flex", flexDirection: "column", gap: "4px" }}>
            <li>Open <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noreferrer" style={{ color: "#00d4ff", textDecoration: "none" }}>Google Cloud Console <FaExternalLinkAlt size={9} /></a></li>
            <li>Create OAuth 2.0 Client ID (Web Application)</li>
            <li>Paste the Redirect URI above into <em>Authorized redirect URIs</em></li>
            <li>Add Client ID & Secret to <code style={{ color: "#00d4ff" }}>Assignment-10_client_side/.env.local</code></li>
          </ol>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={handleDemoSignIn}
            disabled={demoLoading}
            className="btn-primary"
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              fontSize: "13px",
              padding: "10px",
            }}
          >
            <FaGoogle size={14} />
            {demoLoading ? "Signing in..." : "Continue with Demo User"}
          </button>
          <button
            onClick={onClose}
            className="btn-outline"
            style={{ padding: "10px 16px", fontSize: "13px" }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
