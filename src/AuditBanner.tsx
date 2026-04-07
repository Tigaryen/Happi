export default function AuditBanner() {
  return (
    <div style={{ padding: "0 24px", marginBottom: 0 }}>
      <div style={{
        background: "#edf8f1",
        borderRadius: 20,
        padding: "40px 48px",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 24,
        fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
        maxWidth: 1344,
        margin: "0 auto",
      }}>
        <h2 style={{
          margin: 0,
          fontSize: "clamp(28px, 4vw, 42px)",
          fontWeight: 800,
          lineHeight: 1.1,
          letterSpacing: "-0.03em",
          color: "#2dd4a0",
        }}>
          Get your AI<br />Readiness Score
        </h2>

        <a
          href="/audit"
          style={{
            display: "inline-block",
            background: "#0f1f14",
            color: "#ffffff",
            padding: "16px 28px",
            borderRadius: 50,
            fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
            fontSize: 15,
            fontWeight: 700,
            textDecoration: "none",
            whiteSpace: "nowrap",
            transition: "opacity 0.2s ease",
          }}
          onMouseOver={e => (e.currentTarget as HTMLAnchorElement).style.opacity = "0.85"}
          onMouseOut={e => (e.currentTarget as HTMLAnchorElement).style.opacity = "1"}
        >
          Start your free AI Audit →
        </a>
      </div>
    </div>
  );
}
