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
    footer_made: "صنع بعناية في سوريا",
    footer_copyright: "© 2026 أحذية سكعان. جميع الحقوق محفوظة."
  }
};

// Global state
let SETTINGS = {};
let PRODUCTS = [];
let currentLang = "en";
let currentFilter = "all";
let lastFocused = null;

// Inline SVG placeholder (no external service needed)
const PLACEHOLDER_IMG =
  "data:image/svg+xml," +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='600' height='600'><rect width='100%' height='100%' fill='#f3f4f6'/><text x='50%' y='50%' font-family='Arial' font-size='28' fill='#9ca3af' text-anchor='middle' dominant-baseline='middle'>Sakaan Shoes</text></svg>"
  );

// ========== HELPERS ==========
function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, ch => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[ch]));
}

function whatsappNumber() {
  // Accept "+963 9xx xxx xxx" or similar and keep digits only
  return String(SETTINGS.whatsapp || "").replace(/\D/g, "");
}

function isRealSocialUrl(url) {
  if (!url) return false;
  // Ignore bare placeholders such as https://www.facebook.com/
  try {
    const u = new URL(url);
    return u.pathname.replace(/\//g, "") !== "" || u.search !== "";
  } catch {
    return false;
  }
}

function categoryLabel(product) {
  const fromData = currentLang === "ar" ? product.categoryLabelAr : product.categoryLabelEn;
  return fromData || TRANSLATIONS[currentLang]["filter_" + product.category] || "";
}

function readStoredLang() {
  try {
    const v = localStorage.getItem("lang");
    return v === "en" || v === "ar" ? v : null;
  } catch {
    return null;
  }
}

function storeLang(lang) {
  try { localStorage.setItem("lang", lang); } catch { /* private mode etc. */ }
}

// ========== INITIALIZATION ==========
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const [settingsRes, productsRes] = await Promise.all([
      fetch("data/settings.json"),
      fetch("data/products.json")
    ]);
    if (!settingsRes.ok || !productsRes.ok) throw new Error("Data files not found");

    SETTINGS = await settingsRes.json();
    const productsData = await productsRes.json();
    PRODUCTS = (productsData.products || []).sort((a, b) => (a.order ?? 100) - (b.order ?? 100));

    currentLang = readStoredLang() || SETTINGS.defaultLang || "en";
    applySettings();
    setLanguage(currentLang);
    setupEventListeners();
  } catch (err) {
    console.error("Error loading data:", err);
    document.getElementById("gallery-grid").innerHTML =
      `<p class="col-span-full text-center text-red-500 py-12">Error loading products. Please try again later.</p>`;
  }
});

function applySettings() {
  const phone = whatsappNumber();
  const mainWa = document.getElementById("main-whatsapp-btn");
  if (mainWa && phone) mainWa.href = `https://wa.me/${phone}`;

  const fb = document.getElementById("facebook-link");
  const ig = document.getElementById("instagram-link");
  [[fb, SETTINGS.facebook], [ig, SETTINGS.instagram]].forEach(([el, url]) => {
    if (!el) return;
    if (isRealSocialUrl(url)) el.href = url;
    else el.classList.add("hidden"); // hide icon until a real profile URL is set
  });

  // Logo support (handles different possible paths)
  if (SETTINGS.logo) {
    let logoSrc = SETTINGS.logo;
    if (!/^(https?:)?\/\//.test(logoSrc) && !logoSrc.startsWith("/")) {
      logoSrc = "/" + logoSrc;
    }
    document.querySelectorAll(".site-logo").forEach(el => {
      const img = document.createElement("img");
      img.src = logoSrc;
      img.alt = SETTINGS.siteNameEn || "Logo";
      img.className = "w-10 h-10 md:w-12 md:h-12 rounded-full object-cover shadow-md";
      img.onerror = () => { el.textContent = "S"; };
      el.textContent = "";
      el.appendChild(img);
      el.classList.remove("bg-gradient-to-br", "from-primary-600", "to-primary-800", "bg-primary-600");
      el.style.background = "transparent";
      el.style.padding = "0";
      el.style.overflow = "hidden";
    });
  }

  updateBrandNames();
}

function updateBrandNames() {
  const name = currentLang === "ar"
    ? (SETTINGS.siteNameAr || "أحذية سكعان")
    : (SETTINGS.siteNameEn || "Sakaan Shoes");

  document.querySelectorAll("[data-i18n='brand']").forEach(el => { el.textContent = name; });
  document.querySelectorAll("[data-i18n='tagline']").forEach(el => {
    el.textContent = currentLang === "ar" ? (SETTINGS.taglineAr || "") : (SETTINGS.taglineEn || "");
  });

  document.title = `${SETTINGS.siteNameEn || "Sakaan Shoes"} | ${SETTINGS.siteNameAr || "أحذية سكعان"}`;
}

function setLanguage(lang) {
  currentLang = lang;
  storeLang(lang);
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

  const items = PRODUCTS
    .map((product, index) => ({ product, index }))
    .filter(({ product }) => currentFilter === "all" || product.category === currentFilter);

  if (items.length === 0) {
    grid.innerHTML = `<p class="col-span-full text-center text-gray-500 py-12">${currentLang === "ar" ? "لا توجد منتجات في هذه الفئة" : "No products in this category"}</p>`;
    return;
  }

  grid.innerHTML = items.map(({ product, index }) => {
    const title = esc(currentLang === "ar" ? product.titleAr : product.titleEn);
    const catLabel = esc(categoryLabel(product));
    const image = esc(product.image);

    return `
      <div class="gallery-card bg-white rounded-2xl overflow-hidden shadow-md cursor-pointer group"
           role="button" tabindex="0"
           data-index="${index}">
        <div class="aspect-square overflow-hidden bg-gray-100">
          <img src="${image}"
               alt="${title}"
               class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
               loading="lazy"
               onerror="this.onerror=null;this.src='${PLACEHOLDER_IMG}'">
        </div>
        <div class="p-4">
          <p class="text-xs font-medium text-primary-600 mb-1">${catLabel}</p>
          <h3 class="font-semibold text-gray-900 text-lg leading-tight">${title}</h3>
        </div>
      </div>
    `;
  }).join("");
}

function openLightbox(index) {
  const product = PRODUCTS[index];
  if (!product) return;

  const lightbox = document.getElementById("lightbox");
  const img = document.getElementById("lightbox-img");
  const title = document.getElementById("lightbox-title");
  const category = document.getElementById("lightbox-category");
  const desc = document.getElementById("lightbox-desc");
  const waBtn = document.getElementById("lightbox-whatsapp");

  const titleText = currentLang === "ar" ? product.titleAr : product.titleEn;
  const descText = currentLang === "ar" ? product.descriptionAr : product.descriptionEn;

  img.onerror = () => { img.onerror = null; img.src = PLACEHOLDER_IMG; };
  img.src = product.image;
  img.alt = titleText || "";
  title.textContent = titleText || "";
  category.textContent = categoryLabel(product);
  desc.textContent = descText || "";

  const message = currentLang === "ar"
    ? `مرحباً، أنا مهتم بـ: ${product.titleAr}`
    : `Hello, I'm interested in: ${product.titleEn}`;

  const phone = whatsappNumber();
  waBtn.href = phone
    ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
    : `https://wa.me/?text=${encodeURIComponent(message)}`;

  lastFocused = document.activeElement;
  lightbox.classList.remove("hidden");
  lightbox.classList.add("flex");
  document.body.style.overflow = "hidden";
  document.getElementById("lightbox-close")?.focus();
}

function closeLightbox() {
  const lightbox = document.getElementById("lightbox");
  lightbox.classList.add("hidden");
  lightbox.classList.remove("flex");
  document.body.style.overflow = "";
  if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
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

  // One delegated handler for the gallery (click + keyboard)
  const grid = document.getElementById("gallery-grid");
  grid?.addEventListener("click", (e) => {
    const card = e.target.closest("[data-index]");
    if (card) openLightbox(Number(card.dataset.index));
  });
  grid?.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const card = e.target.closest("[data-index]");
    if (card) {
      e.preventDefault();
      openLightbox(Number(card.dataset.index));
    }
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
      if (window.scrollY >= top) current = section.getAttribute("id");
    });
    document.querySelectorAll(".nav-link").forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) link.classList.add("active");
    });
  }, { passive: true });
}
