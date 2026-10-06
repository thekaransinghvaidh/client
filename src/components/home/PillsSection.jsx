import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import api from '../../api/api';
import { Link } from 'react-router-dom';
import { getInstantProducts, cacheProducts } from '../../data/staticCatalog';

const getProductPriority = (p) => {
    const text = `${p?.name || ''} ${p?.slug || ''} ${p?.category?.name || ''}`.toLowerCase();
    if (text.includes('hypertension') || text.includes('hbp') || text.includes('blood pressure')) return 1;
    if (text.includes('diabetes') || text.includes('madhu') || text.includes('sugar')) return 2;
    if (text.includes('piles') || text.includes('fissure') || text.includes('ps')) return 3;
    if (text.includes('asthma') || text.includes('aks') || text.includes('bronchial')) return 4;
    return 10;
};

const filterPills = (list) => {
    if (!Array.isArray(list) || list.length === 0) return [];
    const sorted = [...list].sort((a, b) => {
        return getProductPriority(a) - getProductPriority(b);
    });
    return sorted.slice(0, 4);
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
        <section className="pt-2 sm:pt-4 pb-8 sm:pb-12 bg-gray-50">
            <div className="w-full px-2 md:px-6">
                <div className="text-center mb-4 sm:mb-6">
                    <h2 className="!text-[20px] font-sans text-[#0d2e1b] font-bold" style={{ fontSize: '20px' }}>Explore Our Best-Selling Natural Solutions</h2>
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
