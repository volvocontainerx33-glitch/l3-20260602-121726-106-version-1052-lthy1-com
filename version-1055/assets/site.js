
(function () {
  var navToggle = document.querySelector('[data-nav-toggle]');

  if (navToggle) {
    navToggle.addEventListener('click', function () {
      document.body.classList.toggle('nav-open');
    });
  }

  var images = document.querySelectorAll('img');
  images.forEach(function (image) {
    image.addEventListener('error', function () {
      var wrap = image.closest('.poster-wrap');
      if (wrap) {
        wrap.classList.add('missing-image');
      }
      image.remove();
    });
  });

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var current = 0;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === current);
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        showSlide(index);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }
  }

  var toolbars = document.querySelectorAll('[data-listing-toolbar]');
  toolbars.forEach(function (toolbar) {
    var section = toolbar.parentElement;
    var input = toolbar.querySelector('[data-filter-input]');
    var year = toolbar.querySelector('[data-filter-year]');
    var type = toolbar.querySelector('[data-filter-type]');
    var count = toolbar.querySelector('[data-result-count]');
    var cards = Array.prototype.slice.call(section.querySelectorAll('[data-movie-card]'));
    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get('q') || '';

    if (input && initialQuery) {
      input.value = initialQuery;
    }

    function normalize(value) {
      return String(value || '').trim().toLowerCase();
    }

    function update() {
      var keyword = normalize(input && input.value);
      var yearValue = normalize(year && year.value);
      var typeValue = normalize(type && type.value);
      var visible = 0;

      cards.forEach(function (card) {
        var searchText = normalize(card.getAttribute('data-search'));
        var cardYear = normalize(card.getAttribute('data-year'));
        var cardType = normalize(card.getAttribute('data-type'));
        var matched = true;

        if (keyword && searchText.indexOf(keyword) === -1) {
          matched = false;
        }
        if (yearValue && cardYear !== yearValue) {
          matched = false;
        }
        if (typeValue && cardType !== typeValue) {
          matched = false;
        }

        card.classList.toggle('is-hidden', !matched);
        if (matched) {
          visible += 1;
        }
      });

      if (count) {
        count.textContent = '显示 ' + visible + ' / ' + cards.length;
      }
    }

    ['input', 'change'].forEach(function (eventName) {
      if (input) {
        input.addEventListener(eventName, update);
      }
      if (year) {
        year.addEventListener(eventName, update);
      }
      if (type) {
        type.addEventListener(eventName, update);
      }
    });

    update();
  });
})();
