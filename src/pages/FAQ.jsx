import React, { useState } from 'react';
import SEO from '../components/seo/SEO';
import { HelpCircle, ChevronDown, Search, PhoneCall, ShieldCheck, Truck, Leaf, Stethoscope } from 'lucide-react';
import { BUSINESS_NAP } from '../constants/nap';
import { Link } from 'react-router-dom';

const faqCategories = [
    {
        id: 'general',
        title: 'Ayurvedic Formulations & Safety',
        icon: Leaf,
        questions: [
            {
                q: 'Are Karan Singh Vaidh Ayurvedic treatments 100% natural and safe?',
                a: 'Yes. All our herbal formulations are prepared according to traditional Ayurvedic principles using authentic herbs without harmful chemical additives or steroids. They are safe when taken according to recommended dosages.'
            },
            {
                q: 'How long does it take to see noticeable improvements?',
                a: 'Ayurveda works holistically to address root causes. Most patients report initial improvements within 15 to 30 days of consistent usage, dietary discipline, and recommended lifestyle adjustments.'
            },
            {
                q: 'Can I take Ayurvedic medicines along with allopathic medicines?',
                a: 'In most cases, Ayurvedic formulations can complement standard care. We recommend maintaining a gap of 45 to 60 minutes between allopathic and Ayurvedic remedies, or consulting our Ayurvedic physician.'
            },
            {
                q: 'Are there any dietary restrictions (Pathya & Apathya) during treatment?',
                a: 'Yes. Ayurveda emphasizes dietary discipline. Specific condition guides (e.g. avoiding sour/fried foods in skin or gastric conditions) are provided with our products for best results.'
            }
        ]
    },
    {
        id: 'orders',
        title: 'Ordering, Shipping & Delivery',
        icon: Truck,
        questions: [
            {
                q: 'How long does shipping take across India?',
                a: 'Orders are processed from Solan, HP within 24 hours. Standard delivery across metro cities takes 3–5 business days, and rest of India takes 4–7 business days via reliable courier partners.'
            },
            {
                q: 'Do you offer Cash on Delivery (COD)?',
                a: 'Yes, Cash on Delivery is available across most pincodes in India. You can also pay securely online using UPI, Credit/Debit cards, or NetBanking.'
            },
            {
                q: 'How can I track my order status?',
                a: 'You can easily track your parcel live on our website at /track-order by entering your Order ID or registered mobile number.'
            },
            {
                q: 'What if my package arrives damaged or missing an item?',
                a: 'We offer hassle-free replacement for damaged or incorrect shipments. Please notify our helpline at +91-8091498454 within 48 hours of delivery.'
            }
        ]
    },
    {
        id: 'consultation',
        title: 'Doctor Consultation & Clinic',
        icon: Stethoscope,
        questions: [
            {
                q: 'How can I consult Karan Singh Vaidh directly?',
                a: 'You can book an online tele-consultation by clicking "Consult Expert" on our website or visit our clinic at Radhasoami Satsang Ghar Road, Rebuan, Deoghat, Anji, Solan, Himachal Pradesh 173211.'
            },
            {
                q: 'What are clinic timings for physical visits?',
                a: 'Our clinic in Solan is open Monday through Sunday from 10:00 AM to 5:00 PM.'
            },
            {
                q: 'Should I keep my existing medical test reports ready for consultation?',
                a: 'Yes. Sharing recent blood test reports, ultrasound scans, or prescriptions helps our doctor customize your treatment plan accurately.'
            }
        ]
    }
];

const FAQ = () => {
    const [activeCategory, setActiveCategory] = useState('general');
    const [openIndices, setOpenIndices] = useState({});
    const [searchQuery, setSearchQuery] = useState('');

    const toggleQuestion = (categoryIndex, questionIndex) => {
        const key = `${categoryIndex}-${questionIndex}`;
        setOpenIndices(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    // Flatten all questions for Search Filter
    const allQuestions = faqCategories.flatMap((cat, cIdx) => 
        cat.questions.map((q, qIdx) => ({
            ...q,
            categoryTitle: cat.title,
            key: `${cIdx}-${qIdx}`
        }))
    );

    const filteredQuestions = searchQuery.trim() 
        ? allQuestions.filter(item => 
            item.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
            item.a.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : null;

    // Build FAQPage Schema JSON-LD
    const faqSchemaItems = allQuestions.map(item => ({
        "@type": "Question",
        "name": item.q,
        "acceptedAnswer": {
            "@type": "Answer",
            "text": item.a
        }
    }));

    return (
        <div className="bg-ayur-beige/10 min-h-screen py-12 px-4 md:px-8 font-sans">
            <SEO
                title="Frequently Asked Questions (FAQ) | Karan Singh Vaidh Ayurveda"
                description="Find answers to common questions about Ayurvedic treatments, dosage safety, shipping, Cash on Delivery, and online doctor consultations with Karan Singh Vaidh."
                url="/faq"
                exact={true}
            >
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        "mainEntity": faqSchemaItems
                    })}
                </script>
            </SEO>

            <div className="max-w-5xl mx-auto">
                {/* Hero Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 mb-4 shadow-sm">
                        <HelpCircle size={32} />
                    </div>
                    <h1 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto text-base leading-relaxed">
                        Have questions about our Ayurvedic remedies, shipping, or consultations? Find clear, expert answers below.
                    </p>

                    {/* Search Bar */}
                    <div className="mt-8 max-w-xl mx-auto relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search questions (e.g. shipping, dosage, COD, side effects)..."
                            className="w-full pl-12 pr-4 py-4 rounded-full border border-gray-200 bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-sm md:text-base"
                        />
                    </div>
                </div>

                {/* Search Mode Output */}
                {filteredQuestions ? (
                    <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 mb-12">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">
                            Search Results ({filteredQuestions.length})
                        </h2>
                        {filteredQuestions.length === 0 ? (
                            <p className="text-gray-500 py-6 text-center">No matching questions found. Try different search terms or call customer support.</p>
                        ) : (
                            <div className="space-y-4">
                                {filteredQuestions.map((item) => (
                                    <div key={item.key} className="border border-gray-200 rounded-xl p-5 bg-gray-50/50">
                                        <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">{item.categoryTitle}</div>
                                        <h3 className="font-bold text-gray-900 text-base mb-2">{item.q}</h3>
                                        <p className="text-gray-700 text-sm leading-relaxed">{item.a}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        {/* Category Navigation Tabs */}
                        <div className="flex flex-wrap justify-center gap-3 mb-10">
                            {faqCategories.map((cat) => {
                                const Icon = cat.icon;
                                const isActive = activeCategory === cat.id;
                                return (
                                    <button
                                        key={cat.id}
                                        onClick={() => setActiveCategory(cat.id)}
                                        className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all shadow-sm ${
                                            isActive
                                                ? 'bg-emerald-700 text-white shadow-md'
                                                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                                        }`}
                                    >
                                        <Icon size={18} />
                                        <span>{cat.title}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Accordion Questions List */}
                        {faqCategories.map((cat, cIdx) => {
                            if (activeCategory !== cat.id) return null;
                            return (
                                <div key={cat.id} className="space-y-4 mb-12">
                                    {cat.questions.map((q, qIdx) => {
                                        const key = `${cIdx}-${qIdx}`;
                                        const isOpen = !!openIndices[key];
                                        return (
                                            <div
                                                key={qIdx}
                                                className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden transition-all duration-200 hover:border-emerald-300"
                                            >
                                                <button
                                                    onClick={() => toggleQuestion(cIdx, qIdx)}
                                                    className="w-full p-6 text-left font-bold text-gray-900 text-base md:text-lg flex justify-between items-center gap-4 focus:outline-none"
                                                >
                                                    <span className="flex-grow">{q.q}</span>
                                                    <ChevronDown
                                                        size={20}
                                                        className={`text-emerald-700 transition-transform duration-300 flex-shrink-0 ${
                                                            isOpen ? 'rotate-180' : ''
                                                        }`}
                                                    />
                                                </button>
                                                {isOpen && (
                                                    <div className="px-6 pb-6 pt-2 text-gray-700 text-sm md:text-base leading-relaxed border-t border-gray-100 bg-emerald-50/20">
                                                        {q.a}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </>
                )}

                {/* Consultation & Support Banner */}
                <div className="bg-gradient-to-r from-emerald-900 to-emerald-950 text-white rounded-3xl p-8 md:p-10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h3 className="text-xl md:text-2xl font-serif font-bold mb-2">Still have questions?</h3>
                        <p className="text-emerald-100 text-sm max-w-lg leading-relaxed">
                            Speak directly with our Ayurvedic support team or book a consultation with Karan Singh Vaidh.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-4 flex-shrink-0">
                        <Link
                            to="/contact"
                            className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold px-6 py-3 rounded-full text-sm shadow transition-all"
                        >
                            Contact Doctor
                        </Link>
                        <Link
                            to="/track-order"
                            className="bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3 rounded-full text-sm border border-white/20 transition-all"
                        >
                            Track Order
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FAQ;
