import React from 'react';
import { 
  X, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  Code2, 
  ShoppingBag, 
  Palette, 
  RefreshCw, 
  LayoutTemplate, 
  Sparkles,
  Layers,
  FileCheck
} from 'lucide-react';
import { Service } from '../../types';

interface ServiceDetailModalProps {
  service: Service | null;
  onClose: () => void;
  onRequestService: (service: Service) => void;
}

const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case 'Code2': return <Code2 className="w-6 h-6 text-blue-600" />;
    case 'ShoppingBag': return <ShoppingBag className="w-6 h-6 text-indigo-600" />;
    case 'Palette': return <Palette className="w-6 h-6 text-purple-600" />;
    case 'RefreshCw': return <RefreshCw className="w-6 h-6 text-sky-600" />;
    case 'LayoutTemplate': return <LayoutTemplate className="w-6 h-6 text-emerald-600" />;
    case 'Sparkles': return <Sparkles className="w-6 h-6 text-amber-600" />;
    default: return <Code2 className="w-6 h-6 text-blue-600" />;
  }
};

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({ service, onClose, onRequestService }) => {
  if (!service) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-3xl w-full max-h-[90vh] overflow-y-auto transform animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Sticky Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-5 border-b border-slate-100 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center">
              {getIconComponent(service.icon)}
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
                {service.title}
              </h2>
              <div className="flex items-center gap-3 text-xs font-semibold text-slate-500 mt-0.5">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Timeline: {service.estimated_timeline}
                </span>
                {service.starting_price && (
                  <span>
                    • Starting from <strong className="text-slate-900 font-bold">₹{service.starting_price.toLocaleString('en-IN')}</strong>
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* Overview description */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-blue-600">Service Overview</h3>
            <p className="text-base text-slate-700 leading-relaxed">
              {service.full_desc}
            </p>
          </div>

          {/* Key Features & Specifications */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>Features Included</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {service.features.map((feat, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5 text-xs font-medium text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Deliverables */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              <span>What You Receive</span>
            </h3>
            <div className="space-y-2">
              {service.deliverables.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-slate-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 5-Step Process Roadmap */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">Execution Process</h3>
            <div className="space-y-3 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
              {service.process.map((p) => (
                <div key={p.step} className="relative flex items-start gap-4 pl-1">
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 z-10 ring-4 ring-white">
                    {p.step}
                  </div>
                  <div className="pt-0.5">
                    <h4 className="text-sm font-bold text-slate-900">{p.title}</h4>
                    <p className="text-xs text-slate-600 mt-0.5">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Sticky Footer CTA */}
        <div className="sticky bottom-0 bg-white/95 backdrop-blur-md px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-left w-full sm:w-auto">
            <div className="text-xs text-slate-500">Ready to get started?</div>
            <div className="text-sm font-bold text-slate-900">Customized scope & proposal</div>
          </div>
          
          <button
            id="modal-request-service-btn"
            onClick={() => {
              onClose();
              onRequestService(service);
            }}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <span>Request This Service</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
