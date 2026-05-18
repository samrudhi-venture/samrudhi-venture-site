(function () {
  // Mobile nav toggle
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      const isOpen = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A' && links.classList.contains('open')) {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Scroll-reveal animations
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
  }

  // Careers application form → AJAX submit to Formspree
  const careersForm = document.getElementById('careers-form');
  if (careersForm) {
    const status = document.getElementById('careers-form-status');
    const submitBtn = careersForm.querySelector('button[type="submit"]');
    const originalBtnHTML = submitBtn ? submitBtn.innerHTML : '';

    careersForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      if (!status) return;
      status.className = 'form-status';
      status.textContent = '';

      const action = careersForm.getAttribute('action') || '';
      if (action.indexOf('YOUR_FORM_ID') !== -1) {
        status.className = 'form-status is-error';
        status.textContent = 'Form not configured yet. Please replace YOUR_FORM_ID in careers.html with a real Formspree form ID.';
        return;
      }

      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Submitting…'; }

      try {
        const res = await fetch(action, {
          method: 'POST',
          body: new FormData(careersForm),
          headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
          status.className = 'form-status is-success';
          status.textContent = 'Thanks! Your application has been received. We will respond within 5 business days.';
          careersForm.reset();
        } else {
          const data = await res.json().catch(() => ({}));
          status.className = 'form-status is-error';
          status.textContent = (data && data.errors && data.errors[0] && data.errors[0].message)
            ? data.errors[0].message
            : 'Something went wrong. Please try again or email contactus.samrudhiventures@gmail.com.';
        }
      } catch (err) {
        status.className = 'form-status is-error';
        status.textContent = 'Network error. Please check your connection and try again.';
      } finally {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = originalBtnHTML; }
      }
    });
  }

  // Animated counters (data-count)
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    const co = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.getAttribute('data-count'));
        const suffix = el.getAttribute('data-suffix') || '';
        const decimals = (el.getAttribute('data-decimals') | 0) || 0;
        const duration = 1400;
        const start = performance.now();
        function tick(now) {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          const val = target * eased;
          el.textContent = val.toFixed(decimals) + suffix;
          if (t < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        co.unobserve(el);
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { co.observe(el); });
  }
})();
