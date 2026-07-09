(function () {
  var navbar = document.getElementById('navbar');
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');

  function onScroll() {
    if (window.scrollY > 12) {
      navbar.classList.add('is-scrolled');
    } else {
      navbar.classList.remove('is-scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      navLinks.classList.toggle('is-open');
    });
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('is-open');
      });
    });
  }

  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  var dashboard = document.querySelector('.dashboard-window');
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (dashboard && window.matchMedia('(hover: hover)').matches && !prefersReducedMotion) {
    var rafId = null;
    dashboard.addEventListener('mousemove', function (e) {
      if (rafId) return;
      rafId = requestAnimationFrame(function () {
        var rect = dashboard.getBoundingClientRect();
        var px = (e.clientX - rect.left) / rect.width - 0.5;
        var py = (e.clientY - rect.top) / rect.height - 0.5;
        dashboard.style.transform =
          'perspective(1400px) rotateX(' + (py * -6) + 'deg) rotateY(' + (px * 8) + 'deg)';
        rafId = null;
      });
    });
    dashboard.addEventListener('mouseleave', function () {
      dashboard.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      dashboard.style.transform = '';
      setTimeout(function () { dashboard.style.transition = ''; }, 600);
    });
  }
})();
