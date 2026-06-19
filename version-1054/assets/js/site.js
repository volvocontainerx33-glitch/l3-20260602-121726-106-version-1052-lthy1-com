(function () {
  function toggleMenu() {
    var button = document.querySelector('[data-menu-toggle]');
    var nav = document.querySelector('[data-site-nav]');
    if (!button || !nav) {
      return;
    }
    button.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  function initHero() {
    var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
    if (slides.length <= 1) {
      return;
    }
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === index);
      });
    }

    function start() {
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        if (timer) {
          window.clearInterval(timer);
        }
        show(dotIndex);
        start();
      });
    });

    show(0);
    start();
  }

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function initFilters() {
    var scopes = Array.prototype.slice.call(document.querySelectorAll('[data-filter-scope]'));
    scopes.forEach(function (scope) {
      var input = scope.querySelector('[data-filter-input]');
      var year = scope.querySelector('[data-filter-year]');
      var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-title]'));
      var empty = scope.querySelector('[data-empty-state]');

      function apply() {
        var keyword = normalize(input && input.value);
        var yearValue = year ? year.value : '';
        var shown = 0;
        cards.forEach(function (card) {
          var haystack = normalize([
            card.getAttribute('data-title'),
            card.getAttribute('data-tags'),
            card.getAttribute('data-region'),
            card.getAttribute('data-type'),
            card.getAttribute('data-year')
          ].join(' '));
          var yearMatched = !yearValue || card.getAttribute('data-year') === yearValue;
          var keywordMatched = !keyword || haystack.indexOf(keyword) !== -1;
          var visible = yearMatched && keywordMatched;
          card.style.display = visible ? '' : 'none';
          if (visible) {
            shown += 1;
          }
        });
        if (empty) {
          empty.classList.toggle('is-visible', shown === 0);
        }
      }

      if (input) {
        input.addEventListener('input', apply);
      }
      if (year) {
        year.addEventListener('change', apply);
      }
      apply();
    });
  }

  function initSearchPage() {
    var mount = document.querySelector('[data-search-results]');
    if (!mount || !window.SEARCH_MOVIES) {
      return;
    }
    var input = document.querySelector('[data-global-search-input]');
    var params = new URLSearchParams(window.location.search);
    var initial = params.get('q') || '';
    if (input) {
      input.value = initial;
    }

    function movieCard(movie) {
      var tagText = movie.tags.slice(0, 4).join(' ');
      return [
        '<a class="movie-card" href="' + movie.url + '" data-title="' + escapeAttr(movie.title) + '" data-year="' + movie.year + '" data-tags="' + escapeAttr(movie.tags.join(' ')) + '">',
        '  <span class="poster-wrap">',
        '    <img src="./' + movie.cover + '" alt="' + escapeAttr(movie.title) + '" loading="lazy">',
        '    <span class="poster-shade"></span>',
        '    <span class="score-badge">热播</span>',
        '  </span>',
        '  <span class="card-body">',
        '    <strong>' + escapeHtml(movie.title) + '</strong>',
        '    <em>' + movie.year + ' · ' + escapeHtml(movie.region) + '</em>',
        '    <small>' + escapeHtml(movie.oneLine) + '</small>',
        '    <span class="tag-line">' + escapeHtml(tagText) + '</span>',
        '  </span>',
        '</a>'
      ].join('');
    }

    function escapeHtml(value) {
      return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    function escapeAttr(value) {
      return escapeHtml(value).replace(/`/g, '&#96;');
    }

    function render() {
      var keyword = normalize(input && input.value);
      var results = window.SEARCH_MOVIES.filter(function (movie) {
        var haystack = normalize([
          movie.title,
          movie.year,
          movie.region,
          movie.type,
          movie.genre,
          movie.tags.join(' '),
          movie.oneLine
        ].join(' '));
        return !keyword || haystack.indexOf(keyword) !== -1;
      });
      mount.innerHTML = results.slice(0, 240).map(movieCard).join('');
      var empty = document.querySelector('[data-search-empty]');
      if (empty) {
        empty.classList.toggle('is-visible', results.length === 0);
      }
    }

    if (input) {
      input.addEventListener('input', render);
    }
    render();
  }

  function initPlayer() {
    var shell = document.querySelector('[data-video-shell]');
    var video = document.querySelector('[data-video-player]');
    var button = document.querySelector('[data-play-button]');
    if (!shell || !video || !button) {
      return;
    }
    var source = video.getAttribute('data-src');
    var hlsReady = false;

    function attachNative() {
      video.src = source;
      hlsReady = true;
    }

    function attachWithHlsConstructor(HlsConstructor) {
      if (!HlsConstructor || !HlsConstructor.isSupported()) {
        attachNative();
        return;
      }
      var hls = new HlsConstructor({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      hls.loadSource(source);
      hls.attachMedia(video);
      hlsReady = true;
    }

    function prepare() {
      if (hlsReady) {
        return Promise.resolve();
      }
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        attachNative();
        return Promise.resolve();
      }
      if (window.Hls) {
        attachWithHlsConstructor(window.Hls);
        return Promise.resolve();
      }
      return import('../js/hls-vendor.js')
        .then(function (mod) {
          attachWithHlsConstructor(mod.H || mod.default || window.Hls);
        })
        .catch(function () {
          attachNative();
        });
    }

    function play() {
      prepare().then(function () {
        shell.classList.add('is-playing');
        var playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch(function () {
            shell.classList.remove('is-playing');
          });
        }
      });
    }

    button.addEventListener('click', play);
    video.addEventListener('click', function () {
      if (video.paused) {
        play();
      } else {
        video.pause();
      }
    });
    video.addEventListener('play', function () {
      shell.classList.add('is-playing');
    });
    video.addEventListener('pause', function () {
      shell.classList.remove('is-playing');
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    toggleMenu();
    initHero();
    initFilters();
    initSearchPage();
    initPlayer();
  });
})();
