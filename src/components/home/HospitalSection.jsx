import React from 'react';
import { motion } from 'framer-motion';
import { UserCheck, Users, Sparkles, Handshake } from 'lucide-react';

const hospitalFeatures = [
    {
        title: "Personalized Consultation",
        icon: UserCheck
    },
    {
        title: "Experienced Ayurvedic Doctors",
        icon: Users
    },
    {
        title: "Peaceful Healing Environment",
        icon: Sparkles
    },
    {
        title: "Trusted by Patients Across India",
        icon: Handshake
    }
];

const HospitalSection = () => {
    return (
        <section className="py-6 md:py-10 bg-white relative overflow-hidden w-full">
            {/* Full-Width Hospital Banner Section */}
            <div className="w-full relative bg-white overflow-hidden border-y border-gray-100 shadow-sm">
                <div className="w-full max-w-[1700px] mx-auto min-h-[340px] md:min-h-[380px] flex flex-col lg:flex-row items-stretch">
                    {/* Left Column: Hospital Building Image with Smooth Fade */}
                    <div className="w-full lg:w-[46%] xl:w-[48%] relative min-h-[260px] sm:min-h-[320px] lg:min-h-[380px] overflow-hidden">
                        <img
                            loading="lazy"
                            src="/Our Hospital Desktop 1920 X 360 px.png"
                            alt="Karan Singh Vaidh Hospital Solan"
                            className="w-full h-full object-cover object-left"
                        />
                        {/* Smooth Gradient Mask into White Content */}
                        <div className="hidden lg:block absolute inset-y-0 right-0 w-36 bg-gradient-to-r from-transparent via-white/70 to-white pointer-events-none" />
                        <div className="lg:hidden absolute inset-x-0 bottom-0 h-20 bg-gradient-to-b from-transparent to-white pointer-events-none" />
                    </div>

                    {/* Middle & Right Content Columns */}
                    <div className="w-full lg:w-[54%] xl:w-[52%] p-6 sm:p-8 md:p-10 lg:py-10 lg:pr-12 lg:pl-6 flex flex-col justify-center relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center">
                            {/* Middle Column: Titles & Description */}
                            <div className="md:col-span-7 flex flex-col justify-center text-left">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="text-xs sm:text-[13px] font-bold uppercase tracking-[0.25em] text-[#332A22]">
                                        OUR HOSPITAL
                                    </span>
                                    <span className="w-12 sm:w-16 h-[2.5px] bg-[#8B2E2E] rounded-full"></span>
                                </div>

                                <h3 className="font-sans text-2xl sm:text-3xl lg:text-[34px] xl:text-[38px] font-bold text-[#14120E] leading-[1.18] tracking-tight">
                                    Holistic Care, Real People,
                                    <span className="block text-[#8B2E2E] font-bold mt-1">
                                        Lasting Results
                                    </span>
                                </h3>

                                <p className="text-xs sm:text-sm lg:text-[14.5px] text-[#4A4036] leading-[1.65] font-normal mt-4 max-w-md">
                                    Visit our Ayurvedic hospital in Solan, Himachal Pradesh for Peaceful Healing Environment personalized consultation and natural treatment.
                                </p>
                            </div>

                            {/* Vertical Maroon Divider on Desktop */}
                            <div className="hidden md:block md:col-span-1 flex justify-center h-full">
                                <div className="w-[2px] h-44 bg-[#8B2E2E]/80 rounded-full mx-auto"></div>
                            </div>

                            {/* Right Column: 4 Feature Bullet Points */}
                            <div className="md:col-span-4 flex flex-col justify-center space-y-4 text-left">
                                {hospitalFeatures.map((item, index) => {
                                    const IconComp = item.icon;
                                    return (
                                        <div key={index} className="flex items-center gap-3.5 group">
                                            <div className="w-10 h-10 rounded-full bg-[#F9ECE5] text-[#8B2E2E] flex items-center justify-center shrink-0 shadow-sm group-hover:bg-[#8B2E2E] group-hover:text-white transition-colors duration-300">
                                                <IconComp size={18} strokeWidth={2.2} />
                                            </div>
                                            <span className="text-xs sm:text-[13px] lg:text-[14px] font-semibold text-[#2D241D] leading-tight group-hover:text-[#8B2E2E] transition-colors">
                                                {item.title}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HospitalSection;
