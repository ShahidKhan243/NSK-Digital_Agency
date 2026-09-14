import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  Send, 
  UploadCloud, 
  FileText, 
  DollarSign, 
  Check, 
  X, 
  ShieldCheck, 
  Download, 
  MessageSquare, 
  Layers, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { 
  Project, 
  ProjectStatus, 
  ProjectStatusHistoryItem, 
  Quotation, 
  Message, 
  ProjectFile, 
  UserProfile 
} from '../../types';
import { store } from '../../lib/store';

const ALL_STATUSES: ProjectStatus[] = [
  'Request Received',
  'Under Review',
  'Quote Sent',
  'Payment Pending',
  'Confirmed',
  'In Progress',
  'Design Stage',
  'Development Stage',
  'Testing',
  'Client Review',
  'Completed'
];

interface ProjectDetailViewProps {
  projectId: string;
  onBack: () => void;
  currentUser: UserProfile;
}

export const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({ projectId, onBack, currentUser }) => {
  const [project, setProject] = useState<Project | undefined>(store.getProjectById(projectId));
  const [quotation, setQuotation] = useState<Quotation | undefined>(store.getQuotationForProject(projectId));
  const [history, setHistory] = useState<ProjectStatusHistoryItem[]>(store.getStatusHistory(projectId));
  const [messages, setMessages] = useState<Message[]>(store.getMessages(projectId));
  const [files, setFiles] = useState<ProjectFile[]>(store.getProjectFiles(projectId));

  // Chat input
  const [chatText, setChatText] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Quote response state
  const [quoteNotes, setQuoteNotes] = useState('');
  const [isRespondingQuote, setIsRespondingQuote] = useState(false);

  // Active tab
  const [activeTab, setActiveTab] = useState<'overview' | 'quotation' | 'messages' | 'files' | 'history'>('overview');

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setProject(store.getProjectById(projectId));
      setQuotation(store.getQuotationForProject(projectId));
      setHistory(store.getStatusHistory(projectId));
      setMessages(store.getMessages(projectId));
      setFiles(store.getProjectFiles(projectId));
    });
    return () => unsubscribe();
  }, [projectId]);

  useEffect(() => {
    if (activeTab === 'messages') {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeTab]);

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center space-y-4">
        <h3 className="text-xl font-bold text-slate-900">Project Not Found</h3>
        <p className="text-xs text-slate-500">The requested project ID does not exist or has been archived.</p>
        <button onClick={onBack} className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold">
          Return to Dashboard
        </button>
      </div>
    );
  }

  const currentStatusIndex = ALL_STATUSES.indexOf(project.status as ProjectStatus);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatText.trim()) return;

    store.sendMessage(
      project.id,
      chatText.trim(),
      currentUser.role === 'admin' ? 'admin' : 'customer',
      currentUser.full_name,
      currentUser.id
    );
    setChatText('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      store.addProjectFile(project.id, {
        file_name: file.name,
        file_url: 'https://example.com/uploads/' + file.name,
        file_size: file.size,
        file_type: file.type || 'application/octet-stream',
        category: currentUser.role === 'admin' ? 'deliverable' : 'client_upload',
        uploader_name: currentUser.full_name,
        uploader_id: currentUser.id
      });
    }
  };

  const handleQuoteAction = (action: 'accept' | 'reject') => {
    if (!quotation) return;
    setIsRespondingQuote(true);
    setTimeout(() => {
      store.respondToQuotation(quotation.id, action, quoteNotes);
      setIsRespondingQuote(false);
      setQuoteNotes('');
    }, 400);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-xs bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-md">
                {project.request_code}
              </span>
              <span className="text-xs font-semibold text-slate-500">• {project.service_title}</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 mt-1">
              {project.project_title}
            </h1>
          </div>
        </div>

        {/* Current Status Pill */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Current Phase</div>
            <div className="text-sm font-extrabold text-blue-600">{project.status}</div>
          </div>
          <div className="px-4 py-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 font-bold text-xs">
            {project.progress_percentage}% Complete
          </div>
        </div>
      </div>

      {/* 11-Stage Interactive Timeline Bar */}
      <div className="rounded-3xl bg-white border border-slate-200/90 p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Project Stage Progression
          </h3>
          <span className="text-xs font-semibold text-slate-600">
            Status: <strong className="text-blue-600">{project.status}</strong>
          </span>
        </div>

        {/* Linear Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${project.progress_percentage}%` }}
          ></div>
        </div>

        {/* Stage Pills Carousel / Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 pt-2">
          {ALL_STATUSES.slice(0, 6).map((statusName, idx) => {
            const isPassed = currentStatusIndex >= idx;
            const isCurrent = project.status === statusName;
            return (
              <div
                key={statusName}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  isCurrent
                    ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-1 ring-blue-500'
                    : isPassed
                    ? 'border-emerald-200 bg-emerald-50/40 text-emerald-800'
                    : 'border-slate-100 bg-slate-50/50 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-bold mb-1">
                  <span>Phase {idx + 1}</span>
                  {isPassed && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                </div>
                <div className="text-xs font-bold truncate">{statusName}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-200 space-x-6 text-sm font-bold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 border-b-2 transition-all ${activeTab === 'overview' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          Project Scope
        </button>
        <button
          onClick={() => setActiveTab('quotation')}
          className={`pb-3 border-b-2 transition-all flex items-center gap-1.5 ${activeTab === 'quotation' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          <span>Quotation & Cost</span>
          {quotation && quotation.status === 'sent' && (
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('messages')}
          className={`pb-3 border-b-2 transition-all flex items-center gap-1.5 ${activeTab === 'messages' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Project Chat ({messages.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('files')}
          className={`pb-3 border-b-2 transition-all flex items-center gap-1.5 ${activeTab === 'files' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          <FileText className="w-4 h-4" />
          <span>Files & Assets ({files.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`pb-3 border-b-2 transition-all ${activeTab === 'history' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          Audit History
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-card space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">Project Description</h3>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {project.description}
              </p>

              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Selected Technical Features</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {project.required_features.map((f, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-800 flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl bg-white border border-slate-200/90 p-6 shadow-card space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Project Metadata</h3>
              
              <div className="space-y-3 text-xs">
                <div>
                  <div className="text-slate-400 font-medium">Client</div>
                  <div className="font-bold text-slate-900">{project.client_name} ({project.company_name || 'Individual'})</div>
                </div>
                <div>
                  <div className="text-slate-400 font-medium">Contact</div>
                  <div className="font-bold text-slate-900">{project.client_email} • +91 {project.client_phone}</div>
                </div>
                <div>
                  <div className="text-slate-400 font-medium">Budget Range</div>
                  <div className="font-bold text-slate-900">{project.budget_range}</div>
                </div>
                <div>
                  <div className="text-slate-400 font-medium">Target Deadline</div>
                  <div className="font-bold text-slate-900">{project.preferred_deadline}</div>
                </div>
                {project.assigned_to && (
                  <div>
                    <div className="text-slate-400 font-medium">Lead Developer</div>
                    <div className="font-bold text-blue-600">{project.assigned_to}</div>
                  </div>
                )}
                {project.reference_website && (
                  <div>
                    <div className="text-slate-400 font-medium">Reference Link</div>
                    <a href={project.reference_website} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                      <span>{project.reference_website}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: QUOTATION */}
      {activeTab === 'quotation' && (
        <div className="max-w-3xl mx-auto space-y-6">
          {quotation ? (
            <div className="rounded-3xl bg-white border border-slate-200/90 shadow-card overflow-hidden">
              {/* Quote Header */}
              <div className="p-6 sm:p-8 bg-gradient-to-r from-slate-900 to-blue-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">Formal Estimate</span>
                  <h3 className="text-2xl font-black">{quotation.quote_number}</h3>
                  <p className="text-xs text-slate-300 mt-0.5">Valid until: {quotation.valid_until}</p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-300">Quotation Status</div>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase mt-1 ${
                    quotation.status === 'accepted' ? 'bg-emerald-500 text-white' :
                    quotation.status === 'rejected' ? 'bg-red-500 text-white' :
                    'bg-amber-400 text-slate-900'
                  }`}>
                    {quotation.status}
                  </span>
                </div>
              </div>

              {/* Line Items Table */}
              <div className="p-6 sm:p-8 space-y-6">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 uppercase font-bold text-[10px]">
                      <th className="pb-3">Item / Deliverable</th>
                      <th className="pb-3 text-right">Amount (INR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {quotation.line_items.map((item) => (
                      <tr key={item.id} className="py-3">
                        <td className="py-3 pr-4">
                          <div className="font-bold text-slate-900 text-sm">{item.name}</div>
                          {item.desc && <div className="text-slate-500 text-xs mt-0.5">{item.desc}</div>}
                        </td>
                        <td className="py-3 text-right font-mono font-bold text-slate-900 text-sm">
                          ₹{item.amount.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Calculation Totals */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-mono">₹{quotation.subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  {quotation.discount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Agency Discount</span>
                      <span className="font-mono">- ₹{quotation.discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-600">
                    <span>GST (18%)</span>
                    <span className="font-mono">₹{quotation.tax.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                    <span>Total Estimated Amount</span>
                    <span className="font-mono text-blue-600">₹{quotation.total_amount.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Terms */}
                <div className="space-y-1 text-xs text-slate-500">
                  <strong className="text-slate-700">Payment Terms:</strong>
                  <p>{quotation.payment_terms}</p>
                </div>

                {/* Action Buttons for Client */}
                {quotation.status === 'sent' && (
                  <div className="pt-4 border-t border-slate-100 space-y-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => handleQuoteAction('accept')}
                        disabled={isRespondingQuote}
                        className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Check className="w-4 h-4" />
                        <span>Accept Quotation & Initiate Project</span>
                      </button>

                      <button
                        onClick={() => handleQuoteAction('reject')}
                        disabled={isRespondingQuote}
                        className="py-3 px-5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-sm transition-all"
                      >
                        Request Revision / Decline
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-12 rounded-3xl bg-white border border-slate-200/90 text-center space-y-3 shadow-card">
              <Clock className="w-10 h-10 text-amber-500 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900">Quotation in Preparation</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Our project manager is reviewing your technical specifications. A formalized scope and quotation will appear here within 24 hours.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: REAL-TIME MESSAGING */}
      {activeTab === 'messages' && (
        <div className="rounded-3xl bg-white border border-slate-200/90 shadow-card overflow-hidden flex flex-col h-[520px]">
          {/* Messages Header */}
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Project Communication Channel</span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">Direct Engineering Line</span>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/30">
            {messages.length === 0 ? (
              <div className="py-16 text-center text-xs text-slate-400">
                No messages yet. Send a message to start communicating with the team.
              </div>
            ) : (
              messages.map((m) => {
                const isOwn = (currentUser.role === 'admin' && m.sender_role === 'admin') ||
                              (currentUser.role === 'customer' && m.sender_role === 'customer');
                return (
                  <div 
                    key={m.id}
                    className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}
                  >
                    <div className="text-[10px] font-bold text-slate-400 mb-1 px-1">
                      {m.sender_name} • {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div
                      className={`max-w-md p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        isOwn
                          ? 'bg-blue-600 text-white rounded-tr-none shadow-sm'
                          : 'bg-white border border-slate-200/80 text-slate-800 rounded-tl-none shadow-subtle'
                      }`}
                    >
                      {m.message}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={chatBottomRef}></div>
          </div>

          {/* Send Message Box */}
          <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-100 flex items-center gap-2">
            <input
              type="text"
              value={chatText}
              onChange={e => setChatText(e.target.value)}
              placeholder="Type your message regarding this project..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* TAB 4: FILES & DELIVERABLES */}
      {activeTab === 'files' && (
        <div className="space-y-6">
          {/* Upload Area */}
          <div className="rounded-3xl bg-white border border-slate-200/90 p-6 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Upload Project Material</h3>
              <span className="text-xs text-slate-500">Logos, documents, guidelines & proofs</span>
            </div>
            
            <label className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer bg-slate-50/50 hover:bg-blue-50/20 transition-all">
              <UploadCloud className="w-8 h-8 text-blue-600" />
              <span className="text-xs font-bold text-slate-800">Select file to attach to this project</span>
              <span className="text-[11px] text-slate-400">PDF, PNG, JPG, FIG, ZIP up to 50MB</span>
              <input type="file" className="hidden" onChange={handleFileUpload} />
            </label>
          </div>

          {/* Files List */}
          <div className="rounded-3xl bg-white border border-slate-200/90 p-6 shadow-card space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Project Files ({files.length})</h3>
            <div className="divide-y divide-slate-100">
              {files.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">No files attached yet.</div>
              ) : (
                files.map((file) => (
                  <div key={file.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 truncate">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="truncate">
                        <div className="font-bold text-xs sm:text-sm text-slate-900 truncate">{file.file_name}</div>
                        <div className="text-[10px] text-slate-500">
                          Uploaded by {file.uploader_name} • {(file.file_size / (1024 * 1024)).toFixed(2)} MB • {file.category}
                        </div>
                      </div>
                    </div>
                    <a
                      href={file.file_url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1 shrink-0"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Download</span>
                    </a>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: AUDIT HISTORY */}
      {activeTab === 'history' && (
        <div className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-card space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
            Project Activity & Transition Audit Log
          </h3>
          <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
            {history.map((item) => (
              <div key={item.id} className="relative flex items-start gap-4 pl-1">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 z-10 ring-4 ring-white">
                  <Check className="w-3 h-3" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{item.status}</span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(item.created_at).toLocaleString()}
                    </span>
                  </div>
                  {item.notes && <p className="text-xs text-slate-600 mt-0.5">{item.notes}</p>}
                  {item.changed_by_name && (
                    <span className="text-[10px] font-medium text-slate-400">Updated by: {item.changed_by_name}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
