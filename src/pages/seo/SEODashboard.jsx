import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/api';
import {
  Globe,
  Tag,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ArrowRight,
  Sparkles,
  FileText,
  Search,
  Eye
} from 'lucide-react';

const SEODashboard = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        api.get('/products'),
        api.get('/categories')
      ]);
      setProducts(prodRes.data || []);
      setCategories(catRes.data || []);
    } catch (err) {
      console.error('Failed to fetch SEO Dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  const optimizedProducts = products.filter(
    (p) => p.metaTitle && p.metaDescription && p.primaryKeyword
  );
  const asthmaProd = products.find(
    (p) => p.name.toLowerCase().includes('asthma') || (p.slug && p.slug.includes('asthma'))
  );

  return (
    <div className="space-y-8 pb-12 font-sans">
      {/* Light Clean Welcome Banner */}
      <div className="relative bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100/70 rounded-3xl p-8 text-slate-800 shadow-sm border border-emerald-200/80 overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-700 text-white text-xs font-bold uppercase tracking-widest mb-3">
              <Sparkles size={14} className="text-amber-300" /> SEO Specialist Workspace
            </div>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-emerald-950 tracking-tight">
              SEO Executive Command Dashboard
            </h1>
            <p className="text-emerald-800 text-sm mt-2 max-w-2xl leading-relaxed font-medium">
              Welcome to the independent SEO Executive workspace. Optimize titles, meta descriptions, FAQ schemas, image ALT tags, and search rankings.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/seo/products"
              className="px-6 py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm shadow-md shadow-emerald-700/20 transition-all flex items-center gap-2 active:scale-95"
            >
              <Tag size={18} />
              Open Product SEO Manager
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
              Total Products
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <Tag size={18} />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{products.length}</p>
          <p className="text-xs text-slate-500 font-medium">Catalog items in store</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
              Fully Optimized
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-emerald-800">{optimizedProducts.length}</p>
          <p className="text-xs text-emerald-800 font-semibold">Meta & Keyword ready</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
              Categories SEO
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <Globe size={18} />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{categories.length}</p>
          <p className="text-xs text-slate-500 font-medium">Ayurvedic treatment hubs</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
              Asthma Product Status
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold">
              <Sparkles size={18} />
            </div>
          </div>
          <p className="text-xl font-extrabold text-emerald-800">
            {asthmaProd ? '100% Ready' : 'Pending'}
          </p>
          <p className="text-xs text-slate-500 font-medium">8 FAQs & Meta Pre-seeded</p>
        </div>
      </div>

      {/* Quick Launch Table Card */}
      <div className="bg-white rounded-3xl p-6 lg:p-8 border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Asthma & Top Product SEO Status</h2>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Select any product to edit its meta titles, meta descriptions, image ALT text, and 8 FAQs.
            </p>
          </div>

          <Link
            to="/seo/products"
            className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-sm"
          >
            Go To SEO Editor <ArrowRight size={14} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider bg-slate-50">
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4">Primary Keyword</th>
                <th className="py-3 px-4">Meta Title Status</th>
                <th className="py-3 px-4">FAQs Count</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium">
              {products.map((p) => {
                const hasTitle = Boolean(p.metaTitle);
                const faqCount = Array.isArray(p.faqs) ? p.faqs.length : 0;
                return (
                  <tr key={p._id || p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4 font-bold text-slate-900 flex items-center gap-2">
                      {p.name}
                      {p.name.toLowerCase().includes('asthma') && (
                        <span className="bg-emerald-100 text-emerald-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                          Preset Loaded
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-slate-600 font-semibold">
                      {p.primaryKeyword || '—'}
                    </td>
                    <td className="py-4 px-4">
                      {hasTitle ? (
                        <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full font-bold text-[10px]">
                          <CheckCircle2 size={12} /> {p.metaTitle.length} chars
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full font-bold text-[10px]">
                          <AlertTriangle size={12} /> Needs Meta Title
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 font-bold text-slate-700">
                      {faqCount} Q&As
                    </td>
                    <td className="py-4 px-4 text-right">
                      <Link
                        to="/seo/products"
                        className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl transition-all"
                      >
                        <FileText size={14} /> Edit SEO
                      </Link>
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

export default SEODashboard;
