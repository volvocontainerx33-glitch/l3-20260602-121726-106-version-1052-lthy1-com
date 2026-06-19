(function () {
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');

  if (menuButton && nav) {
    menuButton.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  const slider = document.querySelector('[data-hero-slider]');

  if (slider) {
    const slides = Array.from(slider.querySelectorAll('.hero-slide'));
    const dots = Array.from(slider.querySelectorAll('.hero-dot'));
    let current = 0;

    function showSlide(index) {
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

    window.setInterval(function () {
      showSlide(current + 1);
    }, 5600);
  }

  const filterInput = document.querySelector('[data-filter-input]');
  const filterList = document.querySelector('[data-filter-list]');
  const yearButtons = Array.from(document.querySelectorAll('[data-year-filter]'));
  let activeYear = 'all';

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function applyFilter() {
    if (!filterList) {
      return;
    }

    const cards = Array.from(filterList.querySelectorAll('.movie-card'));
    const keyword = normalize(filterInput ? filterInput.value : '');

    cards.forEach(function (card) {
      const text = normalize([
        card.dataset.title,
        card.dataset.year,
        card.dataset.region,
        card.dataset.category,
        card.dataset.genre
      ].join(' '));
      const yearOk = activeYear === 'all' || card.dataset.year === activeYear;
      const keywordOk = !keyword || text.indexOf(keyword) > -1;
      card.classList.toggle('is-filtered-out', !(yearOk && keywordOk));
    });
  }

  if (filterInput && filterList) {
    filterInput.addEventListener('input', applyFilter);
  }

  yearButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      activeYear = button.dataset.yearFilter || 'all';
      yearButtons.forEach(function (item) {
        item.classList.toggle('active', item === button);
      });
      applyFilter();
    });
  });

  const searchInput = document.getElementById('site-search-input');
  const searchResults = document.getElementById('search-results');
  const searchTitle = document.getElementById('search-result-title');

  function getQuery() {
    return new URLSearchParams(window.location.search).get('q') || '';
  }

  function createSearchCard(movie) {
    const article = document.createElement('article');
    article.className = 'movie-card compact';
    article.innerHTML = [
      '<a class="poster-link" href="' + movie.url + '" aria-label="' + movie.title + '">',
      '<img src="' + movie.cover + '" alt="' + movie.title + '" loading="lazy">',
      '<span class="play-chip">播放</span>',
      '</a>',
      '<div class="card-body">',
      '<h2><a href="' + movie.url + '">' + movie.title + '</a></h2>',
      '<p class="meta-line">' + movie.year + ' · ' + movie.region + ' · ' + movie.type + '</p>',
      '<p class="desc-line">' + movie.description + '</p>',
      '<div class="card-tags"><a href="' + movie.categoryUrl + '">' + movie.category + '</a><span>' + movie.genre + '</span></div>',
      '</div>'
    ].join('');
    return article;
  }

  function runSearch(query) {
    if (!searchResults || !window.SEARCH_MOVIES) {
      return;
    }

    const terms = normalize(query).split(/\s+/).filter(Boolean);
    if (searchInput) {
      searchInput.value = query;
    }

    if (!terms.length) {
      return;
    }

    const matches = window.SEARCH_MOVIES.filter(function (movie) {
      const text = normalize([
        movie.title,
        movie.year,
        movie.region,
        movie.type,
        movie.category,
        movie.genre,
        movie.description
      ].join(' '));
      return terms.every(function (term) {
        return text.indexOf(term) > -1;
      });
    }).slice(0, 120);

    searchResults.innerHTML = '';
    matches.forEach(function (movie) {
      searchResults.appendChild(createSearchCard(movie));
    });

    if (searchTitle) {
      searchTitle.textContent = matches.length ? '搜索结果：' + matches.length + ' 部' : '未找到匹配影片';
    }
  }

  if (searchResults) {
    runSearch(getQuery());
  }
}());
