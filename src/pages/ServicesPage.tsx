import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Code2, 
  ShoppingBag, 
  Palette, 
  RefreshCw, 
  LayoutTemplate, 
  Sparkles, 
  ArrowRight, 
  Clock, 
  Check, 
  Search, 
  MessageCircle 
} from 'lucide-react';
import { store } from '../lib/store';
import { api } from '../lib/api';
import { Service } from '../types';
import { AuthRequiredModal } from '../components/portal/AuthRequiredModal';

const renderIcon = (iconName: string) => {
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

export const ServicesPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>(store.getServices());
  const [searchTerm, setSearchTerm] = useState('');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [selectedServiceSlug, setSelectedServiceSlug] = useState<string>('');
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchServices = async () => {
      const data = await api.getServices();
      if (data && data.length > 0) {
        setServices(data);
      }
    };
    fetchServices();
  }, []);

  const filteredServices = services.filter(s => 
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.short_desc.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    <div className="pt-32 pb-24 bg-gradient-to-b from-slate-50 via-white to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider">
            Explore Services
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Comprehensive Digital Services Catalog
          </h1>
          <p className="text-base sm:text-lg text-slate-600">
            Engineered to help companies build an authoritative online presence, generate inbound inquiries, and scale digital operations.
          </p>

          {/* Search bar */}
          <div className="pt-4 max-w-md mx-auto relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search services, development, design..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map(service => (
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
                      {renderIcon(service.icon)}
                      <span>{service.title}</span>
                    </div>
                  </div>
                )}

                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {service.title}
                    </h3>
                    {service.starting_price && (
                      <span className="shrink-0 text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                        {service.starting_price}
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-2">
                    {service.short_desc}
                  </p>

                  {/* Features */}
                  <div className="space-y-2 pt-2 border-t border-slate-100 text-xs font-medium text-slate-700">
                    {service.features.slice(0, 3).map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-6 pt-0 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500 pb-1">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Est. Timeline:
                  </span>
                  <span className="text-slate-800 font-bold">{service.estimated_timeline}</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to={`/services/${service.slug}`}
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800 font-semibold text-xs transition-colors text-center"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => handleBookService(service.slug)}
                    className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm hover:shadow-md transition-all text-center flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>Book Service</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* WhatsApp & Custom Inquiries Banner */}
        <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold">
              <MessageCircle className="w-4 h-4" />
              <span>Need a custom combination or have questions?</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black">
              Talk directly with our technical lead on WhatsApp
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Get immediate scoping advice and fast project turnaround estimates.
            </p>
          </div>

          <a
            href="https://wa.me/918807855118?text=Hello%20NSK%20Team%2C%20I%20have%20questions%20about%20your%20services."
            target="_blank"
            rel="noopener noreferrer"
            className="px-7 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Chat on WhatsApp (+91 8807855118)</span>
          </a>
        </div>

      </div>

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
