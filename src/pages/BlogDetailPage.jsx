import React, { useEffect, useState, useMemo } from 'react';
import SEO from '../components/seo/SEO';
import { useParams, Link } from 'react-router-dom';
import api from '../api/api';
import {
    CheckCircle, MessageCircle, Facebook, Link as LinkIcon,
    Loader2, BookOpen, ShoppingBag
} from 'lucide-react';

const slugifyHeading = (text = '') =>
    String(text)
        .toLowerCase()
        .replace(/<[^>]+>/g, '')
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');

/**
 * Enhances raw blog HTML from database into rich editorial HTML:
 * 1. Removes redundant <br> tags between block elements
 * 2. Converts <p>• ...</p> into semantic <ul><li>...</li></ul>
 * 3. Converts <p>1. ...</p> step paragraphs into semantic <ol><li>...</li></ol>
 * 4. Converts numbered FAQ paragraphs under "Frequently Asked Questions" into <details> accordions
 * 5. Adds anchor IDs to all <h2> headings and returns extracted Table of Contents items
 */
function transformBlogContent(rawHtml = '') {
    if (!rawHtml) return { html: '', toc: [], disclaimer: '', quickSummary: '' };

    // 1. Clean excessive <br> between block elements
    let cleaned = rawHtml
        .replace(/<\/p>\s*(?:<br\s*\/?>\s*)+/gi, '</p>\n')
        .replace(/<\/h([1-6])>\s*(?:<br\s*\/?>\s*)+/gi, '</h$1>\n')
        .replace(/(?:<br\s*\/?>\s*)+<h([1-6])/gi, '<h$1');

    // 2. Extract Medical Disclaimer paragraph if present
    let disclaimer = '';
    cleaned = cleaned.replace(
        /<p>\s*<strong>\s*Medical disclaimer:\s*<\/strong>([\s\S]*?)<\/p>/i,
        (_, text) => {
            disclaimer = text.trim();
            return '';
        }
    );

    // 3. Auto-link bare https://thekaransinghvaidh.com/... URLs that aren't already inside href="" or <a>
    cleaned = cleaned.replace(
        /(^|[^"'>])(https:\/\/thekaransinghvaidh\.com\/[^\s<"]+)/g,
        '$1<a href="$2">$2</a>'
    );

    // 4. Split out Frequently Asked Questions section if written as <p><strong>1. ...</strong></p><p>...</p>
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
<details ${idx === 0 ? 'open' : ''} style="background:#FFFFFF;border:1px solid #E6DECB;border-radius:14px;padding:18px 22px;margin-bottom:14px;">
  <summary style="display:flex;align-items:center;justify-content:space-between;gap:16px;font-weight:700;font-size:18px;color:#173A1D;line-height:1.4;">
    <span>${item.q}</span>
    <svg class="chev" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1E4D26" stroke-width="2.2" style="flex-shrink:0;transition:transform 0.2s ease;"><path d="M6 9l6 6 6-6"/></svg>
  </summary>
  <div style="margin-top:12px;padding-top:12px;border-top:1px solid #F0E9D8;font-size:17px;line-height:1.75;color:#3B3B33;">
    <p style="margin:0;">${item.a}</p>
  </div>
</details>`
                )
                .join('\n');

            cleaned = `${beforeFaq}\n<h2>Frequently Asked Questions</h2>\n<div class="faq-accordions">${detailsHtml}</div>`;
        }
    }

    // 5. Convert consecutive <p>• ...</p> into <ul><li>...</li></ul>
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

    // 6. Convert consecutive <p>1. ...</p> into <ol><li>...</li></ol>
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

    // 7. Ensure any <table> has class="tbl"
    cleaned = cleaned.replace(/<table(?![^>]*class=)/gi, '<table class="tbl"');

    // 8. Extract TOC from <h2> headings and add id attributes
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
    const [isHindi, setIsHindi] = useState(false);

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
            console.error('Failed to fetch blog post:', err);
            setLoading(false);
        }
    };

    const { html: processedHtml, toc, disclaimer } = useMemo(
        () => transformBlogContent(blog?.content || ''),
        [blog?.content]
    );

    // Scroll-spy for Table of Contents
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

    // Trigger browser translation or Hindi view when "हिंदी में पढ़ें" is clicked
    const handleLanguageToggle = (e) => {
        e.preventDefault();
        const nextHindi = !isHindi;
        setIsHindi(nextHindi);
        if (nextHindi) {
            const currentUrl = window.location.href;
            if (!currentUrl.includes('localhost') && !currentUrl.includes('127.0.0.1')) {
                window.open(
                    `https://translate.google.com/translate?sl=en&tl=hi&u=${encodeURIComponent(currentUrl)}`,
                    '_blank',
                    'noopener,noreferrer'
                );
            }
        }
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    if (loading) {
        return (
            <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#FBF7EE' }}>
                <Loader2 size={40} className="animate-spin mb-4" style={{ color: '#1E4D26' }} />
                <p style={{ color: '#5A5A50', fontWeight: 500 }}>Loading Ayurvedic clinical guide...</p>
            </div>
        );
    }

    if (!blog) {
        return (
            <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#FBF7EE', textAlign: 'center', padding: '0 16px' }}>
                <BookOpen size={48} style={{ color: '#C5BBA3', marginBottom: 16 }} />
                <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 28, fontWeight: 700, color: '#173A1D', margin: '0 0 8px' }}>
                    Blog Article Not Found
                </h2>
                <p style={{ color: '#5A5A50', fontSize: 16, maxWidth: 440, margin: '0 0 24px' }}>
                    The health article you are looking for may have been updated or moved.
                </p>
                <Link
                    to="/blogs"
                    style={{ background: '#1E4D26', color: '#FFFFFF', textDecoration: 'none', padding: '12px 24px', borderRadius: 999, fontWeight: 600, fontSize: 15 }}
                >
                    Back to All Articles
                </Link>
            </div>
        );
    }

    const publishedDate = blog.createdAt
        ? new Date(blog.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
        : 'Oct 2026';

    const reviewedDate = blog.updatedAt
        ? new Date(blog.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
        : publishedDate;

    // Pick a meaningful lead subtitle (if excerpt is just 1-2 words like "Constipation", use metaDescription)
    const leadSubtitle =
        blog.excerpt && blog.excerpt.trim().split(/\s+/).length > 4
            ? blog.excerpt
            : blog.metaDescription ||
              'A practising vaidh explains authentic Ayurvedic principles, safe herbal selection, and holistic care for lasting wellness.';

    return (
        <div style={{ width: '100%', background: '#FBF7EE', color: '#2A2A24', fontFamily: 'Inter, system-ui, sans-serif', paddingBottom: 80 }}>
            <SEO
                title={`${blog.metaTitle || blog.title} | Dr. Karan Singh Vaidh`}
                description={blog.metaDescription || blog.excerpt}
                url={`/blog/${blog.slug || slug}`}
                exact={true}
            />

            {/* Scoped Editorial Styles Matching User's HTML Design */}
            <style>{`
                .ksv-blog-wrap a { color: #1E5A2B; }
                .ksv-blog-wrap a:hover { color: #123B1B; }
                .ksv-prose h2 {
                    font-family: 'Playfair Display', Georgia, serif;
                    font-size: 32px;
                    line-height: 1.25;
                    color: #173A1D;
                    margin: 56px 0 16px;
                    font-weight: 700;
                    scroll-margin-top: 100px;
                }
                .ksv-prose h3 {
                    font-family: 'Playfair Display', Georgia, serif;
                    font-size: 23px;
                    line-height: 1.3;
                    color: #173A1D;
                    margin: 36px 0 10px;
                    font-weight: 600;
                }
                .ksv-prose p {
                    font-size: 18px;
                    line-height: 1.75;
                    margin: 0 0 18px;
                    color: #2A2A24;
                }
                .ksv-prose ul, .ksv-prose ol {
                    font-size: 18px;
                    line-height: 1.7;
                    margin: 0 0 22px;
                    padding-left: 24px;
                    color: #2A2A24;
                }
                .ksv-prose ul { list-style-type: disc; }
                .ksv-prose ol { list-style-type: decimal; }
                .ksv-prose li { margin-bottom: 10px; }
                .ksv-prose strong { color: #173A1D; font-weight: 700; }
                .ksv-prose a { color: #1E5A2B; text-decoration: underline; font-weight: 600; }
                .ksv-prose a:hover { color: #123B1B; }
                .ksv-prose .tbl {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 16px;
                    line-height: 1.5;
                    margin: 24px 0 32px;
                    border-radius: 12px;
                    overflow: hidden;
                    border: 1px solid #E6DECB;
                }
                .ksv-prose .tbl th {
                    background: #1E4D26;
                    color: #FFFFFF;
                    text-align: left;
                    padding: 12px 16px;
                    font-weight: 600;
                }
                .ksv-prose .tbl td {
                    padding: 12px 16px;
                    border-bottom: 1px solid #E6DECB;
                    vertical-align: top;
                    background: #FFFFFF;
                }
                .ksv-prose .tbl tr:nth-child(even) td {
                    background: #F5EFE1;
                }
                .ksv-toc a {
                    display: block;
                    padding: 8px 12px;
                    border-radius: 8px;
                    text-decoration: none !important;
                    color: #3B3B33;
                    font-size: 15px;
                    line-height: 1.4;
                    transition: background 0.15s, color 0.15s;
                    margin-bottom: 4px;
                }
                .ksv-toc a:hover {
                    background: #EDE5D2;
                    color: #173A1D;
                }
                .ksv-toc a.active {
                    background: #E3EED5;
                    color: #173A1D;
                    font-weight: 700;
                }
                .ksv-blog-wrap details summary {
                    cursor: pointer;
                    list-style: none;
                }
                .ksv-blog-wrap details summary::-webkit-details-marker {
                    display: none;
                }
                .ksv-blog-wrap details[open] .chev {
                    transform: rotate(180deg);
                }
                .ksv-side {
                    flex: 1 1 260px;
                    max-width: 300px;
                    position: sticky;
                    top: 96px;
                    align-self: flex-start;
                }
                .ksv-mtoc {
                    display: none;
                }
                @media (max-width: 900px) {
                    .ksv-side { display: none; }
                    .ksv-mtoc { display: block; }
                }
                @media (max-width: 720px) {
                    .ksv-prose h2 { font-size: 26px; margin-top: 40px; }
                    .ksv-prose h3 { font-size: 20px; }
                    .ksv-prose p, .ksv-prose ul, .ksv-prose ol { font-size: 17px; }
                    .ksv-h1 { font-size: 34px !important; }
                }
                @media (max-width: 640px) {
                    .ksv-prose .g4 { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
                    .ksv-prose .g3, .ksv-prose .g2 { grid-template-columns: minmax(0, 1fr) !important; }
                    .ksv-prose .tbl thead { display: none; }
                    .ksv-prose .tbl, .ksv-prose .tbl tbody, .ksv-prose .tbl tr, .ksv-prose .tbl td { display: block; width: 100%; }
                    .ksv-prose .tbl tr { padding: 14px 16px; border-bottom: 1px solid #E6DECB; }
                    .ksv-prose .tbl tr:nth-child(even) td { background: transparent; }
                    .ksv-prose .tbl td { border: 0; padding: 3px 0; background: transparent; }
                    .ksv-prose .tbl td[data-label]:not([data-label=""])::before {
                        content: attr(data-label) ": ";
                        font-weight: 600;
                        color: #5A5A50;
                    }
                    .ksv-prose .tbl td:first-child {
                        font-weight: 700;
                        color: #173A1D;
                        font-size: 17px;
                        padding-bottom: 6px;
                    }
                    .ksv-prose .tbl td:first-child::before { content: none !important; }
                    .ksv-qa { padding: 20px !important; }
                    .ksv-qa p { font-size: 17px !important; }
                }
                @media (max-width: 420px) {
                    .ksv-g2b { grid-template-columns: minmax(0, 1fr) !important; }
                }
            `}</style>

            <div id="top"></div>

            {/* Main Two-Column Editorial Container */}
            <div
                className="ksv-blog-wrap"
                style={{
                    maxWidth: 1200,
                    margin: '0 auto',
                    padding: '32px 24px 0',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '24px 48px',
                    alignItems: 'flex-start'
                }}
            >
                {/* Breadcrumb Row */}
                <div style={{ flex: '0 0 100%' }}>
                    <nav
                        aria-label="Breadcrumb"
                        style={{ fontSize: 14, color: '#5A5A50', display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}
                    >
                        <Link to="/" style={{ color: '#5A5A50', textDecoration: 'none' }}>Home</Link>
                        <span aria-hidden="true">/</span>
                        <Link to="/blogs" style={{ color: '#5A5A50', textDecoration: 'none' }}>Blogs</Link>
                        <span aria-hidden="true">/</span>
                        <span style={{ color: '#2A2A24', fontWeight: 500 }}>{blog.title}</span>
                    </nav>
                </div>

                {/* Left Column: Main Article */}
                <article className="ksv-prose" style={{ flex: '999 1 560px', minWidth: 0, maxWidth: 760 }}>
                    {/* Article Header */}
                    <header style={{ margin: '0 0 32px' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', justifyContent: 'space-between', marginTop: 0 }}>
                            <span
                                style={{
                                    background: '#E3EED5',
                                    color: '#1E4D26',
                                    fontSize: 13,
                                    fontWeight: 600,
                                    letterSpacing: 1,
                                    textTransform: 'uppercase',
                                    padding: '6px 14px',
                                    borderRadius: 999
                                }}
                            >
                                {blog.category || 'Ayurveda Basics'}
                            </span>

                            <button
                                type="button"
                                onClick={handleLanguageToggle}
                                lang="hi"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 8,
                                    border: '1.5px solid #1E4D26',
                                    background: isHindi ? '#1E4D26' : 'transparent',
                                    color: isHindi ? '#FFFFFF' : '#1E4D26',
                                    cursor: 'pointer',
                                    padding: '8px 16px',
                                    borderRadius: 999,
                                    fontWeight: 600,
                                    fontSize: 15,
                                    minHeight: 42,
                                    transition: 'all 0.2s'
                                }}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                    <path d="M3 5h12M9 3v2m1.5 0C9.5 11 6 15 3 17m4-6c1.5 3 4 5 6 6m3-8l5 12m-8 0l3-7 3 7m-5-2h4" />
                                </svg>
                                {isHindi ? 'Read in English' : 'हिंदी में पढ़ें'}
                            </button>
                        </div>

                        <h1
                            className="ksv-h1"
                            style={{
                                fontFamily: "'Playfair Display', Georgia, serif",
                                fontSize: 48,
                                lineHeight: 1.14,
                                color: '#173A1D',
                                margin: '20px 0 16px',
                                fontWeight: 700
                            }}
                        >
                            {blog.title}
                        </h1>

                        <p style={{ fontSize: 20, lineHeight: 1.6, color: '#4A4A40', margin: '0 0 28px', maxWidth: 760 }}>
                            {leadSubtitle}
                        </p>

                        {/* Author & Clinical Verification Bar */}
                        <div
                            style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                alignItems: 'center',
                                gap: '16px 28px',
                                padding: '18px 0',
                                borderTop: '1px solid #E1D8C3',
                                borderBottom: '1px solid #E1D8C3'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div
                                    style={{
                                        width: 52,
                                        height: 52,
                                        borderRadius: '50%',
                                        background: '#1E4D26',
                                        color: '#FFFFFF',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontFamily: "'Playfair Display', serif",
                                        fontSize: 22,
                                        fontWeight: 700,
                                        flexShrink: 0
                                    }}
                                >
                                    KS
                                </div>
                                <div style={{ lineHeight: 1.35 }}>
                                    <div style={{ fontSize: 13, color: '#5A5A50' }}>Written by</div>
                                    <a href="#author" style={{ fontWeight: 700, color: '#173A1D', textDecoration: 'none', fontSize: 16 }}>
                                        {blog.author || 'Karan Singh Vaidh'}
                                    </a>
                                    <div style={{ fontSize: 13, color: '#5A5A50' }}>Ayurveda Acharya · Ayurvedic practitioner, Solan</div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, fontSize: 14, color: '#4A4A40' }}>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1E4D26" strokeWidth="2" aria-hidden="true">
                                        <path d="M9 12l2 2 4-4" />
                                        <circle cx="12" cy="12" r="9" />
                                    </svg>
                                    Medically reviewed: {reviewedDate}
                                </span>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1E4D26" strokeWidth="2" aria-hidden="true">
                                        <rect x="3" y="5" width="18" height="16" rx="2" />
                                        <path d="M3 10h18M8 3v4M16 3v4" />
                                    </svg>
                                    Published: {publishedDate}
                                </span>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1E4D26" strokeWidth="2" aria-hidden="true">
                                        <circle cx="12" cy="12" r="9" />
                                        <path d="M12 7v5l3 2" />
                                    </svg>
                                    {blog.readTime || '5 min read'}
                                </span>
                            </div>
                        </div>
                    </header>

                    {/* Hero Cover Figure */}
                    {blog.coverImage && blog.coverImage !== '/logo.png' && (
                        <figure style={{ margin: '0 0 32px' }}>
                            <img
                                width="1200"
                                height="628"
                                src={blog.coverImage}
                                alt={blog.title}
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    maxHeight: 460,
                                    objectFit: 'cover',
                                    borderRadius: 16,
                                    border: '1px solid #E6DECB',
                                    display: 'block'
                                }}
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                }}
                            />
                        </figure>
                    )}

                    {/* Mobile Collapsible Table of Contents (<= 900px) */}
                    {toc.length > 0 && (
                        <div className="ksv-mtoc" style={{ margin: '0 0 28px' }}>
                            <details
                                style={{
                                    background: '#F5EFE1',
                                    border: '1px solid #E6DECB',
                                    borderRadius: 14,
                                    padding: '14px 18px'
                                }}
                            >
                                <summary
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        fontWeight: 700,
                                        fontSize: 16,
                                        color: '#173A1D'
                                    }}
                                >
                                    <span>In This Article (Table of Contents)</span>
                                    <svg className="chev" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1E4D26" strokeWidth="2">
                                        <path d="M6 9l6 6 6-6" />
                                    </svg>
                                </summary>
                                <nav className="ksv-toc" aria-label="Mobile Table of Contents" style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid #E6DECB' }}>
                                    {toc.map((item) => (
                                        <a key={item.id} href={`#${item.id}`}>
                                            {item.title}
                                        </a>
                                    ))}
                                </nav>
                            </details>
                        </div>
                    )}

                    {/* Quick Answer / Clinical Summary Box (.qa) */}
                    <div
                        className="ksv-qa qa"
                        style={{
                            background: '#F5EFE1',
                            border: '1px solid #E6DECB',
                            borderLeft: '5px solid #1E4D26',
                            borderRadius: 16,
                            padding: '24px 28px',
                            margin: '0 0 36px'
                        }}
                    >
                        <div
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 8,
                                fontSize: 13,
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: 1,
                                color: '#1E4D26',
                                marginBottom: 10
                            }}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1E4D26" strokeWidth="2.2">
                                <circle cx="12" cy="12" r="9" />
                                <path d="M12 8v4l2.5 2.5" />
                            </svg>
                            {isHindi ? 'मुख्य आयुर्वेदिक सारांश (Quick Takeaway)' : 'Quick Clinical Takeaway'}
                        </div>
                        <p style={{ margin: 0, fontSize: 18, lineHeight: 1.7, color: '#2A2A24', fontWeight: 500 }}>
                            {isHindi
                                ? 'किसी भी आयुर्वेदिक औषधि का चयन करने से पहले उसकी संपूर्ण जड़ी-बूटी सूची (Ingredients), निर्माता की प्रामाणिकता, सही मात्रा (Dosage) और अपनी शारीरिक प्रकृति की जांच अवश्य करें। पुरानी या गंभीर समस्या होने पर पहले वैद्य से परामर्श लें।'
                                : blog.metaDescription ||
                                  'Choose an authentic Ayurvedic formulation with a transparent herbal ingredient list, clear dosage directions, and an identifiable practitioner. Always match the remedy to your constitution (Prakriti) and health condition.'}
                        </p>
                    </div>

                    {/* Main Processed Blog HTML Content */}
                    <div
                        dangerouslySetInnerHTML={{ __html: processedHtml }}
                    />

                    {/* Medical Disclaimer Callout Box */}
                    <div
                        style={{
                            background: '#F5EFE1',
                            border: '1px solid #E6DECB',
                            borderRadius: 14,
                            padding: '18px 22px',
                            marginTop: 44,
                            fontSize: 15,
                            lineHeight: 1.65,
                            color: '#4A4A40'
                        }}
                    >
                        <strong style={{ color: '#173A1D' }}>Medical Disclaimer: </strong>
                        {disclaimer ||
                            'This article gives general Ayurvedic educational information only. It does not replace personalised medical advice, diagnosis, or treatment. Consult a qualified healthcare professional before starting any herbal product, especially if you have a medical condition, are pregnant or breastfeeding, or take prescribed medication.'}
                    </div>

                    {/* Author Bio Card (#author) */}
                    <section
                        id="author"
                        aria-label="About the Author"
                        style={{
                            background: '#FFFFFF',
                            border: '1px solid #E6DECB',
                            borderRadius: 18,
                            padding: 28,
                            marginTop: 48,
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 20,
                            alignItems: 'flex-start'
                        }}
                    >
                        <div
                            style={{
                                width: 68,
                                height: 68,
                                borderRadius: '50%',
                                background: '#1E4D26',
                                color: '#FFFFFF',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontFamily: "'Playfair Display', serif",
                                fontSize: 28,
                                fontWeight: 700,
                                flexShrink: 0
                            }}
                        >
                            KS
                        </div>
                        <div style={{ flex: '1 1 260px' }}>
                            <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#1E4D26', marginBottom: 4 }}>
                                Written &amp; Clinically Reviewed By
                            </div>
                            <h3 style={{ margin: '0 0 6px', fontSize: 22, fontFamily: "'Playfair Display', Georgia, serif", color: '#173A1D' }}>
                                {blog.author || 'Karan Singh Vaidh'}
                            </h3>
                            <div style={{ fontSize: 14, color: '#5A5A50', marginBottom: 12, fontWeight: 500 }}>
                                Traditional Himalayan Ayurvedic Practitioner · 23+ Years Clinical Experience · Solan, Himachal Pradesh
                            </div>
                            <p style={{ fontSize: 16, lineHeight: 1.65, color: '#3B3B33', margin: '0 0 16px' }}>
                                Practising classical Ayurveda in Solan, HP, Karan Singh Vaidh specialises in root-cause herbal formulations for digestive disorders, respiratory care, kidney &amp; gallbladder stones, metabolic balance, and chronic lifestyle conditions.
                            </p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                                <Link
                                    to="/about-ayurvedic-doctor-in-solan"
                                    style={{
                                        fontSize: 14,
                                        fontWeight: 600,
                                        color: '#1E4D26',
                                        textDecoration: 'none',
                                        padding: '8px 16px',
                                        borderRadius: 999,
                                        background: '#E3EED5'
                                    }}
                                >
                                    View Clinical Profile
                                </Link>
                                <Link
                                    to="/book-appointment"
                                    style={{
                                        fontSize: 14,
                                        fontWeight: 600,
                                        color: '#1E4D26',
                                        textDecoration: 'none',
                                        padding: '8px 16px',
                                        borderRadius: 999,
                                        border: '1px solid #1E4D26'
                                    }}
                                >
                                    Book Direct Consultation
                                </Link>
                            </div>
                        </div>
                    </section>

                    {/* Consultation Banner (#consult) */}
                    <section
                        id="consult"
                        aria-label="Book Ayurvedic Consultation"
                        style={{
                            background: '#1E4D26',
                            color: '#FFFFFF',
                            borderRadius: 20,
                            padding: '32px 28px',
                            marginTop: 36,
                            display: 'flex',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 24
                        }}
                    >
                        <div style={{ flex: '1 1 320px' }}>
                            <span
                                style={{
                                    display: 'inline-block',
                                    background: 'rgba(227, 238, 213, 0.18)',
                                    color: '#E3EED5',
                                    fontSize: 12,
                                    fontWeight: 700,
                                    letterSpacing: 1,
                                    textTransform: 'uppercase',
                                    padding: '5px 12px',
                                    borderRadius: 999,
                                    marginBottom: 12
                                }}
                            >
                                Personalised Ayurvedic Care
                            </span>
                            <h2
                                style={{
                                    fontFamily: "'Playfair Display', Georgia, serif",
                                    fontSize: 28,
                                    lineHeight: 1.25,
                                    color: '#FFFFFF',
                                    margin: '0 0 10px'
                                }}
                            >
                                Speak With Karan Singh Vaidh Before Starting Treatment
                            </h2>
                            <p style={{ fontSize: 16, lineHeight: 1.6, color: '#E3EED5', margin: 0 }}>
                                Get a Prakriti-based assessment and personalised herbal guidance from our Solan clinic via video or phone consultation.
                            </p>
                        </div>

                        <div className="ksv-g2b" style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                            <Link
                                to="/book-appointment"
                                style={{
                                    background: '#9CCB5B',
                                    color: '#173A1D',
                                    textDecoration: 'none',
                                    padding: '13px 22px',
                                    borderRadius: 999,
                                    fontWeight: 700,
                                    fontSize: 15,
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                Book Appointment
                            </Link>
                            <Link
                                to="/ayurvedic-products"
                                style={{
                                    background: 'transparent',
                                    color: '#FFFFFF',
                                    border: '1.5px solid rgba(255,255,255,0.45)',
                                    textDecoration: 'none',
                                    padding: '13px 22px',
                                    borderRadius: 999,
                                    fontWeight: 600,
                                    fontSize: 15,
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 8,
                                    justifyContent: 'center'
                                }}
                            >
                                <ShoppingBag size={16} />
                                Explore Formulations
                            </Link>
                        </div>
                    </section>

                    {/* Related Blogs Section */}
                    {relatedBlogs.length > 0 && (
                        <section style={{ marginTop: 56, paddingTop: 36, borderTop: '1px solid #E1D8C3' }}>
                            <h2 style={{ margin: '0 0 24px', fontSize: 28 }}>Related Ayurvedic Guides</h2>
                            <div
                                className="g3"
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                                    gap: 20
                                }}
                            >
                                {relatedBlogs.map((rel) => (
                                    <Link
                                        key={rel._id}
                                        to={`/blog/${rel.slug}`}
                                        style={{
                                            background: '#FFFFFF',
                                            border: '1px solid #E6DECB',
                                            borderRadius: 16,
                                            padding: 16,
                                            textDecoration: 'none',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 10
                                        }}
                                    >
                                        <div style={{ aspectRatio: '16/10', borderRadius: 10, overflow: 'hidden', background: '#F5EFE1' }}>
                                            <img
                                                src={rel.coverImage || '/logo.png'}
                                                alt={rel.title}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                onError={(e) => (e.target.src = '/logo.png')}
                                            />
                                        </div>
                                        <span style={{ fontSize: 12, fontWeight: 700, color: '#1E4D26', textTransform: 'uppercase', letterSpacing: 0.8 }}>
                                            {rel.category || 'Ayurveda'}
                                        </span>
                                        <h3 style={{ margin: 0, fontSize: 18, lineHeight: 1.35, color: '#173A1D', fontFamily: "'Playfair Display', Georgia, serif" }}>
                                            {rel.title}
                                        </h3>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}
                </article>

                {/* Right Sticky Sidebar (.side) */}
                <aside className="ksv-side">
                    {/* Table of Contents Box */}
                    {toc.length > 0 && (
                        <div
                            style={{
                                background: '#F5EFE1',
                                border: '1px solid #E6DECB',
                                borderRadius: 16,
                                padding: '20px 18px',
                                marginBottom: 20
                            }}
                        >
                            <div
                                style={{
                                    fontSize: 13,
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    letterSpacing: 1,
                                    color: '#5A5A50',
                                    padding: '0 10px 10px',
                                    borderBottom: '1px solid #E1D8C3',
                                    marginBottom: 10
                                }}
                            >
                                On This Page
                            </div>
                            <nav className="ksv-toc" aria-label="Table of Contents">
                                {toc.map((item) => (
                                    <a
                                        key={item.id}
                                        href={`#${item.id}`}
                                        className={activeSection === item.id ? 'active' : ''}
                                        onClick={() => setActiveSection(item.id)}
                                    >
                                        {item.title}
                                    </a>
                                ))}
                            </nav>
                        </div>
                    )}

                    {/* Sidebar Consultation Card */}
                    <div
                        style={{
                            background: '#FFFFFF',
                            border: '1px solid #E6DECB',
                            borderRadius: 16,
                            padding: 22,
                            marginBottom: 20
                        }}
                    >
                        <div
                            style={{
                                display: 'inline-block',
                                background: '#E3EED5',
                                color: '#1E4D26',
                                fontSize: 11,
                                fontWeight: 700,
                                letterSpacing: 0.8,
                                textTransform: 'uppercase',
                                padding: '4px 10px',
                                borderRadius: 999,
                                marginBottom: 10
                            }}
                        >
                            Clinical Guidance
                        </div>
                        <h3
                            style={{
                                fontFamily: "'Playfair Display', Georgia, serif",
                                fontSize: 20,
                                lineHeight: 1.3,
                                color: '#173A1D',
                                margin: '0 0 8px'
                            }}
                        >
                            Need Help Choosing the Right Remedy?
                        </h3>
                        <p style={{ fontSize: 14, lineHeight: 1.6, color: '#4A4A40', margin: '0 0 16px' }}>
                            Consult directly with Dr. Karan Singh Vaidh in Solan for personalised Ayurvedic treatment.
                        </p>
                        <Link
                            to="/book-appointment"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '100%',
                                background: '#1E4D26',
                                color: '#FFFFFF',
                                textDecoration: 'none',
                                padding: '11px 16px',
                                borderRadius: 999,
                                fontWeight: 600,
                                fontSize: 14,
                                marginBottom: 10
                            }}
                        >
                            Book Consultation
                        </Link>
                        <a
                            href="tel:+918091498454"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '100%',
                                border: '1px solid #E1D8C3',
                                color: '#173A1D',
                                textDecoration: 'none',
                                padding: '9px 16px',
                                borderRadius: 999,
                                fontWeight: 600,
                                fontSize: 13
                            }}
                        >
                            Call: +91 80914 98454
                        </a>
                    </div>

                    {/* Share Article Box */}
                    <div
                        style={{
                            background: '#FFFFFF',
                            border: '1px solid #E6DECB',
                            borderRadius: 16,
                            padding: '16px 20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}
                    >
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#5A5A50', textTransform: 'uppercase', letterSpacing: 0.8 }}>
                            Share Guide
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <a
                                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(blog.title + ' ' + window.location.href)}`}
                                target="_blank"
                                rel="noreferrer"
                                title="Share on WhatsApp"
                                style={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: '50%',
                                    background: '#E3EED5',
                                    color: '#1E4D26',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <MessageCircle size={17} />
                            </a>
                            <a
                                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                                target="_blank"
                                rel="noreferrer"
                                title="Share on Facebook"
                                style={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: '50%',
                                    background: '#F5EFE1',
                                    color: '#173A1D',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <Facebook size={17} />
                            </a>
                            <button
                                type="button"
                                onClick={handleCopyLink}
                                title="Copy Link"
                                style={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: '50%',
                                    background: '#F5EFE1',
                                    color: '#173A1D',
                                    border: 'none',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                {copied ? <CheckCircle size={17} style={{ color: '#1E5A2B' }} /> : <LinkIcon size={17} />}
                            </button>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default BlogDetailPage;
