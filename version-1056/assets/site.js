(function () {
  var menuButton = document.querySelector('.menu-toggle');
  var mobileNav = document.querySelector('.mobile-nav');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
  var active = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }
    active = (index + slides.length) % slides.length;
    slides.forEach(function (slide, i) {
      slide.classList.toggle('is-active', i === active);
    });
    dots.forEach(function (dot, i) {
      dot.classList.toggle('is-active', i === active);
    });
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener('click', function () {
      showSlide(index);
    });
  });

  if (slides.length > 1) {
    setInterval(function () {
      showSlide(active + 1);
    }, 5200);
  }

  var filterForm = document.querySelector('[data-filter-form]');
  var filterList = document.querySelector('[data-filter-list]');

  if (filterForm && filterList) {
    var input = filterForm.querySelector('input');
    var cards = Array.prototype.slice.call(filterList.querySelectorAll('.movie-card'));
    input.addEventListener('input', function () {
      var keyword = input.value.trim().toLowerCase();
      cards.forEach(function (card) {
        var text = card.innerText.toLowerCase();
        card.style.display = text.indexOf(keyword) === -1 ? 'none' : '';
      });
    });
    filterForm.addEventListener('submit', function (event) {
      event.preventDefault();
    });
  }

  var searchForm = document.getElementById('search-page-form');
  var searchInput = document.getElementById('search-input');
  var searchResults = document.getElementById('search-results');
  var searchStatus = document.getElementById('search-status');

  function makeSearchCard(item) {
    return [
      '<article class="movie-card">',
      '<a class="poster-link" href="' + item.url + '" aria-label="' + escapeHtml(item.title) + '">',
      '<img src="' + item.cover + '" alt="' + escapeHtml(item.title) + '" loading="lazy">',
      '<span class="card-badge">' + item.year + '</span>',
      '</a>',
      '<div class="movie-card-body">',
      '<a class="movie-title" href="' + item.url + '">' + escapeHtml(item.title) + '</a>',
      '<p class="movie-meta">' + escapeHtml(item.region + ' · ' + item.type + ' · ' + item.genre) + '</p>',
      '<p class="movie-desc">' + escapeHtml(item.oneLine) + '</p>',
      '<div class="tag-row">' + item.tags.slice(0, 4).map(function (tag) { return '<span>' + escapeHtml(tag) + '</span>'; }).join('') + '</div>',
      '</div>',
      '</article>'
    ].join('');
  }

  function escapeHtml(text) {
    return String(text).replace(/[&<>"]/g, function (char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;'
      }[char];
    });
  }

  function runSearch(keyword) {
    if (!searchResults || !Array.isArray(window.SEARCH_DATA)) {
      return;
    }
    var query = String(keyword || '').trim().toLowerCase();
    if (!query) {
      searchStatus.textContent = '热门推荐';
      return;
    }
    var words = query.split(/\s+/).filter(Boolean);
    var matches = window.SEARCH_DATA.filter(function (item) {
      var text = item.text.toLowerCase();
      return words.every(function (word) {
        return text.indexOf(word) !== -1;
      });
    }).slice(0, 120);
    searchStatus.textContent = matches.length ? '搜索结果' : '暂无匹配内容';
    searchResults.innerHTML = matches.map(makeSearchCard).join('');
  }

  if (searchForm && searchInput && searchResults) {
    var params = new URLSearchParams(window.location.search);
    var initial = params.get('q') || '';
    if (initial) {
      searchInput.value = initial;
      runSearch(initial);
    }
    searchForm.addEventListener('submit', function (event) {
      event.preventDefault();
      runSearch(searchInput.value);
    });
  }
})();
