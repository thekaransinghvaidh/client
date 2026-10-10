import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../../api/api';
import {
    ArrowLeft, Save, Eye, Edit3, Image as ImageIcon,
    Tag, Globe, Clock, User, Check, Loader2, Upload,
    Sparkles, Heading1, Heading2, Bold, List, Quote, AlertCircle
} from 'lucide-react';
import ImageKitUpload from '../../components/common/ImageKitUpload';

const BlogForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    const [loading, setLoading] = useState(isEditMode);
    const [submitting, setSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState('edit'); // 'edit' or 'preview'
    const [uploadingImage, setUploadingImage] = useState(false);
    const [statusError, setStatusError] = useState('');
    const [statusSuccess, setStatusSuccess] = useState('');

    // Form state
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [autoSlug, setAutoSlug] = useState(true);
    const [excerpt, setExcerpt] = useState('');
    const [content, setContent] = useState('');
    const [coverImage, setCoverImage] = useState('');
    const [category, setCategory] = useState('Ayurveda Care');
    const [customCategory, setCustomCategory] = useState('');
    const [author, setAuthor] = useState('Dr. Karan Singh Vaidh');
    const [readTime, setReadTime] = useState('5 min read');
    const [tags, setTags] = useState('Asthma, Ayurveda, Wellness');
    const [isPublished, setIsPublished] = useState(true);
    const [isFeatured, setIsFeatured] = useState(false);
    const [metaTitle, setMetaTitle] = useState('');
    const [metaDescription, setMetaDescription] = useState('');
    const [keywords, setKeywords] = useState('Ayurveda, Health Care, Chronic Disease Care');

    const categoriesList = [
        'Ayurveda Care',
        'Asthma Care',
        'Hypertension',
        'Kidney Stone',
        'Gall Bladder Care',
        'Piles Care',
        'Diabetes Care',
        'Skin & Allergy',
        'Digestive Care',
        'General Wellness',
        'Custom'
    ];

    useEffect(() => {
        if (isEditMode) {
            fetchBlogDetails();
        }
    }, [id]);

    const fetchBlogDetails = async () => {
        try {
            setLoading(true);
            const { data } = await api.get(`/blogs/${id}`);
            const blog = data.blog;

            setTitle(blog.title || '');
            setSlug(blog.slug || '');
            setAutoSlug(false);
            setExcerpt(blog.excerpt || '');
            setContent(blog.content || '');
            setCoverImage(blog.coverImage || '');
            setAuthor(blog.author || 'Dr. Karan Singh Vaidh');
            setReadTime(blog.readTime || '5 min read');
            setIsPublished(blog.isPublished !== undefined ? blog.isPublished : true);
            setIsFeatured(blog.isFeatured || false);
            setMetaTitle(blog.metaTitle || '');
            setMetaDescription(blog.metaDescription || '');

            if (blog.tags && Array.isArray(blog.tags)) {
                setTags(blog.tags.join(', '));
            }

            if (blog.keywords && Array.isArray(blog.keywords)) {
                setKeywords(blog.keywords.join(', '));
            }

            if (categoriesList.includes(blog.category)) {
                setCategory(blog.category);
            } else if (blog.category) {
                setCategory('Custom');
                setCustomCategory(blog.category);
            }

            setLoading(false);
        } catch (err) {
            setStatusError(err.response?.data?.message || 'Failed to fetch blog post details');
            setLoading(false);
        }
    };

    // Auto slug generator
    const handleTitleChange = (e) => {
        const value = e.target.value;
        setTitle(value);
        if (statusError) setStatusError('');
        if (autoSlug && !isEditMode) {
            const slugified = value
                .toLowerCase()
                .trim()
                .replace(/\s+/g, '-')
                .replace(/[^\w\-]+/g, '')
                .replace(/\-\-+/g, '-')
                .replace(/^-+/, '')
                .replace(/-+$/, '');
            setSlug(slugified);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        try {
            setUploadingImage(true);
            const { data } = await api.post('/upload', formData);
            setCoverImage(data.imageUrl || data.url || data);
            setUploadingImage(false);
        } catch (err) {
            setStatusError('Image upload failed: ' + (err.response?.data?.message || err.message));
            setUploadingImage(false);
        }
    };

    // Quick formatting helper inside editor textarea
    const insertFormatting = (tagStart, tagEnd = '') => {
        const textarea = document.getElementById('blog-content-textarea');
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = content.substring(start, end) || 'Sample text';
        const replacement = `${tagStart}${selectedText}${tagEnd}`;

        const newContent = content.substring(0, start) + replacement + content.substring(end);
        setContent(newContent);

        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + tagStart.length, start + tagStart.length + selectedText.length);
        }, 50);
    };

    const submitHandler = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        setStatusError('');
        setStatusSuccess('');

        if (!title.trim()) {
            setStatusError('⚠️ Please enter a Blog Title.');
            const el = document.getElementById('blog-title-input');
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                el.focus();
            }
            return;
        }

        if (!excerpt.trim()) {
            setStatusError('⚠️ Please enter a Short Excerpt / Summary for the blog.');
            const el = document.getElementById('blog-excerpt-input');
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                el.focus();
            }
            return;
        }

        if (!content.trim()) {
            setStatusError('⚠️ Please enter Article Body Content in the editor.');
            const el = document.getElementById('blog-content-textarea');
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                el.focus();
            }
            return;
        }

        const finalCategory = category === 'Custom' ? customCategory.trim() || 'General' : category;

        const blogData = {
            title: title.trim(),
            slug: slug.trim() || title.toLowerCase().trim().replace(/\s+/g, '-'),
            excerpt: excerpt.trim(),
            content: content.trim(),
            coverImage: coverImage.trim() || '/logo.png',
            category: finalCategory,
            author: author.trim() || 'Dr. Karan Singh Vaidh',
            readTime: readTime.trim() || '5 min read',
            tags,
            isPublished: Boolean(isPublished),
            isFeatured: Boolean(isFeatured),
            metaTitle: metaTitle.trim() || title.trim(),
            metaDescription: metaDescription.trim() || excerpt.trim(),
            keywords
        };

        try {
            setSubmitting(true);
            if (isEditMode) {
                await api.put(`/blogs/${id}`, blogData);
                setStatusSuccess('✅ Article updated successfully! Redirecting...');
            } else {
                await api.post('/blogs', blogData);
                setStatusSuccess('✅ Article published successfully! Redirecting...');
            }
            setSubmitting(false);
            setTimeout(() => {
                navigate('/admin/blogs');
            }, 1200);
        } catch (err) {
            console.error('Failed to save blog:', err);
            setSubmitting(false);
            const serverMsg = err.response?.data?.message;
            if (serverMsg) {
                setStatusError(`⚠️ Server Error: ${serverMsg}`);
            } else if (err.message && err.message.includes('Network Error')) {
                setStatusError('⚠️ Network Error: Cannot reach backend server on port 5000. Please start the backend by running START_BACKEND.bat in the project directory.');
            } else {
                setStatusError(`⚠️ ${err.message || 'Failed to save blog post. Please check backend connection.'}`);
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <Loader2 size={40} className="text-ayur-green animate-spin mb-4" />
                <p className="text-gray-400 font-medium">Loading article details...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-28">
            {/* Header Navigation */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <Link
                        to="/admin/blogs"
                        className="p-3 bg-white text-gray-600 rounded-2xl border border-gray-100 shadow-sm hover:text-ayur-green hover:bg-gray-50 transition-all"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h2 className="text-2xl font-serif font-bold text-ayur-green italic">
                            {isEditMode ? 'Edit Ayurvedic Article' : 'Draft New Wellness Article'}
                        </h2>
                        <p className="text-gray-400 text-xs font-medium mt-0.5">
                            {isEditMode ? `Updating /${slug}` : 'Publish authentic Ayurvedic guidance and remedies'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex bg-gray-100 p-1 rounded-2xl border border-gray-200">
                        <button
                            type="button"
                            onClick={() => setActiveTab('edit')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                                activeTab === 'edit' ? 'bg-white text-ayur-green shadow-sm' : 'text-gray-500 hover:text-gray-900'
                            }`}
                        >
                            <Edit3 size={14} />
                            Editor
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('preview')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                                activeTab === 'preview' ? 'bg-white text-ayur-green shadow-sm' : 'text-gray-500 hover:text-gray-900'
                            }`}
                        >
                            <Eye size={14} />
                            Live Reader Preview
                        </button>
                    </div>
                </div>
            </div>

            {statusError && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-semibold rounded-2xl flex items-center gap-3 shadow-sm animate-in fade-in">
                    <AlertCircle size={20} className="text-red-500 flex-shrink-0" />
                    <span>{statusError}</span>
                </div>
            )}

            {statusSuccess && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold rounded-2xl flex items-center gap-3 shadow-sm animate-in fade-in">
                    <Check size={20} className="text-emerald-600 flex-shrink-0" />
                    <span>{statusSuccess}</span>
                </div>
            )}

            <form onSubmit={submitHandler} className="space-y-8">
                {activeTab === 'edit' ? (
                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                        {/* Main Left Column (Content & Core Fields) */}
                        <div className="xl:col-span-8 space-y-8">
                            {/* Card 1: Article Identity */}
                            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-gray-100 space-y-6">
                                <div className="flex items-center justify-between pb-4 border-b border-gray-50">
                                    <div className="flex items-center gap-3">
                                        <Sparkles size={20} className="text-ayur-gold" />
                                        <h3 className="text-lg font-serif font-bold text-gray-900 italic">Article Identity</h3>
                                    </div>
                                    {!isEditMode && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setTitle('Comprehensive Ayurvedic Treatment for Chronic Respiratory Wellness');
                                                setSlug('comprehensive-ayurvedic-treatment-for-chronic-respiratory-wellness');
                                                setExcerpt('An expert clinical analysis into traditional rasayana therapies, pulmonary cleansing herbs like Vasaka, and restorative breathing practices.');
                                                setContent('<h2>Understanding Respiratory Imbalance in Ayurveda</h2><p>In traditional Ayurveda, respiratory issues emerge from Kapha and Vata imbalances affecting the Pranavaha Srotas (respiratory pathways). Proper purification with herbal decoctions cleanses the alveoli and improves oxygenation naturally.</p><h3>Key Recommended Formulations</h3><ul><li><strong>Vasaka:</strong> Liquefies stubborn bronchial congestion.</li><li><strong>Kantakari:</strong> Relieves chest constriction and coughing spasms.</li><li><strong>Yashtimadhu:</strong> Soothes mucosal inflammation.</li></ul><p>Consult with Dr. Karan Singh Vaidh for customized dosage based on personal prakriti.</p>');
                                                setStatusError('');
                                            }}
                                            className="text-[11px] font-bold text-ayur-green hover:underline cursor-pointer bg-ayur-green/10 px-3 py-1 rounded-full"
                                        >
                                            + Fill Sample Template
                                        </button>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">
                                        Blog Title *
                                    </label>
                                    <input
                                        id="blog-title-input"
                                        type="text"
                                        placeholder="e.g. Natural Ayurvedic Remedies for Asthma & Bronchial Care"
                                        value={title}
                                        onChange={handleTitleChange}
                                        className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-ayur-green/20 text-base font-semibold text-gray-900 transition-all placeholder:text-gray-300"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between px-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                            URL Permalink (Slug) *
                                        </label>
                                        {!isEditMode && (
                                            <label className="flex items-center gap-2 cursor-pointer text-[10px] font-bold text-ayur-green">
                                                <input
                                                    type="checkbox"
                                                    checked={autoSlug}
                                                    onChange={(e) => setAutoSlug(e.target.checked)}
                                                    className="rounded text-ayur-green focus:ring-ayur-green"
                                                />
                                                Auto-generate from Title
                                            </label>
                                        )}
                                    </div>
                                    <div className="flex items-center bg-gray-50 rounded-2xl px-4 py-3">
                                        <span className="text-xs font-bold text-gray-400 select-none">/blog/</span>
                                        <input
                                            type="text"
                                            placeholder="natural-ayurvedic-remedies-for-asthma"
                                            value={slug}
                                            onChange={(e) => {
                                                setAutoSlug(false);
                                                setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                                            }}
                                            className="w-full bg-transparent border-none focus:ring-0 text-xs font-bold text-ayur-green p-0 ml-1"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">
                                        Short Excerpt / Summary * (For preview cards & SEO snippet)
                                    </label>
                                    <textarea
                                        id="blog-excerpt-input"
                                        rows="3"
                                        placeholder="Brief 2-3 sentence overview highlighting key Ayurvedic concepts discussed in this post..."
                                        value={excerpt}
                                        onChange={(e) => {
                                            setExcerpt(e.target.value);
                                            if (statusError) setStatusError('');
                                        }}
                                        className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-ayur-green/20 text-sm font-medium text-gray-700 transition-all placeholder:text-gray-300"
                                    />
                                </div>
                            </div>

                            {/* Card 2: Main Body Content */}
                            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-gray-100 space-y-6">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-50">
                                    <div className="flex items-center gap-3">
                                        <Edit3 size={20} className="text-ayur-green" />
                                        <h3 className="text-lg font-serif font-bold text-gray-900 italic">Article Body Content</h3>
                                    </div>

                                    {/* Formatting Toolbar */}
                                    <div className="flex items-center gap-1.5 flex-wrap bg-gray-50 p-1.5 rounded-xl border border-gray-100">
                                        <button
                                            type="button"
                                            onClick={() => insertFormatting('<h2>', '</h2>')}
                                            className="px-2 py-1 text-xs font-bold text-gray-600 hover:bg-white rounded hover:text-ayur-green transition-colors"
                                            title="Heading 2"
                                        >
                                            H2
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => insertFormatting('<h3>', '</h3>')}
                                            className="px-2 py-1 text-xs font-bold text-gray-600 hover:bg-white rounded hover:text-ayur-green transition-colors"
                                            title="Heading 3"
                                        >
                                            H3
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => insertFormatting('<strong>', '</strong>')}
                                            className="px-2 py-1 text-xs font-bold text-gray-600 hover:bg-white rounded hover:text-ayur-green transition-colors"
                                            title="Bold"
                                        >
                                            <Bold size={13} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => insertFormatting('<ul>\n  <li>', '</li>\n  <li>Point 2</li>\n</ul>')}
                                            className="px-2 py-1 text-xs font-bold text-gray-600 hover:bg-white rounded hover:text-ayur-green transition-colors"
                                            title="Bullet List"
                                        >
                                            <List size={13} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => insertFormatting('<blockquote>', '</blockquote>')}
                                            className="px-2 py-1 text-xs font-bold text-gray-600 hover:bg-white rounded hover:text-ayur-green transition-colors"
                                            title="Quote"
                                        >
                                            <Quote size={13} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => insertFormatting('<p>', '</p>')}
                                            className="px-2 py-1 text-xs font-bold text-gray-600 hover:bg-white rounded hover:text-ayur-green transition-colors"
                                            title="Paragraph"
                                        >
                                            P
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <textarea
                                        id="blog-content-textarea"
                                        rows="18"
                                        placeholder="Write full HTML or text content here... Use <h2>, <h3>, <p>, <ul>, <li>, <strong> tags for beautiful formatting."
                                        value={content}
                                        onChange={(e) => {
                                            setContent(e.target.value);
                                            if (statusError) setStatusError('');
                                        }}
                                        className="w-full px-6 py-5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-ayur-green/20 font-mono text-sm leading-relaxed text-gray-800 transition-all placeholder:text-gray-300"
                                    />
                                </div>
                            </div>

                            {/* Card 3: SEO Meta Configuration */}
                            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-gray-100 space-y-6">
                                <div className="flex items-center gap-3 pb-4 border-b border-gray-50">
                                    <Globe size={20} className="text-ayur-green" />
                                    <h3 className="text-lg font-serif font-bold text-gray-900 italic">SEO Meta & Search Keywords</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">
                                            Meta Title
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Defaults to Blog Title"
                                            value={metaTitle}
                                            onChange={(e) => setMetaTitle(e.target.value)}
                                            className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-ayur-green/20 text-xs font-medium transition-all"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">
                                            Keywords (Comma separated)
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Asthma Remedies, Vasaka, Karan Singh Vaidh"
                                            value={keywords}
                                            onChange={(e) => setKeywords(e.target.value)}
                                            className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-ayur-green/20 text-xs font-medium transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">
                                        Meta Description
                                    </label>
                                    <textarea
                                        rows="2"
                                        placeholder="Defaults to Short Excerpt"
                                        value={metaDescription}
                                        onChange={(e) => setMetaDescription(e.target.value)}
                                        className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-ayur-green/20 text-xs font-medium transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right Sidebar Column (Publishing Options, Category, Cover Image) */}
                        <div className="xl:col-span-4 space-y-8">
                            {/* Sidebar Card 1: Publish Controls */}
                            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-gray-100 space-y-6">
                                <h3 className="text-base font-serif font-bold text-gray-900 italic border-b border-gray-50 pb-4">
                                    Publishing Status
                                </h3>

                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <div>
                                        <span className="text-xs font-bold text-gray-800 block">Published Status</span>
                                        <span className="text-[10px] text-gray-400 font-medium">Visible to website visitors</span>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={isPublished}
                                            onChange={(e) => setIsPublished(e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <div>
                                        <span className="text-xs font-bold text-gray-800 block">Featured Article</span>
                                        <span className="text-[10px] text-gray-400 font-medium">Highlight in hero section</span>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={isFeatured}
                                            onChange={(e) => setIsFeatured(e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-ayur-gold"></div>
                                    </label>
                                </div>
                            </div>

                            {/* Sidebar Card 2: Cover Image */}
                            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-gray-100 space-y-6">
                                <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                                    <ImageIcon size={18} className="text-ayur-green" />
                                    <h3 className="text-base font-serif font-bold text-gray-900 italic">Cover Image</h3>
                                </div>

                                {coverImage && (
                                    <div className="relative rounded-2xl overflow-hidden border border-gray-100 shadow-sm group aspect-video bg-gray-50">
                                        <img
                                            src={coverImage}
                                            alt="Cover Preview"
                                            className="w-full h-full object-cover"
                                            onError={(e) => (e.target.src = '/logo.png')}
                                        />
                                    </div>
                                )}

                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">
                                        Image URL / Path
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. /VIDHUVADHA-ASTHMA-Care-Pouch-Formulation.webp"
                                        value={coverImage}
                                        onChange={(e) => setCoverImage(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-xs font-medium text-gray-800 transition-all"
                                    />
                                </div>

                                <div className="space-y-2 pt-2 border-t border-gray-50">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1 block">
                                        Upload New Image
                                    </label>
                                    <ImageKitUpload
                                        label="Upload via ImageKit"
                                        folder="/ksv-blogs"
                                        onUploadSuccess={(url) => setCoverImage(url)}
                                    />

                                    <div className="relative pt-2">
                                        <label className="w-full py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors border border-gray-100">
                                            <Upload size={14} />
                                            <span>{uploadingImage ? 'Uploading File...' : 'Upload Local File'}</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileUpload}
                                                disabled={uploadingImage}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar Card 3: Categorization & Metadata */}
                            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-gray-100 space-y-6">
                                <h3 className="text-base font-serif font-bold text-gray-900 italic border-b border-gray-50 pb-4">
                                    Category & Author Details
                                </h3>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">
                                        Therapeutic Category
                                    </label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl text-xs font-bold text-ayur-green focus:ring-2 focus:ring-ayur-green/20"
                                    >
                                        {categoriesList.map((cat) => (
                                            <option key={cat} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {category === 'Custom' && (
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">
                                            Custom Category Name
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter custom category"
                                            value={customCategory}
                                            onChange={(e) => setCustomCategory(e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-xs font-medium"
                                        />
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">
                                        Author Name
                                    </label>
                                    <div className="flex items-center bg-gray-50 rounded-2xl px-4 py-2.5">
                                        <User size={16} className="text-gray-400 mr-2" />
                                        <input
                                            type="text"
                                            value={author}
                                            onChange={(e) => setAuthor(e.target.value)}
                                            className="w-full bg-transparent border-none focus:ring-0 text-xs font-bold text-gray-800 p-0"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">
                                        Estimated Read Time
                                    </label>
                                    <div className="flex items-center bg-gray-50 rounded-2xl px-4 py-2.5">
                                        <Clock size={16} className="text-gray-400 mr-2" />
                                        <input
                                            type="text"
                                            value={readTime}
                                            onChange={(e) => setReadTime(e.target.value)}
                                            className="w-full bg-transparent border-none focus:ring-0 text-xs font-bold text-gray-800 p-0"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">
                                        Tags (Comma separated)
                                    </label>
                                    <div className="flex items-center bg-gray-50 rounded-2xl px-4 py-2.5">
                                        <Tag size={16} className="text-gray-400 mr-2" />
                                        <input
                                            type="text"
                                            placeholder="Asthma, Remedies, Health"
                                            value={tags}
                                            onChange={(e) => setTags(e.target.value)}
                                            className="w-full bg-transparent border-none focus:ring-0 text-xs font-medium text-gray-800 p-0"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Live Preview Tab */
                    <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-gray-100 max-w-4xl mx-auto space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-ayur-green/10 text-ayur-green rounded-full text-xs font-bold uppercase tracking-wider">
                            {category === 'Custom' ? customCategory || 'General' : category}
                        </div>

                        <h1 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 leading-tight">
                            {title || 'Untitled Article Header'}
                        </h1>

                        <div className="flex items-center gap-4 text-xs font-medium text-gray-500 pb-6 border-b border-gray-100">
                            <span className="font-bold text-ayur-green">{author}</span>
                            <span>•</span>
                            <span>{readTime}</span>
                            <span>•</span>
                            <span>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        </div>

                        {coverImage && (
                            <div className="rounded-3xl overflow-hidden shadow-lg aspect-video bg-gray-100">
                                <img
                                    src={coverImage}
                                    alt="Cover"
                                    className="w-full h-full object-cover"
                                    onError={(e) => (e.target.src = '/logo.png')}
                                />
                            </div>
                        )}

                        <div className="p-6 bg-ayur-beige/10 rounded-2xl border border-ayur-beige/30 italic text-gray-700 text-base leading-relaxed">
                            "{excerpt || 'Short excerpt will appear here...'}"
                        </div>

                        <div
                            className="prose prose-lg max-w-none text-gray-800 leading-relaxed font-sans space-y-4"
                            dangerouslySetInnerHTML={{ __html: content || '<p>Article body preview will render here...</p>' }}
                        />
                    </div>
                )}

                {/* Sticky Action Footer */}
                <div className="fixed bottom-6 right-6 left-6 md:left-80 z-40 bg-white/95 backdrop-blur-md p-4 rounded-3xl border border-gray-200/80 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <Link
                            to="/admin/blogs"
                            className="px-6 py-3 text-gray-500 font-bold text-xs rounded-xl hover:bg-gray-100 transition-colors"
                        >
                            Cancel
                        </Link>
                        {statusError && (
                            <span className="text-xs font-bold text-red-600 truncate max-w-xs md:max-w-md">
                                {statusError}
                            </span>
                        )}
                        {statusSuccess && (
                            <span className="text-xs font-bold text-emerald-600 truncate max-w-xs md:max-w-md">
                                {statusSuccess}
                            </span>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="px-8 py-3.5 bg-ayur-green text-white font-bold text-sm rounded-2xl shadow-xl shadow-ayur-green/20 hover:bg-ayur-olive transition-all flex items-center justify-center gap-2 disabled:opacity-50 w-full sm:w-auto"
                    >
                        {submitting ? (
                            <Loader2 size={18} className="animate-spin" />
                        ) : (
                            <Save size={18} />
                        )}
                        <span>{isEditMode ? 'Update Article' : 'Publish Article'}</span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BlogForm;
