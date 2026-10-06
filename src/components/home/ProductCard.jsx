import React, { useContext, useState } from 'react';
import { ShoppingCart, Star, Minus, Plus, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAssetUrl } from '../../api/api';
import { CartContext } from '../../context/CartContext';
import { metaPixelService } from '../../services/metaPixel';
import { resolveProductImage } from '../../utils/productImages';

const ProductCard = ({ product }) => {
    const { addToCart } = useContext(CartContext);
    const [imageError, setImageError] = useState(false);
    const [quantity, setQuantity] = useState(1);

    // Reconcile property names
    const id = product.slug || product._id || product.id;
    const name = product.name;
    const image = resolveProductImage(product);
    const rating = product.rating || 4.8;
    const reviews = product.numReviews || product.reviews || 2500;
    const tags = product.tags || ["Natural", "Wellness"];

    // Pack selection
    const packs = (product.packs && product.packs.length > 0)
        ? product.packs
        : [{ name: 'PACK OF 1', sellingPrice: product.price || 0, mrp: product.mrp || 0 }];

    const [selectedPack, setSelectedPack] = useState(packs.find(p => p.isPopular || p.isDefault) || packs[0]);
    const [showPackDropdown, setShowPackDropdown] = useState(false);

    const price = selectedPack?.sellingPrice || selectedPack?.price || 0;
    const mrp = selectedPack?.mrp || 0;
    const discount = selectedPack.discount || (mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0);

    const handleAddToCart = () => {
        console.log('[Meta Pixel] AddToCart button clicked');

        addToCart(product, selectedPack, quantity);
        console.log('[Meta Pixel] Cart updated successfully');

        metaPixelService.trackAddToCart(product, quantity, selectedPack?.sellingPrice || price);
    };

    return (
        <div className="bg-white rounded-2xl sm:rounded-3xl transition-all duration-300 border border-gray-100 hover:border-ayur-green/20 group overflow-hidden flex flex-col h-full w-full shadow-xs hover:shadow-xl relative">

            {/* Discount Badge */}
            {discount > 0 && (
                <div className="absolute top-2.5 sm:top-4 left-0 z-20 bg-[#2ECC71] text-white text-[9px] sm:text-[10px] font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-r-full shadow-xs">
                    {discount}% OFF
                </div>
            )}

            {/* Image Container */}
            <Link to={`/product/${id}`} className="relative w-full aspect-[4/5] overflow-hidden bg-white block">
                <img loading="lazy" src={imageError ? '/logo.png' : image}
                    alt={`Ayurvedic Product - ${name} | The Karan Singh Vaidh`}
                    onError={() => setImageError(true)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 p-2 sm:p-4"
                />
            </Link>

            {/* Content */}
            <div className="p-2.5 sm:p-4 flex flex-col flex-grow text-center">
                <div className="flex flex-col items-center mb-1">
                    {/* Star Rating */}
                    <div className="flex items-center gap-0.5 sm:gap-1 text-[#F1C40F] mb-1">
                        <div className="flex">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={12} fill={i < Math.floor(rating) ? "currentColor" : "none"} className="text-[#F1C40F]" />
                            ))}
                        </div>
                        <span className="text-[10px] sm:text-[11px] font-bold text-gray-700 ml-1">{rating}</span>
                    </div>

                    {/* Title */}
                    <Link to={`/product/${id}`} className="block">
                        <h3 className="font-bold text-[13px] sm:text-[15px] md:text-[16px] text-[#1A3C34] mb-0.5 sm:mb-1 line-clamp-1 group-hover:text-ayur-gold transition-colors">
                            {name}
                        </h3>
                    </Link>

                    {/* Tags */}
                    <p className="text-[10px] sm:text-[11px] text-gray-400 font-medium tracking-tight mb-2 sm:mb-3 line-clamp-1">
                        {tags.join(" | ")}
                    </p>
                </div>

                <div className="mt-auto space-y-2 sm:space-y-3.5">
                    {/* Price */}
                    <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                        <span className="text-sm sm:text-base md:text-lg font-black text-[#1A3C34]">Rs. {price.toFixed(2)}</span>
                        {mrp > price && (
                            <span className="text-[10px] sm:text-xs text-gray-400 line-through">Rs. {mrp.toFixed(2)}</span>
                        )}
                    </div>

                    {/* Pack Selector */}
                    <div className="relative">
                        <button
                            onClick={() => setShowPackDropdown(!showPackDropdown)}
                            className="w-full py-1 sm:py-1.5 px-2.5 sm:px-4 rounded-full border border-gray-200 text-[8.5px] sm:text-[10px] font-bold text-[#1A3C34] flex items-center justify-center gap-1.5 hover:bg-gray-50 uppercase tracking-wider transition-colors"
                        >
                            <span className="truncate">{selectedPack.name}</span>
                            <ChevronDown size={12} className={showPackDropdown ? 'rotate-180 transition-transform shrink-0' : 'transition-transform shrink-0'} />
                        </button>

                        {showPackDropdown && (
                            <div className="absolute bottom-full left-0 w-full bg-white border border-gray-100 rounded-xl sm:rounded-2xl shadow-2xl z-50 mb-1.5 py-1.5 overflow-hidden animate-in fade-in slide-in-from-bottom-2">
                                {packs.map((pack, idx) => (
                                    <button
                                        key={idx}
                                        className="w-full px-3 py-1.5 text-left text-[10px] sm:text-[11px] font-bold hover:bg-[#F4F9F6] text-[#1A3C34] transition-colors truncate"
                                        onClick={() => {
                                            setSelectedPack(pack);
                                            setShowPackDropdown(false);
                                        }}
                                    >
                                        {pack.name} - Rs. {pack.sellingPrice}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Quantity & Add to Cart Stack */}
                    <div className="space-y-1.5 sm:space-y-2 w-full pt-0.5">
                        {/* Quantity Selector */}
                        <div className="flex items-center justify-between border border-gray-100 bg-[#F8FBF9] rounded-lg sm:rounded-xl h-8 sm:h-10 px-2 sm:px-4">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="p-0.5 sm:p-1 text-[#1A3C34] hover:text-ayur-gold"
                            >
                                <Minus size={13} />
                            </button>
                            <span className="font-bold text-xs sm:text-sm text-[#1A3C34]">{quantity}</span>
                            <button
                                onClick={() => setQuantity(quantity + 1)}
                                className="p-0.5 sm:p-1 text-[#1A3C34] hover:text-ayur-gold"
                            >
                                <Plus size={13} />
                            </button>
                        </div>

                        {/* Add to Cart Button */}
                        <button
                            onClick={handleAddToCart}
                            className="w-full bg-[#419463] hover:bg-[#357a52] text-white h-8 sm:h-11 rounded-lg sm:rounded-xl text-[10px] sm:text-[12px] font-black uppercase tracking-tight transition-all active:scale-[0.98] shadow-xs"
                        >
                            ADD TO CART
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
