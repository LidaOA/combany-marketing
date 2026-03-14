const mkt_translations = {
    fr: {
        nav_features: "Fonctionnalités",
        nav_pricing: "Tarifs",
        nav_reviews: "Avis",
        nav_faq: "FAQ",
        install_free: "Installer gratuitement",
        hero_title: "Gagnez des <br /><span class=\"text-transparent bg-clip-text bg-gradient-to-r from-white to-[#1565d8]\">entretiens.</span>",
        hero_desc: "Prouvez un <span class=\"text-white font-bold\">match culturel</span> et un <span class=\"text-white font-bold\">intérêt fort</span> instantanément aux recruteurs en personnalisant votre CV avec le logo exact de leur entreprise. <b>En 1 clic.</b>",
        download_ext: "<span class=\"material-icons\">download</span> Télécharger l'extension",
        see_demo: "Voir la démo",
        upload_cv: "<span class=\"material-icons\">file_upload</span><span>Téléverser mon CV</span>",
        why_choose: "Pourquoi choisir Combany ?",
        feature1_title: "Ajout instantané",
        feature1_desc: "Extrayez le logo de n'importe quelle offre d'emploi et apposez-le sur votre PDF en un seul clic. Pas de manipulation complexe.",
        feature2_title: "Logos HD & Ajustables",
        feature2_desc: "Profitez d'une qualité d'image optimale. Le logo est automatiquement redimensionné et positionné pour un rendu professionnel.",
        feature3_title: "Multi-plateformes",
        feature3_desc: "Fonctionne sur LinkedIn, Indeed, Welcome to the Jungle et toutes les pages d'offres d'emploi majeures.",
        pricing_title: "Un investissement pour votre carrière.",
        pricing_desc: "Ne laissez pas votre CV se perdre dans la masse. Multipliez vos chances d'obtenir un entretien par 4 avec une personnalisation soignée.",
        guarantee: "Satisfait ou remboursé sous 14 jours",
        best_offer: "Meilleure offre",
        lifetime_access: "Accès à vie",
        one_time_payment: "paiement unique",
        start_now: "Commencer maintenant",
        footer_rights: "© 2026 Combany. Tous droits réservés.",
        privacy_policy: "Politique de confidentialité",
        tos: "CGV"
    },
    en: {
        nav_features: "Features",
        nav_pricing: "Pricing",
        nav_reviews: "Reviews",
        nav_faq: "FAQ",
        install_free: "Install for free",
        hero_title: "Win more <br /><span class=\"text-transparent bg-clip-text bg-gradient-to-r from-white to-[#1565d8]\">interviews.</span>",
        hero_desc: "Prove a <span class=\"text-white font-bold\">cultural fit</span> and a <span class=\"text-white font-bold\">strong interest</span> instantly to recruiters by personalizing your resume with the exact logo of their company. <b>In 1 click.</b>",
        download_ext: "<span class=\"material-icons\">download</span> Download extension",
        see_demo: "Watch demo",
        upload_cv: "<span class=\"material-icons\">file_upload</span><span>Upload my resume</span>",
        why_choose: "Why choose Combany?",
        feature1_title: "Instant addition",
        feature1_desc: "Extract the logo from any job offer and stamp it on your PDF in just one click. No complex manipulation.",
        feature2_title: "HD & Adjustable Logos",
        feature2_desc: "Enjoy optimal image quality. The logo is automatically resized and positioned for a professional result.",
        feature3_title: "Multi-platform",
        feature3_desc: "Works on LinkedIn, Indeed, Welcome to the Jungle and all major job offer pages.",
        pricing_title: "An investment in your career.",
        pricing_desc: "Don't let your resume get lost in the crowd. Multiply your chances of getting an interview by 4 with careful customization.",
        guarantee: "14-day money-back guarantee",
        best_offer: "Best offer",
        lifetime_access: "Lifetime access",
        one_time_payment: "one-time payment",
        start_now: "Start now",
        footer_rights: "© 2026 Combany. All rights reserved.",
        privacy_policy: "Privacy Policy",
        tos: "Terms of Service"
    }
};

let currentLang = 'en';

async function initI18n() {
    try {
        const res = await fetch('https://ipapi.co/json/');
        if (res.ok) {
            const data = await res.json();
            const country = data.country_code;
            const francophoneCountries = ['FR', 'BE', 'CH', 'CA', 'LU', 'MC', 'DZ', 'MA', 'TN', 'SN', 'CI', 'CM', 'ML', 'NE', 'BF', 'MG'];
            if (francophoneCountries.includes(country)) {
                currentLang = 'fr';
            } else {
                currentLang = 'en';
            }
        } else {
            console.warn("ipapi.co failed, falling back to browser language");
            setFallbackLang();
        }
    } catch (e) {
        console.warn("IP fetching failed, falling back to browser language", e);
        setFallbackLang();
    }

    applyTranslations();
    document.documentElement.lang = currentLang;
}

function setFallbackLang() {
    const lang = navigator.language || navigator.userLanguage;
    if (lang && lang.toLowerCase().startsWith('fr')) {
        currentLang = 'fr';
    } else {
        currentLang = 'en';
    }
}

function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const text = mkt_translations[currentLang][key] || mkt_translations['en'][key];
        if (text) {
            if (el.hasAttribute('data-i18n-html')) {
                el.innerHTML = text;
            } else {
                el.innerText = text;
            }
        }
    });
}

// Ensure the DOM is fully loaded before doing replacements
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initI18n);
} else {
    initI18n();
}
