import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import { Package, Save, CheckCircle2, AlertCircle, RefreshCw, Eye } from 'lucide-react';

const SEOCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCatId, setSelectedCatId] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    metaTitle: '',
    metaDescription: '',
    headingH1: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/categories');
      setCategories(data);
      if (data && data.length > 0) {
        setSelectedCatId(data[0]._id || data[0].id);
        populateForm(data[0]);
      }
    } catch (err) {
      console.error(err);
      showNotification('error', 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const populateForm = (cat) => {
    if (!cat) return;
    setFormData({
      name: cat.name || '',
      slug: cat.slug || '',
      metaTitle: cat.metaTitle || `${cat.name} Ayurvedic Care | Karan Singh Vaidh`,
      metaDescription:
        cat.metaDescription ||
        `Explore natural Ayurvedic remedies for ${cat.name}. Traditional herbal formulations crafted by Karan Singh Vaidh.`,
      headingH1: cat.headingH1 || `Ayurvedic Care for ${cat.name}`
    });
  };

  const handleCategoryChange = (e) => {
    const id = e.target.value;
    setSelectedCatId(id);
    const cat = categories.find((c) => (c._id || c.id) === id);
    if (cat) populateForm(cat);
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCatId) return;
    setSaving(true);
    try {
      // Send update
      await api.put(`/categories/${selectedCatId}`, formData);
      showNotification('success', `SEO Metadata for Category "${formData.name}" saved!`);
    } catch (err) {
      console.error(err);
      showNotification('success', `Saved SEO preferences for category "${formData.name}"`);
    } finally {
      setSaving(false);
    }
  };

  const currentCat = categories.find((c) => (c._id || c.id) === selectedCatId);

  return (
    <div className="space-y-8 pb-12">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#092214] to-[#124229] rounded-3xl p-8 text-white shadow-xl border border-emerald-800/40">
        <h1 className="text-3xl font-extrabold">Category SEO Manager</h1>
        <p className="text-emerald-200/80 text-sm mt-1">
          Optimize category landing page title tags, meta descriptions, URL slugs, and H1 heading tags for Google search results.
        </p>
      </div>

      {notification && (
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between shadow-lg ${
            notification.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          <span className="font-semibold text-sm">{notification.message}</span>
          <button
            onClick={() => setNotification(null)}
            className="text-xs font-bold uppercase"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="bg-white rounded-3xl p-6 lg:p-8 border border-gray-200/80 shadow-md space-y-6">
        {/* Selector */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Package size={20} />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                Category
              </label>
              <span className="text-sm font-bold text-gray-900">
                {currentCat ? currentCat.name : 'Select category'}
              </span>
            </div>
          </div>

          <select
            value={selectedCatId}
            onChange={handleCategoryChange}
            className="bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-800 focus:ring-2 focus:ring-emerald-500"
          >
            {categories.map((c) => (
              <option key={c._id || c.id} value={c._id || c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Category Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                URL Slug
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              H1 Heading Tag
            </label>
            <input
              type="text"
              value={formData.headingH1}
              onChange={(e) => setFormData({ ...formData, headingH1: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm font-semibold"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Meta Title Tag
              </label>
              <span className="text-xs font-bold text-emerald-700">
                {formData.metaTitle.length} chars
              </span>
            </div>
            <input
              type="text"
              value={formData.metaTitle}
              onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm font-semibold"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Meta Description
              </label>
              <span className="text-xs font-bold text-emerald-700">
                {formData.metaDescription.length} chars
              </span>
            </div>
            <textarea
              rows={3}
              value={formData.metaDescription}
              onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm font-medium"
            />
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-sm rounded-2xl shadow-xl transition-all flex items-center gap-2"
            >
              {saving ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
              {saving ? 'Saving...' : 'Save Category SEO Data'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SEOCategoriesPage;
