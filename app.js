// ====================================================================
// Waitlist endpoint — paste your Google Apps Script Web App URL here.
// Setup steps are in SETUP-waitlist.md. Until you fill this in, the
// form runs in demo mode (nothing is saved).
const WAITLIST_ENDPOINT = "https://script.google.com/macros/s/AKfycbxzM66D98Qkd4KXqswPEqc6ZPJgWI9PKUJVS1vRZL6t5QyUnDCGo5F7KPibmdZ19cZbDw/exec";
// ====================================================================

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

// dismiss announcement bar
const bar = document.getElementById('bar');
document.getElementById('barX').addEventListener('click', e => { e.stopPropagation(); bar.classList.add('hide'); });

// nav scroll border + mobile sheet
const nav = document.getElementById('nav');
const burger = document.getElementById('burger');
const sheet = document.getElementById('sheet');
addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 6), { passive: true });
burger.addEventListener('click', () => { burger.classList.toggle('open'); sheet.classList.toggle('open'); });
sheet.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  burger.classList.remove('open'); sheet.classList.remove('open');
}));

// scroll reveal
const io = new IntersectionObserver(es => {
  es.forEach((e, n) => { if (e.isIntersecting) { e.target.style.transitionDelay = (n % 3) * 70 + 'ms'; e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.16 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// ---- live product pipeline animation ----
const steps = [...document.querySelectorAll('.steps li')];
const logEl = document.getElementById('logLine');
const LOGS = [
  '▸ writing product spec & acceptance criteria…',
  '▸ choosing stack · drafting API contracts…',
  '▸ splitting work into 6 scoped tasks…',
  '▸ claude · editing src/checkout/api.ts',
  '✓ typecheck · 14 tests · build passed',
  '◎ reviewer agent scanning diff (fresh context)…',
  '✓ PR #128 opened — checkout flow'
];
function typeLog(text, cb) {
  clearInterval(typeLog._t);
  let c = 0; logEl.textContent = '';
  typeLog._t = setInterval(() => {
    logEl.textContent = text.slice(0, ++c);
    if (c >= text.length) { clearInterval(typeLog._t); setTimeout(cb, 950); }
  }, 22);
}
let si = 0;
function tick() {
  steps.forEach((li, n) => { li.classList.toggle('done', n < si); li.classList.toggle('active', n === si); });
  typeLog(LOGS[si], () => {
    si++;
    if (si < steps.length) setTimeout(tick, 420);
    else {
      steps.forEach(li => { li.classList.add('done'); li.classList.remove('active'); });
      setTimeout(() => { si = 0; tick(); }, 1700);
    }
  });
}
if (steps.length && logEl) {
  if (reduce) { steps.forEach(li => li.classList.add('done')); logEl.textContent = LOGS[LOGS.length - 1]; }
  else tick();
}

// ---- count-up stats ----
function countUp(el) {
  const to = +el.dataset.to, suf = el.dataset.suffix || '', dur = 1200, t0 = performance.now();
  (function f(now) {
    const p = Math.min(1, (now - t0) / dur);
    el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))) + suf;
    if (p < 1) requestAnimationFrame(f);
  })(t0);
}
const numIO = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { reduce ? e.target.textContent = e.target.dataset.to + (e.target.dataset.suffix || '') : countUp(e.target); numIO.unobserve(e.target); }
}), { threshold: 0.6 });
document.querySelectorAll('.num').forEach(el => numIO.observe(el));

// waitlist → Google Sheet
const form = document.getElementById('waitlist');
const note = document.getElementById('note');
const btn  = form.querySelector('button[type="submit"]');
form.addEventListener('submit', async e => {
  e.preventDefault();
  const input = document.getElementById('email');
  const email = input.value.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    note.textContent = 'Please enter a valid email.'; note.classList.remove('ok'); return;
  }
  if (!WAITLIST_ENDPOINT) {
    note.textContent = "You're on the list ✦  (demo — add your Sheet endpoint to save)";
    note.classList.add('ok'); form.reset(); return;
  }
  const label = btn.textContent;
  btn.disabled = true; btn.textContent = 'Joining…';
  try {
    await fetch(WAITLIST_ENDPOINT, {
      method: 'POST', mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ email, source: location.hostname || 'landing' })
    });
    note.textContent = "You're on the list ✦"; note.classList.add('ok'); form.reset();
  } catch (err) {
    note.textContent = 'Something went wrong — please try again.'; note.classList.remove('ok');
  } finally {
    btn.disabled = false; btn.textContent = label;
  }
});
