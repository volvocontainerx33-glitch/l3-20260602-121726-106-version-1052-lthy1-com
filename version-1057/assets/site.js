(function () {
  function selectAll(selector, root) {
    return Array.prototype.slice.call(
      (root || document).querySelectorAll(selector),
    );
  }

  var toggle = document.querySelector("[data-menu-toggle]");
  var mobileNav = document.querySelector("[data-mobile-nav]");
  if (toggle && mobileNav) {
    toggle.addEventListener("click", function () {
      mobileNav.classList.toggle("is-open");
    });
  }

  var slides = selectAll(".hero-slide");
  var dots = selectAll(".hero-dot");
  if (slides.length) {
    var index = 0;
    var show = function (nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === index);
      });
    };
    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener("click", function () {
        show(dotIndex);
      });
    });
    show(0);
    window.setInterval(function () {
      show(index + 1);
    }, 5200);
  }

  function textOf(card) {
    return [
      card.getAttribute("data-title"),
      card.getAttribute("data-region"),
      card.getAttribute("data-year"),
      card.getAttribute("data-type"),
      card.getAttribute("data-tags"),
    ]
      .join(" ")
      .toLowerCase();
  }

  var cards = selectAll("[data-movie-card]");
  var searchInput = document.querySelector("[data-search-input]");
  var clearButton = document.querySelector("[data-clear-search]");
  var filterButtons = selectAll("[data-filter-button]");
  var activeCategory = "all";

  function applyFilters() {
    if (!cards.length) {
      return;
    }
    var query = searchInput ? searchInput.value.trim().toLowerCase() : "";
    var visibleCount = 0;
    cards.forEach(function (card) {
      var matchesQuery = !query || textOf(card).indexOf(query) > -1;
      var matchesCategory =
        activeCategory === "all" ||
        card.getAttribute("data-category") === activeCategory;
      var visible = matchesQuery && matchesCategory;
      card.hidden = !visible;
      if (visible) {
        visibleCount += 1;
      }
    });
    document.body.classList.toggle("has-no-results", visibleCount === 0);
  }

  if (searchInput) {
    searchInput.addEventListener("input", applyFilters);
  }
  if (clearButton && searchInput) {
    clearButton.addEventListener("click", function () {
      searchInput.value = "";
      applyFilters();
      searchInput.focus();
    });
  }
  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      activeCategory = button.getAttribute("data-filter-button") || "all";
      filterButtons.forEach(function (item) {
        item.classList.toggle("active", item === button);
      });
      applyFilters();
    });
  });
})();
