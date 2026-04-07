import { useState, useEffect, type CSSProperties } from 'react';

const BOOKING_URL = 'https://calendar.app.google/TdxyHqMF8YL59KXL9';

const C = {
  bg: '#edf8f1',
  text: '#0a1a0f',
  accent: '#2dd4a0',
  accentDark: '#1aab80',
  cta: '#0f1f14',
  ctaHover: '#1a3020',
  border: '#c8e6cf',
  muted: '#5a7a64',
  white: '#ffffff',
  inputBg: '#f5fbf7',
};

const font: CSSProperties = {
  fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
};

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Tab = 'message' | 'book';
type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [tab, setTab] = useState<Tab>('message');
  const [status, setStatus] = useState<FormStatus>('idle');
  const [ctaHovered, setCtaHovered] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });

  // Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Reset when closed
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStatus('idle');
        setForm({ name: '', email: '', phone: '', message: '' });
        setTab('message');
      }, 300);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      const res = await fetch('https://formspree.io/f/mvzvrkey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: `New Contact: ${form.name}`,
          name: form.name,
          email: form.email,
          phone: form.phone.trim() || 'Not provided',
          message: form.message,
        }),
      });
      setStatus(res.ok ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  };

  if (!isOpen) return null;

  const inputStyle: CSSProperties = {
    ...font,
    width: '100%',
    padding: '14px 16px',
    borderRadius: 12,
    border: `1.5px solid ${C.border}`,
    background: C.inputBg,
    color: C.text,
    fontSize: 15,
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s ease',
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(10, 26, 15, 0.55)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
        }}
      />

      {/* Card — full screen on mobile, centered card on sm+ */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 520,
          maxHeight: '100dvh',
          overflowY: 'auto',
          background: C.bg,
          borderRadius: '20px 20px 0 0',
          padding: '32px 28px 40px',
          boxShadow: '0 -8px 40px rgba(10, 26, 15, 0.18)',
          ...font,
        }}
        className="contact-modal-card"
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            width: 36,
            height: 36,
            borderRadius: '50%',
            border: `1.5px solid ${C.border}`,
            background: C.white,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
            color: C.muted,
            lineHeight: 1,
            ...font,
          }}
        >
          ×
        </button>

        {/* Heading */}
        <h2 style={{ color: C.text, fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 6, marginTop: 4 }}>
          Get in Touch
        </h2>
        <p style={{ color: C.muted, fontSize: 14, marginBottom: 24 }}>
          Send us a message or book a call — whatever works for you.
        </p>

        {/* Tab switcher */}
        <div style={{
          display: 'flex',
          gap: 6,
          background: '#d8f0e3',
          borderRadius: 50,
          padding: 4,
          marginBottom: 28,
        }}>
          {(['message', 'book'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                flex: 1,
                padding: '10px 16px',
                borderRadius: 50,
                border: 'none',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 700,
                transition: 'all 0.2s ease',
                background: tab === t ? C.cta : 'transparent',
                color: tab === t ? C.white : C.muted,
                ...font,
              }}
            >
              {t === 'message' ? 'Send a Message' : 'Book a Meeting'}
            </button>
          ))}
        </div>

        {/* ── Send a Message tab ── */}
        {tab === 'message' && (
          <>
            {status === 'success' ? (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <div style={{
                  width: 56, height: 56, borderRadius: '50%',
                  background: `${C.accent}22`, border: `2px solid ${C.accent}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 24, margin: '0 auto 16px',
                }}>✓</div>
                <h3 style={{ color: C.text, fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Message sent!</h3>
                <p style={{ color: C.muted, fontSize: 15 }}>We'll be in touch shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <input
                  required
                  type="text"
                  placeholder="Name *"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  style={inputStyle}
                  onFocus={e => (e.target as HTMLInputElement).style.borderColor = C.accent}
                  onBlur={e => (e.target as HTMLInputElement).style.borderColor = C.border}
                />
                <input
                  required
                  type="email"
                  placeholder="Email *"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  style={inputStyle}
                  onFocus={e => (e.target as HTMLInputElement).style.borderColor = C.accent}
                  onBlur={e => (e.target as HTMLInputElement).style.borderColor = C.border}
                />
                <input
                  type="tel"
                  placeholder="Phone (optional)"
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  style={inputStyle}
                  onFocus={e => (e.target as HTMLInputElement).style.borderColor = C.accent}
                  onBlur={e => (e.target as HTMLInputElement).style.borderColor = C.border}
                />
                <textarea
                  required
                  placeholder="Message *"
                  rows={4}
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  style={{ ...inputStyle, resize: 'none', lineHeight: 1.5 }}
                  onFocus={e => (e.target as HTMLTextAreaElement).style.borderColor = C.accent}
                  onBlur={e => (e.target as HTMLTextAreaElement).style.borderColor = C.border}
                />
                {status === 'error' && (
                  <p style={{ color: '#e54d4d', fontSize: 13, margin: 0 }}>Something went wrong. Please try again.</p>
                )}
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  onMouseEnter={() => setCtaHovered(true)}
                  onMouseLeave={() => setCtaHovered(false)}
                  style={{
                    ...font,
                    marginTop: 4,
                    width: '100%',
                    padding: '16px 24px',
                    borderRadius: 50,
                    border: 'none',
                    background: ctaHovered && status !== 'submitting' ? C.ctaHover : C.cta,
                    color: C.white,
                    fontSize: 16,
                    fontWeight: 700,
                    cursor: status === 'submitting' ? 'not-allowed' : 'pointer',
                    opacity: status === 'submitting' ? 0.7 : 1,
                    transition: 'background 0.2s ease',
                  }}
                >
                  {status === 'submitting' ? 'Sending…' : 'Send Message →'}
                </button>
              </form>
            )}
          </>
        )}

        {/* ── Book a Meeting tab ── */}
        {tab === 'book' && (
          <div style={{ textAlign: 'center', padding: '16px 0 8px' }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: `${C.accent}22`, border: `2px solid ${C.accent}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28, margin: '0 auto 20px',
            }}>📅</div>
            <h3 style={{ color: C.text, fontSize: 20, fontWeight: 800, marginBottom: 12, letterSpacing: '-0.02em' }}>
              Schedule a call
            </h3>
            <p style={{ color: C.muted, fontSize: 15, lineHeight: 1.6, marginBottom: 28, maxWidth: 360, margin: '0 auto 28px' }}>
              Schedule a 30-minute call. No pitch, no pressure. Just honest advice on where AI can make the biggest difference.
            </p>
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                ...font,
                display: 'inline-block',
                background: C.cta,
                color: C.white,
                padding: '16px 32px',
                borderRadius: 50,
                fontSize: 16,
                fontWeight: 700,
                textDecoration: 'none',
                transition: 'background 0.2s ease',
              }}
              onMouseEnter={e => (e.currentTarget).style.background = C.ctaHover}
              onMouseLeave={e => (e.currentTarget).style.background = C.cta}
            >
              Pick a Time →
            </a>
          </div>
        )}
      </div>

      {/* Responsive: on sm+ screens, show as centered card with rounded corners all around */}
      <style>{`
        @media (min-width: 640px) {
          .contact-modal-card {
            border-radius: 20px !important;
            margin-bottom: auto !important;
            align-self: center !important;
          }
        }
        /* Fix parent alignment for desktop */
        @media (min-width: 640px) {
          .contact-modal-card {
            margin: auto;
          }
        }
      `}</style>
    </div>
  );
}
