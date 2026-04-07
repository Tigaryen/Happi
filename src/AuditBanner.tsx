import { useState } from "react";

export default function AuditBanner() {
  const [hovered, setHovered] = useState(false);

  return (
    <div style={{ padding: "0 24px" }}>
      <section style={{
        background: "#edf8f1",
        borderRadius: 20,
        padding: "clamp(40px, 5vw, 56px) clamp(32px, 5vw, 64px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 40,
        fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
        maxWidth: 1200,
        margin: "0 auto",
        flexWrap: "wrap" as const,
      }}>
        <div style={{ flex: 1 }}>
          <h2 style={{
            margin: 0,
            fontSize: "clamp(36px, 5vw, 56px)",
            fontWeight: 800,
            color: "#0a1a0f",
            lineHeight: 1.08,
            letterSpacing: "-0.03em",
          }}>
            Get your AI<br />
            <span style={{ color: "#2dd4a0" }}>Readiness Score</span>
          </h2>
        </div>

        <div style={{ flexShrink: 0 }}>
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
              whiteSpace: "nowrap" as const,
              transition: "background 0.2s ease, transform 0.15s ease",
              transform: hovered ? "translateY(-1px)" : "translateY(0)",
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            Start your free AI Audit
            <span style={{
              fontSize: 20,
              transition: "transform 0.2s ease",
              transform: hovered ? "translateX(3px)" : "translateX(0)",
              display: "inline-block",
            }}>→</span>
          </a>
        </div>
      </section>
    </div>
  );
}
