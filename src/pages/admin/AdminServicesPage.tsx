import React, { useState, useEffect } from 'react';
import { Sparkles, Clock, Check, Edit2, Image, Save, X, ExternalLink, UploadCloud } from 'lucide-react';
import { store } from '../../lib/store';
import { api } from '../../lib/api';
import { Service } from '../../types';

export const AdminServicesPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>(store.getServices());
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [imageUrlDraft, setImageUrlDraft] = useState('');
  const [timelineDraft, setTimelineDraft] = useState('');
  const [priceDraft, setPriceDraft] = useState<string>('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const refreshServices = async () => {
    if (api.isLive()) {
      const data = await api.getServices();
      if (data) setServices(data);
    } else {
      setServices(store.getServices());
    }
  };

  useEffect(() => {
    refreshServices();
    const unsubscribe = store.subscribe(() => {
      refreshServices();
    });
    return () => unsubscribe();
  }, []);

  const handleOpenEdit = (s: Service) => {
    setEditingService(s);
    setImageUrlDraft(s.image_url || '');
    setTimelineDraft(s.estimated_timeline || '');
    setPriceDraft(s.starting_price ? String(s.starting_price) : '');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingService || !e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    setIsUploading(true);
    try {
      const publicUrl = await api.uploadServiceImage(file, editingService.slug);
      if (publicUrl) {
        setImageUrlDraft(publicUrl);
        setFeedback('Image uploaded to Supabase Storage.');
        setTimeout(() => setFeedback(null), 3000);
      }
    } catch (err) {
      console.error('Image upload failed:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    await api.updateServiceShowcase(editingService.id, {
      image_url: imageUrlDraft.trim(),
      timeline: timelineDraft.trim(),
      price: priceDraft ? Number(priceDraft) : undefined
    });

    setFeedback(`Updated ${editingService.title} showcase settings.`);
    setEditingService(null);
    refreshServices();
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="p-4 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Services & Showcase Catalog</h2>
          <p className="text-xs text-slate-500">
            Manage showcase images, starting price tags, and delivery timelines displayed on public catalog.
          </p>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{feedback}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map(s => (
          <div key={s.id} className="rounded-3xl bg-white border border-slate-200/90 shadow-card overflow-hidden flex flex-col justify-between group">
            <div>
              {s.image_url && (
                <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                  <img src={s.image_url} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-md bg-white/90 text-slate-800 font-mono text-[10px] font-bold shadow-sm">
                    {s.slug}
                  </div>
                </div>
              )}

              <div className="p-6 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-bold text-base text-slate-900 leading-snug">{s.title}</h4>
                  {s.starting_price && (
                    <span className="shrink-0 text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      ₹{s.starting_price.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-500 line-clamp-2">{s.short_desc}</p>

                <div className="space-y-1.5 pt-3 border-t border-slate-100 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Est. Timeline:</span>
                    <strong className="text-slate-800">{s.estimated_timeline}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Features:</span>
                    <strong className="text-slate-800">{s.features.length} points</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0">
              <button
                onClick={() => handleOpenEdit(s)}
                className="w-full py-2.5 px-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 text-slate-800 hover:text-blue-600 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Showcase & Pricing</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Service Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900">
                Edit {editingService.title}
              </h3>
              <button onClick={() => setEditingService(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Showcase Image URL / Upload</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="url"
                    value={imageUrlDraft}
                    onChange={e => setImageUrlDraft(e.target.value)}
                    placeholder="https://images.unsplash.com/... or upload"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <label className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 cursor-pointer shrink-0">
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>{isUploading ? 'Uploading...' : 'Upload'}</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" disabled={isUploading} />
                  </label>
                </div>
                {imageUrlDraft && (
                  <div className="h-24 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                    <img src={imageUrlDraft} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Starting Price (INR)</label>
                  <input
                    type="number"
                    value={priceDraft}
                    onChange={e => setPriceDraft(e.target.value)}
                    placeholder="24999"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Est. Timeline</label>
                  <input
                    type="text"
                    value={timelineDraft}
                    onChange={e => setTimelineDraft(e.target.value)}
                    placeholder="e.g. 2 - 4 Weeks"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
                    required
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-sm cursor-pointer"
                >
                  Save Showcase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
