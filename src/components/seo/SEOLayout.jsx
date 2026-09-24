import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Globe,
  LayoutDashboard,
  Tag,
  Package,
  LogOut,
  Sparkles,
  Menu,
  X,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

const SEOLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const raw = localStorage.getItem('seoUserInfo') || localStorage.getItem('userInfo');
    if (raw) {
      try {
        setUserInfo(JSON.parse(raw));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('seoUserInfo');
    navigate('/seo/login');
  };

  const navItems = [
    { id: 'dashboard', label: 'SEO Dashboard', icon: LayoutDashboard, path: '/seo/dashboard' },
    { id: 'products', label: 'Product SEO Editor', icon: Tag, path: '/seo/products' },
    { id: 'categories', label: 'Category SEO Editor', icon: Package, path: '/seo/categories' },
  ];

  return (
    <div className="flex h-screen bg-[#F8F9FA] font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Light Clean Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white text-slate-800 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 border-r border-slate-200 shadow-sm ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col justify-between">
          <div>
            {/* Logo Section */}
            <div className="p-6 border-b border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-700 rounded-xl flex items-center justify-center text-white font-bold shadow-md shadow-emerald-700/20">
                <Globe size={22} />
              </div>
              <div>
                <span className="text-lg font-serif font-extrabold text-slate-900 leading-none block">
                  Vaidh SEO Suite
                </span>
                <span className="text-[10px] text-emerald-700 font-extrabold uppercase tracking-widest mt-1 block">
                  Executive Portal
                </span>
              </div>
            </div>

            {/* Nav Menu */}
            <nav className="p-4 space-y-2 mt-2">
              <div className="px-3 mb-2">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.2em]">
                  SEO Navigation
                </span>
              </div>

              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    className={`group flex items-center justify-between px-4 py-3.5 rounded-2xl font-extrabold text-sm transition-all duration-200 ${
                      isActive
                        ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
                        : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={18} />
                      <span>{item.label}</span>
                    </div>
                    {isActive && (
                      <ChevronRight size={16} className="text-white font-bold" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* User Profile & Logout */}
          <div className="p-6 border-t border-slate-100 space-y-4">
            <div className="bg-emerald-50/70 rounded-2xl p-4 border border-emerald-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                {userInfo?.name?.charAt(0) || 'S'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-extrabold text-slate-900 truncate">
                  {userInfo?.name || 'SEO Executive'}
                </p>
                <p className="text-[10px] text-emerald-800 font-semibold truncate">
                  {userInfo?.email || 'seo@thekaransinghvaidh.com'}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs rounded-xl border border-red-200 transition-colors"
            >
              <LogOut size={16} />
              <span>Sign Out SEO Portal</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-[60] w-14 h-14 bg-emerald-700 text-white rounded-full shadow-2xl flex items-center justify-center border-4 border-white active:scale-90 transition-transform"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white/90 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider">
              <Sparkles size={14} className="text-amber-500" /> SEO Executive Dashboard
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
            >
              <ExternalLink size={14} />
              <span>Visit Website</span>
            </a>
          </div>
        </header>

        {/* Main Content Body */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default SEOLayout;
