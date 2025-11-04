/* --- Load configuration --- */
async function loadConfig() {
  const cfg = await fetch('js/config.json').then(r => r.json());
  window.APP_CONFIG = cfg;

  const langs = cfg.enabledLangs || ['en', 'es', 'fr'];
  const sel = document.getElementById('lang-select');

  // crear botones de idioma
  langs.forEach(l => {
    const opt = document.createElement('button');
    opt.innerText = l.toUpperCase();
    opt.className = 'lang-btn';
    opt.dataset.lang = l;
    opt.onclick = () => setLanguage(l);
    sel.appendChild(opt);
  });

  // idioma por defecto (si no hay guardado)
  const savedLang = localStorage.getItem("lang") || cfg.defaultLang || langs[0];
  setLanguage(savedLang);
}

/* --- Load translations --- */
let TRANSLATIONS = {};

async function loadTranslations() {
  TRANSLATIONS = await fetch('js/lang.json').then(r => r.json());
}

/* --- Helper: traducir clave --- */
function t(key) {
  const lang = window.currentLang || 'en';
  return (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) || key;
}

/* --- Change language --- */
function setLanguage(lang) {
  window.currentLang = lang;
  localStorage.setItem("lang", lang);

  // actualizar textos traducibles
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) {
      el.textContent = TRANSLATIONS[lang][key];
    }
  });

  // resaltar idioma activo
  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.lang === lang);
  });
}

/* --- Form setup --- */
async function configureForm() {
  const cfg = window.APP_CONFIG || await fetch('js/config.json').then(r => r.json());
  const form = document.getElementById('contact-form');
  if (form && cfg.formEndpoint) {
    form.action = cfg.formEndpoint;
  }
}

/* --- Reveal animations --- */
function setupScrollAnimations() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in-view');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

/* --- Gallery toggle --- */
function setupGalleryToggles() {
  const imgWrap = document.getElementById('gallery-images');
  const vidWrap = document.getElementById('gallery-videos');
  const btnImg = document.getElementById('btn-images');
  const btnVid = document.getElementById('btn-videos');

  if (btnImg) btnImg.onclick = () => {
    imgWrap.style.display = 'flex';
    vidWrap.style.display = 'none';
    btnImg.classList.add('active');
    btnVid.classList.remove('active');
  };

  if (btnVid) btnVid.onclick = () => {
    imgWrap.style.display = 'none';
    vidWrap.style.display = 'flex';
    btnVid.classList.add('active');
    btnImg.classList.remove('active');
  };

  if (!vidWrap || vidWrap.children.length === 0) if (btnVid) btnVid.style.display = 'none';
  if (!imgWrap || imgWrap.children.length === 0) if (btnImg) btnImg.style.display = 'none';
}

/* --- Initialize app --- */
async function initApp() {
  await loadTranslations();
  await loadConfig();
  await configureForm();
  setupScrollAnimations();
  setupGalleryToggles();
}

document.addEventListener('DOMContentLoaded', initApp);
