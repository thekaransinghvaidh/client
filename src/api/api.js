import axios from "axios";

const REMOTE_API_ORIGIN = "https://server-pevq.onrender.com";

const getBaseURL = () => {
    if (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) {
        return window.location.origin;
    }

    const envUrl = import.meta.env.VITE_API_URL;
    if (
        envUrl &&
        envUrl !== "/" &&
        envUrl !== "" &&
        !envUrl.includes("thekaransinghvaidh.com") &&
        !envUrl.includes("the-karan-singh-vaidh.onrender.com") &&
        !envUrl.includes("the-karan-singh-vaidh-1.onrender.com")
    ) {
        return envUrl.replace(/\/$/, "");
    }

    return REMOTE_API_ORIGIN;
};

const BASE_URL = getBaseURL();
const API_ORIGIN = (BASE_URL !== undefined && BASE_URL !== "/") ? BASE_URL.replace(/\/$/, "") : REMOTE_API_ORIGIN;

const FALLBACK_IMAGE = "/logo.png";

export const getAssetUrl = (imagePath, width = 600) => {
    if (!imagePath || typeof imagePath !== "string") return FALLBACK_IMAGE;

    const trimmed = imagePath.trim();

    if (trimmed.includes("1769181213575") || trimmed === "/logo.png" || trimmed === "logo.png") {
        return FALLBACK_IMAGE;
    }

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

    if (trimmed.includes("ik.imagekit.io")) {
        return `${trimmed}?tr=w-${width},q-80,f-auto`;
    }

    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
        return trimmed;
    }

    let clean = trimmed.startsWith("/") ? trimmed.slice(1) : trimmed;

    if (clean.startsWith("uploads/")) {
        return `/${clean}`;
    }

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

api.interceptors.request.use((config) => {
    try {
        const userInfo = localStorage.getItem("userInfo");
        if (userInfo) {
            const parsed = JSON.parse(userInfo);
            if (parsed?.token) config.headers.Authorization = `Bearer ${parsed.token}`;
        }
    } catch {
        localStorage.removeItem("userInfo");
    }
    return config;
}, (e) => Promise.reject(e));

api.interceptors.response.use((r) => {
    if (typeof r.data === "string" && (r.data.trim().startsWith("<!") || r.data.trim().startsWith("<html"))) {
        if (r.config && !r.config._retriedRemote) {
            r.config._retriedRemote = true;
            r.config.baseURL = `${REMOTE_API_ORIGIN}/api`;
            return api.request(r.config);
        }
        return Promise.reject(new Error("Invalid JSON response from API"));
    }
    return r;
}, (e) => {
    const status = e.response?.status;
    if (
        e.config &&
        !e.config._retriedRemote &&
        (!e.response || status === 404 || status === 500 || status === 502 || status === 503 || status === 504) &&
        !String(e.config.baseURL || "").includes(REMOTE_API_ORIGIN)
    ) {
        e.config._retriedRemote = true;
        e.config.baseURL = `${REMOTE_API_ORIGIN}/api`;
        return api.request(e.config);
    }

    if (status === 401 && !window.location.pathname.includes("/login")) {
        localStorage.removeItem("userInfo");
        window.location.href = window.location.pathname.includes("/admin") ? "/admin/login" : "/login";
    }
    return Promise.reject(e);
});

if (typeof window !== "undefined" && window.location.hostname !== "localhost") {
    setInterval(() => {
        axios.get(`${REMOTE_API_ORIGIN}/api/version`).catch(() => {});
    }, 14 * 60 * 1000);
}

export default api;
