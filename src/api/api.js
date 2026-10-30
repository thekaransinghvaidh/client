import axios from "axios";

// ─────────────────────────────────────────────────────────────────────────────
// BASE URL Configuration
// ─────────────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
// BASE URL Configuration
// ─────────────────────────────────────────────────────────────────────────────
const getBaseURL = () => {
    // Priority 1: When running on localhost, always use local Vite dev server proxy (/api -> http://localhost:5000)
    if (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) {
        return window.location.origin;
    }

    // Priority 2: Environment variable (must be a valid backend URL)
    const envUrl = import.meta.env.VITE_API_URL;
    if (envUrl && envUrl !== "/" && envUrl !== "" && !envUrl.includes("thekaransinghvaidh.com") && !envUrl.includes("server-pevq.onrender.com")) return envUrl;

    // Default live production fallback: Render backend URL where API is active
    return "https://the-karan-singh-vaidh.onrender.com";
};

const BASE_URL = getBaseURL();
const API_ORIGIN = (BASE_URL !== undefined && BASE_URL !== "/") ? BASE_URL.replace(/\/$/, "") : "https://the-karan-singh-vaidh.onrender.com";

// ─────────────────────────────────────────────────────────────────────────────
// getAssetUrl  — FASTEST IMAGE LOADING LOGIC
// ─────────────────────────────────────────────────────────────────────────────
const FALLBACK_IMAGE = "/logo.png";

export const getAssetUrl = (imagePath, width = 600) => {
    if (!imagePath || typeof imagePath !== "string") return FALLBACK_IMAGE;

    const trimmed = imagePath.trim();

    // 0. Filter out corrupted/dummy placeholder images
    if (trimmed.includes("1769181213575") || trimmed === "/logo.png" || trimmed === "logo.png") {
        return FALLBACK_IMAGE;
    }

    // 1. Data URLs, Blobs, and Vite internal asset paths
    if (
        trimmed.startsWith("data:") || 
        trimmed.startsWith("blob:") || 
        trimmed.startsWith("/src/") || 
        trimmed.startsWith("/assets/") ||
        trimmed.startsWith("assets/") ||
        trimmed.startsWith("/VIDHUVADHA")
    ) {
        return trimmed.startsWith("assets/") ? `/${trimmed}` : trimmed;
    }

    // 2. ImageKit URLs
    if (trimmed.includes("ik.imagekit.io")) {
        return `${trimmed}?tr=w-${width},q-80,f-auto`;
    }

    // 3. Absolute HTTP(S) URLs
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
        return trimmed;
    }

    // 4. Local Path Resolution
    let clean = trimmed.startsWith("/") ? trimmed.slice(1) : trimmed;

    // Direct match for uploads
    if (clean.startsWith("uploads/")) {
        return `/${clean}`;
    }

    // If it is an image file from uploads folder (e.g., Asthma-1st-..., image-..., etc.)
    if (
        clean.includes("Asthma-") ||
        clean.includes("image-") ||
        clean.includes("images-") ||
        clean.match(/^\d+-(image|images|Asthma)/) ||
        /\.(png|jpe?g|webp|gif|svg)$/i.test(clean)
    ) {
        return `/uploads/${clean}`;
    }

    return `/${clean}`;
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
