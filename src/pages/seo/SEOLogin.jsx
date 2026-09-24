import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import { Globe, Eye, EyeOff, Sparkles } from 'lucide-react';

const SEOLogin = () => {
  const [email, setEmail] = useState('seo@thekaransinghvaidh.com');
  const [password, setPassword] = useState('Seo@12345');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = localStorage.getItem('seoUserInfo') || localStorage.getItem('userInfo');
    if (userInfo) {
      try {
        const user = JSON.parse(userInfo);
        if (user && (user.isSEO || user.isAdmin)) {
          navigate('/seo/dashboard');
        }
      } catch (e) {}
    }
  }, [navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data } = await api.post('/users/login', { email, password });

      localStorage.setItem('seoUserInfo', JSON.stringify(data));
      localStorage.setItem('userInfo', JSON.stringify(data));

      navigate('/seo/dashboard');
    } catch (err) {
      console.error('SEO Login Error:', err);
      let message = 'An error occurred during SEO login';
      if (err.response && err.response.data && err.response.data.message) {
        message = err.response.data.message;
      } else if (err.message) {
        message = err.message;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7F5] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <div className="w-full max-w-md bg-white p-8 lg:p-10 rounded-3xl border border-slate-200 shadow-xl relative z-10 space-y-6">
        {/* Logo & Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-emerald-700 rounded-2xl mx-auto flex items-center justify-center text-white shadow-md shadow-emerald-700/20">
            <Globe size={34} />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-extrabold uppercase tracking-widest mb-2">
              <Sparkles size={12} className="text-amber-500" /> SEO Executive Portal
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
              SEO Command Center
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Sign in with your SEO Executive credentials to manage metadata & keywords.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold text-center animate-in fade-in duration-200">
            {error}
          </div>
        )}

        <form onSubmit={submitHandler} className="space-y-4">
          <div>
            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
              SEO Executive Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
              placeholder="seo@thekaransinghvaidh.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent pr-11 transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-500 hover:text-slate-800"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm uppercase tracking-wider shadow-lg shadow-emerald-700/20 transition-all active:scale-[0.98] disabled:opacity-50 mt-2"
          >
            {loading ? 'Authenticating...' : 'Sign In To SEO Portal'}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-500 font-medium">
            Standard Admin Login?{' '}
            <a href="/admin/login" className="text-emerald-700 font-bold underline hover:text-emerald-900">
              Go to Admin Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SEOLogin;
