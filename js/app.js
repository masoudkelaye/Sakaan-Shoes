// ============================================
// SAKAAN SHOES - MAIN APPLICATION
// Loads data from JSON files so the Admin panel can edit everything
// ============================================

// Translations
const TRANSLATIONS = {
  en: {
    brand: "Sakaan Shoes",
    tagline: "Premium Syrian Footwear",
    nav_home: "Home",
    nav_gallery: "Gallery",
    nav_about: "About",
    nav_contact: "Contact",
    hero_title: "Quality Shoes",
    hero_title_highlight: "Made in Syria",
    hero_subtitle: "Discover our carefully crafted collection of premium footwear. Every pair is made with care in our factory in Syria.",
    btn_view_collection: "View Collection",
    btn_contact_us: "Contact Us",
    gallery_title: "Our Collection",
    gallery_subtitle: "Browse our latest designs. Click any photo to view details and contact us directly on WhatsApp.",
    filter_all: "All",
    filter_men: "Men",
    filter_women: "Women",
    filter_kids: "Kids",
    about_title: "About Sakaan Shoes",
    about_p1: "Sakaan Shoes is a Syrian shoe factory dedicated to producing high-quality, comfortable, and stylish footwear for the whole family.",
    about_p2: "We combine traditional craftsmanship with modern designs to create shoes that look great and last long. Every pair is carefully made in our factory with attention to detail and quality materials.",
    feature_quality: "Premium Quality",
    feature_quality_desc: "Carefully selected materials",
    feature_craft: "Expert Craft",
    feature_craft_desc: "Made by skilled artisans",
    contact_title: "Get in Touch",
    contact_subtitle: "Interested in our shoes? Contact us directly on WhatsApp for orders, wholesale inquiries, or any questions.",
    btn_whatsapp: "Chat on WhatsApp",
    btn_whatsapp_product: "Inquire on WhatsApp",
    contact_note: "You can change WhatsApp number and social links from the Admin panel.",
    footer_made: "Made with care in Syria",
    footer_copyright: "© 2026 Sakaan Shoes. All rights reserved."
  },
  ar: {
    brand: "أحذية سكعان",
    tagline: "أحذية سورية فاخرة",
    nav_home: "الرئيسية",
    nav_gallery: "المعرض",
    nav_about: "من نحن",
    nav_contact: "تواصل معنا",
    hero_title: "أحذية عالية الجودة",
    hero_title_highlight: "صنع في سوريا",
    hero_subtitle: "اكتشف مجموعتنا المختارة بعناية من الأحذية الفاخرة. كل زوج مصنوع بعناية في مصنعنا في سوريا.",
    btn_view_collection: "عرض المجموعة",
    btn_contact_us: "تواصل معنا",
    gallery_title: "مجموعتنا",
    gallery_subtitle: "تصفح أحدث تصاميمنا. انقر على أي صورة لعرض التفاصيل والتواصل معنا مباشرة عبر واتساب.",
    filter_all: "الكل",
    filter_men: "رجالي",
    filter_women: "نسائي",
    filter_kids: "أطفال",
    about_title: "عن أحذية سكعان",
    about_p1: "أحذية سكعان مصنع سوري متخصص في إنتاج أحذية عالية الجودة ومريحة وأنيقة للعائلة بأكملها.",
    about_p2: "نجمع بين الحرفية التقليدية والتصاميم الحديثة لصنع أحذية تبدو رائعة وتدوم طويلاً. كل زوج مصنوع بعناية في مصنعنا مع الاهتمام بالتفاصيل والمواد عالية الجودة.",
    feature_quality: "جودة فاخرة",
    feature_quality_desc: "مواد مختارة بعناية",
    feature_craft: "حرفية خبيرة",
    feature_craft_desc: "صنع بواسطة حرفيين مهرة",
    contact_title: "تواصل معنا",
    contact_subtitle: "مهتم بأحذيتنا؟ تواصل معنا مباشرة عبر واتساب للطلبات أو الاستفسارات بالجملة أو أي أسئلة.",
    btn_whatsapp: "تحدث عبر واتساب",
    btn_whatsapp_product: "استفسر عبر واتساب",
    contact_note: "يمكنك تغيير رقم واتساب وروابط التواصل من لوحة الإدارة.",
    footer_made: "صنع بعناية في سوريا",
    footer_copyright: "© 2026 أحذية سكعان. جميع الحقوق محفوظة."
  }
};

// Global state
let SETTINGS = {};
let PRODUCTS = [];
let currentLang = "en";
let currentFilter = "all";

// ========== INITIALIZATION ==========
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const [settingsRes, productsRes] = await Promise.all([
      fetch("data/settings.json"),
      fetch("data/products.json")
    ]);

    SETTINGS = await settingsRes.json();
    const productsData = await productsRes.json();
    PRODUCTS = (productsData.products || []).sort((a, b) => (a.order || 100) - (b.order || 100));

    applySettings();
    currentLang = SETTINGS.defaultLang || "en";
    setLanguage(currentLang);
    renderGallery();
    setupEventListeners();
  } catch (err) {
    console.error("Error loading data:", err);
    document.getElementById("gallery-grid").innerHTML = 
      `<p class="col-span-full text-center text-red-500 py-12">Error loading products. Please check the data files.</p>`;
  }
});

function applySettings() {
  const mainWa = document.getElementById("main-whatsapp-btn");
  if (mainWa && SETTINGS.whatsapp) {
    mainWa.href = `https://wa.me/${SETTINGS.whatsapp}`;
  }

  const fb = document.getElementById("facebook-link");
  const ig = document.getElementById("instagram-link");
  if (fb && SETTINGS.facebook) fb.href = SETTINGS.facebook;
  if (ig && SETTINGS.instagram) ig.href = SETTINGS.instagram;

  // Logo support (handles different possible paths)
  if (SETTINGS.logo) {
    let logoSrc = SETTINGS.logo;
    // Ensure it starts with / if it's a relative path
    if (logoSrc && !logoSrc.startsWith("http") && !logoSrc.startsWith("/")) {
      logoSrc = "/" + logoSrc;
    }
    document.querySelectorAll(".site-logo").forEach(el => {
      el.innerHTML = `<img src="${logoSrc}" alt="Logo" class="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover shadow-md" onerror="this.style.display='none'; this.parentElement.textContent='S';">`;
      el.classList.remove("bg-gradient-to-br", "from-primary-600", "to-primary-800", "bg-primary-600");
      el.style.background = "transparent";
      el.style.padding = "0";
      el.style.overflow = "hidden";
    });
  }

  updateBrandNames();
}

function updateBrandNames() {
  document.querySelectorAll("[data-i18n='brand']").forEach(el => {
    el.textContent = currentLang === "ar" ? (SETTINGS.siteNameAr || "أحذية سكعان") : (SETTINGS.siteNameEn || "Sakaan Shoes");
  });
  document.querySelectorAll("[data-i18n='tagline']").forEach(el => {
    el.textContent = currentLang === "ar" ? (SETTINGS.taglineAr || "") : (SETTINGS.taglineEn || "");
  });
}

function setLanguage(lang) {
  currentLang = lang;
  const t = TRANSLATIONS[lang];

  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";

  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (t[key] && key !== "brand" && key !== "tagline") {
      el.textContent = t[key];
    }
  });

  updateBrandNames();

  const langLabel = document.getElementById("lang-label");
  if (langLabel) langLabel.textContent = lang === "en" ? "العربية" : "English";

  renderGallery();
}

function renderGallery() {
  const grid = document.getElementById("gallery-grid");
  if (!grid) return;

  const filtered = currentFilter === "all"
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === currentFilter);

  if (filtered.length === 0) {
    grid.innerHTML = `<p class="col-span-full text-center text-gray-500 py-12">${currentLang === "ar" ? "لا توجد منتجات في هذه الفئة" : "No products in this category"}</p>`;
    return;
  }

  grid.innerHTML = filtered.map(product => {
    const title = currentLang === "ar" ? product.titleAr : product.titleEn;
    const catLabel = currentLang === "ar" ? product.categoryLabelAr : product.categoryLabelEn;

    return `
      <div class="gallery-card bg-white rounded-2xl overflow-hidden shadow-md cursor-pointer group" 
           data-id="${product.id}"
           onclick="openLightbox(${product.id})">
        <div class="aspect-square overflow-hidden bg-gray-100">
          <img src="${product.image}" 
               alt="${title}" 
               class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
               loading="lazy"
               onerror="this.src='https://via.placeholder.com/600x600?text=Shoe'">
        </div>
        <div class="p-4">
          <p class="text-xs font-medium text-primary-600 mb-1">${catLabel}</p>
          <h3 class="font-semibold text-gray-900 text-lg leading-tight">${title}</h3>
        </div>
      </div>
    `;
  }).join("");
}

function openLightbox(id) {
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return;

  const lightbox = document.getElementById("lightbox");
  const img = document.getElementById("lightbox-img");
  const title = document.getElementById("lightbox-title");
  const category = document.getElementById("lightbox-category");
  const desc = document.getElementById("lightbox-desc");
  const waBtn = document.getElementById("lightbox-whatsapp");

  const titleText = currentLang === "ar" ? product.titleAr : product.titleEn;
  const catText = currentLang === "ar" ? product.categoryLabelAr : product.categoryLabelEn;
  const descText = currentLang === "ar" ? product.descriptionAr : product.descriptionEn;

  img.src = product.image;
  img.alt = titleText;
  title.textContent = titleText;
  category.textContent = catText;
  desc.textContent = descText;

  const message = currentLang === "ar"
    ? `مرحباً، أنا مهتم بـ: ${product.titleAr}`
    : `Hello, I'm interested in: ${product.titleEn}`;

  const phone = SETTINGS.whatsapp || "963000000000";
  waBtn.href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  lightbox.classList.remove("hidden");
  lightbox.classList.add("flex");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  const lightbox = document.getElementById("lightbox");
  lightbox.classList.add("hidden");
  lightbox.classList.remove("flex");
  document.body.style.overflow = "";
}

function setupEventListeners() {
  document.getElementById("lang-toggle")?.addEventListener("click", () => {
    setLanguage(currentLang === "en" ? "ar" : "en");
  });

  const mobileBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  mobileBtn?.addEventListener("click", () => mobileMenu?.classList.toggle("hidden"));
  mobileMenu?.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => mobileMenu.classList.add("hidden"));
  });

  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentFilter = btn.getAttribute("data-filter");
      renderGallery();
    });
  });

  document.getElementById("lightbox-close")?.addEventListener("click", closeLightbox);
  document.getElementById("lightbox")?.addEventListener("click", (e) => {
    if (e.target.id === "lightbox") closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });

  const sections = document.querySelectorAll("section[id]");
  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach(section => {
      const top = section.offsetTop - 100;
      if (scrollY >= top) current = section.getAttribute("id");
    });
    document.querySelectorAll(".nav-link").forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) link.classList.add("active");
    });
  });
}
