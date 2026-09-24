import asthmaImg from '../assets/Asthma.webp';
import diabetesImg from '../assets/Diabetes.webp';
import madhuvaidhaImg from '../assets/Madhuvaidha-SM-1.webp';
import gallBladderImg from '../assets/Gall Bladder.webp';
import gastricImg from '../assets/Gastric.webp';
import kidneyStoneImg from '../assets/Kidney Stone.webp';
import stoneVaidhaImg from '../assets/stone-vaidha-KS-GA.webp';
import migraineImg from '../assets/Migraine.webp';
import pilesImg from '../assets/Piles.webp';
import pilesPsImg from '../assets/Vidhuvaidha-PS-SF-1.webp';
import thyroidImg from '../assets/Thyroid.webp';
import thyroidTrImg from '../assets/vidhuvaidha-TR-1.webp';
import tuberculosisImg from '../assets/Tuberculosis.webp';
import allervaidhaImg from '../assets/allervaidha-PH-cap.webp';
import bbnImg from '../assets/VIDHUVADHA-BBN.webp';
import cbImg from '../assets/VIDHUVADHA-CB-1.webp';
import hgpImg from '../assets/Vidhuvaidha-HGP-Churan-1.webp';
import lsImg from '../assets/Vidhuvaidha-LS-1.webp';
import hbpImg from '../assets/VIDHUVADHA-HBP-Churan.webp';
import powerXImg from '../assets/vidhuvadha-Power-X-.webp';
import bhanuvaidhaImg from '../assets/Bhanuvaidha.webp';

// Map of canonical image references
export const PRODUCT_IMAGE_MAP = {
    'high-blood-pressure': hbpImg,
    'hbp': hbpImg,
    'hypertension': hbpImg,
    'blood-pressure': hbpImg,
    'gall-bladder': cbImg || gallBladderImg,
    'gallbladder': cbImg || gallBladderImg,
    'cb': cbImg,
    'diabetes': madhuvaidhaImg || diabetesImg,
    'madhuvaidha': madhuvaidhaImg || diabetesImg,
    'sugar': madhuvaidhaImg || diabetesImg,
    'kidney-stone': stoneVaidhaImg || kidneyStoneImg,
    'kidney': stoneVaidhaImg || kidneyStoneImg,
    'stone-vaidha': stoneVaidhaImg || kidneyStoneImg,
    'asthma': asthmaImg,
    'gastric': gastricImg,
    'acidity': gastricImg,
    'gas': gastricImg,
    'migraine': migraineImg,
    'piles': pilesPsImg || pilesImg,
    'bawaseer': pilesPsImg || pilesImg,
    'thyroid': thyroidTrImg || thyroidImg,
    'tuberculosis': tuberculosisImg,
    'tb': tuberculosisImg,
    'allergy': allervaidhaImg,
    'allervaidha': allervaidhaImg,
    'bbn': bbnImg,
    'brain': bbnImg,
    'hgp': hgpImg,
    'liver': hgpImg,
    'fatty-liver': hgpImg,
    'ls': lsImg,
    'lipoma': lsImg,
    'power-x': powerXImg,
    'bhanuvaidha': bhanuvaidhaImg,
    'psoriasis': bhanuvaidhaImg
};

/**
 * Resolves the genuine authentic product image.
 * If backend returned dummy/broken placeholder or 1769181213575, resolves to genuine Ayurvedic product image.
 */
export const resolveProductImage = (product) => {
    if (!product) return hbpImg;

    const rawImage = typeof product === 'string' ? product : (product.image || (product.images && product.images[0]));
    const name = (product.name || '').toLowerCase();
    const slug = (product.slug || product._id || product.id || '').toLowerCase();
    const catName = (product.category?.name || product.category || '').toString().toLowerCase();

    const fullKey = `${slug} ${name} ${catName}`;

    // Filter out known broken/placeholder images (e.g., uploaded_media_1769181213575 or logo.png)
    const isCorruptedImage = !rawImage || 
        typeof rawImage !== 'string' ||
        rawImage.includes('1769181213575') || 
        rawImage.includes('logo.png') ||
        rawImage.trim() === '';

    if (!isCorruptedImage) {
        const trimmed = rawImage.trim();
        // If it's an imported module, data URL, blob, or starts with /src/ or /assets/
        if (
            trimmed.startsWith('data:') || 
            trimmed.startsWith('blob:') || 
            trimmed.startsWith('/src/') || 
            trimmed.startsWith('/assets/') ||
            trimmed.startsWith('assets/') ||
            trimmed.startsWith('/VIDHUVADHA-HBP-Churan')
        ) {
            return trimmed;
        }

        // If it's a valid remote URL or ImageKit URL
        if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
            if (trimmed.includes('ik.imagekit.io')) {
                return `${trimmed}?tr=w-600,q-85,f-auto`;
            }
            return trimmed;
        }

        // If it's a genuine upload on backend (not the corrupted one)
        if (trimmed.startsWith('uploads/') || trimmed.startsWith('/uploads/')) {
            const cleanPath = trimmed.startsWith('/') ? trimmed.slice(1) : trimmed;
            return `https://server-pevq.onrender.com/${cleanPath}`;
        }
    }

    // Match product to genuine authentic Ayurvedic product image
    if (/high[- ]blood|hypertension|hbp|raktachap|blood[- ]pressure/i.test(fullKey)) return hbpImg;
    if (/gall[- ]bladder|gallbladder|\bcb\b|ak cap/i.test(fullKey)) return cbImg || gallBladderImg;
    if (/diabetes|madhuvaidha|\bsm\b|sugar balance/i.test(fullKey)) return madhuvaidhaImg || diabetesImg;
    if (/kidney|stone[- ]vaidha|\bks\b|pathri/i.test(fullKey)) return stoneVaidhaImg || kidneyStoneImg;
    if (/asthma|dama|shwas|bronch/i.test(fullKey)) return asthmaImg;
    if (/gastric|acidity|gas|kabz|digest/i.test(fullKey)) return gastricImg;
    if (/migraine|headache|sir dard/i.test(fullKey)) return migraineImg;
    if (/piles|bawaseer|ps[- ]sf|\bps\b|fissure/i.test(fullKey)) return pilesPsImg || pilesImg;
    if (/thyroid|\btr\b/i.test(fullKey)) return thyroidTrImg || thyroidImg;
    if (/tuberculosis|\btb\b|\baks\b/i.test(fullKey)) return tuberculosisImg;
    if (/allergy|allervaidha|\bph\b/i.test(fullKey)) return allervaidhaImg;
    if (/bbn|brain|memory|nerv/i.test(fullKey)) return bbnImg;
    if (/liver|hgp|fatty/i.test(fullKey)) return hgpImg;
    if (/lipoma|\bls\b|fat lump/i.test(fullKey)) return lsImg;
    if (/power[- ]x|stamina|vitality|shilajit/i.test(fullKey)) return powerXImg;
    if (/psoriasis|bhanuvaidha|\bpr\b|skin/i.test(fullKey)) return bhanuvaidhaImg;

    return hbpImg;
};
