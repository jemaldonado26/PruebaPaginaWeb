/* Simple multilingual loader + DOM text replacement */
async function loadConfig() {
  const cfg = await fetch('js/config.json').then(r=>r.json());
  window.APP_CONFIG = cfg;
  const langs = cfg.enabledLangs || ['en','es','fr'];
  // build lang selector
  const sel = document.getElementById('lang-select');
  langs.forEach(l=>{
    const opt = document.createElement('button');
    opt.innerText = l.toUpperCase();
    opt.className = 'lang-btn';
    opt.dataset.lang = l;
    opt.onclick = ()=>setLang(l);
    sel.appendChild(opt);
  });
  setLang(cfg.defaultLang || langs[0]);
}

let TRANSLATIONS = {};
async function loadTranslations() {
  TRANSLATIONS = await fetch('js/lang.json').then(r=>r.json());
}

function t(key) {
  const lang = window.currentLang || 'en';
  return (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) || key;
}

function setLang(lang) {
  window.currentLang = lang;
  // translate text nodes with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const key = el.dataset.i18n;
    if(el.tagName === 'INPUT' || el.tagName === 'TEXTAREA'){
      el.placeholder = t(key);
    } else {
      el.innerText = t(key);
    }
  });
  // update active button style
  document.querySelectorAll('.lang-btn').forEach(b=>b.classList.toggle('active', b.dataset.lang===lang));
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
  if(btnImg) btnImg.onclick = ()=>{ imgWrap.style.display='flex'; vidWrap.style.display='none'; btnImg.classList.add('active'); btnVid.classList.remove('active'); };
  if(btnVid) btnVid.onclick = ()=>{ imgWrap.style.display='none'; vidWrap.style.display='flex'; btnVid.classList.add('active'); btnImg.classList.remove('active'); };
  // initialize based on presence
  if(!vidWrap || vidWrap.children.length===0) { if(btnVid) btnVid.style.display='none'; }
  if(!imgWrap || imgWrap.children.length===0) { if(btnImg) btnImg.style.display='none'; }
}

/* Init */
async function initApp(){
  await loadTranslations();
  await loadConfig();
  await configureForm();
  setupScrollAnimations();
  setupGalleryToggles();
}

document.addEventListener('DOMContentLoaded', initApp);