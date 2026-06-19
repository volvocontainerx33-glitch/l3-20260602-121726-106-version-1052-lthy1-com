(function () {
  function init(url) {
    var video = document.querySelector("[data-video-player]");
    var trigger = document.querySelector("[data-play-trigger]");
    if (!video || !url) {
      return;
    }

    var HlsClass = window.HlsModule && window.HlsModule.H;
    var hls = null;
    var loaded = false;

    function reveal() {
      if (trigger) {
        trigger.classList.add("is-hidden");
      }
    }

    function playVideo() {
      var result = video.play();
      if (result && typeof result.catch === "function") {
        result.catch(function () {});
      }
    }

    function start() {
      reveal();
      if (loaded) {
        playVideo();
        return;
      }
      loaded = true;
      if (HlsClass && HlsClass.isSupported()) {
        hls = new HlsClass({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90,
        });
        hls.loadSource(url);
        hls.attachMedia(video);
        hls.on(HlsClass.Events.MANIFEST_PARSED, function () {
          playVideo();
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = url;
        video.addEventListener("loadedmetadata", playVideo, { once: true });
        video.load();
      }
    }

    if (trigger) {
      trigger.addEventListener("click", start);
    }
    video.addEventListener("click", function () {
      if (!loaded || video.paused) {
        start();
      }
    });
    window.addEventListener("pagehide", function () {
      if (hls) {
        hls.destroy();
      }
    });
  }

  window.ClassicPlayer = { init: init };
})();
