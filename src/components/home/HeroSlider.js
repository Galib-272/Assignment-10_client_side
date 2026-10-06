"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import Link from "next/link";
import { FaArrowRight, FaBus, FaTrain, FaPlane, FaShip } from "react-icons/fa";

const slides = [
  {
    title: "Travel Smarter,\nBook Faster",
    subtitle: "Discover the best bus, train, launch & flight tickets across Bangladesh",
    gradient: "linear-gradient(135deg, rgba(0,212,255,0.2), rgba(124,58,237,0.2))",
    icon: <FaBus size={80} color="rgba(0,212,255,0.3)" />,
    tag: "🚌 Bus Tickets",
  },
  {
    title: "Train Journeys\nMade Easy",
    subtitle: "Book intercity train tickets with real-time seat availability",
    gradient: "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(245,158,11,0.2))",
    icon: <FaTrain size={80} color="rgba(124,58,237,0.3)" />,
    tag: "🚆 Train Tickets",
  },
  {
    title: "Fly High,\nPay Less",
    subtitle: "Get exclusive deals on domestic and international flights",
    gradient: "linear-gradient(135deg, rgba(245,158,11,0.2), rgba(16,185,129,0.2))",
    icon: <FaPlane size={80} color="rgba(245,158,11,0.3)" />,
    tag: "✈️ Flight Tickets",
  },
  {
    title: "Sail the Rivers\nof Bangladesh",
    subtitle: "Experience scenic launch journeys with premium amenities",
    gradient: "linear-gradient(135deg, rgba(16,185,129,0.2), rgba(0,212,255,0.2))",
    icon: <FaShip size={80} color="rgba(16,185,129,0.3)" />,
    tag: "🚢 Launch Tickets",
  },
];

export default function HeroSlider() {
  return (
    <section style={{ position: "relative", height: "100vh", minHeight: "650px", overflow: "hidden" }}>
      {/* Animated background blobs */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 80% 60% at 50% -20%, rgba(0,212,255,0.12) 0%, transparent 60%)",
        zIndex: 0, pointerEvents: "none"
      }} />
      <div className="bg-glow" style={{ width: "400px", height: "400px", background: "rgba(124,58,237,0.08)", top: "-100px", right: "-100px" }} />
      <div className="bg-glow" style={{ width: "300px", height: "300px", background: "rgba(0,212,255,0.06)", bottom: "0px", left: "-80px" }} />

      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        effect="fade"
        autoplay={{ delay: 4500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation
        loop
        style={{ height: "100%", zIndex: 1 }}
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={i}>
            <div
              style={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
                background: slide.gradient,
              }}
            >
              {/* Floating icon */}
              <div
                className="animate-float"
                style={{
                  position: "absolute",
                  right: "10%",
                  top: "50%",
                  transform: "translateY(-50%)",
                  opacity: 0.6,
                }}
              >
                {slide.icon}
              </div>

              {/* Grid lines decoration */}
              <div style={{
                position: "absolute", inset: 0, opacity: 0.04,
                backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
                backgroundSize: "60px 60px",
              }} />

              {/* Content */}
              <div
                style={{
                  maxWidth: "1280px",
                  width: "100%",
                  padding: "0 24px",
                  zIndex: 2,
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    background: "rgba(0,212,255,0.1)",
                    border: "1px solid rgba(0,212,255,0.3)",
                    color: "#00d4ff",
                    borderRadius: "50px",
                    padding: "6px 18px",
                    fontSize: "13px",
                    fontWeight: "600",
                    marginBottom: "24px",
                    letterSpacing: "0.5px",
                  }}
                >
                  {slide.tag}
                </span>

                <h1
                  style={{
                    fontFamily: "Space Grotesk, sans-serif",
                    fontSize: "clamp(2.5rem, 6vw, 5rem)",
                    fontWeight: "900",
                    lineHeight: "1.1",
                    marginBottom: "20px",
                    whiteSpace: "pre-line",
                    background: "linear-gradient(135deg, #e2e8f0 0%, #00d4ff 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {slide.title}
                </h1>

                <p
                  style={{
                    fontSize: "1.15rem",
                    color: "var(--text-secondary)",
                    maxWidth: "540px",
                    lineHeight: "1.7",
                    marginBottom: "36px",
                  }}
                >
                  {slide.subtitle}
                </p>

                <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
                  <Link href="/tickets">
                    <button className="btn-primary" style={{ display: "flex", alignItems: "center", gap: "8px", padding: "14px 32px", fontSize: "16px" }}>
                      Browse Tickets <FaArrowRight size={14} />
                    </button>
                  </Link>
                  <Link href="/register">
                    <button className="btn-outline" style={{ padding: "14px 32px", fontSize: "16px" }}>
                      Get Started Free
                    </button>
                  </Link>
                </div>

                {/* Stats */}
                <div style={{ display: "flex", gap: "36px", marginTop: "48px", flexWrap: "wrap" }}>
                  {[
                    { value: "50K+", label: "Happy Travelers" },
                    { value: "200+", label: "Routes Available" },
                    { value: "4.9★", label: "User Rating" },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <div style={{ fontSize: "1.6rem", fontWeight: "800", color: "var(--color-primary)", fontFamily: "Space Grotesk, sans-serif" }}>
                        {stat.value}
                      </div>
                      <div style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "2px" }}>
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Bottom wave */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 2 }}>
        <svg viewBox="0 0 1440 80" style={{ display: "block", width: "100%" }}>
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="var(--bg-primary)" />
        </svg>
      </div>
    </section>
  );
}
