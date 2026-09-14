import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Layers, 
  Clock, 
  CheckCircle2, 
  DollarSign, 
  ChevronRight, 
  Search,
  ArrowRight,
  FolderOpen
} from 'lucide-react';
import { Project, UserProfile, Quotation } from '../../types';
import { store } from '../../lib/store';

export const DashboardPage: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(store.getCurrentUser());
  const [projects, setProjects] = useState<Project[]>(store.getUserProjects(currentUser));
  const [quotations, setQuotations] = useState<Quotation[]>(store.getQuotations());
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const user = store.getCurrentUser();
    if (!user) {
      navigate('/login');
      return;
    }
    setCurrentUser(user);
    setProjects(store.getUserProjects(user));

    const unsubscribe = store.subscribe(() => {
      const u = store.getCurrentUser();
      setCurrentUser(u);
      setProjects(store.getUserProjects(u));
      setQuotations(store.getQuotations());
    });
    return () => unsubscribe();
  }, [navigate]);

  const activeProjects = projects.filter(p => 
    ['Confirmed', 'In Progress', 'Design Stage', 'Development Stage', 'Testing', 'Client Review'].includes(p.status)
  ).length;

  const pendingRequests = projects.filter(p => 
    ['Request Received', 'Under Review', 'Quote Sent'].includes(p.status)
  ).length;

  const completedProjects = projects.filter(p => p.status === 'Completed').length;

  const pendingQuotes = quotations.filter(q => {
    const userProj = projects.find(p => p.id === q.project_id);
    return userProj && q.status === 'sent';
  });

  const filteredProjects = projects.filter(p => 
    p.project_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.request_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.service_title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="pt-32 pb-24 bg-gradient-to-b from-slate-50 via-white to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Welcome Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Client Workspace</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">
              Welcome back, {currentUser?.full_name || 'Client'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Track project progression, review milestones, accept formal quotations, and collaborate with your assigned developers.
            </p>
          </div>

          <Link
            to="/start-project"
            className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm shadow-md transition-all shrink-0 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Submit New Request</span>
          </Link>
        </div>

        {/* 4 KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-card flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Projects</div>
              <div className="text-3xl font-black text-slate-900">{activeProjects}</div>
              <div className="text-[11px] text-blue-600 font-semibold">In Active Development</div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Layers className="w-6 h-6" />
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-card flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Pending Requests</div>
              <div className="text-3xl font-black text-slate-900">{pendingRequests}</div>
              <div className="text-[11px] text-amber-600 font-semibold">Under Review</div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-card flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Completed</div>
              <div className="text-3xl font-black text-slate-900">{completedProjects}</div>
              <div className="text-[11px] text-emerald-600 font-semibold">Delivered & Live</div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-card flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Pending Quotes</div>
              <div className="text-3xl font-black text-slate-900">{pendingQuotes.length}</div>
              <div className="text-[11px] text-purple-600 font-semibold">Awaiting Approval</div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Project List */}
        <div className="rounded-3xl bg-white border border-slate-200/90 shadow-card p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Your Projects & Requests</h2>
              <p className="text-xs text-slate-500 mt-0.5">Click any item to view stage timeline, quotation details, and chat.</p>
            </div>

            {projects.length > 0 && (
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search projects..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>

          {filteredProjects.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto text-blue-600 shadow-sm">
                <FolderOpen className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No Projects Yet</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                You haven't submitted any project requests yet. Start your first website or digital project in minutes with our interactive project builder.
              </p>
              <Link
                to="/start-project"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md hover:bg-blue-700 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Start Your First Project</span>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredProjects.map((project) => (
                <div 
                  key={project.id}
                  onClick={() => navigate(`/projects/${project.id}`)}
                  className="py-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-slate-50/70 p-3 rounded-2xl transition-all cursor-pointer group"
                >
                  <div className="space-y-1.5 max-w-xl">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[11px] bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                        {project.request_code}
                      </span>
                      <span className="text-xs font-semibold text-blue-600">{project.service_title}</span>
                      <span className="text-slate-400 text-xs">• {new Date(project.created_at).toLocaleDateString()}</span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {project.project_title}
                    </h4>

                    <p className="text-xs text-slate-500 line-clamp-1">
                      {project.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-6 shrink-0">
                    <div className="w-36 space-y-1 hidden sm:block">
                      <div className="flex justify-between text-[11px] font-semibold text-slate-500">
                        <span>Progress</span>
                        <span className="font-bold text-slate-800">{project.progress_percentage}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-blue-600 h-1.5 rounded-full"
                          style={{ width: `${project.progress_percentage}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        project.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                        project.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                        project.status === 'Quote Sent' ? 'bg-purple-100 text-purple-800 animate-pulse' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {project.status}
                      </span>
                    </div>

                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 group-hover:text-blue-600 transition-all" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
