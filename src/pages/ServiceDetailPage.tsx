import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  Layers, 
  FileCheck, 
  Code2,
  ShoppingBag,
  Palette,
  RefreshCw,
  LayoutTemplate,
  Sparkles,
  ShieldCheck,
  MessageCircle
} from 'lucide-react';
import { store } from '../lib/store';
import { AuthRequiredModal } from '../components/portal/AuthRequiredModal';

const renderIcon = (iconName: string) => {
  switch (iconName) {
    case 'Code2': return <Code2 className="w-8 h-8 text-blue-600" />;
    case 'ShoppingBag': return <ShoppingBag className="w-8 h-8 text-indigo-600" />;
    case 'Palette': return <Palette className="w-8 h-8 text-purple-600" />;
    case 'RefreshCw': return <RefreshCw className="w-8 h-8 text-sky-600" />;
    case 'LayoutTemplate': return <LayoutTemplate className="w-8 h-8 text-emerald-600" />;
    case 'Sparkles': return <Sparkles className="w-8 h-8 text-amber-600" />;
    default: return <Code2 className="w-8 h-8 text-blue-600" />;
  }
};

export const ServiceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Look up by slug or ID
  const services = store.getServices();
  const service = services.find(s => s.slug === id || s.id === id);

  if (!service) {
    return (
      <div className="pt-36 pb-24 text-center max-w-xl mx-auto px-4 space-y-4">
        <h2 className="text-2xl font-black text-slate-900">Service Not Found</h2>
        <p className="text-sm text-slate-600">The service you requested does not exist or has been modified.</p>
        <Link to="/services" className="inline-block px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs">
          View All Services
        </Link>
      </div>
    );
  }

  const handleBookService = () => {
    const user = store.getCurrentUser();
    if (user) {
      navigate(`/start-project?service=${service.slug}`);
    } else {
      setAuthModalOpen(true);
    }
  };

  const whatsappMsg = encodeURIComponent(`Hello NSK Team, I would like to inquire about ${service.title}.`);

  return (
    <div className="pt-32 pb-24 bg-gradient-to-b from-slate-50 via-white to-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Back Link */}
        <Link
          to="/services"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Services</span>
        </Link>

        {/* Hero Showcase Card */}
        <div className="rounded-3xl bg-white border border-slate-200/90 overflow-hidden shadow-card">
          {service.image_url && (
            <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-100">
              <img
                src={service.image_url}
                alt={service.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-white">
                <div>
                  <span className="px-3 py-1 rounded-full bg-blue-600/90 backdrop-blur-md text-white font-bold text-xs uppercase tracking-wider">
                    Service Showcase
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-black mt-2 text-white drop-shadow-sm">
                    {service.title}
                  </h1>
                </div>
              </div>
            </div>
          )}

          <div className="p-8 sm:p-10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                  {renderIcon(service.icon)}
                </div>
                <div>
                  <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      Timeline: {service.estimated_timeline}
                    </span>
                    {service.starting_price && (
                      <span>• Starting from <strong className="text-slate-900 font-bold">{service.starting_price}</strong></span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleBookService}
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                >
                  <span>Book This Service</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href={`https://wa.me/918807855118?text=${whatsappMsg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-sm transition-all flex items-center justify-center gap-1.5 shrink-0"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>Inquire on WhatsApp</span>
                </a>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600">Service Overview</h3>
              <p className="text-base text-slate-700 leading-relaxed">
                {service.full_desc}
              </p>
            </div>
          </div>
        </div>

        {/* Features & Deliverables Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Features */}
          <div className="rounded-3xl bg-white border border-slate-200/90 p-8 shadow-card space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>Features Included</span>
            </h3>
            <div className="space-y-2.5">
              {service.features.map((feat, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5 text-xs font-medium text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Deliverables */}
          <div className="rounded-3xl bg-white border border-slate-200/90 p-8 shadow-card space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              <span>Deliverables You Receive</span>
            </h3>
            <div className="space-y-3 pt-1">
              {service.deliverables.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm font-medium text-slate-700">
                  <div className="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-1.5"></div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Execution Process Roadmap */}
        <div className="rounded-3xl bg-white border border-slate-200/90 p-8 sm:p-10 shadow-card space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
            How We Execute This Service
          </h3>
          <div className="space-y-4 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
            {service.process.map((p) => (
              <div key={p.step} className="relative flex items-start gap-4 pl-1">
                <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 z-10 ring-4 ring-white">
                  {p.step}
                </div>
                <div className="pt-0.5">
                  <h4 className="text-sm font-bold text-slate-900">{p.title}</h4>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <div className="rounded-3xl bg-slate-900 p-8 sm:p-10 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-xl font-bold">Ready to start with {service.title}?</h4>
            <p className="text-xs text-slate-300">Get a tailored scope breakdown and transparent quote within 24 hours.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              onClick={handleBookService}
              className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all shrink-0 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Book Service</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href={`https://wa.me/918807855118?text=${whatsappMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all shrink-0 flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

      </div>

      {/* Login Required Modal */}
      <AuthRequiredModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        serviceTitle={service.title}
        returnUrl={`/start-project?service=${service.slug}`}
      />
    </div>
  );
};
