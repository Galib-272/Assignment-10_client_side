"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { FaBus, FaGoogle, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

export default function LoginPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      if (res?.error) {
        toast.error("Invalid email or password");
      } else {
        toast.success("Welcome back!");
        router.push("/");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      setLoading(true);
      // Attempt Google OAuth sign-in
      const res = await signIn("google", { callbackUrl: "/", redirect: false });
      if (res?.error) {
        // If Google Cloud keys are not set up in .env yet, use instant Google demo sign-in
        const demoRes = await signIn("credentials", {
          email: "google.demo@ticketbari.com",
          password: "demo",
          isGoogleDemo: "true",
          redirect: false,
        });
        if (!demoRes?.error) {
          toast.success("Signed in with Google (Demo)!");
          router.push("/");
        } else {
          toast.error("Google sign-in requires Google Client ID in .env.local");
        }
      } else if (res?.url) {
        window.location.href = res.url;
      }
    } catch {
      // Direct demo sign in fallback
      const demoRes = await signIn("credentials", {
        email: "google.demo@ticketbari.com",
        password: "demo",
        isGoogleDemo: "true",
        redirect: false,
      });
      if (!demoRes?.error) {
        toast.success("Signed in with Google (Demo)!");
        router.push("/");
      }
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
      background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,212,255,0.08) 0%, transparent 60%), var(--bg-primary)",
      position: "relative",
      overflow: "hidden",
    }}>
      <div className="bg-glow" style={{ width: "400px", height: "400px", background: "rgba(124,58,237,0.08)", top: "20%", right: "-100px" }} />
      <div className="bg-glow" style={{ width: "300px", height: "300px", background: "rgba(0,212,255,0.06)", bottom: "10%", left: "-80px" }} />

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
            Welcome Back
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
            Sign in to continue your journey
          </p>
        </div>

        {/* Card */}
        <div className="glass-card" style={{ padding: "36px" }}>
          {/* Google Button */}
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

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {/* Email */}
            <div>
              <label className="form-label">Email Address</label>
              <div style={{ position: "relative" }}>
                <FaEnvelope size={14} color="var(--text-muted)" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
                <input
                  {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email" } })}
                  type="email"
                  placeholder="you@example.com"
                  id="login-email"
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
                  {...register("password", { required: "Password is required", minLength: { value: 6, message: "Min 6 characters" } })}
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  id="login-password"
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
              id="login-submit"
              style={{ marginTop: "4px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
            >
              {loading ? <><div className="spinner" style={{ width: "18px", height: "18px", borderWidth: "2px" }} /> Signing in...</> : "Sign In"}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: "20px", color: "var(--text-secondary)", fontSize: "14px" }}>
            Don't have an account?{" "}
            <Link href="/register" style={{ color: "var(--color-primary)", fontWeight: "600", textDecoration: "none" }}>
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
