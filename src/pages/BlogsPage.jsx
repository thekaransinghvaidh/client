import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import { Clock, ArrowRight, BookOpen, Loader2 } from 'lucide-react';

const BlogsPage = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        // SEO Title & Meta
        document.title = 'Ayurvedic Health Blogs & Remedies | Dr. Karan Singh Vaidh';
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute(
                'content',
                'Read authentic Ayurvedic health blogs, herbal remedies for chronic care, asthma, high blood pressure, and kidney stones by Dr. Karan Singh Vaidh.'
            );
        }
    }, []);

    useEffect(() => {
        fetchBlogs();
    }, [page]);

    const fetchBlogs = async () => {
        try {
            setLoading(true);
            const params = {
                pageNumber: page,
                pageSize: 12
            };

            const { data } = await api.get('/blogs', { params });
            setBlogs(data.blogs || []);
            setTotalPages(data.pages || 1);
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch public blogs:', err);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7] font-sans selection:bg-ayur-green/10 selection:text-ayur-green pb-20">
            {/* Main Content Area - 4 Blogs Per Row */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-12">
                {loading ? (
                    <div className="min-h-[40vh] flex flex-col items-center justify-center">
                        <Loader2 size={36} className="text-ayur-green animate-spin mb-3" />
                        <p className="text-gray-400 font-medium text-sm">Loading articles...</p>
                    </div>
                ) : (
                    <>
                        {/* 4 COLUMNS GRID: 1 on mobile, 2 on tablet, 4 on desktop */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {blogs.map((blog) => (
                                <Link
                                    key={blog._id}
                                    to={`/blog/${blog.slug}`}
                                    className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden group cursor-pointer"
                                >
                                    <div>
                                        {/* Image Cover */}
                                        <div className="relative aspect-[16/10] bg-gray-100 overflow-hidden">
                                            <img
                                                src={blog.coverImage || '/logo.png'}
                                                alt={blog.title}
                                                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                                                onError={(e) => {
                                                    e.target.src = '/logo.png';
                                                }}
                                            />
                                            <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-ayur-green px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
                                                {blog.category || 'Ayurveda'}
                                            </span>
                                        </div>

                                        {/* Card Content */}
                                        <div className="p-5 space-y-2.5">
                                            {/* Meta Header */}
                                            <div className="flex items-center gap-2 text-[11px] font-medium text-gray-400">
                                                <span className="flex items-center gap-1">
                                                    <Clock size={11} className="text-ayur-green" />
                                                    {blog.readTime || '5 min read'}
                                                </span>
                                                <span>•</span>
                                                <span>
                                                    {new Date(blog.createdAt).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                            </div>

                                            {/* Blog Title */}
                                            <h3 className="text-base font-serif font-bold text-gray-900 group-hover:text-ayur-green transition-colors line-clamp-2 leading-snug">
                                                {blog.title}
                                            </h3>

                                            {/* Excerpt */}
                                            <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">
                                                {blog.excerpt}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Card Footer */}
                                    <div className="px-5 pb-5 pt-2 border-t border-gray-50 flex items-center justify-between mt-auto">
                                        <span className="text-[11px] font-bold text-gray-500 truncate max-w-[120px]">
                                            {blog.author || 'Dr. Karan Singh Vaidh'}
                                        </span>

                                        <span className="text-ayur-green font-bold text-xs flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                            <span>Read</span>
                                            <ArrowRight size={13} />
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Empty State */}
                        {blogs.length === 0 && (
                            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 p-8 max-w-lg mx-auto">
                                <BookOpen size={44} className="text-gray-300 mx-auto mb-3" />
                                <h3 className="text-lg font-bold text-gray-800">No Articles Found</h3>
                                <p className="text-gray-400 text-xs mt-1">
                                    Try searching with a different term or select another category above.
                                </p>
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2 pt-6">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                    <button
                                        key={p}
                                        onClick={() => setPage(p)}
                                        className={`w-9 h-9 rounded-xl font-bold text-xs transition-all ${
                                            page === p
                                                ? 'bg-ayur-green text-white shadow-md scale-105'
                                                : 'bg-white text-gray-600 border border-gray-200 hover:border-ayur-green'
                                        }`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        )}
                    </>
                )}

            </div>
        </div>
    );
};

export default BlogsPage;
