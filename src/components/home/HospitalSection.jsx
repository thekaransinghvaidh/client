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
        <section className="pt-0 pb-0 bg-white relative overflow-hidden w-full">
            {/* Full-Width Hospital Section */}
            <div className="w-full relative bg-white overflow-hidden border-y border-gray-100 shadow-xs">
                <div className="w-full mx-auto flex flex-col lg:flex-row items-stretch">
                    {/* Left Column: Hospital Building Image */}
                    <div className="w-full lg:w-[46%] xl:w-[48%] relative h-56 sm:h-72 md:h-80 lg:h-auto lg:min-h-[380px] overflow-hidden shrink-0 bg-gray-50">
                        <img
                            loading="lazy"
                            src="/hospital-building.png"
                            alt="Karan Singh Vaidh Ayurvedic Hospital Solan"
                            className="w-full h-full object-cover object-center"
                        />
                        {/* Smooth Gradient Masks for Seamless Edge Blending */}
                        <div className="hidden lg:block absolute inset-y-0 right-0 w-28 bg-gradient-to-r from-transparent via-white/80 to-white pointer-events-none" />
                        <div className="lg:hidden absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent via-white/80 to-white pointer-events-none" />
                    </div>

                    {/* Middle & Right Content Columns */}
                    <div className="w-full lg:w-[54%] xl:w-[52%] px-5 py-7 sm:p-8 md:p-10 lg:py-10 lg:pr-12 lg:pl-8 flex flex-col justify-center relative z-10">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
                            {/* Middle Column: Titles & Description */}
                            <div className="lg:col-span-7 flex flex-col justify-center text-left">
                                <div className="flex items-center gap-2.5 sm:gap-3 mb-2.5 sm:mb-3">
                                    <span className="text-xs sm:text-[13px] font-bold uppercase tracking-[0.22em] text-[#332A22]">
                                        OUR HOSPITAL
                                    </span>
                                    <span className="w-10 sm:w-14 h-[2px] sm:h-[2.5px] bg-[#8B2E2E] rounded-full"></span>
                                </div>

                                <h3 className="font-sans text-2xl sm:text-3xl lg:text-[32px] xl:text-[36px] font-bold text-[#14120E] leading-[1.2] tracking-tight">
                                    Holistic Care, Real People,
                                    <span className="block text-[#8B2E2E] font-bold mt-1">
                                        Lasting Results
                                    </span>
                                </h3>

                                <p className="text-xs sm:text-sm lg:text-[14px] text-[#4A4036] leading-[1.65] font-normal mt-3.5 sm:mt-4 max-w-md">
                                    Visit our Ayurvedic hospital in Solan, Himachal Pradesh for a peaceful healing environment, personalized consultation, and natural treatments.
                                </p>
                            </div>

                            {/* Vertical Maroon Divider on Desktop */}
                            <div className="hidden lg:flex lg:col-span-1 justify-center h-full">
                                <div className="w-[1.5px] h-40 bg-[#8B2E2E]/30 rounded-full mx-auto self-center"></div>
                            </div>

                            {/* Right Column: 4 Feature Bullet Points */}
                            <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3.5 sm:gap-4 text-left">
                                {hospitalFeatures.map((item, index) => {
                                    const IconComp = item.icon;
                                    return (
                                        <div key={index} className="flex items-center gap-3 group p-1 sm:p-1.5 rounded-xl hover:bg-[#FDF7F4] transition-colors">
                                            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#F9ECE5] text-[#8B2E2E] flex items-center justify-center shrink-0 shadow-xs group-hover:bg-[#8B2E2E] group-hover:text-white transition-colors duration-300">
                                                <IconComp size={18} strokeWidth={2.2} />
                                            </div>
                                            <span className="text-xs sm:text-[13px] lg:text-[13.5px] font-semibold text-[#2D241D] leading-snug group-hover:text-[#8B2E2E] transition-colors">
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
