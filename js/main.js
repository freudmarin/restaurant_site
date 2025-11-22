// main behavior: mobile nav, theme toggle, forms, AOS init handled on pages

// Wait for partials to be loaded before attaching UI handlers
document.addEventListener('DOMContentLoaded', () => {
  // ensure includes are loaded (small delay) - robust approach: poll for header element
  const checkReady = setInterval(() => {
    const header = document.querySelector('header');
    if (header) {
      clearInterval(checkReady);
      setupUI();
    }
  }, 50);
});

function setupUI() {
  // Mobile nav
  const burger = document.getElementById('burger');
  const mobileNav = document.getElementById('mobileNav');
  burger?.addEventListener('click', () => {
    if (!mobileNav) return;
    const isHidden = mobileNav.classList.contains('hidden');
    mobileNav.classList.toggle('hidden');
    burger.setAttribute('aria-expanded', String(isHidden));
    burger.setAttribute('aria-label', isHidden ? 'Close menu' : 'Open menu');
    // move focus into mobile nav when opened
    if (isHidden) {
      const firstLink = mobileNav.querySelector('a');
      firstLink?.focus();
    }
  });

  // Theme toggle (persist)
  const themeToggle = document.getElementById('themeToggle');
  const saved = localStorage.getItem('site-theme');
  if (saved === 'dark') document.body.classList.add('dark');
  // set initial icon
  if (themeToggle) themeToggle.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';

  themeToggle?.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    localStorage.setItem('site-theme', isDark ? 'dark' : 'light');
    themeToggle.textContent = isDark ? '☀️' : '🌙';
    themeToggle.setAttribute('aria-pressed', String(isDark));
  });

  // utility: set min date for reservation date input
  const dateInput = document.getElementById('date');
  if (dateInput && dateInput.type === 'date') {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const minDate = `${yyyy}-${mm}-${dd}`;
    dateInput.setAttribute('min', minDate);
    if (dateInput.value && dateInput.value < minDate) dateInput.value = minDate;
  }

  // Contact form
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // simple validation
      if (!contactForm.checkValidity()) {
        // show browser validation UI and a small inline hint
        contactForm.reportValidity();
        const msg = document.getElementById('contactMsg');
        if (msg) { msg.textContent = 'Please complete the required fields.'; msg.className = 'text-sm text-red-600'; }
        return;
      }
      const name = document.getElementById('contactName').value || '';
      const email = document.getElementById('contactEmail').value || '';
      const message = document.getElementById('contactMessage').value || '';
      const queue = JSON.parse(localStorage.getItem('messages') || '[]');
      queue.push({ name, email, message, date: new Date().toISOString() });
      localStorage.setItem('messages', JSON.stringify(queue));
      const msg = document.getElementById('contactMsg');
      if (msg) { msg.textContent = 'Message saved — we will contact you soon.'; msg.className = 'text-sm text-green-600'; }
      contactForm.reset();
    });
  }

  // Reservation form
  const reserveForm = document.getElementById('reserveForm');
  if (reserveForm) {
    reserveForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!reserveForm.checkValidity()) {
        reserveForm.reportValidity();
        const msg = document.getElementById('reserveMsg');
        if (msg) { msg.textContent = 'Please complete the required fields.'; msg.className = 'text-sm text-red-600'; }
        return;
      }
      const data = new FormData(reserveForm);
      const obj = Object.fromEntries(data.entries());
      const queue = JSON.parse(localStorage.getItem('reservations') || '[]');
      queue.push(obj);
      localStorage.setItem('reservations', JSON.stringify(queue));
      const msg = document.getElementById('reserveMsg');
      if (msg) { msg.textContent = 'Reservation received. We will contact to confirm.'; msg.className = 'text-sm text-green-600'; }
      reserveForm.reset();
    });
  }

  // Simple carousel fallback if present
  const slidesWrap = document.querySelector('#slides > div');
  if (slidesWrap) {
    let idx = 0;
    const total = slidesWrap.children.length;
    setInterval(() => { idx = (idx + 1) % total; slidesWrap.style.transform = `translateX(${-idx * 100}%)`; }, 5000);
  }

  // Smooth scroll anchors (fallback)
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}
