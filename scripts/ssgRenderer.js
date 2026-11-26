import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CACHE_FILE = path.join(__dirname, 'ssg-data-cache.json');
const SITE_URL = 'https://thekaransinghvaidh.com';
const REMOTE_API = 'https://server-pevq.onrender.com/api';
const LOCAL_API = 'http://localhost:5000/api';

const escapeHtml = (str = '') =>
    String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

const toAbsoluteImageUrl = (imgPath) => {
    if (!imgPath || typeof imgPath !== 'string') return `${SITE_URL}/logo.png`;
    const trimmed = imgPath.trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
    const clean = trimmed.startsWith('/') ? trimmed.slice(1) : trimmed;
    if (clean.startsWith('uploads/')) return `${SITE_URL}/${clean}`;
    if (/\.(png|jpe?g|webp|gif|svg)$/i.test(clean) && !clean.startsWith('assets/')) {
        return `${SITE_URL}/uploads/${clean}`;
    }
    return `${SITE_URL}/${clean}`;
};

// Base Organization, MedicalBusiness, Doctor, and WebSite JSON-LD graph nodes
const getBaseSchemaGraph = () => [
    {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: 'Karan Singh Vaidh',
        url: `${SITE_URL}/`,
        logo: `${SITE_URL}/logo.png`,
        sameAs: [
            'https://www.youtube.com/c/karansinghvaidhhp',
            'https://www.facebook.com/AncientAyurvedas.org/',
            'https://www.instagram.com/karan_singh_vaidh/',
            'https://www.linkedin.com/in/karan-singh-vaidh-hp-56a903204?originalSubdomain=in'
        ],
        contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+91-8091498454',
            contactType: 'Customer Support',
            areaServed: 'IN',
            availableLanguage: ['Hindi', 'English']
        }
    },
    {
        '@type': 'MedicalBusiness',
        '@id': `${SITE_URL}/#localbusiness`,
        name: 'Karan Singh Vaidh Ayurvedic Hospital',
        image: `${SITE_URL}/logo.png`,
        address: {
            '@type': 'PostalAddress',
            streetAddress: 'Radhasoami Satsang Ghar Road, Rebuan, Deoghat, Anji',
            addressLocality: 'Solan',
            addressRegion: 'Himachal Pradesh',
            postalCode: '173211',
            addressCountry: 'IN'
        },
        telephone: '+91-8091498454',
        openingHours: 'Mo-Su 10:00-17:00',
        priceRange: '₹₹',
        areaServed: 'India'
    },
    {
        '@type': 'Person',
        '@id': `${SITE_URL}/#doctor`,
        name: 'Karan Singh Vaidh',
        jobTitle: 'Ayurvedic Doctor',
        worksFor: { '@id': `${SITE_URL}/#organization` },
        description: 'Experienced Ayurvedic doctor specializing in chronic disease treatment using natural herbal formulations.',
        address: {
            '@type': 'PostalAddress',
            addressLocality: 'Solan',
            addressRegion: 'Himachal Pradesh',
            addressCountry: 'India'
        }
    },
    {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: 'Karan Singh Vaidh Ayurveda',
        publisher: { '@id': `${SITE_URL}/#organization` },
        potentialAction: {
            '@type': 'SearchAction',
            target: `${SITE_URL}/ayurvedic-products?s={search_term_string}`,
            'query-input': 'required name=search_term_string'
        }
    }
];

// Category & Treatment Pages SEO Map
export const CATEGORY_SEO_ROUTES = {
    '/ayurvedic-products': {
        category: 'All',
        title: 'Buy Ayurvedic Medicines Online | 100% Natural Remedies',
        description: 'Buy Ayurvedic Medicine Online made with natural ingredients for better wellness. Shop trusted Ayurvedic remedies to support immunity, digestion, and overall health naturally.',
        keywords: 'Ayurvedic Medicines Online, Natural Ayurvedic Remedies, Karan Singh Vaidh Products',
        h1: 'Buy Ayurvedic Medicines Online for Better Health',
        canonical: '/ayurvedic-products'
    },
    '/ayurvedic-treatment-products': {
        category: 'All',
        title: 'Ayurvedic Treatment Products | Buy Natural Medicine Online',
        description: 'Buy Ayurvedic Treatment Products made with natural ingredients. Shop trusted Ayurvedic Medicine for better health, daily wellness and safe natural care. Order online today.',
        keywords: 'Ayurvedic Treatment Products, Natural Ayurvedic Medicines',
        h1: 'Ayurvedic Treatment Products for Better Health',
        canonical: '/ayurvedic-treatment-products'
    },
    '/ayurvedic-asthma-treatment': {
        category: 'Asthma',
        title: 'Ayurvedic Asthma Treatment | Natural Ayurvedic Medicine',
        description: 'Buy Ayurvedic Asthma Treatment online with natural Ayurvedic Medicine. Support healthy breathing, manage asthma symptoms, and promote better respiratory wellness naturally.',
        keywords: 'Ayurvedic Asthma Treatment, Natural Asthma Medicine',
        h1: 'Best Ayurvedic Asthma Treatment with Natural Ayurvedic Medicine',
        canonical: '/ayurvedic-asthma-treatment'
    },
    '/ayurvedic-asthma-treatment-in-solan': {
        category: 'Asthma',
        title: 'Ayurvedic Asthma Treatment in Solan | Natural Ayurvedic Medicine',
        description: 'Buy Ayurvedic Asthma Treatment online with natural Ayurvedic Medicine. Support healthy breathing, manage asthma symptoms, and promote better respiratory wellness naturally.',
        keywords: 'Ayurvedic Asthma Treatment in Solan, Asthma Doctor Solan',
        h1: 'Best Ayurvedic Asthma Treatment with Natural Ayurvedic Medicine',
        canonical: '/ayurvedic-asthma-treatment'
    },
    '/gallbladder-stone-ayurvedic-treatment': {
        category: 'Gall Bladder',
        title: 'Best Gall Bladder Stone Ayurvedic Treatment Without Surgery Now',
        description: 'Get effective Gall Bladder Stone Ayurvedic Treatment with natural Ayurvedic Medicine. Helps support digestion, reduce discomfort and promote healthy gallbladder function. Shop now!',
        keywords: 'Gall Bladder Stone Ayurvedic Treatment, Gallstone Natural Remedy',
        h1: 'Gall Bladder Stone Ayurvedic Treatment | Natural Relief Guide!!',
        canonical: '/gallbladder-stone-ayurvedic-treatment'
    },
    '/gallbladder-stone-ayurvedic-treatment-in-solan': {
        category: 'Gall Bladder',
        title: 'Best Gall Bladder Stone Ayurvedic Treatment in Solan Without Surgery',
        description: 'Get effective Gall Bladder Stone Ayurvedic Treatment with natural Ayurvedic Medicine. Helps support digestion, reduce discomfort and promote healthy gallbladder function. Shop now!',
        keywords: 'Gall Bladder Stone Ayurvedic Treatment in Solan',
        h1: 'Gall Bladder Stone Ayurvedic Treatment | Natural Relief Guide!!',
        canonical: '/gallbladder-stone-ayurvedic-treatment'
    },
    '/ayurvedic-piles-treatment': {
        category: 'Piles',
        title: 'Ayurvedic Piles Treatment | Natural Relief Without Surgery',
        description: 'Get safe Ayurvedic Piles Treatment with natural Ayurvedic Medicine. Helps manage pain, swelling and bleeding naturally. Shop trusted Ayurvedic remedies online today.',
        keywords: 'Ayurvedic Piles Treatment, Natural Piles Medicine',
        h1: 'Ayurvedic Piles Treatment for Natural & Lasting Relief',
        canonical: '/ayurvedic-piles-treatment'
    },
    '/ayurvedic-piles-treatment-in-solan': {
        category: 'Piles',
        title: 'Ayurvedic Piles Treatment in Solan | Natural Relief Without Surgery',
        description: 'Get safe Ayurvedic Piles Treatment with natural Ayurvedic Medicine. Helps manage pain, swelling and bleeding naturally. Shop trusted Ayurvedic remedies online today.',
        keywords: 'Ayurvedic Piles Treatment in Solan',
        h1: 'Ayurvedic Piles Treatment for Natural & Lasting Relief',
        canonical: '/ayurvedic-piles-treatment'
    },
    '/ayurvedic-gastric-treatment': {
        category: 'Gastric',
        title: 'Buy Ayurvedic Gastric Treatment for Acidity & Gas',
        description: 'Buy Ayurvedic Gastric Treatment Medicine online for natural relief from acidity, gas, bloating and indigestion. Safe Ayurvedic Medicine with fast delivery. Order now!',
        keywords: 'Ayurvedic Gastric Treatment, Acidity & Gas Medicine',
        h1: 'Ayurvedic Gastric Treatment for Natural Digestive Relief',
        canonical: '/ayurvedic-gastric-treatment'
    },
    '/ayurvedic-gastric-treatment-in-solan': {
        category: 'Gastric',
        title: 'Ayurvedic Gastric Treatment in Solan for Acidity & Gas',
        description: 'Buy Ayurvedic Gastric Treatment Medicine online for natural relief from acidity, gas, bloating and indigestion. Safe Ayurvedic Medicine with fast delivery. Order now!',
        keywords: 'Ayurvedic Gastric Treatment in Solan',
        h1: 'Ayurvedic Gastric Treatment for Natural Digestive Relief',
        canonical: '/ayurvedic-gastric-treatment'
    },
    '/ayurvedic-diabetes-treatment': {
        category: 'Diabetes',
        title: 'Ayurvedic Diabetes Treatment for Healthy Blood Sugar',
        description: 'Choose Ayurvedic Diabetes Treatment with natural Ayurvedic Medicine. Support balanced blood sugar levels, improve overall wellness, and enjoy safe Ayurvedic care every day.',
        keywords: 'Ayurvedic Diabetes Treatment, Blood Sugar Control Ayurveda',
        h1: 'Best Ayurvedic Diabetes Treatment with Natural Medicine',
        canonical: '/ayurvedic-diabetes-treatment'
    },
    '/ayurvedic-diabetes-treatment-in-solan': {
        category: 'Diabetes',
        title: 'Ayurvedic Diabetes Treatment in Solan for Healthy Blood Sugar',
        description: 'Choose Ayurvedic Diabetes Treatment with natural Ayurvedic Medicine. Support balanced blood sugar levels, improve overall wellness, and enjoy safe Ayurvedic care every day.',
        keywords: 'Ayurvedic Diabetes Treatment in Solan',
        h1: 'Best Ayurvedic Diabetes Treatment with Natural Medicine',
        canonical: '/ayurvedic-diabetes-treatment'
    },
    '/ayurvedic-tuberculosis-support': {
        category: 'Tuberculosis (TB)',
        title: 'Ayurvedic Tuberculosis Support | Natural Care',
        description: 'Ayurvedic Tuberculosis Support with natural Ayurvedic Medicine to help support immunity, strength, and recovery naturally. Get safe Ayurvedic care and order online today.',
        keywords: 'Ayurvedic Tuberculosis Support, TB Respiratory Immunity Ayurveda',
        h1: 'Best Ayurvedic Tuberculosis Support for Better Health',
        canonical: '/ayurvedic-tuberculosis-support'
    },
    '/ayurvedic-tuberculosis-support-in-solan': {
        category: 'Tuberculosis (TB)',
        title: 'Ayurvedic Tuberculosis Support in Solan | Natural Care',
        description: 'Ayurvedic Tuberculosis Support with natural Ayurvedic Medicine to help support immunity, strength, and recovery naturally. Get safe Ayurvedic care and order online today.',
        keywords: 'Ayurvedic Tuberculosis Support in Solan',
        h1: 'Best Ayurvedic Tuberculosis Support for Better Health',
        canonical: '/ayurvedic-tuberculosis-support'
    },
    '/ayurvedic-migraine-treatment': {
        category: 'Migraine',
        title: 'Ayurvedic Migraine Treatment | Natural Pain Relief',
        description: 'Get lasting relief with Ayurvedic Migraine Treatment using natural Ayurvedic Medicine. Reduce headaches, stress & migraine attacks with trusted Ayurvedic solutions. Shop now.',
        keywords: 'Ayurvedic Migraine Treatment, Natural Headache Relief',
        h1: 'Best Ayurvedic Migraine Treatment with Ayurvedic Medicine',
        canonical: '/ayurvedic-migraine-treatment'
    },
    '/ayurvedic-migraine-treatment-in-solan': {
        category: 'Migraine',
        title: 'Ayurvedic Migraine Treatment in Solan | Natural Pain Relief',
        description: 'Get lasting relief with Ayurvedic Migraine Treatment using natural Ayurvedic Medicine. Reduce headaches, stress & migraine attacks with trusted Ayurvedic solutions. Shop now.',
        keywords: 'Ayurvedic Migraine Treatment in Solan',
        h1: 'Best Ayurvedic Migraine Treatment with Ayurvedic Medicine',
        canonical: '/ayurvedic-migraine-treatment'
    },
    '/ayurvedic-thyroid-treatment': {
        category: 'Thyroid',
        title: 'Best Ayurvedic Thyroid Treatment | Natural Medicine',
        description: 'Get the best Ayurvedic Thyroid Treatment with natural Ayurvedic Medicine. Support thyroid balance, reduce symptoms, improve energy levels and promote healthy living naturally.',
        keywords: 'Ayurvedic Thyroid Treatment, Natural Thyroid Balance',
        h1: 'Best Ayurvedic Thyroid Treatment for Natural Hormone Balance',
        canonical: '/ayurvedic-thyroid-treatment'
    },
    '/ayurvedic-thyroid-treatment-in-solan': {
        category: 'Thyroid',
        title: 'Best Ayurvedic Thyroid Treatment in Solan | Natural Medicine',
        description: 'Get the best Ayurvedic Thyroid Treatment with natural Ayurvedic Medicine. Support thyroid balance, reduce symptoms, improve energy levels and promote healthy living naturally.',
        keywords: 'Ayurvedic Thyroid Treatment in Solan',
        h1: 'Best Ayurvedic Thyroid Treatment for Natural Hormone Balance',
        canonical: '/ayurvedic-thyroid-treatment'
    },
    '/kidney-stone-ayurvedic-treatment': {
        category: 'Kidney Stone',
        title: 'Kidney Stone Ayurvedic Treatment | Natural Medicine',
        description: 'Get effective Kidney Stone Ayurvedic Treatment with natural Ayurvedic Medicine that helps reduce pain, support stone management, and promote better kidney health. Order online today!',
        keywords: 'Kidney Stone Ayurvedic Treatment, Renal Calculi Natural Remedy',
        h1: 'Best Kidney Stone Ayurvedic Treatment with Ayurvedic Medicine',
        canonical: '/kidney-stone-ayurvedic-treatment'
    },
    '/kidney-stone-ayurvedic-treatment-in-solan': {
        category: 'Kidney Stone',
        title: 'Kidney Stone Ayurvedic Treatment in Solan | Natural Medicine',
        description: 'Get effective Kidney Stone Ayurvedic Treatment with natural Ayurvedic Medicine that helps reduce pain, support stone management, and promote better kidney health. Order online today!',
        keywords: 'Kidney Stone Ayurvedic Treatment in Solan',
        h1: 'Best Kidney Stone Ayurvedic Treatment with Ayurvedic Medicine',
        canonical: '/kidney-stone-ayurvedic-treatment'
    },
    '/high-blood-pressure-ayurvedic-treatment': {
        category: 'Hypertension',
        title: 'Buy High Blood Pressure Ayurvedic Treatment | Karan Singh Vaidh',
        description: 'Shop natural Ayurvedic Medicine for High Blood Pressure & Hypertension by Karan Singh Vaidh. Formulated with Arjuna, Sarpagandha & Brahmi.',
        keywords: 'Ayurvedic Medicine for High Blood Pressure, Hypertension Treatment',
        h1: 'Best High Blood Pressure Ayurvedic Treatment | Natural Care',
        canonical: '/high-blood-pressure-ayurvedic-treatment'
    },
    '/hypertension-ayurvedic-treatment': {
        category: 'Hypertension',
        title: 'Buy High Blood Pressure Ayurvedic Treatment | Karan Singh Vaidh',
        description: 'Shop natural Ayurvedic Medicine for High Blood Pressure & Hypertension by Karan Singh Vaidh. Formulated with Arjuna, Sarpagandha & Brahmi.',
        keywords: 'Ayurvedic Medicine for High Blood Pressure, Hypertension Treatment',
        h1: 'Best High Blood Pressure Ayurvedic Treatment | Natural Care',
        canonical: '/high-blood-pressure-ayurvedic-treatment'
    },
    '/ayurvedic-hypertension-treatment': {
        category: 'Hypertension',
        title: 'Buy High Blood Pressure Ayurvedic Treatment | Karan Singh Vaidh',
        description: 'Shop natural Ayurvedic Medicine for High Blood Pressure & Hypertension by Karan Singh Vaidh. Formulated with Arjuna, Sarpagandha & Brahmi.',
        keywords: 'Ayurvedic Medicine for High Blood Pressure, Hypertension Treatment',
        h1: 'Best High Blood Pressure Ayurvedic Treatment | Natural Care',
        canonical: '/high-blood-pressure-ayurvedic-treatment'
    }
};

// Core Static Pages SEO Map
export const STATIC_PAGE_SEO = {
    '/': {
        title: 'Best Ayurvedic Doctor in Solan | Natural Ayurvedic Treatment',
        description: 'Looking for the best Ayurvedic Doctor in Solan? Get natural treatment for kidney stones, piles, diabetes, thyroid & more. Book your consultation today!',
        keywords: 'Ayurvedic Doctor in Solan, Karan Singh Vaidh, Ayurvedic Hospital Solan, Natural Ayurvedic Treatment',
        h1: 'Authentic Himalayan Ayurvedic Treatment by Karan Singh Vaidh in Solan',
        canonical: '/'
    },
    '/about-ayurvedic-doctor-in-solan': {
        title: 'Ayurveda Specialist in Himachal Pradesh | Natural Healing',
        description: 'Find Ayurveda Specialist in Himachal Pradesh for natural treatment. Experience safe, effective & personalized Ayurvedic healing for long-term wellness.',
        keywords: 'Ayurveda Specialist in Himachal Pradesh, Karan Singh Vaidh Solan, About Karan Singh Vaidh',
        h1: 'Dr. Karan Singh Vaidh — Trusted Ayurveda Specialist in Himachal Pradesh',
        canonical: '/about-ayurvedic-doctor-in-solan'
    },
    '/contact': {
        title: 'Contact Ayurvedic Clinic in Solan | Get Expert Care',
        description: 'Contact Ayurvedic Clinic in Solan to get expert Ayurvedic advice. Book consultation for natural treatment, personalized care & holistic healing support.',
        keywords: 'Contact Ayurvedic Clinic, Karan Singh Vaidh Contact Number, Solan Ayurvedic Hospital Address',
        h1: 'Contact Karan Singh Vaidh Ayurvedic Clinic in Solan',
        canonical: '/contact'
    },
    '/book-appointment': {
        title: 'Book an Appointment | The Karan Singh Vaidh',
        description: 'Book your consultation appointment with Karan Singh Vaidh. Choose your service, preferred date and time for expert Ayurvedic guidance.',
        keywords: 'Book Ayurvedic Appointment, Online Ayurvedic Consultation Solan, Karan Singh Vaidh Appointment',
        h1: 'Book an Ayurvedic Consultation Appointment with Karan Singh Vaidh',
        canonical: '/book-appointment'
    },
    '/patient-reports': {
        title: 'Patients Reports & Real Medical Evidence | Karan Singh Vaidh',
        description: 'Explore authentic patient medical reports, ultrasound scans, and clinical case studies demonstrating effective Ayurvedic treatments at Karan Singh Vaidh Hospital.',
        keywords: 'Patient Reports, Ayurvedic Clinical Reports, Real Patient Stories, Karan Singh Vaidh Solan',
        h1: 'Verified Patient Medical Reports & Clinical Results',
        canonical: '/patient-reports'
    },
    '/blogs': {
        title: 'Ayurvedic Health Blogs & Remedies | Dr. Karan Singh Vaidh',
        description: 'Read authentic Ayurvedic health blogs, herbal remedies for chronic care, asthma, high blood pressure, and kidney stones by Dr. Karan Singh Vaidh.',
        keywords: 'Ayurvedic Health Blogs, Herbal Remedies Guide, Karan Singh Vaidh Articles',
        h1: 'Ayurvedic Health Blogs & Clinical Wellness Guides',
        canonical: '/blogs'
    },
    '/ayurvedic-blogs': {
        title: 'Ayurvedic Health Blogs & Remedies | Dr. Karan Singh Vaidh',
        description: 'Read authentic Ayurvedic health blogs, herbal remedies for chronic care, asthma, high blood pressure, and kidney stones by Dr. Karan Singh Vaidh.',
        keywords: 'Ayurvedic Health Blogs, Herbal Remedies Guide, Karan Singh Vaidh Articles',
        h1: 'Ayurvedic Health Blogs & Clinical Wellness Guides',
        canonical: '/blogs'
    },
    '/faq': {
        title: 'Frequently Asked Questions (FAQ) | Karan Singh Vaidh Ayurveda',
        description: 'Find answers to common questions about Ayurvedic treatments, dosage safety, shipping, Cash on Delivery, and online doctor consultations with Karan Singh Vaidh.',
        keywords: 'Ayurvedic Treatment FAQs, Karan Singh Vaidh FAQ',
        h1: 'Frequently Asked Questions (FAQ) — Ayurvedic Treatment & Care',
        canonical: '/faq'
    },
    '/track-order': {
        title: 'Track Your Order | Karan Singh Vaidh Ayurveda',
        description: 'Track the status of your Ayurvedic order online. Enter your Order ID or registered phone number to get live shipping and delivery details.',
        keywords: 'Track Ayurvedic Order, Karan Singh Vaidh Order Tracking',
        h1: 'Track Your Ayurvedic Medicine Order',
        canonical: '/track-order'
    },
    '/privacy': {
        title: 'Privacy Policy | Secure & Trusted - Karan Singh Vaidh',
        description: 'Read our Privacy Policy to understand how we collect, use, and protect your personal information at The Karan Singh Vaidh.',
        keywords: 'Privacy Policy, Karan Singh Vaidh',
        h1: 'Privacy Policy — The Karan Singh Vaidh',
        canonical: '/privacy'
    },
    '/disclaimer': {
        title: 'Disclaimer | Karan Singh Vaidh',
        description: 'Medical and website disclaimer for The Karan Singh Vaidh Ayurvedic treatments and herbal formulations.',
        keywords: 'Medical Disclaimer, Karan Singh Vaidh',
        h1: 'Medical & Website Disclaimer — The Karan Singh Vaidh',
        canonical: '/disclaimer'
    },
    '/terms': {
        title: 'Terms & Conditions | Reliable Ayurvedic Care - Karan Singh Vaidh',
        description: 'Review the Terms & Conditions for using the services and products provided by The Karan Singh Vaidh.',
        keywords: 'Terms and Conditions, Karan Singh Vaidh',
        h1: 'Terms & Conditions — The Karan Singh Vaidh',
        canonical: '/terms'
    },
    '/shipping': {
        title: 'Shipping Policy | Fast & Secure Delivery - Karan Singh Vaidh',
        description: 'Learn about our shipping rates, delivery timelines, and order tracking process at The Karan Singh Vaidh.',
        keywords: 'Shipping Policy, Karan Singh Vaidh Delivery',
        h1: 'Shipping & Delivery Policy — The Karan Singh Vaidh',
        canonical: '/shipping'
    },
    '/cancellation': {
        title: 'Refund & Cancellation | Hassle-Free Returns - Karan Singh Vaidh',
        description: 'Understand our policies regarding order cancellations, returns, and refunds at The Karan Singh Vaidh.',
        keywords: 'Refund Policy, Cancellation Policy, Karan Singh Vaidh',
        h1: 'Refund & Cancellation Policy — The Karan Singh Vaidh',
        canonical: '/cancellation'
    }
};

export const SLUG_ALIASES = {
    'gastritis-digestion-ayurvedic-treatment': 'gastritis-ayurvedic-treatment',
    'psoriasis-and-skin-allergy-ayurvedic-treatment': 'psoriasis-skin-allergy-ayurvedic-treatment',
    'tbtuberculosis-ayurvedic-treatment': 'tuberculosis-ayurvedic-support',
    'erectile-dysfunction-ayurvedic-treatment': 'erectile-dysfunction',
    'liver-fatty-liver-ayurvedic-treatment': 'fatty-liver',
    'fatty-liver-ayurvedic-treatment': 'fatty-liver',
    'gall-bladder-ayurvedic-treatment': 'gall-bladder',
    'fibroid-ayurvedic-treatment': 'fibroid',
    'diabetes-ayurvedic-treatment': 'diabetes',
    'cyst-ayurvedic-treatment': 'cyst',
    'constipation-ayurvedic-treatment': 'constipation',
    'ortho-arthritis-joint-pain-ayurvedic-treatment': 'ortho-arthritis-joint-pain',
    'over-weight-ayurvedic-treatment': 'weight-loss-ayurvedic-treatment'
};

/**
 * Fetch live products and blogs from backend API (with disk cache fallback)
 */
export async function fetchSSGData() {
    let products = [];
    let blogs = [];

    const tryFetchJson = async (url) => {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 15000);
        try {
            const res = await fetch(url, { signal: controller.signal });
            clearTimeout(timer);
            if (!res.ok) return null;
            return await res.json();
        } catch {
            clearTimeout(timer);
            return null;
        }
    };

    // Fetch Products (Try Local first, then Remote Render API)
    let prodRes = await tryFetchJson(`${LOCAL_API}/products`);
    if (!Array.isArray(prodRes) || prodRes.length === 0) {
        prodRes = await tryFetchJson(`${REMOTE_API}/products`);
    }
    if (Array.isArray(prodRes) && prodRes.length > 0) {
        products = prodRes;
    }

    // Fetch Blogs (Try Local first, then Remote Render API)
    let blogRes = await tryFetchJson(`${LOCAL_API}/blogs?pageSize=100`);
    if (!blogRes || !Array.isArray(blogRes.blogs)) {
        blogRes = await tryFetchJson(`${REMOTE_API}/blogs?pageSize=100`);
    }
    if (blogRes && Array.isArray(blogRes.blogs)) {
        blogs = blogRes.blogs;
    }

    // Save or load from cache file
    if (products.length > 0) {
        try {
            fs.writeFileSync(CACHE_FILE, JSON.stringify({ products, blogs, updatedAt: new Date().toISOString() }, null, 2), 'utf8');
        } catch {}
    } else if (fs.existsSync(CACHE_FILE)) {
        try {
            const cached = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
            if (Array.isArray(cached.products)) products = cached.products;
            if (Array.isArray(cached.blogs) && blogs.length === 0) blogs = cached.blogs;
        } catch {}
    }

    return { products, blogs };
}

const renderNavigationHtml = () => `
<header class="ssg-header" style="background:#ffffff;border-bottom:1px solid #e5e7eb;">
  <div style="max-width:1280px;margin:0 auto;padding:16px 24px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px;">
    <a href="/" style="font-weight:800;font-size:20px;color:#0d2e1b;text-decoration:none;">Karan Singh Vaidh — Ancient Ayurvedas</a>
    <nav aria-label="Main Navigation" style="display:flex;gap:20px;flex-wrap:wrap;">
      <a href="/" style="color:#1f2937;text-decoration:none;">Home</a>
      <a href="/ayurvedic-products" style="color:#1f2937;text-decoration:none;">Shop Medicines</a>
      <a href="/book-appointment" style="color:#1f2937;text-decoration:none;">Book Appointment</a>
      <a href="/blogs" style="color:#1f2937;text-decoration:none;">Blogs</a>
      <a href="/patient-reports" style="color:#1f2937;text-decoration:none;">Patient Reports</a>
      <a href="/about-ayurvedic-doctor-in-solan" style="color:#1f2937;text-decoration:none;">About Us</a>
      <a href="/contact" style="color:#1f2937;text-decoration:none;">Contact</a>
      <a href="/faq" style="color:#1f2937;text-decoration:none;">FAQ</a>
    </nav>
  </div>
</header>`;

const renderFooterHtml = (products = []) => {
    const productLinks = products.slice(0, 16).map(p =>
        `<li><a href="/product/${escapeHtml(p.slug)}" style="color:#d1fae5;text-decoration:none;">${escapeHtml(p.name)}</a></li>`
    ).join('\n        ');

    return `
<footer class="ssg-footer" style="background:#0d2e1b;color:#f3f4f6;padding:48px 24px;margin-top:48px;">
  <div style="max-width:1280px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:32px;">
    <div>
      <h2 style="font-size:18px;font-weight:700;color:#ffffff;margin-bottom:12px;">Karan Singh Vaidh Ayurvedic Hospital</h2>
      <p style="font-size:14px;line-height:1.6;color:#d1d5db;">Radhasoami Satsang Ghar Road, Rebuan, Deoghat, Anji, Solan, Himachal Pradesh — 173211, India</p>
      <p style="font-size:14px;margin-top:8px;">Phone: <a href="tel:+918091498454" style="color:#6ee7b7;">+91 80914 98454</a> | Email: <a href="mailto:info@thekaransinghvaidh.com" style="color:#6ee7b7;">info@thekaransinghvaidh.com</a></p>
    </div>
    <div>
      <h3 style="font-size:16px;font-weight:700;color:#ffffff;margin-bottom:12px;">Quick Links</h3>
      <ul style="list-style:none;padding:0;margin:0;line-height:1.9;font-size:14px;">
        <li><a href="/" style="color:#d1fae5;text-decoration:none;">Home</a></li>
        <li><a href="/ayurvedic-products" style="color:#d1fae5;text-decoration:none;">All Ayurvedic Medicines</a></li>
        <li><a href="/book-appointment" style="color:#d1fae5;text-decoration:none;">Book Consultation</a></li>
        <li><a href="/patient-reports" style="color:#d1fae5;text-decoration:none;">Verified Patient Reports</a></li>
        <li><a href="/blogs" style="color:#d1fae5;text-decoration:none;">Ayurvedic Health Blogs</a></li>
        <li><a href="/about-ayurvedic-doctor-in-solan" style="color:#d1fae5;text-decoration:none;">About Dr. Karan Singh Vaidh</a></li>
        <li><a href="/contact" style="color:#d1fae5;text-decoration:none;">Contact Us</a></li>
      </ul>
    </div>
    <div>
      <h3 style="font-size:16px;font-weight:700;color:#ffffff;margin-bottom:12px;">Specialized Ayurvedic Treatments</h3>
      <ul style="list-style:none;padding:0;margin:0;line-height:1.9;font-size:14px;">
        <li><a href="/ayurvedic-asthma-treatment" style="color:#d1fae5;text-decoration:none;">Ayurvedic Asthma Treatment</a></li>
        <li><a href="/gallbladder-stone-ayurvedic-treatment" style="color:#d1fae5;text-decoration:none;">Gallbladder Stone Treatment</a></li>
        <li><a href="/kidney-stone-ayurvedic-treatment" style="color:#d1fae5;text-decoration:none;">Kidney Stone Treatment</a></li>
        <li><a href="/ayurvedic-piles-treatment" style="color:#d1fae5;text-decoration:none;">Ayurvedic Piles Treatment</a></li>
        <li><a href="/ayurvedic-diabetes-treatment" style="color:#d1fae5;text-decoration:none;">Ayurvedic Diabetes Treatment</a></li>
        <li><a href="/ayurvedic-thyroid-treatment" style="color:#d1fae5;text-decoration:none;">Ayurvedic Thyroid Treatment</a></li>
        <li><a href="/ayurvedic-migraine-treatment" style="color:#d1fae5;text-decoration:none;">Ayurvedic Migraine Treatment</a></li>
        <li><a href="/ayurvedic-gastric-treatment" style="color:#d1fae5;text-decoration:none;">Ayurvedic Gastric Treatment</a></li>
        <li><a href="/high-blood-pressure-ayurvedic-treatment" style="color:#d1fae5;text-decoration:none;">High Blood Pressure Treatment</a></li>
        <li><a href="/ayurvedic-tuberculosis-support" style="color:#d1fae5;text-decoration:none;">Tuberculosis (TB) Support</a></li>
      </ul>
    </div>
    <div>
      <h3 style="font-size:16px;font-weight:700;color:#ffffff;margin-bottom:12px;">Popular Formulations</h3>
      <ul style="list-style:none;padding:0;margin:0;line-height:1.8;font-size:13px;">
        ${productLinks}
      </ul>
    </div>
  </div>
</footer>`;
};

const renderProductBodyHtml = (product, allProducts = []) => {
    const packs = Array.isArray(product.packs) && product.packs.length > 0
        ? product.packs
        : [{ name: '1 Month Pack', mrp: product.mrp || 3500, sellingPrice: product.price || 2800 }];
    const defaultPack = packs.find(p => p.isDefault) || packs[0];
    const price = defaultPack?.sellingPrice || product.price || 2800;
    const mrp = defaultPack?.mrp || product.mrp || 3500;
    const benefitsList = Array.isArray(product.keyBenefits) && product.keyBenefits.length > 0
        ? product.keyBenefits
        : String(product.benefits || '').split('\n').map(s => s.trim()).filter(Boolean);
    const whyChooseList = Array.isArray(product.whyChoose) && product.whyChoose.length > 0
        ? product.whyChoose
        : String(product.whyChooseUs || '').split('\n').map(s => s.trim()).filter(Boolean);
    const faqs = Array.isArray(product.faqs) && product.faqs.length > 0 ? product.faqs : [];
    const reviews = Array.isArray(product.reviews) && product.reviews.length > 0 ? product.reviews : [];
    const imgUrl = toAbsoluteImageUrl(product.image || (product.images && product.images[0]));

    return `
${renderNavigationHtml()}
<main style="max-width:1200px;margin:0 auto;padding:32px 24px;font-family:system-ui,-apple-system,sans-serif;color:#111827;">
  <nav aria-label="Breadcrumb" style="font-size:14px;color:#6b7280;margin-bottom:20px;">
    <a href="/" style="color:#065f46;text-decoration:none;">Home</a> &rsaquo;
    <a href="/ayurvedic-products" style="color:#065f46;text-decoration:none;">Ayurvedic Medicines</a> &rsaquo;
    <span>${escapeHtml(product.name)}</span>
  </nav>

  <article itemscope itemtype="https://schema.org/Product" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:40px;align-items:start;">
    <div>
      <img itemprop="image" src="${escapeHtml(imgUrl)}" alt="${escapeHtml(product.imageAlt || product.name)}" style="width:100%;max-width:520px;border-radius:16px;border:1px solid #e5e7eb;" />
    </div>
    <div>
      <p style="color:#065f46;font-weight:700;font-size:13px;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px;">
        ${escapeHtml(product.category?.name || 'Authentic Himalayan Ayurveda')}
      </p>
      <h1 itemprop="name" style="font-size:32px;font-weight:800;color:#0d2e1b;line-height:1.25;margin:0 0 16px 0;">
        ${escapeHtml(product.h1Title || product.name)}
      </h1>
      <p itemprop="description" style="font-size:16px;line-height:1.7;color:#374151;margin-bottom:20px;">
        ${escapeHtml(product.shortDescription || product.metaDescription || '')}
      </p>

      <div itemprop="offers" itemscope itemtype="https://schema.org/Offer" style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:18px;margin-bottom:24px;">
        <meta itemprop="priceCurrency" content="INR" />
        <meta itemprop="price" content="${escapeHtml(price)}" />
        <link itemprop="availability" href="https://schema.org/InStock" />
        <span style="font-size:28px;font-weight:800;color:#065f46;">₹${escapeHtml(price)}</span>
        <span style="font-size:16px;color:#6b7280;text-decoration:line-through;margin-left:10px;">MRP ₹${escapeHtml(mrp)}</span>
        <p style="font-size:13px;color:#047857;margin:6px 0 0 0;">Inclusive of all taxes • Free Delivery across India • Cash on Delivery Available</p>
      </div>

      <h2 style="font-size:18px;font-weight:700;color:#111827;margin-bottom:10px;">Available Treatment Packs</h2>
      <ul style="padding-left:20px;margin-bottom:24px;line-height:1.8;color:#374151;">
        ${packs.map(pk => `<li><strong>${escapeHtml(pk.name)}:</strong> ₹${escapeHtml(pk.sellingPrice)} (MRP ₹${escapeHtml(pk.mrp)})</li>`).join('\n        ')}
      </ul>
    </div>
  </article>

  <section style="margin-top:48px;border-top:1px solid #e5e7eb;padding-top:32px;">
    <h2 style="font-size:24px;font-weight:700;color:#0d2e1b;margin-bottom:16px;">About ${escapeHtml(product.name)}</h2>
    <div style="font-size:16px;line-height:1.8;color:#374151;white-space:pre-line;">
      ${escapeHtml(product.fullDescription || product.description || product.shortDescription || '')}
    </div>
  </section>

  ${benefitsList.length > 0 ? `
  <section style="margin-top:36px;">
    <h2 style="font-size:22px;font-weight:700;color:#0d2e1b;margin-bottom:14px;">Key Ayurvedic Benefits</h2>
    <ul style="padding-left:20px;line-height:1.9;color:#374151;font-size:16px;">
      ${benefitsList.map(b => `<li>${escapeHtml(b)}</li>`).join('\n      ')}
    </ul>
  </section>` : ''}

  ${product.ingredients ? `
  <section style="margin-top:36px;">
    <h2 style="font-size:22px;font-weight:700;color:#0d2e1b;margin-bottom:12px;">Key Herbal Ingredients</h2>
    <p style="font-size:16px;line-height:1.8;color:#374151;">${escapeHtml(product.ingredients)}</p>
  </section>` : ''}

  ${product.usage ? `
  <section style="margin-top:36px;">
    <h2 style="font-size:22px;font-weight:700;color:#0d2e1b;margin-bottom:12px;">Recommended Dosage &amp; Usage Directions</h2>
    <p style="font-size:16px;line-height:1.8;color:#374151;white-space:pre-line;">${escapeHtml(product.usage)}</p>
  </section>` : ''}

  ${whyChooseList.length > 0 ? `
  <section style="margin-top:36px;">
    <h2 style="font-size:22px;font-weight:700;color:#0d2e1b;margin-bottom:14px;">Why Choose Karan Singh Vaidh Ayurveda</h2>
    <ul style="padding-left:20px;line-height:1.9;color:#374151;font-size:16px;">
      ${whyChooseList.map(w => `<li>${escapeHtml(w)}</li>`).join('\n      ')}
    </ul>
  </section>` : ''}

  ${faqs.length > 0 ? `
  <section style="margin-top:44px;border-top:1px solid #e5e7eb;padding-top:32px;">
    <h2 style="font-size:24px;font-weight:700;color:#0d2e1b;margin-bottom:20px;">Frequently Asked Questions (FAQs)</h2>
    <div style="display:grid;gap:18px;">
      ${faqs.map(f => `
      <div style="background:#f9fafb;padding:18px;border-radius:12px;border:1px solid #e5e7eb;">
        <h3 style="font-size:17px;font-weight:700;color:#111827;margin:0 0 8px 0;">${escapeHtml(f.question)}</h3>
        <p style="font-size:15px;line-height:1.7;color:#4b5563;margin:0;">${escapeHtml(f.answer)}</p>
      </div>`).join('')}
    </div>
  </section>` : ''}

  ${reviews.length > 0 ? `
  <section style="margin-top:44px;border-top:1px solid #e5e7eb;padding-top:32px;">
    <h2 style="font-size:24px;font-weight:700;color:#0d2e1b;margin-bottom:20px;">Verified Patient &amp; Customer Reviews</h2>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px;">
      ${reviews.slice(0, 6).map(r => `
      <blockquote style="margin:0;background:#ffffff;padding:16px;border-radius:12px;border:1px solid #e5e7eb;">
        <p style="font-weight:700;color:#065f46;margin:0 0 6px 0;">★ ${escapeHtml(r.rating || 5)}/5 — ${escapeHtml(r.title || 'Verified Review')}</p>
        <p style="font-size:14px;line-height:1.6;color:#374151;margin:0 0 8px 0;">${escapeHtml(r.comment)}</p>
        <footer style="font-size:12px;color:#6b7280;">— ${escapeHtml(r.name || 'Verified Customer')}</footer>
      </blockquote>`).join('')}
    </div>
  </section>` : ''}
</main>
${renderFooterHtml(allProducts)}`;
};

const renderCatalogBodyHtml = (seoInfo, products = [], filterCategory = 'All') => {
    const filtered = filterCategory === 'All'
        ? products
        : products.filter(p => {
            const cat = (p.category?.name || p.category || '').toLowerCase();
            const name = (p.name || '').toLowerCase();
            const target = filterCategory.toLowerCase();
            return cat.includes(target) || name.includes(target) || (target.includes('hypertension') && (cat.includes('blood pressure') || name.includes('blood pressure') || name.includes('hbp')));
        });
    const displayProducts = filtered.length > 0 ? filtered : products;

    return `
${renderNavigationHtml()}
<main style="max-width:1280px;margin:0 auto;padding:36px 24px;font-family:system-ui,-apple-system,sans-serif;color:#111827;">
  <header style="margin-bottom:32px;">
    <h1 style="font-size:34px;font-weight:800;color:#0d2e1b;margin:0 0 12px 0;">${escapeHtml(seoInfo.h1 || seoInfo.title)}</h1>
    <p style="font-size:17px;line-height:1.7;color:#374151;max-width:900px;">${escapeHtml(seoInfo.description)}</p>
  </header>

  <section aria-label="Ayurvedic Formulations Catalog">
    <h2 style="font-size:24px;font-weight:700;color:#0d2e1b;margin-bottom:20px;">Authentic Ayurvedic Formulations (${displayProducts.length} Medicines)</h2>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:24px;">
      ${displayProducts.map(p => {
          const defaultPack = Array.isArray(p.packs) && p.packs.length > 0 ? (p.packs.find(pk => pk.isDefault) || p.packs[0]) : null;
          const price = defaultPack?.sellingPrice || p.price || 2800;
          const mrp = defaultPack?.mrp || p.mrp || 3500;
          const img = toAbsoluteImageUrl(p.image || (p.images && p.images[0]));
          return `
      <article style="border:1px solid #e5e7eb;border-radius:16px;padding:18px;background:#ffffff;">
        <a href="/product/${escapeHtml(p.slug)}" style="text-decoration:none;color:inherit;">
          <img src="${escapeHtml(img)}" alt="${escapeHtml(p.imageAlt || p.name)}" loading="lazy" style="width:100%;height:220px;object-fit:contain;margin-bottom:12px;" />
          <h3 style="font-size:18px;font-weight:700;color:#0d2e1b;margin:0 0 8px 0;">${escapeHtml(p.name)}</h3>
        </a>
        <p style="font-size:14px;line-height:1.6;color:#4b5563;margin:0 0 12px 0;">${escapeHtml((p.shortDescription || p.metaDescription || '').slice(0, 160))}</p>
        <p style="font-size:18px;font-weight:800;color:#065f46;margin:0;">₹${escapeHtml(price)} <span style="font-size:13px;color:#9ca3af;text-decoration:line-through;">₹${escapeHtml(mrp)}</span></p>
        <p style="margin:10px 0 0 0;"><a href="/product/${escapeHtml(p.slug)}" style="color:#065f46;font-weight:700;font-size:14px;text-decoration:none;">View Treatment Details &rarr;</a></p>
      </article>`;
      }).join('')}
    </div>
  </section>
</main>
${renderFooterHtml(products)}`;
};

const renderBlogDetailBodyHtml = (blog, products = []) => `
${renderNavigationHtml()}
<main style="max-width:920px;margin:0 auto;padding:36px 24px;font-family:system-ui,-apple-system,sans-serif;color:#111827;">
  <nav aria-label="Breadcrumb" style="font-size:14px;color:#6b7280;margin-bottom:20px;">
    <a href="/" style="color:#065f46;text-decoration:none;">Home</a> &rsaquo;
    <a href="/blogs" style="color:#065f46;text-decoration:none;">Ayurvedic Blogs</a> &rsaquo;
    <span>${escapeHtml(blog.title)}</span>
  </nav>
  <article itemscope itemtype="https://schema.org/BlogPosting">
    <header style="margin-bottom:28px;">
      <p style="color:#065f46;font-weight:700;font-size:13px;text-transform:uppercase;">${escapeHtml(blog.category || 'Ayurvedic Care')}</p>
      <h1 itemprop="headline" style="font-size:34px;font-weight:800;color:#0d2e1b;line-height:1.25;margin:8px 0 14px 0;">${escapeHtml(blog.title)}</h1>
      <p style="font-size:14px;color:#6b7280;">By <strong itemprop="author">${escapeHtml(blog.author || 'Karan Singh Vaidh')}</strong> • ${escapeHtml(blog.readTime || '5 min read')}</p>
      ${blog.coverImage ? `<img itemprop="image" src="${escapeHtml(blog.coverImage)}" alt="${escapeHtml(blog.title)}" style="width:100%;max-height:460px;object-fit:cover;border-radius:16px;margin-top:16px;" />` : ''}
    </header>
    <div itemprop="articleBody" style="font-size:17px;line-height:1.8;color:#1f2937;">
      ${blog.content || `<p>${escapeHtml(blog.excerpt || '')}</p>`}
    </div>
  </article>
</main>
${renderFooterHtml(products)}`;

const renderBlogsListBodyHtml = (blogs = [], products = []) => `
${renderNavigationHtml()}
<main style="max-width:1280px;margin:0 auto;padding:36px 24px;font-family:system-ui,-apple-system,sans-serif;color:#111827;">
  <header style="margin-bottom:32px;">
    <h1 style="font-size:34px;font-weight:800;color:#0d2e1b;margin:0 0 12px 0;">Ayurvedic Health Blogs &amp; Clinical Wellness Guides</h1>
    <p style="font-size:17px;line-height:1.7;color:#374151;">Read authentic Ayurvedic health articles, herbal remedies, and practical guides by Dr. Karan Singh Vaidh.</p>
  </header>
  <section style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:24px;">
    ${blogs.map(b => `
    <article style="border:1px solid #e5e7eb;border-radius:16px;overflow:hidden;background:#ffffff;padding:20px;">
      <p style="font-size:12px;font-weight:700;color:#065f46;text-transform:uppercase;margin:0 0 8px 0;">${escapeHtml(b.category || 'Ayurveda')}</p>
      <h2 style="font-size:20px;font-weight:700;color:#0d2e1b;margin:0 0 10px 0;">
        <a href="/blog/${escapeHtml(b.slug)}" style="color:inherit;text-decoration:none;">${escapeHtml(b.title)}</a>
      </h2>
      <p style="font-size:14px;line-height:1.6;color:#4b5563;margin:0 0 14px 0;">${escapeHtml(b.metaDescription || b.excerpt || '')}</p>
      <a href="/blog/${escapeHtml(b.slug)}" style="color:#065f46;font-weight:700;font-size:14px;text-decoration:none;">Read Full Article &rarr;</a>
    </article>`).join('')}
  </section>
</main>
${renderFooterHtml(products)}`;

const renderHomeBodyHtml = (products = [], blogs = []) => `
${renderNavigationHtml()}
<main style="max-width:1280px;margin:0 auto;padding:36px 24px;font-family:system-ui,-apple-system,sans-serif;color:#111827;">
  <section style="padding:28px 0 40px 0;border-bottom:1px solid #e5e7eb;">
    <p style="color:#065f46;font-weight:700;font-size:14px;text-transform:uppercase;letter-spacing:0.08em;">40+ Years of Himalayan Ayurvedic Excellence in Solan, HP</p>
    <h1 style="font-size:38px;font-weight:800;color:#0d2e1b;line-height:1.2;margin:10px 0 16px 0;">Best Ayurvedic Doctor in Solan | Natural Ayurvedic Treatment by Karan Singh Vaidh</h1>
    <p style="font-size:18px;line-height:1.7;color:#374151;max-width:900px;">
      Looking for the best Ayurvedic Doctor in Solan? Get 100% natural, root-cause Ayurvedic treatment for kidney stones, gallbladder stones, asthma, piles, diabetes, thyroid, high blood pressure, migraine, fatty liver, and digestive disorders.
    </p>
    <div style="margin-top:24px;display:flex;gap:16px;flex-wrap:wrap;">
      <a href="/book-appointment" style="background:#0d2e1b;color:#ffffff;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:700;">Book Doctor Consultation</a>
      <a href="/ayurvedic-products" style="background:#ecfdf5;color:#065f46;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:700;border:1px solid #a7f3d0;">Explore All 24 Ayurvedic Medicines</a>
    </div>
  </section>

  <section style="margin-top:44px;">
    <h2 style="font-size:28px;font-weight:800;color:#0d2e1b;margin-bottom:20px;">Best-Selling Himalayan Ayurvedic Medicines</h2>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:22px;">
      ${products.map(p => {
          const defaultPack = Array.isArray(p.packs) && p.packs.length > 0 ? (p.packs.find(pk => pk.isDefault) || p.packs[0]) : null;
          const price = defaultPack?.sellingPrice || p.price || 2800;
          const img = toAbsoluteImageUrl(p.image || (p.images && p.images[0]));
          return `
      <article style="border:1px solid #e5e7eb;border-radius:14px;padding:16px;background:#ffffff;">
        <a href="/product/${escapeHtml(p.slug)}" style="text-decoration:none;color:inherit;">
          <img src="${escapeHtml(img)}" alt="${escapeHtml(p.imageAlt || p.name)}" loading="lazy" style="width:100%;height:200px;object-fit:contain;margin-bottom:10px;" />
          <h3 style="font-size:17px;font-weight:700;color:#0d2e1b;margin:0 0 6px 0;">${escapeHtml(p.name)}</h3>
        </a>
        <p style="font-size:14px;color:#4b5563;line-height:1.5;margin:0 0 10px 0;">${escapeHtml((p.shortDescription || p.metaDescription || '').slice(0, 130))}</p>
        <p style="font-size:17px;font-weight:800;color:#065f46;margin:0;">₹${escapeHtml(price)}</p>
      </article>`;
      }).join('')}
    </div>
  </section>

  ${blogs.length > 0 ? `
  <section style="margin-top:48px;border-top:1px solid #e5e7eb;padding-top:36px;">
    <h2 style="font-size:26px;font-weight:800;color:#0d2e1b;margin-bottom:18px;">Latest Ayurvedic Health Guides</h2>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:20px;">
      ${blogs.slice(0, 4).map(b => `
      <article style="border:1px solid #e5e7eb;border-radius:14px;padding:18px;background:#ffffff;">
        <h3 style="font-size:18px;font-weight:700;color:#0d2e1b;margin:0 0 8px 0;">
          <a href="/blog/${escapeHtml(b.slug)}" style="color:inherit;text-decoration:none;">${escapeHtml(b.title)}</a>
        </h3>
        <p style="font-size:14px;color:#4b5563;margin:0;">${escapeHtml(b.metaDescription || b.excerpt || '')}</p>
      </article>`).join('')}
    </div>
  </section>` : ''}
</main>
${renderFooterHtml(products)}`;

const renderGenericStaticPageHtml = (seoInfo, products = []) => `
${renderNavigationHtml()}
<main style="max-width:1080px;margin:0 auto;padding:40px 24px;font-family:system-ui,-apple-system,sans-serif;color:#111827;">
  <h1 style="font-size:34px;font-weight:800;color:#0d2e1b;margin:0 0 16px 0;">${escapeHtml(seoInfo.h1 || seoInfo.title)}</h1>
  <p style="font-size:17px;line-height:1.8;color:#374151;margin-bottom:28px;">${escapeHtml(seoInfo.description)}</p>
  <section style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:16px;padding:24px;">
    <h2 style="font-size:22px;font-weight:700;color:#0d2e1b;margin:0 0 12px 0;">Karan Singh Vaidh Ayurvedic Hospital — Solan, Himachal Pradesh</h2>
    <p style="font-size:15px;line-height:1.7;color:#4b5563;margin:0 0 12px 0;">
      Address: Radhasoami Satsang Ghar Road, Rebuan, Deoghat, Anji, Solan, Himachal Pradesh — 173211, India.
    </p>
    <p style="font-size:15px;line-height:1.7;color:#4b5563;margin:0;">
      Helpline &amp; Consultation: <a href="tel:+918091498454" style="color:#065f46;font-weight:700;">+91 80914 98454</a> | Visiting Hours: Monday to Sunday, 10:00 AM – 5:00 PM.
    </p>
  </section>
</main>
${renderFooterHtml(products)}`;

/**
 * Given a raw index.html template and a route pathname, returns the complete pre-rendered HTML
 */
export function renderRouteToHtml(templateHtml, rawPath, { products = [], blogs = [] } = {}) {
    const cleanPath = ('/' + String(rawPath || '/').replace(/^\/+|\/+$/g, '')).replace(/\/+/g, '/');
    const normalizedPath = cleanPath === '' ? '/' : cleanPath;

    let title = STATIC_PAGE_SEO['/'].title;
    let description = STATIC_PAGE_SEO['/'].description;
    let keywords = STATIC_PAGE_SEO['/'].keywords;
    let canonicalPath = normalizedPath;
    let ogImage = `${SITE_URL}/logo.png`;
    let ogType = 'website';
    let bodyHtml = '';
    let customBlogHeadBlock = '';
    const schemaGraph = [...getBaseSchemaGraph()];

    // Check if Product Route (/product/:slug)
    if (normalizedPath.startsWith('/product/')) {
        const rawSlug = normalizedPath.replace(/^\/product\//, '').replace(/\/+$/, '');
        const resolvedSlug = SLUG_ALIASES[rawSlug] || rawSlug;
        const strippedSlug = resolvedSlug.replace(/-\d+$/, '');

        const product = products.find(p =>
            p.slug === rawSlug ||
            p.slug === resolvedSlug ||
            p.slug === strippedSlug ||
            p.slug === `${strippedSlug}-ayurvedic-treatment` ||
            String(p._id) === rawSlug
        );

        if (product) {
            title = product.metaTitle || `${product.name} | Authentic Ayurvedic Care - Karan Singh Vaidh`;
            description = product.metaDescription || product.shortDescription || `Buy ${product.name} online. Authentic Ayurvedic remedy by Karan Singh Vaidh.`;
            keywords = [
                product.primaryKeyword,
                ...(Array.isArray(product.secondaryKeywords) ? product.secondaryKeywords : []),
                product.name
            ].filter(Boolean).join(', ');
            canonicalPath = `/product/${product.slug || rawSlug}`;
            ogImage = toAbsoluteImageUrl(product.image || (product.images && product.images[0]));
            ogType = 'product';
            bodyHtml = renderProductBodyHtml(product, products);

            const defaultPack = Array.isArray(product.packs) && product.packs.length > 0
                ? (product.packs.find(pk => pk.isDefault) || product.packs[0])
                : null;
            const price = defaultPack?.sellingPrice || product.price || 2800;

            schemaGraph.push({
                '@type': 'Product',
                '@id': `${SITE_URL}${canonicalPath}#product`,
                name: product.name,
                image: [ogImage],
                description: description,
                sku: product.slug || String(product._id),
                brand: { '@type': 'Brand', name: 'Karan Singh Vaidh' },
                offers: {
                    '@type': 'Offer',
                    url: `${SITE_URL}${canonicalPath}`,
                    priceCurrency: 'INR',
                    price: String(price),
                    availability: 'https://schema.org/InStock',
                    seller: { '@id': `${SITE_URL}/#organization` }
                },
                aggregateRating: {
                    '@type': 'AggregateRating',
                    ratingValue: String(product.rating || 4.9),
                    reviewCount: String((product.reviews && product.reviews.length) || product.numReviews || 25)
                }
            });

            if (Array.isArray(product.faqs) && product.faqs.length > 0) {
                schemaGraph.push({
                    '@type': 'FAQPage',
                    '@id': `${SITE_URL}${canonicalPath}#faq`,
                    mainEntity: product.faqs.map(f => ({
                        '@type': 'Question',
                        name: f.question,
                        acceptedAnswer: { '@type': 'Answer', text: f.answer }
                    }))
                });
            }
        }
    }
    // Check if Blog Detail Route (/blog/:slug, /blogs/:slug, /ayurvedic-blog/:slug)
    else if (
        normalizedPath.startsWith('/blog/') ||
        normalizedPath.startsWith('/blogs/') ||
        normalizedPath.startsWith('/ayurvedic-blog/')
    ) {
        const slug = normalizedPath.replace(/^\/(ayurvedic-)?blogs?\//, '').replace(/\/+$/, '');
        const blog = blogs.find(b => b.slug === slug || String(b._id) === slug) || blogs[0];
        if (blog) {
            title = `${blog.metaTitle || blog.title} | Dr. Karan Singh Vaidh`;
            description = blog.metaDescription || blog.excerpt || blog.title;
            keywords = Array.isArray(blog.keywords) ? blog.keywords.join(', ') : (Array.isArray(blog.tags) ? blog.tags.join(', ') : 'Ayurveda, Health Care');
            canonicalPath = `/blog/${blog.slug}`;
            ogImage = blog.coverImage || `${SITE_URL}/logo.png`;
            ogType = 'article';
            bodyHtml = renderBlogDetailBodyHtml(blog, products);

            schemaGraph.push({
                '@type': 'BlogPosting',
                '@id': `${SITE_URL}${canonicalPath}#article`,
                headline: blog.title,
                description: description,
                image: ogImage,
                author: { '@id': `${SITE_URL}/#doctor` },
                publisher: { '@id': `${SITE_URL}/#organization` },
                mainEntityOfPage: `${SITE_URL}${canonicalPath}`,
                datePublished: blog.createdAt || new Date().toISOString(),
                dateModified: blog.updatedAt || new Date().toISOString()
            });

            if (blog.customSchema && String(blog.customSchema).trim()) {
                const trimmedSchema = String(blog.customSchema).trim();
                customBlogHeadBlock = trimmedSchema.startsWith('<')
                    ? `\n  ${trimmedSchema}`
                    : `\n  <script type="application/ld+json">${trimmedSchema}</script>`;
            }
        }
    }
    // Check if Category / Treatment Route
    else if (CATEGORY_SEO_ROUTES[normalizedPath]) {
        const catSeo = CATEGORY_SEO_ROUTES[normalizedPath];
        title = catSeo.title;
        description = catSeo.description;
        keywords = catSeo.keywords;
        canonicalPath = catSeo.canonical || normalizedPath;
        bodyHtml = renderCatalogBodyHtml(catSeo, products, catSeo.category);
    }
    // Check if Blogs Listing Route
    else if (normalizedPath === '/blogs' || normalizedPath === '/ayurvedic-blogs') {
        const blogSeo = STATIC_PAGE_SEO['/blogs'];
        title = blogSeo.title;
        description = blogSeo.description;
        keywords = blogSeo.keywords;
        canonicalPath = '/blogs';
        bodyHtml = renderBlogsListBodyHtml(blogs, products);
    }
    // Check if Homepage
    else if (normalizedPath === '/') {
        const homeSeo = STATIC_PAGE_SEO['/'];
        title = homeSeo.title;
        description = homeSeo.description;
        keywords = homeSeo.keywords;
        canonicalPath = '/';
        bodyHtml = renderHomeBodyHtml(products, blogs);
    }
    // Other Static Pages
    else if (STATIC_PAGE_SEO[normalizedPath]) {
        const pageSeo = STATIC_PAGE_SEO[normalizedPath];
        title = pageSeo.title;
        description = pageSeo.description;
        keywords = pageSeo.keywords;
        canonicalPath = pageSeo.canonical || normalizedPath;
        bodyHtml = renderGenericStaticPageHtml(pageSeo, products);
    } else {
        bodyHtml = renderHomeBodyHtml(products, blogs);
    }

    const fullCanonicalUrl = `${SITE_URL}${canonicalPath === '/' ? '/' : canonicalPath}`;

    schemaGraph.push({
        '@type': 'WebPage',
        '@id': `${fullCanonicalUrl}#webpage`,
        url: fullCanonicalUrl,
        name: title,
        description: description,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        about: { '@id': `${SITE_URL}/#organization` }
    });

    const seoHeadBlock = `
  <!-- SSG Pre-rendered SEO Meta & Structured Data -->
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <meta name="keywords" content="${escapeHtml(keywords)}" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="${escapeHtml(fullCanonicalUrl)}" />

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="${escapeHtml(ogType)}" />
  <meta property="og:site_name" content="The Karan Singh Vaidh" />
  <meta property="og:url" content="${escapeHtml(fullCanonicalUrl)}" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:image" content="${escapeHtml(ogImage)}" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:url" content="${escapeHtml(fullCanonicalUrl)}" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  <meta name="twitter:image" content="${escapeHtml(ogImage)}" />

  <!-- JSON-LD Structured Data -->
  <script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': schemaGraph })}</script>${customBlogHeadBlock}
  <!-- /SSG Pre-rendered SEO Meta -->`;

    // Remove any existing <title>, <meta name="description">, <link rel="canonical"> from template to prevent duplicates
    let html = templateHtml
        .replace(/<!-- SSG Pre-rendered SEO Meta[\s\S]*?<!-- \/SSG Pre-rendered SEO Meta -->/g, '')
        .replace(/<title>[\s\S]*?<\/title>/gi, '')
        .replace(/<meta\s+name=["']description["'][^>]*>/gi, '')
        .replace(/<link\s+rel=["']canonical["'][^>]*>/gi, '');

    // Inject SEO head block right before </head>
    html = html.replace('</head>', `${seoHeadBlock}\n</head>`);

    // Inject complete semantic HTML inside <div id="root">...</div>
    html = html.replace(
        /<div id="root">[\s\S]*?<!-- \/SSG_BODY --><\/div>|<div id="root">\s*<\/div>/,
        `<div id="root"><!-- SSG_BODY -->${bodyHtml}<!-- /SSG_BODY --></div>`
    );

    return html;
}
