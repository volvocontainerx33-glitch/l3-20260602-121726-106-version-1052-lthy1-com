(function () {
    function ready(fn) {
        if (document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }

    function initMenu() {
        var toggle = document.querySelector("[data-menu-toggle]");
        var menu = document.querySelector("[data-mobile-menu]");
        if (!toggle || !menu) {
            return;
        }
        toggle.addEventListener("click", function () {
            menu.classList.toggle("is-open");
        });
    }

    function initHero() {
        var root = document.querySelector("[data-hero]");
        if (!root) {
            return;
        }
        var slides = Array.prototype.slice.call(root.querySelectorAll("[data-hero-slide]"));
        var thumbs = Array.prototype.slice.call(root.querySelectorAll("[data-hero-thumb]"));
        var index = 0;
        var timer = null;

        function show(next) {
            index = (next + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle("is-active", i === index);
            });
            thumbs.forEach(function (thumb, i) {
                thumb.classList.toggle("is-active", i === index);
            });
        }

        function start() {
            window.clearInterval(timer);
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5200);
        }

        thumbs.forEach(function (thumb) {
            thumb.addEventListener("click", function () {
                show(Number(thumb.getAttribute("data-hero-thumb")) || 0);
                start();
            });
        });

        if (slides.length > 1) {
            start();
        }
    }

    function normalize(value) {
        return String(value || "").trim().toLowerCase();
    }

    function initFilters() {
        var panel = document.querySelector("[data-filter-panel]");
        var list = document.querySelector("[data-card-list]");
        if (!panel || !list) {
            return;
        }
        var state = { year: "", type: "", genre: "", q: "" };
        var cards = Array.prototype.slice.call(list.querySelectorAll(".movie-card"));
        var search = panel.querySelector("[data-page-search]");
        var reset = panel.querySelector("[data-filter-reset]");

        function setActive(attr, value) {
            panel.querySelectorAll("[" + attr + "]").forEach(function (button) {
                button.classList.toggle("is-active", button.getAttribute(attr) === value);
            });
        }

        function apply() {
            var visible = 0;
            cards.forEach(function (card) {
                var title = normalize(card.getAttribute("data-title"));
                var year = normalize(card.getAttribute("data-year"));
                var type = normalize(card.getAttribute("data-type"));
                var genre = normalize(card.getAttribute("data-genre"));
                var region = normalize(card.getAttribute("data-region"));
                var all = title + " " + year + " " + type + " " + genre + " " + region;
                var ok = true;
                if (state.year && year !== normalize(state.year)) ok = false;
                if (state.type && type !== normalize(state.type)) ok = false;
                if (state.genre && genre.indexOf(normalize(state.genre)) === -1) ok = false;
                if (state.q && all.indexOf(normalize(state.q)) === -1) ok = false;
                card.classList.toggle("is-hidden-card", !ok);
                if (ok) visible += 1;
            });
            var empty = list.querySelector(".empty-results");
            if (!visible) {
                if (!empty) {
                    empty = document.createElement("div");
                    empty.className = "empty-results";
                    empty.textContent = "没有找到匹配影片";
                    list.appendChild(empty);
                }
            } else if (empty) {
                empty.remove();
            }
        }

        panel.querySelectorAll("[data-filter-year]").forEach(function (button) {
            button.addEventListener("click", function () {
                state.year = button.getAttribute("data-filter-year") || "";
                setActive("data-filter-year", state.year);
                apply();
            });
        });
        panel.querySelectorAll("[data-filter-type]").forEach(function (button) {
            button.addEventListener("click", function () {
                state.type = button.getAttribute("data-filter-type") || "";
                setActive("data-filter-type", state.type);
                apply();
            });
        });
        panel.querySelectorAll("[data-filter-genre]").forEach(function (button) {
            button.addEventListener("click", function () {
                state.genre = button.getAttribute("data-filter-genre") || "";
                setActive("data-filter-genre", state.genre);
                apply();
            });
        });
        if (search) {
            search.addEventListener("input", function () {
                state.q = search.value;
                apply();
            });
        }
        if (reset) {
            reset.addEventListener("click", function () {
                state = { year: "", type: "", genre: "", q: "" };
                if (search) search.value = "";
                setActive("data-filter-year", "");
                setActive("data-filter-type", "");
                setActive("data-filter-genre", "");
                apply();
            });
        }
    }

    function movieCard(movie) {
        return [
            '<article class="movie-card">',
            '<a class="poster-wrap" href="' + movie.url + '" aria-label="' + movie.title + '">',
            '<img src="' + movie.cover + '" alt="' + movie.title + '" loading="lazy">',
            '<span class="type-badge">' + movie.genre + '</span>',
            '<span class="duration-badge">高清</span>',
            '<span class="hover-play">▶</span>',
            '</a>',
            '<div class="movie-card-body">',
            '<h3><a href="' + movie.url + '">' + movie.title + '</a></h3>',
            '<p>' + movie.desc + '</p>',
            '<div class="movie-meta"><span>' + movie.year + '</span><span>' + movie.region + '</span><span>' + movie.type + '</span></div>',
            '</div>',
            '</article>'
        ].join("");
    }

    function initSearchPage() {
        var form = document.querySelector("[data-search-form]");
        var input = document.querySelector("[data-search-input]");
        var results = document.querySelector("[data-search-results]");
        var summary = document.querySelector("[data-search-summary]");
        if (!form || !input || !results || !window.SEARCH_MOVIES) {
            return;
        }
        var params = new URLSearchParams(window.location.search);
        var q = params.get("q") || "";
        input.value = q;

        function render(query) {
            var key = normalize(query);
            if (!key) {
                results.innerHTML = "";
                summary.textContent = "请输入关键词开始搜索。";
                return;
            }
            var matched = window.SEARCH_MOVIES.filter(function (movie) {
                var hay = normalize(movie.title + " " + movie.year + " " + movie.region + " " + movie.type + " " + movie.genre + " " + movie.tags + " " + movie.desc);
                return hay.indexOf(key) !== -1;
            }).slice(0, 96);
            summary.textContent = matched.length ? "为你找到相关影片" : "没有找到匹配影片";
            results.innerHTML = matched.length ? matched.map(movieCard).join("") : '<div class="empty-results">没有找到匹配影片</div>';
        }

        form.addEventListener("submit", function (event) {
            event.preventDefault();
            var value = input.value.trim();
            var next = value ? "search.html?q=" + encodeURIComponent(value) : "search.html";
            window.history.replaceState({}, "", next);
            render(value);
        });
        input.addEventListener("input", function () {
            render(input.value);
        });
        render(q);
    }

    function initPlayers() {
        document.querySelectorAll("[data-player]").forEach(function (box) {
            var video = box.querySelector("video");
            var button = box.querySelector("[data-play-button]");
            var stream = box.getAttribute("data-stream");
            var started = false;
            var hls = null;
            if (!video || !button || !stream) {
                return;
            }

            function attach() {
                if (started) {
                    return;
                }
                started = true;
                button.classList.add("is-hidden");
                if (video.canPlayType("application/vnd.apple.mpegurl")) {
                    video.src = stream;
                } else if (window.Hls && window.Hls.isSupported()) {
                    hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
                    hls.loadSource(stream);
                    hls.attachMedia(video);
                } else {
                    video.src = stream;
                }
                var playPromise = video.play();
                if (playPromise && playPromise.catch) {
                    playPromise.catch(function () {
                        button.classList.remove("is-hidden");
                        started = false;
                    });
                }
            }

            button.addEventListener("click", attach);
            box.addEventListener("click", function (event) {
                if (event.target === video && !started) {
                    attach();
                }
            });
            video.addEventListener("play", function () {
                button.classList.add("is-hidden");
            });
            video.addEventListener("ended", function () {
                if (hls) {
                    hls.destroy();
                    hls = null;
                }
                started = false;
                button.classList.remove("is-hidden");
            });
        });
    }

    ready(function () {
        initMenu();
        initHero();
        initFilters();
        initSearchPage();
        initPlayers();
    });
})();
