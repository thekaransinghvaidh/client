import React, { useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import SEO from '../components/seo/SEO';

const Disclaimer = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-24 pb-16">
            <SEO 
                title="Disclaimer | Karan Singh Vaidh"
                description="Disclaimer for The Karan Singh Vaidh website."
            />
            <div className="max-w-5xl mx-auto px-6 md:px-12">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#2C5F4F] to-[#3d7a67] rounded-full mb-6 shadow-lg">
                        <AlertCircle className="text-white" size={36} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Disclaimer</h1>
                </div>

                {/* Content */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-10 mb-8">
                    <p className="text-lg text-gray-700 leading-relaxed mb-6">
                        The information provided on this site is for educational and informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Results may vary from person to person depending on individual body response and health condition. Always consult a certified Ayurvedic practitioner or healthcare expert before starting any treatment.
                    </p>
                    <p className="text-lg text-gray-700 leading-relaxed">
                        <span className="font-semibold text-[#2C5F4F]">Note:</span> This website is not part of the Google website or Google Inc. Additionally, this site is NOT endorsed by Google in any way. GOOGLE is a trademark of GOOGLE, Inc.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Disclaimer;
