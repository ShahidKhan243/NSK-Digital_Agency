import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Send, 
  Paperclip, 
  ExternalLink,
  MessageSquare,
  FileText,
  TrendingUp,
  User,
  Calendar,
  Save,
  Check
} from 'lucide-react';
import { store } from '../../lib/store';
import { Project, ProjectStatus, Message, ProjectFile } from '../../types';

export const EmployeeDashboardPage: React.FC = () => {
  const currentUser = store.getCurrentUser();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  
  // Work action state
  const [statusDraft, setStatusDraft] = useState<ProjectStatus>('In Progress');
  const [devNotesDraft, setDevNotesDraft] = useState<string>('');
  const [deliverableUrl, setDeliverableUrl] = useState<string>('');
  const [deliverableName, setDeliverableName] = useState<string>('');
  const [chatMessage, setChatMessage] = useState<string>('');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const refreshData = () => {
    const all = store.getProjects();
    if (currentUser?.role === 'admin') {
      setProjects(all);
    } else if (currentUser) {
      const assigned = all.filter(p => p.assigned_employee_id === currentUser.id || p.assigned_to?.includes(currentUser.full_name));
      setProjects(assigned);
    }
  };

  useEffect(() => {
    refreshData();
    const unsub = store.subscribe(refreshData);
    return () => unsub();
  }, [currentUser]);

  const activeProject = projects.find(p => p.id === selectedProjectId) || projects[0] || null;

  useEffect(() => {
    if (activeProject) {
      setSelectedProjectId(activeProject.id);
      setStatusDraft(activeProject.status);
      setDevNotesDraft(activeProject.internal_notes || '');
    }
  }, [activeProject?.id]);

  const handleUpdateStatus = () => {
    if (!activeProject || !currentUser) return;
    store.updateProjectStatus(activeProject.id, statusDraft, devNotesDraft, currentUser.full_name);
    if (devNotesDraft !== activeProject.internal_notes) {
      store.updateProjectDetails(activeProject.id, { internal_notes: devNotesDraft });
    }
    setActionSuccess('Project status & engineering notes successfully synchronized.');
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const handleAddDeliverable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProject || !deliverableUrl.trim() || !currentUser) return;

    store.addProjectFile(activeProject.id, {
      file_name: deliverableName.trim() || 'Project Deliverable',
      file_url: deliverableUrl.trim(),
      file_size: 1024,
      file_type: 'deliverable_link',
      category: 'deliverable',
      uploader_name: `${currentUser.full_name} (Staff)`,
      uploader_id: currentUser.id
    });

    setDeliverableUrl('');
    setDeliverableName('');
    setActionSuccess('Deliverable successfully posted for client review.');
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProject || !chatMessage.trim() || !currentUser) return;

    store.sendMessage(
      activeProject.id,
      chatMessage.trim(),
      currentUser.role === 'admin' ? 'admin' : 'employee',
      `${currentUser.full_name} (Engineering)`,
      currentUser.id
    );

    setChatMessage('');
  };

  const messages: Message[] = activeProject ? store.getMessages(activeProject.id) : [];
  const files: ProjectFile[] = activeProject ? store.getProjectFiles(activeProject.id) : [];

  return (
    <div className="space-y-8">
      {/* Workspace Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-blue-600">Engineering Workspace</div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Welcome back, {currentUser?.full_name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {currentUser?.role === 'admin' 
              ? 'Administrator View: Inspect and coordinate all client engineering tasks across the agency.'
              : `Assigned Projects: ${projects.length} active workstreams assigned to your profile.`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-blue-50 border border-blue-100 text-blue-800 text-xs font-bold">
            {projects.filter(p => p.status === 'In Progress').length} In Progress
          </div>
          <div className="px-4 py-2 rounded-2xl bg-purple-50 border border-purple-100 text-purple-800 text-xs font-bold">
            {projects.filter(p => p.status === 'Client Review' || p.status === 'Testing').length} In Review
          </div>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Briefcase className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No Assigned Projects Yet</h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            When an administrator assigns incoming customer orders or design projects to your profile, they will appear right here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Projects List */}
          <div className="lg:col-span-4 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">
              Assigned Queue ({projects.length})
            </h2>

            <div className="space-y-3 max-h-[720px] overflow-y-auto pr-1">
              {projects.map((proj) => {
                const isSelected = proj.id === selectedProjectId;
                return (
                  <div
                    key={proj.id}
                    onClick={() => setSelectedProjectId(proj.id)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer text-left ${
                      isSelected
                        ? 'bg-blue-50/70 border-blue-300 shadow-sm ring-1 ring-blue-400'
                        : 'bg-white border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="font-mono text-[11px] font-bold text-blue-700 bg-blue-100/60 px-2 py-0.5 rounded">
                        {proj.request_code}
                      </span>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full capitalize ${
                        proj.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                        proj.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                        proj.status === 'Client Review' ? 'bg-purple-100 text-purple-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {proj.status}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 leading-snug truncate">
                      {proj.project_title}
                    </h3>
                    
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-2 font-medium">
                      <span>{proj.client_name}</span>
                      <span>•</span>
                      <span>{proj.service_title}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Active Project Details & Engineering Actions */}
          {activeProject && (
            <div className="lg:col-span-8 space-y-6">
              
              {/* Project Overview Card */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-card space-y-6">
                
                {actionSuccess && (
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-150">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>{actionSuccess}</span>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-extrabold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-md">
                        {activeProject.request_code}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        Created: {new Date(activeProject.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                      {activeProject.project_title}
                    </h2>
                  </div>

                  {/* Status update controller */}
                  <div className="flex items-center gap-2">
                    <select
                      value={statusDraft}
                      onChange={e => setStatusDraft(e.target.value as ProjectStatus)}
                      className="px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Request Received">Request Received</option>
                      <option value="Under Review">Under Review</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Design Stage">Design Stage</option>
                      <option value="Development Stage">Development Stage</option>
                      <option value="Testing">Testing</option>
                      <option value="Client Review">Client Review</option>
                      <option value="Completed">Completed</option>
                    </select>

                    <button
                      onClick={handleUpdateStatus}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Status</span>
                    </button>
                  </div>
                </div>

                {/* Client & Requirements Matrix */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Client Details</span>
                    <div className="font-bold text-slate-900 mt-0.5">{activeProject.client_name}</div>
                    <div className="text-slate-500 truncate">{activeProject.client_email}</div>
                    <div className="text-slate-500">{activeProject.client_phone}</div>
                  </div>

                  <div>
                    <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Budget & Scope</span>
                    <div className="font-bold text-slate-900 mt-0.5">{activeProject.budget_range}</div>
                    <div className="text-slate-500">{activeProject.preferred_deadline}</div>
                    <div className="text-blue-600 font-semibold">{activeProject.service_title}</div>
                  </div>

                  <div>
                    <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Progress Status</span>
                    <div className="font-bold text-slate-900 mt-0.5">{activeProject.status}</div>
                    <div className="text-slate-500">{activeProject.progress_percentage}% completed</div>
                  </div>
                </div>

                {/* Project Description Brief */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Client Requirements & Scope Brief
                  </h3>
                  <div className="p-4 rounded-2xl bg-slate-50/60 border border-slate-200 text-xs text-slate-800 leading-relaxed whitespace-pre-wrap">
                    {activeProject.description}
                  </div>
                </div>

                {/* Internal Developer Remarks */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Internal Engineer Notes & Work Log
                  </h3>
                  <textarea
                    rows={3}
                    value={devNotesDraft}
                    onChange={e => setDevNotesDraft(e.target.value)}
                    placeholder="Add internal notes, Git branch references, Figma links, or deployment reminders..."
                    className="w-full p-3 rounded-2xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={handleUpdateStatus}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs cursor-pointer"
                    >
                      Save Notes
                    </button>
                  </div>
                </div>

              </div>

              {/* Deliverables & Deliverable Submission */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-card space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span>Project Deliverables & Artifacts</span>
                  </h3>
                </div>

                {/* Submit New Deliverable */}
                <form onSubmit={handleAddDeliverable} className="p-4 rounded-2xl bg-blue-50/40 border border-blue-100 space-y-3">
                  <span className="text-xs font-bold text-blue-900 block">
                    Upload or Link Project Deliverable (Figma, GitHub, Preview Link, Staging URL)
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={deliverableName}
                      onChange={e => setDeliverableName(e.target.value)}
                      placeholder="Title (e.g. Figma Design v1.0 or Staging URL)"
                      className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="url"
                      value={deliverableUrl}
                      onChange={e => setDeliverableUrl(e.target.value)}
                      placeholder="https://preview.domain.com or file link"
                      className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 cursor-pointer"
                    >
                      <Paperclip className="w-3.5 h-3.5" />
                      <span>Post Deliverable</span>
                    </button>
                  </div>
                </form>

                {/* Uploaded Files List */}
                <div className="space-y-2">
                  {files.length === 0 ? (
                    <p className="text-xs text-slate-400 py-3 text-center">No deliverables uploaded yet.</p>
                  ) : (
                    files.map(f => (
                      <div key={f.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <Paperclip className="w-4 h-4 text-blue-600" />
                          <span className="font-bold text-slate-800">{f.file_name}</span>
                          <span className="text-[10px] text-slate-400">({f.uploader_name})</span>
                        </div>
                        <a
                          href={f.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 font-bold hover:underline flex items-center gap-1"
                        >
                          <span>Open</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Messaging & Communication Thread */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-card space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-emerald-600" />
                    <span>Project Discussion Thread</span>
                  </h3>
                  <span className="text-[11px] text-slate-400 font-semibold">{messages.length} messages</span>
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 border border-slate-100 rounded-2xl p-3 bg-slate-50/50 space-y-3">
                  {messages.length === 0 ? (
                    <p className="text-xs text-slate-400 py-6 text-center">No discussion messages logged yet.</p>
                  ) : (
                    messages.map(m => (
                      <div key={m.id} className="pt-3 first:pt-0 space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-800">{m.sender_name}</span>
                          <span className="text-[10px] text-slate-400">{new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed bg-white p-2.5 rounded-xl border border-slate-200/70">
                          {m.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={e => setChatMessage(e.target.value)}
                    placeholder="Type an engineering update or response to client..."
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send</span>
                  </button>
                </form>
              </div>

            </div>
          )}

        </div>
      )}
    </div>
  );
};
