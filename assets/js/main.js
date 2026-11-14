/**
 * OrchidByte Solutions - Interactive Core
 * Synchronized Multi-Theme Engine, Touch-Optimized Mobile Drawer, and Dynamic Interactions
 */
document.addEventListener('DOMContentLoaded', () => {

  // 1. DUAL THEME ENGINE (Synced Desktop + Mobile)
  const themeToggleBtns = document.querySelectorAll('#theme-toggle, #theme-toggle-mobile');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedTheme = localStorage.getItem('ob_theme') || (prefersDark ? 'dark' : 'dark');

  const sunIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
  const moonIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ob_theme', theme);
    themeToggleBtns.forEach(btn => {
      btn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
      btn.innerHTML = theme === 'dark' ? sunIcon : moonIcon;
    });
  }

  applyTheme(savedTheme);

  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
    });
  });

  // 2. NAVBAR SCROLL EFFECT
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const handleScroll = () => {
      if (window.scrollY > 25) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // 3. TOUCH-FRIENDLY MOBILE MENU DRAWER
  const menuToggle = document.getElementById('menu-toggle');
  const menuClose = document.getElementById('menu-close');
  const mobileMenu = document.getElementById('mobile-menu');

  function openMobileMenu() {
    if (mobileMenu) {
      mobileMenu.classList.add('open');
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    }
  }

  function closeMobileMenu() {
    if (mobileMenu) {
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
  }

  if (menuToggle) menuToggle.addEventListener('click', openMobileMenu);
  if (menuClose) menuClose.addEventListener('click', closeMobileMenu);

  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileMenu();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) closeMobileMenu();
  });

  // 4. SCROLL REVEAL OBSERVER
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });

    reveals.forEach(el => revealObserver.observe(el));

    // Instantly reveal top-of-page content
    document.querySelectorAll('#home .reveal, .page-header .reveal').forEach(el => {
      el.classList.add('is-visible');
    });
  }

  // 5. ANIMATED NUMERICAL COUNTERS
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (counters.length > 0) {
    function runCounter(el, target, suffix = '') {
      const duration = 1500;
      const startTime = performance.now();

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        const currentVal = Math.floor(ease * target);
        
        el.textContent = currentVal + (progress < 1 ? '' : suffix);
        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          el.textContent = target + suffix;
        }
      }
      requestAnimationFrame(update);
    }

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.getAttribute('data-target'), 10);
          const suffix = entry.target.getAttribute('data-suffix') !== null ? entry.target.getAttribute('data-suffix') : (target >= 5 ? '+' : '');
          if (!isNaN(target)) runCounter(entry.target, target, suffix);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });

    counters.forEach(c => counterObserver.observe(c));
  }

  // 6. FAQ ACCORDION
  const faqBtns = document.querySelectorAll('.faq-btn');
  faqBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');

      document.querySelectorAll('.faq-item.open').forEach(openItem => {
        openItem.classList.remove('open');
      });

      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });

  // 7. PROJECT FILTER TABS (Touch swipeable on mobile)
  const filterTabs = document.querySelectorAll('.filter-tab');
  const projectCards = document.querySelectorAll('.project-card[data-category]');

  if (filterTabs.length > 0 && projectCards.length > 0) {
    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const filter = tab.getAttribute('data-filter');

        projectCards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.style.display = '';
            setTimeout(() => card.classList.add('is-visible'), 40);
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // 8. CONTACT FORM AJAX WITH HONEYPOT
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');

  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const form = this;
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      const hp = form.querySelector('input[name="website_hp"]');
      if (hp && hp.value.trim() !== '') {
        form.style.display = 'none';
        if (formSuccess) formSuccess.style.display = 'block';
        return;
      }

      submitBtn.disabled = true;
      submitBtn.innerHTML = `Sending Transmission…`;

      const formData = new FormData(form);

      fetch('contact.php', {
        method: 'POST',
        body: formData
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          form.style.display = 'none';
          if (formSuccess) {
            formSuccess.style.display = 'block';
            formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        } else {
          alert(data.message || 'Unable to send message. Please contact us directly at info@orchidbyte-solutions.com.ng');
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
      })
      .catch(() => {
        alert('Connection error. You can also message us directly on WhatsApp (+234 815 666 1246).');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      });
    });
  }

});
