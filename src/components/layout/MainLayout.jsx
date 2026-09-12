import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import FloatingActionButtons from './FloatingActionButtons';
import AuthPopup from './AuthPopup';

const MainLayout = ({ children }) => {
    const location = useLocation();
    const isPortalRoute = location.pathname.startsWith('/admin') || location.pathname.startsWith('/seo');

    if (isPortalRoute) {
        return (
            <div className="min-h-screen bg-slate-50 overflow-x-hidden w-full font-sans">
                {children}
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-ayur-beige/30 overflow-x-hidden w-full font-sans">
            <Header />
            <main className="flex-grow pt-20 bg-white min-h-[calc(100vh-80px)]">
                {children}
            </main>
            <FloatingActionButtons />
            <Footer />
            <AuthPopup />
        </div>
    );
};

export default MainLayout;
