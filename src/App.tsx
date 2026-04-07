import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Menu, X, Plus, Minus } from 'lucide-react';
import StatsBanner from './StatsBanner';
import AuditBanner from './AuditBanner';
import ContactModal from './ContactModal';

const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`border border-happi-accent rounded-2xl mb-4 overflow-hidden bg-white transition-all duration-300 ${isOpen ? 'shadow-[0_0_30px_rgba(16,185,129,0.2)]' : 'hover:shadow-[0_0_20px_rgba(16,185,129,0.1)]'}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-6 text-left transition-all duration-300 ${isOpen ? 'bg-gradient-to-r from-happi-secondary/40 to-happi-primary/20' : 'hover:bg-happi-bg'}`}
      >
        <span className="text-lg font-bold">{question}</span>
        {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="p-6 pt-0 text-happi-muted leading-relaxed">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


const GrainyGradient = ({ mousePos }: { mousePos: { x: number, y: number } }) => {
  const normalizedMouse = {
    x: (mousePos.x / (typeof window !== 'undefined' ? window.innerWidth : 1)) - 0.5,
    y: (mousePos.y / (typeof window !== 'undefined' ? window.innerHeight : 1)) - 0.5,
  };

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none bg-happi-bg">
      {/* Animated Blobs - Green/Lime Tones */}
      <motion.div
        animate={{
          x: normalizedMouse.x * 120,
          y: normalizedMouse.y * 120,
        }}
        transition={{ type: "spring", damping: 40, stiffness: 40 }}
        className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] rounded-full bg-[#10b981]/20 blur-[120px]"
      />
      <motion.div
        animate={{
          x: -normalizedMouse.x * 180,
          y: -normalizedMouse.y * 180,
        }}
        transition={{ type: "spring", damping: 40, stiffness: 40 }}
        className="absolute bottom-[-20%] right-[-10%] w-[90%] h-[90%] rounded-full bg-[#84cc16]/30 blur-[150px]"
      />
      <motion.div
        animate={{
          x: normalizedMouse.x * 250,
          y: -normalizedMouse.y * 150,
        }}
        transition={{ type: "spring", damping: 40, stiffness: 40 }}
        className="absolute top-[10%] right-[5%] w-[50%] h-[50%] rounded-full bg-[#34d399]/20 blur-[100px]"
      />
      <motion.div
        animate={{
          x: -normalizedMouse.x * 100,
          y: normalizedMouse.y * 200,
        }}
        transition={{ type: "spring", damping: 40, stiffness: 40 }}
        className="absolute top-[40%] left-[20%] w-[40%] h-[40%] rounded-full bg-[#bef264]/30 blur-[90px]"
      />

      {/* Interactive Glow Spotlight */}
      <div 
        className="absolute inset-0 z-0 opacity-60 transition-opacity duration-500"
        style={{
          background: `radial-gradient(800px circle at ${mousePos.x}px ${mousePos.y}px, rgba(16, 185, 129, 0.25), transparent 70%)`
        }}
      />

      {/* Grain Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.25] mix-blend-overlay pointer-events-none"
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
        }}
      />
    </div>
  );
};


export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);

    // Throttle mousemove to one update per animation frame — prevents
    // firing hundreds of re-renders per second while the cursor moves
    let rafId: number;
    const handleMouseMove = (e: MouseEvent) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        setMousePos({ x: e.clientX, y: e.clientY });
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const revealProps = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  };

  return (
    <div className="min-h-screen selection:bg-happi-primary selection:text-white">
      {/* Navigation */}
      <nav 
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-happi-bg/80 backdrop-blur-md py-4 border-b border-happi-border' : 'py-6'}`}
        style={{
          background: scrolled 
            ? `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(16, 185, 129, 0.12), transparent 40%), rgba(240, 253, 244, 0.8)`
            : `radial-gradient(800px circle at ${mousePos.x}px ${mousePos.y}px, rgba(16, 185, 129, 0.15), transparent 40%)`
        }}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <a href="#" className="text-2xl font-bold tracking-tight">happi</a>
          
          <div className="hidden md:flex items-center space-x-10">
            <a href="#services" className="text-sm font-medium hover:text-happi-primary transition-colors">Services</a>
            <a href="#results" className="text-sm font-medium hover:text-happi-primary transition-colors">About</a>
            <button
              onClick={() => setIsContactModalOpen(true)}
              className="bg-happi-accent text-white px-8 py-3 rounded-full text-sm font-bold hover:scale-105 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all"
            >
              Get in Touch
            </button>
          </div>

          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label={isMenuOpen ? 'Close menu' : 'Open menu'} aria-expanded={isMenuOpen}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-happi-bg pt-24 px-6 md:hidden"
          >
            <div className="flex flex-col space-y-6">
              <a href="#services" onClick={() => setIsMenuOpen(false)} className="text-2xl font-bold">Services</a>
              <a href="#results" onClick={() => setIsMenuOpen(false)} className="text-2xl font-bold">About Us</a>
              <a href="#contact" onClick={() => setIsMenuOpen(false)} className="text-2xl font-bold">FAQ</a>
              <button
                onClick={() => { setIsMenuOpen(false); setIsContactModalOpen(true); }}
                className="bg-happi-accent text-white w-full py-4 rounded-full font-bold hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all"
              >
                Get in Touch
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden min-h-[90vh] flex items-center">
        <GrainyGradient mousePos={mousePos} />
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div {...revealProps} className="max-w-4xl">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="inline-block bg-happi-primary/20 text-happi-accent px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-8 cursor-default"
            >
              AI That Actually Works
            </motion.div>
            <h1 className="text-6xl md:text-9xl font-black leading-[0.85] tracking-tighter mb-8 text-happi-accent drop-shadow-sm">
              Future-proof <br />
              <span className="text-happi-accent">your business.</span>
            </h1>
            <p className="text-xl text-happi-muted max-w-xl mb-10 leading-relaxed">
              The businesses winning tomorrow are building with AI today. We help you become one of them.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
              <button
                onClick={() => setIsContactModalOpen(true)}
                className="w-full sm:w-auto bg-happi-accent text-white px-10 py-4 rounded-full font-bold hover:scale-105 hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all flex items-center justify-center group"
              >
                Show Me How
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            <p className="text-sm text-happi-muted font-medium">
              Trusted by businesses across the UK
            </p>
          </motion.div>
        </div>
      </section>

      <AuditBanner />

      {/* Stats + Word Rotator Banner */}
      <StatsBanner />

      {/* Services Section */}
      <section id="services" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div {...revealProps} className="md:col-span-1">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-happi-muted mb-4 block">
                What we do
              </span>
              <h2 className="text-5xl font-bold mb-8">How we make AI work for your business</h2>
            </motion.div>

            <div className="md:col-span-2 grid md:grid-cols-2 gap-6 items-stretch">
              {[
                { 
                  title: "01 — AI Education", 
                  desc: "Most teams are ignoring AI or using it wrong. We fix that. Workshops and training that turn your staff into an AI-powered team — fast.",
                  items: ["Half-day and full-day workshops", "Tool onboarding: ChatGPT, Claude, Gemini", "Custom AI playbooks for your team", "Ongoing coaching and support"],
                  color: "bg-white" 
                },
                { 
                  title: "02 — Automation & Agents", 
                  desc: "Stop doing tasks ai could handle. We build custom AI automations and agents that run your repetitive workflows around the clock.",
                  items: ["We learn your business", "Find what's costing you", "Build what fixes it", "From voice to automation", "Custom built for your business"],
                  color: "bg-gradient-to-br from-[#10b981] to-[#059669]", 
                  text: "text-white" 
                },
                { 
                  title: "03 — Website & Branding", 
                  desc: "First impressions happen in 3 seconds. We design websites and brands that convert visitors into customers — built fast, built to last.",
                  items: ["Brand strategy and visual identity", "Website design and development", "Copy that converts", "SEO optimised from day one", "Launch-ready in weeks, not months"],
                  color: "bg-white" 
                }
              ].map((service, idx) => (
                <motion.div 
                  key={idx}
                  {...revealProps}
                  transition={{ ...revealProps.transition, delay: idx * 0.1 }}
                  className={`${service.color} ${service.text || 'text-happi-accent'} p-10 rounded-[2.5rem] border border-happi-accent flex flex-col min-h-[400px] group hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(16,185,129,0.3)] transition-all duration-300`}
                >
                  <h3 className="text-3xl font-bold mb-4 min-h-[80px]">{service.title}</h3>
                  <p className={`mb-6 ${service.text ? 'text-white/80' : 'text-happi-muted'}`}>{service.desc}</p>
                  <ul className="space-y-3 mt-auto">
                    {service.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm font-medium">
                        <span className="text-happi-primary">⚡</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Hook Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto bg-happi-secondary/30 rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden border border-happi-border">
          <GrainyGradient mousePos={mousePos} />
          <motion.div {...revealProps} className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight tracking-tighter text-happi-accent">
              There are two types of businesses emerging right now. Those using AI and those losing ground to the ones that are.
            </h2>
            <p className="text-xl text-happi-muted mb-12 font-medium">
              We help businesses turn wasted time and inefficiency into revenue, growth, and competitive advantage
            </p>
            <button
              onClick={() => setIsContactModalOpen(true)}
              className="bg-happi-accent text-white px-10 py-5 rounded-full text-lg font-bold hover:scale-105 hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all flex items-center gap-2 mx-auto shadow-lg shadow-happi-accent/20 w-fit"
            >
              See how it works <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="about" className="py-32 px-6 bg-white overflow-visible">
        <div className="max-w-7xl mx-auto">
          <motion.div {...revealProps} className="mb-16">
            <h2 className="text-4xl md:text-6xl font-bold text-happi-accent">What our clients say</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "Pipeline is up, time per deal is down. But the bigger win was the rollout. They audited how we were working, trained the whole team and made sure everyone, sales, ops, marketing, was actually getting value from it. We're sharper as a business because of it.",
                author: "Priya N.",
                role: "Head of Operations",
                img: "https://picsum.photos/seed/priya/100/100"
              },
              {
                quote: "Running a gaming studio like Shakuri means every hour matters. Happi AI has genuinely changed how we operate. Tasks that used to eat into our team's creative time are handled in minutes. We're not cutting people, we're freeing them to do the work only humans can do. It didn't just save us time, it gave us capacity we didn't know we were missing.",
                author: "Eve S.",
                role: "Creative Director",
                img: "https://picsum.photos/seed/eve/100/100"
              },
              {
                quote: "Too much volume, not enough hours. Our agents handle first response around the clock now. Bookings get made, opportunities don't fall through the cracks at 9pm on a Friday. Our inbound conversion is up and the team are focused on warm leads instead of playing catch up.",
                author: "James T.",
                role: "Customer Experience Lead",
                img: "https://picsum.photos/seed/jamest/100/100"
              }
            ].map((t, idx) => (
              <motion.div
                key={idx}
                {...revealProps}
                transition={{ ...revealProps.transition, delay: idx * 0.1 }}
                className="p-8 border-l-4 border-happi-primary bg-happi-bg rounded-r-3xl flex flex-col"
              >
                <div className="text-happi-primary text-6xl font-serif mb-4 leading-none">&ldquo;</div>
                <p className="text-base font-medium mb-8 leading-relaxed flex-1">{t.quote}</p>
                <div className="flex items-center">
                  <img src={t.img} alt={t.author} className="w-12 h-12 rounded-full mr-4 grayscale" referrerPolicy="no-referrer" loading="lazy" width="48" height="48" />
                  <div>
                    <div className="font-bold">{t.author}</div>
                    <div className="text-sm text-happi-muted">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="results" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div className="mb-20 text-center" {...revealProps}>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-happi-muted mb-4 block">
              How it works
            </span>
            <h2 className="text-4xl md:text-5xl font-bold">From first call to running in weeks</h2>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-12 left-0 w-full h-px border-t-2 border-dashed border-happi-border -z-10"></div>
            {[
              { step: "1", title: "Discovery call", desc: "Every engagement starts the same way. We learn your business, audit your processes, and find the problems worth solving." },
              { step: "2", title: "Custom roadmap", desc: "We map out exactly what tools, automations, or builds will have the biggest impact." },
              { step: "3", title: "Build and launch", desc: "We do the work. You get the results. Ongoing support included." }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                {...revealProps}
                transition={{ ...revealProps.transition, delay: idx * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-happi-primary to-happi-secondary text-white rounded-full flex items-center justify-center font-bold mb-8 mx-auto shadow-[0_0_25px_rgba(132,204,22,0.4)] text-xl">
                  {item.step}
                </div>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-happi-muted leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="contact" className="py-32 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20">
          <motion.div {...revealProps}>
            <h2 className="text-6xl font-bold mb-8">Questions? We've got answers.</h2>
            <p className="text-happi-muted mb-10">
              Learn how AI can improve your business
            </p>
            <button
              onClick={() => setIsContactModalOpen(true)}
              className="bg-happi-accent text-white px-10 py-4 rounded-full font-bold hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all"
            >
              Build My Plan
            </button>
          </motion.div>

          <motion.div {...revealProps}>
            <FAQItem 
              question="What kinds of businesses do you work with?" 
              answer="We work best with small to mid-size businesses who know they need to modernise but aren't sure where to start. Retail, services, hospitality, professional services — we've worked with them all." 
            />
            <FAQItem 
              question="How quickly can you get started?" 
              answer="Most projects kick off within a week of our first call. We move fast." 
            />
            <FAQItem 
              question="Do I need technical knowledge?" 
              answer="Zero. That's our job. We make sure everything is explained clearly and your team can use what we build without needing a tech background." 
            />
            <FAQItem 
              question="What does it cost?" 
              answer="We scope every project individually because every business is different. Book a free discovery call and we'll give you an honest number with no surprises." 
            />
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto bg-happi-primary rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden">
          <motion.div {...revealProps} className="relative z-10">
            <h2 className="text-5xl md:text-7xl font-bold text-happi-accent mb-8">Don't worry, be happy</h2>
            <p className="text-xl text-happi-accent/70 mb-12 max-w-2xl mx-auto">
              Schedule a 30-minute call, we'll walk through your business and show you where AI can automate, optimise, and create more revenue. No pitching, just useful ideas.
            </p>
            <button
              onClick={() => setIsContactModalOpen(true)}
              className="bg-happi-accent text-white px-12 py-5 rounded-full font-bold text-lg hover:scale-105 hover:shadow-[0_0_40px_rgba(16,185,129,0.5)] transition-all"
            >
              Book your free call
            </button>
          </motion.div>
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-32 -mt-32"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mb-48"></div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-happi-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12 mb-20">
            <div className="col-span-1">
              <div className="text-2xl font-bold mb-6">happi</div>
              <p className="text-sm text-happi-muted mb-8">
                Build the future
              </p>
              <div className="flex space-x-4">
                <a href="https://www.facebook.com/profile.php?id=61573483374888" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-8 h-8 rounded-full border border-happi-accent flex items-center justify-center hover:bg-happi-accent hover:text-white transition-colors">f</a>
              </div>
            </div>

            <div>
              <h5 className="font-bold mb-6 text-sm uppercase tracking-widest opacity-40">Contact</h5>
              <ul className="space-y-4 text-sm font-medium">
                <li><a href="mailto:hello@happiai.co.uk" className="hover:text-happi-primary transition-colors">hello@happiai.co.uk</a></li>
                <li className="text-happi-muted">Manchester, UK</li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-bold mb-6 text-sm uppercase tracking-widest opacity-40">Company</h5>
              <ul className="space-y-4 text-sm font-medium">
                <li><a href="#results" className="hover:text-happi-primary transition-colors">About</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-10 border-t border-happi-border flex flex-col md:flex-row justify-between items-center text-xs text-happi-muted font-medium">
            <div>© {new Date().getFullYear()} Happi. All rights reserved</div>
          </div>
        </div>
      </footer>

      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
      `}</style>
    </div>
  );
}
