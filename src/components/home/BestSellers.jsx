import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import { getInstantProducts, cacheProducts } from '../../data/staticCatalog';

const getBestSellerScore = (p) => {
    const text = `${p?.name || ''} ${p?.slug || ''} ${p?.category?.name || ''}`.toLowerCase();
    if (text.includes('kidney') || text.includes('stone') || text.includes('renal')) return 1;
    if (text.includes('gall') || text.includes('gallbladder') || text.includes('vidhuvaidha cb') || text.includes('cb')) return 2;
    if (text.includes('hypertension') || text.includes('hbp') || text.includes('blood pressure')) return 3;
    if (text.includes('diabetes') || text.includes('madhu')) return 4;
    if (text.includes('piles') || text.includes('fissure')) return 5;
    if (p?.isBestSeller) return 6;
    return 10;
};

const sortBestSellers = (list) => {
    if (!Array.isArray(list) || list.length === 0) return [];
    const sorted = [...list].sort((a, b) => {
        return getBestSellerScore(a) - getBestSellerScore(b);
    });
    return sorted.slice(0, 8);
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
        <section className="pt-6 sm:pt-8 md:pt-12 pb-2 sm:pb-4 bg-[#E8F3ED]/40 overflow-hidden w-full">
            <div className="w-full relative">
                {/* Header - Centered */}
                <div className="max-w-[1400px] mx-auto px-4 md:px-12 text-center mb-4 sm:mb-6 md:mb-8">
                    <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-[#1A3C34] mb-2 sm:mb-4">Customer&apos;s Favourite</h2>
                </div>

                {loading && products.length === 0 ? (
                    <div className="flex flex-col justify-center items-center py-16 gap-4">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-ayur-green"></div>
                    </div>
                ) : products.length > 0 ? (
                    <div className="relative overflow-visible">
                        {/* Full Width Horizontal Scroll Container */}
                        <div className="flex gap-3 sm:gap-4 md:gap-6 overflow-x-auto pb-3 sm:pb-4 snap-x snap-mandatory scrollbar-hide no-scrollbar scroll-smooth px-4 sm:px-6 md:px-12 lg:px-24">
                            {products.map(product => (
                                <div
                                    key={product._id || product.id || product.slug}
                                    className="min-w-[185px] sm:min-w-[220px] md:min-w-[280px] lg:min-w-[300px] snap-start"
                                >
                                    <ProductCard product={product} />
                                </div>
                            ))}
                            {/* Spacer to allow scrolling to the end with padding */}
                            <div className="min-w-[1px] md:min-w-[20px] shrink-0"></div>
                        </div>
                    </div>
                ) : (
                    <div className="max-w-[1400px] mx-auto px-4 md:px-12 text-center py-16 bg-white/50 rounded-3xl border border-dashed border-[#1A3C34]/20">
                        <p className="text-gray-500 font-serif italic">No best selling products available at the moment.</p>
                    </div>
                )}
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
