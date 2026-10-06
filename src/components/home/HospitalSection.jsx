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
            {/* ======================================= */}
            {/* DESKTOP VIEW (Image Banner) */}
            {/* ======================================= */}
            <div className="hidden lg:block w-full">
                <img 
                    src="/Our%20Hospital%20Desktop%201920%20X%20360%20px.png" 
                    alt="Our Hospital - Karan Singh Vaidh" 
                    className="w-full h-auto object-cover"
                />
            </div>

            {/* ======================================= */}
            {/* MOBILE VIEW (Image Banner) */}
            {/* ======================================= */}
            <div className="block lg:hidden w-full">
                <img 
                    src="/Our%20Hospital%20Mobile%20768%20x%20300%20px.png" 
                    alt="Our Hospital - Karan Singh Vaidh" 
                    className="w-full h-auto object-cover"
                />
            </div>
        </section>
    );
};

export default HospitalSection;
