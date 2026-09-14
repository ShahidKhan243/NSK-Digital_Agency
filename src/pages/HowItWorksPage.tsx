import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Palette, 
  Code2, 
  CheckCircle2, 
  Rocket, 
  ArrowRight,
  ShieldCheck,
  Zap,
  MessageSquareCode,
  FileCheck,
  Clock
} from 'lucide-react';

const DETAILED_STEPS = [
  {
    step: '01',
    title: 'Discovery, Scoping & Architecture',
    desc: 'We analyze your business goals, target audience, technical requirements, and competitor landscape. Within 24 hours, you receive a transparent scope breakdown and fixed-price quotation.',
    deliverable: 'Comprehensive Scope of Work & Milestone Schedule',
    icon: Search
  },
  {
    step: '02',
    title: 'Wireframing & Interactive UI/UX Design',
    desc: 'Our design team creates pixel-perfect Figma wireframes and clickable prototypes. You can test user flows, review typography and color harmonies, and request revisions before coding begins.',
    deliverable: 'Interactive Figma Prototype & Design System Kit',
    icon: Palette
  },
  {
    step: '03',
    title: 'Modern Clean Development',
    desc: 'We engineer your website using type-safe TypeScript, responsive styling, and fast backend APIs. Every feature is built according to production-grade industry security and speed standards.',
    deliverable: 'Modular, Component-Driven Source Code',
    icon: Code2
  },
  {
    step: '04',
    title: 'Quality Assurance & SEO Optimization',
    desc: 'We test across real mobile, tablet, and desktop viewports, execute accessibility audits, and benchmark speed against Google PageSpeed Insights to guarantee 95+ performance scores.',
    deliverable: 'Lighthouse Audit Report & Technical SEO Verification',
    icon: CheckCircle2
  },
  {
    step: '05',
    title: 'Production Launch & Knowledge Transfer',
    desc: 'We handle zero-downtime DNS deployment, SSL encryption, database backup routines, and provide a 1-on-1 walkthrough video so your team can effortlessly manage content.',
    deliverable: 'Full IP & Source Code Ownership + 30 Days Free Support',
    icon: Rocket
  }
];

export const HowItWorksPage: React.FC = () => {
  return (
    <div className="pt-32 pb-24 bg-gradient-to-b from-slate-50 via-white to-white min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider">
            Our Methodology
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
            How We Deliver Exceptional Websites
          </h1>
          <p className="text-base sm:text-lg text-slate-600">
            A battle-tested 5-stage agency process designed for predictable timelines, complete transparency, and flawless execution.
          </p>
        </div>

        {/* 5 Steps Breakdown */}
        <div className="space-y-8">
          {DETAILED_STEPS.map((item, index) => {
            const IconComp = item.icon;
            return (
              <div
                key={item.step}
                className="rounded-3xl bg-white border border-slate-200/90 p-8 sm:p-10 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col sm:flex-row gap-6 sm:gap-8 items-start"
              >
                <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <IconComp className="w-8 h-8" />
                </div>

                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-black text-sm text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md">
                      Stage {item.step}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>

                  <div className="pt-2 flex items-center gap-2 text-xs font-bold text-slate-800">
                    <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Deliverable: <span className="text-slate-600 font-medium">{item.deliverable}</span></span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Guarantees Box */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-subtle space-y-2">
            <Zap className="w-6 h-6 text-blue-600" />
            <h4 className="text-base font-bold text-slate-900">Real-Time Client Portal</h4>
            <p className="text-xs text-slate-600">Track stage progress, review milestones, and chat with developers.</p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-subtle space-y-2">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
            <h4 className="text-base font-bold text-slate-900">100% Code Ownership</h4>
            <p className="text-xs text-slate-600">Full repository transfer, documentation, and zero vendor lock-in.</p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-subtle space-y-2">
            <Clock className="w-6 h-6 text-amber-600" />
            <h4 className="text-base font-bold text-slate-900">On-Time Delivery</h4>
            <p className="text-xs text-slate-600">Strict milestone schedules with clear progress check-ins.</p>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="rounded-3xl bg-slate-900 p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl font-black">Ready to build your next project?</h3>
            <p className="text-sm text-slate-300 max-w-xl">
              Tell us about your project goals. Get a detailed proposal and quotation within 24 hours.
            </p>
          </div>
          <Link
            to="/start-project"
            className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm shadow-md transition-all shrink-0 flex items-center gap-2"
          >
            <span>Start Your Project</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
};
