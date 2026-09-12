import React, { useState } from 'react';
import SEO from '../components/seo/SEO';
import api from '../api/api';
import { Package, Search, Truck, CheckCircle, Clock, AlertCircle, ExternalLink, Calendar, MapPin } from 'lucide-react';
import { BUSINESS_NAP } from '../constants/nap';

const OrderTracking = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [orders, setOrders] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setLoading(true);
        setError('');
        setOrders(null);

        try {
            const isPhone = /^[0-9\+\-\s]{8,15}$/.test(searchQuery.trim());
            const payload = isPhone ? { phone: searchQuery.trim() } : { orderId: searchQuery.trim() };
            
            const { data } = await api.post('/orders/track', payload);
            setOrders(data);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Unable to locate order. Please verify your Order ID or registered phone number.');
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status, isPaid) => {
        const s = (status || '').toLowerCase();
        if (s.includes('delivered')) return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle size={14} /> Delivered</span>;
        if (s.includes('shipped') || s.includes('transit') || s.includes('processing')) return <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold flex items-center gap-1"><Truck size={14} /> {status || 'In Transit'}</span>;
        if (s.includes('cancel')) return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-bold flex items-center gap-1"><AlertCircle size={14} /> Cancelled</span>;
        return <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold flex items-center gap-1"><Clock size={14} /> {isPaid ? 'Processing' : 'Pending Payment'}</span>;
    };

    return (
        <div className="bg-ayur-beige/20 min-h-screen py-12 px-4 md:px-8">
            <SEO
                title="Track Your Order | Karan Singh Vaidh Ayurveda"
                description="Track the status of your Ayurvedic order online. Enter your Order ID or registered phone number to get live shipping and delivery details."
                url="/track-order"
            />

            <div className="max-w-4xl mx-auto">
                {/* Header Banner */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 mb-4 shadow-inner">
                        <Truck size={32} />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-3">Track Your Order</h1>
                    <p className="text-gray-600 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
                        Enter your 24-character Order ID or your registered 10-digit mobile number below to check real-time order processing and shipment updates.
                    </p>
                </div>

                {/* Search Box Card */}
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100 mb-10">
                    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-grow">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Enter Order ID or Mobile Number (e.g. 9876543210)..."
                                className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-gray-900 placeholder-gray-400 font-medium text-sm md:text-base"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-8 py-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 whitespace-nowrap active:scale-95 disabled:opacity-50"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <Search size={18} />
                                    <span>Track Order</span>
                                </>
                            )}
                        </button>
                    </form>

                    {error && (
                        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700 text-sm font-medium">
                            <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}
                </div>

                {/* Results Section */}
                {orders && orders.length > 0 && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <Package className="text-emerald-700" size={22} />
                            Matching Orders ({orders.length})
                        </h2>

                        {orders.map((order) => (
                            <div key={order._id} className="bg-white rounded-2xl p-6 md:p-8 shadow-md border border-gray-100 space-y-6">
                                {/* Order Summary Header */}
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-gray-100">
                                    <div>
                                        <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Order ID</div>
                                        <div className="font-mono font-bold text-gray-900 text-base md:text-lg">{order._id}</div>
                                        <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                            <Calendar size={12} />
                                            Ordered on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-start sm:items-end gap-1">
                                        {getStatusBadge(order.shipment_status || order.status, order.isPaid)}
                                        <span className="text-xs text-gray-500 font-medium mt-1">Payment Method: <strong className="text-gray-700">{order.paymentMethod}</strong></span>
                                    </div>
                                </div>

                                {/* Items List */}
                                <div>
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Order Items</h3>
                                    <div className="divide-y divide-gray-100">
                                        {order.orderItems?.map((item, idx) => (
                                            <div key={idx} className="py-3 flex items-center justify-between text-sm">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-emerald-800 font-bold text-xs flex-shrink-0">
                                                        {item.qty}x
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-gray-800">{item.name}</div>
                                                        {item.packName && <div className="text-xs text-gray-500">Pack: {item.packName}</div>}
                                                    </div>
                                                </div>
                                                <div className="font-bold text-gray-900">₹{item.price * item.qty}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Shipping & Live Tracking Info */}
                                <div className="bg-emerald-50/60 rounded-xl p-4 md:p-5 border border-emerald-100 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <div className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-1 flex items-center gap-1">
                                            <MapPin size={14} /> Destination
                                        </div>
                                        <div className="font-medium text-gray-800">{order.shippingAddress?.name}</div>
                                        <div className="text-xs text-gray-600">{order.shippingAddress?.city}, {order.shippingAddress?.state}</div>
                                    </div>

                                    <div>
                                        <div className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-1 flex items-center gap-1">
                                            <Truck size={14} /> Courier Details
                                        </div>
                                        <div className="font-medium text-gray-800">{order.courier_name || 'Standard Express Delivery'}</div>
                                        {order.awb_code && (
                                            <div className="text-xs text-gray-600 font-mono mt-0.5">AWB: {order.awb_code}</div>
                                        )}
                                    </div>
                                </div>

                                {/* External Tracking Link */}
                                {order.tracking_url && (
                                    <div className="pt-2 flex justify-end">
                                        <a
                                            href={order.tracking_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold px-6 py-3 rounded-xl shadow transition-all text-sm"
                                        >
                                            <span>Open Live Courier Tracking</span>
                                            <ExternalLink size={16} />
                                        </a>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Need Help Box */}
                <div className="mt-12 text-center bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-gray-900 text-base mb-1">Need Assistance with your order?</h3>
                    <p className="text-xs text-gray-500 mb-3">Our patient care team in Solan, HP is available 10 AM – 5 PM daily.</p>
                    <a href={`tel:${BUSINESS_NAP.phone}`} className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-800 font-bold text-sm">
                        <span>Call Support: {BUSINESS_NAP.phoneDisplay}</span>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default OrderTracking;
