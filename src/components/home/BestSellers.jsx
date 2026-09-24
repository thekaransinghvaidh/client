import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import { getInstantProducts, cacheProducts } from '../../data/staticCatalog';

const sortBestSellers = (list) => {
    if (!Array.isArray(list) || list.length === 0) return [];
    const sorted = [...list].sort((a, b) => {
        const isHypA = /hypertension|hbp|blood pressure|high-blood-pressure|raktachap/i.test((a?.name || '') + ' ' + (a?.slug || ''));
        const isHypB = /hypertension|hbp|blood pressure|high-blood-pressure|raktachap/i.test((b?.name || '') + ' ' + (b?.slug || ''));
        if (isHypA && !isHypB) return -1;
        if (!isHypA && isHypB) return 1;
        return (b?.isBestSeller ? 1 : 0) - (a?.isBestSeller ? 1 : 0);
    });

    let bestSellers = sorted.filter(p => p && (p.isBestSeller || /hypertension|hbp|blood pressure/i.test((p?.name || '') + ' ' + (p?.slug || ''))));
    if (bestSellers.length === 0 && sorted.length > 0) {
        bestSellers = sorted.slice(0, 8);
    } else {
        bestSellers = bestSellers.slice(0, 8);
    }
    return bestSellers;
};

const BestSellers = () => {
    // Instant 0ms load from pre-compiled catalog / local cache
    const [products, setProducts] = useState(() => {
        const instant = getInstantProducts();
        return sortBestSellers(instant);
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const fetchProductsBackground = async () => {
            try {
                const { data } = await api.get('/products');
                const list = Array.isArray(data) ? data : (Array.isArray(data?.products) ? data.products : []);
                if (isMounted && list.length > 0) {
                    const sorted = sortBestSellers(list);
                    setProducts(sorted);
                    cacheProducts(list);
                }
            } catch (err) {
                // Keep instant products gracefully
            }
        };

        fetchProductsBackground();
        return () => { isMounted = false; };
    }, []);

    return (
        <section className="py-12 md:py-16 bg-[#E8F3ED]/40 overflow-hidden w-full">
            <div className="w-full relative">
                {/* Header - Centered */}
                <div className="max-w-[1400px] mx-auto px-5 md:px-12 text-center mb-10">
                    <h2 className="text-3xl md:text-5xl font-bold text-[#1A3C34] mb-8">Our Best Sellers</h2>
                </div>

                {loading && products.length === 0 ? (
                    <div className="flex flex-col justify-center items-center py-20 gap-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ayur-green"></div>
                    </div>
                ) : products.length > 0 ? (
                    <div className="relative overflow-visible">
                        {/* Full Width Horizontal Scroll Container */}
                        <div className="flex gap-4 md:gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide no-scrollbar scroll-smooth px-5 md:px-12 lg:px-24">
                            {products.map(product => (
                                <div
                                    key={product._id || product.id || product.slug}
                                    className="min-w-[280px] md:min-w-[320px] lg:min-w-[340px] snap-start"
                                >
                                    <ProductCard product={product} />
                                </div>
                            ))}
                            {/* Spacer to allow scrolling to the end with padding */}
                            <div className="min-w-[1px] md:min-w-[20px] shrink-0"></div>
                        </div>
                    </div>
                ) : (
                    <div className="max-w-[1400px] mx-auto px-5 md:px-12 text-center py-20 bg-white/50 rounded-3xl border border-dashed border-[#1A3C34]/20">
                        <p className="text-gray-500 font-serif italic">No best selling products available at the moment.</p>
                    </div>
                )}

                {/* Footer Link - Centered */}
                <div className="max-w-[1400px] mx-auto px-5 md:px-12 text-center mt-4 md:mt-8">
                    <Link to="/ayurvedic-products" className="inline-flex items-center gap-2 border-b-2 border-ayur-gold/30 text-ayur-green hover:border-ayur-gold hover:text-ayur-gold font-bold transition-all pb-1 uppercase text-xs md:text-sm tracking-[0.2em]">
                        Explore All Products
                    </Link>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}} />
        </section>
    );
};

export default BestSellers;
