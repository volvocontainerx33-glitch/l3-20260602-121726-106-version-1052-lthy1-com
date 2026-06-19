(function () {
  var toggle = document.querySelector('[data-menu-toggle]');
  var panel = document.querySelector('[data-menu-panel]');
  if (toggle && panel) {
    toggle.addEventListener('click', function () {
      panel.classList.toggle('open');
    });
  }

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var thumbs = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-thumb]'));
    var current = 0;
    var timer = null;

    function activate(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === current);
      });
      thumbs.forEach(function (thumb, i) {
        thumb.classList.toggle('active', i === current);
      });
    }

    function start() {
      timer = window.setInterval(function () {
        activate(current + 1);
      }, 5200);
    }

    function restart() {
      if (timer) {
        window.clearInterval(timer);
      }
      start();
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        activate(Number(dot.getAttribute('data-hero-dot')) || 0);
        restart();
      });
    });

    thumbs.forEach(function (thumb) {
      thumb.addEventListener('mouseenter', function () {
        activate(Number(thumb.getAttribute('data-hero-thumb')) || 0);
        restart();
      });
    });

    activate(0);
    start();
  }

  var searchRoot = document.querySelector('[data-search-root]');
  if (searchRoot) {
    var input = searchRoot.querySelector('[data-search-input]');
    var yearSelect = searchRoot.querySelector('[data-filter-year]');
    var regionSelect = searchRoot.querySelector('[data-filter-region]');
    var categorySelect = searchRoot.querySelector('[data-filter-category]');
    var cards = Array.prototype.slice.call(searchRoot.querySelectorAll('[data-search-card]'));
    var count = searchRoot.querySelector('[data-result-count]');
    var empty = searchRoot.querySelector('[data-empty-tip]');

    function norm(value) {
      return String(value || '').toLowerCase().trim();
    }

    function applyFilter() {
      var keyword = norm(input && input.value);
      var year = yearSelect ? yearSelect.value : '';
      var region = regionSelect ? regionSelect.value : '';
      var category = categorySelect ? categorySelect.value : '';
      var visible = 0;

      cards.forEach(function (card) {
        var text = norm(card.getAttribute('data-text'));
        var cardYear = card.getAttribute('data-year') || '';
        var cardRegion = card.getAttribute('data-region') || '';
        var cardCategory = card.getAttribute('data-category') || '';
        var ok = true;

        if (keyword && text.indexOf(keyword) === -1) {
          ok = false;
        }
        if (year && cardYear !== year) {
          ok = false;
        }
        if (region && cardRegion !== region) {
          ok = false;
        }
        if (category && cardCategory !== category) {
          ok = false;
        }

        card.style.display = ok ? '' : 'none';
        if (ok) {
          visible += 1;
        }
      });

      if (count) {
        count.textContent = String(visible);
      }
      if (empty) {
        empty.style.display = visible ? 'none' : 'block';
      }
    }

    [input, yearSelect, regionSelect, categorySelect].forEach(function (el) {
      if (el) {
        el.addEventListener('input', applyFilter);
        el.addEventListener('change', applyFilter);
      }
    });

    applyFilter();
  }
}());
