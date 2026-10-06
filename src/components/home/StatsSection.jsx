import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Globe } from 'lucide-react';
import happyPatientsIcon from '../../assets/happy_patients_icon.webp';
import customersWorldwideIcon from '../../assets/customers_worldwide_icon.webp';
import citiesCoveredIcon from '../../assets/cities_covered_icon.webp';
import yearsExperienceIcon from '../../assets/years_experience_icon.webp';
import resultGuaranteedIcon from '../../assets/result_guaranteed_icon.webp';

const AnimatedCounter = ({ target, suffix = '', isIndian = false }) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-30px" });

    useEffect(() => {
        if (!isInView) return;

        let startTime = null;
        const duration = 1800; // 1.8 seconds smooth count up

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease out expo for smooth finish
            const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const current = Math.floor(easeOut * target);

            setCount(current);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setCount(target);
            }
        };

        requestAnimationFrame(animate);
    }, [isInView, target]);

    const formatted = isIndian 
        ? count.toLocaleString('en-IN') 
        : count.toLocaleString('en-US');

    return (
        <span ref={ref}>
            {formatted}{suffix}
        </span>
    );
};

const statsData = [
    {
        target: 350000,
        suffix: "+",
        isIndian: true,
        label: "Happy Patients",
        desc: "Trusted by millions for holistic Ayurvedic healing",
        icon: happyPatientsIcon,
        isImg: true
    },
    {
        target: 150000,
        suffix: "+",
        isIndian: true,
        label: "Happy Customers",
        desc: "Delivering authentic Ayurvedic wellness worldwide",
        icon: customersWorldwideIcon,
        isImg: true
    },
    {
        target: 10,
        suffix: "+",
        isIndian: false,
        label: "Global Countries",
        desc: "Trusted healing across international borders",
        icon: Globe,
        isImg: false
    },
    {
        target: 4000,
        suffix: "+",
        isIndian: false,
        label: "Cities Covered",
        desc: "Traditional wisdom reaching nationwide communities",
        icon: citiesCoveredIcon,
        isImg: true
    },
    {
        target: 23,
        suffix: "+ Years",
        isIndian: false,
        label: "of Experience",
        desc: "Decades of clinical expertise in natural Ayurveda",
        icon: yearsExperienceIcon,
        isImg: true
    },
    {
        target: 95,
        suffix: "%+",
        isIndian: false,
        label: "Patient Satisfaction",
        desc: "High success rating reported by verified patients",
        icon: resultGuaranteedIcon,
        isImg: true
    },
];

const StatsSection = () => {
    return (
        <section className="relative z-10 w-full bg-white border-b border-gray-100 shadow-xs py-6 sm:py-8 md:py-10">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
                    {statsData.map((item, idx) => {
                        const IconComponent = !item.isImg ? item.icon : null;
                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: idx * 0.06 }}
                                className="group bg-[#FAF8F5] hover:bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4.5 border border-[#E8E2D9] hover:border-[#1A4D2E]/30 transition-all duration-300 shadow-2xs hover:shadow-md flex flex-col items-center text-center"
                            >
                                {/* Icon Badge */}
                                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white border border-[#E0D7CB] flex items-center justify-center p-2 mb-2 sm:mb-2.5 shadow-2xs group-hover:scale-110 group-hover:border-[#1A4D2E]/30 transition-transform duration-300 text-[#1A4D2E]">
                                    {item.isImg ? (
                                        <img
                                            loading="lazy"
                                            src={item.icon}
                                            alt={item.label}
                                            className="w-full h-full object-contain"
                                        />
                                    ) : (
                                        <IconComponent size={24} className="text-[#1A4D2E]" strokeWidth={2} />
                                    )}
                                </div>

                                {/* Animated Stat Number */}
                                <h3 className="text-lg sm:text-xl md:text-2xl font-sans font-extrabold text-[#1A4D2E] tracking-tight leading-tight">
                                    <AnimatedCounter 
                                        target={item.target} 
                                        suffix={item.suffix} 
                                        isIndian={item.isIndian} 
                                    />
                                </h3>

                                {/* Label */}
                                <p className="text-xs sm:text-[13px] font-bold text-[#8B5E34] mt-0.5 leading-snug">
                                    {item.label}
                                </p>

                                {/* Description */}
                                <p className="text-[10.5px] text-gray-500 leading-snug font-normal mt-1 hidden sm:block">
                                    {item.desc}
                                </p>

                                {/* Decorative Accent Line */}
                                <div className="w-7 h-[2px] bg-[#8B5E34]/30 rounded-full mt-2 sm:mt-2.5 group-hover:w-10 group-hover:bg-[#8B5E34] transition-all duration-300" />
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default StatsSection;
