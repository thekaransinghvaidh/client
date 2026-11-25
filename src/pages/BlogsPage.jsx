import React, { useEffect, useState } from 'react';
import SEO from '../components/seo/SEO';
import { Link } from 'react-router-dom';
import api from '../api/api';
import { Clock, ArrowRight, BookOpen, Loader2, Calendar } from 'lucide-react';

const BlogsPage = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
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

    const getCleanExcerpt = (blog) => {
        if (blog.excerpt && blog.excerpt.trim().split(/\s+/).length > 4) {
            return blog.excerpt;
        }
        return (
            blog.metaDescription ||
            'A practical Ayurvedic guide by Karan Singh Vaidh explaining traditional principles, herbal ingredients, and safe daily care.'
        );
    };

    return (
        <div style={{ minHeight: '100vh', background: '#FBF7EE', color: '#2A2A24', fontFamily: 'Inter, system-ui, sans-serif', paddingBottom: 80 }}>
            <SEO
                title="Ayurvedic Health Blogs & Remedies | Dr. Karan Singh Vaidh"
                description="Read authentic Ayurvedic health blogs, herbal remedies for chronic care, asthma, high blood pressure, and kidney stones by Dr. Karan Singh Vaidh."
                url="/blogs"
                exact={true}
            />

            {/* Editorial Header Banner */}
            <div style={{ borderBottom: '1px solid #E6DECB', background: '#F5EFE1', padding: '44px 24px 40px' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                    <nav aria-label="Breadcrumb" style={{ fontSize: 14, color: '#5A5A50', display: 'flex', gap: 8, marginBottom: 16 }}>
                        <Link to="/" style={{ color: '#5A5A50', textDecoration: 'none' }}>Home</Link>
                        <span>/</span>
                        <span style={{ color: '#173A1D', fontWeight: 600 }}>Blogs</span>
                    </nav>
                    <span
                        style={{
                            display: 'inline-block',
                            background: '#E3EED5',
                            color: '#1E4D26',
                            fontSize: 12,
                            fontWeight: 700,
                            letterSpacing: 1,
                            textTransform: 'uppercase',
                            padding: '5px 14px',
                            borderRadius: 999,
                            marginBottom: 12
                        }}
                    >
                        Ayurvedic Knowledge Library
                    </span>
                    <h1
                        style={{
                            fontFamily: "'Playfair Display', Georgia, serif",
                            fontSize: 'clamp(32px, 4.5vw, 48px)',
                            lineHeight: 1.15,
                            color: '#173A1D',
                            margin: '0 0 12px',
                            fontWeight: 700
                        }}
                    >
                        Authentic Ayurvedic Health Guides &amp; Vaidh Insights
                    </h1>
                    <p style={{ fontSize: 18, lineHeight: 1.6, color: '#4A4A40', maxWidth: 740, margin: 0 }}>
                        Clinically reviewed articles on classical Ayurveda, herbal remedies, digestive &amp; respiratory care, and holistic lifestyle guidance by Karan Singh Vaidh.
                    </p>
                </div>
            </div>

            {/* Main Content Area */}
            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px 0' }}>
                {loading ? (
                    <div style={{ minHeight: '40vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <Loader2 size={36} className="animate-spin mb-3" style={{ color: '#1E4D26' }} />
                        <p style={{ color: '#5A5A50', fontWeight: 500, fontSize: 15 }}>Loading Ayurvedic articles...</p>
                    </div>
                ) : (
                    <>
                        {/* Featured Lead Blog Card (if only 1 blog or first blog) */}
                        {blogs.length > 0 && (
                            <div style={{ marginBottom: 40 }}>
                                <Link
                                    to={`/blog/${blogs[0].slug}`}
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                                        gap: 32,
                                        background: '#FFFFFF',
                                        border: '1px solid #E6DECB',
                                        borderRadius: 20,
                                        padding: 24,
                                        textDecoration: 'none',
                                        color: 'inherit',
                                        alignItems: 'center',
                                        boxShadow: '0 8px 24px rgba(23, 58, 29, 0.05)'
                                    }}
                                >
                                    <div style={{ aspectRatio: '16/10', borderRadius: 14, overflow: 'hidden', background: '#F5EFE1', border: '1px solid #E6DECB' }}>
                                        <img
                                            src={blogs[0].coverImage || '/logo.png'}
                                            alt={blogs[0].title}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                            onError={(e) => {
                                                e.target.src = '/logo.png';
                                            }}
                                        />
                                    </div>

                                    <div style={{ padding: '4px 8px' }}>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                                            <span
                                                style={{
                                                    background: '#E3EED5',
                                                    color: '#1E4D26',
                                                    fontSize: 12,
                                                    fontWeight: 700,
                                                    letterSpacing: 1,
                                                    textTransform: 'uppercase',
                                                    padding: '5px 12px',
                                                    borderRadius: 999
                                                }}
                                            >
                                                {blogs[0].category || 'Ayurveda Basics'}
                                            </span>
                                            <span style={{ fontSize: 13, color: '#5A5A50', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                                                <Clock size={14} style={{ color: '#1E4D26' }} />
                                                {blogs[0].readTime || '5 min read'}
                                            </span>
                                            <span style={{ fontSize: 13, color: '#5A5A50', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                                                <Calendar size={14} style={{ color: '#1E4D26' }} />
                                                {new Date(blogs[0].createdAt).toLocaleDateString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </span>
                                        </div>

                                        <h2
                                            style={{
                                                fontFamily: "'Playfair Display', Georgia, serif",
                                                fontSize: 'clamp(24px, 3vw, 34px)',
                                                lineHeight: 1.22,
                                                color: '#173A1D',
                                                margin: '0 0 14px',
                                                fontWeight: 700
                                            }}
                                        >
                                            {blogs[0].title}
                                        </h2>

                                        <p style={{ fontSize: 17, lineHeight: 1.65, color: '#4A4A40', margin: '0 0 22px' }}>
                                            {getCleanExcerpt(blogs[0])}
                                        </p>

                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                paddingTop: 16,
                                                borderTop: '1px solid #E6DECB'
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                <div
                                                    style={{
                                                        width: 38,
                                                        height: 38,
                                                        borderRadius: '50%',
                                                        background: '#1E4D26',
                                                        color: '#FFFFFF',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontFamily: "'Playfair Display', serif",
                                                        fontWeight: 700,
                                                        fontSize: 15
                                                    }}
                                                >
                                                    KS
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: 14, fontWeight: 700, color: '#173A1D' }}>
                                                        {blogs[0].author || 'Karan Singh Vaidh'}
                                                    </div>
                                                    <div style={{ fontSize: 12, color: '#5A5A50' }}>Ayurvedic Practitioner, Solan</div>
                                                </div>
                                            </div>

                                            <span
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: 6,
                                                    background: '#1E4D26',
                                                    color: '#FFFFFF',
                                                    padding: '10px 18px',
                                                    borderRadius: 999,
                                                    fontSize: 14,
                                                    fontWeight: 600
                                                }}
                                            >
                                                Read Full Guide
                                                <ArrowRight size={15} />
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        )}

                        {/* All Articles Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {blogs.map((blog) => (
                                <Link
                                    key={blog._id}
                                    to={`/blog/${blog.slug}`}
                                    style={{
                                        background: '#FFFFFF',
                                        borderRadius: 16,
                                        border: '1px solid #E6DECB',
                                        overflow: 'hidden',
                                        textDecoration: 'none',
                                        color: 'inherit',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                                    }}
                                    className="hover:-translate-y-1 hover:shadow-lg"
                                >
                                    <div>
                                        <div style={{ position: 'relative', aspectRatio: '16/10', background: '#F5EFE1', overflow: 'hidden' }}>
                                            <img
                                                src={blog.coverImage || '/logo.png'}
                                                alt={blog.title}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                onError={(e) => {
                                                    e.target.src = '/logo.png';
                                                }}
                                            />
                                            <span
                                                style={{
                                                    position: 'absolute',
                                                    top: 12,
                                                    left: 12,
                                                    background: '#E3EED5',
                                                    color: '#1E4D26',
                                                    padding: '4px 12px',
                                                    borderRadius: 999,
                                                    fontSize: 11,
                                                    fontWeight: 700,
                                                    textTransform: 'uppercase',
                                                    letterSpacing: 0.8
                                                }}
                                            >
                                                {blog.category || 'Ayurveda'}
                                            </span>
                                        </div>

                                        <div style={{ padding: 20 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#5A5A50', marginBottom: 10 }}>
                                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                                    <Clock size={12} style={{ color: '#1E4D26' }} />
                                                    {blog.readTime || '5 min read'}
                                                </span>
                                                <span>•</span>
                                                <span>
                                                    {new Date(blog.createdAt).toLocaleDateString('en-IN', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                            </div>

                                            <h3
                                                style={{
                                                    fontFamily: "'Playfair Display', Georgia, serif",
                                                    fontSize: 19,
                                                    fontWeight: 700,
                                                    color: '#173A1D',
                                                    lineHeight: 1.35,
                                                    margin: '0 0 10px'
                                                }}
                                                className="line-clamp-2"
                                            >
                                                {blog.title}
                                            </h3>

                                            <p style={{ fontSize: 14, lineHeight: 1.6, color: '#4A4A40', margin: 0 }} className="line-clamp-3">
                                                {getCleanExcerpt(blog)}
                                            </p>
                                        </div>
                                    </div>

                                    <div
                                        style={{
                                            padding: '14px 20px',
                                            borderTop: '1px solid #F0E9D8',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            background: '#FDFBF7'
                                        }}
                                    >
                                        <span style={{ fontSize: 12, fontWeight: 700, color: '#5A5A50' }}>
                                            {blog.author || 'Karan Singh Vaidh'}
                                        </span>
                                        <span style={{ fontSize: 13, fontWeight: 700, color: '#1E4D26', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                            Read Guide
                                            <ArrowRight size={13} />
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {blogs.length === 0 && (
                            <div style={{ textAlign: 'center', padding: 64, background: '#FFFFFF', borderRadius: 20, border: '1px solid #E6DECB', maxWidth: 520, margin: '0 auto' }}>
                                <BookOpen size={44} style={{ color: '#C5BBA3', margin: '0 auto 12px' }} />
                                <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, fontWeight: 700, color: '#173A1D', margin: '0 0 8px' }}>
                                    No Articles Found
                                </h3>
                                <p style={{ color: '#5A5A50', fontSize: 14, margin: 0 }}>
                                    New Ayurvedic health guides are being prepared by our clinical team.
                                </p>
                            </div>
                        )}

                        {totalPages > 1 && (
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, paddingTop: 32 }}>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                    <button
                                        key={p}
                                        onClick={() => setPage(p)}
                                        style={{
                                            width: 38,
                                            height: 38,
                                            borderRadius: 10,
                                            fontWeight: 700,
                                            fontSize: 13,
                                            cursor: 'pointer',
                                            background: page === p ? '#1E4D26' : '#FFFFFF',
                                            color: page === p ? '#FFFFFF' : '#2A2A24',
                                            border: '1px solid #E6DECB'
                                        }}
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
