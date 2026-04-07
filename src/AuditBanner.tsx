import { useState } from "react";

export default function AuditBanner() {
  const [hovered, setHovered] = useState(false);

  return (
    <section className="w-full py-16 md:py-24" style={{ background: "#edf8f1" }}>
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center gap-8">
        <h2 style={{
          margin: 0,
          fontSize: "clamp(36px, 5vw, 56px)",
          fontWeight: 800,
          color: "#0a1a0f",
          lineHeight: 1.08,
          letterSpacing: "-0.03em",
          fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
        }}>
          Get your AI<br />
          <span style={{ color: "#2dd4a0" }}>Readiness Score</span>
        </h2>

        <a
          href="/audit"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            background: hovered ? "#1a3020" : "#0f1f14",
            color: "#ffffff",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 18,
            fontWeight: 700,
            padding: "20px 40px",
            borderRadius: 50,
            textDecoration: "none",
            whiteSpace: "nowrap",
            transition: "background 0.2s ease, transform 0.15s ease",
            transform: hovered ? "translateY(-1px)" : "translateY(0)",
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          Get Your Free Score
          <span style={{
            fontSize: 20,
            display: "inline-block",
            transition: "transform 0.2s ease",
            transform: hovered ? "translateX(3px)" : "translateX(0)",
          }}>→</span>
        </a>
      </div>
    </section>
  );
}
