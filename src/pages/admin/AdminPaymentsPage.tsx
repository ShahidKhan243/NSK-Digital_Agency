import React, { useState, useEffect } from 'react';
import { CreditCard, DollarSign, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { store } from '../../lib/store';
import { Quotation, Project } from '../../types';

export const AdminPaymentsPage: React.FC = () => {
  const [quotations, setQuotations] = useState<Quotation[]>(store.getQuotations());
  const [projects, setProjects] = useState<Project[]>(store.getProjects());

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setQuotations(store.getQuotations());
      setProjects(store.getProjects());
    });
    return () => unsubscribe();
  }, []);

  const totalCollected = quotations
    .filter(q => q.status === 'accepted')
    .reduce((sum, q) => sum + q.total_amount, 0);

  const pendingAmount = quotations
    .filter(q => q.status === 'sent')
    .reduce((sum, q) => sum + q.total_amount, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-card flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Confirmed Receivables</div>
            <div className="text-3xl font-black text-slate-900">₹{totalCollected.toLocaleString('en-IN')}</div>
            <div className="text-[11px] text-emerald-600 font-semibold">From Accepted Client Proposals</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-card flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Pending Invoice Estimates</div>
            <div className="text-3xl font-black text-purple-600">₹{pendingAmount.toLocaleString('en-IN')}</div>
            <div className="text-[11px] text-slate-500 font-semibold">Active Offers in Client Review</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Payment & Invoice Ledger */}
      <div className="rounded-3xl bg-white border border-slate-200/90 shadow-card overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Invoices & Payment Schedules</h3>
            <p className="text-xs text-slate-500">Milestone transactions and invoice records</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px]">
              <tr>
                <th className="py-3.5 px-6">Invoice / Quote</th>
                <th className="py-3.5 px-6">Client / Project</th>
                <th className="py-3.5 px-6">Terms</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Amount (INR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {quotations.map(q => {
                const proj = projects.find(p => p.id === q.project_id);
                return (
                  <tr key={q.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-blue-600">
                      INV-{q.quote_number.replace('QT-', '')}
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900 text-sm">{proj?.project_title || 'Project'}</div>
                      <div className="text-slate-500 text-[11px]">{proj?.client_name} • {proj?.client_email}</div>
                    </td>
                    <td className="py-4 px-6 text-slate-600 max-w-xs truncate">
                      {q.payment_terms}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        q.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' :
                        q.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {q.status === 'accepted' ? 'Milestone Active' : q.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right font-mono font-bold text-slate-900 text-sm">
                      ₹{q.total_amount.toLocaleString('en-IN')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
