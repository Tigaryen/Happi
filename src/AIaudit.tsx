import { useState, useEffect, type CSSProperties } from "react";

/* ─── BRAND TOKENS (from happiai.co.uk) ─── */
const C = {
  bg: "#f0faf4",
  gradStart: "#e0f5e8",
  gradMid: "#e8f7e4",
  gradEnd: "#f0f9e6",
  card: "#edf8f0",
  border: "#c8e6cf",
  text: "#0a1a0f",
  textMid: "#1a2e20",
  muted: "#5a7a64",
  accent: "#2dd4a0",
  accentDark: "#1aab80",
  cta: "#0f1f14",
  ctaText: "#ffffff",
  white: "#ffffff",
  red: "#e54d4d",
  amber: "#e5a820",
  green: "#2dd4a0",
  greenBg: "#edf8f0",
  amberBg: "#fefaed",
  redBg: "#fef2f2",
};

/* ─── TYPE DEFINITIONS ─── */
interface ScoredOption {
  label: string;
  score: number | null;
}

type QuestionOption = string | ScoredOption;

type Pillar = "knowledge" | "efficiency" | "strategy";

interface Question {
  id: string;
  question: string;
  type: "single" | "multi";
  pillar: Pillar | null;
  subtitle?: string;
  hasOther?: boolean;
  maxSelect?: number;
  options: QuestionOption[];
  scoring?: (selections: string[]) => number;
}

type Answers = Record<string, string | string[]>;

interface LeadInfo {
  name: string;
  email: string;
  company: string;
}

interface Scores {
  overall: number;
  knowledge: number;
  efficiency: number;
  strategy: number;
}

interface Insight {
  type: "risk" | "cost" | "gap";
  text: string;
}

type Stage = "welcome" | "select_type" | "quiz" | "lead_capture" | "results";
type UserType = "employee" | "business" | null;

/* ─── QUESTION DATA ─── */
const EMPLOYEE_QUESTIONS: Question[] = [
  { id: "role", question: "What's your role?", type: "single", hasOther: true, options: ["Operations / Admin", "Marketing / Content", "Sales / Business Development", "Finance / Accounting", "Customer Service", "Technical / IT", "Management / Leadership"], pillar: null },
  { id: "ai_frequency", question: "How often do you use AI tools in your work?", type: "single", options: [{ label: "Daily", score: 4 }, { label: "A few times a week", score: 3 }, { label: "Occasionally", score: 2 }, { label: "Never", score: 0 }, { label: "I've tried but stopped", score: 1 }], pillar: "knowledge" },
  { id: "tools_used", question: "Which AI tools have you used?", subtitle: "Tick all that apply", type: "multi", hasOther: true, options: ["ChatGPT", "Claude", "Gemini", "Microsoft Copilot", "Midjourney / DALL-E", "Perplexity", "Jasper", "Notion AI", "None"], pillar: "knowledge", scoring: (sel) => { if (sel.includes("None")) return 0; if (sel.length >= 4) return 4; if (sel.length >= 2) return 3; if (sel.length >= 1) return 2; return 0; } },
  { id: "ai_usage", question: "What do you mainly use AI for?", subtitle: "Tick all that apply", type: "multi", hasOther: true, options: [{ label: "Writing / editing content", score: 1 }, { label: "Research / summarising", score: 1 }, { label: "Data analysis", score: 1 }, { label: "Email drafting", score: 1 }, { label: "Brainstorming / ideation", score: 1 }, { label: "Coding / technical tasks", score: 1 }, { label: "Image / design generation", score: 1 }, { label: "I don't really know how to use it properly", score: 0 }, { label: "I don't use it", score: 0 }], pillar: "knowledge", scoring: (sel) => { if (sel.some(s => s === "I don't really know how to use it properly" || s === "I don't use it")) return 1; if (sel.length >= 5) return 4; if (sel.length >= 3) return 3; if (sel.length >= 1) return 2; return 0; } },
  { id: "repetitive_hours", question: "How many hours per week do you spend on repetitive tasks that could be automated?", type: "single", options: [{ label: "0\u20132 hours", score: 4 }, { label: "3\u20135 hours", score: 3 }, { label: "6\u201310 hours", score: 1 }, { label: "10+ hours", score: 0 }, { label: "No idea", score: 1 }], pillar: "efficiency" },
  { id: "employer_training", question: "Has your employer provided any AI training or guidelines?", type: "single", options: [{ label: "Yes, formal training", score: 4 }, { label: "Some informal guidance", score: 2 }, { label: "No, nothing", score: 0 }, { label: "I'm self-employed (N/A)", score: null }], pillar: "strategy" },
  { id: "barriers", question: "What's your biggest barrier to using AI more?", type: "single", hasOther: true, options: [{ label: "Don't know where to start", score: 0 }, { label: "Don't trust the output", score: 1 }, { label: "No time to learn", score: 1 }, { label: "My company doesn't support it", score: 0 }, { label: "Privacy / data concerns", score: 2 }, { label: "Nothing, I'm using it well", score: 4 }], pillar: "strategy" },
  { id: "ai_benefit", question: "Where do you think AI could benefit you the most?", subtitle: "Pick up to 3", type: "multi", maxSelect: 3, hasOther: true, options: ["Saving time on repetitive tasks", "Improving the quality of my output", "Learning new skills faster", "Staying competitive in my field", "Earning more / taking on more clients", "I'm not sure yet"], pillar: null },
  { id: "confidence", question: "How confident are you that you're getting the most out of AI?", type: "single", options: [{ label: "Very confident", score: 4 }, { label: "Somewhat confident", score: 3 }, { label: "Not confident at all", score: 1 }, { label: "I don't know what \"the most\" even looks like", score: 0 }], pillar: "knowledge" },
];

const BUSINESS_QUESTIONS: Question[] = [
  { id: "industry", question: "What industry are you in?", type: "single", hasOther: true, options: ["Professional Services", "Retail / E-commerce", "Construction / Trades", "Healthcare / Wellness", "Hospitality / Food", "Creative / Media", "Tech / SaaS"], pillar: null },
  { id: "team_size", question: "How many people work in your business?", type: "single", options: ["Just me", "2\u20135", "6\u201320", "21\u201350", "50+"], pillar: null },
  { id: "revenue", question: "What's your approximate annual revenue?", type: "single", options: ["Under \u00a3100k", "\u00a3100k \u2013 \u00a3500k", "\u00a3500k \u2013 \u00a31M", "\u00a31M \u2013 \u00a35M", "\u00a35M+", "Prefer not to say"], pillar: null },
  { id: "tools_used", question: "Which AI tools is your team currently using?", subtitle: "Tick all that apply", type: "multi", hasOther: true, options: ["ChatGPT", "Claude", "Gemini", "Microsoft Copilot", "Midjourney / DALL-E", "Perplexity", "Jasper", "Notion AI", "HubSpot AI / CRM AI features", "Zapier / Make (AI automations)", "None", "I don't know what my team uses"], pillar: "knowledge", scoring: (sel) => { if (sel.includes("I don't know what my team uses")) return 0; if (sel.includes("None")) return 0; if (sel.length >= 4) return 4; if (sel.length >= 2) return 3; if (sel.length >= 1) return 2; return 0; } },
  { id: "ai_usage_structure", question: "How is your team using AI right now?", type: "single", options: [{ label: "Structured, with clear use cases", score: 4 }, { label: "Ad hoc \u2014 people experimenting individually", score: 2 }, { label: "Barely \u2014 a few people dabbling", score: 1 }, { label: "Not at all", score: 0 }, { label: "I genuinely don't know", score: 0 }], pillar: "knowledge" },
  { id: "ai_policy", question: "Do you have an AI policy or usage guidelines?", type: "single", options: [{ label: "Yes", score: 4 }, { label: "No", score: 0 }, { label: "What do you mean?", score: 0 }], pillar: "strategy" },
  { id: "time_drains", question: "Which areas consume the most team time?", subtitle: "Pick your top 3", type: "multi", maxSelect: 3, hasOther: true, options: ["Admin / scheduling", "Email / communications", "Reporting / data work", "Content creation", "Customer queries / support", "Invoicing / finance", "Lead gen / sales outreach", "Onboarding / HR"], pillar: null },
  { id: "wasted_hours", question: "How many hours per week does your team waste on tasks that could be automated?", type: "single", options: [{ label: "0\u20135 hours", score: 4 }, { label: "5\u201315 hours", score: 2 }, { label: "15\u201330 hours", score: 1 }, { label: "30+ hours", score: 0 }, { label: "No idea", score: 1 }], pillar: "efficiency" },
  { id: "workflows_mapped", question: "Have you mapped out your core business processes?", type: "single", options: [{ label: "Yes, fully documented", score: 4 }, { label: "Partially", score: 2 }, { label: "No", score: 0 }, { label: "What does that mean?", score: 0 }], pillar: "efficiency" },
  { id: "team_training", question: "Has your team received any AI training?", type: "single", options: [{ label: "Yes, structured training", score: 4 }, { label: "Some informal learning", score: 2 }, { label: "No", score: 0 }, { label: "I've thought about it but haven't acted", score: 1 }], pillar: "knowledge" },
  { id: "ai_benefit", question: "Where do you think AI could most benefit your business?", subtitle: "Pick up to 3", type: "multi", maxSelect: 3, hasOther: true, options: ["Reducing operational costs", "Speeding up repetitive tasks", "Improving customer experience", "Generating more leads / sales", "Better data and reporting", "Freeing up my own time as the owner", "Upskilling my team", "I honestly don't know yet"], pillar: null },
  { id: "concerns", question: "What's your biggest concern about AI adoption?", subtitle: "Pick up to 2", type: "multi", maxSelect: 2, hasOther: true, options: ["Cost of implementation", "Data security / privacy", "Staff resistance", "Don't know where to start", "Worried it won't work for my business", "Replacing jobs / ethical concerns"], pillar: null },
  { id: "ai_strategy", question: "Do you have a strategy or roadmap for AI?", type: "single", options: [{ label: "Yes, clear plan in place", score: 4 }, { label: "Loosely \u2014 nothing formal", score: 2 }, { label: "No", score: 0 }, { label: "I didn't know I needed one", score: 0 }], pillar: "strategy" },
  { id: "self_rating", question: "How would you rate your business's AI readiness?", type: "single", options: [{ label: "Ahead of the curve", score: 4 }, { label: "Keeping up", score: 3 }, { label: "Falling behind", score: 1 }, { label: "Completely lost", score: 0 }], pillar: "strategy" },
];

function getLabel(opt: QuestionOption): string { return typeof opt === "string" ? opt : opt.label; }
function getScore(opt: QuestionOption): number | null { return typeof opt === "string" ? null : opt.score; }

function calcScores(answers: Answers, questions: Question[]): Scores {
  const p: Record<Pillar, number[]> = { knowledge: [], efficiency: [], strategy: [] };
  questions.forEach((q) => {
    if (!q.pillar) return;
    const a = answers[q.id]; if (!a) return;
    let s = 0;
    if (q.scoring && q.type === "multi") { s = q.scoring(Array.isArray(a) ? a : []); }
    else if (q.type === "single") { const opt = q.options.find((o) => getLabel(o) === a); if (opt) { const v = getScore(opt); if (v !== null) s = v; } }
    p[q.pillar].push(s);
  });
  const avg = (arr: number[]): number => { if (!arr.length) return 0; return Math.round((arr.reduce((a, b) => a + b, 0) / (arr.length * 4)) * 100); };
  const k = avg(p.knowledge), e = avg(p.efficiency), st = avg(p.strategy);
  return { overall: Math.round((k + e + st) / 3), knowledge: k, efficiency: e, strategy: st };
}

function getInsights(scores: Scores, answers: Answers, userType: UserType): Insight[] {
  const ins: Insight[] = [];
  if (userType === "business") {
    if (answers.ai_policy === "No" || answers.ai_policy === "What do you mean?") ins.push({ type: "risk", text: "You have no AI policy in place. Your team may already be putting sensitive data into AI tools without guardrails." });
    if ((Array.isArray(answers.tools_used) && answers.tools_used.includes("I don't know what my team uses")) || answers.ai_usage_structure === "I genuinely don't know") ins.push({ type: "risk", text: "You don't have visibility on how your team is using AI. That's a governance blind spot." });
    if (answers.wasted_hours === "15\u201330 hours" || answers.wasted_hours === "30+ hours") { const h = answers.wasted_hours === "30+ hours" ? "30+" : "15-30"; ins.push({ type: "cost", text: `Your team is losing an estimated ${h} hours per week to tasks that could be automated. That's real money walking out the door.` }); }
    if (answers.ai_strategy === "No" || answers.ai_strategy === "I didn't know I needed one") ins.push({ type: "gap", text: "You don't have an AI strategy. Your competitors likely do, or will soon." });
    if (answers.team_training === "No" || answers.team_training === "I've thought about it but haven't acted") ins.push({ type: "gap", text: "Your team hasn't had AI training. They're either not using it (wasted potential) or using it unsupervised (risk)." });
  } else {
    if (answers.ai_frequency === "Never" || answers.ai_frequency === "I've tried but stopped") ins.push({ type: "gap", text: "You're not using AI in your day-to-day work. In 2026, that's a competitive disadvantage." });
    if (answers.confidence === "I don't know what \"the most\" even looks like") ins.push({ type: "gap", text: "You don't yet know what good AI usage looks like. That's the biggest unlock we help with." });
    if (answers.employer_training === "No, nothing") ins.push({ type: "risk", text: "Your employer hasn't provided any AI training. You're expected to figure it out alone." });
    if (answers.repetitive_hours === "6\u201310 hours" || answers.repetitive_hours === "10+ hours") ins.push({ type: "cost", text: "You're spending significant time on repetitive tasks. AI could claw back hours every single week." });
  }
  if (!ins.length) ins.push({ type: "gap", text: "You're further along than most, but there are still gaps between where you are and where AI could take you." });
  return ins.slice(0, 3);
}

interface PillarBarProps {
  label: string;
  score: number;
  icon: string;
}

function PillarBar({ label, score, icon }: PillarBarProps) {
  const tl = score >= 65 ? { c: C.green } : score >= 35 ? { c: C.amber } : { c: C.red };
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(score), 150); return () => clearTimeout(t); }, [score]);
  return (
    <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: "18px 22px", marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={{ color: C.text, fontSize: 14, fontWeight: 600 }}>{icon} {label}</span>
        <span style={{ color: tl.c, fontSize: 22, fontWeight: 800, fontFamily: "'Anybody', sans-serif" }}>{score}</span>
      </div>
      <div style={{ height: 8, background: "#dceee0", borderRadius: 4, overflow: "hidden" }}>
        <div style={{ width: `${w}%`, height: "100%", background: tl.c, borderRadius: 4, transition: "width 1s cubic-bezier(0.25,0.46,0.45,0.94)" }} />
      </div>
    </div>
  );
}

export default function AIAudit() {
  const [stage, setStage] = useState<Stage>("welcome");
  const [userType, setUserType] = useState<UserType>(null);
  const [currentQ, setCurrentQ] = useState<number>(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [otherInputs, setOtherInputs] = useState<Record<string, string>>({});
  const [leadInfo, setLeadInfo] = useState<LeadInfo>({ name: "", email: "", company: "" });
  const [scores, setScores] = useState<Scores | null>(null);
  const [fadeIn, setFadeIn] = useState<boolean>(true);
  const [selectedMulti, setSelectedMulti] = useState<string[]>([]);

  const questions = userType === "business" ? BUSINESS_QUESTIONS : EMPLOYEE_QUESTIONS;
  const question = questions[currentQ] as Question;

  function transition(cb: () => void): void { setFadeIn(false); setTimeout(() => { cb(); setFadeIn(true); }, 200); }
  function handleSingle(v: string): void { const a = { ...answers, [question.id]: v }; setAnswers(a); setTimeout(() => advance(a), 250); }
  function toggleMulti(v: string): void { setSelectedMulti(p => { const max = question.maxSelect || 999; if (p.includes(v)) return p.filter(x => x !== v); if (p.length >= max) return p; return [...p, v]; }); }
  function confirmMulti(): void { let f = [...selectedMulti]; if (otherInputs[question.id]?.trim()) f.push(otherInputs[question.id].trim()); setAnswers(a => ({ ...a, [question.id]: f })); advance(); }
  function advance(_?: Answers): void { transition(() => { if (currentQ < questions.length - 1) { setCurrentQ(currentQ + 1); setSelectedMulti([]); } else { setStage("lead_capture"); } }); }
  function goBack(): void { if (currentQ > 0) transition(() => { const pq = questions[currentQ - 1]; setCurrentQ(currentQ - 1); const prevId = pq?.id; setSelectedMulti(prevId && Array.isArray(answers[prevId]) ? (answers[prevId] as string[]) : []); }); }
  function submitLead(): void {
    if (!leadInfo.name.trim() || !leadInfo.email.trim()) return;
    const s = calcScores(answers, questions);
    setScores(s);
    // Send everything to Formspree
    const payload = {
      _subject: `New AI Audit: ${leadInfo.name} (${userType})`,
      name: leadInfo.name,
      email: leadInfo.email,
      company: leadInfo.company || "Not provided",
      user_type: userType,
      overall_score: s.overall,
      knowledge_score: s.knowledge,
      efficiency_score: s.efficiency,
      strategy_score: s.strategy,
      ...Object.fromEntries(
        Object.entries(answers).map(([k, v]) => [k, Array.isArray(v) ? v.join(", ") : v])
      ),
    };
    fetch("https://formspree.io/f/mwvwyrdn", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(() => {});
    transition(() => setStage("results"));
  }

  const fade: CSSProperties = { opacity: fadeIn ? 1 : 0, transform: fadeIn ? "translateY(0)" : "translateY(10px)", transition: "opacity 0.25s ease, transform 0.25s ease" };
  const optBtn = (on: boolean): CSSProperties => ({ width: "100%", textAlign: "left", padding: "14px 18px", borderRadius: 12, fontSize: 15, fontWeight: 500, cursor: "pointer", border: `1.5px solid ${on ? C.accent : C.border}`, background: on ? C.greenBg : C.white, color: C.text, marginBottom: 6, transition: "all 0.15s ease", fontFamily: "inherit", lineHeight: 1.4 });
  const cta: CSSProperties = { width: "100%", padding: "16px 24px", borderRadius: 50, fontSize: 16, fontWeight: 700, cursor: "pointer", border: "none", background: C.cta, color: C.ctaText, textAlign: "center", fontFamily: "inherit", transition: "all 0.2s ease" };
  const inp: CSSProperties = { width: "100%", padding: "14px 18px", borderRadius: 12, border: `1.5px solid ${C.border}`, background: C.white, color: C.text, fontSize: 15, fontFamily: "inherit", outline: "none", boxSizing: "border-box", marginBottom: 10 };

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(145deg, ${C.gradStart} 0%, ${C.gradMid} 50%, ${C.gradEnd} 100%)`, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Anybody:wght@700;800&display=swap" rel="stylesheet" />
      <div style={{ width: "100%", maxWidth: 540 }}>

        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <span style={{ fontSize: 22, fontWeight: 800, color: C.text, letterSpacing: "-0.02em" }}>happi</span>
        </div>

        {stage === "welcome" && (
          <div style={fade}>
            <div style={{ background: `${C.accent}18`, display: "inline-block", padding: "6px 16px", borderRadius: 50, fontSize: 12, fontWeight: 700, color: C.accentDark, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 20, marginLeft: "50%", transform: "translateX(-50%)" }}>AI THAT ACTUALLY WORKS</div>
            <h1 style={{ color: C.text, fontSize: 38, fontWeight: 800, lineHeight: 1.1, textAlign: "center", marginBottom: 14, letterSpacing: "-0.03em" }}>AI Readiness<br />Audit.</h1>
            <p style={{ color: C.muted, fontSize: 16, textAlign: "center", marginBottom: 36, lineHeight: 1.6 }}>Find out how AI-ready you really are.<br />Takes 2-3 minutes. Brutally honest.</p>
            <button style={cta} onClick={() => transition(() => setStage("select_type"))} onMouseOver={e => (e.target as HTMLButtonElement).style.background = "#1a3020"} onMouseOut={e => (e.target as HTMLButtonElement).style.background = C.cta}>Start my audit →</button>
          </div>
        )}

        {stage === "select_type" && (
          <div style={fade}>
            <h2 style={{ color: C.text, fontSize: 24, fontWeight: 700, textAlign: "center", marginBottom: 6 }}>Which best describes you?</h2>
            <p style={{ color: C.muted, fontSize: 14, textAlign: "center", marginBottom: 28 }}>We'll tailor the audit to your situation.</p>
            {[{ t: "employee" as const, title: "Employee or Freelancer", sub: "I want to level up my own AI skills" }, { t: "business" as const, title: "Business Owner", sub: "I want to see where AI fits in my business" }].map(({ t, title, sub }) => (
              <button key={t} style={{ ...optBtn(false), padding: "20px 22px", marginBottom: 10, display: "flex", flexDirection: "column", gap: 3 }}
                onClick={() => transition(() => { setUserType(t); setStage("quiz"); setCurrentQ(0); setAnswers({}); })}
                onMouseOver={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.background = C.greenBg; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.white; }}>
                <span style={{ fontSize: 17, fontWeight: 700, color: C.text }}>{title}</span>
                <span style={{ fontSize: 13, color: C.muted, fontWeight: 400 }}>{sub}</span>
              </button>
            ))}
          </div>
        )}

        {stage === "quiz" && question && (
          <div style={fade}>
            <div style={{ marginBottom: 26 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ color: C.muted, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em" }}>QUESTION {currentQ + 1} OF {questions.length}</span>
                <span style={{ color: C.muted, fontSize: 11, fontWeight: 700 }}>{Math.round(((currentQ + 1) / questions.length) * 100)}%</span>
              </div>
              <div style={{ height: 4, background: "#d4e8d8", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ width: `${((currentQ + 1) / questions.length) * 100}%`, height: "100%", background: C.accent, borderRadius: 2, transition: "width 0.4s ease" }} />
              </div>
            </div>

            <h2 style={{ color: C.text, fontSize: 20, fontWeight: 700, marginBottom: question.subtitle ? 4 : 20, lineHeight: 1.3 }}>{question.question}</h2>
            {question.subtitle && <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>{question.subtitle}</p>}

            {question.options.map((opt, i) => {
              const label = getLabel(opt);
              const isM = question.type === "multi";
              const sel = isM ? selectedMulti.includes(label) : answers[question.id] === label;
              return (
                <button key={i} style={optBtn(sel)} onClick={() => isM ? toggleMulti(label) : handleSingle(label)}
                  onMouseOver={e => { if (!sel) e.currentTarget.style.borderColor = C.accent + "88"; }}
                  onMouseOut={e => { if (!sel) e.currentTarget.style.borderColor = C.border; }}>
                  {isM && <span style={{ display: "inline-block", width: 18, height: 18, borderRadius: 4, border: `2px solid ${sel ? C.accent : C.border}`, background: sel ? C.accent : "transparent", marginRight: 10, verticalAlign: "middle", position: "relative", top: -1 }}>{sel && <span style={{ position: "absolute", top: 0, left: 3, fontSize: 12, color: C.white, fontWeight: 800 }}>✓</span>}</span>}
                  {label}
                </button>
              );
            })}

            {question.hasOther && (
              <div style={{ marginTop: 2 }}>
                <input style={inp} placeholder="Other (type your answer)" value={otherInputs[question.id] || ""}
                  onChange={e => setOtherInputs(p => ({ ...p, [question.id]: e.target.value }))}
                  onFocus={e => (e.target as HTMLInputElement).style.borderColor = C.accent} onBlur={e => (e.target as HTMLInputElement).style.borderColor = C.border}
                  onKeyDown={e => { if (e.key === "Enter" && question.type === "single" && otherInputs[question.id]?.trim()) handleSingle(otherInputs[question.id].trim()); }} />
                {question.type === "single" && otherInputs[question.id]?.trim() && (
                  <button style={{ ...cta, fontSize: 14, padding: "12px 20px", marginTop: 2 }} onClick={() => handleSingle(otherInputs[question.id].trim())}>Continue with this answer</button>
                )}
              </div>
            )}

            {question.type === "multi" && (selectedMulti.length > 0 || otherInputs[question.id]?.trim()) && (
              <button style={{ ...cta, marginTop: 14 }} onClick={confirmMulti}>Continue →</button>
            )}

            {currentQ > 0 && <button style={{ background: "transparent", border: "none", color: C.muted, fontSize: 13, cursor: "pointer", marginTop: 14, fontFamily: "inherit", padding: "8px 0" }} onClick={goBack}>← Back</button>}
          </div>
        )}

        {stage === "lead_capture" && (
          <div style={fade}>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 56, height: 56, borderRadius: "50%", background: C.greenBg, border: `2px solid ${C.accent}`, marginBottom: 16, fontSize: 26 }}>✓</div>
              <h2 style={{ color: C.text, fontSize: 24, fontWeight: 700, marginBottom: 6 }}>Your results are ready.</h2>
              <p style={{ color: C.muted, fontSize: 15, lineHeight: 1.5 }}>Enter your details to see your AI Readiness Score.</p>
            </div>
            <input style={inp} placeholder="Your name *" value={leadInfo.name} onFocus={e => (e.target as HTMLInputElement).style.borderColor = C.accent} onBlur={e => (e.target as HTMLInputElement).style.borderColor = C.border} onChange={e => setLeadInfo(p => ({ ...p, name: e.target.value }))} />
            <input style={inp} placeholder="Email address *" type="email" value={leadInfo.email} onFocus={e => (e.target as HTMLInputElement).style.borderColor = C.accent} onBlur={e => (e.target as HTMLInputElement).style.borderColor = C.border} onChange={e => setLeadInfo(p => ({ ...p, email: e.target.value }))} />
            <input style={inp} placeholder="Company name (optional)" value={leadInfo.company} onFocus={e => (e.target as HTMLInputElement).style.borderColor = C.accent} onBlur={e => (e.target as HTMLInputElement).style.borderColor = C.border} onChange={e => setLeadInfo(p => ({ ...p, company: e.target.value }))} />
            <button style={{ ...cta, marginTop: 6, opacity: leadInfo.name.trim() && leadInfo.email.trim() ? 1 : 0.4 }} onClick={submitLead} disabled={!leadInfo.name.trim() || !leadInfo.email.trim()}>Show my results →</button>
            <p style={{ color: C.muted, fontSize: 11, textAlign: "center", marginTop: 10 }}>We'll never spam you. Your data stays private.</p>
          </div>
        )}

        {stage === "results" && scores && (
          <div style={fade}>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 130, height: 130, borderRadius: "50%", border: `5px solid ${scores.overall >= 65 ? C.green : scores.overall >= 35 ? C.amber : C.red}`, background: C.white, marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: 42, fontWeight: 800, color: C.text, fontFamily: "'Anybody', sans-serif", lineHeight: 1 }}>{scores.overall}</div>
                  <div style={{ fontSize: 11, color: C.muted, fontWeight: 700, letterSpacing: "0.1em" }}>OUT OF 100</div>
                </div>
              </div>
              <h2 style={{ color: C.text, fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Your AI Readiness Score</h2>
              <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.5 }}>
                {scores.overall >= 65 ? "You're ahead of most. But there's still ground to cover." : scores.overall >= 35 ? "There are clear gaps. The good news: they're fixable." : "There's significant ground to make up. But that also means significant opportunity."}
              </p>
            </div>

            <PillarBar label="Knowledge & Tools" score={scores.knowledge} icon="🧠" />
            <PillarBar label="Efficiency & Automation" score={scores.efficiency} icon="⚡" />
            <PillarBar label="Strategy & Governance" score={scores.strategy} icon="🎯" />

            <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: "20px 22px", marginTop: 16, marginBottom: 16 }}>
              <h3 style={{ color: C.accentDark, fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 14 }}>Key Findings</h3>
              {getInsights(scores, answers, userType).map((ins, i) => (
                <div key={i} style={{ display: "flex", gap: 10, marginBottom: i < 2 ? 12 : 0, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 14, flexShrink: 0, marginTop: 2 }}>{ins.type === "risk" ? "🔴" : ins.type === "cost" ? "💸" : "🟡"}</span>
                  <p style={{ color: C.textMid, fontSize: 14, lineHeight: 1.55, margin: 0 }}>{ins.text}</p>
                </div>
              ))}
            </div>

            <div style={{ background: C.white, border: `1.5px solid ${C.accent}44`, borderLeft: `4px solid ${C.accent}`, borderRadius: 14, padding: "20px 22px", marginBottom: 20 }}>
              <h3 style={{ color: C.text, fontSize: 15, fontWeight: 700, marginBottom: 10 }}>What we found but can't show you here:</h3>
              <div style={{ color: C.textMid, fontSize: 14, lineHeight: 1.8 }}>
                <div>⚡ {userType === "business" ? "3 quick-win automations for your industry" : "3 AI tools that would transform your daily workflow"}</div>
                <div>⚡ {userType === "business" ? "Estimated cost savings based on your team size" : "A personal AI action plan for your role"}</div>
                <div>⚡ {userType === "business" ? "A prioritised AI roadmap for your business" : "How to position yourself as the AI champion at work"}</div>
              </div>
            </div>

            <a href="https://calendar.app.google/rvpBfvZKNJncEtEW9" target="_blank" rel="noopener noreferrer" style={{ ...cta, display: "block", textDecoration: "none", fontSize: 17, padding: "18px 24px" }}>Book your AI consultation →</a>
            <p style={{ color: C.muted, fontSize: 12, textAlign: "center", marginTop: 12, lineHeight: 1.5 }}>30 minutes. No obligation. We'll walk through your full<br />results and show you exactly where to start.</p>
          </div>
        )}
      </div>
    </div>
  );
}
