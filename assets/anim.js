(function () {
  var selectors = [
    '.sol-row > div',
    '.sec-head',
    '.cf-step',
    '.test',
    '.num-item',
    '.pillar',
    '.tl-item',
    '.svc',
    '.vs-card',
    '.dc-steps-grid > div',
    '.dc-two-col > div',
    '.faq-item',
    '.socio',
    '.sol-row .viz'
  ];

  function init() {
    var els = document.querySelectorAll(selectors.join(','));

    els.forEach(function (el) {
      if (!el.classList.contains('anim-ready')) {
        el.classList.add('anim-ready');
      }
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('anim-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    /* stagger siblings inside the same parent */
    var parents = new Set();
    els.forEach(function (el) { parents.add(el.parentElement); });

    parents.forEach(function (parent) {
      var children = parent.querySelectorAll(selectors.join(','));
      children.forEach(function (child, i) {
        child.style.transitionDelay = (i * 0.1) + 's';
      });
    });

    els.forEach(function (el) { observer.observe(el); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
