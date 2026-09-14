import React, { useState } from 'react';
import { 
  Code2, 
  ShoppingBag, 
  Palette, 
  RefreshCw, 
  LayoutTemplate, 
  Sparkles, 
  ArrowRight, 
  Clock, 
  ChevronRight,
  Check
} from 'lucide-react';
import { Service } from '../../types';
import { store } from '../../lib/store';
import { ServiceDetailModal } from './ServiceDetailModal';

interface ServicesSectionProps {
  onRequestService: (service: Service) => void;
}

const renderServiceIcon = (iconName: string) => {
  switch (iconName) {
    case 'Code2':
      return <Code2 className="w-7 h-7 text-blue-600" />;
    case 'ShoppingBag':
      return <ShoppingBag className="w-7 h-7 text-indigo-600" />;
    case 'Palette':
      return <Palette className="w-7 h-7 text-purple-600" />;
    case 'RefreshCw':
      return <RefreshCw className="w-7 h-7 text-sky-600" />;
    case 'LayoutTemplate':
      return <LayoutTemplate className="w-7 h-7 text-emerald-600" />;
    case 'Sparkles':
      return <Sparkles className="w-7 h-7 text-amber-600" />;
    default:
      return <Code2 className="w-7 h-7 text-blue-600" />;
  }
};

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onRequestService }) => {
  const [services] = useState<Service[]>(store.getServices());
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  return (
    <section id="services" className="py-24 bg-white relative">
      {/* Background Soft Accent */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider">
            Our Core Services
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Tailored Digital Solutions Built to Scale
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            From custom web engineering to intuitive user interfaces, we deliver reliable, production-grade solutions for businesses of all sizes.
          </p>
        </div>

        {/* 6 Core Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="rounded-3xl bg-white border border-slate-200/90 p-8 shadow-card hover:shadow-card-hover hover:border-blue-200 transition-all duration-300 flex flex-col justify-between group relative"
            >
              <div>
                {/* Icon & Starting Price Tag */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 group-hover:bg-blue-50/70 group-hover:border-blue-100 flex items-center justify-center transition-colors">
                    {renderServiceIcon(service.icon)}
                  </div>
                  {service.starting_price && (
                    <div className="text-right">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Starting from</div>
                      <div className="text-sm font-extrabold text-slate-900">
                        ₹{service.starting_price.toLocaleString('en-IN')}
                      </div>
                    </div>
                  )}
                </div>

                {/* Service Name */}
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2.5">
                  {service.title}
                </h3>

                {/* Short Description */}
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  {service.short_desc}
                </p>

                {/* Feature Highlights (Top 3) */}
                <div className="space-y-2 mb-6 pt-4 border-t border-slate-100 text-xs font-medium text-slate-700">
                  {service.features.slice(0, 3).map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons & Timeline */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500 pb-1">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Est. Timeline:
                  </span>
                  <span className="text-slate-800 font-bold">{service.estimated_timeline}</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedService(service)}
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800 font-semibold text-xs transition-colors text-center"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => onRequestService(service)}
                    className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm hover:shadow-md transition-all text-center flex items-center justify-center gap-1 group-hover:bg-blue-600"
                  >
                    <span>Request</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Service Detail Modal */}
      {selectedService && (
        <ServiceDetailModal
          service={selectedService}
          onClose={() => setSelectedService(null)}
          onRequestService={(srv) => {
            setSelectedService(null);
            onRequestService(srv);
          }}
        />
      )}
    </section>
  );
};
