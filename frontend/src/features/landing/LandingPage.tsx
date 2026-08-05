import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import {
  Zap, ArrowRight, BookOpen, BarChart3, Award, Shield,
  Play, Sparkles, Check, Star, ChevronDown, Plus,
  Users, FileText, Brain, Globe, Lock, Smartphone,
  Layers, Target, TrendingUp, Clock,
} from 'lucide-react';

/* ============================================
   Hero Section
   ============================================ */
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-surface-0" />

        {/* Gradient Orbs */}
        <motion.div
          animate={{
            x: [0, 100, -50, 0],
            y: [0, -100, 50, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-[128px]"
        />
        <motion.div
          animate={{
            x: [0, -100, 50, 0],
            y: [0, 50, -100, 0],
            scale: [1, 0.8, 1.1, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary-500/20 rounded-full blur-[128px]"
        />
        <motion.div
          animate={{
            x: [0, 50, -100, 0],
            y: [0, 100, -50, 0],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent-500/10 rounded-full blur-[128px]"
        />

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium mb-8"
        >
          <Sparkles className="w-4 h-4" />
          <span>Now with AI-powered question generation</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95] mb-6"
        >
          <span className="text-surface-900">Create.</span>{' '}
          <span className="gradient-text-hero">Test.</span>
          <br />
          <span className="text-surface-900">Analyze.</span>{' '}
          <span className="gradient-text">Improve.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-lg md:text-xl text-surface-500 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          The Assessment Operating System for modern teams. Build beautiful quizzes,
          track performance, and issue certificates — all in one platform.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link to="/signup">
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="relative px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-2xl text-base font-semibold shadow-xl shadow-primary-500/25 hover:shadow-2xl hover:shadow-primary-500/30 transition-shadow overflow-hidden group"
            >
              <span className="relative z-10 flex items-center gap-2">
                Start Free Trial
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary-500 opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </motion.button>
          </Link>
          <Link to="/app">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-8 py-4 bg-surface-100 hover:bg-surface-200 text-surface-900 rounded-2xl text-base font-semibold border border-surface-200/50 transition-colors"
            >
              <Play className="w-4 h-4" />
              Live Demo
            </motion.button>
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="flex items-center justify-center gap-8 md:gap-16 mt-16"
        >
          {[
            { value: 50000, suffix: '+', label: 'Assessments Created' },
            { value: 2, suffix: 'M+', label: 'Questions Answered' },
            { value: 99.9, suffix: '%', label: 'Uptime', decimals: 1 },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-surface-900">
                {/* <CountUp end={stat.value} duration={2.5} delay={1} decimals={stat.decimals || 0} separator="," suffix={stat.suffix} /> */}
                {stat.value}{stat.suffix}
              </div>
              <div className="text-sm text-surface-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ChevronDown className="w-6 h-6 text-surface-400" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ============================================
   Features Section
   ============================================ */
function FeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const features = [
    {
      icon: BookOpen,
      title: 'Question Bank',
      description: 'Organize thousands of questions with tags, categories, and difficulty levels. Support for 10+ question types.',
      gradient: 'from-primary-500 to-primary-600',
      glow: 'shadow-primary-500/20',
    },
    {
      icon: Layers,
      title: 'Assessment Builder',
      description: 'Drag & drop builder with sections, pools, conditional logic, and randomization. Build any exam format.',
      gradient: 'from-secondary-500 to-secondary-600',
      glow: 'shadow-secondary-500/20',
    },
    {
      icon: Target,
      title: 'Smart Analytics',
      description: 'Real-time performance dashboards, topic mastery tracking, question difficulty analysis, and growth trends.',
      gradient: 'from-accent-500 to-accent-600',
      glow: 'shadow-accent-500/20',
    },
    {
      icon: Award,
      title: 'Certificates',
      description: 'Beautiful certificate templates with QR verification, digital signatures, and automated generation.',
      gradient: 'from-warning-500 to-warning-600',
      glow: 'shadow-warning-500/20',
    },
    {
      icon: Shield,
      title: 'Anti-Cheating',
      description: 'Tab switching detection, fullscreen enforcement, clipboard blocking, and activity timeline monitoring.',
      gradient: 'from-danger-500 to-danger-600',
      glow: 'shadow-danger-500/20',
    },
    {
      icon: Brain,
      title: 'AI Powered',
      description: 'Generate quizzes from PDFs, YouTube videos, and websites. AI-driven difficulty prediction and explanations.',
      gradient: 'from-secondary-400 to-primary-500',
      glow: 'shadow-secondary-500/20',
    },
  ];

  return (
    <section ref={ref} className="py-32 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-primary-400 uppercase tracking-wider">Features</span>
          <h2 className="text-4xl md:text-5xl font-bold text-surface-900 mt-3 mb-4">
            Everything you need to
            <br />
            <span className="gradient-text">assess excellence</span>
          </h2>
          <p className="text-lg text-surface-500 max-w-2xl mx-auto">
            From question creation to certification — QuizForge is the complete assessment platform.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="group relative p-8 rounded-2xl bg-surface-50 border border-surface-200/50 hover:border-surface-300/50 transition-all overflow-hidden h-full"
              >
                {/* Hover glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity`} />

                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg ${feature.glow} mb-6`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>

                <h3 className="text-lg font-semibold text-surface-900 mb-3">{feature.title}</h3>
                <p className="text-surface-500 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================
   How It Works Section
   ============================================ */
function HowItWorksSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const steps = [
    { icon: BookOpen, title: 'Create Questions', description: 'Build your question bank with rich content, media, and multiple question types.' },
    { icon: FileText, title: 'Build Assessment', description: 'Drag & drop questions into sections with custom settings and rules.' },
    { icon: Globe, title: 'Publish & Share', description: 'Share via link, embed, or integrate with your LMS. Set access controls.' },
    { icon: BarChart3, title: 'Analyze Results', description: 'Get real-time analytics, identify knowledge gaps, and track improvement.' },
  ];

  return (
    <section ref={ref} className="py-32 px-6 bg-surface-50/50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-accent-400 uppercase tracking-wider">How it works</span>
          <h2 className="text-4xl md:text-5xl font-bold text-surface-900 mt-3">
            Simple as <span className="gradient-text">1-2-3-4</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15 }}
              className="relative text-center"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-16 h-16 rounded-2xl bg-surface-100 border border-surface-200/50 flex items-center justify-center mx-auto mb-4 relative"
              >
                <step.icon className="w-7 h-7 text-primary-400" />
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-primary-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {i + 1}
                </span>
              </motion.div>
              <h3 className="text-base font-semibold text-surface-900 mb-2">{step.title}</h3>
              <p className="text-sm text-surface-500">{step.description}</p>

              {/* Connector line (not on last) */}
              {i < 3 && (
                <div className="hidden md:block absolute top-8 left-[calc(50%+40px)] w-[calc(100%-80px)] h-px bg-surface-200" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================
   Pricing Section
   ============================================ */
function PricingSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const plans = [
    {
      name: 'Free',
      price: '$0',
      description: 'Perfect for getting started',
      features: ['5 Assessments', '100 Questions', 'Basic Analytics', 'Email Support'],
      cta: 'Get Started',
      popular: false,
    },
    {
      name: 'Pro',
      price: '$29',
      period: '/mo',
      description: 'For growing teams and educators',
      features: ['Unlimited Assessments', 'Unlimited Questions', 'Advanced Analytics', 'Certificates', 'Anti-Cheating', 'Priority Support', 'API Access'],
      cta: 'Start Free Trial',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For large organizations',
      features: ['Everything in Pro', 'SSO/SAML', 'Custom Branding', 'Dedicated Support', 'SLA', 'On-Premise Option', 'Custom Integrations'],
      cta: 'Contact Sales',
      popular: false,
    },
  ];

  return (
    <section ref={ref} className="py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-secondary-400 uppercase tracking-wider">Pricing</span>
          <h2 className="text-4xl md:text-5xl font-bold text-surface-900 mt-3 mb-4">
            Plans that <span className="gradient-text">scale with you</span>
          </h2>
          <p className="text-lg text-surface-500">Start free. Upgrade when you need more power.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
            >
              <motion.div
                whileHover={{ y: -6 }}
                className={`relative p-8 rounded-2xl border transition-all ${
                  plan.popular
                    ? 'bg-gradient-to-b from-primary-500/5 to-surface-50 border-primary-500/30 shadow-xl shadow-primary-500/10'
                    : 'bg-surface-50 border-surface-200/50 hover:border-surface-300'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-xs font-semibold rounded-full">
                    Most Popular
                  </div>
                )}

                <h3 className="text-lg font-semibold text-surface-900">{plan.name}</h3>
                <div className="mt-4 mb-2">
                  <span className="text-4xl font-bold text-surface-900">{plan.price}</span>
                  {plan.period && <span className="text-surface-500 text-sm">{plan.period}</span>}
                </div>
                <p className="text-sm text-surface-500 mb-6">{plan.description}</p>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm text-surface-700">
                      <Check className="w-4 h-4 text-accent-500 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-3 rounded-xl font-medium text-sm transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/20'
                      : 'bg-surface-100 text-surface-900 hover:bg-surface-200 border border-surface-200/50'
                  }`}
                >
                  {plan.cta}
                </motion.button>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================
   Testimonials Section
   ============================================ */
function TestimonialsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const testimonials = [
    {
      quote: "QuizForge transformed how we assess our engineering candidates. The analytics alone saved us 20 hours per week.",
      name: 'David Park',
      role: 'VP Engineering at TechCorp',
      rating: 5,
    },
    {
      quote: "The best assessment platform I've used in 15 years of teaching. My students love the quiz experience.",
      name: 'Dr. Maria Santos',
      role: 'Professor of Computer Science',
      rating: 5,
    },
    {
      quote: "We moved from three different tools to just QuizForge. It handles everything from creation to certification.",
      name: 'James Chen',
      role: 'L&D Director at GlobalBank',
      rating: 5,
    },
  ];

  return (
    <section ref={ref} className="py-32 px-6 bg-surface-50/50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-accent-400 uppercase tracking-wider">Testimonials</span>
          <h2 className="text-4xl md:text-5xl font-bold text-surface-900 mt-3">
            Loved by <span className="gradient-text">educators & teams</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
            >
              <motion.div
                whileHover={{ y: -4 }}
                className="p-8 rounded-2xl bg-surface-50 border border-surface-200/50 h-full"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-warning-400 fill-warning-400" />
                  ))}
                </div>
                <p className="text-surface-700 text-sm leading-relaxed mb-6">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-secondary-500 flex items-center justify-center text-white text-xs font-bold">
                    {t.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-surface-900">{t.name}</p>
                    <p className="text-xs text-surface-500">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================
   FAQ Section
   ============================================ */
function FAQSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const faqs = [
    { q: 'How does the free plan work?', a: 'The free plan includes 5 assessments and 100 questions with basic analytics. No credit card required. Perfect for trying out QuizForge.' },
    { q: 'Can I import questions from other platforms?', a: 'Yes! QuizForge supports importing from Excel, CSV, QTI, and Moodle XML formats. We also support importing from Google Forms.' },
    { q: 'Is QuizForge suitable for enterprise use?', a: 'Absolutely. Our Enterprise plan includes SSO/SAML, custom branding, SLA, dedicated support, and can be deployed on-premise.' },
    { q: 'How does anti-cheating work?', a: 'Our anti-cheating system monitors tab switching, enforces fullscreen mode, blocks clipboard access, tracks mouse activity, and provides a detailed activity timeline.' },
    { q: 'Can I customize certificates?', a: 'Yes, you can customize certificate templates, add your organization logo, include QR verification codes, and add digital signatures.' },
  ];

  return (
    <section ref={ref} className="py-32 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-primary-400 uppercase tracking-wider">FAQ</span>
          <h2 className="text-4xl md:text-5xl font-bold text-surface-900 mt-3">
            Common <span className="gradient-text">questions</span>
          </h2>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.05 }}
            >
              <FAQItem question={faq.q} answer={faq.a} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      className="rounded-xl border border-surface-200/50 bg-surface-50 overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left"
      >
        <span className="text-sm font-medium text-surface-900">{question}</span>
        <motion.div
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-surface-400"
        >
          <Plus className="w-4 h-4" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="px-6 pb-4 text-sm text-surface-500 leading-relaxed">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ============================================
   CTA Section
   ============================================ */
function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="py-32 px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        className="max-w-4xl mx-auto relative"
      >
        <div className="relative p-12 md:p-16 rounded-3xl overflow-hidden text-center">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-500" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent)]" />

          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Ready to transform your assessments?
            </h2>
            <p className="text-primary-100 text-lg max-w-xl mx-auto mb-8">
              Join thousands of educators and teams who trust QuizForge to build, deliver, and analyze assessments.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white text-primary-600 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transition-shadow"
                >
                  Start Free Trial
                </motion.button>
              </Link>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white/10 text-white border border-white/20 rounded-2xl font-semibold hover:bg-white/20 transition-colors"
              >
                Schedule Demo
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/* ============================================
   Footer
   ============================================ */
function Footer() {
  const columns = [
    {
      title: 'Product',
      links: ['Features', 'Pricing', 'Security', 'Roadmap', 'Changelog'],
    },
    {
      title: 'Resources',
      links: ['Documentation', 'API Reference', 'Blog', 'Tutorials', 'Community'],
    },
    {
      title: 'Company',
      links: ['About', 'Careers', 'Contact', 'Partners', 'Press'],
    },
    {
      title: 'Legal',
      links: ['Privacy', 'Terms', 'Cookie Policy', 'GDPR', 'DPA'],
    },
  ];

  return (
    <footer className="border-t border-surface-200/50 bg-surface-50/50">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-surface-900">QuizForge</span>
            </div>
            <p className="text-sm text-surface-500 mb-4">
              The Assessment Operating System for modern teams.
            </p>
          </div>

          {columns.map((col, i) => (
            <div key={i}>
              <h4 className="text-sm font-semibold text-surface-900 mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link, j) => (
                  <li key={j}>
                    <a href="#" className="text-sm text-surface-500 hover:text-surface-900 transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-surface-200/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-surface-500">© 2024 QuizForge. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-surface-500 hover:text-surface-900 transition-colors">Twitter</a>
            <a href="#" className="text-sm text-surface-500 hover:text-surface-900 transition-colors">GitHub</a>
            <a href="#" className="text-sm text-surface-500 hover:text-surface-900 transition-colors">Discord</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ============================================
   Navigation Bar
   ============================================ */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-surface-0/80 backdrop-blur-xl border-b border-surface-200/50 shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg text-surface-900">QuizForge</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {['Features', 'Pricing', 'Docs', 'Blog'].map((item) => (
            <a
              key={item}
              href="#"
              className="text-sm text-surface-500 hover:text-surface-900 transition-colors"
            >
              {item}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link to="/signin" className="text-sm text-surface-500 hover:text-surface-900 transition-colors">
            Sign In
          </Link>
          <Link to="/signup">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-primary-500/20"
            >
              Get Started
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}

/* ============================================
   Landing Page
   ============================================ */
export function LandingPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-surface-0 min-h-screen"
    >
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PricingSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </motion.div>
  );
}
