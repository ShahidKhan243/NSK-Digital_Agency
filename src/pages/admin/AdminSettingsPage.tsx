import React, { useState } from 'react';
import { Settings, Save, Check } from 'lucide-react';
import { store } from '../../lib/store';
import { SiteSettings } from '../../types';

export const AdminSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings>(store.getSettings());
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    store.updateSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="rounded-3xl bg-white border border-slate-200/90 shadow-card p-6 sm:p-10 space-y-6 max-w-3xl animate-in fade-in duration-200">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-black text-slate-900">Agency Business Settings</h2>
          <p className="text-xs text-slate-500">Configure global business profile and contact information</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-4 text-xs">
        <div>
          <label className="block font-bold text-slate-700 uppercase mb-1">Business Name</label>
          <input
            type="text"
            value={settings.agency_name}
            onChange={e => setSettings({ ...settings, agency_name: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 uppercase mb-1">Official Tagline</label>
          <input
            type="text"
            value={settings.tagline}
            onChange={e => setSettings({ ...settings, tagline: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Contact Email</label>
            <input
              type="email"
              value={settings.email}
              onChange={e => setSettings({ ...settings, email: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Contact Phone</label>
            <input
              type="text"
              value={settings.phone}
              onChange={e => setSettings({ ...settings, phone: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block font-bold text-slate-700 uppercase mb-1">Office Physical Location</label>
          <input
            type="text"
            value={settings.address}
            onChange={e => setSettings({ ...settings, address: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 uppercase mb-1">Business Hours</label>
          <input
            type="text"
            value={settings.business_hours}
            onChange={e => setSettings({ ...settings, business_hours: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
          />
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>

          {saved && (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              <Check className="w-4 h-4" /> Settings updated!
            </span>
          )}
        </div>
      </form>
    </div>
  );
};
