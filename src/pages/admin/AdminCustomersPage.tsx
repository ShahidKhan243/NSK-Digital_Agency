import React, { useState, useEffect } from 'react';
import { Users, Search, DollarSign, Layers } from 'lucide-react';
import { store } from '../../lib/store';
import { Project, Quotation } from '../../types';

export const AdminCustomersPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(store.getProjects());
  const [quotations, setQuotations] = useState<Quotation[]>(store.getQuotations());
  const [search, setSearch] = useState('');

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setProjects(store.getProjects());
      setQuotations(store.getQuotations());
    });
    return () => unsubscribe();
  }, []);

  const clientsMap: Record<string, {
    name: string;
    email: string;
    phone: string;
    company: string;
    projectCount: number;
    activeCount: number;
    totalSpent: number;
  }> = {};

  projects.forEach(p => {
    const key = p.client_email.toLowerCase();
    if (!clientsMap[key]) {
      clientsMap[key] = {
        name: p.client_name,
        email: p.client_email,
        phone: p.client_phone,
        company: p.company_name || 'Individual',
        projectCount: 0,
        activeCount: 0,
        totalSpent: 0
      };
    }
    clientsMap[key].projectCount += 1;
    if (['Confirmed', 'In Progress', 'Design Stage', 'Development Stage', 'Testing', 'Client Review'].includes(p.status)) {
      clientsMap[key].activeCount += 1;
    }
    const q = quotations.find(item => item.project_id === p.id && item.status === 'accepted');
    if (q) {
      clientsMap[key].totalSpent += q.total_amount;
    }
  });

  const clientsList = Object.values(clientsMap).filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header & Search */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-card flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div>
          <h2 className="text-base font-extrabold text-slate-900">Customer CRM Directory</h2>
          <p className="text-xs text-slate-500">Client contact details, project volumes, and lifetime revenue</p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search clients..."
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
                <th className="py-3.5 px-6">Customer Name</th>
                <th className="py-3.5 px-6">Email & Phone</th>
                <th className="py-3.5 px-6">Company / Organization</th>
                <th className="py-3.5 px-6">Total Orders</th>
                <th className="py-3.5 px-6">Active Projects</th>
                <th className="py-3.5 px-6 text-right">Lifetime Spend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {clientsList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No customers found.
                  </td>
                </tr>
              ) : (
                clientsList.map(client => (
                  <tr key={client.email} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900 text-sm">
                      {client.name}
                    </td>
                    <td className="py-4 px-6 text-slate-600">
                      <div>{client.email}</div>
                      <div className="text-[11px] text-slate-400">+91 {client.phone}</div>
                    </td>
                    <td className="py-4 px-6 text-slate-700">{client.company}</td>
                    <td className="py-4 px-6 font-bold text-slate-900">{client.projectCount}</td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-bold text-[10px]">
                        {client.activeCount} Active
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right font-mono font-bold text-emerald-600 text-sm">
                      ₹{client.totalSpent.toLocaleString('en-IN')}
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
