import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Target, 
  Cpu, 
  HeartHandshake, 
  ArrowRight,
  CheckCircle2,
  Users
} from 'lucide-react';

const TECH_STACK = [
  { name: 'React', desc: 'Modern Reactive UI' },
  { name: 'TypeScript', desc: 'Type-Safe Reliability' },
  { name: 'Tailwind CSS', desc: 'Utility Design System' },
  { name: 'Next.js', desc: 'Fullstack Performance' },
  { name: 'PostgreSQL', desc: 'Relational Database' },
  { name: 'Supabase', desc: 'Auth, Storage & DB' },
  { name: 'Figma', desc: 'UI/UX Prototyping' },
  { name: 'Cloudflare', desc: 'Global CDN & Security' }
];

const VALUES = [
  {
    title: 'Engineered for Real Growth',
    desc: 'We do not build bloated templates. Every component is engineered for sub-second speeds, clean SEO indexability, and peak conversion rates.',
    icon: Cpu
  },
  {
    title: 'Transparent Pricing & Portal',
    desc: 'No hidden costs. Every milestone, quotation line item, and status transition is tracked in real time on our client portal.',
    icon: ShieldCheck
  },
  {
    title: 'Bespoke Modern Aesthetics',
    desc: 'Visual beauty combined with rigorous UX psychology. We craft intuitive journeys that turn casual visitors into loyal paying customers.',
    icon: Target
  },
  {
    title: 'Dedicated Post-Launch Care',
    desc: 'We stay by your side after deployment with bug warranty, speed monitoring, and team training to guarantee long-term business success.',
    icon: HeartHandshake
  }
];

export const AboutPage: React.FC = () => {
  return (
    <div className="pt-32 pb-24 bg-gradient-to-b from-slate-50 via-white to-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header Story */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider">
              About NSK
            </div>

            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Websites That Build Your Business
            </h1>

            <p className="text-base text-slate-600 leading-relaxed">
              <strong>NSK</strong> is a premier digital agency and engineering house that builds high-converting business websites, custom web applications, e-commerce storefronts, and brand systems.
            </p>

            <p className="text-sm text-slate-600 leading-relaxed">
              We believe a business website should be your company’s most effective sales channel. By merging user experience research, modern typography, pixel-perfect design systems, and robust full-stack code, we deliver websites that not only look remarkable but drive measurable commercial growth.
            </p>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100">
              <div>
                <div className="text-3xl font-black text-blue-600">99.4%</div>
                <div className="text-xs font-medium text-slate-500 mt-0.5">On-Time Delivery</div>
              </div>
              <div>
                <div className="text-3xl font-black text-slate-900">&lt; 0.6s</div>
                <div className="text-xs font-medium text-slate-500 mt-0.5">Avg Load Speed</div>
              </div>
              <div>
                <div className="text-3xl font-black text-emerald-600">100%</div>
                <div className="text-xs font-medium text-slate-500 mt-0.5">Code Ownership</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-3xl bg-white border border-slate-200/90 p-8 shadow-card space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-black text-xl flex items-center justify-center shadow-md">
                  N
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900">NSK Digital Agency</h3>
                  <p className="text-xs text-slate-500">Bangalore, India • Global Clients</p>
                </div>
              </div>

              <div className="space-y-3 text-xs text-slate-600">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <strong className="text-slate-800 block mb-1">Our Mission</strong>
                  To empower ambitious businesses with digital platforms that convert traffic into revenue with speed and reliability.
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <strong className="text-slate-800 block mb-1">Our Quality Standard</strong>
                  Zero cookie-cutter templates, 95+ PageSpeed scores, strict security standards, and 100% transparent tracking.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Agency Values */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl font-extrabold text-slate-900">Our Core Principles</h2>
            <p className="text-sm text-slate-600">How we work and why clients choose us for mission-critical projects.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((val, idx) => {
              const IconComp = val.icon;
              return (
                <div key={idx} className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-card space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{val.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{val.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Technology Foundation */}
        <div className="rounded-3xl bg-white border border-slate-200/90 p-8 sm:p-12 shadow-card space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-900">Modern Technology Foundation</h2>
            <p className="text-xs sm:text-sm text-slate-600">
              We engineer with battle-tested modern tools to ensure sub-second performance, maintainability, and enterprise security.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {TECH_STACK.map((tech, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center space-y-1">
                <div className="text-sm font-bold text-slate-900">{tech.name}</div>
                <div className="text-[11px] text-slate-500">{tech.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="rounded-3xl bg-slate-900 p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl font-black">Let’s discuss your digital roadmap</h3>
            <p className="text-sm text-slate-300 max-w-xl">
              Get in touch to explore how we can help your business build a modern, high-converting digital platform.
            </p>
          </div>
          <Link
            to="/start-project"
            className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all shrink-0 flex items-center gap-2"
          >
            <span>Start Your Project</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
};
