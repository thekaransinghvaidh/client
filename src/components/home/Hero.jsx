import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ConsultationModal from './ConsultationModal';
import api, { getAssetUrl } from '../../api/api';

import banner1Web from '../../assets/banner1-web.webp';
import himAward from '../../assets/him award.webp';

const resolveBannerImage = (img) => {
    if (!img) return '';
    if (img.startsWith('http')) return img;
    if (img.startsWith('/uploads/') || img.startsWith('uploads/')) {
        return getAssetUrl(img);
    }
    return img;
};

// Exact real slides for Hero Section (NO HOSPITAL BANNER)
const defaultSlides = [
    // 4 Real Desktop Banners
    {
        id: 'banner1',
        desktopOnly: true,
        title: null,
        subtitle: null,
        cta: null,
        link: "/contact",
        bgImage: banner1Web,
        theme: "dark",
        icon: null,
        hasOverlay: false
    },
    {
        id: 'himAward',
        desktopOnly: true,
        title: null,
        subtitle: null,
        cta: null,
        link: "/about-ayurvedic-doctor-in-solan",
        bgImage: himAward,
        theme: "dark",
        icon: null,
        hasOverlay: false
    },
    {
        id: 'nirmalRishi1',
        desktopOnly: true,
        title: null,
        subtitle: null,
        cta: null,
        link: "/contact",
        bgImage: '/Nirmal Rishi banner for Web.png',
        theme: "dark",
        icon: null,
        hasOverlay: false
    },
    {
        id: 'nirmalRishi2',
        desktopOnly: true,
        title: null,
        subtitle: null,
        cta: null,
        link: "/about-ayurvedic-doctor-in-solan",
        bgImage: '/VIDHUVADHA X NIRMAL RISHI JI.png',
        theme: "dark",
        icon: null,
        hasOverlay: false
    },
    // 7 Real Mobile Banners
    {
        id: 'nirmal-mobile-1',
        mobileOnly: true,
        title: null,
        subtitle: null,
        cta: null,
        link: "/contact",
        mobileBgImage: '/Nirmal rishi Banner 4.png',
        theme: "dark",
        icon: null,
        hasOverlay: false
    },
    {
        id: 'ksv-nr-mobile',
        mobileOnly: true,
        title: null,
        subtitle: null,
        cta: null,
        link: "/about-ayurvedic-doctor-in-solan",
        mobileBgImage: '/KSV X NR !.png',
        theme: "dark",
        icon: null,
        hasOverlay: false
    },
    {
        id: 'gallbladder-mobile',
        mobileOnly: true,
        title: null,
        subtitle: null,
        cta: null,
        link: "/gallbladder-stone-ayurvedic-treatment",
        mobileBgImage: '/Gallbladder stone Mobile Banner Size 800 x 1200px.png',
        theme: "dark",
        icon: null,
        hasOverlay: false
    },
    {
        id: 'gallbladder-ak-cap-mobile',
        mobileOnly: true,
        title: null,
        subtitle: null,
        cta: null,
        link: "/gallbladder-stone-ayurvedic-treatment",
        mobileBgImage: '/Gallbladder stone AK CAP Mobile Banner Size 800 x 1200px.png',
        theme: "dark",
        icon: null,
        hasOverlay: false
    },
    {
        id: 'diabetes-mobile',
        mobileOnly: true,
        title: null,
        subtitle: null,
        cta: null,
        link: "/ayurvedic-diabetes-treatment",
        mobileBgImage: '/Diabetes Banner Mobile Banner Size 800 x 1200px.png',
        theme: "dark",
        icon: null,
        hasOverlay: false
    },
    {
        id: 'piles-mobile',
        mobileOnly: true,
        title: null,
        subtitle: null,
        cta: null,
        link: "/ayurvedic-piles-treatment",
        mobileBgImage: '/Piles Mobile Banner Size 800 x 1200px.png',
        theme: "dark",
        icon: null,
        hasOverlay: false
    },
    {
        id: 'kidney-stone-mobile',
        mobileOnly: true,
        title: null,
        subtitle: null,
        cta: null,
        link: "/kidney-stone-ayurvedic-treatment",
        mobileBgImage: '/Kidney stone Mobile Banner Size 800 x 1200px.png',
        theme: "dark",
        icon: null,
        hasOverlay: false
    }
];

const LOCAL_STORAGE_KEY = 'ksv_admin_banners_v5';

const Hero = () => {
    const [isDesktop, setIsDesktop] = React.useState(window.innerWidth >= 768);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [currentSlide, setCurrentSlide] = React.useState(0);
    const [slides, setSlides] = React.useState(defaultSlides);

    React.useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Fetch dynamic banners from backend or local admin storage
    React.useEffect(() => {
        let isMounted = true;

        // Clean up legacy stale cache keys
        try {
            localStorage.removeItem('ksv_admin_banners');
            localStorage.removeItem('ksv_admin_banners_v2');
            localStorage.removeItem('ksv_admin_banners_v3');
            localStorage.removeItem('ksv_admin_banners_v4');
        } catch {}

        const formatBannerList = (list) => {
            if (!Array.isArray(list)) return defaultSlides;
            
            // Filter out any accidental hospital banners from Hero section
            const valid = list.filter(b => {
                if (b.isActive === false) return false;
                const dImg = (b.desktopImage || '').toLowerCase();
                const mImg = (b.mobileImage || '').toLowerCase();
                const title = (b.title || '').toLowerCase();
                if (dImg.includes('hospital') || mImg.includes('hospital') || title.includes('hospital')) {
                    return false;
                }
                return true;
            });

            if (valid.length === 0) return defaultSlides;

            return valid.map(b => ({
                id: b._id || b.title,
                title: b.title || null,
                subtitle: null,
                cta: null,
                link: b.link || '',
                bgImage: resolveBannerImage(b.desktopImage || b.mobileImage),
                mobileBgImage: resolveBannerImage(b.mobileImage || b.desktopImage),
                desktopOnly: b.targetAudience === 'desktopOnly',
                mobileOnly: b.targetAudience === 'mobileOnly',
                theme: 'dark',
                icon: null,
                hasOverlay: false
            }));
        };

        const loadBanners = async () => {
            try {
                const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
                if (saved) {
                    const parsed = JSON.parse(saved);
                    const formatted = formatBannerList(parsed);
                    if (formatted.length > 0) {
                        setSlides(formatted);
                    }
                }
            } catch (e) {
                console.warn('Local banner parse warning:', e);
            }

            try {
                const { data } = await api.get('/banners');
                if (isMounted && Array.isArray(data) && data.length > 0) {
                    const formatted = formatBannerList(data);
                    if (formatted.length > 0) {
                        setSlides(formatted);
                    }
                }
            } catch (error) {
                // Keep default/cached slides gracefully
            }
        };

        loadBanners();

        const handleLiveUpdate = () => {
            loadBanners();
        };

        window.addEventListener('ksv_banners_updated', handleLiveUpdate);
        window.addEventListener('storage', handleLiveUpdate);

        return () => {
            isMounted = false;
            window.removeEventListener('ksv_banners_updated', handleLiveUpdate);
            window.removeEventListener('storage', handleLiveUpdate);
        };
    }, []);

    const visibleSlides = slides.filter(slide => {
        if (slide.desktopOnly && !isDesktop) return false;
        if (slide.mobileOnly && isDesktop) return false;
        return true;
    });

    const settings = {
        dots: true,
        infinite: visibleSlides.length > 1,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 6000,
        adaptiveHeight: true,
        fade: true,
        speed: 800,
        cssEase: "linear",
        pauseOnHover: false,
        arrows: isDesktop && visibleSlides.length > 1,
        lazyLoad: 'progressive',
        afterChange: (current) => {
            setCurrentSlide(current);
        },
        customPaging: i => (
            <div className={`w-3 h-3 rounded-full transition-all cursor-pointer mt-4 ${i === currentSlide ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white'}`}></div>
        ),
        appendDots: dots => (
            <div style={{ bottom: "30px" }}>
                <ul className="m-0 p-0 flex justify-center gap-4"> {dots} </ul>
            </div>
        )
    };

    const getOptimizedImage = (url) => {
        if (!url || typeof url !== 'string') return '';
        if (!url.includes('freepik')) return url;
        const width = isDesktop ? 1920 : 640;
        return `${url}?w=${width}&q=80`;
    };

    return (
        <section className="relative w-full overflow-hidden">
            <Slider {...settings} className="hero-slider">
                {visibleSlides.map((slide, index) => {
                    const imgSrc = getOptimizedImage(!isDesktop && slide.mobileBgImage ? slide.mobileBgImage : slide.bgImage);

                    const SlideImageContent = (
                        <div className="w-full relative overflow-hidden flex items-center justify-center">
                            <img
                                src={imgSrc}
                                alt={slide.title || slide.subtitle || "The Karan Singh Vaidh Ayurvedic Banner"}
                                width={isDesktop ? "1920" : "800"}
                                height={isDesktop ? "700" : "1200"}
                                decoding={index === 0 ? "sync" : "async"}
                                fetchPriority={index === 0 ? "high" : "auto"}
                                loading={index === 0 ? "eager" : "lazy"}
                                className={`w-full h-auto block transition-transform duration-[5000ms] ${slide.hasOverlay !== false ? "hover:scale-105" : "bg-white"}`}
                            />
                            {slide.hasOverlay !== false && (
                                <div className="absolute inset-0 bg-gradient-to-r from-[#0d2e1b]/90 via-[#0d2e1b]/60 to-transparent pointer-events-none"></div>
                            )}
                        </div>
                    );

                    return (
                        <div key={slide.id || index} className="relative w-full outline-none">
                            {/* Slide Click Navigation */}
                            {slide.link ? (
                                slide.link.startsWith('http') ? (
                                    <a href={slide.link} target="_blank" rel="noopener noreferrer" className="block w-full outline-none cursor-pointer">
                                        {SlideImageContent}
                                    </a>
                                ) : (
                                    <Link to={slide.link} className="block w-full outline-none cursor-pointer">
                                        {SlideImageContent}
                                    </Link>
                                )
                            ) : (
                                SlideImageContent
                            )}

                            {/* Content Container - Render if any text or CTA exists */}
                            {(slide.title && slide.hasOverlay) && (
                                <div className="absolute inset-0 z-10 container mx-auto px-4 md:px-12 flex flex-col justify-center max-w-7xl">
                                    <motion.div
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.8, delay: 0.2 }}
                                        className="max-w-2xl"
                                    >
                                        {index === 0 ? (
                                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-4 md:mb-6 leading-tight drop-shadow-lg">
                                                {slide.title}
                                            </h1>
                                        ) : (
                                            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-4 md:mb-6 leading-tight drop-shadow-lg">
                                                {slide.title}
                                            </h2>
                                        )}

                                        {slide.subtitle && (
                                            <p className="text-sm md:text-xl text-gray-200 mb-6 md:mb-10 font-light tracking-wide leading-relaxed border-l-4 border-yellow-500 pl-4">
                                                {slide.subtitle}
                                            </p>
                                        )}

                                        {slide.cta && (
                                            <button
                                                tabIndex={index === currentSlide ? 0 : -1}
                                                aria-hidden={index !== currentSlide}
                                                onClick={(e) => {
                                                    if (slide.cta === "Consult Ayurveda Expert") {
                                                        e.preventDefault();
                                                        setIsModalOpen(true);
                                                    } else if (slide.link) {
                                                        window.location.href = slide.link;
                                                    }
                                                }}
                                                className="inline-flex items-center gap-2 md:gap-3 bg-yellow-500 hover:bg-yellow-400 text-[#0d2e1b] px-6 py-3 md:px-10 md:py-4 rounded-full font-bold text-base md:text-lg transition-all transform hover:-translate-y-1 hover:shadow-xl group"
                                            >
                                                {slide.cta}
                                                <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                                            </button>
                                        )}
                                    </motion.div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </Slider>

            {/* Custom Styles for Slider */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .hero-slider .slick-prev, .hero-slider .slick-next {
                    z-index: 20;
                    width: 50px;
                    height: 50px;
                    transition: all 0.3s;
                }
                .hero-slider .slick-prev { left: 30px; }
                .hero-slider .slick-next { right: 30px; }
                .hero-slider .slick-prev:before, .hero-slider .slick-next:before {
                    font-size: 40px;
                    opacity: 0.7;
                    color: white;
                }
                .hero-slider .slick-prev:hover:before, .hero-slider .slick-next:hover:before {
                    opacity: 1;
                    color: #eab308;
                }
                .hero-slider .slick-slide {
                    visibility: hidden;
                    transition: visibility 0s 0.8s;
                }
                .hero-slider .slick-slide.slick-active {
                    visibility: visible;
                    transition: visibility 0s;
                    z-index: 10;
                }
            `}} />
            {/* Appointment Modal */}
            <ConsultationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </section>
    );
};

export default Hero;
