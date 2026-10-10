import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/api';
import {
    Plus, Trash2, Edit, FileText, Search, Loader2,
    Eye, Star, Globe, CheckCircle2, XCircle, ArrowUpRight,
    Sparkles, Filter, RefreshCw
} from 'lucide-react';

const Blogs = () => {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, published: 0, drafts: 0, totalViews: 0 });
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [actionLoadingId, setActionLoadingId] = useState(null);

    useEffect(() => {
        fetchBlogs();
    }, [selectedCategory, selectedStatus]);

    const fetchBlogs = async () => {
        try {
            setLoading(true);
            const params = {};
            if (search) params.search = search;
            if (selectedCategory && selectedCategory !== 'All') params.category = selectedCategory;
            if (selectedStatus !== 'All') params.status = selectedStatus.toLowerCase();

            const { data } = await api.get('/blogs/admin/all', { params });
            setBlogs(data.blogs || []);
            setStats(data.stats || { total: 0, published: 0, drafts: 0, totalViews: 0 });
            setCategories(data.categories || []);
            setLoading(false);
        } catch (err) {
            console.error('Failed to load admin blogs:', err);
            setLoading(false);
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchBlogs();
    };

    const togglePublishHandler = async (id) => {
        try {
            setActionLoadingId(id);
            const { data } = await api.patch(`/blogs/${id}/publish`);
            setBlogs(blogs.map((b) => (b._id === id ? { ...b, isPublished: data.isPublished } : b)));
            setStats((prev) => ({
                ...prev,
                published: data.isPublished ? prev.published + 1 : prev.published - 1,
                drafts: data.isPublished ? prev.drafts - 1 : prev.drafts + 1
            }));
            setActionLoadingId(null);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to toggle publish status');
            setActionLoadingId(null);
        }
    };

    const toggleFeatureHandler = async (id) => {
        try {
            setActionLoadingId(id);
            const { data } = await api.patch(`/blogs/${id}/feature`);
            setBlogs(blogs.map((b) => (b._id === id ? { ...b, isFeatured: data.isFeatured } : b)));
            setActionLoadingId(null);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to toggle featured status');
            setActionLoadingId(null);
        }
    };

    const deleteHandler = async (id, title) => {
        if (window.confirm(`Are you sure you want to delete the blog "${title}"? This cannot be undone.`)) {
            try {
                setActionLoadingId(id);
                await api.delete(`/blogs/${id}`);
                setBlogs(blogs.filter((b) => b._id !== id));
                setStats((prev) => ({ ...prev, total: prev.total - 1 }));
                setActionLoadingId(null);
            } catch (err) {
                alert(err.response?.data?.message || 'Failed to delete blog post');
                setActionLoadingId(null);
            }
        }
    };

    if (loading && blogs.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <Loader2 size={40} className="text-ayur-green animate-spin mb-4" />
                <p className="text-gray-400 font-medium">Gathering Ayurvedic health articles...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-serif font-bold text-ayur-green italic">Blog & Wellness Articles</h2>
                    <p className="text-gray-400 text-sm mt-1 font-medium">Manage authentic Ayurvedic articles, clinical insights, and patient guides</p>
                </div>
                <Link
                    to="/admin/blog/new"
                    className="px-6 py-3.5 bg-ayur-green text-white font-bold text-sm rounded-2xl shadow-lg shadow-ayur-green/20 hover:bg-ayur-olive transition-all flex items-center justify-center gap-2 self-start md:self-auto group"
                >
                    <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                    <span>Create New Post</span>
                </Link>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/30 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-ayur-green/10 text-ayur-green flex items-center justify-center">
                        <FileText size={24} />
                    </div>
                    <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Total Posts</span>
                        <span className="text-2xl font-serif font-bold text-gray-900">{stats.total}</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/30 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <CheckCircle2 size={24} />
                    </div>
                    <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Published</span>
                        <span className="text-2xl font-serif font-bold text-emerald-600">{stats.published}</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/30 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                        <XCircle size={24} />
                    </div>
                    <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Drafts</span>
                        <span className="text-2xl font-serif font-bold text-amber-600">{stats.drafts}</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/30 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-ayur-gold/10 text-ayur-gold flex items-center justify-center">
                        <Eye size={24} />
                    </div>
                    <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Total Views</span>
                        <span className="text-2xl font-serif font-bold text-ayur-gold">{stats.totalViews}</span>
                    </div>
                </div>
            </div>

            {/* Controls Bar: Search & Filters */}
            <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/30 flex flex-col md:flex-row gap-4 items-center justify-between">
                <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search title, excerpt, category..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-gray-50 border-none rounded-2xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-ayur-green/20 font-medium placeholder:text-gray-400 transition-all"
                    />
                </form>

                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100">
                        <Filter size={14} className="text-gray-400" />
                        <span className="text-xs font-bold text-gray-500">Category:</span>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="bg-transparent border-none text-xs font-bold text-ayur-green focus:ring-0 cursor-pointer"
                        >
                            <option value="All">All Categories</option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100">
                        <span className="text-xs font-bold text-gray-500">Status:</span>
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="bg-transparent border-none text-xs font-bold text-ayur-green focus:ring-0 cursor-pointer"
                        >
                            <option value="All">All Status</option>
                            <option value="published">Published</option>
                            <option value="draft">Drafts</option>
                            <option value="featured">Featured</option>
                        </select>
                    </div>

                    <button
                        onClick={fetchBlogs}
                        className="p-3 bg-gray-50 text-gray-500 hover:text-ayur-green rounded-2xl border border-gray-100 hover:bg-gray-100 transition-all"
                        title="Refresh List"
                    >
                        <RefreshCw size={16} />
                    </button>
                </div>
            </div>

            {/* Blog Table / Card List */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/40 overflow-hidden min-h-[400px]">
                <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <FileText className="text-ayur-green" size={22} />
                        <h3 className="text-xl font-serif font-bold text-gray-900 italic">Article Records</h3>
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4 py-1.5 bg-gray-50 rounded-full">
                        Showing {blogs.length} Articles
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#FAF9F6] border-b border-gray-100 text-gray-400 text-[10px] uppercase font-bold tracking-[0.2em]">
                                <th className="px-8 py-5">Article details</th>
                                <th className="px-6 py-5">Category & Author</th>
                                <th className="px-6 py-5">Views & Time</th>
                                <th className="px-6 py-5">Status</th>
                                <th className="px-8 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 font-medium">
                            {blogs.map((blog) => (
                                <tr key={blog._id} className="hover:bg-gray-50/60 transition-all group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4 max-w-md">
                                            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100 shadow-sm relative">
                                                <img
                                                    src={blog.coverImage || '/logo.png'}
                                                    alt={blog.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    onError={(e) => {
                                                        e.target.src = '/logo.png';
                                                    }}
                                                />
                                                {blog.isFeatured && (
                                                    <span className="absolute top-1 left-1 bg-ayur-gold text-white p-1 rounded-full shadow-md" title="Featured Post">
                                                        <Star size={10} fill="currentColor" />
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-sm font-bold text-gray-900 truncate group-hover:text-ayur-green transition-colors">
                                                    {blog.title}
                                                </span>
                                                <span className="text-[11px] text-gray-400 truncate mt-0.5 font-sans">
                                                    /{blog.slug}
                                                </span>
                                                <p className="text-xs text-gray-500 line-clamp-1 mt-1 font-normal">
                                                    {blog.excerpt}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-6">
                                        <div className="flex flex-col gap-1">
                                            <span className="inline-self-start px-3 py-1 bg-ayur-green/10 text-ayur-green text-[10px] font-bold rounded-full uppercase tracking-wider w-max">
                                                {blog.category || 'General'}
                                            </span>
                                            <span className="text-xs font-semibold text-gray-600 mt-1">
                                                {blog.author || 'Dr. Karan Singh Vaidh'}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="px-6 py-6">
                                        <div className="flex flex-col text-xs text-gray-500">
                                            <span className="flex items-center gap-1.5 font-bold text-gray-800">
                                                <Eye size={14} className="text-ayur-gold" />
                                                {blog.views || 0} views
                                            </span>
                                            <span className="mt-1 text-[11px] font-medium text-gray-400">
                                                {blog.readTime || '5 min read'}
                                            </span>
                                            <span className="text-[10px] text-gray-400 mt-0.5">
                                                {new Date(blog.createdAt).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="px-6 py-6">
                                        <div className="flex flex-col gap-2">
                                            <button
                                                onClick={() => togglePublishHandler(blog._id)}
                                                disabled={actionLoadingId === blog._id}
                                                className={`px-3 py-1.5 rounded-full text-[11px] font-bold flex items-center gap-1.5 w-max transition-all ${
                                                    blog.isPublished
                                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                                        : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                                                }`}
                                            >
                                                {blog.isPublished ? (
                                                    <>
                                                        <CheckCircle2 size={13} />
                                                        Published
                                                    </>
                                                ) : (
                                                    <>
                                                        <XCircle size={13} />
                                                        Draft
                                                    </>
                                                )}
                                            </button>

                                            <button
                                                onClick={() => toggleFeatureHandler(blog._id)}
                                                disabled={actionLoadingId === blog._id}
                                                className={`px-3 py-1.5 rounded-full text-[10px] font-bold flex items-center gap-1 w-max transition-all ${
                                                    blog.isFeatured
                                                        ? 'bg-ayur-gold text-white shadow-sm'
                                                        : 'bg-gray-100 text-gray-400 hover:text-ayur-gold hover:bg-gray-200'
                                                }`}
                                            >
                                                <Star size={12} fill={blog.isFeatured ? 'currentColor' : 'none'} />
                                                {blog.isFeatured ? 'Featured' : 'Mark Featured'}
                                            </button>
                                        </div>
                                    </td>

                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <a
                                                href={`/blog/${blog.slug}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="p-2.5 bg-gray-50 text-gray-400 hover:text-ayur-green rounded-xl border border-gray-100 hover:bg-white transition-all shadow-sm"
                                                title="Preview Live Page"
                                            >
                                                <ArrowUpRight size={16} />
                                            </a>

                                            <Link
                                                to={`/admin/blog/${blog._id}/edit`}
                                                className="p-2.5 bg-gray-50 text-gray-600 hover:text-ayur-green rounded-xl border border-gray-100 hover:bg-white transition-all shadow-sm"
                                                title="Edit Article"
                                            >
                                                <Edit size={16} />
                                            </Link>

                                            <button
                                                onClick={() => deleteHandler(blog._id, blog.title)}
                                                disabled={actionLoadingId === blog._id}
                                                className="p-2.5 bg-gray-50 text-gray-400 hover:text-red-500 rounded-xl border border-gray-100 hover:bg-white transition-all shadow-sm active:scale-95"
                                                title="Delete Article"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {blogs.length === 0 && (
                    <div className="p-20 text-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-300 mx-auto mb-4">
                            <FileText size={32} />
                        </div>
                        <h4 className="text-gray-900 font-bold">No blog posts match your criteria</h4>
                        <p className="text-gray-400 text-sm mt-1">Try resetting your search filters or write a new article.</p>
                        <Link
                            to="/admin/blog/new"
                            className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-ayur-green text-white font-bold text-xs rounded-xl shadow-md hover:bg-ayur-olive transition-all"
                        >
                            <Plus size={16} />
                            Create Blog Post
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Blogs;
