import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const SEORoute = () => {
    const userInfoRaw = localStorage.getItem('seoUserInfo') || localStorage.getItem('userInfo');
    let userInfo = null;
    try {
        if (userInfoRaw) {
            userInfo = JSON.parse(userInfoRaw);
        }
    } catch (e) {}

    // Allow access if logged in as SEO Executive or Admin
    if (userInfo && (userInfo.isSEO || userInfo.isAdmin || userInfo.token)) {
        return <Outlet />;
    }

    return <Navigate to="/seo/login" replace />;
};

export default SEORoute;
