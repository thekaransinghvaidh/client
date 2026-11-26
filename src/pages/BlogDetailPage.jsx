import React, { useEffect, useState, useMemo, useRef } from 'react';
import SEO from '../components/seo/SEO';
import { useParams, Link } from 'react-router-dom';
import api from '../api/api';
import {
    Clock, Calendar, Eye, Share2, ArrowLeft,
    CheckCircle, MessageCircle, Facebook, Link as LinkIcon,
    Loader2, BookOpen, ChevronRight, ShoppingBag
} from 'lucide-react';

const slugifyHeading = (text = '') =>
    String(text)
        .toLowerCase()
        .replace(/<[^>]+>/g, '')
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');

function transformBlogContent(rawHtml = '') {
    if (!rawHtml) return { html: '', toc: [], disclaimer: '' };

    let cleaned = rawHtml
        .replace(/<\/p>\s*(?:<br\s*\/?>\s*)+/gi, '</p>\n')
        .replace(/<\/h([1-6])>\s*(?:<br\s*\/?>\s*)+/gi, '</h$1>\n')
        .replace(/(?:<br\s*\/?>\s*)+<h([1-6])/gi, '<h$1');

    let disclaimer = '';
    cleaned = cleaned.replace(
        /<p>\s*<strong>\s*Medical disclaimer:\s*<\/strong>([\s\S]*?)<\/p>/i,
        (_, text) => {
            disclaimer = text.trim();
            return '';
        }
    );

    cleaned = cleaned.replace(
        /(^|[^"'>])(https:\/\/thekaransinghvaidh\.com\/[^\s<"]+)/g,
        '$1<a href="$2">$2</a>'
    );

    const faqSplitRegex = /<h[23][^>]*>\s*Frequently Asked Questions\s*<\/h[23]>/i;
    if (faqSplitRegex.test(cleaned)) {
        const parts = cleaned.split(faqSplitRegex);
        const beforeFaq = parts[0];
        const faqRaw = parts.slice(1).join('');

        const qaRegex = /<p>\s*<strong>\s*(?:\d+\.\s*)?([\s\S]*?)<\/strong>\s*<\/p>\s*<p>([\s\S]*?)<\/p>/gi;
        const faqItems = [];
        let match;
        while ((match = qaRegex.exec(faqRaw)) !== null) {
            faqItems.push({
                q: match[1].replace(/<[^>]+>/g, '').trim(),
                a: match[2].trim()
            });
        }

        if (faqItems.length > 0) {
            const detailsHtml = faqItems
                .map(
                    (item, idx) => `
<details ${idx === 0 ? 'open' : ''} class="ksv-faq-item">
  <summary class="ksv-faq-summary">
    <span>${item.q}</span>
    <svg class="chev" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
  </summary>
  <div class="ksv-faq-body">
    <p>${item.a}</p>
  </div>
</details>`
                )
                .join('\n');

            cleaned = `${beforeFaq}\n<h2>Frequently Asked Questions</h2>\n<div class="faq-accordions">${detailsHtml}</div>`;
        }
    }

    cleaned = cleaned.replace(
        /(?:<p>\s*[•·]\s*[\s\S]*?<\/p>\s*)+/gi,
        (block) => {
            const items = [];
            const itemRe = /<p>\s*[•·]\s*([\s\S]*?)<\/p>/gi;
            let m;
            while ((m = itemRe.exec(block)) !== null) {
                items.push(`<li>${m[1].trim()}</li>`);
            }
            return items.length > 0 ? `<ul>\n${items.join('\n')}\n</ul>\n` : block;
        }
    );

    cleaned = cleaned.replace(
        /(?:<p>\s*\d+\.\s+[\s\S]*?<\/p>\s*){2,}/gi,
        (block) => {
            const items = [];
            const itemRe = /<p>\s*\d+\.\s+([\s\S]*?)<\/p>/gi;
            let m;
            while ((m = itemRe.exec(block)) !== null) {
                items.push(`<li>${m[1].trim()}</li>`);
            }
            return items.length > 0 ? `<ol>\n${items.join('\n')}\n</ol>\n` : block;
        }
    );

    cleaned = cleaned.replace(/<table(?![^>]*class=)/gi, '<table class="tbl"');

    const toc = [];
    let h2Index = 0;
    cleaned = cleaned.replace(/<h2([^>]*)>([\s\S]*?)<\/h2>/gi, (full, attrs, inner) => {
        const plainTitle = inner.replace(/<[^>]+>/g, '').trim();
        if (!plainTitle) return full;
        h2Index++;
        const idMatch = attrs.match(/id=["']([^"']+)["']/i);
        const id = idMatch ? idMatch[1] : `${slugifyHeading(plainTitle) || 'section'}-${h2Index}`;
        toc.push({ id, title: plainTitle });
        if (idMatch) return full;
        return `<h2 id="${id}"${attrs}>${inner}</h2>`;
    });

    return { html: cleaned, toc, disclaimer };
}

const BlogDetailPage = () => {
    const { slug } = useParams();

    const [blog, setBlog] = useState(null);
    const [relatedBlogs, setRelatedBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);
    const [activeSection, setActiveSection] = useState('');

    const layoutWrapRef = useRef(null);
    const asideTrackRef = useRef(null);
    const stickyBoxRef = useRef(null);
    const [stickyStyle, setStickyStyle] = useState({});

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
            try {
                const res = await fetch('/blogs-fallback.json');
                if (res.ok) {
                    const fallback = await res.json();
                    const found = (fallback.blogs || []).find((b) => b.slug === slug || String(b._id) === slug) || (fallback.blogs || [])[0];
                    if (found) {
                        setBlog(found);
                        setRelatedBlogs((fallback.blogs || []).filter((b) => b.slug !== found.slug));
                    }
                }
            } catch {}
            setLoading(false);
        }
    };

    const { html: processedHtml, toc, disclaimer } = useMemo(
        () => transformBlogContent(blog?.content || ''),
        [blog?.content]
    );

    useEffect(() => {
        const removeCustomHeadNodes = () => {
            document.head
                .querySelectorAll('[data-ksv-blog-schema="true"]')
                .forEach((node) => node.remove());
        };

        removeCustomHeadNodes();

        const rawSchema = blog?.customSchema ? String(blog.customSchema).trim() : '';
        if (!rawSchema) return removeCustomHeadNodes;

        if (rawSchema.startsWith('<')) {
            const temp = document.createElement('div');
            temp.innerHTML = rawSchema;
            Array.from(temp.children).forEach((child) => {
                const clone = document.createElement(child.tagName.toLowerCase());
                Array.from(child.attributes).forEach((attr) => {
                    clone.setAttribute(attr.name, attr.value);
                });
                clone.setAttribute('data-ksv-blog-schema', 'true');
                clone.textContent = child.textContent;
                document.head.appendChild(clone);
            });
        } else {
            const script = document.createElement('script');
            script.type = 'application/ld+json';
            script.setAttribute('data-ksv-blog-schema', 'true');
            script.textContent = rawSchema;
            document.head.appendChild(script);
        }

        return removeCustomHeadNodes;
    }, [blog?.customSchema, slug]);

    useEffect(() => {
        if (!toc || toc.length === 0) return;
        setActiveSection(toc[0].id);

        const handleScroll = () => {
            const scrollPosition = window.scrollY + 140;
            let currentId = toc[0].id;
            for (const item of toc) {
                const el = document.getElementById(item.id);
                if (el && el.offsetTop <= scrollPosition) {
                    currentId = item.id;
                }
            }
            setActiveSection(currentId);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [toc]);

    // Keep the "ON THIS PAGE" sidebar static/fixed on desktop while scrolling through the article
    useEffect(() => {
        const updateStickyPosition = () => {
            if (window.innerWidth <= 900) {
                setStickyStyle({});
                return;
            }
            const trackEl = asideTrackRef.current;
            const boxEl = stickyBoxRef.current;
            const wrapEl = layoutWrapRef.current;
            if (!trackEl || !boxEl || !wrapEl) return;

            const TOP_OFFSET = 96;
            const trackRect = trackEl.getBoundingClientRect();
            const wrapRect = wrapEl.getBoundingClientRect();
            const boxHeight = boxEl.offsetHeight;

            if (trackRect.top <= TOP_OFFSET) {
                const maxTop = wrapRect.bottom - boxHeight;
                const clampedTop = Math.min(TOP_OFFSET, maxTop);
                setStickyStyle({
                    position: 'fixed',
                    top: `${clampedTop}px`,
                    left: `${trackRect.left}px`,
                    width: `${trackRect.width}px`,
                    maxHeight: `calc(100vh - ${TOP_OFFSET + 20}px)`,
                    overflowY: 'auto',
                    zIndex: 20
                });
            } else {
                setStickyStyle({
                    position: 'static',
                    width: '100%'
                });
            }
        };

        updateStickyPosition();
        window.addEventListener('scroll', updateStickyPosition, { passive: true });
        window.addEventListener('resize', updateStickyPosition);
        return () => {
            window.removeEventListener('scroll', updateStickyPosition);
            window.removeEventListener('resize', updateStickyPosition);
        };
    }, [blog, toc.length, loading]);

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

    const leadSubtitle =
        blog.excerpt && blog.excerpt.trim().split(/\s+/).length > 4
            ? blog.excerpt
            : blog.metaDescription || '';

    return (
        <div className="min-h-screen bg-[#FDFBF7] font-sans selection:bg-ayur-green/10 selection:text-ayur-green pt-6 pb-20">
            <SEO
                title={`${blog.metaTitle || blog.title} | Dr. Karan Singh Vaidh`}
                description={blog.metaDescription || blog.excerpt}
                url={`/blog/${blog.slug || slug}`}
                exact={true}
            />

            <style>{`
                .ksv-article-prose h2 {
                    font-family: Georgia, Cambria, "Times New Roman", Times, serif;
                    font-size: 1.75rem;
                    line-height: 1.3;
                    color: #1E4D2B;
                    margin: 2.5rem 0 0.9rem;
                    font-weight: 700;
                    scroll-margin-top: 100px;
                }
                .ksv-article-prose h3 {
                    font-family: Georgia, Cambria, "Times New Roman", Times, serif;
                    font-size: 1.35rem;
                    line-height: 1.35;
                    color: #1E4D2B;
                    margin: 1.8rem 0 0.6rem;
                    font-weight: 700;
                }
                .ksv-article-prose p {
                    font-size: 1.0625rem;
                    line-height: 1.8;
                    margin: 0 0 1.15rem;
                    color: #374151;
                }
                .ksv-article-prose ul, .ksv-article-prose ol {
                    font-size: 1.0625rem;
                    line-height: 1.75;
                    margin: 0 0 1.35rem;
                    padding-left: 1.5rem;
                    color: #374151;
                }
                .ksv-article-prose ul { list-style-type: disc; }
                .ksv-article-prose ol { list-style-type: decimal; }
                .ksv-article-prose li { margin-bottom: 0.5rem; }
                .ksv-article-prose strong { color: #111827; font-weight: 700; }
                .ksv-article-prose a { color: #1E4D2B; text-decoration: underline; font-weight: 600; }
                .ksv-article-prose a:hover { color: #143d25; }
                .ksv-article-prose img {
                    max-width: 100%;
                    height: auto;
                    border-radius: 1rem;
                    margin: 1.5rem 0;
                    display: block;
                }
                .ksv-article-prose .ksv-blog-figure {
                    margin: 1.75rem 0;
                }
                .ksv-article-prose .ksv-blog-figure img {
                    margin: 0;
                    width: 100%;
                    max-height: 480px;
                    object-fit: cover;
                    border-radius: 1rem;
                    border: 1px solid #E5E7EB;
                }
                .ksv-article-prose .ksv-blog-figure figcaption {
                    font-size: 0.85rem;
                    color: #6B7280;
                    text-align: center;
                    margin-top: 0.5rem;
                    font-style: italic;
                }
                .ksv-article-prose .tbl {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 0.95rem;
                    line-height: 1.5;
                    margin: 1.5rem 0 2rem;
                    border-radius: 0.75rem;
                    overflow: hidden;
                    border: 1px solid #E5E7EB;
                }
                .ksv-article-prose .tbl th {
                    background: #1E4D2B;
                    color: #FFFFFF;
                    text-align: left;
                    padding: 12px 16px;
                    font-weight: 600;
                }
                .ksv-article-prose .tbl td {
                    padding: 12px 16px;
                    border-bottom: 1px solid #E5E7EB;
                    vertical-align: top;
                    background: #FFFFFF;
                }
                .ksv-article-prose .tbl tr:nth-child(even) td {
                    background: #F9FAFB;
                }
                .ksv-faq-item {
                    background: #FFFFFF;
                    border: 1px solid #E5E7EB;
                    border-radius: 1rem;
                    padding: 1rem 1.25rem;
                    margin-bottom: 0.75rem;
                }
                .ksv-faq-summary {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 1rem;
                    font-weight: 700;
                    font-size: 1.05rem;
                    color: #111827;
                    cursor: pointer;
                    list-style: none;
                }
                .ksv-faq-summary::-webkit-details-marker { display: none; }
                details[open] .chev { transform: rotate(180deg); }
                .ksv-faq-body {
                    margin-top: 0.75rem;
                    padding-top: 0.75rem;
                    border-top: 1px solid #F3F4F6;
                    font-size: 1rem;
                    line-height: 1.7;
                    color: #4B5563;
                }
                .ksv-faq-body p { margin: 0 !important; }
                .ksv-toc-link {
                    display: block;
                    padding: 8px 12px;
                    border-radius: 10px;
                    text-decoration: none !important;
                    color: #4B5563;
                    font-size: 14px;
                    line-height: 1.45;
                    transition: background 0.15s, color 0.15s;
                    margin-bottom: 4px;
                }
                .ksv-toc-link:hover {
                    background: #F3F4F6;
                    color: #1E4D2B;
                }
                .ksv-toc-link.active {
                    background: #E3EED5;
                    color: #1E4D2B;
                    font-weight: 700;
                }
                .ksv-side-track {
                    width: 300px;
                    flex-shrink: 0;
                    align-self: stretch;
                }
                .ksv-mtoc { display: none; }
                @media (max-width: 900px) {
                    .ksv-side-track { display: none; }
                    .ksv-mtoc { display: block; }
                }
            `}</style>

            {/* Breadcrumb Header */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
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
                        <span className="text-ayur-green truncate max-w-[220px] sm:max-w-[340px]">{blog.title}</span>
                    </div>
                </div>
            </div>

            {/* Two-Column Layout: Left Article + Right Static "ON THIS PAGE" Sidebar */}
            <div
                ref={layoutWrapRef}
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-start gap-8 lg:gap-12"
            >
                {/* Left Column: Main Article */}
                <article className="flex-1 min-w-0 space-y-8">
                    {/* Header Section */}
                    <header className="space-y-5">
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

                        {leadSubtitle && (
                            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                                {leadSubtitle}
                            </p>
                        )}

                        {/* Meta Bar */}
                        <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-gray-200/80 text-xs text-gray-600 font-medium">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-ayur-green text-white font-bold flex items-center justify-center shadow-md">
                                    KS
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-gray-900">{blog.author || 'Karan Singh Vaidh'}</span>
                                    <span className="text-[11px] text-gray-400">Ayurveda Acharya · Ayurvedic Practitioner, Solan</span>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-4 text-gray-500">
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

                    {/* Cover Image */}
                    {blog.coverImage && blog.coverImage !== '/logo.png' && (
                        <div className="rounded-3xl overflow-hidden shadow-xl aspect-video bg-gray-100 border border-gray-100 max-h-[440px]">
                            <img
                                src={blog.coverImage.startsWith('/uploads/') ? `https://server-pevq.onrender.com${blog.coverImage}` : blog.coverImage}
                                alt={blog.coverImageAlt || blog.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                }}
                            />
                        </div>
                    )}

                    {/* Mobile Collapsible Table of Contents (<= 900px) */}
                    {toc.length > 0 && (
                        <div className="ksv-mtoc">
                            <details className="bg-white border border-gray-200 rounded-2xl p-4 shadow-xs">
                                <summary className="flex items-center justify-between font-bold text-sm text-gray-900 cursor-pointer list-none">
                                    <span>ON THIS PAGE</span>
                                    <svg className="chev" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M6 9l6 6 6-6" />
                                    </svg>
                                </summary>
                                <nav aria-label="Mobile Table of Contents" className="mt-3 pt-3 border-t border-gray-100">
                                    {toc.map((item) => (
                                        <a key={item.id} href={`#${item.id}`} className="ksv-toc-link">
                                            {item.title}
                                        </a>
                                    ))}
                                </nav>
                            </details>
                        </div>
                    )}

                    {/* Short Excerpt / Clinical Takeaway Box */}
                    {(blog.metaDescription || blog.excerpt) && (
                        <div className="p-6 md:p-7 bg-white rounded-3xl border border-ayur-green/20 shadow-md shadow-ayur-green/5 text-gray-700 italic text-base leading-relaxed border-l-8 border-l-ayur-green">
                            "{blog.metaDescription || blog.excerpt}"
                        </div>
                    )}

                    {/* Main Rendered Content */}
                    <div
                        className="ksv-article-prose bg-white p-6 sm:p-10 rounded-3xl border border-gray-100 shadow-sm"
                        dangerouslySetInnerHTML={{ __html: processedHtml }}
                    />

                    {/* Additional Blog Images (if added in Blog Images Manager and not already in content HTML) */}
                    {Array.isArray(blog.images) &&
                        blog.images.filter((img) => img && img.url && !(blog.content || '').includes(img.url)).length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {blog.images
                                    .filter((img) => img && img.url && !(blog.content || '').includes(img.url))
                                    .map((img, idx) => (
                                        <figure
                                            key={idx}
                                            className="bg-white p-3 rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
                                        >
                                            <img
                                                src={img.url.startsWith('/uploads/') ? `https://server-pevq.onrender.com${img.url}` : img.url}
                                                alt={img.alt || blog.title}
                                                className="w-full h-64 object-cover rounded-2xl"
                                            />
                                            {img.caption && (
                                                <figcaption className="text-xs text-gray-500 text-center mt-2 italic">
                                                    {img.caption}
                                                </figcaption>
                                            )}
                                        </figure>
                                    ))}
                            </div>
                        )}

                    {/* Medical Disclaimer Box */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-5 text-xs sm:text-sm text-gray-600 leading-relaxed">
                        <strong className="text-gray-900">Medical Disclaimer: </strong>
                        {disclaimer ||
                            'This article gives general Ayurvedic educational information only. It does not replace personalised medical advice, diagnosis, or treatment. Consult a qualified healthcare professional before starting any herbal product.'}
                    </div>

                    {/* Social Share Bar */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
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
                                type="button"
                                onClick={handleCopyLink}
                                className="w-10 h-10 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center hover:bg-ayur-green hover:text-white transition-colors"
                                title="Copy Link"
                            >
                                {copied ? <CheckCircle size={18} className="text-emerald-500" /> : <LinkIcon size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* CTA Prescription Banner */}
                    <div className="bg-gradient-to-r from-ayur-green via-[#143d25] to-ayur-green p-8 sm:p-10 rounded-[2.5rem] text-white shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="space-y-2 text-center sm:text-left">
                            <h3 className="text-2xl font-serif font-bold italic !text-white" style={{ color: '#FFFFFF' }}>
                                Need Personalized Health Guidance?
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-200 font-light">
                                Book a direct video/telephonic consultation with Dr. Karan Singh Vaidh.
                            </p>
                        </div>

                        <div className="flex flex-wrap justify-center gap-3 flex-shrink-0">
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
                        <div className="pt-8 space-y-6">
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

                {/* Right Column: Static / Fixed "ON THIS PAGE" Table of Contents */}
                {toc.length > 0 && (
                    <aside ref={asideTrackRef} className="ksv-side-track">
                        <div
                            ref={stickyBoxRef}
                            style={stickyStyle}
                            className="bg-white border border-gray-200/90 rounded-2xl p-5 shadow-sm"
                        >
                            <div className="text-xs font-bold uppercase tracking-wider text-gray-500 px-3 pb-3 mb-3 border-b border-gray-200">
                                ON THIS PAGE
                            </div>
                            <nav aria-label="Table of Contents">
                                {toc.map((item) => (
                                    <a
                                        key={item.id}
                                        href={`#${item.id}`}
                                        className={`ksv-toc-link ${activeSection === item.id ? 'active' : ''}`}
                                        onClick={() => setActiveSection(item.id)}
                                    >
                                        {item.title}
                                    </a>
                                ))}
                            </nav>
                        </div>
                    </aside>
                )}
            </div>
        </div>
    );
};

export default BlogDetailPage;
