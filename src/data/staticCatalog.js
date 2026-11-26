import asthmaImg from '../assets/Asthma.webp';
import diabetesImg from '../assets/Diabetes.webp';
import gallBladderImg from '../assets/Gall Bladder.webp';
import gastricImg from '../assets/Gastric.webp';
import kidneyStoneImg from '../assets/Kidney Stone.webp';
import migraineImg from '../assets/Migraine.webp';
import pilesImg from '../assets/Piles.webp';
import thyroidImg from '../assets/Thyroid.webp';
import tuberculosisImg from '../assets/Tuberculosis.webp';
import allervaidhaImg from '../assets/allervaidha-PH-cap.webp';
import bbnImg from '../assets/VIDHUVADHA-BBN.webp';
import cbImg from '../assets/VIDHUVADHA-CB-1.webp';
import hgpImg from '../assets/Vidhuvaidha-HGP-Churan-1.webp';
import lsImg from '../assets/Vidhuvaidha-LS-1.webp';
import psSfImg from '../assets/Vidhuvaidha-PS-SF-1.webp';
import trImg from '../assets/vidhuvaidha-TR-1.webp';
import powerXImg from '../assets/vidhuvadha-Power-X-.webp';
import bprImg from '../assets/Bhanuvaidha.webp';
import hbpImg from '../assets/VIDHUVADHA-HBP-Churan.webp';
import madhuvaidhaImg from '../assets/Madhuvaidha-SM-1.webp';
import stoneVaidhaImg from '../assets/stone-vaidha-KS-GA.webp';

export const STATIC_PRODUCTS = [
    {
        _id: 'high-blood-pressure-ayurvedic-treatment',
        id: 'high-blood-pressure-ayurvedic-treatment',
        name: 'Vidhuvaidha HBP Churan (High Blood Pressure & Hypertension Care)',
        slug: 'high-blood-pressure-ayurvedic-treatment',
        category: { _id: 'cat-hbp', name: 'Hypertension' },
        image: hbpImg,
        images: [hbpImg],
        shortDescription: 'Authentic Ayurvedic formulation to support blood pressure management, arterial elasticity, cardiovascular wellness, and stress relaxation naturally.',
        fullDescription: 'Vidhuvaidha HBP Churan (High Blood Pressure & Hypertension Care) by Karan Singh Vaidh is a traditional herbal formulation specially crafted to support healthy blood pressure levels, vascular tone, and heart health.',
        benefits: 'Supports healthy blood pressure levels naturally\nHelps reduce arterial tension and stress\nPromotes cardiovascular wellness',
        ingredients: 'Arjuna, Sarpagandha, Brahmi, Shankhpushpi, Jatamansi, Ashwagandha, Gokshura.',
        usage: 'Take 1 to 2 pouches twice daily after meals with lukewarm water.',
        rating: 4.9,
        numReviews: 88,
        countInStock: 100,
        isBestSeller: true,
        isWellness: true,
        packs: [
            { name: '1 Month Pack', mrp: 3500, sellingPrice: 2800, isDefault: true, isActive: true },
            { name: '2 Month Pack (Popular)', mrp: 7000, sellingPrice: 5200, isDefault: false, isActive: true },
            { name: '3 Month Complete Care Pack', mrp: 10500, sellingPrice: 7500, isDefault: false, isActive: true }
        ]
    },
    {
        _id: 'gall-bladder-ayurvedic-treatment',
        id: 'gall-bladder-ayurvedic-treatment',
        name: 'Vidhuvaidha CB (Gallbladder Stone Ayurvedic Care)',
        slug: 'gall-bladder-ayurvedic-treatment',
        category: { _id: 'cat-gallbladder', name: 'Gall Bladder' },
        image: cbImg || gallBladderImg,
        images: [cbImg || gallBladderImg],
        shortDescription: 'Specialized herbal powder to support gallbladder detox, bile flow regulation, and natural gallbladder stone management without surgery.',
        fullDescription: 'Vidhuvaidha CB by Karan Singh Vaidh is formulated with potent stone-dissolving and liver-supportive Himalayan herbs to assist gallbladder function and digestive health naturally.',
        benefits: 'Supports natural breakdown and expulsion of gallbladder deposits\nEnhances liver bile secretion and digestion\nRelieves upper abdominal discomfort',
        ingredients: 'Pashanbhed, Varun, Gokshura, Kulthi, Punarnava, Shuddha Guggulu, Apamarga.',
        usage: '1 pouch morning and evening with warm water.',
        rating: 4.9,
        numReviews: 142,
        countInStock: 80,
        isBestSeller: true,
        isWellness: true,
        packs: [
            { name: '1 Month Pack', mrp: 3800, sellingPrice: 3200, isDefault: true, isActive: true },
            { name: '2 Month Pack', mrp: 7600, sellingPrice: 5800, isDefault: false, isActive: true },
            { name: '3 Month Complete Care', mrp: 11400, sellingPrice: 8200, isDefault: false, isActive: true }
        ]
    },
    {
        _id: 'diabetes-ayurvedic-treatment',
        id: 'diabetes-ayurvedic-treatment',
        name: 'Madhuvaidha SM (Ayurvedic Diabetes & Sugar Balance)',
        slug: 'diabetes-ayurvedic-treatment',
        category: { _id: 'cat-diabetes', name: 'Diabetes' },
        image: madhuvaidhaImg || diabetesImg,
        images: [madhuvaidhaImg || diabetesImg],
        shortDescription: 'Clinically tested classical herbs to optimize insulin sensitivity, pancreatic beta-cell vitality, and healthy glycemic control naturally.',
        fullDescription: 'Madhuvaidha SM is a potent multi-herb Ayurvedic preparation that naturally helps manage fasting and postprandial glucose levels while revitalizing metabolic energy.',
        benefits: 'Helps maintain balanced blood sugar levels\nSupports pancreatic function\nReduces diabetes fatigue and frequent urination',
        ingredients: 'Gudmar, Jamun seed, Vijaysar, Karela, Methi, Shilajit, Neem, Giloy.',
        usage: 'Take 1 pouch twice daily before meals with lukewarm water.',
        rating: 4.8,
        numReviews: 120,
        countInStock: 95,
        isBestSeller: true,
        isWellness: true,
        packs: [
            { name: '1 Month Pack', mrp: 3200, sellingPrice: 2600, isDefault: true, isActive: true },
            { name: '2 Month Pack', mrp: 6400, sellingPrice: 4800, isDefault: false, isActive: true },
            { name: '3 Month Complete Pack', mrp: 9600, sellingPrice: 6900, isDefault: false, isActive: true }
        ]
    },
    {
        _id: 'kidney-stone-ayurvedic-treatment',
        id: 'kidney-stone-ayurvedic-treatment',
        name: 'Stone-Vaidha KS (Ayurvedic Kidney Stone Care)',
        slug: 'kidney-stone-ayurvedic-treatment',
        category: { _id: 'cat-kidney', name: 'Kidney Stone' },
        image: stoneVaidhaImg || kidneyStoneImg,
        images: [stoneVaidhaImg || kidneyStoneImg],
        shortDescription: 'Potent litholytic Ayurvedic formulation for natural flushing and dissolution of renal calculi (kidney stones) and urinary tract detox.',
        fullDescription: 'Stone-Vaidha KS combines proven diuretic (Mutral) and stone-crushing herbs to break down calcium oxalate stones and flush them safely through urine.',
        benefits: 'Helps dissolve and flush kidney stones naturally\nSoothes burning urination and urinary spasms\nStrengthens renal function and prevents stone recurrence',
        ingredients: 'Pashanbhed, Varuna Bark, Gokshura, Kulatha, Yavakshar, Hazrul Yahood Bhasma.',
        usage: '1 pouch twice daily with plenty of water.',
        rating: 4.9,
        numReviews: 165,
        countInStock: 110,
        isBestSeller: true,
        isWellness: true,
        packs: [
            { name: '1 Month Pack', mrp: 3500, sellingPrice: 2900, isDefault: true, isActive: true },
            { name: '2 Month Pack', mrp: 7000, sellingPrice: 5300, isDefault: false, isActive: true },
            { name: '3 Month Complete Care', mrp: 10500, sellingPrice: 7600, isDefault: false, isActive: true }
        ]
    },
    {
        _id: 'piles-ayurvedic-treatment',
        id: 'piles-ayurvedic-treatment',
        name: 'Vidhuvaidha PS (Piles, Fissure & Fistula Care)',
        slug: 'piles-ayurvedic-treatment',
        category: { _id: 'cat-piles', name: 'Piles' },
        image: pilesImg,
        images: [pilesImg],
        shortDescription: 'Holistic Ayurvedic solution to reduce pile mass, stop rectal bleeding, ease bowel strain, and soothe inflammation without surgery.',
        fullDescription: 'Vidhuvaidha PS provides complete anorectal comfort by improving vascular integrity, softening stools, and shrinking hemorrhoidal tissues naturally.',
        benefits: 'Stops bleeding and relieves burning sensation\nShrinks internal and external pile masses\nPromotes easy, painless bowel movements',
        ingredients: 'Nagkesar, Haritaki, Triphala, Daruharidra, Jimikand, Neem seed, Rasont.',
        usage: '1 pouch twice a day after meals with warm water.',
        rating: 4.8,
        numReviews: 135,
        countInStock: 85,
        isBestSeller: true,
        isWellness: true,
        packs: [
            { name: '1 Month Pack', mrp: 3400, sellingPrice: 2750, isDefault: true, isActive: true },
            { name: '2 Month Pack', mrp: 6800, sellingPrice: 5100, isDefault: false, isActive: true },
            { name: '3 Month Complete Pack', mrp: 10200, sellingPrice: 7300, isDefault: false, isActive: true }
        ]
    },
    {
        _id: 'asthma-ayurvedic-treatment',
        id: 'asthma-ayurvedic-treatment',
        name: 'Vidhuvaidha AKS (Asthma & Bronchial Care)',
        slug: 'asthma-ayurvedic-treatment',
        category: { _id: 'cat-asthma', name: 'Asthma' },
        image: asthmaImg,
        images: [asthmaImg],
        shortDescription: 'Clears bronchial airways, liquefies stubborn mucus, strengthens lung capacity, and relieves wheezing and chronic cough.',
        fullDescription: 'Vidhuvaidha AKS is crafted with revered Ayurvedic respiratory rejuvenators (Rasayanas) to alleviate bronchospasms, dyspnea, and seasonal respiratory distress.',
        benefits: 'Expands bronchial pathways for effortless breathing\nReduces lung congestion and chronic phlegm\nStrengthens respiratory immunity',
        ingredients: 'Vasa, Kantakari, Somlata, Bharangi, Pushkarmool, Tulsi, Yashtimadhu, Pippali.',
        usage: '1 pouch twice daily with honey or warm water.',
        rating: 4.9,
        numReviews: 92,
        countInStock: 75,
        isBestSeller: true,
        isWellness: true,
        packs: [
            { name: '1 Month Pack', mrp: 3600, sellingPrice: 2950, isDefault: true, isActive: true },
            { name: '2 Month Pack', mrp: 7200, sellingPrice: 5400, isDefault: false, isActive: true },
            { name: '3 Month Complete Care', mrp: 10800, sellingPrice: 7800, isDefault: false, isActive: true }
        ]
    },
    {
        _id: 'gastric-ayurvedic-treatment',
        id: 'gastric-ayurvedic-treatment',
        name: 'Vidhuvaidha HGP (Gastric, GERD & Acidity Relief)',
        slug: 'gastric-ayurvedic-treatment',
        category: { _id: 'cat-gastric', name: 'Gastric' },
        image: hgpImg || gastricImg,
        images: [hgpImg || gastricImg],
        shortDescription: 'Classical digestive churan that eliminates chronic hyperacidity, gas, bloating, heart burn, and indigestion from the root.',
        fullDescription: 'Vidhuvaidha HGP balances the Pitta and Vata doshas in the gastrointestinal tract, promoting natural mucosal healing and robust digestive fire (Agni).',
        benefits: 'Rapid relief from acid reflux and chest burning\nEliminates bloating, gas, and stomach heaviness\nImproves nutrient absorption and digestion',
        ingredients: 'Avipattikar Churna, Shankh Bhasma, Mukta Shukti, Hingvashtak, Fennel, Ajwain.',
        usage: '1 pouch twice daily after meals with water.',
        rating: 4.8,
        numReviews: 110,
        countInStock: 90,
        isBestSeller: false,
        isWellness: true,
        packs: [
            { name: '1 Month Pack', mrp: 2800, sellingPrice: 2200, isDefault: true, isActive: true },
            { name: '2 Month Pack', mrp: 5600, sellingPrice: 4100, isDefault: false, isActive: true },
            { name: '3 Month Pack', mrp: 8400, sellingPrice: 5900, isDefault: false, isActive: true }
        ]
    },
    {
        _id: 'migraine-ayurvedic-treatment',
        id: 'migraine-ayurvedic-treatment',
        name: 'Vidhuvaidha Migraine Care Churan',
        slug: 'migraine-ayurvedic-treatment',
        category: { _id: 'cat-migraine', name: 'Migraine' },
        image: migraineImg,
        images: [migraineImg],
        shortDescription: 'Relieves chronic headaches, throbbing vascular migraine pain, light sensitivity, and neurological stress naturally.',
        fullDescription: 'Formulated with neuroprotective herbs (Medhya Rasayanas) to pacify aggravated Vata-Pitta doshas and calm cerebral vascular spasms.',
        benefits: 'Reduces frequency and intensity of migraine attacks\nCalms nervous tension, anxiety, and insomnia\nEnhances mental clarity and relaxation',
        ingredients: 'Brahmi, Shankhpushpi, Jatamansi, Godanti Bhasma, Shirashooladi Vajra Ras, Ashwagandha.',
        usage: '1 pouch morning and night with warm milk or water.',
        rating: 4.8,
        numReviews: 76,
        countInStock: 65,
        isBestSeller: false,
        isWellness: true,
        packs: [
            { name: '1 Month Pack', mrp: 3200, sellingPrice: 2600, isDefault: true, isActive: true },
            { name: '2 Month Pack', mrp: 6400, sellingPrice: 4800, isDefault: false, isActive: true }
        ]
    },
    {
        _id: 'thyroid-ayurvedic-treatment',
        id: 'thyroid-ayurvedic-treatment',
        name: 'Vidhuvaidha Thyroid Care Churan',
        slug: 'thyroid-ayurvedic-treatment',
        category: { _id: 'cat-thyroid', name: 'Thyroid' },
        image: thyroidImg,
        images: [thyroidImg],
        shortDescription: 'Balances thyroid hormone levels (TSH/T3/T4), combats thyroid-induced weight gain, sluggish metabolism, and hormonal fatigue.',
        fullDescription: 'Vidhuvaidha Thyroid Care combines Kanchnar Guggulu with rejuvenating Himalayan herbs to stimulate the thyroid gland and restore endocrine balance.',
        benefits: 'Promotes optimal TSH, T3, and T4 hormone levels\nSupports weight management and boosted energy\nHelps reduce thyroid swelling and neck heaviness',
        ingredients: 'Kanchnar Bark, Guggulu, Varuna, Triphala, Trikatu, Ashwagandha, Shuddha Shilajit.',
        usage: '1 pouch twice daily with warm water.',
        rating: 4.9,
        numReviews: 84,
        countInStock: 70,
        isBestSeller: false,
        isWellness: true,
        packs: [
            { name: '1 Month Pack', mrp: 3500, sellingPrice: 2800, isDefault: true, isActive: true },
            { name: '2 Month Pack', mrp: 7000, sellingPrice: 5200, isDefault: false, isActive: true }
        ]
    },
    {
        _id: 'tuberculosis-ayurvedic-treatment',
        id: 'tuberculosis-ayurvedic-treatment',
        name: 'Vidhuvaidha TR (Tuberculosis Support Churan)',
        slug: 'tuberculosis-ayurvedic-treatment',
        category: { _id: 'cat-tb', name: 'Tuberculosis (TB)' },
        image: trImg || tuberculosisImg,
        images: [trImg || tuberculosisImg],
        shortDescription: 'Deep lung healing support to restore lung tissues, combat chronic weakness, improve appetite, and boost cellular immunity.',
        fullDescription: 'Formulated with high-potency classical rasayanas to aid cellular recovery, reduce night sweats, and strengthen respiratory resistance.',
        benefits: 'Helps restore damaged pulmonary tissue\nCounters fatigue, weakness, and loss of weight\nStrengthens immune response',
        ingredients: 'Swarna Makshik, Abhrak Bhasma, Pippali, Yashtimadhu, Shatavari, Ashwagandha.',
        usage: '1 pouch twice daily with warm milk or honey.',
        rating: 4.9,
        numReviews: 65,
        countInStock: 60,
        isBestSeller: false,
        isWellness: true,
        packs: [
            { name: '1 Month Pack', mrp: 4200, sellingPrice: 3400, isDefault: true, isActive: true },
            { name: '2 Month Pack', mrp: 8400, sellingPrice: 6400, isDefault: false, isActive: true }
        ]
    },
    {
        _id: 'psoriasis-and-skin-allergy-ayurvedic-treatment',
        id: 'psoriasis-and-skin-allergy-ayurvedic-treatment',
        name: 'Allervaidha PH (Psoriasis & Skin Allergy Care)',
        slug: 'psoriasis-and-skin-allergy-ayurvedic-treatment',
        category: { _id: 'cat-skin', name: 'Skin & Allergy' },
        image: allervaidhaImg,
        images: [allervaidhaImg],
        shortDescription: 'Purifies blood (Rakta Shodhak), eliminates toxins, stops chronic itching, scaling, and heals stubborn psoriasis lesions.',
        fullDescription: 'Allervaidha PH eliminates deep-seated toxins (Ama) from the blood and skin tissues, promoting rapid dermal healing and lasting relief.',
        benefits: 'Stops intense itching, redness, and scaling\nPurifies blood and detoxifies the lymphatic system\nAccelerates skin cellular regeneration',
        ingredients: 'Manjistha, Neem, Khadir, Bakuchi, Giloy, Chopchini, Gandhak Rasayan.',
        usage: '1 pouch twice daily with warm water.',
        rating: 4.9,
        numReviews: 115,
        countInStock: 80,
        isBestSeller: false,
        isWellness: true,
        packs: [
            { name: '1 Month Pack', mrp: 3600, sellingPrice: 2900, isDefault: true, isActive: true },
            { name: '2 Month Pack', mrp: 7200, sellingPrice: 5400, isDefault: false, isActive: true }
        ]
    },
    {
        _id: 'ortho-arthritis-joint-pain-ayurvedic-treatment',
        id: 'ortho-arthritis-joint-pain-ayurvedic-treatment',
        name: 'Vidhuvaidha BBN (Arthritis & Joint Pain Relief)',
        slug: 'ortho-arthritis-joint-pain-ayurvedic-treatment',
        category: { _id: 'cat-ortho', name: 'Ortho & Joint Pain' },
        image: bbnImg,
        images: [bbnImg],
        shortDescription: 'Relieves chronic joint stiffness, swelling, knee pain, cervical spondylitis, and promotes cartilage lubrication naturally.',
        fullDescription: 'Vidhuvaidha BBN pacifies aggravated Sandhigata Vata, reduces synovial inflammation, and strengthens bones and tendons.',
        benefits: 'Relieves knee, back, and joint pain\nReduces inflammatory swelling and stiffness\nImproves joint flexibility and mobility',
        ingredients: 'Shallaki, Yograj Guggulu, Rasna, Ashwagandha, Nirgundi, Hadjod, Methi.',
        usage: '1 pouch twice daily with lukewarm milk or water.',
        rating: 4.8,
        numReviews: 140,
        countInStock: 90,
        isBestSeller: true,
        isWellness: true,
        packs: [
            { name: '1 Month Pack', mrp: 3500, sellingPrice: 2800, isDefault: true, isActive: true },
            { name: '2 Month Pack', mrp: 7000, sellingPrice: 5200, isDefault: false, isActive: true }
        ]
    },
    {
        _id: 'liver-fatty-liver-ayurvedic-treatment',
        id: 'liver-fatty-liver-ayurvedic-treatment',
        name: 'Vidhuvaidha LS (Fatty Liver & Jaundice Care)',
        slug: 'liver-fatty-liver-ayurvedic-treatment',
        category: { _id: 'cat-liver', name: 'Liver Care' },
        image: lsImg,
        images: [lsImg],
        shortDescription: 'Comprehensive hepatic detox to reverse fatty liver grades, normalize elevated SGOT/SGPT enzymes, and improve sluggish liver function.',
        fullDescription: 'Vidhuvaidha LS rejuvenates liver parenchyma cells, clears lipid deposits, and protects against toxins and metabolic sluggishness.',
        benefits: 'Helps reverse grade 1 & 2 fatty liver\nNormalizes elevated liver enzymes (SGOT, SGPT, Bilirubin)\nBoosts appetite and metabolism',
        ingredients: 'Bhumi Amla, Kutki, Kalmegh, Punarnava, Kasani, Bhringraj, Daruharidra.',
        usage: '1 pouch twice daily with lukewarm water before meals.',
        rating: 4.9,
        numReviews: 105,
        countInStock: 85,
        isBestSeller: true,
        isWellness: true,
        packs: [
            { name: '1 Month Pack', mrp: 3400, sellingPrice: 2750, isDefault: true, isActive: true },
            { name: '2 Month Pack', mrp: 6800, sellingPrice: 5100, isDefault: false, isActive: true }
        ]
    }
];

const CACHE_KEY = 'ksv_instant_products_cache_v1';

/**
 * Get instant products catalog:
 * 1. Checks localStorage for latest DB products if cached
 * 2. Falls back to pre-bundled STATIC_PRODUCTS (Instant 0ms load)
 */
export const getInstantProducts = () => {
    try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
            const parsed = JSON.parse(cached);
            if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed;
            }
        }
    } catch {}
    return STATIC_PRODUCTS;
};

/**
 * Save fresh DB products to instant cache
 */
export const cacheProducts = (freshProducts) => {
    if (!Array.isArray(freshProducts) || freshProducts.length === 0) return;
    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(freshProducts));
    } catch {}
};
