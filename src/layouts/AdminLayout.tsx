import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  BarChart3, 
  Layers, 
  Users, 
  DollarSign, 
  Briefcase, 
  Settings, 
  LogOut,
  CreditCard,
  MessageSquare,
  Sparkles,
  UserCheck
} from 'lucide-react';
import { store } from '../lib/store';
import { UserProfile } from '../types';

export const AdminLayout: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(store.getCurrentUser());
  const navigate = useNavigate();

  useEffect(() => {
    const user = store.getCurrentUser();
    setCurrentUser(user);

    const unsubscribe = store.subscribe(() => {
      const u = store.getCurrentUser();
      setCurrentUser(u);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    store.logout();
    store.setAdminGatewayUnlocked(false);
    navigate('/');
  };

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
      isActive 
        ? 'bg-blue-600 text-white shadow-sm' 
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`;

  return (
    <div className="pt-28 pb-24 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Admin Bar Header */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="p-1.5 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-sm shrink-0">
              <img src="/logo.png" alt="NSK" className="h-8 w-auto object-contain" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  Admin Control Suite
                </span>
                <span className="text-xs text-slate-400">• NSK Headquarters</span>
              </div>
              <h1 className="text-xl font-black text-slate-900">
                Agency Operations Management
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block text-xs">
              <div className="font-bold text-slate-900">{currentUser?.full_name || 'Admin'}</div>
              <div className="text-slate-400">{currentUser?.email || 'admin@nsk.agency'}</div>
            </div>
            <button
              onClick={handleLogout}
              className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-red-50 hover:text-red-600 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Admin Navigation Sub-Routes */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-2 shadow-subtle flex flex-wrap gap-1.5">
          <NavLink to="/admin" end className={navClass}>
            <BarChart3 className="w-4 h-4" />
            <span>Overview</span>
          </NavLink>
          <NavLink to="/admin/orders" className={navClass}>
            <Layers className="w-4 h-4" />
            <span>Orders & Requests</span>
          </NavLink>
          <NavLink to="/admin/employees" className={navClass}>
            <UserCheck className="w-4 h-4" />
            <span>Employees</span>
          </NavLink>
          <NavLink to="/admin/customers" className={navClass}>
            <Users className="w-4 h-4" />
            <span>Customer CRM</span>
          </NavLink>
          <NavLink to="/admin/quotations" className={navClass}>
            <DollarSign className="w-4 h-4" />
            <span>Quotations</span>
          </NavLink>
          <NavLink to="/admin/payments" className={navClass}>
            <CreditCard className="w-4 h-4" />
            <span>Payments & Invoices</span>
          </NavLink>
          <NavLink to="/admin/messages" className={navClass}>
            <MessageSquare className="w-4 h-4" />
            <span>Project Chat</span>
          </NavLink>
          <NavLink to="/admin/services" className={navClass}>
            <Sparkles className="w-4 h-4" />
            <span>Services & Pricing</span>
          </NavLink>
          <NavLink to="/admin/settings" className={navClass}>
            <Settings className="w-4 h-4" />
            <span>Agency Settings</span>
          </NavLink>
        </div>

        {/* Routed Sub-Pages */}
        <Outlet />

      </div>
    </div>
  );
};
