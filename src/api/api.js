import axios from "axios";

// ─────────────────────────────────────────────────────────────────────────────
// BASE URL Configuration
// ─────────────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
// BASE URL Configuration
// ─────────────────────────────────────────────────────────────────────────────
const getBaseURL = () => {
    // Priority 1: Environment variable (must be a valid backend URL, not just frontend domain without API proxy)
    const envUrl = import.meta.env.VITE_API_URL;
    if (envUrl && envUrl !== "/" && envUrl !== "" && !envUrl.includes("thekaransinghvaidh.com")) return envUrl;
    
    // Priority 2: Use current origin if running on localhost (Vite dev server proxy)
    if (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) {
        return window.location.origin;
    }

    // Default live production fallback: Render backend URL where API is active
    return "https://server-pevq.onrender.com";
};

const BASE_URL = getBaseURL();
const API_ORIGIN = (BASE_URL !== undefined && BASE_URL !== "/") ? BASE_URL.replace(/\/$/, "") : "https://server-pevq.onrender.com";

// ─────────────────────────────────────────────────────────────────────────────
// getAssetUrl  — FASTEST IMAGE LOADING LOGIC
// ─────────────────────────────────────────────────────────────────────────────
const FALLBACK_IMAGE = "/logo.png";

export const getAssetUrl = (imagePath, width = 600) => {
    if (!imagePath || typeof imagePath !== "string") return FALLBACK_IMAGE;

    const trimmed = imagePath.trim();

    // 1. ImageKit Magic (Auto-transorm for 10x Speed)
    if (trimmed.includes("ik.imagekit.io")) {
        return `${trimmed}?tr=w-${width},q-80,f-auto`;
    }

    // 2. Already Absolute URLs
    if (trimmed.startsWith("http")) {
        return trimmed;
    }

    // 3. Local Path Resolution
    let path = trimmed;
    // Remove leading slash for consistency
    if (path.startsWith("/")) path = path.slice(1);
    
    // Ensure it starts with uploads/ if it's a local filename
    if (!path.startsWith("uploads/") && !path.startsWith("static/")) {
        // If it's just a filename (no slashes) or looks like a typical upload filename
        if (!path.includes("/") || path.includes("image-") || path.includes("images-")) {
            path = `uploads/${path}`;
        }
    }

    // Return full absolute URL to avoid relative path issues on different ports
    return `${API_ORIGIN}/${path}`;
};

const api = axios.create({
    baseURL: `${API_ORIGIN}/api`,
    timeout: 30000,
});

// Auth & Error Interceptors
api.interceptors.request.use((config) => {
    try {
        const userInfo = localStorage.getItem("userInfo");
        if (userInfo) {
            const parsed = JSON.parse(userInfo);
            if (parsed?.token) config.headers.Authorization = `Bearer ${parsed.token}`;
        }
    } catch { localStorage.removeItem("userInfo"); }
    return config;
}, (e) => Promise.reject(e));

api.interceptors.response.use((r) => {
    // Guard: If response is an HTML document string instead of JSON (e.g., cPanel static rewrite fallback)
    if (typeof r.data === "string" && (r.data.trim().startsWith("<!") || r.data.trim().startsWith("<html"))) {
        return Promise.reject(new Error("API returned HTML instead of JSON data. Check backend URL configuration."));
    }
    return r;
}, (e) => {
    if (e.response?.status === 401 && !window.location.pathname.includes("/login")) {
        localStorage.removeItem("userInfo");
        window.location.href = window.location.pathname.includes("/admin") ? "/admin/login" : "/login";
    }
    return Promise.reject(e);
});

// Keep-alive only in production
if (window.location.hostname !== "localhost") {
    setInterval(() => { axios.get(`${API_ORIGIN}/api/version`).catch(() => {}); }, 14 * 60 * 1000);
}

export default api;
