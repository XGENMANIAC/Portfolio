/**
 * Nicodemus "Nicxon" Muema — Portfolio Scripts (2026 Editorial Edition)
 * Core Features:
 * 1. Kinetic Telemetry Preloader & Curtain Orchestration
 * 2. Live Nairobi (EAT) Clock
 * 3. Interactive Project Architecture Drawers
 * 4. Theme Switcher (Paper / Obsidian)
 * 5. One-Click Email Copy with State Feedback
 * 6. Quick Compose Mailto Link
 */

(function () {
  'use strict';

  // DOM Elements
  const loader = document.getElementById('loader');
  const counterEl = document.getElementById('loader-counter-val');
  const progressBar = document.getElementById('loader-progress-fill');
  const logEl = document.getElementById('loader-log-text');
  const liveClockEl = document.getElementById('live-clock');
  const themeToggleBtn = document.getElementById('theme-toggle');
  const emailCopyBtn = document.getElementById('email-copy-btn');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navEl = document.querySelector('header nav');
  const replayBtn = document.getElementById('replay-loader');
  const contactForm = document.getElementById('quick-contact-form');

  // Check Reduced Motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --------------------------------------------------------------------------
     1. PRELOADER & LOADING MOTION ORCHESTRATION
     -------------------------------------------------------------------------- */
  const telemetryLogs = [
    { at: 10, text: 'CALIBRATING SYSTEM TELEMETRY' },
    { at: 28, text: 'RESOLVING ANATOMY // MBCHB + SYSTEMS' },
    { at: 48, text: 'INGESTING ARCHITECTURE: NEXT.JS · TAURI · PYTHON' },
    { at: 72, text: 'ENVIRONMENT VERIFIED: LINUX · TERMUX · CLOUD' },
    { at: 92, text: 'CALIBRATING DISPLAY MATRICES' },
    { at: 100, text: 'SYSTEM CALIBRATED // OPENING INTERFACE' }
  ];

  function runLoaderSequence(isExpedited = false) {
    if (prefersReducedMotion) {
      document.body.classList.add('loaded');
      if (loader) {
        loader.setAttribute('aria-hidden', 'true');
        loader.style.display = 'none';
      }
      return;
    }

    if (!loader || !counterEl || !progressBar) {
      document.body.classList.add('loaded');
      return;
    }

    // Reset loader UI
    loader.style.display = 'flex';
    document.body.classList.remove('loaded');
    loader.removeAttribute('aria-hidden');
    counterEl.textContent = '00';
    progressBar.style.width = '0%';

    let currentVal = 0;
    const targetVal = 100;
    const duration = isExpedited ? 380 : 1300; // ms
    const startTime = performance.now();

    function step(timestamp) {
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Custom easing curve for natural deceleration
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      currentVal = Math.floor(easedProgress * targetVal);

      // Format with leading zero
      counterEl.textContent = currentVal < 10 ? '0' + currentVal : String(currentVal);
      progressBar.style.width = currentVal + '%';

      // Update telemetry log
      if (logEl) {
        for (let i = telemetryLogs.length - 1; i >= 0; i--) {
          if (currentVal >= telemetryLogs[i].at) {
            logEl.innerHTML = `<strong>&gt;</strong> ${telemetryLogs[i].text}`;
            break;
          }
        }
      }

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        counterEl.textContent = '100';
        progressBar.style.width = '100%';
        if (logEl) logEl.innerHTML = `<strong>&gt;</strong> SYSTEM CALIBRATED // OPENING INTERFACE`;

        // Eye-comfort pause before curtain split
        setTimeout(() => {
          document.body.classList.add('loaded');
          loader.setAttribute('aria-hidden', 'true');
          sessionStorage.setItem('nm_portfolio_seen', 'true');

          setTimeout(() => {
            if (document.body.classList.contains('loaded')) {
              loader.style.display = 'none';
            }
          }, 850);
        }, isExpedited ? 80 : 200);
      }
    }

    requestAnimationFrame(step);
  }

  // Determine whether to run full or expedited loader
  const hasVisited = sessionStorage.getItem('nm_portfolio_seen');
  if (hasVisited) {
    // Expedited 380ms polite lift on repeat navigation in the same session
    runLoaderSequence(true);
  } else {
    // Cinematic 1.3s first impression
    runLoaderSequence(false);
  }

  // Replay loader on demand
  if (replayBtn) {
    replayBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => {
        runLoaderSequence(false);
      }, 250);
    });
  }

  /* --------------------------------------------------------------------------
     2. REAL-TIME NAIROBI LOCAL CLOCK
     -------------------------------------------------------------------------- */
  function updateNairobiClock() {
    if (!liveClockEl) return;
    try {
      const options = {
        timeZone: 'Africa/Nairobi',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      };
      const formatter = new Intl.DateTimeFormat([], options);
      const parts = formatter.format(new Date());
      liveClockEl.textContent = `${parts} EAT`;
    } catch (e) {
      const now = new Date();
      liveClockEl.textContent = now.toTimeString().slice(0, 8) + ' EAT';
    }
  }
  updateNairobiClock();
  setInterval(updateNairobiClock, 1000);

  /* --------------------------------------------------------------------------
     3. INTERACTIVE PROJECT DRAWERS
     -------------------------------------------------------------------------- */
  const projectItems = document.querySelectorAll('.project-item');
  projectItems.forEach((item) => {
    const btn = item.querySelector('.project-row-btn');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close other open project drawers for clean accordion feel
      projectItems.forEach((other) => {
        if (other !== item) {
          other.classList.remove('active');
          const otherBtn = other.querySelector('.project-row-btn');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current
      item.classList.toggle('active', !isActive);
      btn.setAttribute('aria-expanded', String(!isActive));
    });
  });

  /* --------------------------------------------------------------------------
     4. THEME CONTROLLER (PAPER / OBSIDIAN)
     -------------------------------------------------------------------------- */
  function getPreferredTheme() {
    const stored = localStorage.getItem('nm_theme');
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    const metaTheme = document.getElementById('meta-theme-color');
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      if (metaTheme) metaTheme.setAttribute('content', '#0f1211');
      if (themeToggleBtn) {
        themeToggleBtn.setAttribute('aria-label', 'Switch to daylight paper theme');
        themeToggleBtn.querySelector('.theme-label').textContent = 'Paper';
      }
    } else {
      document.documentElement.removeAttribute('data-theme');
      if (metaTheme) metaTheme.setAttribute('content', '#f4f1ea');
      if (themeToggleBtn) {
        themeToggleBtn.setAttribute('aria-label', 'Switch to archive obsidian theme');
        themeToggleBtn.querySelector('.theme-label').textContent = 'Obsidian';
      }
    }
    localStorage.setItem('nm_theme', theme);
  }

  // Initial theme setup
  applyTheme(getPreferredTheme());

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  /* --------------------------------------------------------------------------
     5. ONE-CLICK EMAIL COPY WITH FEEDBACK
     -------------------------------------------------------------------------- */
  if (emailCopyBtn) {
    emailCopyBtn.addEventListener('click', async () => {
      const email = 'nicodemusmuema84@gmail.com';
      try {
        await navigator.clipboard.writeText(email);
        const originalText = emailCopyBtn.textContent;
        emailCopyBtn.textContent = 'Copied! ✓';
        emailCopyBtn.style.borderColor = 'var(--rust)';
        emailCopyBtn.style.color = 'var(--rust)';

        setTimeout(() => {
          emailCopyBtn.textContent = originalText;
          emailCopyBtn.style.borderColor = '';
          emailCopyBtn.style.color = '';
        }, 2200);
      } catch (err) {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = email;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);

        emailCopyBtn.textContent = 'Copied! ✓';
        setTimeout(() => {
          emailCopyBtn.textContent = 'Copy';
        }, 2200);
      }
    });
  }

  /* --------------------------------------------------------------------------
     6. MOBILE MENU TOGGLE
     -------------------------------------------------------------------------- */
  if (mobileMenuBtn && navEl) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = navEl.classList.toggle('nav-open');
      mobileMenuBtn.setAttribute('aria-expanded', String(isOpen));
    });

    // Close on link click
    navEl.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navEl.classList.remove('nav-open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* --------------------------------------------------------------------------
     7. CONTACT FORM MAILTO GENERATOR
     -------------------------------------------------------------------------- */
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(contactForm);
      const name = formData.get('name') || '';
      const email = formData.get('email') || '';
      const message = formData.get('message') || '';

      const subject = encodeURIComponent(`Inquiry from ${name} via portfolio.nicxon.tech`);
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\nProject / Inquiry Details:\n${message}\n\n---\nSent via portfolio.nicxon.tech`
      );

      window.location.href = `mailto:nicodemusmuema84@gmail.com?subject=${subject}&body=${body}`;
    });
  }

})();
