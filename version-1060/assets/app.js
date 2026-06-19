(function () {
  function selectAll(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function setMenu() {
    var button = document.querySelector('[data-menu-button]');
    var nav = document.querySelector('[data-site-nav]');
    if (!button || !nav) {
      return;
    }
    button.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
  }

  function setHero() {
    var hero = document.querySelector('[data-hero]');
    if (!hero) {
      return;
    }
    var slides = selectAll('[data-hero-slide]', hero);
    var dots = selectAll('[data-hero-dot]', hero);
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var index = 0;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, itemIndex) {
        slide.classList.toggle('active', itemIndex === index);
      });
      dots.forEach(function (dot, itemIndex) {
        dot.classList.toggle('active', itemIndex === index);
      });
    }

    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
      });
    }
    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
      });
    }
    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot')) || 0);
      });
    });
    window.setInterval(function () {
      show(index + 1);
    }, 6500);
  }

  function fillFilterOptions() {
    selectAll('[data-filter-panel]').forEach(function (panel) {
      var root = panel.parentElement || document;
      var cards = selectAll('.movie-card', root);
      var yearSelect = panel.querySelector('[data-year-filter]');
      var typeSelect = panel.querySelector('[data-type-filter]');
      if (yearSelect && yearSelect.options.length <= 1) {
        var years = cards.map(function (card) {
          return card.getAttribute('data-year');
        }).filter(Boolean).filter(function (value, index, arr) {
          return arr.indexOf(value) === index;
        }).sort(function (a, b) {
          return Number(b) - Number(a);
        });
        years.forEach(function (year) {
          var option = document.createElement('option');
          option.value = year;
          option.textContent = year;
          yearSelect.appendChild(option);
        });
      }
      if (typeSelect && typeSelect.options.length <= 1) {
        var types = cards.map(function (card) {
          return card.getAttribute('data-type');
        }).filter(Boolean).filter(function (value, index, arr) {
          return arr.indexOf(value) === index;
        }).sort();
        types.forEach(function (type) {
          var option = document.createElement('option');
          option.value = type;
          option.textContent = type;
          typeSelect.appendChild(option);
        });
      }
    });
  }

  function setFilters() {
    selectAll('[data-filter-panel]').forEach(function (panel) {
      var root = panel.parentElement || document;
      var input = panel.querySelector('[data-filter-input]');
      var yearSelect = panel.querySelector('[data-year-filter]');
      var typeSelect = panel.querySelector('[data-type-filter]');
      var cards = selectAll('.movie-card', root);

      function apply() {
        var q = input ? input.value.trim().toLowerCase() : '';
        var year = yearSelect ? yearSelect.value : '';
        var type = typeSelect ? typeSelect.value : '';
        cards.forEach(function (card) {
          var text = card.textContent.toLowerCase();
          var matchedText = !q || text.indexOf(q) !== -1;
          var matchedYear = !year || card.getAttribute('data-year') === year;
          var matchedType = !type || card.getAttribute('data-type') === type;
          card.classList.toggle('is-hidden', !(matchedText && matchedYear && matchedType));
        });
      }

      if (input) {
        input.addEventListener('input', apply);
      }
      if (yearSelect) {
        yearSelect.addEventListener('change', apply);
      }
      if (typeSelect) {
        typeSelect.addEventListener('change', apply);
      }
      var query = new URLSearchParams(window.location.search).get('q');
      if (query && input && input.id === 'q') {
        input.value = query;
      }
      apply();
    });
  }

  window.initMoviePlayer = function (videoId, buttonId, sourceUrl) {
    var video = document.getElementById(videoId);
    var button = document.getElementById(buttonId);
    if (!video || !button || !sourceUrl) {
      return;
    }

    function start() {
      button.classList.add('hidden');
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        if (!video.src) {
          video.src = sourceUrl;
        }
        video.play();
        return;
      }
      if (window.Hls && window.Hls.isSupported()) {
        if (!video._hlsReady) {
          var hls = new window.Hls();
          hls.loadSource(sourceUrl);
          hls.attachMedia(video);
          video._hlsReady = true;
        }
        video.play();
        return;
      }
      video.src = sourceUrl;
      video.play();
    }

    button.addEventListener('click', start);
    video.addEventListener('click', function () {
      if (video.paused) {
        start();
      }
    });
  };

  document.addEventListener('DOMContentLoaded', function () {
    setMenu();
    setHero();
    fillFilterOptions();
    setFilters();
  });
})();
