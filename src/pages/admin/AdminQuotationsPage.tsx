import React, { useState, useEffect } from 'react';
import { DollarSign, Search, Check, X, Clock } from 'lucide-react';
import { store } from '../../lib/store';
import { Quotation } from '../../types';

export const AdminQuotationsPage: React.FC = () => {
  const [quotations, setQuotations] = useState<Quotation[]>(store.getQuotations());
  const [search, setSearch] = useState('');

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setQuotations(store.getQuotations());
    });
    return () => unsubscribe();
  }, []);

  const filtered = quotations.filter(q => 
    q.quote_number.toLowerCase().includes(search.toLowerCase()) ||
    q.project_id.toLowerCase().includes(search.toLowerCase()) ||
    q.status.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-card flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div>
          <h2 className="text-base font-extrabold text-slate-900">Quotation Ledger</h2>
          <p className="text-xs text-slate-500">Official estimates, taxes, and customer responses</p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search quotations..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-3xl bg-white border border-slate-200/90 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px]">
              <tr>
                <th className="py-3.5 px-6">Quote Number</th>
                <th className="py-3.5 px-6">Project ID</th>
                <th className="py-3.5 px-6">Subtotal</th>
                <th className="py-3.5 px-6">Tax (18%)</th>
                <th className="py-3.5 px-6">Final Total</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6">Valid Until</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No quotations generated yet.
                  </td>
                </tr>
              ) : (
                filtered.map(q => (
                  <tr key={q.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-blue-600">
                      {q.quote_number}
                    </td>
                    <td className="py-4 px-6 font-mono text-slate-700">
                      {q.project_id}
                    </td>
                    <td className="py-4 px-6 font-mono text-slate-600">
                      ₹{q.subtotal.toLocaleString('en-IN')}
                    </td>
                    <td className="py-4 px-6 font-mono text-slate-600">
                      ₹{q.tax.toLocaleString('en-IN')}
                    </td>
                    <td className="py-4 px-6 font-mono font-bold text-slate-900 text-sm">
                      ₹{q.total_amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        q.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' :
                        q.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {q.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-500">
                      {q.valid_until}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
