import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowUp, 
  Mail, 
  Phone, 
  MapPin, 
  MessageCircle 
} from 'lucide-react';
import { store } from '../../lib/store';

export const Footer: React.FC = () => {
  const settings = store.getSettings();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand & Slogan */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block p-2 rounded-2xl bg-white shadow-md">
              <img
                src="/logo.png"
                alt="NSK — Websites That Build Your Business"
                className="h-10 sm:h-12 w-auto object-contain"
              />
            </Link>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              We design and engineer high-performance web applications, e-commerce storefronts, and brand identities tailored for customer conversion and enterprise growth.
            </p>

            {/* WhatsApp Quick Direct Link */}
            <div className="pt-2">
              <a 
                href="https://wa.me/918807855118?text=Hello%20NSK%20Team%2C%20I%20would%20like%20to%20discuss%20a%20project."
                target="_blank" 
                rel="noreferrer" 
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp: +91 8807855118</span>
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">Services</Link></li>
              <li><Link to="/how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link to="/start-project" className="hover:text-white transition-colors">Start Project</Link></li>
            </ul>
          </div>

          {/* Services Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Services</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/services/website-development" className="hover:text-white transition-colors">Website Development</Link></li>
              <li><Link to="/services/ecommerce-development" className="hover:text-white transition-colors">E-Commerce Development</Link></li>
              <li><Link to="/services/ui-ux-design" className="hover:text-white transition-colors">UI/UX Design</Link></li>
              <li><Link to="/services/website-redesign" className="hover:text-white transition-colors">Website Redesign</Link></li>
              <li><Link to="/services/landing-pages" className="hover:text-white transition-colors">Landing Pages</Link></li>
              <li><Link to="/services/graphic-brand-design" className="hover:text-white transition-colors">Graphic & Brand Design</Link></li>
            </ul>
          </div>

          {/* Agency Contact Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Contact</h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <a href={`mailto:${settings.email}`} className="hover:text-white transition-colors">
                  {settings.email}
                </a>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <a href={`tel:${settings.phone.replace(/\s+/g, '')}`} className="hover:text-white transition-colors">
                  {settings.phone}
                </a>
              </div>
              <div className="flex items-start gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <a 
                  href="https://wa.me/918807855118?text=Hello%20NSK%20Team%2C%20I%20would%20like%20to%20discuss%20a%20project." 
                  target="_blank" 
                  rel="noreferrer" 
                  className="hover:text-white transition-colors"
                >
                  WhatsApp: 8807855118
                </a>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 NSK. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
              title="Scroll to top"
            >
              <ArrowUp className="w-4 h-4" />
              <span className="text-[11px] font-semibold">Top</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
