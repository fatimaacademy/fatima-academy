/**
 * FATIMA ACADEMY - MAIN JAVASCRIPT LOGIC
 * Online Islamic Education Platform (fatimaacademy.in)
 * Phone: +91 6397-999807
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all interactive components
  initWhatsAppButtons();
  initMobileNav();
  initHeroSlider();
  initFAQAccordion();
  initContactForm();
  initScrollAnimations();
  initCurrentYear();
  setActiveNavLink();
});

/* ==========================================================================
   1. REUSABLE WHATSAPP HELPER FUNCTION
   ========================================================================== */
const WHATSAPP_NUMBER = "916397999807";

/**
 * Encodes message and opens WhatsApp web/app directly
 * @param {string} message - Pre-filled message string
 */
function openWhatsApp(message) {
  const defaultMsg = "Assalamu Alaikum, I would like to know more about Fatima Academy online classes.";
  const textToUse = message && message.trim() !== "" ? message : defaultMsg;
  const encodedText = encodeURIComponent(textToUse);
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedText}`;
  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
}

/**
 * Binds data-whatsapp-msg attributes to click handlers
 */
function initWhatsAppButtons() {
  const whatsappTriggers = document.querySelectorAll('[data-whatsapp-msg]');
  whatsappTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const customMsg = btn.getAttribute('data-whatsapp-msg');
      openWhatsApp(customMsg);
    });
  });
}

/* ==========================================================================
   2. MOBILE NAVIGATION DRAWER & ACCESSIBILITY
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const overlay = document.getElementById('nav-overlay');

  if (!toggleBtn || !navMenu || !overlay) return;

  function openMenu() {
    toggleBtn.classList.add('active');
    toggleBtn.setAttribute('aria-expanded', 'true');
    navMenu.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    toggleBtn.classList.remove('active');
    toggleBtn.setAttribute('aria-expanded', 'false');
    navMenu.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', () => {
    const isOpen = navMenu.classList.contains('active');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  overlay.addEventListener('click', closeMenu);

  // Close menu when clicking any nav link
  const navLinks = navMenu.querySelectorAll('.nav-link, .btn');
  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

/* ==========================================================================
   3. HERO SLIDER (AUTO-SLIDE, ARROWS, DOTS, TOUCH SWIPE)
   ========================================================================== */
function initHeroSlider() {
  const sliderContainer = document.querySelector('.hero-slider');
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.slider-dot');
  const prevBtn = document.getElementById('slider-prev');
  const nextBtn = document.getElementById('slider-next');

  if (!slides.length) return;

  let currentSlide = 0;
  let slideInterval = null;
  const slideDuration = 5000; // 5 seconds

  function showSlide(index) {
    // Wrap around index
    if (index >= slides.length) currentSlide = 0;
    else if (index < 0) currentSlide = slides.length - 1;
    else currentSlide = index;

    slides.forEach((slide, i) => {
      if (i === currentSlide) {
        slide.classList.add('active');
        slide.setAttribute('aria-hidden', 'false');
      } else {
        slide.classList.remove('active');
        slide.setAttribute('aria-hidden', 'true');
      }
    });

    dots.forEach((dot, i) => {
      if (i === currentSlide) {
        dot.classList.add('active');
        dot.setAttribute('aria-current', 'true');
      } else {
        dot.classList.remove('active');
        dot.removeAttribute('aria-current');
      }
    });
  }

  function nextSlide() {
    showSlide(currentSlide + 1);
  }

  function prevSlide() {
    showSlide(currentSlide - 1);
  }

  function startAutoSlide() {
    stopAutoSlide();
    slideInterval = setInterval(nextSlide, slideDuration);
  }

  function stopAutoSlide() {
    if (slideInterval) clearInterval(slideInterval);
  }

  // Event Listeners for Arrow Controls
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      startAutoSlide();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      startAutoSlide();
    });
  }

  // Event Listeners for Dots
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showSlide(index);
      startAutoSlide();
    });
  });

  // Pause on hover
  if (sliderContainer) {
    sliderContainer.addEventListener('mouseenter', stopAutoSlide);
    sliderContainer.addEventListener('mouseleave', startAutoSlide);
  }

  // Touch Swipe Support for Mobile
  let touchStartX = 0;
  let touchEndX = 0;

  if (sliderContainer) {
    sliderContainer.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    sliderContainer.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
  }

  function handleSwipe() {
    const swipeThreshold = 40;
    if (touchEndX < touchStartX - swipeThreshold) {
      nextSlide();
      startAutoSlide();
    } else if (touchEndX > touchStartX + swipeThreshold) {
      prevSlide();
      startAutoSlide();
    }
  }

  // Start slider initially
  showSlide(0);
  startAutoSlide();
}

/* ==========================================================================
   4. FAQ ACCORDION (ACCESSIBLE, SMOOTH HEIGHT TRANSITION)
   ========================================================================== */
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const button = item.querySelector('.faq-button');
    const content = item.querySelector('.faq-content');

    if (!button || !content) return;

    button.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other accordion items for clean UX
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherBtn = otherItem.querySelector('.faq-button');
          const otherContent = otherItem.querySelector('.faq-content');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          if (otherContent) {
            otherContent.style.maxHeight = null;
            otherContent.setAttribute('aria-hidden', 'true');
          }
        }
      });

      // Toggle clicked item
      if (isActive) {
        item.classList.remove('active');
        button.setAttribute('aria-expanded', 'false');
        content.style.maxHeight = null;
        content.setAttribute('aria-hidden', 'true');
      } else {
        item.classList.add('active');
        button.setAttribute('aria-expanded', 'true');
        content.style.maxHeight = content.scrollHeight + "px";
        content.setAttribute('aria-hidden', 'false');
      }
    });
  });
}

/* ==========================================================================
   5. CONTACT FORM TO WHATSAPP SUBMISSION
   ========================================================================== */
function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('form-name');
    const emailInput = document.getElementById('form-email');
    const phoneInput = document.getElementById('form-phone');
    const courseSelect = document.getElementById('form-course');
    const messageInput = document.getElementById('form-message');

    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const phone = phoneInput ? phoneInput.value.trim() : '';
    const course = courseSelect ? courseSelect.value : '';
    const userMessage = messageInput ? messageInput.value.trim() : '';

    // Basic Validation
    if (!name || !phone || !course) {
      alert("Please fill in your Name, Phone Number, and select a Course.");
      return;
    }

    // Format WhatsApp message
    let waMessage = `Assalamu Alaikum Fatima Academy,\n\n`;
    waMessage += `*Name:* ${name}\n`;
    waMessage += `*Phone:* ${phone}\n`;
    if (email) waMessage += `*Email:* ${email}\n`;
    waMessage += `*Interested Course:* ${course}\n`;
    if (userMessage) waMessage += `*Message:* ${userMessage}\n\n`;
    waMessage += `Please share class timings and enrollment details.`;

    openWhatsApp(waMessage);

    // Optional Form Reset
    contactForm.reset();
  });
}

/* ==========================================================================
   6. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
   ========================================================================== */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.reveal');
  if (!revealElements.length || !('IntersectionObserver' in window)) {
    // Fallback if IntersectionObserver is not supported
    revealElements.forEach(el => el.classList.add('active'));
    return;
  }

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   7. FOOTER CURRENT YEAR & ACTIVE NAV LINK
   ========================================================================== */
function initCurrentYear() {
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

function setActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    } else {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    }
  });
}
