import React, { useEffect, useState } from 'react';
import api, { getAssetUrl } from '../../api/api';
import {
    Plus, Trash2, Edit, Image as ImageIcon,
    Monitor, Smartphone, ExternalLink, Loader2,
    Check, X, ArrowUpDown, Sparkles, RefreshCw
} from 'lucide-react';

// Exact 4 Real Laptop/Desktop Banners (1920 x 650 / 700 px)
const INITIAL_LAPTOP_BANNERS = [
    {
        _id: 'laptop-1',
        title: 'Ancient Ayurvedas - Healing Banner',
        desktopImage: '/banner1-web.webp',
        link: '/contact',
        order: 1,
        targetAudience: 'desktopOnly',
        isActive: true
    },
    {
        _id: 'laptop-2',
        title: 'Himachal Excellence Award Banner',
        desktopImage: '/him award.webp',
        link: '/about-ayurvedic-doctor-in-solan',
        order: 2,
        targetAudience: 'desktopOnly',
        isActive: true
    },
    {
        _id: 'laptop-3',
        title: 'Nirmal Rishi Web Banner',
        desktopImage: '/Nirmal Rishi banner for Web.png',
        link: '/contact',
        order: 3,
        targetAudience: 'desktopOnly',
        isActive: true
    },
    {
        _id: 'laptop-4',
        title: 'Vidhuvaidha x Nirmal Rishi Ji',
        desktopImage: '/VIDHUVADHA X NIRMAL RISHI JI.png',
        link: '/about-ayurvedic-doctor-in-solan',
        order: 4,
        targetAudience: 'desktopOnly',
        isActive: true
    }
];

// Exact 7 Real Mobile Banners (800 x 1200 px - Portrait 9:16)
const INITIAL_MOBILE_BANNERS = [
    {
        _id: 'mobile-1',
        title: 'Nirmal Rishi Mobile Banner',
        mobileImage: '/Nirmal rishi Banner 4.png',
        link: '/contact',
        order: 1,
        targetAudience: 'mobileOnly',
        isActive: true
    },
    {
        _id: 'mobile-2',
        title: 'KSV x Nirmal Rishi Ji Mobile',
        mobileImage: '/KSV X NR !.png',
        link: '/about-ayurvedic-doctor-in-solan',
        order: 2,
        targetAudience: 'mobileOnly',
        isActive: true
    },
    {
        _id: 'mobile-3',
        title: 'Gallbladder Stone Ayurvedic Care',
        mobileImage: '/Gallbladder stone Mobile Banner Size 800 x 1200px.png',
        link: '/gallbladder-stone-ayurvedic-treatment',
        order: 3,
        targetAudience: 'mobileOnly',
        isActive: true
    },
    {
        _id: 'mobile-4',
        title: 'Gallbladder Stone AK CAP Mobile Banner',
        mobileImage: '/Gallbladder stone AK CAP Mobile Banner Size 800 x 1200px.png',
        link: '/gallbladder-stone-ayurvedic-treatment',
        order: 4,
        targetAudience: 'mobileOnly',
        isActive: true
    },
    {
        _id: 'mobile-5',
        title: 'Diabetes Ayurvedic Treatment',
        mobileImage: '/Diabetes Banner Mobile Banner Size 800 x 1200px.png',
        link: '/ayurvedic-diabetes-treatment',
        order: 5,
        targetAudience: 'mobileOnly',
        isActive: true
    },
    {
        _id: 'mobile-6',
        title: 'Piles Natural Treatment',
        mobileImage: '/Piles Mobile Banner Size 800 x 1200px.png',
        link: '/ayurvedic-piles-treatment',
        order: 6,
        targetAudience: 'mobileOnly',
        isActive: true
    },
    {
        _id: 'mobile-7',
        title: 'Kidney Stone Natural Care',
        mobileImage: '/Kidney stone Mobile Banner Size 800 x 1200px.png',
        link: '/kidney-stone-ayurvedic-treatment',
        order: 7,
        targetAudience: 'mobileOnly',
        isActive: true
    }
];

const INITIAL_ALL_BANNERS = [...INITIAL_LAPTOP_BANNERS, ...INITIAL_MOBILE_BANNERS];
const LOCAL_STORAGE_KEY = 'ksv_admin_banners_v4';

const resolveBannerImage = (img) => {
    if (!img) return '';
    if (img.startsWith('http')) return img;
    if (img.startsWith('/uploads/') || img.startsWith('uploads/')) {
        return getAssetUrl(img);
    }
    return img;
};

const Banners = () => {
    const [banners, setBanners] = useState(() => {
        try {
            const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) return parsed;
            }
        } catch {}
        return INITIAL_ALL_BANNERS;
    });

    // Active Top Tab: 'laptop' | 'mobile'
    const [activeTab, setActiveTab] = useState('laptop');

    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBanner, setEditingBanner] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        image: '',
        link: '/ayurvedic-products',
        order: 1,
        isActive: true
    });

    useEffect(() => {
        fetchBanners();
    }, []);

    const saveBannersLocallyAndNotify = (updatedList) => {
        setBanners(updatedList);
        try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedList));
            window.dispatchEvent(new Event('ksv_banners_updated'));
        } catch (e) {
            console.warn('LocalStorage save warning:', e);
        }
    };

    const fetchBanners = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/banners/admin');
            if (Array.isArray(data) && data.length > 0) {
                saveBannersLocallyAndNotify(data);
            }
        } catch (err) {
            const localSaved = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (localSaved) {
                try {
                    setBanners(JSON.parse(localSaved));
                } catch {
                    setBanners(INITIAL_ALL_BANNERS);
                }
            } else {
                saveBannersLocallyAndNotify(INITIAL_ALL_BANNERS);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (banner = null) => {
        if (banner) {
            setEditingBanner(banner);
            setFormData({
                title: banner.title || '',
                image: banner.desktopImage || banner.mobileImage || '',
                link: banner.link || '/ayurvedic-products',
                order: banner.order !== undefined ? banner.order : 1,
                isActive: banner.isActive !== undefined ? banner.isActive : true
            });
        } else {
            setEditingBanner(null);
            const currentList = activeTab === 'laptop' ? laptopBanners : mobileBanners;
            setFormData({
                title: '',
                image: '',
                link: '/ayurvedic-products',
                order: currentList.length + 1,
                isActive: true
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingBanner(null);
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadFormData = new FormData();
        uploadFormData.append('image', file);
        setUploadingImage(true);

        try {
            const { data } = await api.post('/upload', uploadFormData);
            const filePath = typeof data === 'string' ? data : data.image;
            setFormData(prev => ({ ...prev, image: filePath }));
        } catch (error) {
            console.error('File upload fallback:', error);
            const reader = new FileReader();
            reader.onload = (ev) => {
                setFormData(prev => ({ ...prev, image: ev.target.result }));
            };
            reader.readAsDataURL(file);
        } finally {
            setUploadingImage(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.image) {
            alert(`Please provide or upload a ${activeTab === 'laptop' ? 'Laptop' : 'Mobile'} banner image.`);
            return;
        }

        const isLaptop = editingBanner
            ? editingBanner.targetAudience === 'desktopOnly' || !!editingBanner.desktopImage
            : activeTab === 'laptop';

        const payload = {
            title: formData.title,
            desktopImage: isLaptop ? formData.image : '',
            mobileImage: !isLaptop ? formData.image : '',
            link: formData.link,
            order: Number(formData.order) || 1,
            targetAudience: isLaptop ? 'desktopOnly' : 'mobileOnly',
            isActive: formData.isActive
        };

        try {
            setActionLoading(true);
            let updatedList = [...banners];

            if (editingBanner) {
                try {
                    await api.put(`/banners/${editingBanner._id}`, payload);
                } catch (apiErr) {
                    console.warn('API update fallback:', apiErr.message);
                }

                updatedList = updatedList.map(b =>
                    b._id === editingBanner._id ? { ...b, ...payload } : b
                );
            } else {
                let newId = `${isLaptop ? 'laptop' : 'mobile'}-${Date.now()}`;
                try {
                    const { data } = await api.post('/banners', payload);
                    if (data && data._id) newId = data._id;
                } catch (apiErr) {
                    console.warn('API post fallback:', apiErr.message);
                }

                const newBanner = {
                    _id: newId,
                    ...payload
                };
                updatedList.push(newBanner);
            }

            updatedList.sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));

            saveBannersLocallyAndNotify(updatedList);
            handleCloseModal();
            setActionLoading(false);
        } catch (err) {
            console.error('Save failed:', err);
            alert('Failed to save banner: ' + (err.response?.data?.message || err.message));
            setActionLoading(false);
        }
    };

    const toggleStatus = async (banner) => {
        const newStatus = !banner.isActive;
        const updatedList = banners.map(b => b._id === banner._id ? { ...b, isActive: newStatus } : b);
        saveBannersLocallyAndNotify(updatedList);

        try {
            await api.put(`/banners/${banner._id}`, { isActive: newStatus });
        } catch (e) {
            console.log('Status updated in local cache');
        }
    };

    const handleDelete = async (id, title) => {
        if (window.confirm(`Are you sure you want to delete banner "${title || 'Selected'}"?`)) {
            const updatedList = banners.filter(b => b._id !== id);
            saveBannersLocallyAndNotify(updatedList);

            try {
                await api.delete(`/banners/${id}`);
            } catch (e) {
                console.log('Deleted from local cache');
            }
        }
    };

    const laptopBanners = banners.filter(b => b.targetAudience === 'desktopOnly' || (b.desktopImage && b.targetAudience !== 'mobileOnly'));
    const mobileBanners = banners.filter(b => b.targetAudience === 'mobileOnly' || (b.mobileImage && b.targetAudience !== 'desktopOnly'));

    return (
        <div className="space-y-6 sm:space-y-8 pb-20 max-w-full overflow-x-hidden">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 bg-white p-5 sm:p-8 rounded-3xl sm:rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-gray-100">
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-ayur-green/10 text-ayur-green rounded-2xl flex items-center justify-center shadow-inner shrink-0">
                        <ImageIcon size={22} className="sm:w-6 sm:h-6" />
                    </div>
                    <div className="min-w-0">
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-ayur-green truncate">
                            Hero Section Banners
                        </h2>
                        <p className="text-gray-400 text-xs sm:text-sm mt-0.5 font-medium truncate">
                            Manage Laptop (Desktop) and Mobile (Smartphone) banners separately
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                    <button
                        onClick={fetchBanners}
                        disabled={loading}
                        className="px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 text-gray-600 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm hover:bg-gray-100 transition-all flex items-center gap-1.5"
                        title="Refresh Banners"
                    >
                        <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                        <span className="hidden xs:inline">Refresh</span>
                    </button>
                    <button
                        onClick={() => handleOpenModal()}
                        className="px-4 sm:px-6 py-2.5 sm:py-3.5 bg-ayur-green text-white rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm shadow-xl shadow-ayur-green/20 hover:bg-ayur-olive transition-all flex items-center gap-2 transform active:scale-95 shrink-0"
                    >
                        <Plus size={18} />
                        <span>{activeTab === 'laptop' ? 'Add Laptop Banner' : 'Add Mobile Banner'}</span>
                    </button>
                </div>
            </div>

            {/* TWO LARGE DISTINCT RESPONSIVE TABS */}
            <div className="flex bg-white p-1.5 sm:p-2 rounded-2xl sm:rounded-[2rem] shadow-md border border-gray-100 max-w-2xl gap-2 sm:gap-3">
                <button
                    onClick={() => setActiveTab('laptop')}
                    className={`flex-1 py-3 sm:py-4 px-3 sm:px-6 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm md:text-base transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 ${
                        activeTab === 'laptop'
                            ? 'bg-ayur-green text-white shadow-lg shadow-ayur-green/25 scale-[1.01]'
                            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                >
                    <Monitor size={18} className={`sm:w-5 sm:h-5 ${activeTab === 'laptop' ? 'text-ayur-gold' : 'text-gray-400'}`} />
                    <span>Laptop Banners</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold ${
                        activeTab === 'laptop' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                        {laptopBanners.length}
                    </span>
                </button>

                <button
                    onClick={() => setActiveTab('mobile')}
                    className={`flex-1 py-3 sm:py-4 px-3 sm:px-6 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm md:text-base transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 ${
                        activeTab === 'mobile'
                            ? 'bg-ayur-green text-white shadow-lg shadow-ayur-green/25 scale-[1.01]'
                            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                >
                    <Smartphone size={18} className={`sm:w-5 sm:h-5 ${activeTab === 'mobile' ? 'text-ayur-gold' : 'text-gray-400'}`} />
                    <span>Mobile Banners</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold ${
                        activeTab === 'mobile' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                        {mobileBanners.length}
                    </span>
                </button>
            </div>

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* TAB 1: LAPTOP BANNERS TAB */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            {activeTab === 'laptop' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between px-1 sm:px-2">
                        <h3 className="text-base sm:text-lg md:text-xl font-serif font-bold text-gray-900 flex items-center gap-2">
                            <Monitor className="text-ayur-green shrink-0" size={20} />
                            <span>Laptop / Desktop Banners (1920 x 650 px)</span>
                        </h3>
                        <span className="text-xs text-gray-400 font-medium">{laptopBanners.length} Items</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        {laptopBanners.map((banner, index) => {
                            const desktopSrc = resolveBannerImage(banner.desktopImage);

                            return (
                                <div
                                    key={banner._id || index}
                                    className={`bg-white rounded-3xl sm:rounded-[2.5rem] border overflow-hidden transition-all duration-300 shadow-md hover:shadow-xl flex flex-col justify-between ${
                                        banner.isActive ? 'border-gray-100' : 'border-red-100 opacity-75'
                                    }`}
                                >
                                    <div>
                                        {/* Widescreen Laptop Image Box */}
                                        <div className="relative bg-gray-950 aspect-[16/7] overflow-hidden group">
                                            <img
                                                src={desktopSrc}
                                                alt={banner.title}
                                                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                                                onError={(e) => { e.target.src = '/banner1-web.webp'; }}
                                            />

                                            {/* Badges */}
                                            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex items-center gap-1.5 sm:gap-2">
                                                <span className="px-2.5 sm:px-3.5 py-1 bg-black/70 backdrop-blur-md text-white text-[11px] sm:text-xs font-bold rounded-full flex items-center gap-1 shadow-sm">
                                                    <ArrowUpDown size={11} /> Slide #{banner.order ?? index + 1}
                                                </span>
                                                <span className={`px-2.5 sm:px-3.5 py-1 backdrop-blur-md text-[11px] sm:text-xs font-bold rounded-full flex items-center gap-1 shadow-sm ${
                                                    banner.isActive ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                                                }`}>
                                                    {banner.isActive ? <Check size={11} /> : <X size={11} />}
                                                    {banner.isActive ? 'Active' : 'Hidden'}
                                                </span>
                                            </div>

                                            <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                                                <span className="px-2.5 sm:px-3 py-1 bg-white/95 backdrop-blur-md text-gray-800 text-[10px] sm:text-xs font-bold rounded-full shadow-sm flex items-center gap-1">
                                                    <Monitor size={12} className="text-ayur-green" /> 1920x650
                                                </span>
                                            </div>
                                        </div>

                                        {/* Info */}
                                        <div className="p-5 sm:p-6 space-y-2 sm:space-y-3">
                                            <h3 className="font-serif font-bold text-lg sm:text-xl text-gray-900 line-clamp-1">
                                                {banner.title || 'Untitled Laptop Banner'}
                                            </h3>

                                            <div className="space-y-1.5 text-xs text-gray-500">
                                                <div className="flex items-center gap-2">
                                                    <Monitor size={14} className="text-gray-400 shrink-0" />
                                                    <span className="truncate font-mono text-xs text-gray-700 bg-gray-50 px-2.5 py-1 rounded-lg" title={banner.desktopImage}>
                                                        {banner.desktopImage}
                                                    </span>
                                                </div>
                                                {banner.link && (
                                                    <div className="flex items-center gap-2 text-ayur-green font-medium pt-0.5">
                                                        <ExternalLink size={14} className="shrink-0" />
                                                        <span className="truncate">{banner.link}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions Footer */}
                                    <div className="p-3.5 sm:p-4 px-5 sm:px-6 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
                                        <button
                                            onClick={() => toggleStatus(banner)}
                                            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all ${
                                                banner.isActive
                                                    ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                            }`}
                                        >
                                            {banner.isActive ? 'Active on Laptop' : 'Hidden'}
                                        </button>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleOpenModal(banner)}
                                                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-ayur-green/10 text-ayur-green hover:bg-ayur-green hover:text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5"
                                                title="Edit Banner"
                                            >
                                                <Edit size={14} />
                                                <span>Edit</span>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(banner._id, banner.title)}
                                                className="p-1.5 sm:p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                title="Delete Banner"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* TAB 2: MOBILE BANNERS TAB */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            {activeTab === 'mobile' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between px-1 sm:px-2">
                        <h3 className="text-base sm:text-lg md:text-xl font-serif font-bold text-gray-900 flex items-center gap-2">
                            <Smartphone className="text-ayur-green shrink-0" size={20} />
                            <span>Mobile Phone Banners (Portrait 800 x 1200 px)</span>
                        </h3>
                        <span className="text-xs text-gray-400 font-medium">{mobileBanners.length} Items</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {mobileBanners.map((banner, index) => {
                            const mobileSrc = resolveBannerImage(banner.mobileImage || banner.desktopImage);

                            return (
                                <div
                                    key={banner._id || index}
                                    className={`bg-white rounded-3xl sm:rounded-[2.5rem] border overflow-hidden transition-all duration-300 shadow-md hover:shadow-xl flex flex-col justify-between p-4 sm:p-5 ${
                                        banner.isActive ? 'border-gray-100' : 'border-red-100 opacity-75'
                                    }`}
                                >
                                    <div>
                                        {/* Top Badges */}
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="px-2.5 py-1 bg-ayur-green/10 text-ayur-green text-xs font-bold rounded-xl flex items-center gap-1">
                                                <ArrowUpDown size={11} /> #{banner.order ?? index + 1}
                                            </span>
                                            <span className={`px-2.5 py-0.5 text-xs font-bold rounded-lg ${
                                                banner.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                                {banner.isActive ? 'Active' : 'Hidden'}
                                            </span>
                                        </div>

                                        {/* REALISTIC MOBILE PHONE FRAME */}
                                        <div className="relative w-full max-w-[190px] sm:max-w-[210px] mx-auto aspect-[9/15] rounded-[1.75rem] sm:rounded-[2rem] bg-gray-950 p-2 shadow-xl border-4 border-gray-800 flex flex-col items-center group overflow-hidden mb-3">
                                            {/* Dynamic Island Notch */}
                                            <div className="w-10 sm:w-12 h-1 sm:h-1.5 bg-gray-700 rounded-full mb-1 sm:mb-1.5 z-10"></div>
                                            <div className="relative w-full flex-1 rounded-[1.1rem] sm:rounded-[1.25rem] overflow-hidden bg-gray-900">
                                                <img
                                                    src={mobileSrc}
                                                    alt={banner.title}
                                                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                                                    onError={(e) => { e.target.src = '/Nirmal rishi Banner 4.png'; }}
                                                />
                                            </div>
                                        </div>

                                        {/* Info */}
                                        <div className="space-y-1.5 text-center px-1">
                                            <h3 className="font-serif font-bold text-sm sm:text-base text-gray-900 line-clamp-1">
                                                {banner.title || 'Untitled Mobile Banner'}
                                            </h3>

                                            <div className="space-y-1 text-xs text-gray-500">
                                                <div className="truncate font-mono text-[11px] bg-gray-50 px-2 py-1 rounded-lg" title={banner.mobileImage}>
                                                    {banner.mobileImage}
                                                </div>
                                                {banner.link && (
                                                    <div className="text-ayur-green font-medium truncate pt-0.5 text-xs">
                                                        {banner.link}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions Footer */}
                                    <div className="pt-3.5 mt-3.5 border-t border-gray-100 flex items-center justify-between">
                                        <button
                                            onClick={() => toggleStatus(banner)}
                                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                                banner.isActive
                                                    ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                            }`}
                                        >
                                            {banner.isActive ? 'Live' : 'Draft'}
                                        </button>

                                        <div className="flex items-center gap-1.5">
                                            <button
                                                onClick={() => handleOpenModal(banner)}
                                                className="p-2 bg-ayur-green/10 text-ayur-green hover:bg-ayur-green hover:text-white rounded-xl transition-all"
                                                title="Edit Mobile Banner"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(banner._id, banner.title)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                title="Delete Banner"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* 100% RESPONSIVE FIXED SCROLLABLE MODAL (PERFECT ON ALL SCREENS) */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/75 backdrop-blur-sm p-3 sm:p-6 md:p-8 flex items-center justify-center min-h-screen">
                    <div className="relative bg-white w-full max-w-xl md:max-w-2xl rounded-3xl md:rounded-[2.5rem] shadow-2xl border border-gray-100 flex flex-col my-auto max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="p-5 sm:p-6 bg-gradient-to-r from-ayur-green to-ayur-olive text-white flex items-center justify-between shrink-0">
                            <div>
                                <h3 className="text-xl sm:text-2xl font-serif font-bold">
                                    {editingBanner ? `Edit ${activeTab === 'laptop' ? 'Laptop' : 'Mobile'} Banner` : `Add New ${activeTab === 'laptop' ? 'Laptop' : 'Mobile'} Banner`}
                                </h3>
                                <p className="text-ayur-gold text-xs font-medium uppercase tracking-wider mt-0.5">
                                    {activeTab === 'laptop' ? 'Landscape (1920x650px) for PC/Laptops' : 'Portrait (800x1200px) for Smartphones'}
                                </p>
                            </div>
                            <button
                                onClick={handleCloseModal}
                                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors shrink-0"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Modal Form Scrollable Content */}
                        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                            <div className="p-5 sm:p-7 space-y-4 sm:space-y-5 overflow-y-auto flex-1">
                                {/* Title */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Banner Title / Identifier *
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Nirmal Rishi Special Feature"
                                        className="w-full px-4 sm:px-5 py-3 sm:py-3.5 bg-gray-50 border border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-ayur-green/20 focus:border-ayur-green text-sm font-medium transition-all"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                    />
                                </div>

                                {/* Banner Image Upload & Preview */}
                                <div className="space-y-3 bg-gray-50/80 p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-bold text-ayur-green flex items-center gap-1.5 uppercase tracking-wider">
                                            {activeTab === 'laptop' ? <Monitor size={16} /> : <Smartphone size={16} />}
                                            <span>{activeTab === 'laptop' ? 'Laptop Banner (1920x650)' : 'Mobile Banner (800x1200)'} *</span>
                                        </label>
                                    </div>

                                    <div className="space-y-2.5">
                                        <input
                                            type="text"
                                            placeholder={activeTab === 'laptop' ? '/banner1-web.webp or URL' : '/Nirmal rishi Banner 4.png or URL'}
                                            className="w-full px-3.5 sm:px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-mono"
                                            value={formData.image}
                                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                            required
                                        />

                                        <label className="flex items-center justify-center gap-2 w-full py-3 bg-white hover:bg-ayur-green/5 border-2 border-dashed border-gray-300 hover:border-ayur-green rounded-xl sm:rounded-2xl cursor-pointer text-xs font-bold text-gray-700 transition-all">
                                            {uploadingImage ? (
                                                <Loader2 size={16} className="animate-spin text-ayur-green" />
                                            ) : (
                                                <ImageIcon size={16} className="text-ayur-green" />
                                            )}
                                            <span>{uploadingImage ? 'Uploading Image...' : `Upload ${activeTab === 'laptop' ? 'Laptop' : 'Mobile'} Banner File`}</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleFileUpload}
                                                disabled={uploadingImage}
                                            />
                                        </label>
                                    </div>

                                    {formData.image && (
                                        <div className="mt-2.5">
                                            <div className="text-[11px] font-bold text-gray-400 mb-1">Live Preview:</div>
                                            {activeTab === 'laptop' ? (
                                                <div className="relative rounded-xl overflow-hidden aspect-[16/7] border border-gray-200 bg-black/5">
                                                    <img
                                                        src={resolveBannerImage(formData.image)}
                                                        alt="Laptop Preview"
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="relative w-[120px] mx-auto aspect-[9/15] rounded-[1.25rem] bg-gray-950 p-1.5 shadow-md border-2 border-gray-800 flex flex-col items-center overflow-hidden">
                                                    <div className="w-6 h-1 bg-gray-700 rounded-full mb-1"></div>
                                                    <div className="relative w-full flex-1 rounded-[0.75rem] overflow-hidden bg-gray-900">
                                                        <img
                                                            src={resolveBannerImage(formData.image)}
                                                            alt="Mobile Preview"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Target Click URL */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Redirect Link / Page URL
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. /ayurvedic-products or /contact"
                                        className="w-full px-4 sm:px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-ayur-green/20 focus:border-ayur-green text-sm font-medium transition-all"
                                        value={formData.link}
                                        onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                    />
                                </div>

                                {/* Display Order */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Display Sequence Order (1 = First Slide)
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        className="w-full px-4 sm:px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-ayur-green/20 focus:border-ayur-green text-sm font-medium transition-all"
                                        value={formData.order}
                                        onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                                    />
                                </div>

                                {/* Status Switch */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Publication Status
                                    </label>
                                    <div className="flex items-center gap-3 pt-0.5">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                                            className={`px-4 sm:px-5 py-2.5 rounded-xl sm:rounded-2xl font-bold text-xs flex items-center gap-2 transition-all ${
                                                formData.isActive
                                                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                                                    : 'bg-gray-200 text-gray-700'
                                            }`}
                                        >
                                            {formData.isActive ? <Check size={15} /> : <X size={15} />}
                                            {formData.isActive ? 'Active & Visible on Website' : 'Draft / Hidden'}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-4 sm:p-6 border-t border-gray-100 bg-gray-50/90 backdrop-blur-md flex items-center justify-end gap-3 shrink-0">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-gray-600 font-bold text-xs sm:text-sm hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={actionLoading}
                                    className="px-6 sm:px-7 py-2.5 sm:py-3 bg-ayur-green text-white rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm shadow-xl shadow-ayur-green/20 hover:bg-ayur-olive transition-all flex items-center gap-2 disabled:opacity-50"
                                >
                                    {actionLoading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                                    <span>{editingBanner ? 'Update Banner' : 'Publish Banner'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Banners;
