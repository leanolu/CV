const root = document.documentElement;
const hero = document.querySelector('.hero');
const heroTitle = document.querySelector('.hero-title');
const heroLine = document.querySelector('.hero-line');
const orbits = [...document.querySelectorAll('.orbit')];
const journey = document.querySelector('.journey');
const journeyRail = document.querySelector('.journey-rail');
const journeyProgress = document.querySelector('.journey-progress span');
const valueWords = [...document.querySelectorAll('.value-words span')];
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

function updateScrollScene() {
  if (reduceMotion) return;
  const y = window.scrollY;
  const vh = window.innerHeight;

  const heroProgress = clamp(y / Math.max(hero.offsetHeight - vh, 1));
  heroTitle.style.transform = `translate3d(0, ${heroProgress * -48}px, 0) scale(${1 + heroProgress * .12})`;
  heroTitle.style.opacity = 1 - heroProgress * .82;
  heroLine.style.transform = `translate3d(0, ${heroProgress * -22}px, 0)`;
  heroLine.style.opacity = 1 - heroProgress * 1.15;
  orbits.forEach((orbit, index) => {
    const spin = (index % 2 ? -1 : 1) * heroProgress * (12 + index * 4);
    const scale = 1 + heroProgress * (.18 + index * .06);
    orbit.style.transform = `translate(-50%, -50%) rotate(${spin}deg) scale(${scale})`;
  });

  const journeyTop = journey.offsetTop;
  const journeyRange = Math.max(journey.offsetHeight - vh, 1);
  const journeyProgressValue = clamp((y - journeyTop) / journeyRange);
  const railWidth = journeyRail.scrollWidth;
  const available = Math.max(railWidth - window.innerWidth * .46, 0);
  journeyRail.style.transform = `translate3d(${-journeyProgressValue * available}px, -38%, 0)`;
  journeyProgress.style.width = `${journeyProgressValue * 100}%`;

  valueWords.forEach(word => {
    const rect = word.getBoundingClientRect();
    const progress = (vh - rect.top) / (vh + rect.height);
    const speed = Number(word.dataset.speed || 0);
    word.style.transform = `translate3d(${(progress - .5) * speed * 180}px, 0, 0)`;
  });
}

let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => { updateScrollScene(); ticking = false; });
    ticking = true;
  }
}, { passive: true });
window.addEventListener('resize', updateScrollScene);

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('is-visible');
  });
}, { threshold: .16, rootMargin: '0px 0px -6% 0px' });
document.querySelectorAll('.reveal').forEach(node => observer.observe(node));

let lang = 'zh';
const toggle = document.querySelector('.language-toggle');
function setLanguage(next) {
  lang = next;
  root.lang = lang === 'zh' ? 'zh-CN' : 'en';
  document.querySelectorAll('[data-zh][data-en]').forEach(node => {
    node.textContent = node.dataset[lang];
  });
  toggle.innerHTML = lang === 'zh'
    ? '<span class="toggle-current">中</span><span class="toggle-divider">/</span><span>EN</span>'
    : '<span>中</span><span class="toggle-divider">/</span><span class="toggle-current">EN</span>';
  document.title = lang === 'zh' ? '卢雨桐 · Yutong Lu' : 'Yutong Lu · Personal Story';
}
toggle.addEventListener('click', () => setLanguage(lang === 'zh' ? 'en' : 'zh'));

document.getElementById('year').textContent = new Date().getFullYear();
updateScrollScene();
