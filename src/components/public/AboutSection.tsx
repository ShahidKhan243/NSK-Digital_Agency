import React from 'react';
import { 
  ShieldCheck, 
  Target, 
  Sparkles, 
  Users, 
  Code, 
  Award, 
  HeartHandshake, 
  Cpu,
  Layers
} from 'lucide-react';

const TECH_STACK = [
  { name: 'React', desc: 'Modern Reactive Frontend' },
  { name: 'TypeScript', desc: 'Type-Safe Reliability' },
  { name: 'Tailwind CSS', desc: 'Utility Design System' },
  { name: 'Next.js', desc: 'Fullstack Performance' },
  { name: 'PostgreSQL', desc: 'Robust Relational DB' },
  { name: 'Supabase', desc: 'Auth, Storage & Realtime' },
  { name: 'Figma', desc: 'UI/UX Prototyping' },
  { name: 'Cloudflare', desc: 'Global CDN & Security' }
];

const VALUES = [
  {
    title: 'Engineered for Performance',
    desc: 'We do not build bloated templates. Every line of code is structured for sub-second speeds, clean SEO indexability, and peak conversion.',
    icon: Cpu
  },
  {
    title: 'Transparent Pricing & Tracking',
    desc: 'No hidden fees or scope ambiguity. Every milestone, quotation line item, and status transition is tracked in real-time on our client portal.',
    icon: ShieldCheck
  },
  {
    title: 'Design That Converts',
    desc: 'Visual beauty combined with rigorous UX psychology. We design interfaces that guide visitors intuitively toward becoming paying customers.',
    icon: Target
  },
  {
    title: 'Dedicated Post-Launch Care',
    desc: 'We stay by your side after deployment with bug warranty, performance monitoring, and team training to ensure long-term business success.',
    icon: HeartHandshake
  }
];

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider">
              About NSK
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              A Modern Digital Agency Building Tools for Business Growth
            </h2>

            <p className="text-base text-slate-600 leading-relaxed">
              At <strong>NSK</strong>, we believe your website should be your company’s most effective sales representative, not just a static digital brochure. 
            </p>

            <p className="text-sm text-slate-600 leading-relaxed">
              We bring together full-stack engineering, user-centric interface design, and conversion rate optimization to deliver digital products that scale smoothly as your business grows. Whether launching a new venture or modernizing an established enterprise platform, we deliver reliable, production-ready solutions on time.
            </p>

            {/* Core Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100">
              <div>
                <div className="text-2xl sm:text-3xl font-black text-blue-600">99.4%</div>
                <div className="text-xs font-medium text-slate-500 mt-0.5">On-Time Delivery</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900">&lt; 0.6s</div>
                <div className="text-xs font-medium text-slate-500 mt-0.5">Avg Load Speed</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-600">100%</div>
                <div className="text-xs font-medium text-slate-500 mt-0.5">Code Ownership</div>
              </div>
            </div>
          </div>

          {/* Right Visual / Values Card */}
          <div className="lg:col-span-6">
            <div className="rounded-3xl bg-slate-50 border border-slate-200/80 p-8 sm:p-10 shadow-card space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center shadow-sm">
                  N
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900">NSK Agency Principles</h3>
                  <p className="text-xs text-slate-500">How we work and why clients trust us</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {VALUES.map((val, idx) => {
                  const IconComp = val.icon;
                  return (
                    <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-200/80 space-y-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                        <IconComp className="w-4 h-4" />
                      </div>
                      <h4 className="text-xs font-bold text-slate-900">{val.title}</h4>
                      <p className="text-[11px] text-slate-600 leading-relaxed">{val.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>

        {/* Technology Stack Grid */}
        <div className="rounded-3xl bg-gradient-to-b from-slate-50 to-white border border-slate-200/80 p-8 sm:p-12">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <h3 className="text-xl font-bold text-slate-900">Modern Technology Foundation</h3>
            <p className="text-xs sm:text-sm text-slate-600">
              We build with modern, battle-tested technologies that ensure performance, maintainability, and enterprise-grade security.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {TECH_STACK.map((tech, idx) => (
              <div 
                key={idx} 
                className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-subtle hover:border-blue-300 transition-colors flex flex-col items-center text-center space-y-1"
              >
                <div className="text-sm font-bold text-slate-900">{tech.name}</div>
                <div className="text-[11px] text-slate-500">{tech.desc}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
