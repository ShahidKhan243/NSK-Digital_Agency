import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  DollarSign, 
  UploadCloud, 
  FileText, 
  ExternalLink, 
  Copy, 
  Check, 
  ArrowRight, 
  ShieldCheck,
  Info,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Service, Project } from '../../types';
import { store } from '../../lib/store';

interface QuoteBuilderProps {
  preselectedService?: Service | null;
  onViewProject: (projectId: string) => void;
}

const FEATURE_OPTIONS = [
  'Mobile Responsive Layout',
  'Content Management System (CMS)',
  'SEO & Google Search Indexing',
  'Payment Gateway (Razorpay/Stripe)',
  'Lead Capture & Contact Forms',
  'Custom UI/UX Wireframes & Prototype',
  'High-Speed Performance (<1s Load)',
  'Multi-Language Support',
  'Admin Dashboard & Analytics',
  'Live Chat & WhatsApp Integration',
  'E-Commerce Cart & Checkout',
  'SSL Security & Cloud Backups'
];

const BUDGET_RANGES = [
  '₹20,000 – ₹40,000',
  '₹40,000 – ₹75,000',
  '₹75,000 – ₹1,50,000',
  '₹1,50,000 – ₹3,00,000',
  '₹3,00,000+'
];

const DEADLINES = [
  'Urgent (Under 2 Weeks)',
  'Standard (3 – 4 Weeks)',
  'Flexible (1 – 2 Months)',
  'Ongoing Engagement'
];

export const QuoteBuilder: React.FC<QuoteBuilderProps> = ({ preselectedService, onViewProject }) => {
  const [services] = useState<Service[]>(store.getServices());
  
  // Form State
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [selectedServiceSlug, setSelectedServiceSlug] = useState(services[0]?.slug || 'website-development');
  const [projectTitle, setProjectTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    'Mobile Responsive Layout',
    'SEO & Google Search Indexing',
    'High-Speed Performance (<1s Load)'
  ]);
  const [budgetRange, setBudgetRange] = useState(BUDGET_RANGES[1]);
  const [preferredDeadline, setPreferredDeadline] = useState(DEADLINES[1]);
  const [referenceWebsite, setReferenceWebsite] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; size: string }[]>([]);

  // Validation & Submission State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedProject, setSubmittedProject] = useState<Project | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  // Sync if preselectedService changes from service modal
  useEffect(() => {
    if (preselectedService) {
      setSelectedServiceSlug(preselectedService.slug);
      const el = document.getElementById('quote');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [preselectedService]);

  const toggleFeature = (feat: string) => {
    setSelectedFeatures(prev => 
      prev.includes(feat) ? prev.filter(f => f !== feat) : [...prev, feat]
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(f => ({
        name: f.name,
        size: `${(f.size / (1024 * 1024)).toFixed(2)} MB`
      }));
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const validateForm = () => {
    const errs: Record<string, string> = {};

    if (!clientName.trim()) {
      errs.clientName = 'Please enter your full name.';
    }

    if (!clientEmail.trim()) {
      errs.clientEmail = 'Please provide your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail)) {
      errs.clientEmail = 'Please provide a valid email address.';
    }

    // Phone Number validation: exactly 10 digits for Indian standard
    const cleanPhone = clientPhone.replace(/\D/g, '');
    if (!clientPhone.trim()) {
      errs.clientPhone = 'Please provide your 10-digit mobile number.';
    } else if (cleanPhone.length !== 10) {
      errs.clientPhone = 'Phone number must be exactly 10 digits.';
    }

    if (!description.trim() || description.trim().length < 15) {
      errs.description = 'Please describe your project requirements (at least 15 characters).';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    const activeService = services.find(s => s.slug === selectedServiceSlug) || services[0];
    const currentUser = store.getCurrentUser();

    setTimeout(() => {
      const newProject = store.createProjectRequest({
        client_name: clientName.trim(),
        client_email: clientEmail.trim().toLowerCase(),
        client_phone: clientPhone.replace(/\D/g, ''),
        company_name: companyName.trim(),
        service_slug: activeService.slug,
        service_title: activeService.title,
        project_title: projectTitle.trim() || `${activeService.title} for ${companyName || clientName}`,
        description: description.trim(),
        required_features: selectedFeatures,
        budget_range: budgetRange,
        preferred_deadline: preferredDeadline,
        reference_website: referenceWebsite.trim(),
        customer_id: currentUser?.id
      });

      // Attach mock files if any
      uploadedFiles.forEach(f => {
        store.addProjectFile(newProject.id, {
          file_name: f.name,
          file_url: 'https://example.com/uploads/' + f.name,
          file_size: 1500000,
          file_type: 'application/octet-stream',
          category: 'client_upload',
          uploader_name: clientName,
          uploader_id: currentUser?.id
        });
      });

      setIsSubmitting(false);
      setSubmittedProject(newProject);

      // Trigger Confetti Celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore
      }
    }, 600);
  };

  const copyProjectId = () => {
    if (submittedProject) {
      navigator.clipboard.writeText(submittedProject.request_code);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const handleResetForm = () => {
    setSubmittedProject(null);
    setDescription('');
    setProjectTitle('');
    setReferenceWebsite('');
    setUploadedFiles([]);
    setErrors({});
  };

  return (
    <section id="quote" className="py-24 bg-gradient-to-b from-slate-50 to-white relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider">
            Start Your Project
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Request a Free Proposal & Quote
          </h2>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
            Tell us about your project goals. We analyze your requirements and deliver a detailed scope breakdown, timeline, and custom quotation within 24 hours.
          </p>
        </div>

        {/* Success Screen Card */}
        {submittedProject ? (
          <div className="rounded-3xl bg-white border border-slate-200/90 p-8 sm:p-12 shadow-card text-center space-y-6 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2 max-w-lg mx-auto">
              <h3 className="text-2xl font-black text-slate-900">
                Your project request has been successfully submitted!
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Our engineering and design leads are currently reviewing your specifications. You will receive an email confirmation and formal quotation shortly.
              </p>
            </div>

            {/* Unique Project Code Badge */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 max-w-md mx-auto flex items-center justify-between">
              <div className="text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Project Request ID</span>
                <span className="text-lg font-black font-mono text-blue-600">{submittedProject.request_code}</span>
              </div>
              <button
                onClick={copyProjectId}
                className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-white text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                {copiedId ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Copy ID</span>
                  </>
                )}
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <button
                onClick={() => onViewProject(submittedProject.id)}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Track Request in Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleResetForm}
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-sm transition-all"
              >
                Submit Another Request
              </button>
            </div>
          </div>
        ) : (
          /* Main Order Request Form */
          <form 
            onSubmit={handleSubmit}
            className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-10 shadow-card space-y-8"
          >
            {/* Step 1: Contact Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">1</div>
                <h3 className="text-base font-bold text-slate-900">Contact Information</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="quote-name-input"
                    type="text"
                    value={clientName}
                    onChange={e => {
                      setClientName(e.target.value);
                      if (errors.clientName) setErrors({ ...errors, clientName: '' });
                    }}
                    placeholder="Your full name"
                    className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                      errors.clientName ? 'border-red-400 bg-red-50/20' : 'border-slate-200 bg-slate-50/50 focus:bg-white'
                    }`}
                  />
                  {errors.clientName && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.clientName}
                    </p>
                  )}
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Business / Personal Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="quote-email-input"
                    type="email"
                    value={clientEmail}
                    onChange={e => {
                      setClientEmail(e.target.value);
                      if (errors.clientEmail) setErrors({ ...errors, clientEmail: '' });
                    }}
                    placeholder="name@company.com"
                    className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                      errors.clientEmail ? 'border-red-400 bg-red-50/20' : 'border-slate-200 bg-slate-50/50 focus:bg-white'
                    }`}
                  />
                  {errors.clientEmail && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.clientEmail}
                    </p>
                  )}
                </div>

                {/* Phone Number (10 digits validation) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Mobile Phone (10 Digits) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-xs font-bold text-slate-400">
                      +91
                    </div>
                    <input
                      id="quote-phone-input"
                      type="tel"
                      maxLength={10}
                      value={clientPhone}
                      onChange={e => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setClientPhone(val);
                        if (errors.clientPhone) setErrors({ ...errors, clientPhone: '' });
                      }}
                      placeholder="Enter 10-digit mobile number"
                      className={`w-full pl-12 pr-4 py-3 rounded-xl border text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                        errors.clientPhone ? 'border-red-400 bg-red-50/20' : 'border-slate-200 bg-slate-50/50 focus:bg-white'
                      }`}
                    />
                  </div>
                  {errors.clientPhone ? (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.clientPhone}
                    </p>
                  ) : (
                    <p className="text-[11px] text-slate-400 mt-1">Accepts 10-digit mobile format.</p>
                  )}
                </div>

                {/* Company Name (Optional) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Company / Organization Name <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    id="quote-company-input"
                    type="text"
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                    placeholder="Your company name"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Service & Project Scope */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">2</div>
                <h3 className="text-base font-bold text-slate-900">Service Selection & Scope</h3>
              </div>

              {/* Service Selection Radios / Cards */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Required Service <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {services.map(s => {
                    const isSelected = selectedServiceSlug === s.slug;
                    return (
                      <button
                        type="button"
                        key={s.id}
                        onClick={() => setSelectedServiceSlug(s.slug)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          isSelected 
                            ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20 text-blue-900 font-bold' 
                            : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                        }`}
                      >
                        <div className="text-xs font-bold truncate">{s.title}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{s.estimated_timeline}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Project Title (Optional) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Project Title / Working Name <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  id="quote-title-input"
                  type="text"
                  value={projectTitle}
                  onChange={e => setProjectTitle(e.target.value)}
                  placeholder="e.g. Healthcare Patient Portal & Booking Engine"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>

              {/* Project Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Project Description & Requirements <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="quote-desc-input"
                  rows={4}
                  value={description}
                  onChange={e => {
                    setDescription(e.target.value);
                    if (errors.description) setErrors({ ...errors, description: '' });
                  }}
                  placeholder="Tell us what you want to achieve, key pages needed, target audience, specific features, integrations, etc."
                  className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                    errors.description ? 'border-red-400 bg-red-50/20' : 'border-slate-200 bg-slate-50/50 focus:bg-white'
                  }`}
                />
                {errors.description && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.description}
                  </p>
                )}
              </div>

              {/* Required Features Tags */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Required Features & Specifications
                </label>
                <div className="flex flex-wrap gap-2">
                  {FEATURE_OPTIONS.map(feat => {
                    const checked = selectedFeatures.includes(feat);
                    return (
                      <button
                        type="button"
                        key={feat}
                        onClick={() => toggleFeature(feat)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                          checked
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {checked ? '✓ ' : '+ '}
                        {feat}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Step 3: Budget & Timeline */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">3</div>
                <h3 className="text-base font-bold text-slate-900">Budget, Timeline & References</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Budget Range */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Estimated Budget Range
                  </label>
                  <select
                    id="quote-budget-select"
                    value={budgetRange}
                    onChange={e => setBudgetRange(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                  >
                    {BUDGET_RANGES.map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                {/* Preferred Deadline */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Preferred Delivery Timeline
                  </label>
                  <select
                    id="quote-deadline-select"
                    value={preferredDeadline}
                    onChange={e => setPreferredDeadline(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                  >
                    {DEADLINES.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Reference Website */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Reference Website / Competitor Link <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  id="quote-ref-input"
                  type="url"
                  value={referenceWebsite}
                  onChange={e => setReferenceWebsite(e.target.value)}
                  placeholder="https://inspiration-site.com"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>

              {/* File Upload Dropzone */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Attach Wireframes, Logos, or Briefs <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <label className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer bg-slate-50/50 hover:bg-blue-50/20 transition-all">
                  <UploadCloud className="w-6 h-6 text-slate-400" />
                  <span className="text-xs font-medium text-slate-600 text-center">
                    Click to browse files (PDF, PNG, JPG, DOCX, ZIP)
                  </span>
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>

                {/* Uploaded File List */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-2 space-y-1.5">
                    {uploadedFiles.map((file, idx) => (
                      <div key={idx} className="p-2 rounded-lg bg-slate-100 flex items-center justify-between text-xs text-slate-700 font-medium">
                        <div className="flex items-center gap-2 truncate">
                          <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span className="truncate">{file.name}</span>
                        </div>
                        <span className="text-slate-400 text-[10px] shrink-0">{file.size}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Submission Button */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <button
                id="submit-project-request-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 text-white font-extrabold text-base shadow-md hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Registering Your Request...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Submit Project Request</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-slate-500 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Zero spam guarantee. 100% confidential proposal & quotation.</span>
              </div>
            </div>
          </form>
        )}

      </div>
    </section>
  );
};
