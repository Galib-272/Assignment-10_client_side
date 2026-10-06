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
    type: "Bus",
    tag: "🚌 Luxury Intercity Bus",
    title: "Travel Smarter,\nBook Faster",
    subtitle: "Premium AC coaches, sleeper beds, and comfortable intercity routes across Bangladesh.",
    image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1920&q=80",
    accentColor: "#00d4ff",
  },
  {
    type: "Train",
    tag: "🚆 Bangladesh Railway",
    title: "Scenic Rail Journeys\nMade Simple",
    subtitle: "Fast Shovon, Snigdha, and AC Berth reservations with live seat availability.",
    image: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1920&q=80",
    accentColor: "#7c3aed",
  },
  {
    type: "Plane",
    tag: "✈️ Domestic & International Flights",
    title: "Fly Across Horizons,\nPay Less",
    subtitle: "Lowest airfares on Biman, US-Bangla, Novoair, and leading global airlines.",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1920&q=80",
    accentColor: "#f59e0b",
  },
  {
    type: "Launch",
    tag: "🚢 Scenic River Cruise & Launch",
    title: "Sail The Majestic Rivers\nof Bangladesh",
    subtitle: "VIP cabins, riverine breeze, and luxury launch voyages connecting Dhaka & Southern ports.",
    image: "https://images.unsplash.com/photo-1527797393658-6a8777f47011?auto=format&fit=crop&w=1920&q=80",
    accentColor: "#10b981",
  },
];

export default function HeroSlider() {
  return (
    <section className="hero-section" style={{ position: "relative", height: "92vh", minHeight: "680px", overflow: "hidden", background: "#05081a" }}>
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={800}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation
        loop
        style={{ width: "100%", height: "100%" }}
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={i} style={{ width: "100%", height: "100%", position: "relative" }}>
            {/* Background Image Container */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `url(${slide.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                transform: "scale(1.02)",
                transition: "transform 6s ease",
              }}
            />

            {/* Dark Cinematic Gradient Overlays to eliminate text overlap & boost readability */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(90deg, rgba(5,8,26,0.95) 0%, rgba(5,8,26,0.82) 48%, rgba(5,8,26,0.45) 100%)",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(180deg, rgba(5,8,26,0.4) 0%, transparent 40%, rgba(5,8,26,0.95) 100%)",
              }}
            />

            {/* Slide Content */}
            <div
              className="hero-content-inner"
              style={{
                position: "relative",
                zIndex: 2,
                height: "100%",
                maxWidth: "1280px",
                margin: "0 auto",
                padding: "0 24px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div style={{ maxWidth: "680px" }}>
                {/* Category Badge */}
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "rgba(13, 18, 48, 0.75)",
                    border: `1.5px solid ${slide.accentColor}55`,
                    borderRadius: "50px",
                    padding: "8px 20px",
                    marginBottom: "24px",
                    backdropFilter: "blur(12px)",
                    boxShadow: `0 0 20px ${slide.accentColor}25`,
                  }}
                >
                  <span
                    style={{
                      color: slide.accentColor,
                      fontSize: "14px",
                      fontWeight: "700",
                      letterSpacing: "0.5px",
                      fontFamily: "Outfit, sans-serif",
                    }}
                  >
                    {slide.tag}
                  </span>
                </div>

                {/* Main Headline */}
                <h1
                  style={{
                    fontFamily: "Space Grotesk, sans-serif",
                    fontSize: "clamp(2.5rem, 5.5vw, 4.8rem)",
                    fontWeight: "900",
                    lineHeight: "1.12",
                    marginBottom: "22px",
                    color: "#ffffff",
                    letterSpacing: "-0.5px",
                    textShadow: "0 4px 20px rgba(0,0,0,0.6)",
                  }}
                >
                  {slide.title}
                </h1>

                {/* Subtitle */}
                <p
                  style={{
                    fontSize: "clamp(1.05rem, 1.8vw, 1.25rem)",
                    color: "rgba(226, 232, 240, 0.9)",
                    lineHeight: "1.65",
                    marginBottom: "36px",
                    maxWidth: "580px",
                    textShadow: "0 2px 10px rgba(0,0,0,0.5)",
                  }}
                >
                  {slide.subtitle}
                </p>

                {/* Call to Actions */}
                <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center" }}>
                  <Link href="/tickets">
                    <button
                      className="btn-primary"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "15px 36px",
                        fontSize: "16px",
                        fontWeight: "700",
                        boxShadow: "0 10px 25px rgba(0,212,255,0.35)",
                      }}
                    >
                      Browse All Tickets <FaArrowRight size={14} />
                    </button>
                  </Link>
                  <Link href="/register">
                    <button
                      className="btn-outline"
                      style={{
                        padding: "15px 32px",
                        fontSize: "16px",
                        fontWeight: "600",
                        background: "rgba(13, 18, 48, 0.6)",
                        backdropFilter: "blur(10px)",
                      }}
                    >
                      Create Free Account
                    </button>
                  </Link>
                </div>

                {/* Key Statistics */}
                <div
                  className="hero-stats"
                  style={{
                    display: "flex",
                    gap: "42px",
                    marginTop: "52px",
                    flexWrap: "wrap",
                    paddingTop: "24px",
                    borderTop: "1px solid rgba(255, 255, 255, 0.12)",
                  }}
                >
                  {[
                    { value: "50,000+", label: "Happy Travelers" },
                    { value: "200+", label: "Nationwide Routes" },
                    { value: "4.9 / 5.0", label: "Customer Rating" },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <div
                        style={{
                          fontSize: "1.7rem",
                          fontWeight: "800",
                          color: "#00d4ff",
                          fontFamily: "Space Grotesk, sans-serif",
                          letterSpacing: "-0.5px",
                        }}
                      >
                        {stat.value}
                      </div>
                      <div
                        style={{
                          fontSize: "13px",
                          color: "rgba(226, 232, 240, 0.75)",
                          marginTop: "2px",
                          fontWeight: "500",
                        }}
                      >
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

      {/* Elegant Bottom Wave transition */}
      <div style={{ position: "absolute", bottom: -1, left: 0, right: 0, zIndex: 10, pointerEvents: "none" }}>
        <svg viewBox="0 0 1440 60" style={{ display: "block", width: "100%", height: "45px" }} preserveAspectRatio="none">
          <path d="M0,20 C360,55 1080,0 1440,25 L1440,60 L0,60 Z" fill="var(--bg-primary)" />
        </svg>
      </div>
    </section>
  );
}
