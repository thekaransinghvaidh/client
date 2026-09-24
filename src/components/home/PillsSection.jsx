import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import api from '../../api/api';
import { Link } from 'react-router-dom';
import { getInstantProducts, cacheProducts } from '../../data/staticCatalog';

const filterPills = (list) => {
    if (!Array.isArray(list) || list.length === 0) return [];
    const sorted = [...list].sort((a, b) => {
        const isHypA = /hypertension|hbp|blood pressure|high-blood-pressure|raktachap/i.test((a?.name || '') + ' ' + (a?.slug || ''));
        const isHypB = /hypertension|hbp|blood pressure|high-blood-pressure|raktachap/i.test((b?.name || '') + ' ' + (b?.slug || ''));
        if (isHypA && !isHypB) return -1;
        if (!isHypA && isHypB) return 1;
        return 0;
    });
    const filtered = sorted.filter(p => p && (p.isWellness || p.category?.name?.toLowerCase().includes('capsule') || p.name?.toLowerCase().includes('capsule') || p.name?.toLowerCase().includes('pill') || /hypertension|hbp|blood pressure/i.test((p?.name || '') + ' ' + (p?.slug || ''))));
    return filtered.length > 0 ? filtered.slice(0, 4) : sorted.slice(0, 4);
};

const PillsSection = () => {
    // Instant 0ms load
    const [products, setProducts] = useState(() => {
        const instant = getInstantProducts();
        return filterPills(instant);
    });

    useEffect(() => {
        let isMounted = true;
        const fetchProductsBackground = async () => {
            try {
                const { data } = await api.get('/products');
                const list = Array.isArray(data) ? data : (Array.isArray(data?.products) ? data.products : []);
                if (isMounted && list.length > 0) {
                    setProducts(filterPills(list));
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
        <section className="py-12 bg-gray-50">
            <div className="w-full px-2 md:px-6">
                <div className="text-center mb-8">
                    <h2 className="text-3xl md:text-4xl font-serif text-[#0d2e1b] font-medium">Explore our specialized natural solutions</h2>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                    {products.map(product => (
                        <ProductCard key={product._id || product.id || product.slug} product={product} />
                    ))}
                </div>

                <div className="text-center mt-12">
                    <Link to="/ayurvedic-products" className="inline-block border-b-2 border-ayur-gold text-ayur-green hover:text-ayur-gold font-bold transition-all pb-1 uppercase text-sm tracking-wider">
                        View All Products
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default PillsSection;
