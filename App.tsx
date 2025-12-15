import React, { useState, useEffect, useRef } from 'react';
import { 
  Phone, Calendar, MessageSquare, Shield, Globe, 
  Zap, Clock, Check, Menu, X, ArrowRight,
  PhoneOutgoing, CreditCard, Users, Database,
  Repeat, Layers, Mic2, Briefcase, Cpu, Network, 
  Lock, Sparkles, Activity, Server, Radio, BarChart3,
  CheckCircle2
} from 'lucide-react';
import Button from './components/Button';
import GetStartedModal from './components/GetStartedModal';
import LiveAgentModal from './components/LiveAgentModal';
import LogoTicker from './components/LogoTicker';
import TestimonialCarousel from './components/TestimonialCarousel';
import { PricingPlan } from './types';

// Helper icon component since 'TrendingDown' isn't standard in all Lucide versions
const TrendingDownIcon = ({ size, className }: { size?: number, className?: string }) => (
  <svg 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
    <polyline points="17 18 23 18 23 12" />
  </svg>
);

// --- Assets & Data ---

const FEATURES_FULL = [
  { title: "Inbound Calls", icon: Phone, color: "text-blue-600", bg: "bg-blue-50", hover: "group-hover:bg-blue-600", border: "group-hover:border-blue-200" },
  { title: "Outbound Calls", icon: PhoneOutgoing, color: "text-blue-600", bg: "bg-blue-50", hover: "group-hover:bg-blue-600", border: "group-hover:border-blue-200" },
  { title: "Appointment Scheduling", icon: Calendar, color: "text-violet-600", bg: "bg-violet-50", hover: "group-hover:bg-violet-600", border: "group-hover:border-violet-200" },
  { title: "Calendar Management", icon: Briefcase, color: "text-violet-600", bg: "bg-violet-50", hover: "group-hover:bg-violet-600", border: "group-hover:border-violet-200" },
  { title: "Email Handling", icon: MessageSquare, color: "text-indigo-600", bg: "bg-indigo-50", hover: "group-hover:bg-indigo-600", border: "group-hover:border-indigo-200" },
  { title: "SMS Conversations", icon: MessageSquare, color: "text-indigo-600", bg: "bg-indigo-50", hover: "group-hover:bg-indigo-600", border: "group-hover:border-indigo-200" },
  { title: "CRM Integration (GHL)", icon: Database, color: "text-emerald-600", bg: "bg-emerald-50", hover: "group-hover:bg-emerald-600", border: "group-hover:border-emerald-200" },
  { title: "Payment Collection", icon: CreditCard, color: "text-amber-600", bg: "bg-amber-50", hover: "group-hover:bg-amber-600", border: "group-hover:border-amber-200" },
  { title: "Customer Follow-ups", icon: Repeat, color: "text-teal-600", bg: "bg-teal-50", hover: "group-hover:bg-teal-600", border: "group-hover:border-teal-200" },
  { title: "Lead Qualification", icon: Users, color: "text-cyan-600", bg: "bg-cyan-50", hover: "group-hover:bg-cyan-600", border: "group-hover:border-cyan-200" },
  { title: "Real-time CRM Updates", icon: Zap, color: "text-orange-600", bg: "bg-orange-50", hover: "group-hover:bg-orange-600", border: "group-hover:border-orange-200" },
  { title: "Multilingual Support", icon: Globe, color: "text-sky-600", bg: "bg-sky-50", hover: "group-hover:bg-sky-600", border: "group-hover:border-sky-200" },
  { title: "24/7 Availability", icon: Clock, color: "text-rose-600", bg: "bg-rose-50", hover: "group-hover:bg-rose-600", border: "group-hover:border-rose-200" },
  { title: "Reactivation Campaigns", icon: Layers, color: "text-purple-600", bg: "bg-purple-50", hover: "group-hover:bg-purple-600", border: "group-hover:border-purple-200" },
  { title: "Zero Data Entry", icon: Check, color: "text-green-600", bg: "bg-green-50", hover: "group-hover:bg-green-600", border: "group-hover:border-green-200" },
  { title: "AI Intelligence", icon: Mic2, color: "text-fuchsia-600", bg: "bg-fuchsia-50", hover: "group-hover:bg-fuchsia-600", border: "group-hover:border-fuchsia-200" },
];

const INTELLIGENCE_POINTS = [
  { title: "Gemini 3.0 Native", desc: "The world's most capable multimodal model. Processes audio, text, and intent simultaneously without transcoding.", icon: Cpu, color: "text-blue-400" },
  { title: "Sub-100ms Latency", desc: "Conversational speed faster than human reflexes. No awkward pauses. No robot lag.", icon: Zap, color: "text-yellow-400" },
  { title: "Infinite Context", desc: "ARIA remembers every detail of every conversation. Past interactions shape future responses.", icon: Database, color: "text-purple-400" },
  { title: "Emotional Nuance", desc: "Detects frustration, urgency, and hesitation. Adjusts tone and empathy levels in real-time.", icon: Sparkles, color: "text-pink-400" },
  { title: "Global Fluency", desc: "Native-level proficiency in 50+ languages with automatic dialect and accent detection.", icon: Globe, color: "text-emerald-400" },
  { title: "Autonomous Action", desc: "Doesn't just talk. Executes complex CRM workflows, bookings, and payments autonomously.", icon: Activity, color: "text-red-400" },
  { title: "Enterprise Security", desc: "SOC2 compliant infrastructure with end-to-end voice encryption and GDPR adherence.", icon: Lock, color: "text-slate-400" },
  { title: "Zero Hallucinations", desc: "Strict guardrails ensure 100% factual accuracy for business-critical information.", icon: Shield, color: "text-cyan-400" },
  { title: "Infinite Scale", desc: "Handle 1 call or 100,000 concurrent calls with identical precision and speed.", icon: Server, color: "text-orange-400" },
  { title: "Self-Optimizing", desc: "Continuously learns from successful outcomes to improve conversion rates automatically.", icon: BarChart3, color: "text-green-400" },
];

const IMPACT_STATS = [
  { 
    label: "Lead Response Time", 
    prefix: "<", 
    suffix: "s", 
    desc: "Instant engagement. ARIA picks up immediately, preventing leads from drifting to competitors.",
    icon: Zap,
    theme: "blue",
    numeric: 1,
    isDecimal: false
  },
  { 
    label: "Booking Conversion", 
    prefix: "+", 
    suffix: "%", 
    desc: "Turn inquiries into revenue. ARIA qualifies and books appointments 24/7 while you sleep.",
    icon: Calendar,
    theme: "emerald",
    numeric: 300,
    isDecimal: false
  },
  { 
    label: "Operational Cost", 
    prefix: "-", 
    suffix: "%", 
    desc: "Slash overhead. Replace expensive call centers with a single, limitless AI receptionist.",
    icon: TrendingDownIcon,
    theme: "amber",
    numeric: 80,
    isDecimal: false
  },
  { 
    label: "CRM Accuracy", 
    prefix: "", 
    suffix: "%", 
    desc: "Zero data entry errors. Every detail is logged perfectly into your system instantly.",
    icon: Check,
    theme: "violet",
    numeric: 99.9,
    isDecimal: true
  }
];

// --- Pricing Data ---

// Retrieves env variable with multiple fallbacks
const getEnv = (key: string) => {
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key] || process.env[`REACT_APP_${key}`] || process.env[`NEXT_PUBLIC_${key}`] || '';
  }
  return '';
};

const PRICING_PLANS: PricingPlan[] = [
  {
    name: "7-Day Trial",
    price: "$97",
    period: "one-time setup",
    features: ["Full Platform Access", "Custom AI Agent Setup", "Live Call Handling", "CRM & Calendar Sync"],
    cta: "Start 7-Day Trial",
    stripeLink: getEnv('STRIPE_TRIAL_LINK') || '', 
  },
  {
    name: "Starter",
    price: "$497",
    period: "/ month",
    features: ["1 Dedicated AI Agent", "Inbound Call Handling", "Appointment Scheduling", "Basic CRM Integration", "Email Support"],
    cta: "Select Starter",
    stripeLink: getEnv('STRIPE_STARTER_LINK') || '',
  },
  {
    name: "Growth",
    price: "$997",
    period: "/ month",
    features: ["1-5 AI Agents", "Inbound & Outbound Calls", "Full CRM Automation", "SMS & Email Handling", "Priority Support", "Custom Workflows"],
    cta: "Select Growth",
    isPopular: true,
    stripeLink: getEnv('STRIPE_GROWTH_LINK') || '',
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "Contact Sales",
    features: ["Dedicated infrastructure", "White-labeling", "SLA guarantees", "Custom AI Training", "Dedicated Account Manager"],
    cta: "Contact Sales",
    stripeLink: "", // Enterprise usually requires a sales call
  }
];

// --- Components ---

const CountUpStats: React.FC<{ stat: typeof IMPACT_STATS[0] }> = ({ stat }) => {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.5 }
    );
    if (elementRef.current) observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, [hasAnimated]);

  useEffect(() => {
    if (!hasAnimated) return;
    
    let start = 0;
    const end = stat.numeric;
    const duration = 2000;
    const incrementTime = 30;
    const steps = duration / incrementTime;
    const increment = end / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [hasAnimated, stat.numeric]);

  const displayValue = stat.isDecimal ? count.toFixed(1) : Math.ceil(count);
  
  // Theme classes
  const themeClasses = {
    blue: "text-blue-600 bg-blue-50 border-blue-100 group-hover:border-blue-200 group-hover:shadow-blue-200/50",
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-100 group-hover:border-emerald-200 group-hover:shadow-emerald-200/50",
    amber: "text-amber-600 bg-amber-50 border-amber-100 group-hover:border-amber-200 group-hover:shadow-amber-200/50",
    violet: "text-violet-600 bg-violet-50 border-violet-100 group-hover:border-violet-200 group-hover:shadow-violet-200/50",
  };

  const bgClass = themeClasses[stat.theme as keyof typeof themeClasses];

  return (
    <div ref={elementRef} className={`p-8 rounded-3xl border transition-all duration-500 hover:-translate-y-2 hover:shadow-xl group bg-white ${bgClass.split(' ').slice(2).join(' ')} border-slate-100`}>
      <div className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center shadow-sm mb-6 transition-transform duration-300 group-hover:scale-110 ${bgClass.split(' ').slice(0, 2).join(' ')}`}>
        <stat.icon size={28} />
      </div>
      <div className="text-5xl font-bold text-slate-900 mb-3 tracking-tight">
        {stat.prefix}{displayValue}{stat.suffix}
      </div>
      <div className="text-lg font-semibold text-slate-900 mb-3">{stat.label}</div>
      <p className="text-slate-500 text-sm leading-relaxed">
        {stat.desc}
      </p>
    </div>
  );
};

const Header = ({ onOpenForm, onOpenLive }: { onOpenForm: () => void, onOpenLive: () => void }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
    { name: "Testimonials", href: "#testimonials" },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white font-serif font-bold text-xl shadow-lg shadow-slate-900/10">
            A
          </div>
          <span className="font-semibold text-lg tracking-tight text-slate-900">ARIA</span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <a 
              key={link.name} 
              href={link.href} 
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              {link.name}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <button onClick={onOpenLive} className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
            Talk with ARIA
          </button>
          <Button size="sm" onClick={onOpenForm}>Get Started</Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-slate-900 p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-100 p-6 shadow-xl flex flex-col gap-6">
          {navLinks.map(link => (
            <a 
              key={link.name} 
              href={link.href} 
              onClick={(e) => handleNavClick(e, link.href)} 
              className="text-xl font-medium text-slate-900 cursor-pointer"
            >
              {link.name}
            </a>
          ))}
          <hr className="border-slate-100" />
          <Button variant="outline" fullWidth onClick={() => { setMobileMenuOpen(false); onOpenLive(); }}>Talk with ARIA</Button>
          <Button fullWidth onClick={() => { setMobileMenuOpen(false); onOpenForm(); }}>Get Started</Button>
        </div>
      )}
    </header>
  );
};

// --- Main App ---

export default function App() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLiveOpen, setIsLiveOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);

  const openForm = (plan?: PricingPlan) => {
    setSelectedPlan(plan || null);
    setIsFormOpen(true);
  };
  
  const openLive = () => setIsLiveOpen(true);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      <Header onOpenForm={() => openForm()} onOpenLive={openLive} />

      <main>
        {/* HERO */}
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1400px] h-[800px] bg-gradient-to-b from-slate-100 to-transparent rounded-[100%] blur-3xl -z-10 opacity-70" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm text-slate-600 text-xs font-semibold uppercase tracking-wider mb-8">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Gemini 3.0 Engine Live
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-slate-900 mb-8 leading-[1]">
              ARIA – The World’s #1 <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-sky-400 to-blue-700 bg-[length:200%_auto] animate-shimmer pb-2">
                AI Receptionist
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed font-light">
              Professional. Reliable. Limitless. <br className="hidden md:block"/>
              ARIA handles every customer interaction so your business runs nonstop.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" onClick={() => openForm(PRICING_PLANS[0])} className="w-full sm:w-auto h-14 px-8 text-lg">Start 7-Day Trial</Button>
              <Button size="lg" variant="outline" onClick={openLive} className="w-full sm:w-auto h-14 px-8 text-lg flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                Watch ARIA in Action
              </Button>
            </div>

            <div className="mt-16 flex flex-col items-center gap-4">
               <div className="flex -space-x-2">
                  {[1,2,3,4].map(i => (
                    <img key={i} src={`https://picsum.photos/seed/${i + 120}/60/60`} alt="User" className="w-10 h-10 rounded-full border-2 border-white" />
                  ))}
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-50 flex items-center justify-center text-xs font-bold text-slate-600">+99k</div>
               </div>
               <p className="text-sm text-slate-400 font-medium">Trusted by 100,000+ businesses worldwide</p>
            </div>
          </div>
        </section>

        {/* TRUST TICKER */}
        <section className="py-16 border-y border-slate-100 bg-slate-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm font-semibold text-slate-400 mb-10 tracking-widest uppercase">
              Trusted by Innovative Teams Using ARIA AI
            </p>
            <LogoTicker />
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="py-24 bg-white scroll-mt-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
                The Full Spectrum of Reception Duties. Perfected.
              </h2>
              <p className="text-slate-500 max-w-2xl mx-auto text-lg">
                From complex scheduling to empathetic conversations, ARIA handles your entire front office with zero friction.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {FEATURES_FULL.map((feature, idx) => (
                <div 
                  key={idx} 
                  className={`flex flex-col items-center text-center p-6 rounded-2xl border border-slate-100 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group bg-gradient-to-b from-slate-50 to-white hover:from-white hover:to-white ${feature.border}`}
                >
                  <div className={`w-16 h-16 rounded-2xl ${feature.bg} ${feature.color} flex items-center justify-center mb-6 transition-all duration-300 ${feature.hover} group-hover:text-white shadow-sm group-hover:shadow-md group-hover:scale-110`}>
                    <feature.icon size={28} strokeWidth={1.5} />
                  </div>
                  <h3 className="font-semibold text-slate-900 text-lg group-hover:text-slate-800 transition-colors">{feature.title}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* INTELLIGENCE REDEFINED */}
        <section className="py-32 bg-slate-950 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-blue-400 text-xs font-mono mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                System Architecture v3.0
              </div>
              <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-white">
                Intelligence. Redefined.
              </h2>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                Ten reasons why ARIA is not just another chatbot, but a fundamental leap forward in business automation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {INTELLIGENCE_POINTS.map((point, idx) => (
                 <div key={idx} className={`p-8 rounded-3xl border border-slate-800 bg-slate-900/50 hover:bg-slate-800/80 transition-all duration-300 group ${idx === 0 || idx === 9 ? 'md:col-span-2 lg:col-span-2' : ''}`}>
                    <div className="flex items-start justify-between mb-6">
                       <div className={`w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center ${point.color} group-hover:scale-110 transition-transform`}>
                          <point.icon size={24} />
                       </div>
                       <div className="text-xs font-mono text-slate-600">0{idx + 1}</div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-100 transition-colors">{point.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{point.desc}</p>
                 </div>
               ))}
            </div>
          </div>
        </section>

        {/* BUSINESS IMPACT */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
             <div className="text-center mb-16">
               <h2 className="text-4xl font-bold text-slate-900 mb-4">Measurable Business Impact</h2>
               <p className="text-slate-500 text-lg max-w-2xl mx-auto">Real results from 100,000+ businesses using ARIA.</p>
             </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {IMPACT_STATS.map((stat, i) => (
                <CountUpStats key={i} stat={stat} />
              ))}
            </div>
          </div>
        </section>

        {/* SETUP */}
        <section className="py-24 bg-white relative overflow-hidden">
           <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50"></div>
           <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-violet-50 rounded-full blur-3xl opacity-50"></div>

           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="text-center mb-20">
                 <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wide mb-6">
                    <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                    White-Glove Onboarding
                 </div>
                 <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                    Expert Implementation. <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">Done For You.</span>
                 </h2>
                 <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                    No configuration required. Our engineering team handles the entire technical setup, ensuring a flawless integration with your existing stack.
                 </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8 relative">
                 <div className="hidden md:block absolute top-16 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-blue-200 via-violet-200 to-amber-200 z-0"></div>

                 {[
                   { 
                     step: "01", 
                     title: "We Connect Your Infrastructure", 
                     desc: "Our team maps and links your existing phone lines, email gateways, and SMS channels securely.", 
                     icon: Network,
                     gradient: "from-blue-500 to-cyan-400",
                     shadow: "shadow-blue-500/25"
                   },
                   { 
                     step: "02", 
                     title: "Deep Backend Integration", 
                     desc: "We build custom webhooks to sync ARIA perfectly with your specific CRM, database, and calendar.", 
                     icon: Server,
                     gradient: "from-violet-500 to-fuchsia-400",
                     shadow: "shadow-violet-500/25"
                   },
                   { 
                     step: "03", 
                     title: "Launch & Optimization", 
                     desc: "We conduct rigorous testing before flipping the switch. Immediate impact, zero downtime.", 
                     icon: Zap,
                     gradient: "from-amber-500 to-orange-400",
                     shadow: "shadow-amber-500/25"
                   }
                 ].map((item, i) => (
                   <div key={i} className="relative z-10 group">
                      <div className="flex flex-col items-center text-center p-8 rounded-3xl bg-white border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-300/50 transition-all duration-500 hover:-translate-y-2">
                         <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-8 relative group-hover:scale-110 transition-transform duration-500 shadow-lg ${item.shadow}`}>
                            <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm border-4 border-white shadow-sm z-10">
                               {item.step}
                            </div>
                            <item.icon size={40} className="text-white drop-shadow-md" strokeWidth={1.5} />
                            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-3xl"></div>
                         </div>
                         <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors">{item.title}</h3>
                         <p className="text-slate-500 leading-relaxed text-sm">{item.desc}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </section>

        {/* TESTIMONIALS */}
        <section id="testimonials" className="py-24 bg-slate-50 overflow-hidden relative scroll-mt-28">
          <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100%25\' height=\'100%25\' viewBox=\'0 0 1000 500\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M238,300 Q200,280 180,320 T150,350 Q180,380 220,360 T238,300 M500,100 Q450,80 420,120 T400,180 Q450,220 520,200 T550,140 Q540,110 500,100 M750,150 Q700,120 680,160 T650,220 Q700,250 780,230 T800,180 Q790,160 750,150\' fill=\'%23000\' /%3E%3C/svg%3E")' }}></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold uppercase tracking-wide mb-6">
                 <Globe size={12} />
                 Global Impact
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
                Loved by Businesses <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Everywhere.</span>
              </h2>
              <p className="text-slate-500 max-w-2xl mx-auto text-lg">
                Join 100,000+ innovative companies using ARIA to transform their customer experience.
              </p>
            </div>
            
            <TestimonialCarousel />
            
            <div className="mt-16 text-center">
              <Button size="lg" variant="outline" onClick={() => openForm()}>
                Read More Customer Stories
              </Button>
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" className="py-24 bg-white scroll-mt-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">Transparent Pricing</h2>
              <p className="text-slate-500 text-lg">Choose the plan that fits your scale.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
              {PRICING_PLANS.map((plan, idx) => (
                <div 
                  key={idx}
                  className={`
                    relative flex flex-col p-8 rounded-[2rem] transition-all duration-300 group
                    ${plan.isPopular 
                      ? 'bg-slate-900 text-white shadow-2xl scale-105 z-10 border border-slate-700' 
                      : 'bg-white text-slate-900 border border-slate-200 hover:border-blue-400 hover:shadow-2xl hover:scale-105 hover:z-20'
                    }
                  `}
                >
                  {plan.isPopular && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wide shadow-lg shadow-blue-500/30 ring-4 ring-white dark:ring-slate-950">
                      Most Popular
                    </div>
                  )}

                  <h3 className={`text-lg font-semibold mb-2 ${plan.isPopular ? 'text-white' : 'text-slate-900'}`}>{plan.name}</h3>
                  <div className="mb-6">
                    <span className={`text-4xl font-bold ${plan.isPopular ? 'text-white' : 'text-slate-900'}`}>{plan.price}</span>
                    <span className={`text-sm block mt-1 ${plan.isPopular ? 'text-slate-400' : 'text-slate-500'}`}>{plan.period}</span>
                  </div>

                  {plan.features && (
                    <ul className={`space-y-4 mb-8 text-sm flex-1 ${plan.isPopular ? 'text-slate-300' : 'text-slate-600'}`}>
                      {plan.features.map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-3">
                          <CheckCircle2 
                            size={18} 
                            className={`flex-shrink-0 mt-0.5 ${plan.isPopular ? 'text-blue-400' : 'text-blue-600'}`} 
                          />
                          <span className="leading-snug">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="mt-auto">
                    <Button 
                      fullWidth 
                      variant={plan.isPopular ? 'white' : 'outline'} 
                      onClick={() => openForm(plan)}
                      className={!plan.isPopular ? 'group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900' : ''}
                    >
                      {plan.cta}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECURITY */}
        <section className="py-24 bg-slate-50 border-t border-slate-200">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <Shield size={48} className="text-slate-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Your business data is protected worldwide.</h2>
            <p className="text-slate-500 mb-8">
              We utilize enterprise-grade encryption and adhere to strict global privacy standards including GDPR.
              Your customer data never leaves our secure infrastructure without your permission.
            </p>
            <div className="flex justify-center gap-8 text-sm font-semibold text-slate-400 uppercase tracking-wide">
              <span>GDPR Ready</span>
              <span>256-bit SSL</span>
              <span>SOC2 Compliant</span>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-32 bg-white text-center">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-8 tracking-tight">Transform Your Business Today</h2>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" onClick={() => openForm(PRICING_PLANS[0])} className="h-14 px-10 text-lg">Start 7-Day Trial</Button>
              <Button size="lg" variant="secondary" onClick={openLive} className="h-14 px-10 text-lg flex items-center gap-2">
                <Phone size={20} /> Speak with ARIA
              </Button>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="bg-white border-t border-slate-100 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
             <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-slate-900 flex items-center justify-center text-white font-serif font-bold text-xs">A</div>
                <span className="font-semibold text-slate-900">ARIA</span>
             </div>
             <div className="flex gap-8 text-sm text-slate-500">
               <a href="#" className="hover:text-slate-900">Privacy Policy</a>
               <a href="#" className="hover:text-slate-900">Terms of Service</a>
               <a href="#" className="hover:text-slate-900">Contact</a>
             </div>
             <div className="text-sm text-slate-400">
               © {new Date().getFullYear()} ARIA AI Inc. Operations Worldwide.
             </div>
          </div>
        </footer>

        {/* Mobile Sticky CTA */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-slate-200 z-30 safe-bottom">
           <Button fullWidth onClick={() => openForm(PRICING_PLANS[0])}>Start 7-Day Trial</Button>
        </div>

      </main>

      <GetStartedModal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        openLive