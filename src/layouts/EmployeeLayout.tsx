import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, NavLink } from 'react-router-dom';
import { 
  Briefcase, 
  CheckSquare, 
  LogOut, 
  Bell, 
  ShieldCheck, 
  ExternalLink,
  Layers,
  FileCode2,
  FolderGit2
} from 'lucide-react';
import { store } from '../lib/store';
import { UserProfile, AppNotification } from '../types';

export const EmployeeLayout: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(store.getCurrentUser());
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const user = store.getCurrentUser();
      setCurrentUser(user);
      if (user) {
        setNotifications(store.getNotifications(user.id));
      }
    });

    if (currentUser) {
      setNotifications(store.getNotifications(currentUser.id));
    }

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    store.logout();
    navigate('/employee/login');
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Employee Workspace Header */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Brand & Workspace indicator */}
            <div className="flex items-center gap-4">
              <Link to="/employee" className="flex items-center gap-3">
                <div className="p-1 rounded-xl bg-white shadow-sm">
                  <img src="/logo.png" alt="NSK" className="h-7 w-auto object-contain" />
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-sm tracking-tight text-white flex items-center gap-1.5">
                    Workspace
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      Staff Portal
                    </span>
                  </span>
                </div>
              </Link>
            </div>

            {/* Right User & Tools */}
            <div className="flex items-center gap-3">
              {currentUser?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-semibold hover:bg-emerald-900 transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin Panel</span>
                </Link>
              )}

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors relative"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {notifOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-100 py-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Employee Notifications</span>
                      {unreadCount > 0 && currentUser && (
                        <button 
                          onClick={() => store.markAllNotificationsRead(currentUser.id)}
                          className="text-[11px] font-medium text-blue-600 hover:underline"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-64 overflow-y-auto divide-y divide-slate-50">
                      {notifications.length === 0 ? (
                        <div className="py-6 text-center text-xs text-slate-400">No new workspace notifications</div>
                      ) : (
                        notifications.map(n => (
                          <div 
                            key={n.id} 
                            onClick={() => {
                              store.markNotificationRead(n.id);
                              setNotifOpen(false);
                            }}
                            className={`p-3 text-xs cursor-pointer hover:bg-slate-50 transition-colors ${!n.is_read ? 'bg-blue-50/50 font-medium' : 'text-slate-600'}`}
                          >
                            <div className="font-semibold text-slate-800 mb-0.5">{n.title}</div>
                            <div className="text-slate-500 leading-snug">{n.message}</div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Employee Pill */}
              <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-slate-800">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                  {currentUser?.full_name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-200 leading-tight truncate max-w-[120px]">
                    {currentUser?.full_name}
                  </span>
                  <span className="text-[10px] font-medium text-slate-400 capitalize">
                    {currentUser?.role}
                  </span>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg bg-slate-800 hover:bg-red-950/60 hover:text-red-400 text-slate-400 transition-colors"
                title="Sign out of Employee Portal"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="py-4 border-t border-slate-200 bg-white text-center text-xs text-slate-400">
        NSK Digital Agency Staff & Engineering Workspace • Authorized Personnel Only
      </footer>
    </div>
  );
};
