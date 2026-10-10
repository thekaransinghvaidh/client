import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/api';
import {
    Clock, Calendar, User, Eye, Share2, ArrowLeft,
    CheckCircle, MessageCircle, Facebook, Twitter, Link as LinkIcon,
    Loader2, Sparkles, BookOpen, ChevronRight, ShoppingBag
} from 'lucide-react';

const BlogDetailPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();

    const [blog, setBlog] = useState(null);
    const [relatedBlogs, setRelatedBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (slug) {
            fetchBlogDetail();
        }
    }, [slug]);

    const fetchBlogDetail = async () => {
        try {
            setLoading(true);
            const { data } = await api.get(`/blogs/${slug}?inc=1`);
            setBlog(data.blog);
            setRelatedBlogs(data.relatedBlogs || []);

            // Set Meta & Title
            if (data.blog) {
                document.title = `${data.blog.metaTitle || data.blog.title} | Dr. Karan Singh Vaidh`;
                const metaDesc = document.querySelector('meta[name="description"]');
                if (metaDesc) {
                    metaDesc.setAttribute('content', data.blog.metaDescription || data.blog.excerpt);
                }
            }

            setLoading(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            console.error('Failed to fetch blog post:', err);
            setLoading(false);
        }
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    if (loading) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#FDFBF7]">
                <Loader2 size={40} className="text-ayur-green animate-spin mb-4" />
                <p className="text-gray-400 font-medium">Loading clinical article...</p>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#FDFBF7] text-center px-4">
                <BookOpen size={48} className="text-gray-300 mb-4" />
                <h2 className="text-2xl font-bold text-gray-800">Blog Article Not Found</h2>
                <p className="text-gray-500 text-sm mt-1 max-w-md">
                    The health article you are looking for may have been updated or moved.
                </p>
                <Link
                    to="/blogs"
                    className="mt-6 px-6 py-3 bg-ayur-green text-white font-bold text-xs rounded-xl shadow-md hover:bg-ayur-olive transition-colors"
                >
                    Back to All Articles
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDFBF7] font-sans selection:bg-ayur-green/10 selection:text-ayur-green pt-4 pb-20">
            {/* Breadcrumb Header */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
                <div className="flex items-center justify-between">
                    <Link
                        to="/blogs"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-ayur-green hover:underline bg-white px-3.5 py-1.5 rounded-full border border-gray-200 shadow-xs"
                    >
                        <ArrowLeft size={13} />
                        <span>All Articles</span>
                    </Link>

                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
                        <Link to="/" className="hover:text-ayur-green">Home</Link>
                        <ChevronRight size={12} />
                        <Link to="/blogs" className="hover:text-ayur-green">Blogs</Link>
                        <ChevronRight size={12} />
                        <span className="text-ayur-green truncate max-w-[180px]">{blog.title}</span>
                    </div>
                </div>
            </div>

            {/* Article Container */}
            <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
                {/* Header Section */}
                <header className="space-y-6">
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="px-4 py-1.5 bg-ayur-green/10 text-ayur-green text-xs font-bold rounded-full uppercase tracking-wider">
                            {blog.category || 'Ayurveda'}
                        </span>
                        {blog.isFeatured && (
                            <span className="px-4 py-1.5 bg-ayur-gold text-white text-xs font-bold rounded-full uppercase tracking-wider shadow-sm">
                                Featured Insights
                            </span>
                        )}
                    </div>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-gray-900 leading-tight">
                        {blog.title}
                    </h1>

                    {/* Meta Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-gray-200/80 text-xs text-gray-600 font-medium">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-ayur-green text-white font-bold flex items-center justify-center shadow-md">
                                V
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-gray-900">{blog.author || 'Dr. Karan Singh Vaidh'}</span>
                                <span className="text-[10px] text-gray-400">Ayurvedic Physician</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 text-gray-500">
                            <span className="flex items-center gap-1.5">
                                <Calendar size={14} className="text-ayur-green" />
                                {new Date(blog.createdAt).toLocaleDateString('en-US', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1.5">
                                <Clock size={14} className="text-ayur-green" />
                                {blog.readTime || '5 min read'}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1.5">
                                <Eye size={14} className="text-ayur-gold" />
                                {blog.views || 1} reads
                            </span>
                        </div>
                    </div>
                </header>

                {/* Cover Image (Only show real image, skip oversized placeholder logo) */}
                {blog.coverImage && blog.coverImage !== '/logo.png' && (
                    <div className="rounded-3xl overflow-hidden shadow-xl aspect-video bg-gray-100 border border-gray-100 max-h-[440px]">
                        <img
                            src={blog.coverImage}
                            alt={blog.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.style.display = 'none';
                            }}
                        />
                    </div>
                )}

                {/* Short Excerpt Box */}
                {blog.excerpt && (
                    <div className="p-6 md:p-8 bg-white rounded-3xl border border-ayur-green/20 shadow-md shadow-ayur-green/5 text-gray-700 italic text-base leading-relaxed border-l-8 border-l-ayur-green">
                        "{blog.excerpt}"
                    </div>
                )}

                {/* Main Rendered Content */}
                <div
                    className="prose prose-lg max-w-none text-gray-800 leading-relaxed font-sans space-y-6 prose-headings:font-serif prose-headings:text-ayur-green prose-a:text-ayur-green prose-a:underline hover:prose-a:text-ayur-olive"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                />

                {/* Social Share Bar */}
                <div className="pt-8 border-t border-gray-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <span className="text-xs font-bold text-gray-700 uppercase tracking-widest flex items-center gap-2">
                        <Share2 size={16} className="text-ayur-green" />
                        Share this article:
                    </span>

                    <div className="flex items-center gap-3">
                        <a
                            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(blog.title + ' ' + window.location.href)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-colors"
                            title="Share on WhatsApp"
                        >
                            <MessageCircle size={18} />
                        </a>

                        <a
                            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors"
                            title="Share on Facebook"
                        >
                            <Facebook size={18} />
                        </a>

                        <button
                            onClick={handleCopyLink}
                            className="w-10 h-10 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center hover:bg-ayur-green hover:text-white transition-colors"
                            title="Copy Link"
                        >
                            {copied ? <CheckCircle size={18} className="text-emerald-500" /> : <LinkIcon size={18} />}
                        </button>
                    </div>
                </div>

                {/* Author Bio Box */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/30 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                    <div className="w-20 h-20 rounded-full bg-ayur-green text-white font-serif font-bold text-3xl flex items-center justify-center shadow-xl shadow-ayur-green/20 flex-shrink-0">
                        V
                    </div>
                    <div className="space-y-2">
                        <h4 className="text-lg font-serif font-bold text-gray-900">
                            {blog.author || 'Dr. Karan Singh Vaidh'}
                        </h4>
                        <p className="text-xs text-ayur-gold font-bold uppercase tracking-wider">
                            Master Ayurvedic Physician • 23+ Years Clinical Experience
                        </p>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            Specialized in chronic lifestyle disorder management, respiratory care, metabolic health, and authentic rasayana formulations in Solan, Himachal Pradesh.
                        </p>
                    </div>
                </div>

                {/* CTA Prescription Banner */}
                <div className="bg-gradient-to-r from-ayur-green via-[#143d25] to-ayur-green p-8 sm:p-12 rounded-[2.5rem] text-white shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="space-y-2 text-center sm:text-left">
                        <h3 className="text-2xl font-serif font-bold italic">Need Personalized Health Guidance?</h3>
                        <p className="text-xs sm:text-sm text-gray-200 font-light">
                            Book a direct video/telephonic consultation with Dr. Karan Singh Vaidh.
                        </p>
                    </div>

                    <div className="flex gap-3 flex-shrink-0">
                        <Link
                            to="/book-appointment"
                            className="px-6 py-3.5 bg-ayur-gold text-ayur-green font-bold text-xs rounded-xl hover:bg-yellow-400 transition-colors shadow-md"
                        >
                            Book Appointment
                        </Link>
                        <Link
                            to="/ayurvedic-products"
                            className="px-6 py-3.5 bg-white/10 text-white font-bold text-xs rounded-xl border border-white/20 hover:bg-white/20 transition-colors flex items-center gap-1.5"
                        >
                            <ShoppingBag size={14} />
                            Shop Medicine
                        </Link>
                    </div>
                </div>

                {/* Related Blogs Grid */}
                {relatedBlogs.length > 0 && (
                    <div className="pt-12 space-y-8">
                        <h3 className="text-2xl font-serif font-bold text-gray-900 italic border-b border-gray-200 pb-4">
                            Related Articles in {blog.category}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {relatedBlogs.map((rel) => (
                                <Link
                                    key={rel._id}
                                    to={`/blog/${rel.slug}`}
                                    className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all group space-y-3"
                                >
                                    <div className="aspect-video rounded-xl bg-gray-100 overflow-hidden">
                                        <img
                                            src={rel.coverImage || '/logo.png'}
                                            alt={rel.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            onError={(e) => (e.target.src = '/logo.png')}
                                        />
                                    </div>
                                    <span className="text-[10px] font-bold text-ayur-green uppercase tracking-wider block">
                                        {rel.category}
                                    </span>
                                    <h4 className="text-sm font-bold text-gray-900 group-hover:text-ayur-green transition-colors line-clamp-2">
                                        {rel.title}
                                    </h4>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </article>
        </div>
    );
};

export default BlogDetailPage;
