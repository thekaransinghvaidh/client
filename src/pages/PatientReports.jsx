import React from 'react';
import { motion } from 'framer-motion';
import SEO from '../components/seo/SEO';
import { FileText, Eye, ShieldCheck, MessageCircle, MapPin, Download, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { metaPixelService } from '../services/metaPixel';

const PatientReports = () => {
    const trackPDFView = (name) => {
        metaPixelService.trackCustom('ViewReportsPDF', {
            content_name: name || 'Patient Medical Reports'
        });
    };

    const trackWhatsAppLead = () => {
        metaPixelService.trackContact({
            content_name: 'WhatsApp Reports Consultation'
        });
    };

    const pdfReports = [
        { 
            id: 1, 
            title: 'Patient Medical Report - Nitish Kumar (2026)', 
            category: 'Kidney Stone & Gallbladder Case',
            description: 'Comprehensive before & after ultrasound reports showing complete natural dissolution of stone without surgery.',
            file: '/REPORT 1 NITISH.pdf',
            date: 'January 2026'
        },
        { 
            id: 2, 
            title: 'General Patient Medical Reports (2025 Compilation)', 
            category: 'Multi-Condition Clinical Outcomes',
            description: 'A comprehensive collection of documented before & after lab results from our 2025 patient success stories across India.',
            file: '/REPORTS FOR WEBSITE.pdf',
            date: 'December 2025'
        }
    ];

    return (
        <div className="bg-[#FAF8F5] min-h-screen font-sans">
            <SEO 
                title="Patients Reports & Real Medical Evidence | Karan Singh Vaidh"
                description="Explore authentic patient medical reports, ultrasound scans, and clinical case studies demonstrating effective Ayurvedic treatments at Karan Singh Vaidh Hospital."
                keywords="Patient Reports, Ayurvedic Clinical Reports, Real Patient Stories, Karan Singh Vaidh Solan"
                url="/patient-reports"
                exact={true}
            />

            {/* 1. Real People's Real Stories Hero Section */}
            <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden font-sans">
                {/* Background Image & Overlay */}
                <div className="absolute inset-0 z-0">
                    <img 
                        loading="eager" 
                        src="https://img.freepik.com/free-photo/flat-lay-natural-medicinal-herbs_23-2148776511.jpg?w=1480"
                        alt="Ayurvedic Herbs Background"
                        className="w-full h-full object-cover scale-105"
                    />
                    {/* Premium Gradient Overlay */}
                    <div
                        className="absolute inset-0"
                        style={{
                            background: 'linear-gradient(to bottom, rgba(13, 46, 27, 0.94), rgba(13, 46, 27, 0.88))'
                        }}
                    ></div>
                    <div className="absolute inset-0 bg-black/10 mix-blend-overlay"></div>
                </div>

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="max-w-4xl mx-auto"
                    >
                        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-ayur-gold/30 bg-ayur-gold/10 backdrop-blur-md mb-6 shadow-xl">
                            <span className="w-2 h-2 rounded-full bg-ayur-gold animate-pulse"></span>
                            <span className="text-ayur-gold text-xs font-bold uppercase tracking-[0.25em]">Authentic Clinical Evidence</span>
                        </div>

                        {/* Headline */}
                        <h1 className="text-4xl md:text-6xl font-serif font-medium text-white mb-6 md:mb-8 tracking-wide leading-tight">
                            Real People's <span className="text-ayur-gold italic">Real Stories</span>
                        </h1>

                        {/* Description */}
                        <p className="text-gray-200 text-base md:text-xl leading-relaxed mb-10 max-w-3xl mx-auto font-light antialiased opacity-95">
                            We believe in transparency and authenticity. That is why real patient medical reports have been shared on our website. These case studies provide insight into the treatment approach, process, and outcomes, helping visitors evaluate the information objectively.
                        </p>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
                            {/* Secondary Button - Send Reports on WhatsApp */}
                            <a
                                href="https://wa.me/918091498454?text=Hi, I want to send my medical reports for consultation."
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={trackWhatsAppLead}
                                className="group relative w-full sm:w-auto overflow-hidden px-8 py-4 rounded-full border-2 border-ayur-gold/60 bg-ayur-gold/15 backdrop-blur-sm text-ayur-gold font-bold text-sm md:text-base tracking-wider uppercase transition-all duration-300 hover:bg-ayur-gold hover:text-[#0d2e1b] hover:border-ayur-gold hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] active:scale-95 text-center flex items-center justify-center gap-3 cursor-pointer"
                            >
                                <span>Send Your Reports</span>
                                <MessageCircle size={18} />
                            </a>

                            {/* Book Consultation Button */}
                            <Link
                                to="/book-appointment"
                                className="group relative w-full sm:w-auto overflow-hidden bg-white text-[#0d2e1b] px-8 py-4 rounded-full font-bold text-sm md:text-base tracking-wider uppercase transition-all duration-300 hover:bg-emerald-50 hover:shadow-xl active:scale-95 text-center flex items-center justify-center gap-3 cursor-pointer"
                            >
                                <span>Book Consultation</span>
                                <ArrowRight size={18} className="text-ayur-green group-hover:translate-x-1 transition-transform" />
                            </Link>

                            {/* GMB Button */}
                            <a
                                href="https://www.google.com/maps/place/KARAN+SINGH+VAIDH/@30.8959714,77.0929679,17z/data=!3m1!4b1!4m6!3m5!1s0x390f89cea1a75c47:0x1a68eda57c0d4c02!8m2!3d30.8959714!4d77.0929679!16s%2Fg%2F11y1m7q9_0"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative w-full sm:w-auto overflow-hidden px-8 py-4 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm text-white font-bold text-sm md:text-base tracking-wider uppercase transition-all duration-300 hover:bg-white hover:text-[#0d2e1b] active:scale-95 text-center flex items-center justify-center gap-3 cursor-pointer"
                            >
                                <span>Visit on Google Maps</span>
                                <MapPin size={18} />
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* 2. Documented Medical Reports Section */}
            <section className="py-16 md:py-20">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="text-center mb-12">
                        <span className="text-ayur-gold text-xs font-bold uppercase tracking-[0.3em] mb-3 block">
                            Documented Case Studies
                        </span>
                        <h2 className="text-3xl md:text-4xl font-serif text-[#0d2e1b] mb-4 font-bold">
                            Verified Patient Medical Reports
                        </h2>
                        <div className="w-20 h-1 bg-ayur-gold mx-auto rounded-full mb-5"></div>
                        <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
                            Browse original diagnostic lab tests, ultrasound records, and follow-up reports. Click on any report below to open or download the complete PDF case document.
                        </p>
                    </div>

                    {/* Report Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {pdfReports.map((report, index) => (
                            <motion.div 
                                key={report.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.15 }}
                                className="bg-white rounded-3xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col justify-between group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-ayur-green/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>

                                <div>
                                    <div className="flex items-center justify-between mb-5">
                                        <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-[#0d2e1b] group-hover:scale-110 group-hover:bg-[#0d2e1b] group-hover:text-white transition-all shadow-sm">
                                            <FileText size={28} />
                                        </div>
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-100 px-3 py-1 rounded-full">
                                            {report.date}
                                        </span>
                                    </div>

                                    <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-2">
                                        {report.category}
                                    </span>
                                    <h3 className="text-xl font-bold font-serif text-[#0d2e1b] mb-3">
                                        {report.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm leading-relaxed mb-6">
                                        {report.description}
                                    </p>
                                </div>
                                
                                <div className="pt-4 border-t border-gray-100 flex gap-3">
                                    <a 
                                        href={report.file}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={() => trackPDFView(report.title)}
                                        className="flex-1 bg-[#0d2e1b] hover:bg-[#164228] text-white text-center py-3 px-4 rounded-xl font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2"
                                    >
                                        <Eye size={18} />
                                        <span>View Report (PDF)</span>
                                    </a>
                                    <a 
                                        href={report.file}
                                        download
                                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-1.5"
                                        title="Download PDF"
                                    >
                                        <Download size={18} />
                                    </a>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Trust and Authenticity Note */}
                    <div className="mt-14 max-w-3xl mx-auto bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 mb-3">
                            <ShieldCheck size={24} />
                        </div>
                        <h4 className="font-serif font-bold text-lg text-[#0d2e1b] mb-2">
                            100% Authentic & Verifiable Patient Data
                        </h4>
                        <p className="text-xs md:text-sm text-gray-600 leading-relaxed max-w-xl mx-auto">
                            All patient medical reports, blood tests, and scans published here are documented with patient consent to educate visitors about natural Ayurvedic healing outcomes.
                        </p>
                    </div>

                </div>
            </section>
        </div>
    );
};

export default PatientReports;
