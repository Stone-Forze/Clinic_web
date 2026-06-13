document.addEventListener('DOMContentLoaded', () => {
  // --- 1. PRELOADER & INITIALIZATION ---
  const loader = document.getElementById('loading-overlay');
  
  // Fade out preloader when page finishes loading
  window.addEventListener('load', () => {
    fadeOutLoader();
  });

  // Guard safety timeout if load event doesn't trigger
  setTimeout(() => {
    if (loader && !loader.classList.contains('fade-out')) {
      fadeOutLoader();
    }
  }, 2000);

  function fadeOutLoader() {
    if (loader) {
      loader.classList.add('fade-out');
      setTimeout(() => {
        loader.style.display = 'none';
      }, 500);
    }
    // Refresh scroll icons and animations upon reveal
    animateOnScroll();
    initCounters();
  }

  // --- 2. FLOATING SYSTEM INTRO - SCROLL PROGRESS & BACK TO TOP ---
  const scrollProgress = document.getElementById('scroll-progress');
  const backToTopBtn = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    // Scroll progress measurement
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
    
    if (scrollProgress) {
      scrollProgress.style.width = scrolled + '%';
    }

    // Toggle Back-To-Top floating button
    if (backToTopBtn) {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    }

    // Secondary triggers
    handleStickyNav();
    highlightActiveSection();
    animateOnScroll();
  });

  // --- 3. STICKY NAVBAR LOGIC ---
  const header = document.getElementById('header-navbar');
  
  function handleStickyNav() {
    if (!header) return;
    if (window.scrollY > 40) {
      header.classList.add('py-3', 'shadow-md');
      header.classList.remove('py-5');
    } else {
      header.classList.add('py-5');
      header.classList.remove('py-3', 'shadow-md');
    }
  }

  // --- 4. ACCESSIBLE SCROLL-TRIGGERED REVEAL ANIMATIONS ---
  const animatedSections = document.querySelectorAll('.fade-in-section');

  function animateOnScroll() {
    animatedSections.forEach(section => {
      const rect = section.getBoundingClientRect();
      const triggeredOffset = window.innerHeight * 0.88; // Keep reveal natural
      
      if (rect.top <= triggeredOffset) {
        section.classList.add('is-visible');
      }
    });
  }

  // --- 5. ACTIVE NAVIGATION SEGMENT HIGHLIGHTING ---
  const navSections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function highlightActiveSection() {
    let currentId = '';
    const scrollPosition = window.scrollY + 100; // Offset spacing

    navSections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active-nav');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active-nav');
      }
    });
  }

  // --- 6. INTERACTIVE STATISTIC COUNTERS ---
  const statNumbers = document.querySelectorAll('.stat-number');
  let countersAnimated = false;

  function initCounters() {
    const statsSection = document.getElementById('stats-section');
    if (!statsSection) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersAnimated) {
          triggerCounters();
          countersAnimated = true;
        }
      });
    }, { threshold: 0.5 });

    observer.observe(statsSection);
  }

  function triggerCounters() {
    statNumbers.forEach(stat => {
      const targetStr = stat.getAttribute('data-target');
      // Extract number array from targets containing text decorators
      const targetNum = parseFloat(targetStr.replace(/[+★]/g, ''));
      const isFloat = targetStr.includes('★') || targetStr.includes('.');
      const suffix = targetStr.includes('+') ? '+' : (targetStr.includes('★') ? '★' : '');
      
      let startValue = 0;
      const duration = 2000; // 2 seconds transition
      const steps = 60;
      const stepTime = duration / steps;
      const increment = targetNum / steps;

      let currentStep = 0;
      const counterTimer = setInterval(() => {
        currentStep++;
        let currentValue = startValue + (increment * currentStep);
        
        if (currentStep >= steps) {
          clearInterval(counterTimer);
          stat.textContent = isFloat ? targetNum.toFixed(1) + suffix : Math.round(targetNum) + suffix;
        } else {
          stat.textContent = isFloat ? currentValue.toFixed(1) + suffix : Math.round(currentValue) + suffix;
        }
      }, stepTime);
    });
  }

  // --- 7. PREMIUM INTERACTIVE TESTIMONIAL SLIDER ---
  const slides = document.querySelectorAll('.testimonial-slide');
  const bullets = document.querySelectorAll('.slider-bullet');
  const btnPrev = document.getElementById('slider-prev');
  const btnNext = document.getElementById('slider-next');
  let currentSlideIndex = 0;
  let autoplayInterval;

  function showSlide(index) {
    if (slides.length === 0) return;
    
    // Bounds wrapping safety
    if (index >= slides.length) {
      currentSlideIndex = 0;
    } else if (index < 0) {
      currentSlideIndex = slides.length - 1;
    } else {
      currentSlideIndex = index;
    }

    // Toggle slide active visibility state
    slides.forEach((slide, idx) => {
      slide.classList.remove('active');
      if (idx === currentSlideIndex) {
        slide.classList.add('active');
      }
    });

    // Toggle dynamic indicators
    bullets.forEach((bullet, idx) => {
      bullet.classList.remove('bg-sky-600', 'w-6');
      bullet.classList.add('bg-slate-300', 'w-2');
      if (idx === currentSlideIndex) {
        bullet.classList.remove('bg-slate-300', 'w-2');
        bullet.classList.add('bg-sky-600', 'w-6');
      }
    });
  }

  function nextSlide() {
    showSlide(currentSlideIndex + 1);
  }

  function prevSlide() {
    showSlide(currentSlideIndex - 1);
  }

  // Initialize event anchors for slider buttons
  if (btnNext) btnNext.addEventListener('click', () => {
    nextSlide();
    resetAutoplay();
  });
  
  if (btnPrev) btnPrev.addEventListener('click', () => {
    prevSlide();
    resetAutoplay();
  });

  // Attach bullet triggers
  bullets.forEach((bullet, idx) => {
    bullet.addEventListener('click', () => {
      showSlide(idx);
      resetAutoplay();
    });
  });

  // Autoplay routines with pause-on-hover triggers
  function startAutoplay() {
    autoplayInterval = setInterval(nextSlide, 5000);
  }

  function resetAutoplay() {
    clearInterval(autoplayInterval);
    startAutoplay();
  }

  const testimonialWrapper = document.getElementById('testimonial-wrapper');
  if (testimonialWrapper) {
    testimonialWrapper.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
    testimonialWrapper.addEventListener('mouseleave', () => startAutoplay());
  }

  // Initialize Slide and Autoplay engine
  showSlide(0);
  startAutoplay();

  // --- 8. ACCESSIBLE FAQ ACCORDIONS ---
  const faqTriggers = document.querySelectorAll('.faq-trigger');

  faqTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const contentId = trigger.getAttribute('aria-controls');
      const content = document.getElementById(contentId);
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

      // Reset peer siblings for single accordion-mode (or accordion folding rhythm)
      faqTriggers.forEach(siblingTrigger => {
        if (siblingTrigger !== trigger) {
          siblingTrigger.setAttribute('aria-expanded', 'false');
          const siblingContent = document.getElementById(siblingTrigger.getAttribute('aria-controls'));
          if (siblingContent) {
            siblingContent.classList.remove('open');
            siblingContent.style.maxHeight = '0px';
          }
        }
      });

      // Toggle state of current trigger
      trigger.setAttribute('aria-expanded', !isExpanded);
      if (!isExpanded) {
        content.classList.add('open');
        content.style.maxHeight = content.scrollHeight + 'px';
      } else {
        content.classList.remove('open');
        content.style.maxHeight = '0px';
      }
    });
  });

  // --- 9. INTERACTIVE APPOINTMENT FORM CONTROL ---
  const bookingForm = document.getElementById('clinic-booking-form');
  const appointmentSubmitBtn = document.getElementById('booking-submit-btn');
  const successModal = document.getElementById('success-modal');
  const successCloseBtn = document.getElementById('close-success-modal');
  
  // Receipts elements for dynamic confirmation mapping
  const receiptName = document.getElementById('receipt-name');
  const receiptPhone = document.getElementById('receipt-phone');
  const receiptDate = document.getElementById('receipt-date');
  const receiptDepartment = document.getElementById('receipt-dept');
  const receiptDoctor = document.getElementById('receipt-doctor');
  const receiptCode = document.getElementById('receipt-code');

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Basic field values extract
      const patientFullName = document.getElementById('patient-name').value.trim();
      const patientPhone = document.getElementById('patient-phone').value.trim();
      const patientEmail = document.getElementById('patient-email').value.trim();
      const bookingDate = document.getElementById('booking-date').value;
      const deptNode = document.getElementById('booking-department');
      const doctorNode = document.getElementById('booking-doctor');
      
      const departmentText = deptNode.options[deptNode.selectedIndex].text;
      const doctorText = doctorNode.options[doctorNode.selectedIndex].text;
      
      if (!patientFullName || !patientPhone || !patientEmail || !bookingDate) {
        alert('Please complete all required fields to register your clinical booking.');
        return;
      }

      // Display high-class loading state to user
      const originalText = appointmentSubmitBtn.innerHTML;
      appointmentSubmitBtn.disabled = true;
      appointmentSubmitBtn.innerHTML = `
        <div class="flex items-center justify-center gap-2">
          <svg class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Checking Availability...
        </div>
      `;

      // Mock remote validation latency
      setTimeout(() => {
        // Hydrate Receipt with variables
        if (receiptName) receiptName.textContent = patientFullName;
        if (receiptPhone) receiptPhone.textContent = patientPhone;
        if (receiptDate) receiptDate.textContent = formatClinicDate(bookingDate);
        if (receiptDepartment) receiptDepartment.textContent = departmentText;
        if (receiptDoctor) receiptDoctor.textContent = doctorText;
        if (receiptCode) receiptCode.textContent = "HC-" + Math.floor(100000 + Math.random() * 900000);

        // Success dialog visualization
        if (successModal) {
          successModal.classList.remove('hidden');
          successModal.classList.add('flex');
        }

        // Restore scheduling button
        appointmentSubmitBtn.disabled = false;
        appointmentSubmitBtn.innerHTML = originalText;
        
        // Reset full validation node
        bookingForm.reset();
      }, 1500);
    });
  }

  if (successCloseBtn) {
    successCloseBtn.addEventListener('click', () => {
      if (successModal) {
        successModal.classList.remove('flex');
        successModal.classList.add('hidden');
      }
    });
  }

  // Quick date formatter
  function formatClinicDate(dateString) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateObj = new Date(dateString);
    return dateObj.toLocaleDateString('en-US', options);
  }

  // --- 10. FLOATING WHATSAPP CHAT DESIGN ---
  const whatsappToggleBtn = document.getElementById('whatsapp-toggle');
  const whatsappBox = document.getElementById('whatsapp-chat-box');
  const whatsappClose = document.getElementById('whatsapp-close');
  const whatsappSubmit = document.getElementById('whatsapp-send-btn');
  const whatsappInput = document.getElementById('whatsapp-message-input');

  if (whatsappToggleBtn && whatsappBox) {
    // Open/Close toggle chat widget
    whatsappToggleBtn.addEventListener('click', () => {
      whatsappBox.classList.toggle('show');
    });

    if (whatsappClose) {
      whatsappClose.addEventListener('click', () => {
        whatsappBox.classList.remove('show');
      });
    }

    // Capture standard fast click queries
    const presetQuestions = document.querySelectorAll('.whatsapp-preset');
    presetQuestions.forEach(presetBtn => {
      presetBtn.addEventListener('click', () => {
        const text = presetBtn.getAttribute('data-text');
        if (whatsappInput) {
          whatsappInput.value = text;
          whatsappInput.focus();
        }
      });
    });

    // Fire standard Whatsapp redirect URI
    if (whatsappSubmit) {
      whatsappSubmit.addEventListener('click', fireWhatsAppRedirect);
    }

    if (whatsappInput) {
      whatsappInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          fireWhatsAppRedirect();
        }
      });
    }

    function fireWhatsAppRedirect() {
      const message = whatsappInput ? whatsappInput.value.trim() : '';
      const fallbackMsg = "Hello! I would like to inquire about medical consultations and services at your premium clinic.";
      const encodedMsg = encodeURIComponent(message || fallbackMsg);
      const whatsappApiLink = `https://wa.me/00000000000?text=${encodedMsg}`;
      
      // Open in a safe sandbox tab
      window.open(whatsappApiLink, '_blank');
      whatsappBox.classList.remove('show');
      if (whatsappInput) whatsappInput.value = '';
    }
  }

  // Mobile navigation drawer toggle helper
  const mobileNavMenuBtn = document.getElementById('mobile-menu-btn');
  const headerMobileNav = document.getElementById('mobile-nav-drawer');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileNavMenuBtn && headerMobileNav) {
    mobileNavMenuBtn.addEventListener('click', () => {
      headerMobileNav.classList.toggle('max-h-0');
      headerMobileNav.classList.toggle('max-h-[500px]');
      headerMobileNav.classList.toggle('opacity-0');
      headerMobileNav.classList.toggle('py-4');
    });

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        headerMobileNav.classList.add('max-h-0', 'opacity-0');
        headerMobileNav.classList.remove('max-h-[500px]', 'py-4');
      });
    });
  }

  // Live trigger index icons initialization via CDN
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
});
