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
  if (dashboard && window.matchMedia('(hover: hover) and (pointer: fine)').matches && !prefersReducedMotion) {
    // Spring-like smoothing: interpolate toward the target tilt each frame
    // rather than snapping the transform directly to the cursor position.
    // This gives the tilt momentum/settle instead of feeling mechanically 1:1.
    var targetX = 0, targetY = 0, currentX = 0, currentY = 0;
    var loopId = null;
    var STIFFNESS = 0.12;
    var SETTLE_EPSILON = 0.01;

    function tick() {
      currentX += (targetX - currentX) * STIFFNESS;
      currentY += (targetY - currentY) * STIFFNESS;
      dashboard.style.transform =
        'perspective(1400px) rotateX(' + currentY + 'deg) rotateY(' + currentX + 'deg)';

      var settled =
        Math.abs(targetX - currentX) < SETTLE_EPSILON &&
        Math.abs(targetY - currentY) < SETTLE_EPSILON &&
        targetX === 0 && targetY === 0;

      if (!settled) {
        loopId = requestAnimationFrame(tick);
      } else {
        dashboard.style.transform = '';
        loopId = null;
      }
    }

    dashboard.addEventListener('mousemove', function (e) {
      var rect = dashboard.getBoundingClientRect();
      var px = (e.clientX - rect.left) / rect.width - 0.5;
      var py = (e.clientY - rect.top) / rect.height - 0.5;
      targetX = px * 8;
      targetY = py * -6;
      if (!loopId) loopId = requestAnimationFrame(tick);
    });
    dashboard.addEventListener('mouseleave', function () {
      targetX = 0;
      targetY = 0;
      if (!loopId) loopId = requestAnimationFrame(tick);
    });
  }
})();
