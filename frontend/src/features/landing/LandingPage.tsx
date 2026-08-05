import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, BookOpen, BarChart3, Award, Shield,
  Play, Sparkles, Check, Star, ChevronDown, Plus,
  FileText, Globe, Layers, Target, CheckCircle2, Building, GraduationCap, Briefcase, Users
} from 'lucide-react';

/* ============================================
   Trusted By Marquee
   ============================================ */
function TrustedBySection() {
  const logos = [
    { name: "Acme Corp", icon: Building },
    { name: "GlobalTech", icon: Globe },
    { name: "State University", icon: GraduationCap },
    { name: "NextGen HR", icon: Briefcase },
    { name: "Innovate Inc", icon: Sparkles },
    { name: "Apex Learning", icon: BookOpen },
  ];

  return (
    <div className="py-10 bg-surface-0 overflow-hidden flex flex-col items-center">
      <p className="text-xs font-semibold text-surface-400 uppercase tracking-widest mb-6 text-center">Trusted by forward-thinking teams worldwide</p>
      <div className="relative w-full max-w-7xl mx-auto overflow-hidden">
        {/* Fading edges */}
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-surface-0 to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-surface-0 to-transparent z-10" />
        
        <motion.div 
          animate={{ x: [0, -1035] }}
          transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
          className="flex items-center gap-16 md:gap-24 whitespace-nowrap"
        >
          {/* Duplicate list for infinite scroll effect */}
          {[...logos, ...logos, ...logos].map((logo, i) => (
            <div key={i} className="flex items-center gap-2 text-surface-400 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300">
              <logo.icon className="w-6 h-6" />
              <span className="text-lg font-bold tracking-tight">{logo.name}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

/* ============================================
   Hero Section
   ============================================ */
function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ x: [0, 50, -20, 0], y: [0, -50, 20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{ x: [0, -50, 30, 0], y: [0, 50, -30, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-secondary-500/10 rounded-full blur-[100px]"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
        {/* Left Column: Copy */}
        <div className="text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-500 text-xs font-semibold uppercase tracking-wider mb-6"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>QuizForge 2.0 is Live</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6 text-surface-900"
          >
            Stop wrestling with clunky LMS tools.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg md:text-xl text-surface-500 max-w-2xl mx-auto lg:mx-0 mb-8 leading-relaxed"
          >
            QuizForge is the modern assessment OS that automates grading, generates verifiable certificates, and provides deep analytics for HR and L&D teams.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
          >
            <Link to="/signup">
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-primary-600 text-white rounded-xl text-base font-medium shadow-xl shadow-primary-500/20 hover:shadow-2xl hover:shadow-primary-500/30 transition-all w-full sm:w-auto"
              >
                Start Free Trial
              </motion.button>
            </Link>
            <Link to="/app">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2 px-8 py-4 bg-surface-0 hover:bg-surface-50 text-surface-900 rounded-xl text-base font-medium border border-surface-200 shadow-sm transition-all w-full sm:w-auto"
              >
                <Play className="w-4 h-4" />
                Live Demo
              </motion.button>
            </Link>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            className="mt-4 text-xs text-surface-400"
          >
            No credit card required. 14-day free trial.
          </motion.p>
        </div>

        {/* Right Column: UI Mockup */}
        <motion.div
          initial={{ opacity: 0, x: 40, rotateY: 15 }}
          animate={{ opacity: 1, x: 0, rotateY: 0 }}
          transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
          className="relative perspective-1000 hidden lg:block"
        >
          <div className="relative rounded-2xl border border-surface-200/50 bg-white/50 backdrop-blur-xl shadow-2xl p-2 transform rotate-2 hover:rotate-0 transition-transform duration-500 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-secondary-500/5" />
            
            {/* Fake Browser Header */}
            <div className="flex items-center gap-1.5 px-3 py-2 border-b border-surface-100 bg-surface-50/50 rounded-t-xl">
              <div className="w-2.5 h-2.5 rounded-full bg-danger-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-warning-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-success-400" />
            </div>
            
            {/* Fake Dashboard Content */}
            <div className="p-6 relative z-10">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-bold text-surface-900">Analytics Dashboard</h3>
                  <p className="text-xs text-surface-400">Company-wide performance</p>
                </div>
                <div className="px-3 py-1 rounded-full bg-success-50 text-success-600 text-xs font-medium">Live Data</div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-xl border border-surface-100 bg-white shadow-sm">
                  <p className="text-xs text-surface-400 mb-1">Avg Score</p>
                  <p className="text-2xl font-bold text-surface-900">86%</p>
                  <div className="mt-2 w-full h-1 bg-surface-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary-500 w-[86%]" />
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-surface-100 bg-white shadow-sm">
                  <p className="text-xs text-surface-400 mb-1">Completion Rate</p>
                  <p className="text-2xl font-bold text-surface-900">92%</p>
                  <div className="mt-2 w-full h-1 bg-surface-100 rounded-full overflow-hidden">
                    <div className="h-full bg-secondary-500 w-[92%]" />
                  </div>
                </div>
              </div>
              
              <div className="p-4 rounded-xl border border-surface-100 bg-white shadow-sm">
                <p className="text-xs text-surface-400 mb-4">Recent Certificates Issued</p>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-surface-50 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-surface-100 flex items-center justify-center text-[10px] font-bold text-surface-500">U{i}</div>
                      <span className="text-sm text-surface-700">Security Training Q{i}</span>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-success-500" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block"
      >
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <ChevronDown className="w-6 h-6 text-surface-300" />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ============================================
   Bento Grid Features
   ============================================ */
function BentoFeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-24 px-6 bg-surface-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-surface-900 mb-4">
            Everything you need. <br className="hidden md:block" />
            <span className="text-surface-400">Nothing you don't.</span>
          </h2>
          <p className="text-lg text-surface-500 max-w-2xl mx-auto">
            A comprehensive suite of tools designed specifically for high-performance L&D teams to streamline the entire assessment lifecycle.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(250px,auto)]">
          
          {/* Feature 1: Large spanning */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }}
            className="md:col-span-3 rounded-3xl bg-surface-100 border border-surface-200/60 p-8 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-bl-[100px] -z-0 opacity-50 group-hover:scale-110 transition-transform duration-700" />
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center mb-6">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-surface-900 mb-3">Enterprise-Grade Analytics</h3>
                <p className="text-surface-500 leading-relaxed max-w-md">
                  Stop exporting CSVs. Get real-time dashboards showing topic mastery, time-per-question analysis, and cohort completion rates. Identify knowledge gaps instantly.
                </p>
              </div>
              <div className="mt-8 flex gap-2">
                <span className="px-3 py-1 rounded-full bg-surface-100 text-surface-600 text-xs font-medium">Live Dashboards</span>
                <span className="px-3 py-1 rounded-full bg-surface-100 text-surface-600 text-xs font-medium">Difficulty Metrics</span>
              </div>
            </div>
          </motion.div>

          {/* Feature 2: Small */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 }}
            className="rounded-3xl bg-surface-0 border border-surface-200/60 p-8 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 rounded-xl bg-secondary-100 text-secondary-600 flex items-center justify-center mb-6">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-surface-900 mb-3">Advanced Builder</h3>
            <p className="text-surface-500 text-sm leading-relaxed">
              Drag-and-drop question pools, set conditional logic, and randomize options to ensure no two exams are exactly the same.
            </p>
          </motion.div>

          {/* Feature 3: Small */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.3 }}
            className="rounded-3xl bg-surface-0 border border-surface-200/60 p-8 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 rounded-xl bg-warning-100 text-warning-600 flex items-center justify-center mb-6">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-surface-900 mb-3">Auto-Certificates</h3>
            <p className="text-surface-500 text-sm leading-relaxed">
              Automatically issue beautiful, verifiable PDF certificates the moment a candidate passes the threshold.
            </p>
          </motion.div>

          {/* Feature 4: Medium wide */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.4 }}
            className="md:col-span-3 rounded-3xl bg-primary-50 text-surface-900 p-8 md:p-12 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-center gap-8"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary-100/50 to-transparent" />
            <div className="relative z-10 flex-1">
              <div className="flex items-center gap-2 text-danger-500 font-semibold text-sm uppercase tracking-wider mb-4">
                <Shield className="w-4 h-4" /> Anti-Cheating Engine
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">Maintain complete exam integrity.</h3>
              <p className="text-surface-600 max-w-xl">
                Our strict proctoring module detects tab switches, enforces fullscreen modes, blocks copy-pasting, and generates a timeline of suspicious activity for every candidate.
              </p>
            </div>
            <div className="relative z-10 w-full md:w-1/3 flex justify-center">
              <div className="w-full max-w-[200px] aspect-square rounded-2xl bg-surface-0 border border-surface-200 p-4 flex flex-col gap-3 shadow-sm">
                <div className="flex items-center gap-2 text-danger-500 text-xs font-mono"><Shield className="w-3 h-3"/> TAB SWITCH DETECTED</div>
                <div className="flex items-center gap-2 text-warning-500 text-xs font-mono"><Target className="w-3 h-3"/> LOST FOCUS</div>
                <div className="flex items-center gap-2 text-success-500 text-xs font-mono"><Check className="w-3 h-3"/> RESUMED</div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

/* ============================================
   Immersive How It Works
   ============================================ */
function HowItWorksSection() {
  const steps = [
    { 
      number: "01",
      title: "Build your question bank", 
      desc: "Import existing questions or use our rich text editor to build a centralized repository of knowledge. Tag, categorize, and assign difficulty levels." 
    },
    { 
      number: "02",
      title: "Configure the assessment", 
      desc: "Set time limits, passing scores, shuffling rules, and anti-cheating measures. QuizForge gives you granular control over the test environment." 
    },
    { 
      number: "03",
      title: "Share & Evaluate", 
      desc: "Distribute via secure links or embed directly into your internal tools. The system auto-grades responses instantly, eliminating manual review." 
    }
  ];

  return (
    <section className="py-24 px-6 relative overflow-hidden bg-surface-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-3xl font-bold text-surface-900 mb-4">A workflow that makes sense</h2>
          <p className="text-surface-500">From creation to certification in minutes, not hours.</p>
        </div>

        <div className="space-y-12 relative">
          {/* Vertical Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-surface-200 -translate-x-1/2 hidden md:block" />

          {steps.map((step, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className={`flex flex-col md:flex-row gap-8 items-center ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
            >
              <div className="flex-1 w-full text-center md:text-left">
                <div className={`p-8 rounded-3xl bg-surface-0 border border-surface-200/50 shadow-sm hover:shadow-md transition-shadow ${i % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
                  <span className="text-4xl font-black text-surface-200 mb-4 block">{step.number}</span>
                  <h3 className="text-xl font-bold text-surface-900 mb-3">{step.title}</h3>
                  <p className="text-surface-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
              {/* Center node */}
              <div className="hidden md:flex relative z-10 w-16 h-16 rounded-full bg-surface-0 border-4 border-surface-50 items-center justify-center shadow-sm">
                <div className="w-4 h-4 rounded-full bg-primary-500" />
              </div>
              <div className="flex-1 hidden md:block" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================
   Wall of Love (Testimonials)
   ============================================ */
function TestimonialsSection() {
  const testimonials = [
    {
      quote: "QuizForge's auto-grading saved our HR team 15 hours a week in onboarding. It's the best ROI we've seen on a tool this year.",
      name: "Sarah Jenkins",
      role: "Head of People, TechFlow",
    },
    {
      quote: "We migrated 5,000 students to QuizForge last semester. The platform didn't even flinch. Enterprise-grade reliability.",
      name: "Dr. Marcus Thorne",
      role: "IT Director, State University",
    },
    {
      quote: "The UI is so intuitive that our instructors didn't even need training to start building question banks. Beautifully designed.",
      name: "Elena Rodriguez",
      role: "L&D Specialist",
    },
    {
      quote: "I love the automated certificate generation. Our sales team completes their quarterly compliance and gets a PDF instantly.",
      name: "James Chen",
      role: "VP Sales Operations",
    }
  ];

  return (
    <section className="py-24 px-6 bg-surface-0 text-surface-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Don't just take our word for it</h2>
          <p className="text-surface-500">Join thousands of organizations running assessments on QuizForge.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl bg-surface-0 border border-surface-200/50 flex flex-col justify-between hover:border-surface-300 transition-colors"
            >
              <div>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 text-warning-400 fill-warning-400" />)}
                </div>
                <p className="text-surface-700 text-sm leading-relaxed mb-6">"{t.quote}"</p>
              </div>
              <div>
                <p className="font-bold text-surface-900">{t.name}</p>
                <p className="text-xs text-surface-500">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================
   Pricing & FAQ
   ============================================ */
function PricingSection() {
  const plans = [
    {
      name: 'Starter',
      price: '$0',
      description: 'For individuals exploring the platform.',
      features: ['Up to 5 active assessments', '100 responses per month', 'Basic Analytics', 'Community Support'],
      cta: 'Get Started',
      popular: false,
    },
    {
      name: 'Pro Team',
      price: '$49',
      period: '/mo',
      description: 'For L&D teams running regular training.',
      features: ['Unlimited assessments', 'Unlimited responses', 'Advanced Analytics & Exports', 'Custom Certificates', 'Anti-Cheating Engine'],
      cta: 'Start Free Trial',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For large-scale educational institutions.',
      features: ['Everything in Pro', 'SSO / SAML Authentication', 'Dedicated Success Manager', '99.9% Uptime SLA', 'Custom Integrations'],
      cta: 'Contact Sales',
      popular: false,
    },
  ];

  return (
    <section className="py-24 px-6 bg-surface-0">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-surface-900 mb-4">Simple, transparent pricing</h2>
          <p className="text-surface-500">Start for free, upgrade when you need advanced proctoring and scale.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <div 
              key={i} 
              className={`p-8 rounded-3xl border transition-all ${
                plan.popular 
                  ? 'bg-surface-100 border-primary-500 shadow-xl shadow-primary-500/10 relative scale-100 md:scale-105 z-10' 
                  : 'bg-surface-50 border-surface-200/50 shadow-sm'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary-500 text-white text-xs font-bold rounded-full">
                  MOST POPULAR
                </div>
              )}
              <h3 className="text-xl font-bold text-surface-900">{plan.name}</h3>
              <p className="text-surface-500 text-sm mt-2 mb-6">{plan.description}</p>
              <div className="mb-8">
                <span className="text-4xl font-black text-surface-900">{plan.price}</span>
                {plan.period && <span className="text-surface-500 font-medium">{plan.period}</span>}
              </div>
              <ul className="space-y-4 mb-8">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-3 text-sm text-surface-700">
                    <Check className="w-5 h-5 text-primary-500 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button className={`w-full py-3 rounded-xl font-semibold transition-colors ${
                plan.popular 
                  ? 'bg-primary-500 hover:bg-primary-600 text-white' 
                  : 'bg-surface-100 hover:bg-surface-200 text-surface-900'
              }`}>
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================
   Main Assembly
   ============================================ */
export function LandingPage() {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-surface-0 font-sans selection:bg-primary-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-surface-0/80 backdrop-blur-md border-b border-surface-200/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-surface-900 tracking-tight">QuizForge</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-surface-600">
            <a href="#" className="hover:text-surface-900 transition-colors">Features</a>
            <a href="#" className="hover:text-surface-900 transition-colors">Solutions</a>
            <a href="#" className="hover:text-surface-900 transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/signin" className="text-sm font-medium text-surface-600 hover:text-surface-900 transition-colors hidden sm:block">
              Log in
            </Link>
            <Link to="/signup">
              <button className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors shadow-sm">
                Sign up free
              </button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-16">
        <HeroSection />
        <TrustedBySection />
        <BentoFeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <PricingSection />
        
        {/* Simple CTA Section */}
        <section className="py-32 px-6 bg-primary-50 text-center relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary-200 to-transparent"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-surface-900 mb-6">Ready to upgrade your assessments?</h2>
            <p className="text-surface-600 mb-10 max-w-xl mx-auto text-lg">Join thousands of organizations using QuizForge to streamline their training and certification processes.</p>
            <Link to="/signup">
              <button className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-base font-semibold shadow-xl shadow-primary-500/20 transition-all">
                Get Started for Free
              </button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface-0 border-t border-surface-200/50 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-surface-100 flex items-center justify-center border border-surface-200">
              <Sparkles className="w-4 h-4 text-primary-500" />
            </div>
            <span className="font-bold text-surface-900 text-lg tracking-tight">QuizForge</span>
          </div>
          <p className="text-surface-500 text-sm">© 2026 QuizForge Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
