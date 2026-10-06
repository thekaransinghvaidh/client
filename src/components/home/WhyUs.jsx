import React from 'react';
import { Leaf, CalendarDays } from 'lucide-react';
import karanSir from '../../assets/karan sir 3.webp';
import happyPatientsIcon from '../../assets/happy_patients_icon.webp';
import customersWorldwideIcon from '../../assets/customers_worldwide_icon.webp';
import citiesCoveredIcon from '../../assets/cities_covered_icon.webp';
import yearsExperienceIcon from '../../assets/years_experience_icon.webp';
import resultGuaranteedIcon from '../../assets/result_guaranteed_icon.webp';

const reasons = [
    {
        stat: "3,50,000+",
        label: "Happy Patients",
        desc: "Trusted by millions worldwide for holistic Ayurvedic healing.",
        icon: happyPatientsIcon,
        bgColor: "bg-blue-50"
    },
    {
        stat: "1,50,000+",
        label: "Happy Customer Worldwide",
        desc: "Delivering authentic Ayurvedic wellness across continents.",
        icon: customersWorldwideIcon,
        bgColor: "bg-emerald-50"
    },
    {
        stat: "4000+",
        label: "Cities Covered",
        desc: "Bringing traditional wisdom to urban communities nationwide.",
        icon: citiesCoveredIcon,
        bgColor: "bg-amber-50"
    },
    {
        stat: "23 Years",
        label: "of Experience",
        desc: "Over two decades of expertise in Ayurvedic medicine.",
        icon: yearsExperienceIcon,
        bgColor: "bg-purple-50"
    },
    {
        stat: "95%+",
        label: "Patient Satisfaction",
        desc: "High rating and positive outcomes reported by our patients.",
        icon: resultGuaranteedIcon,
        bgColor: "bg-green-50"
    },
];

const WhyUs = () => {
    return (
        <section className="pt-8 pb-0 md:py-12 bg-white relative w-full">
            {/* Background Accent */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-ayur-green/20 to-transparent" />

            {/* ======================================= */}
            {/* DESKTOP VIEW (Original) */}
            {/* ======================================= */}
            <div className="hidden md:block w-full relative bg-[#EFE6DA] overflow-hidden border-y border-[#D8C7B5]/60 mb-12 md:mb-16">
                {/* Subtle Organic Background Curve Waves */}
                <div className="absolute inset-x-0 bottom-0 pointer-events-none w-full h-32 md:h-44 overflow-hidden z-0">
                    <svg
                        viewBox="0 0 1440 240"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-full h-full object-cover object-bottom"
                        preserveAspectRatio="none"
                    >
                        <path
                            d="M0,150 C320,230 480,210 720,205 C960,200 1180,235 1440,170 L1440,240 L0,240 Z"
                            fill="#C8B39B"
                            fillOpacity="0.4"
                        />
                        <path
                            d="M0,185 C280,135 520,225 720,225 C920,225 1160,165 1440,205 L1440,240 L0,240 Z"
                            fill="#DEC9B3"
                            fillOpacity="0.75"
                        />
                        <path
                            d="M0,215 C380,180 540,232 720,232 C900,232 1200,185 1440,220 L1440,240 L0,240 Z"
                            fill="#8A725A"
                            fillOpacity="0.25"
                        />
                    </svg>
                </div>

                <div className="w-full max-w-[1600px] mx-auto px-6 sm:px-10 md:px-14 lg:px-16 xl:px-20 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center pt-8 md:pt-10 lg:pt-8 pb-0">
                        {/* Left Column: Name & Title */}
                        <div className="lg:col-span-4 flex flex-col justify-center text-center lg:text-left order-1 lg:py-8">
                            <h3 className="font-playfair text-3xl sm:text-4xl lg:text-[42px] xl:text-[48px] font-bold text-[#14120E] tracking-tight leading-[1.12]">
                                Karan Singh Vaidh
                            </h3>
                            <p className="text-base sm:text-lg lg:text-xl xl:text-[22px] text-[#2D241D] font-normal mt-2 tracking-wide">
                                Ayurvedic Expert & Holistic Healer
                            </p>
                            
                            <div className="w-16 h-[3.5px] bg-[#A4753F] my-5 sm:my-6 rounded-full mx-auto lg:mx-0"></div>

                            <div className="text-xs sm:text-[13px] lg:text-[14px] font-bold uppercase tracking-[0.22em] text-[#221C16] leading-relaxed">
                                <div>RESTORING BALANCE</div>
                                <div>THROUGH AYURVEDA</div>
                            </div>
                        </div>

                        {/* Center Column: Doctor Portrait in Arched Container */}
                        <div className="lg:col-span-4 flex justify-center items-end self-end order-3 lg:order-2 pt-4">
                            <div className="w-60 sm:w-72 md:w-80 lg:w-[320px] xl:w-[360px] h-[340px] sm:h-[400px] md:h-[460px] lg:h-[490px] rounded-t-[140px] md:rounded-t-[180px] bg-gradient-to-b from-[#DFCDBC] to-[#D4BEA7] relative flex items-end justify-center overflow-hidden shadow-inner">
                                <img
                                    loading="lazy"
                                    src={karanSir}
                                    alt="Karan Singh Vaidh"
                                    className="w-full h-full object-cover object-top mix-blend-multiply relative z-10 scale-105 transform translate-y-1"
                                />
                            </div>
                        </div>

                        {/* Right Column: Total Experience & Bio */}
                        <div className="lg:col-span-4 flex flex-col justify-center text-center lg:text-left order-2 lg:order-3 lg:py-8">
                            <span className="text-xs sm:text-[13px] lg:text-[14px] font-bold uppercase tracking-[0.22em] text-[#332A22] block mb-1">
                                TOTAL EXPERIENCE
                            </span>
                            <div className="font-sans text-3xl sm:text-4xl md:text-5xl lg:text-[48px] xl:text-[54px] font-bold text-[#A4753F] leading-none mb-3 tracking-tight">
                                23+ Years
                            </div>
                            
                            <div className="w-16 h-[3.5px] bg-[#A4753F] mb-5 sm:mb-6 rounded-full mx-auto lg:mx-0"></div>

                            <p className="text-xs sm:text-sm md:text-base lg:text-[15.5px] text-[#332A22] leading-[1.7] font-normal max-w-md mx-auto lg:mx-0">
                                Karan Singh Vaidh is a renowned Ayurvedic vaidh with over 23 years of experience. He has been dedicated to restoring balance in modern lives through authentic Ayurveda. His clinical expertise is known widely for treating various ailments, ensuring lifelong wellness for every patient.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ======================================= */}
            {/* MOBILE VIEW (Image only) */}
            {/* ======================================= */}
            <div className="block md:hidden w-full relative mb-0">
                <img 
                    src="/Why%20Karan%20Singh%20Vaidh%20Mobile%20768%20X%20900px.png" 
                    alt="Why Karan Singh Vaidh" 
                    className="w-full h-auto object-contain"
                />
            </div>
        </section>
    );
};

export default WhyUs;
