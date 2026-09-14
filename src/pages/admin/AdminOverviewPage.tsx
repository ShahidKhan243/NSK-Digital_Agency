import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  BarChart3, 
  Layers, 
  Users, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  Mail, 
  ArrowRight,
  ChevronRight,
  Check
} from 'lucide-react';
import { store } from '../../lib/store';
import { Project, ContactEnquiry } from '../../types';

export const AdminOverviewPage: React.FC = () => {
  const [analytics, setAnalytics] = useState(store.getAdminAnalytics());
  const [projects, setProjects] = useState<Project[]>(store.getProjects());
  const [inquiries, setInquiries] = useState<ContactEnquiry[]>(store.getContactEnquiries());

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setAnalytics(store.getAdminAnalytics());
      setProjects(store.getProjects());
      setInquiries(store.getContactEnquiries());
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* 6 Core KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-card space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Customers</div>
          <div className="text-2xl font-black text-slate-900">{analytics.totalCustomers}</div>
          <div className="text-[11px] text-blue-600 font-semibold">Registered Accounts</div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-card space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">New Requests</div>
          <div className="text-2xl font-black text-amber-600">{analytics.newRequests}</div>
          <div className="text-[11px] text-amber-600 font-semibold">Awaiting Quotation</div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-card space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Active Projects</div>
          <div className="text-2xl font-black text-blue-600">{analytics.activeProjects}</div>
          <div className="text-[11px] text-blue-600 font-semibold">In Development</div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-card space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Completed</div>
          <div className="text-2xl font-black text-emerald-600">{analytics.completedProjects}</div>
          <div className="text-[11px] text-emerald-600 font-semibold">100% Delivered</div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-card space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Confirmed Revenue</div>
          <div className="text-2xl font-black text-slate-900">₹{analytics.totalRevenue.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-emerald-600 font-semibold">Accepted Quotes</div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-card space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pending Quotes</div>
          <div className="text-2xl font-black text-purple-600">₹{analytics.pendingAmount.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-purple-600 font-semibold">{analytics.pendingQuotesCount} Active Offers</div>
        </div>
      </div>

      {/* Analytics Charts & Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Popular Services Volume */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-card space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Service Request Volume</h3>
              <p className="text-xs text-slate-500">Distribution of client requests across agency catalog</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>

          <div className="space-y-4 pt-2">
            {Object.entries(analytics.serviceDistribution).map(([srvName, count]) => {
              const percentage = Math.round((count / Math.max(1, projects.length)) * 100);
              return (
                <div key={srvName} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>{srvName}</span>
                    <span className="font-mono text-blue-600">{count} requests ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status Distribution */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-card space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Pipeline Distribution</h3>
              <p className="text-xs text-slate-500">Breakdown of orders in active workflow stages</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            {Object.entries(analytics.statusDistribution).map(([status, count]) => (
              <div key={status} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase truncate max-w-[110px]">{status}</div>
                  <div className="text-lg font-black text-slate-900">{count}</div>
                </div>
                <span className="text-xs font-mono text-slate-400">
                  {Math.round((count / Math.max(1, projects.length)) * 100)}%
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Recent Inquiries Inbox */}
      <div className="rounded-3xl bg-white border border-slate-200/90 shadow-card p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Incoming Contact Inquiries & Leads</h3>
            <p className="text-xs text-slate-500">Messages submitted via public contact form</p>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {inquiries.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">No contact inquiries received yet.</div>
          ) : (
            inquiries.map(enq => (
              <div key={enq.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${enq.status === 'new' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-600'}`}>
                      {enq.status}
                    </span>
                    <span className="font-bold text-xs text-slate-900">{enq.name} ({enq.email})</span>
                    <span className="text-xs text-slate-400">• +91 {enq.phone}</span>
                  </div>
                  <div className="text-xs font-semibold text-slate-800">{enq.subject}</div>
                  <div className="text-xs text-slate-500 italic">"{enq.message}"</div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {enq.status === 'new' && (
                    <button
                      onClick={() => store.updateContactStatus(enq.id, 'resolved')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold hover:bg-emerald-100 transition-colors flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Mark Resolved</span>
                    </button>
                  )}
                  <button
                    onClick={() => store.deleteContactEnquiry(enq.id)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-bold hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};
