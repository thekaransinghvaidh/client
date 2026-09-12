import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
    let userInfo = null;
    try {
        userInfo = JSON.parse(localStorage.getItem('userInfo'));
    } catch (e) {}

    // Block pure SEO users from main admin portal
    if (userInfo && userInfo.isSEO && !userInfo.isAdmin) {
        return <Navigate to="/seo/dashboard" replace />;
    }

    return userInfo && userInfo.isAdmin ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

export default AdminRoute;
