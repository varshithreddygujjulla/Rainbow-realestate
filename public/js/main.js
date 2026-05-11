/* =========================================================
   HERO SLIDER
========================================================= */

const slides = document.querySelectorAll('.hero-slide');
const dots   = document.querySelectorAll('.slide-dots .dot');
let currentSlide = 0;
let slideTimer;

function goToSlide(n) {
  slides[currentSlide].classList.remove('active');
  if (dots[currentSlide]) dots[currentSlide].classList.remove('active');
  currentSlide = (n + slides.length) % slides.length;
  slides[currentSlide].classList.add('active');
  if (dots[currentSlide]) dots[currentSlide].classList.add('active');
}

function startSlider() {
  if (slides.length > 1) {
    slideTimer = setInterval(() => goToSlide(currentSlide + 1), 5000);
  }
}

startSlider();

/* =========================================================
   STAT COUNTER ANIMATION
========================================================= */

function animateCounter(el, target, suffix) {
  const duration = 2000;
  const step     = 16;
  const increment = (target / duration) * step;
  let current = 0;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current) + (suffix || '+');
  }, step);
}

const counters = document.querySelectorAll('.counter');
let countersStarted = false;

function startCounters() {
  if (countersStarted) return;
  const statsBar = document.querySelector('.stats-bar');
  if (!statsBar) return;
  const rect = statsBar.getBoundingClientRect();
  if (rect.top < window.innerHeight - 80) {
    countersStarted = true;
    counters.forEach(counter => {
      const parent = counter.closest('[data-target]');
      const target = parseInt(parent ? parent.dataset.target : counter.dataset.target) || 0;
      animateCounter(counter, target, '+');
    });
  }
}

/* =========================================================
   SCROLL REVEAL
========================================================= */

const revealEls = document.querySelectorAll(
  '.reveal-card, .reveal-left, .reveal-right, .reveal-up'
);

function revealOnScroll() {
  revealEls.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 80) {
      el.classList.add('revealed');
    }
  });
  startCounters();
}

revealOnScroll();
window.addEventListener('scroll', revealOnScroll, { passive: true });

/* =========================================================
   TESTIMONIAL SLIDER
========================================================= */

const track     = document.getElementById('testimonialsTrack');
const testiDots = document.querySelectorAll('.t-dot');
let currentTesti = 0;
let testiTimer;

function goToTesti(n) {
  if (!track) return;
  const cards = track.querySelectorAll('.testi-card');
  if (!cards.length) return;
  testiDots.forEach(d => d.classList.remove('active'));
  currentTesti = (n + cards.length) % cards.length;
  track.style.transform = `translateX(-${currentTesti * 100}%)`;
  if (testiDots[currentTesti]) testiDots[currentTesti].classList.add('active');
}

function startTestiSlider() {
  if (track) {
    testiTimer = setInterval(() => goToTesti(currentTesti + 1), 4500);
  }
}

startTestiSlider();

/* =========================================================
   NAVBAR — scroll shrink + active link
========================================================= */

const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
  if (navbar) {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
}, { passive: true });

/* =========================================================
   MOBILE MENU
========================================================= */

function toggleMenu() {
  const menu = document.getElementById('navMenu');
  if (menu) menu.classList.toggle('active');
}

/* =========================================================
   AUTO HIDE FLASH ALERTS
========================================================= */

setTimeout(() => {
  document.querySelectorAll('.alert').forEach(alert => {
    alert.style.opacity  = '0';
    alert.style.transform = 'translateX(30px)';
    setTimeout(() => { alert.style.display = 'none'; }, 400);
  });
}, 3500);

/* =========================================================
   LIGHTBOX (project details page)
========================================================= */

function openLightbox(src) {
  const lb = document.getElementById('lightbox');
  const img = document.getElementById('lightbox-img');
  if (lb && img) {
    img.src = src;
    lb.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  if (lb) {
    lb.style.display = 'none';
    document.body.style.overflow = '';
  }
}