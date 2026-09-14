import React from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  TrendingUp, 
  Zap, 
  Shield, 
  Gauge, 
  Layers,
  Code2,
  Globe
} from 'lucide-react';

interface HeroProps {
  onStartProject: () => void;
  onViewWork: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartProject, onViewWork }) => {
  return (
    <section id="hero" className="relative pt-32 pb-20 lg:pt-36 lg:pb-28 overflow-hidden bg-gradient-to-b from-slate-50/80 via-white to-white">
      {/* Soft Ambient Background Elements (Clean, non-neon, professional) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-blue-50/60 to-transparent pointer-events-none -z-10 rounded-full blur-3xl opacity-70"></div>
      <div className="absolute top-20 right-10 w-72 h-72 bg-blue-100/30 rounded-full blur-2xl pointer-events-none -z-10"></div>
      <div className="absolute top-40 left-10 w-80 h-80 bg-indigo-50/40 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
            
            {/* Value Tag Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-800 text-xs font-semibold tracking-wide shadow-subtle animate-in fade-in slide-in-from-top-2 duration-500">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
              <span>Full-Stack Digital Agency & Development House</span>
              <Sparkles className="w-3.5 h-3.5 text-blue-600 ml-0.5" />
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
              We Build Websites That <br className="hidden sm:inline" />
              <span className="text-gradient-accent">Work for Your Business</span>
            </h1>

            {/* Supporting Subtext */}
            <p className="text-lg sm:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl">
              Professional websites, digital experiences, and creative solutions designed to help businesses grow online.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2 w-full sm:w-auto">
              <button
                id="hero-start-project-btn"
                onClick={onStartProject}
                className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-base shadow-md hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2.5 group cursor-pointer"
              >
                <span>Start Your Project</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                id="hero-view-work-btn"
                onClick={onViewWork}
                className="px-7 py-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-800 font-bold text-base shadow-subtle hover:shadow-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>View Our Work</span>
              </button>
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

          {/* Right Visual Composition (Interactive Mockups & Live Agency Cards) */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              
              {/* Main Browser Card */}
              <div className="rounded-2xl bg-white border border-slate-200/90 shadow-2xl overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
                {/* Browser Top Window Bar */}
                <div className="px-4 py-3 bg-slate-50/90 border-b border-slate-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-red-400"></span>
                    <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                    <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-white border border-slate-200 text-[11px] font-mono text-slate-500 max-w-[220px] truncate shadow-subtle">
                    <Globe className="w-3 h-3 text-blue-500" />
                    <span>https://yourbrand.com</span>
                  </div>
                  <div className="w-12"></div>
                </div>

                {/* Mockup Preview Area */}
                <div className="p-6 bg-gradient-to-br from-slate-50 to-blue-50/30 space-y-4">
                  {/* Miniature Hero Mockup */}
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
                    <div className="flex gap-2 pt-2">
                      <div className="w-20 h-5 rounded-md bg-blue-600"></div>
                      <div className="w-16 h-5 rounded-md bg-slate-100 border border-slate-200"></div>
                    </div>
                  </div>

                  {/* Two Mini Dashboard Stats */}
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

              {/* Floating Performance Badge Card 1 */}
              <div className="absolute -top-6 -left-6 bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-xl flex items-center gap-3 animate-float hidden sm:flex">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">0.4s Fast Load</div>
                  <div className="text-[11px] text-slate-500 font-medium">Core Web Vitals Pass</div>
                </div>
              </div>

              {/* Floating Project Tracking Card 2 */}
              <div className="absolute -bottom-6 -right-4 bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-xl flex items-center gap-3 hidden sm:flex">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Real-time Portal</div>
                  <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Live Stage Tracking
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Small Trust Section Below Hero */}
        <div className="mt-16 pt-8 border-t border-slate-200/80">
          <div className="text-center mb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-600">
              End-to-End Capabilities
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-sm sm:text-base font-bold text-slate-800">
            <span className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-blue-50/50 hover:border-blue-200 transition-colors">
              Web Development
            </span>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <span className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-blue-50/50 hover:border-blue-200 transition-colors">
              UI/UX Design
            </span>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <span className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-blue-50/50 hover:border-blue-200 transition-colors">
              Business Websites
            </span>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <span className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-blue-50/50 hover:border-blue-200 transition-colors">
              E-Commerce
            </span>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <span className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-blue-50/50 hover:border-blue-200 transition-colors">
              Branding
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};
