import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  ChevronRight, 
  User, 
  LayoutDashboard, 
  ShieldCheck, 
  LogOut, 
  Bell, 
  Briefcase
} from 'lucide-react';
import { store } from '../../lib/store';
import { UserProfile, AppNotification } from '../../types';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(store.getCurrentUser());
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    const unsubscribe = store.subscribe(() => {
      const user = store.getCurrentUser();
      setCurrentUser(user);
      if (user) {
        setNotifications(store.getNotifications(user.id));
      }
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      unsubscribe();
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    setNotifDropdownOpen(false);
  }, [location.pathname]);

  const unreadNotifs = notifications.filter(n => !n.is_read).length;

  const handleLogout = () => {
    store.logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-semibold transition-colors ${
      isActive ? 'text-blue-600' : 'text-slate-700 hover:text-blue-600'
    }`;

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass-nav shadow-subtle py-3.5' : 'bg-white/95 backdrop-blur-md py-4 border-b border-slate-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link 
            to="/" 
            className="flex items-center justify-start group select-none shrink-0"
          >
            <img
              src="/logo.png"
              alt="NSK — Websites That Build Your Business"
              className="h-9 sm:h-10 md:h-11 w-auto object-contain object-left block transition-transform duration-200 group-hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <NavLink to="/" className={navLinkClass} end>
              Home
            </NavLink>
            <NavLink to="/services" className={navLinkClass}>
              Services
            </NavLink>
            <NavLink to="/how-it-works" className={navLinkClass}>
              How It Works
            </NavLink>
            <NavLink to="/about" className={navLinkClass}>
              About
            </NavLink>
            <NavLink to="/contact" className={navLinkClass}>
              Contact
            </NavLink>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {/* Get a Quote CTA */}
            <Link
              id="nav-get-quote-btn"
              to="/start-project"
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-1.5 active:scale-95 cursor-pointer"
            >
              <span>Start Your Project</span>
              <ChevronRight className="w-4 h-4" />
            </Link>

            {/* Auth / Account Controls */}
            {currentUser ? (
              <div className="relative flex items-center gap-2">
                {/* Notifications Bell */}
                <div className="relative">
                  <button
                    onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                    className="p-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors relative"
                    title="Notifications"
                  >
                    <Bell className="w-4 h-4" />
                    {unreadNotifs > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                        {unreadNotifs}
                      </span>
                    )}
                  </button>

                  {/* Notification Dropdown */}
                  {notifDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 py-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Notifications</span>
                        {unreadNotifs > 0 && (
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
                          <div className="py-6 text-center text-xs text-slate-400">No new notifications</div>
                        ) : (
                          notifications.map(n => (
                            <div 
                              key={n.id} 
                              onClick={() => {
                                store.markNotificationRead(n.id);
                                setNotifDropdownOpen(false);
                                if (currentUser.role === 'admin') navigate('/admin');
                                else if (currentUser.role === 'employee') navigate('/employee');
                                else navigate('/dashboard');
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

                {/* User Menu Trigger */}
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition-all text-left"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                      {currentUser.full_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-800 max-w-[100px] truncate leading-tight">
                        {currentUser.full_name}
                      </span>
                      <span className="text-[10px] font-medium text-slate-500 capitalize">
                        {currentUser.role}
                      </span>
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs font-semibold text-slate-900">{currentUser.full_name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                      </div>

                      <div className="py-1">
                        {currentUser.role === 'customer' && (
                          <Link
                            to="/dashboard"
                            onClick={() => setUserDropdownOpen(false)}
                            className="w-full px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-2.5 transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4 text-slate-400" />
                            <span>Client Dashboard</span>
                          </Link>
                        )}

                        {currentUser.role === 'employee' && (
                          <Link
                            to="/employee"
                            onClick={() => setUserDropdownOpen(false)}
                            className="w-full px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-2.5 transition-colors"
                          >
                            <Briefcase className="w-4 h-4 text-blue-500" />
                            <span>Employee Portal</span>
                          </Link>
                        )}

                        {currentUser.role === 'admin' && (
                          <>
                            <Link
                              to="/admin"
                              onClick={() => setUserDropdownOpen(false)}
                              className="w-full px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-2.5 transition-colors"
                            >
                              <ShieldCheck className="w-4 h-4 text-emerald-500" />
                              <span>Admin Management</span>
                            </Link>
                            <Link
                              to="/employee"
                              onClick={() => setUserDropdownOpen(false)}
                              className="w-full px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-2.5 transition-colors"
                            >
                              <Briefcase className="w-4 h-4 text-blue-500" />
                              <span>Employee Workspace</span>
                            </Link>
                          </>
                        )}
                      </div>

                      <div className="border-t border-slate-100 pt-1 mt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2.5 transition-colors text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Link
                id="nav-login-btn"
                to="/login"
                className="px-4 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm transition-all duration-200 flex items-center gap-1.5"
              >
                <User className="w-4 h-4 text-slate-500" />
                <span>Client Login</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[65px] bg-white border-b border-slate-200 shadow-xl px-5 py-6 space-y-4 animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col space-y-3">
            <NavLink to="/" className={navLinkClass} end>Home</NavLink>
            <NavLink to="/services" className={navLinkClass}>Services</NavLink>
            <NavLink to="/how-it-works" className={navLinkClass}>How It Works</NavLink>
            <NavLink to="/about" className={navLinkClass}>About</NavLink>
            <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>
          </div>

          <div className="pt-2 space-y-2.5 border-t border-slate-100">
            <Link
              to="/start-project"
              className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2"
            >
              <span>Start Your Project</span>
              <ChevronRight className="w-4 h-4" />
            </Link>

            {currentUser ? (
              <div className="space-y-2 pt-1">
                {currentUser.role === 'customer' && (
                  <Link
                    to="/dashboard"
                    className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-800 font-semibold text-sm flex items-center justify-center gap-2"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Client Dashboard</span>
                  </Link>
                )}
                {currentUser.role === 'employee' && (
                  <Link
                    to="/employee"
                    className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-800 font-semibold text-sm flex items-center justify-center gap-2"
                  >
                    <Briefcase className="w-4 h-4 text-blue-600" />
                    <span>Employee Portal</span>
                  </Link>
                )}
                {currentUser.role === 'admin' && (
                  <>
                    <Link
                      to="/admin"
                      className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm flex items-center justify-center gap-2"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Admin Panel</span>
                    </Link>
                    <Link
                      to="/employee"
                      className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm flex items-center justify-center gap-2"
                    >
                      <Briefcase className="w-4 h-4 text-blue-600" />
                      <span>Employee Workspace</span>
                    </Link>
                  </>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full py-2 text-red-600 font-semibold text-xs flex items-center justify-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out ({currentUser.full_name})</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-800 font-semibold text-sm flex items-center justify-center gap-2"
              >
                <User className="w-4 h-4" />
                <span>Client Login</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
