/* =========================================================
   HERO SLIDER
========================================================= */

const slides = document.querySelectorAll('.hero-slide');

let currentSlide = 0;

if (slides.length > 0) {

  setInterval(() => {

    slides[currentSlide].classList.remove('active');

    currentSlide = (currentSlide + 1) % slides.length;

    slides[currentSlide].classList.add('active');

  }, 4000);

}

/* =========================================================
   SCROLL ANIMATIONS
========================================================= */

const faders = document.querySelectorAll('.fade-up');

function showOnScroll() {

  faders.forEach(el => {

    const top = el.getBoundingClientRect().top;

    if (top < window.innerHeight - 100) {
      el.classList.add('show');
    }

  });

}

/* run on load */
showOnScroll();

/* run on scroll */
window.addEventListener('scroll', showOnScroll);