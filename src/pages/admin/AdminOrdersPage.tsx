import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Layers, 
  Plus, 
  X, 
  ChevronRight, 
  DollarSign, 
  Clock, 
  Check, 
  ExternalLink,
  UserCheck,
  Briefcase
} from 'lucide-react';
import { store } from '../../lib/store';
import { Project, ProjectStatus, Service, Employee } from '../../types';

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
  'Completed',
  'Cancelled'
];

export const AdminOrdersPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(store.getProjects());
  const [services, setServices] = useState<Service[]>(store.getServices());
  const [employees, setEmployees] = useState<Employee[]>(store.getEmployees());
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [serviceFilter, setServiceFilter] = useState('All');

  // Status Change Modal
  const [statusModalProject, setStatusModalProject] = useState<Project | null>(null);
  const [newStatus, setNewStatus] = useState<ProjectStatus>('In Progress');
  const [statusNotes, setStatusNotes] = useState('');
  const [assignedEmployeeId, setAssignedEmployeeId] = useState('');

  // Quotation Creator Modal
  const [quoteModalProject, setQuoteModalProject] = useState<Project | null>(null);
  const [quoteItems, setQuoteItems] = useState<{ name: string; desc: string; amount: number }[]>([
    { name: 'Custom Modern Web Development', desc: 'Responsive pages, API integration, and CMS setup', amount: 35000 },
    { name: 'Technical SEO & Speed Optimization', desc: 'Core Web Vitals 95+ score and Google schema markup', amount: 8000 }
  ]);
  const [quoteDiscount, setQuoteDiscount] = useState<number>(3000);
  const [quoteTaxRate, setQuoteTaxRate] = useState<number>(18);
  const [quotePaymentTerms, setQuotePaymentTerms] = useState('50% advance upon milestone confirmation, 50% upon final signoff.');
  const [quoteValidDays, setQuoteValidDays] = useState(14);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setProjects(store.getProjects());
      setServices(store.getServices());
      setEmployees(store.getEmployees());
    });
    return () => unsubscribe();
  }, []);

  const filtered = projects.filter(p => {
    const matchSearch = p.project_title.toLowerCase().includes(search.toLowerCase()) ||
                        p.request_code.toLowerCase().includes(search.toLowerCase()) ||
                        p.client_name.toLowerCase().includes(search.toLowerCase()) ||
                        p.client_email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || p.status === statusFilter;
    const matchService = serviceFilter === 'All' || p.service_title === serviceFilter;
    return matchSearch && matchStatus && matchService;
  });

  const handleSaveStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusModalProject) return;

    store.updateProjectStatus(statusModalProject.id, newStatus, statusNotes, 'NSK Admin');
    
    if (assignedEmployeeId) {
      store.assignProjectToEmployee(statusModalProject.id, assignedEmployeeId);
    }
    
    setStatusModalProject(null);
    setStatusNotes('');
  };

  const handleCreateQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteModalProject) return;

    const validDate = new Date();
    validDate.setDate(validDate.getDate() + quoteValidDays);

    store.createQuotation(quoteModalProject.id, {
      line_items: quoteItems,
      discount: quoteDiscount,
      taxRate: quoteTaxRate,
      payment_terms: quotePaymentTerms,
      valid_until: validDate.toISOString().split('T')[0]
    });

    setQuoteModalProject(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Search & Filter Controls */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-card flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by ID, title, client..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Statuses</option>
            {ALL_STATUSES.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <select
            value={serviceFilter}
            onChange={e => setServiceFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Services</option>
            {services.map(s => (
              <option key={s.id} value={s.title}>{s.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-3xl bg-white border border-slate-200/90 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px]">
              <tr>
                <th className="py-3.5 px-6">ID / Code</th>
                <th className="py-3.5 px-6">Client & Project</th>
                <th className="py-3.5 px-6">Assigned Staff</th>
                <th className="py-3.5 px-6">Budget & Deadline</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map(p => {
                  const assignedEmp = employees.find(e => e.id === (p as any).assigned_employee_id);
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-6 font-mono font-bold text-blue-600">
                        {p.request_code}
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-900 text-sm">{p.project_title}</div>
                        <div className="text-slate-500 text-[11px]">{p.client_name} • {p.client_email}</div>
                      </td>
                      <td className="py-4 px-6">
                        {assignedEmp ? (
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            <span className="font-bold text-slate-800">{assignedEmp.full_name}</span>
                            <span className="text-[10px] text-slate-400">({assignedEmp.role})</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Unassigned</span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-slate-900 font-bold">{p.budget_range}</div>
                        <div className="text-slate-400 text-[11px]">{p.preferred_deadline}</div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          p.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                          p.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                          p.status === 'Quote Sent' ? 'bg-purple-100 text-purple-800' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        <button
                          onClick={() => {
                            setStatusModalProject(p);
                            setNewStatus(p.status);
                            setAssignedEmployeeId((p as any).assigned_employee_id || '');
                          }}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                        >
                          Status & Staff
                        </button>

                        <button
                          onClick={() => setQuoteModalProject(p)}
                          className="px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold transition-colors cursor-pointer"
                        >
                          Create Quote
                        </button>

                        <button
                          onClick={() => navigate(`/projects/${p.id}`)}
                          className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer"
                        >
                          Open
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* STATUS & EMPLOYEE ASSIGNMENT MODAL */}
      {statusModalProject && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-sm">Update Status & Assign Staff</h3>
              <button onClick={() => setStatusModalProject(null)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>

            <form onSubmit={handleSaveStatus} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Select Status</label>
                <select
                  value={newStatus}
                  onChange={e => setNewStatus(e.target.value as ProjectStatus)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-bold text-slate-800"
                >
                  {ALL_STATUSES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Assign to Employee</label>
                <select
                  value={assignedEmployeeId}
                  onChange={e => setAssignedEmployeeId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold text-slate-800"
                >
                  <option value="">-- Select Staff Member --</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.full_name} ({emp.role}) - {emp.email}
                    </option>
                  ))}
                </select>
                {employees.length === 0 && (
                  <p className="text-[11px] text-amber-600 mt-1">
                    No employees registered yet. Go to Employees tab to add staff.
                  </p>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Status Notes (Visible to Client)</label>
                <textarea
                  rows={3}
                  value={statusNotes}
                  onChange={e => setStatusNotes(e.target.value)}
                  placeholder="e.g. Assigned to engineering lead. UI Wireframes approved."
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setStatusModalProject(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold cursor-pointer"
                >
                  Save & Sync Portal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QUOTATION GENERATOR MODAL */}
      {quoteModalProject && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase text-blue-600">Quotation Builder</span>
                <h3 className="font-extrabold text-slate-900 text-base">
                  Generate Quotation for {quoteModalProject.request_code}
                </h3>
              </div>
              <button onClick={() => setQuoteModalProject(null)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>

            <form onSubmit={handleCreateQuote} className="space-y-4 text-xs">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700 uppercase">Deliverable Line Items</span>
                  <button
                    type="button"
                    onClick={() => setQuoteItems([...quoteItems, { name: '', desc: '', amount: 10000 }])}
                    className="text-blue-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Item
                  </button>
                </div>

                {quoteItems.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={item.name}
                        onChange={e => {
                          const copy = [...quoteItems];
                          copy[idx].name = e.target.value;
                          setQuoteItems(copy);
                        }}
                        placeholder="Item name (e.g. Custom API Engine)"
                        className="flex-1 p-2 rounded-lg border border-slate-200 bg-white"
                      />
                      <input
                        type="number"
                        value={item.amount}
                        onChange={e => {
                          const copy = [...quoteItems];
                          copy[idx].amount = Number(e.target.value);
                          setQuoteItems(copy);
                        }}
                        placeholder="Amount (INR)"
                        className="w-28 p-2 rounded-lg border border-slate-200 bg-white font-mono"
                      />
                    </div>
                    <input
                      type="text"
                      value={item.desc}
                      onChange={e => {
                        const copy = [...quoteItems];
                        copy[idx].desc = e.target.value;
                        setQuoteItems(copy);
                      }}
                      placeholder="Detailed scope notes for this deliverable..."
                      className="w-full p-2 rounded-lg border border-slate-200 bg-white text-[11px]"
                    />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Discount (INR)</label>
                  <input
                    type="number"
                    value={quoteDiscount}
                    onChange={e => setQuoteDiscount(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Tax Rate (GST %)</label>
                  <input
                    type="number"
                    value={quoteTaxRate}
                    onChange={e => setQuoteTaxRate(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Payment Terms</label>
                <input
                  type="text"
                  value={quotePaymentTerms}
                  onChange={e => setQuotePaymentTerms(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setQuoteModalProject(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer"
                >
                  Dispatch Quotation to Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
