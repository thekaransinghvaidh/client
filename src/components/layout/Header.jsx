import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, User, Menu, X, LogOut, ArrowRight, Tag, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';
import { getInstantProducts } from '../../data/staticCatalog';
import { resolveProductImage } from '../../utils/productImages';

import logo from '../../assets/thekaransinghvaidh-logo.webp';

const POPULAR_SEARCHES = [
    'Gallbladder Stone',
    'High Blood Pressure',
    'Diabetes Care',
    'Kidney Stone',
    'Piles Relief',
    'Asthma',
    'Migraine',
    'Gastric Acidity',
    'Thyroid'
];

const Header = () => {
    const navigate = useNavigate();
    const { userInfo, logout } = React.useContext(AuthContext);
    const { cartItems } = React.useContext(CartContext);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    // Search Modal State
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const searchInputRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Global keyboard shortcut: Ctrl+K or Cmd+K to open, Escape to close
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                setIsSearchOpen(prev => !prev);
            }
            if (e.key === 'Escape' && isSearchOpen) {
                setIsSearchOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isSearchOpen]);

    // Auto-focus input when search modal opens
    useEffect(() => {
        if (isSearchOpen) {
            setTimeout(() => {
                searchInputRef.current?.focus();
            }, 100);
        } else {
            setSearchQuery('');
        }
    }, [isSearchOpen]);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Shop', path: '/ayurvedic-products' },
        { name: 'Book Appointment', path: '/book-appointment' },
        { name: 'Patient Reports', path: '/patient-reports' },
        { name: 'About', path: '/about-ayurvedic-doctor-in-solan' },
        { name: 'Contact', path: '/contact' },
    ];

    // Filter live search products
    const liveResults = React.useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        if (!q) return [];
        const all = getInstantProducts();
        return all.filter(p => {
            const name = (p.name || '').toLowerCase();
            const cat = (p.category?.name || p.category || '').toLowerCase();
            const desc = (p.shortDescription || p.fullDescription || '').toLowerCase();
            const ben = (p.benefits || '').toLowerCase();
            const ing = (p.ingredients || '').toLowerCase();
            return name.includes(q) || cat.includes(q) || desc.includes(q) || ben.includes(q) || ing.includes(q);
        }).slice(0, 6);
    }, [searchQuery]);

    const handleSearchSubmit = (e) => {
        if (e) e.preventDefault();
        const q = searchQuery.trim();
        if (!q) return;
        setIsSearchOpen(false);
        setIsMobileMenuOpen(false);
        navigate(`/ayurvedic-products?s=${encodeURIComponent(q)}`);
    };

    const handleSelectProduct = (product) => {
        setIsSearchOpen(false);
        setIsMobileMenuOpen(false);
        const targetId = product.slug || product._id || product.id;
        navigate(`/product/${targetId}`);
    };

    const handleSelectTag = (tag) => {
        setSearchQuery(tag);
        searchInputRef.current?.focus();
    };

    return (
        <>
            <header
                className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled
                    ? 'bg-white/95 backdrop-blur-md shadow-lg py-3'
                    : 'bg-white/80 backdrop-blur-sm py-4 border-b border-gray-100'
                    }`}
            >
                <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
                    {/* Logo */}
                    <Link to="/" className="flex-shrink-0 order-1 md:order-2">
                        <img loading="lazy" src={logo}
                            alt="The Karan Singh Vaidh"
                            className="h-10 md:h-14 max-w-[140px] md:max-w-none object-contain transition-all duration-300 hover:scale-105"
                        />
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center space-x-10 order-3">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className="relative text-gray-700 hover:text-ayur-green transition-colors font-semibold text-sm tracking-wide group"
                            >
                                {link.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-ayur-green transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                        ))}
                    </nav>

                    {/* Icons and Mobile Menu */}
                    <div className="flex items-center space-x-3.5 sm:space-x-5 md:space-x-6 order-2 md:order-4">
                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden text-gray-700 hover:text-ayur-green transition-colors p-1"
                            onClick={() => setIsMobileMenuOpen(true)}
                            aria-label="Open Navigation Menu"
                        >
                            <Menu size={26} strokeWidth={2} />
                        </button>

                        {/* Search Button (Works on BOTH Laptop & Mobile) */}
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className="text-gray-700 hover:text-ayur-green transition-colors p-1.5 sm:p-2 rounded-full hover:bg-ayur-green/10 flex items-center justify-center group"
                            title="Search Remedies & Medicines (Ctrl + K)"
                            aria-label="Search"
                        >
                            <Search size={21} strokeWidth={2} className="group-hover:scale-110 transition-transform sm:w-[22px] sm:h-[22px]" />
                        </button>

                        {/* Desktop User Account / Login */}
                        {userInfo ? (
                            <div className="hidden md:flex items-center space-x-4">
                                <Link
                                    to="/account"
                                    className="flex items-center gap-2 text-gray-700 hover:text-ayur-green transition-colors bg-gray-100 hover:bg-ayur-beige/30 px-3 py-2 rounded-full"
                                >
                                    <User size={18} strokeWidth={2} />
                                    <span className="text-xs font-bold">{userInfo.name.split(' ')[0]}</span>
                                </Link>
                                <button
                                    onClick={logout}
                                    className="text-gray-600 hover:text-red-500 transition-colors"
                                    title="Logout"
                                >
                                    <LogOut size={20} strokeWidth={2} />
                                </button>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="hidden md:flex items-center gap-2 text-gray-700 hover:text-ayur-green transition-colors bg-gray-100 hover:bg-ayur-beige/30 px-4 py-2 rounded-full font-semibold text-sm"
                            >
                                <User size={18} strokeWidth={2} />
                                <span>Login</span>
                            </Link>
                        )}

                        {/* Cart Link */}
                        <Link to="/cart" className="relative text-gray-700 hover:text-ayur-green transition-colors p-1" aria-label="Shopping Cart">
                            <ShoppingBag size={23} strokeWidth={2} />
                            {cartItems.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-ayur-green text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-lg animate-in zoom-in duration-300">
                                    {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, x: '100%' }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-0 bg-white z-[9999] flex flex-col p-6 h-screen w-screen overflow-y-auto"
                            style={{ backgroundColor: '#ffffff' }}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <img loading="lazy" src={logo}
                                    alt="Logo"
                                    className="h-12"
                                />
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-gray-700 hover:text-ayur-green transition-colors"
                                    aria-label="Close menu"
                                >
                                    <X size={28} strokeWidth={2} />
                                </button>
                            </div>

                            {/* Mobile Drawer Quick Search Button */}
                            <button
                                onClick={() => { setIsMobileMenuOpen(false); setIsSearchOpen(true); }}
                                className="w-full flex items-center gap-3 px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-500 hover:text-ayur-green hover:border-ayur-green transition-all text-sm font-medium mb-6 shadow-xs"
                            >
                                <Search size={18} className="text-ayur-green" />
                                <span>Search remedies & products...</span>
                            </button>

                            <nav className="flex flex-col space-y-6">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        to={link.path}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="text-gray-800 text-2xl font-semibold hover:text-ayur-green transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                                <hr className="border-gray-200 my-4" />
                                {userInfo ? (
                                    <>
                                        <Link
                                            to="/account"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex items-center space-x-3 text-gray-700 text-lg font-medium"
                                        >
                                            <User size={22} />
                                            <span>My Account</span>
                                        </Link>
                                        <button
                                            onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                                            className="flex items-center space-x-3 text-red-500 text-lg font-medium text-left"
                                        >
                                            <LogOut size={22} />
                                            <span>Logout</span>
                                        </button>
                                    </>
                                ) : (
                                    <Link
                                        to="/login"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center space-x-3 text-ayur-green text-lg font-semibold"
                                    >
                                        <User size={22} />
                                        <span>Login / Register</span>
                                    </Link>
                                )}
                            </nav>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* LIVE SEARCH MODAL (LAPTOP & MOBILE) */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <AnimatePresence>
                {isSearchOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => setIsSearchOpen(false)}
                        className="fixed inset-0 z-[100] bg-black/65 backdrop-blur-md flex flex-col items-center justify-start pt-12 sm:pt-20 px-4 sm:px-6 overflow-y-auto"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: -20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: -20 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[85vh] my-auto sm:my-0"
                        >
                            {/* Search Input Bar */}
                            <form onSubmit={handleSearchSubmit} className="relative flex items-center px-5 sm:px-6 py-4 sm:py-5 border-b border-gray-100 bg-gray-50/50">
                                <Search size={22} className="text-ayur-green shrink-0 mr-3.5" />
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search remedies, medicines, diseases..."
                                    className="flex-1 bg-transparent text-base sm:text-lg text-gray-900 placeholder-gray-400 focus:outline-none font-medium"
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchQuery('')}
                                        className="p-1 rounded-full text-gray-400 hover:text-gray-700 transition-colors mr-2"
                                        title="Clear search"
                                    >
                                        <X size={18} />
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => setIsSearchOpen(false)}
                                    className="p-1.5 rounded-xl bg-gray-200/60 hover:bg-gray-200 text-gray-600 transition-colors shrink-0"
                                    title="Close (Esc)"
                                >
                                    <X size={20} />
                                </button>
                            </form>

                            {/* Modal Content Area */}
                            <div className="overflow-y-auto p-5 sm:p-6 flex-1 space-y-5">
                                {/* If user hasn't typed anything yet: Show Popular/Trending Searches */}
                                {!searchQuery.trim() ? (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                            <Sparkles size={14} className="text-ayur-gold" />
                                            <span>Popular Health Searches</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {POPULAR_SEARCHES.map((tag) => (
                                                <button
                                                    key={tag}
                                                    type="button"
                                                    onClick={() => handleSelectTag(tag)}
                                                    className="px-3.5 py-2 rounded-xl bg-gray-50 hover:bg-ayur-green hover:text-white border border-gray-200/80 text-gray-700 text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 group"
                                                >
                                                    <Tag size={12} className="text-gray-400 group-hover:text-white transition-colors" />
                                                    <span>{tag}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    /* If user typed something: Show Matching Live Products */
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-wider">
                                            <span>Matching Remedies ({liveResults.length})</span>
                                            {liveResults.length > 0 && (
                                                <button
                                                    type="button"
                                                    onClick={handleSearchSubmit}
                                                    className="text-ayur-green hover:underline flex items-center gap-1 font-bold lowercase first-letter:uppercase"
                                                >
                                                    <span>view all results</span>
                                                    <ArrowRight size={13} />
                                                </button>
                                            )}
                                        </div>

                                        {liveResults.length > 0 ? (
                                            <div className="divide-y divide-gray-100">
                                                {liveResults.map((product) => {
                                                    const imgSrc = resolveProductImage(product);
                                                    const defaultPack = product.packs?.find(p => p.isDefault) || product.packs?.[0];
                                                    const price = defaultPack?.sellingPrice || product.price || 0;
                                                    const mrp = defaultPack?.mrp || product.mrp || 0;

                                                    return (
                                                        <div
                                                            key={product.slug || product._id || product.id}
                                                            onClick={() => handleSelectProduct(product)}
                                                            className="flex items-center gap-3.5 sm:gap-4 py-3 sm:py-3.5 px-2 rounded-2xl hover:bg-gray-50 cursor-pointer transition-all group"
                                                        >
                                                            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-gray-100 flex items-center justify-center p-1">
                                                                <img
                                                                    src={imgSrc}
                                                                    alt={product.name}
                                                                    className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                                                                />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-2 mb-0.5">
                                                                    <span className="text-[10px] sm:text-xs font-bold text-ayur-green bg-ayur-green/10 px-2 py-0.5 rounded-md">
                                                                        {product.category?.name || product.category || 'Ayurvedic'}
                                                                    </span>
                                                                </div>
                                                                <h4 className="text-sm sm:text-base font-serif font-bold text-gray-900 truncate group-hover:text-ayur-green transition-colors">
                                                                    {product.name}
                                                                </h4>
                                                                <p className="text-xs text-gray-400 line-clamp-1 font-normal">
                                                                    {product.shortDescription || product.benefits}
                                                                </p>
                                                            </div>
                                                            <div className="text-right shrink-0 pl-2">
                                                                <div className="text-sm sm:text-base font-bold text-gray-900">
                                                                    ₹{price.toLocaleString()}
                                                                </div>
                                                                {mrp > price && (
                                                                    <div className="text-[11px] text-gray-400 line-through">
                                                                        ₹{mrp.toLocaleString()}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <div className="text-center py-10 space-y-3">
                                                <div className="w-14 h-14 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto">
                                                    <Search size={26} />
                                                </div>
                                                <div>
                                                    <h4 className="text-base font-bold text-gray-800">
                                                        No remedies found for "{searchQuery}"
                                                    </h4>
                                                    <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                                                        Try searching with a broader term or browse our complete product collection.
                                                    </p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setIsSearchOpen(false);
                                                        navigate('/ayurvedic-products');
                                                    }}
                                                    className="px-5 py-2.5 bg-ayur-green text-white rounded-xl text-xs font-bold hover:bg-ayur-olive transition-colors shadow-sm inline-flex items-center gap-2"
                                                >
                                                    <span>Browse Full Ayurvedic Catalog</span>
                                                    <ArrowRight size={14} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Modal Footer */}
                            <div className="p-3.5 sm:p-4 px-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400 font-medium">
                                <span className="hidden sm:inline">Press <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[11px] font-mono text-gray-600">Enter</kbd> to search in Shop</span>
                                <span className="sm:hidden">Tap any product to view</span>
                                <button
                                    type="button"
                                    onClick={handleSearchSubmit}
                                    className="text-ayur-green font-bold hover:underline flex items-center gap-1"
                                >
                                    <span>Search in Shop</span>
                                    <ArrowRight size={13} />
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Header;

