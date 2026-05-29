// ====================================================================
// Waitlist endpoint — paste your Google Apps Script Web App URL here.
// Setup steps are in SETUP-waitlist.md. Until you fill this in, the
// form runs in demo mode (nothing is saved).
const WAITLIST_ENDPOINT = "https://script.google.com/macros/s/AKfycbxzM66D98Qkd4KXqswPEqc6ZPJgWI9PKUJVS1vRZL6t5QyUnDCGo5F7KPibmdZ19cZbDw/exec"; // e.g. "https://script.google.com/macros/s/AKfy.../exec"
// ====================================================================

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

// waitlist → Google Sheet
const form = document.getElementById('waitlist');
const note = document.getElementById('note');
const btn  = form.querySelector('button[type="submit"]');

form.addEventListener('submit', async e => {
  e.preventDefault();
  const input = document.getElementById('email');
  const email = input.value.trim();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    note.textContent = 'Please enter a valid email.';
    note.classList.remove('ok');
    return;
  }

  // Demo mode — no endpoint configured yet
  if (!WAITLIST_ENDPOINT) {
    note.textContent = "You're on the list ✦  (demo — add your Sheet endpoint to save)";
    note.classList.add('ok');
    form.reset();
    return;
  }

  const label = btn.textContent;
  btn.disabled = true;
  btn.textContent = 'Joining…';

  try {
    await fetch(WAITLIST_ENDPOINT, {
      method: 'POST',
      mode: 'no-cors', // Apps Script web apps don't send CORS headers; fire-and-forget
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ email, source: location.hostname || 'landing' })
    });
    note.textContent = "You're on the list ✦";
    note.classList.add('ok');
    form.reset();
  } catch (err) {
    note.textContent = 'Something went wrong — please try again.';
    note.classList.remove('ok');
  } finally {
    btn.disabled = false;
    btn.textContent = label;
  }
});
