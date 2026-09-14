import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  TrendingUp, 
  Zap, 
  Gauge, 
  Layers,
  Globe,
  Code2,
  ShoppingBag,
  Palette,
  RefreshCw,
  LayoutTemplate,
  ShieldCheck,
  Target,
  HeartHandshake,
  MessageSquare,
  MessageCircle,
  PhoneCall
} from 'lucide-react';
import { store } from '../lib/store';
import { Service } from '../types';
import { AuthRequiredModal } from '../components/portal/AuthRequiredModal';

const renderServiceIcon = (iconName: string) => {
  switch (iconName) {
    case 'Code2': return <Code2 className="w-5 h-5 text-blue-600" />;
    case 'ShoppingBag': return <ShoppingBag className="w-5 h-5 text-indigo-600" />;
    case 'Palette': return <Palette className="w-5 h-5 text-purple-600" />;
    case 'RefreshCw': return <RefreshCw className="w-5 h-5 text-sky-600" />;
    case 'LayoutTemplate': return <LayoutTemplate className="w-5 h-5 text-emerald-600" />;
    case 'Sparkles': return <Sparkles className="w-5 h-5 text-amber-600" />;
    default: return <Code2 className="w-5 h-5 text-blue-600" />;
  }
};

const ADVANTAGES = [
  {
    icon: Zap,
    title: 'Engineered for Conversion & Speed',
    desc: 'We write clean, high-performance code that achieves sub-second load times and passes all Google Core Web Vitals with 95+ scores.'
  },
  {
    icon: ShieldCheck,
    title: 'Transparent Project Portal',
    desc: 'Track milestones, review itemized quotations, chat directly with engineers, and inspect deliverables in your dedicated client dashboard.'
  },
  {
    icon: Target,
    title: 'Bespoke Modern Design',
    desc: 'No cookie-cutter templates. Every website is custom-designed in Figma to match your brand positioning and industry standards.'
  },
  {
    icon: HeartHandshake,
    title: 'Full Ownership & Warranty',
    desc: '100% intellectual property ownership, comprehensive code repository handoff, and 30 days of post-launch warranty support.'
  }
];

const PROCESS_STEPS = [
  { step: '01', title: 'Discovery & Proposal', desc: 'Tell us your goals. Receive a clear scope breakdown and itemized quotation within 24 hours.' },
  { step: '02', title: 'UI/UX Prototype', desc: 'Interactive Figma design concepts and clickable prototypes tailored to your brand.' },
  { step: '03', title: 'Clean Development', desc: 'Robust frontend and backend engineering with responsive layouts and SEO integration.' },
  { step: '04', title: 'QA & Launch', desc: 'Performance testing, security audit, live DNS cutover, and client team training.' }
];

export const HomePage: React.FC = () => {
  const [services] = useState<Service[]>(store.getServices().slice(0, 6));
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [selectedServiceSlug, setSelectedServiceSlug] = useState<string>('');
  const navigate = useNavigate();

  const handleBookService = (serviceSlug: string) => {
    const user = store.getCurrentUser();
    if (user) {
      navigate(`/start-project?service=${serviceSlug}`);
    } else {
      setSelectedServiceSlug(serviceSlug);
      setAuthModalOpen(true);
    }
  };

  return (
    <div className="space-y-0">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-20 lg:pt-36 lg:pb-28 overflow-hidden bg-gradient-to-b from-slate-50/80 via-white to-white">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-blue-50/60 to-transparent pointer-events-none -z-10 rounded-full blur-3xl opacity-70"></div>
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-100/30 rounded-full blur-2xl pointer-events-none -z-10"></div>
        <div className="absolute top-40 left-10 w-80 h-80 bg-indigo-50/40 rounded-full blur-3xl pointer-events-none -z-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-800 text-xs font-semibold tracking-wide shadow-subtle animate-in fade-in slide-in-from-top-2 duration-500">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                <span>NSK — Websites That Build Your Business</span>
                <Sparkles className="w-3.5 h-3.5 text-blue-600 ml-0.5" />
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
                We Build Websites That <br className="hidden sm:inline" />
                <span className="text-gradient-accent">Work for Your Business</span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl">
                Professional websites, digital experiences, and creative solutions designed to help businesses grow online.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2 w-full sm:w-auto">
                <Link
                  id="hero-start-project-btn"
                  to="/start-project"
                  className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-base shadow-md hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2.5 group cursor-pointer"
                >
                  <span>Start Your Project</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  id="hero-view-services-btn"
                  to="/services"
                  className="px-7 py-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-800 font-bold text-base shadow-subtle hover:shadow-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Explore Services</span>
                </Link>
              </div>

              {/* Feature Checkpoints */}
              <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 w-full text-xs font-medium text-slate-600 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Modern Custom Code</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>95+ PageSpeed Score</span>
                </div>
                <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Full Project Tracking</span>
                </div>
              </div>
            </div>

            {/* Right Visual (Interactive Browser & Performance Cards) */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-lg lg:max-w-none">
                
                {/* Browser Mockup */}
                <div className="rounded-2xl bg-white border border-slate-200/90 shadow-2xl overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
                  <div className="px-4 py-3 bg-slate-50/90 border-b border-slate-200/80 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-red-400"></span>
                      <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                      <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-white border border-slate-200 text-[11px] font-mono text-slate-500 max-w-[220px] truncate shadow-subtle">
                      <Globe className="w-3 h-3 text-blue-500" />
                      <span>https://yourbusiness.com</span>
                    </div>
                    <div className="w-12"></div>
                  </div>

                  <div className="p-6 bg-gradient-to-br from-slate-50 to-blue-50/30 space-y-4">
                    <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-sm space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">N</div>
                          <div className="w-16 h-2 rounded bg-slate-200"></div>
                        </div>
                        <div className="flex gap-1.5">
                          <div className="w-8 h-2 rounded bg-slate-100"></div>
                          <div className="w-8 h-2 rounded bg-slate-100"></div>
                          <div className="w-10 h-3.5 rounded-full bg-blue-600"></div>
                        </div>
                      </div>
                      <div className="space-y-1.5 pt-1">
                        <div className="w-3/4 h-4 rounded bg-slate-800"></div>
                        <div className="w-1/2 h-4 rounded bg-blue-600"></div>
                        <div className="w-full h-2 rounded bg-slate-200 pt-1"></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-subtle flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                          <TrendingUp className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Conversion</div>
                          <div className="text-base font-extrabold text-slate-900">+148%</div>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-subtle flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                          <Gauge className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">PageSpeed</div>
                          <div className="text-base font-extrabold text-slate-900">99 / 100</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Fast Load Badge */}
                <div className="absolute -top-6 -left-6 bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-xl flex items-center gap-3 animate-float hidden sm:flex">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">0.4s Fast Load</div>
                    <div className="text-[11px] text-slate-500 font-medium">Core Web Vitals Pass</div>
                  </div>
                </div>

                {/* Floating Portal Badge */}
                <div className="absolute -bottom-6 -right-4 bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-xl flex items-center gap-3 hidden sm:flex">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Client Portal</div>
                    <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Real-time Tracking
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Trust strip */}
          <div className="mt-16 pt-8 border-t border-slate-200/80 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-sm font-bold text-slate-800">
            <span className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-200/80">Web Development</span>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <span className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-200/80">UI/UX Design</span>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <span className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-200/80">Business Websites</span>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <span className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-200/80">E-Commerce</span>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <span className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-200/80">Branding</span>
          </div>

        </div>
      </section>

      {/* 2. SERVICES PREVIEW WITH RICH IMAGERY & DIRECT BOOKING */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div className="space-y-2 max-w-2xl">
              <div className="text-xs font-bold uppercase tracking-wider text-blue-600">Our Core Capabilities</div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Services Built for Modern Businesses
              </h2>
              <p className="text-sm sm:text-base text-slate-600">
                From high-converting landing pages to full-scale enterprise web applications, we engineer reliable digital solutions.
              </p>
            </div>

            <Link
              to="/services"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700 shrink-0 group"
            >
              <span>Explore All Services</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.id}
                className="rounded-3xl bg-white border border-slate-200/90 shadow-card hover:shadow-card-hover hover:border-blue-200 overflow-hidden transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {service.image_url && (
                    <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                      <img
                        src={service.image_url}
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/95 text-slate-900 font-bold text-[10px] shadow-sm flex items-center gap-1.5">
                        {renderServiceIcon(service.icon)}
                        <span>{service.title}</span>
                      </div>
                    </div>
                  )}

                  <div className="p-6 space-y-2.5">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                      {service.short_desc}
                    </p>
                    <div className="pt-2 flex items-center justify-between text-xs font-semibold text-slate-500">
                      <span>Timeline: {service.estimated_timeline}</span>
                      <span className="text-blue-600 font-bold">From {service.starting_price}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to={`/services/${service.slug}`}
                      className="py-2.5 px-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-slate-50 text-slate-800 font-semibold text-xs transition-colors flex items-center justify-center gap-1 text-center"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      onClick={() => handleBookService(service.slug)}
                      className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-sm flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>Book Service</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 3. WHY CHOOSE NSK */}
      <section className="py-20 bg-slate-50/70 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <div className="text-xs font-bold uppercase tracking-wider text-blue-600">Why Partner With NSK</div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              A Development Agency Built Differently
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              We focus on measurable business outcomes, transparent communication, and engineering excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ADVANTAGES.map((adv, idx) => {
              const IconComponent = adv.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-card space-y-3"
                >
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{adv.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{adv.desc}</p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 4. FAST DIRECT CONSULTATION & WHATSAPP BANNER */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-blue-500/10 border border-emerald-200/80 p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
                <MessageCircle className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                  Instant Communication
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  Prefer chatting directly on WhatsApp?
                </h3>
                <p className="text-xs sm:text-sm text-slate-600">
                  Connect instantly with our project lead on <strong className="text-slate-900 font-bold">+91 8807855118</strong> for instant quotes and technical inquiries.
                </p>
              </div>
            </div>

            <a
              href="https://wa.me/918807855118?text=Hello%20NSK%20Team%2C%20I%20would%20like%20to%20discuss%20a%20project."
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Contact us on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS */}
      <section className="py-20 bg-slate-50/70 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
            <div className="text-xs font-bold uppercase tracking-wider text-blue-600">The NSK Process</div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Simple, Transparent 4-Stage Delivery
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              From requirement intake to production deployment, experience a structured and predictable workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {PROCESS_STEPS.map((p) => (
              <div
                key={p.step}
                className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-card space-y-3 relative"
              >
                <span className="text-3xl font-black font-mono text-blue-600/30">{p.step}</span>
                <h3 className="text-base font-bold text-slate-900">{p.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/how-it-works"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors"
            >
              <span>Learn more about our methodology & delivery standards</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </section>

      {/* 6. FINAL HIGH-CONVERSION CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-8 sm:p-14 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 text-center md:text-left max-w-xl">
              <span className="inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 font-bold text-xs">
                Ready to elevate your online presence?
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
                Have a project in mind? <br />
                <span className="text-blue-400">Let’s build it together.</span>
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Submit your project specifications in under 2 minutes. Receive a customized scope breakdown and transparent quotation within 24 hours.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full sm:w-auto">
              <Link
                to="/start-project"
                className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-extrabold text-base shadow-lg transition-all flex items-center justify-center gap-2 text-center"
              >
                <span>Start Your Project</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="https://wa.me/918807855118?text=Hello%20NSK%20Team%2C%20I%20would%20like%20to%20discuss%20a%20project."
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-4 rounded-xl bg-emerald-600/90 hover:bg-emerald-600 text-white font-bold text-base transition-all flex items-center justify-center gap-2 text-center"
              >
                <MessageCircle className="w-5 h-5" />
                <span>WhatsApp</span>
              </a>
              <Link
                to="/contact"
                className="px-6 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-base transition-all flex items-center justify-center text-center"
              >
                Contact Team
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Login Required Modal */}
      <AuthRequiredModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        serviceTitle={services.find(s => s.slug === selectedServiceSlug)?.title}
        returnUrl={`/start-project?service=${selectedServiceSlug}`}
      />

    </div>
  );
};
