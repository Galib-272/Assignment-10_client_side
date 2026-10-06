"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";
import { FaBus, FaGoogle, FaEnvelope, FaLock, FaUser, FaEye, FaEyeSlash } from "react-icons/fa";
import GoogleAuthModal from "@/components/auth/GoogleAuthModal";

export default function RegisterPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        name: data.name,
        email: data.email,
        password: data.password,
      });
      await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      toast.success("Account created successfully! Welcome to TicketBari 🎉");
      router.push("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/auth/providers");
      const providers = await res.json();
      if (providers?.google) {
        // Real Google OAuth credentials exist! Trigger standard redirect
        await signIn("google", { callbackUrl: "/" });
      } else {
        // Keys not set up in .env.local yet, show setup modal with demo fallback
        setShowGoogleModal(true);
      }
    } catch {
      setShowGoogleModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "100px 24px 60px",
      background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(124,58,237,0.08) 0%, transparent 60%), var(--bg-primary)",
      position: "relative",
      overflow: "hidden",
    }}>
      <div className="bg-glow" style={{ width: "400px", height: "400px", background: "rgba(0,212,255,0.06)", top: "20%", left: "-100px" }} />
      <div className="bg-glow" style={{ width: "350px", height: "350px", background: "rgba(124,58,237,0.07)", bottom: "10%", right: "-80px" }} />

      <div style={{ width: "100%", maxWidth: "440px", position: "relative", zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <Link href="/" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "10px", justifyContent: "center" }}>
            <div style={{ width: "44px", height: "44px", background: "linear-gradient(135deg, #00d4ff, #7c3aed)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 25px rgba(0,212,255,0.4)" }}>
              <FaBus color="#fff" size={22} />
            </div>
            <span style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "26px", fontWeight: "800", background: "linear-gradient(135deg, #00d4ff, #7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              TicketBari
            </span>
          </Link>
          <h1 style={{ fontSize: "28px", fontWeight: "800", color: "var(--text-primary)", marginTop: "20px", marginBottom: "6px", fontFamily: "Space Grotesk, sans-serif" }}>
            Create Account
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
            Join thousands of happy travelers today
          </p>
        </div>

        {/* Card */}
        <div className="glass-card" style={{ padding: "36px" }}>
          {/* Google */}
          <button
            onClick={handleGoogle}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              padding: "13px",
              background: "rgba(255,255,255,0.05)",
              border: "1.5px solid rgba(255,255,255,0.12)",
              borderRadius: "10px",
              color: "var(--text-primary)",
              fontFamily: "Outfit, sans-serif",
              fontSize: "15px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s",
              marginBottom: "24px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.08)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.05)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
            }}
          >
            <FaGoogle size={18} color="#ea4335" />
            Continue with Google
          </button>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
            <div style={{ flex: 1, height: "1px", background: "var(--border-color)" }} />
            <span style={{ color: "var(--text-muted)", fontSize: "13px" }}>or</span>
            <div style={{ flex: 1, height: "1px", background: "var(--border-color)" }} />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {/* Name */}
            <div>
              <label className="form-label">Full Name</label>
              <div style={{ position: "relative" }}>
                <FaUser size={13} color="var(--text-muted)" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
                <input
                  {...register("name", { required: "Name is required", minLength: { value: 2, message: "Min 2 characters" } })}
                  type="text"
                  placeholder="Your Full Name"
                  id="register-name"
                  className="input-field"
                  style={{ paddingLeft: "40px" }}
                />
              </div>
              {errors.name && <p style={{ color: "var(--color-error)", fontSize: "12px", marginTop: "4px" }}>{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="form-label">Email Address</label>
              <div style={{ position: "relative" }}>
                <FaEnvelope size={14} color="var(--text-muted)" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
                <input
                  {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email" } })}
                  type="email"
                  placeholder="you@example.com"
                  id="register-email"
                  className="input-field"
                  style={{ paddingLeft: "40px" }}
                />
              </div>
              {errors.email && <p style={{ color: "var(--color-error)", fontSize: "12px", marginTop: "4px" }}>{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="form-label">Password</label>
              <div style={{ position: "relative" }}>
                <FaLock size={14} color="var(--text-muted)" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
                <input
                  {...register("password", { required: "Password is required", minLength: { value: 6, message: "Minimum 6 characters required" }, pattern: { value: /(?=.*[A-Z])/, message: "Must include an uppercase letter" } })}
                  type={showPass ? "text" : "password"}
                  placeholder="Create a strong password"
                  id="register-password"
                  className="input-field"
                  style={{ paddingLeft: "40px", paddingRight: "44px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
                >
                  {showPass ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
                </button>
              </div>
              {errors.password && <p style={{ color: "var(--color-error)", fontSize: "12px", marginTop: "4px" }}>{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              id="register-submit"
              style={{ marginTop: "4px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
            >
              {loading ? <><div className="spinner" style={{ width: "18px", height: "18px", borderWidth: "2px" }} /> Creating account...</> : "Create Account"}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: "20px", color: "var(--text-secondary)", fontSize: "14px" }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "var(--color-primary)", fontWeight: "600", textDecoration: "none" }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>

      <GoogleAuthModal
        isOpen={showGoogleModal}
        onClose={() => setShowGoogleModal(false)}
      />
    </div>
  );
}
