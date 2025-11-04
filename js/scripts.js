
/* Simple multilingual loader + DOM text replacement */
async function loadConfig() {
  const cfg = await fetch('js/config.json').then(r=>r.json());
  window.APP_CONFIG = cfg;
  const langs = cfg.enabledLangs || ['en','es','fr'];
  // build lang selector
  const sel = document.getElementById('lang-select');
  sel.innerHTML = '';
  langs.forEach(l=>{
    const opt = document.createElement('button');
    opt.innerText = l.toUpperCase();
    opt.className = 'lang-btn';
    opt.dataset.lang = l;
    opt.onclick = ()=>setLanguage(l);
    sel.appendChild(opt);
  });
  // note: don't call setLanguage here; initApp will handle initial language
}

let TRANSLATIONS = {};
async function loadTranslations() {
  TRANSLATIONS = await fetch('js/lang.json').then(r=>r.json());
}

function t(key) {
  const lang = window.currentLang || 'en';
  return (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) || key;
}

function setLanguage(lang) {
  window.currentLang = lang;
  try { localStorage.setItem("lang", lang); } catch(e){}
  // translate elements
  document.querySelectorAll("[data-i18n]").forEach(el=>{
    const key = el.getAttribute("data-i18n");
    if(!key) return;
    if(el.tagName === 'INPUT' || el.tagName === 'TEXTAREA'){
      el.placeholder = t(key);
    } else {
      el.innerText = t(key);
    }
  });
  document.querySelectorAll(".lang-btn").forEach(b=>b.classList.toggle('active', b.dataset.lang===lang));
}

/* Simple form configuration: change action from config */
async function configureForm() {
  const cfg = window.APP_CONFIG || await fetch('js/config.json').then(r=>r.json());
  const form = document.getElementById('contact-form');
  if(form && cfg.formEndpoint){
    form.action = cfg.formEndpoint;
  }
}

/* IntersectionObserver for reveal animations */
function setupScrollAnimations(){
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add('in-view');
        obs.unobserve(e.target);
      }
    });
  }, {threshold: 0.15});
  document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));
}

/* Gallery toggle for images/videos */
function setupGalleryToggles(){
  const imgWrap = document.getElementById('gallery-images');
  const vidWrap = document.getElementById('gallery-videos');
  const btnImg = document.getElementById('btn-images');
  const btnVid = document.getElementById('btn-videos');
  if(btnImg) btnImg.onclick = ()=>{ if(imgWrap) { imgWrap.style.display='flex'; } if(vidWrap) { vidWrap.style.display='none'; } btnImg.classList.add('active'); btnVid.classList.remove('active'); };
  if(btnVid) btnVid.onclick = ()=>{ if(imgWrap) { imgWrap.style.display='none'; } if(vidWrap) { vidWrap.style.display='flex'; } btnVid.classList.add('active'); btnImg.classList.remove('active'); };
  if(!vidWrap || vidWrap.children.length===0) { if(btnVid) btnVid.style.display='none'; }
  if(!imgWrap || imgWrap.children.length===0) { if(btnImg) btnImg.style.display='none'; }
}

/* Init */
async function initApp(){
  await loadTranslations();
  await loadConfig();
  await configureForm();
  // set initial language (saved or default)
  const cfg = window.APP_CONFIG || {};
  const defaultLang = cfg.defaultLang || cfg.defaultLanguage || 'en';
  let savedLang = null;
  try { savedLang = localStorage.getItem('lang'); } catch(e){ savedLang = null; }
  const initialLang = savedLang || defaultLang;
  setLanguage(initialLang);

  setupScrollAnimations();
  setupGalleryToggles();
}

document.addEventListener('DOMContentLoaded', initApp);
