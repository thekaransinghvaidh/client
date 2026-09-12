import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import {
  Globe,
  Search,
  Sparkles,
  Save,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  MessageSquare,
  FileText,
  Tag,
  Layers,
  Plus,
  Trash2,
  Eye,
  RefreshCw,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

const ASTHMA_SEO_PRESET = {
  name: 'Asthma',
  primaryKeyword: 'Ayurvedic Asthma Medicine',
  metaTitle: 'Ayurvedic Asthma Medicine for Breathing Support | Karan Singh Vaidh',
  metaDescription: 'Buy Ayurvedic Asthma Medicine for breathing support and respiratory wellness. A traditional Ayurvedic formulation designed to support healthy breathing and lung wellness.',
  imageAltText: 'Ayurvedic Asthma Medicine for Respiratory Support',
  shortDescription: 'Ayurvedic Asthma Medicine designed to support breathing comfort, respiratory health, lung wellness, and healthy breathing as part of a balanced daily wellness routine.',
  fullDescription: `Ayurvedic Asthma Medicine for Respiratory Wellness

Ayurvedic Asthma Medicine is a traditional Ayurvedic formulation designed to support respiratory wellness, breathing comfort, and healthy lung function. It is suitable for people looking for Ayurvedic Asthma Support as part of their regular wellness routine.

The formulation is prepared according to traditional Ayurvedic principles and focuses on supporting overall respiratory health, lung wellness, and healthy breathing. It can be included as part of a balanced lifestyle that includes healthy food, regular activity, adequate rest, and proper professional guidance.

This Natural Asthma Medicine is intended to provide daily respiratory support and help maintain overall airway wellness. The formulation is prepared with carefully selected ingredients according to the product formulation and quality-focused manufacturing practices.

Why Respiratory Support Matters

Good respiratory health is an important part of everyday well-being. Healthy breathing supports normal daily activities, physical comfort, and overall vitality. This Ayurvedic Respiratory Support formulation is designed to complement a healthy lifestyle and provide ongoing wellness support.

Ayurvedic Approach to Respiratory Wellness

Traditional Ayurveda focuses on maintaining balance in the body and supporting overall wellness. This formulation follows that approach by providing Ayurvedic Asthma Support for people seeking traditional Ayurvedic care for respiratory wellness.

For people searching for the Best Ayurvedic Medicine for Asthma in India, it is important to understand the ingredients, recommended usage, product quality, and professional guidance before choosing a product.

Important Guidance

This product is intended for wellness support and should be used according to the recommended directions. It should not be considered a replacement for prescribed asthma medicines or emergency medical care. People with asthma should continue treatment advised by their qualified healthcare professional.

Individual experiences can vary. If breathing becomes severely difficult, symptoms suddenly worsen, or emergency symptoms occur, seek appropriate medical care immediately.`,
  benefits: `Supports respiratory wellness
Supports breathing comfort
Helps maintain healthy respiratory function
Supports lung wellness
Supports healthy breathing as part of a balanced lifestyle
Supports overall respiratory health
Provides daily respiratory support
Supports airway wellness
Supports overall vitality and wellness
Prepared according to traditional Ayurveda
Suitable for people looking for natural Ayurvedic respiratory support`,
  usage: `Dosage & Method of Use Take 5 g, 1–2 times daily Or as directed by a healthcare professional`,
  whyChooseUs: `Made according to traditional Ayurvedic principles
Designed for respiratory wellness
Supports healthy breathing and lung wellness
Quality-focused manufacturing
Prepared using selected ingredients
Suitable for daily wellness support when used as directed
Transparent product information
Expert Ayurvedic consultation available
Convenient online ordering across India
Secure payment and delivery options`,
  faqs: [
    {
      question: '1. What is Ayurvedic Asthma Medicine?',
      answer: 'Ayurvedic Asthma Medicine refers to Ayurvedic formulations intended to support respiratory wellness and healthy breathing. These products are generally used as part of a broader wellness routine and should be used according to the product instructions and professional guidance.'
    },
    {
      question: '2. Is Ayurvedic Medicine good for asthma?',
      answer: 'Ayurvedic formulations may be used as supportive wellness products for respiratory health. However, asthma can require medical diagnosis and ongoing management. Ayurvedic products should not be used as a replacement for prescribed asthma medicines without guidance from a qualified healthcare professional.'
    },
    {
      question: '3. How does Ayurvedic Asthma Support help?',
      answer: 'Ayurvedic Asthma Support is intended to support respiratory wellness, breathing comfort, healthy lung function, and overall respiratory health. Individual experiences may vary depending on the person and their health condition.'
    },
    {
      question: '4. Can I buy Ayurvedic Asthma Medicine online in India?',
      answer: 'Yes, you can buy Ayurvedic Asthma Medicine online through a reliable and legitimate Ayurvedic product website. Before purchasing, check the product information, ingredients, manufacturer details, usage instructions, and applicable quality or certification information.'
    },
    {
      question: '5. How should Ayurvedic Asthma Medicine be used?',
      answer: 'Use the product according to the dosage and instructions provided on its label or by the qualified practitioner. Do not exceed the recommended quantity, and seek professional guidance if you take other medicines or have specific health concerns.'
    },
    {
      question: '6. Can Ayurvedic Asthma Medicine replace an inhaler?',
      answer: 'No. You should not stop or replace a prescribed inhaler or other asthma medicine without advice from your healthcare professional. This product should not be considered a replacement for emergency asthma treatment.'
    },
    {
      question: '7. Is Ayurvedic Asthma Medicine suitable for everyone?',
      answer: 'Not necessarily. Suitability can depend on age, health condition, medicines being taken, and other individual factors. Children, pregnant or breastfeeding individuals, and people taking regular medicines should seek appropriate professional guidance before use.'
    },
    {
      question: '8. Where can I buy the Best Ayurvedic Medicine for Asthma in India?',
      answer: 'When choosing an Ayurvedic product, look for clear ingredient information, proper manufacturer details, quality-focused manufacturing, usage instructions, transparent policies, and access to professional guidance. Avoid choosing a product only because it claims to be the “best” or promises guaranteed results.'
    }
  ],
  reviewsText: `Product Quality
“The product arrived safely and the packaging was good. My overall experience with the product and ordering process was positive.”

Ordering Experience
“The ordering process was simple and the product was delivered on time. The packaging was secure.”

Consultation Experience
“I liked the Ayurvedic approach and found the consultation support helpful. The product information was easy to understand.”

Product Experience
“I have been using the product as directed. I liked the packaging and overall product presentation.”

Customer Support
“Customer support was helpful when I had questions about my order. The product arrived properly packed.”

Product Packaging
“The packaging was neat and the product arrived in good condition. Overall, I had a good purchasing experience.”

Overall Experience
“The ordering process was smooth and the product information was clear. My overall experience has been positive.”`
};

const SEOManagement = () => {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('meta');
  const [notification, setNotification] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    primaryKeyword: '',
    metaTitle: '',
    metaDescription: '',
    imageAltText: '',
    shortDescription: '',
    fullDescription: '',
    benefits: '',
    usage: '',
    whyChooseUs: '',
    faqs: [],
    reviewsText: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/products');
      setProducts(data);
      if (data && data.length > 0) {
        const asthmaProd = data.find(
          (p) => p.name.toLowerCase().includes('asthma') || (p.slug && p.slug.includes('asthma'))
        );
        const target = asthmaProd || data[0];
        setSelectedProductId(target._id || target.id);
        populateForm(target);
      }
    } catch (err) {
      console.error('Failed to load products', err);
      showNotification('error', 'Failed to fetch products from backend');
    } finally {
      setLoading(false);
    }
  };

  const populateForm = (prod) => {
    if (!prod) return;
    setFormData({
      name: prod.name || '',
      slug: prod.slug || '',
      primaryKeyword: prod.primaryKeyword || '',
      metaTitle: prod.metaTitle || '',
      metaDescription: prod.metaDescription || '',
      imageAltText: prod.imageAltText || '',
      shortDescription: prod.shortDescription || '',
      fullDescription: prod.fullDescription || '',
      benefits: prod.benefits || '',
      usage: prod.usage || '',
      whyChooseUs: prod.whyChooseUs || '',
      faqs: Array.isArray(prod.faqs) && prod.faqs.length > 0 ? prod.faqs : [],
      reviewsText: Array.isArray(prod.reviews)
        ? prod.reviews.map((r) => `${r.title || 'Review'}\n"${r.comment}"`).join('\n\n')
        : ''
    });
  };

  const handleProductChange = async (e) => {
    const id = e.target.value;
    setSelectedProductId(id);
    const prod = products.find((p) => (p._id || p.id) === id);
    if (prod) {
      try {
        setLoading(true);
        const { data } = await api.get(`/products/${id}`);
        populateForm(data);
      } catch (err) {
        populateForm(prod);
      } finally {
        setLoading(false);
      }
    }
  };

  const applyAsthmaPreset = () => {
    setFormData({
      ...ASTHMA_SEO_PRESET,
      slug: formData.slug || 'asthma-ayurvedic-treatment'
    });
    showNotification('success', 'Applied Asthma SEO Executive Preset!');
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFaqChange = (index, key, value) => {
    const updatedFaqs = [...formData.faqs];
    updatedFaqs[index] = { ...updatedFaqs[index], [key]: value };
    setFormData((prev) => ({ ...prev, faqs: updatedFaqs }));
  };

  const addFaqItem = () => {
    setFormData((prev) => ({
      ...prev,
      faqs: [...prev.faqs, { question: '', answer: '' }]
    }));
  };

  const removeFaqItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index)
    }));
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProductId) {
      showNotification('error', 'Please select a product first');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: formData.name,
        primaryKeyword: formData.primaryKeyword,
        metaTitle: formData.metaTitle,
        metaDescription: formData.metaDescription,
        imageAltText: formData.imageAltText,
        shortDescription: formData.shortDescription,
        fullDescription: formData.fullDescription,
        benefits: formData.benefits,
        usage: formData.usage,
        whyChooseUs: formData.whyChooseUs,
        faqs: formData.faqs
      };

      const { data } = await api.put(`/products/${selectedProductId}`, payload);
      showNotification('success', `SEO Metadata for "${data.name}" updated successfully!`);

      setProducts((prev) =>
        prev.map((p) => ((p._id || p.id) === selectedProductId ? { ...p, ...data } : p))
      );
    } catch (err) {
      console.error('Update error:', err);
      showNotification(
        'error',
        err.response?.data?.message || 'Failed to update SEO metadata.'
      );
    } finally {
      setSaving(false);
    }
  };

  const currentProduct = products.find((p) => (p._id || p.id) === selectedProductId);

  return (
    <div className="space-y-8 pb-12 font-sans">
      {/* Light Clean Top Banner */}
      <div className="relative bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100/70 rounded-3xl p-8 text-slate-800 shadow-sm border border-emerald-200/80 overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-600 text-white text-xs font-bold uppercase tracking-widest mb-3 shadow-sm">
              <Sparkles size={14} className="text-amber-300" />
              ProERP SEO Executive Suite
            </div>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-emerald-950 tracking-tight">
              SEO Executive Command Panel
            </h1>
            <p className="text-emerald-800 text-sm mt-2 max-w-2xl leading-relaxed font-medium">
              Manage product search optimization, metadata titles, meta descriptions, FAQ schemas, image ALT tags, and rich content highlights for high Google ranking.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={applyAsthmaPreset}
              className="px-5 py-3 rounded-2xl bg-white hover:bg-emerald-50 border border-emerald-300 text-emerald-800 font-extrabold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm"
            >
              <RefreshCw size={16} />
              Load Asthma SEO Preset
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="px-6 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm shadow-lg shadow-emerald-700/20 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
            >
              {saving ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
              {saving ? 'Saving...' : 'Save SEO Data'}
            </button>
          </div>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-top-3 duration-300 ${
            notification.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : 'bg-red-50 border-red-300 text-red-900'
          }`}
        >
          <div className="flex items-center gap-3 font-semibold text-sm">
            {notification.type === 'success' ? (
              <CheckCircle2 className="text-emerald-700 flex-shrink-0" size={20} />
            ) : (
              <AlertCircle className="text-red-700 flex-shrink-0" size={20} />
            )}
            <span>{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-xs font-bold uppercase tracking-wider opacity-70 hover:opacity-100"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Content & Product Selector Card */}
      <div className="bg-white rounded-3xl p-6 lg:p-8 border border-slate-200/80 shadow-sm space-y-6">
        {/* Target Product Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-sm">
              <Tag size={20} />
            </div>
            <div>
              <label className="text-[11px] font-extrabold text-emerald-900 uppercase tracking-wider block">
                Target Product
              </label>
              <span className="text-base font-extrabold text-slate-900">
                {currentProduct ? currentProduct.name : 'Select a product'}
              </span>
            </div>
          </div>

          <div className="flex-1 max-w-md relative">
            <select
              value={selectedProductId}
              onChange={handleProductChange}
              className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 shadow-sm transition-all appearance-none pr-10 cursor-pointer"
            >
              {products.map((p) => (
                <option key={p._id || p.id} value={p._id || p.id}>
                  {p.name} {p.slug ? `(/product/${p.slug})` : ''}
                </option>
              ))}
            </select>
            <ChevronDown
              size={18}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
            />
          </div>
        </div>

        {/* Bright Tab Navigation */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
          {[
            { id: 'meta', label: 'Meta & Keywords', icon: Globe },
            { id: 'descriptions', label: 'Descriptions', icon: FileText },
            { id: 'highlights', label: 'Benefits & Usage', icon: Layers },
            { id: 'faqs', label: `FAQs (${formData.faqs.length})`, icon: HelpCircle },
            { id: 'reviews', label: 'Reviews', icon: MessageSquare },
            { id: 'preview', label: 'Google SERP Preview', icon: Eye }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-extrabold text-xs uppercase tracking-wider transition-all duration-200 ${
                  isActive
                    ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
                    : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-800'
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Meta & Keywords */}
        {activeTab === 'meta' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold focus:ring-2 focus:ring-emerald-600 bg-white"
                  placeholder="e.g. Asthma"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2">
                  Primary Keyword
                </label>
                <input
                  type="text"
                  value={formData.primaryKeyword}
                  onChange={(e) => handleInputChange('primaryKeyword', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold focus:ring-2 focus:ring-emerald-600 bg-white"
                  placeholder="e.g. Ayurvedic Asthma Medicine"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                  Meta Title
                </label>
                <span
                  className={`text-xs font-bold ${
                    formData.metaTitle.length > 60 ? 'text-amber-700' : 'text-emerald-700'
                  }`}
                >
                  {formData.metaTitle.length} / 60 chars (Recommended: 50–60)
                </span>
              </div>
              <input
                type="text"
                value={formData.metaTitle}
                onChange={(e) => handleInputChange('metaTitle', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold focus:ring-2 focus:ring-emerald-600 bg-white"
                placeholder="Ayurvedic Asthma Medicine for Breathing Support | Karan Singh Vaidh"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                  Meta Description
                </label>
                <span
                  className={`text-xs font-bold ${
                    formData.metaDescription.length > 160
                      ? 'text-amber-700'
                      : 'text-emerald-700'
                  }`}
                >
                  {formData.metaDescription.length} / 160 chars (Recommended: 120–160)
                </span>
              </div>
              <textarea
                rows={3}
                value={formData.metaDescription}
                onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-emerald-600 bg-white leading-relaxed"
                placeholder="Buy Ayurvedic Asthma Medicine for breathing support and respiratory wellness..."
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2">
                Image ALT Text
              </label>
              <input
                type="text"
                value={formData.imageAltText}
                onChange={(e) => handleInputChange('imageAltText', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold focus:ring-2 focus:ring-emerald-600 bg-white"
                placeholder="Ayurvedic Asthma Medicine for Respiratory Support"
              />
            </div>
          </div>
        )}

        {/* Tab 2: Descriptions */}
        {activeTab === 'descriptions' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2">
                Short Description (Card & Header Overview)
              </label>
              <textarea
                rows={3}
                value={formData.shortDescription}
                onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-emerald-600 bg-white"
                placeholder="Ayurvedic Asthma Medicine designed to support breathing comfort..."
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2">
                Long Description / Main SEO Article
              </label>
              <textarea
                rows={12}
                value={formData.fullDescription}
                onChange={(e) => handleInputChange('fullDescription', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-medium leading-relaxed focus:ring-2 focus:ring-emerald-600 bg-white font-mono"
                placeholder="Enter rich formatted long description..."
              />
            </div>
          </div>
        )}

        {/* Tab 3: Benefits & Usage */}
        {activeTab === 'highlights' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2">
                Ayurvedic Support Benefits
              </label>
              <textarea
                rows={6}
                value={formData.benefits}
                onChange={(e) => handleInputChange('benefits', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-emerald-600 bg-white"
                placeholder="Supports respiratory wellness..."
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2">
                How to Use / Dosage & Method
              </label>
              <textarea
                rows={3}
                value={formData.usage}
                onChange={(e) => handleInputChange('usage', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-emerald-600 bg-white"
                placeholder="Dosage & Method of Use: Take 5 g, 1–2 times daily..."
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2">
                Why Choose Our Product Highlights
              </label>
              <textarea
                rows={5}
                value={formData.whyChooseUs}
                onChange={(e) => handleInputChange('whyChooseUs', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-emerald-600 bg-white"
                placeholder="Made according to traditional Ayurvedic principles..."
              />
            </div>
          </div>
        )}

        {/* Tab 4: FAQs */}
        {activeTab === 'faqs' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  Most Searched & Related FAQs Schema ({formData.faqs.length})
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  These Q&As generate Google FAQ Rich Snippets automatically.
                </p>
              </div>
              <button
                type="button"
                onClick={addFaqItem}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm"
              >
                <Plus size={16} />
                Add FAQ Pair
              </button>
            </div>

            <div className="space-y-4">
              {formData.faqs.map((faq, index) => (
                <div
                  key={index}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 relative group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-900 bg-emerald-100 px-3 py-1 rounded-md">
                      FAQ #{index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFaqItem(index)}
                      className="text-red-600 hover:text-red-800 text-xs font-bold flex items-center gap-1"
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 mb-1">
                      Question
                    </label>
                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) => handleFaqChange(index, 'question', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold bg-white"
                      placeholder="e.g. What is Ayurvedic Asthma Medicine?"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 mb-1">
                      Answer
                    </label>
                    <textarea
                      rows={3}
                      value={faq.answer}
                      onChange={(e) => handleFaqChange(index, 'answer', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium bg-white"
                      placeholder="Enter detailed answer..."
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Reviews */}
        {activeTab === 'reviews' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 mb-1">
                Customer Experience & Testimonials Overview
              </h3>
              <p className="text-xs text-slate-500 font-medium mb-4">
                View or edit customer experience categories (Product Quality, Ordering Experience, Consultation Experience, etc.).
              </p>
              <textarea
                rows={10}
                value={formData.reviewsText}
                onChange={(e) => handleInputChange('reviewsText', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-medium leading-relaxed font-mono bg-white"
                placeholder="Product Quality..."
              />
            </div>
          </div>
        )}

        {/* Tab 6: Live Google SERP Preview */}
        {activeTab === 'preview' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 mb-1">
                Live Google Search Snippet Preview
              </h3>
              <p className="text-xs text-slate-500 font-medium mb-6">
                This is how your product will look to customers searching on Google.
              </p>
            </div>

            <div className="max-w-2xl bg-white p-6 rounded-2xl border border-slate-200 shadow-md space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <span className="w-4 h-4 bg-emerald-700 text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                  K
                </span>
                <span className="font-semibold text-slate-800">thekaransinghvaidh.com</span>
                <span>› product › {formData.slug || 'asthma-ayurvedic-treatment'}</span>
              </div>
              <h4 className="text-xl font-medium text-[#1a0dab] hover:underline cursor-pointer leading-snug">
                {formData.metaTitle || 'Product Meta Title'}
              </h4>
              <p className="text-sm text-[#4d5156] leading-relaxed">
                {formData.metaDescription ||
                  formData.shortDescription ||
                  'Product meta description preview will appear here.'}
              </p>
            </div>
          </div>
        )}

        {/* Bottom Save Action */}
        <div className="pt-6 border-t border-slate-200 flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="px-8 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-emerald-700/20 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
          >
            {saving ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
            {saving ? 'Saving Changes...' : 'Save All SEO Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SEOManagement;
