/* main.js - Core JavaScript (ES6+, Modular) */
'use strict';

// ============================================
// THEME MANAGER
// ============================================
const ThemeManager = (() => {
  const STORAGE_KEY = 'gql-theme';
  const THEMES = { DARK: 'dark', LIGHT: 'light' };

  const getSystemTheme = () =>
    window.matchMedia('(prefers-color-scheme: light)').matches ? THEMES.LIGHT : THEMES.DARK;

  const getSavedTheme = () => localStorage.getItem(STORAGE_KEY) || getSystemTheme();

  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    updateToggleBtns(theme);
  };

  const updateToggleBtns = (theme) => {
    document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
      const icon = btn.querySelector('i');
      if (!icon) return;
      icon.className = theme === THEMES.DARK ? 'fas fa-sun' : 'fas fa-moon';
      btn.setAttribute('aria-label', theme === THEMES.DARK ? 'Switch to light mode' : 'Switch to dark mode');
    });
  };

  const toggle = () => {
    const current = document.documentElement.getAttribute('data-theme') || THEMES.DARK;
    applyTheme(current === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK);
  };

  const init = () => {
    applyTheme(getSavedTheme());
    document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
      btn.addEventListener('click', toggle);
    });
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', e => {
      if (!localStorage.getItem(STORAGE_KEY)) applyTheme(e.matches ? THEMES.LIGHT : THEMES.DARK);
    });
  };

  return { init, toggle, applyTheme };
})();

// ============================================
// RTL MANAGER
// ============================================
const RTLManager = (() => {
  const STORAGE_KEY = 'gql-dir';

  const getDir = () => localStorage.getItem(STORAGE_KEY) || 'ltr';

  const applyDir = (dir) => {
    document.documentElement.setAttribute('dir', dir);
    localStorage.setItem(STORAGE_KEY, dir);
    updateToggleBtns(dir);
  };

  const updateToggleBtns = (dir) => {
    document.querySelectorAll('[data-rtl-toggle]').forEach(btn => {
      btn.classList.toggle('active', dir === 'rtl');
    });
  };

  const toggle = () => {
    const current = document.documentElement.getAttribute('dir') || 'ltr';
    applyDir(current === 'ltr' ? 'rtl' : 'ltr');
  };

  const init = () => {
    applyDir(getDir());
    document.querySelectorAll('[data-rtl-toggle]').forEach(btn => {
      btn.addEventListener('click', toggle);
    });
  };

  return { init, toggle };
})();

// ============================================
// HEADER MANAGER
// ============================================
const HeaderManager = (() => {
  const init = () => {
    const header = document.querySelector('.header');
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (header) {
      window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 20);
      }, { passive: true });
    }

    if (hamburger && mobileMenu) {
      hamburger.addEventListener('click', () => {
        const isOpen = hamburger.classList.toggle('open');
        mobileMenu.classList.toggle('open', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
        hamburger.setAttribute('aria-expanded', isOpen);
      });

      // Close on link click
      mobileMenu.querySelectorAll('.mobile-menu__link').forEach(link => {
        link.addEventListener('click', () => {
          hamburger.classList.remove('open');
          mobileMenu.classList.remove('open');
          document.body.style.overflow = '';
        });
      });

      // Close on outside click
      document.addEventListener('click', (e) => {
        if (mobileMenu.classList.contains('open') &&
            !mobileMenu.contains(e.target) &&
            !hamburger.contains(e.target)) {
          hamburger.classList.remove('open');
          mobileMenu.classList.remove('open');
          document.body.style.overflow = '';
        }
      });
    }

    // Active link detection
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav__link, .mobile-menu__link').forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  };

  return { init };
})();

// ============================================
// SCROLL PROGRESS
// ============================================
const ScrollProgress = (() => {
  const init = () => {
    const bar = document.createElement('div');
    bar.className = 'scroll-progress';
    bar.style.width = '0%';
    document.body.prepend(bar);

    window.addEventListener('scroll', () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const pct = total > 0 ? (window.scrollY / total) * 100 : 0;
      bar.style.width = `${pct}%`;
    }, { passive: true });
  };

  return { init };
})();

// ============================================
// REVEAL ON SCROLL
// ============================================
const RevealOnScroll = (() => {
  const init = () => {
    const elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, i * 80);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    elements.forEach(el => observer.observe(el));
  };

  return { init };
})();

// ============================================
// COUNTER ANIMATION
// ============================================
const CounterAnimation = (() => {
  const animateCounter = (el) => {
    const target = parseFloat(el.getAttribute('data-target'));
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 2000;
    const start = performance.now();

    const update = (time) => {
      const elapsed = time - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;

      el.textContent = (Number.isInteger(target) ? Math.floor(value) : value.toFixed(1)) + suffix;

      if (progress < 1) requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
  };

  const init = () => {
    const counters = document.querySelectorAll('[data-counter]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => observer.observe(el));
  };

  return { init };
})();

// ============================================
// FAQ ACCORDION
// ============================================
const FAQAccordion = (() => {
  const init = () => {
    document.querySelectorAll('.faq-question').forEach(question => {
      question.addEventListener('click', () => {
        const item = question.closest('.faq-item');
        const isOpen = item.classList.contains('open');

        // Close all
        document.querySelectorAll('.faq-item.open').forEach(openItem => {
          openItem.classList.remove('open');
        });

        // Open clicked if was closed
        if (!isOpen) item.classList.add('open');
      });
    });
  };

  return { init };
})();

// ============================================
// TABS
// ============================================
const TabsManager = (() => {
  const init = () => {
    document.querySelectorAll('.tabs').forEach(tabGroup => {
      const buttons = tabGroup.querySelectorAll('.tab-btn');
      const targetGroup = tabGroup.dataset.target;
      const contents = document.querySelectorAll(`[data-tab-group="${targetGroup}"] .tab-content`);

      buttons.forEach(btn => {
        btn.addEventListener('click', () => {
          const tabId = btn.dataset.tab;

          buttons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          contents.forEach(content => {
            content.classList.toggle('active', content.dataset.tabId === tabId);
          });
        });
      });
    });
  };

  return { init };
})();

// ============================================
// FORM VALIDATION
// ============================================
const FormValidator = (() => {
  const rules = {
    required: (val) => val.trim() !== '' || 'This field is required',
    email: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || 'Enter a valid email address',
    minLength: (min) => (val) => val.length >= min || `Minimum ${min} characters required`,
    phone: (val) => !val || /^[\+]?[\d\s\-\(\)]{7,}$/.test(val) || 'Enter a valid phone number',
  };

  const validateField = (input) => {
    const fieldRules = input.dataset.validate?.split(',') || [];
    const errorEl = input.closest('.form-group')?.querySelector('.form-error');
    let valid = true;
    let errorMsg = '';

    for (const rule of fieldRules) {
      const [ruleName, ruleArg] = rule.trim().split(':');
      const validator = ruleArg ? rules[ruleName]?.(ruleArg) : rules[ruleName];
      if (!validator) continue;
      const result = validator(input.value);
      if (result !== true) {
        valid = false;
        errorMsg = result;
        break;
      }
    }

    input.classList.toggle('error', !valid);
    if (errorEl) {
      errorEl.textContent = errorMsg;
      errorEl.classList.toggle('show', !valid);
    }

    return valid;
  };

  const init = () => {
    document.querySelectorAll('[data-validate]').forEach(input => {
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => {
        if (input.classList.contains('error')) validateField(input);
      });
    });

    document.querySelectorAll('form[data-validate-form]').forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const inputs = form.querySelectorAll('[data-validate]');
        let allValid = true;

        inputs.forEach(input => {
          if (!validateField(input)) allValid = false;
        });

        if (allValid) {
          const btn = form.querySelector('[type="submit"]');
          if (btn) {
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            btn.disabled = true;

            setTimeout(() => {
              btn.innerHTML = '<i class="fas fa-check"></i> Sent!';
              btn.classList.add('btn--primary');
              setTimeout(() => {
                btn.innerHTML = originalText;
                btn.disabled = false;
                form.reset();
              }, 3000);
            }, 1500);
          }
        }
      });
    });
  };

  return { init };
})();

// ============================================
// TYPING ANIMATION
// ============================================
const TypingAnimation = (() => {
  const texts = [
    'Schema Stitching Expert',
    'N+1 Problem Solver',
    'Federation Architect',
    'GraphQL Performance Guru',
    'API-First Designer'
  ];

  const init = () => {
    const el = document.querySelector('[data-typing]');
    if (!el) return;

    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 80;

    const type = () => {
      const current = texts[textIndex];

      if (!isDeleting) {
        el.textContent = current.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 80;
      } else {
        el.textContent = current.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 40;
      }

      if (!isDeleting && charIndex === current.length) {
        typingSpeed = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        typingSpeed = 400;
      }

      setTimeout(type, typingSpeed);
    };

    type();
  };

  return { init };
})();

// ============================================
// SMOOTH SCROLLING
// ============================================
const SmoothScroll = (() => {
  const init = () => {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (!href || href === '#') return;

        try {
          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            const headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 72;
            const top = target.getBoundingClientRect().top + window.scrollY - headerH - 16;
            window.scrollTo({ top, behavior: 'smooth' });
          }
        } catch (err) {
          // Ignore invalid selectors like href="#"
        }
      });
    });
  };

  return { init };
})();

// ============================================
// INIT ALL
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
  RTLManager.init();
  HeaderManager.init();
  ScrollProgress.init();
  RevealOnScroll.init();
  CounterAnimation.init();
  FAQAccordion.init();
  TabsManager.init();
  FormValidator.init();
  TypingAnimation.init();
  SmoothScroll.init();
});
