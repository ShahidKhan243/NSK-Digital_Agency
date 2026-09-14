import React from 'react';
import { 
  Search, 
  Palette, 
  Code2, 
  CheckCircle2, 
  Rocket, 
  ArrowRight,
  ShieldCheck,
  Zap,
  MessageSquareCode
} from 'lucide-react';

const STEPS = [
  {
    step: '01',
    title: 'Discovery & Proposal',
    short: 'Submit your requirements via our interactive quote builder. We review scope, recommend architecture, and send a transparent quote with timeline within 24 hours.',
    icon: Search,
    color: 'text-blue-600',
    bg: 'bg-blue-50'
  },
  {
    step: '02',
    title: 'UI/UX Wireframing',
    short: 'We design high-fidelity Figma prototypes and design systems. You get an interactive preview to test user flows and approve styling before any code is written.',
    icon: Palette,
    color: 'text-purple-600',
    bg: 'bg-purple-50'
  },
  {
    step: '03',
    title: 'Modern Development',
    short: 'Our engineers build your website using modern, clean code standards, lightning-fast APIs, responsive layouts, and secure database connections.',
    icon: Code2,
    color: 'text-sky-600',
    bg: 'bg-sky-50'
  },
  {
    step: '04',
    title: 'QA & SEO Benchmark',
    short: 'Rigorous cross-device testing, accessibility validation, Core Web Vitals speed optimization, and on-page technical SEO structured data configuration.',
    icon: CheckCircle2,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50'
  },
  {
    step: '05',
    title: 'Launch & Handoff',
    short: 'DNS cutover, SSL activation, CMS training walkthrough, source code delivery, and 30 days of dedicated post-launch support.',
    icon: Rocket,
    color: 'text-amber-600',
    bg: 'bg-amber-50'
  }
];

interface HowItWorksProps {
  onStartProject: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onStartProject }) => {
  return (
    <section id="how-it-works" className="py-24 bg-gradient-to-b from-white via-slate-50/50 to-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider">
            Our Proven Methodology
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How We Build & Deliver Your Project
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            A structured, transparent 5-stage agency process designed for seamless execution, zero surprises, and rapid turnaround.
          </p>
        </div>

        {/* 5-Step Process Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 relative">
          {STEPS.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.step}
                className="rounded-3xl bg-white border border-slate-200/90 p-6 shadow-card hover:shadow-card-hover hover:border-blue-200 transition-all duration-300 flex flex-col justify-between group relative"
              >
                <div>
                  {/* Step Number & Icon */}
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-2xl font-black font-mono text-slate-300 group-hover:text-blue-600 transition-colors">
                      {item.step}
                    </span>
                    <div className={`w-12 h-12 rounded-2xl ${item.bg} flex items-center justify-center`}>
                      <IconComponent className={`w-6 h-6 ${item.color}`} />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.short}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-bold text-blue-600">
                  <span>Stage {index + 1} of 5</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Transparency Feature Cards */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-subtle flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Live Stage Tracker</h4>
              <p className="text-xs text-slate-600 mt-1">Track exact development milestones inside your dedicated client portal.</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-subtle flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <MessageSquareCode className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Direct Engineering Chat</h4>
              <p className="text-xs text-slate-600 mt-1">Communicate directly with your assigned project lead without middlemen.</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-subtle flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">100% Code Ownership</h4>
              <p className="text-xs text-slate-600 mt-1">Full source code repository, documentation, and IP rights transferred upon signoff.</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
