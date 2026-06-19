(function () {
  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var existing = document.querySelector('script[src="' + src + '"]');
      if (existing) {
        existing.addEventListener('load', resolve);
        existing.addEventListener('error', reject);
        if (window.Hls) {
          resolve();
        }
        return;
      }

      var script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  function initPlayer(root) {
    var video = root.querySelector('video');
    var button = root.querySelector('[data-play-button]');
    var poster = root.querySelector('[data-video-poster]');
    var status = root.querySelector('[data-player-status]');
    var source = root.getAttribute('data-src');
    var started = false;
    var hlsInstance = null;

    function setStatus(text) {
      if (status) {
        status.textContent = text;
      }
    }

    function playVideo() {
      var promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {
          setStatus('播放器已加载，请再次点击播放');
        });
      }
    }

    function attachAndPlay() {
      if (!video || !source) {
        setStatus('未找到播放源');
        return;
      }

      if (poster) {
        poster.classList.add('hidden');
      }
      video.setAttribute('controls', 'controls');

      if (started) {
        playVideo();
        return;
      }

      started = true;
      setStatus('正在加载播放源...');

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
        video.addEventListener('loadedmetadata', function () {
          setStatus('播放源已就绪');
          playVideo();
        }, { once: true });
        video.addEventListener('error', function () {
          setStatus('播放源加载失败，请稍后重试');
        });
        video.load();
        return;
      }

      loadScript('https://cdn.jsdelivr.net/npm/hls.js@1.5.17/dist/hls.min.js')
        .then(function () {
          if (window.Hls && window.Hls.isSupported()) {
            hlsInstance = new window.Hls({
              enableWorker: true,
              lowLatencyMode: false
            });
            hlsInstance.loadSource(source);
            hlsInstance.attachMedia(video);
            hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
              setStatus('播放源已就绪');
              playVideo();
            });
            hlsInstance.on(window.Hls.Events.ERROR, function (event, data) {
              if (data && data.fatal) {
                setStatus('播放源加载失败，请刷新页面重试');
              }
            });
          } else {
            setStatus('当前浏览器不支持 HLS 播放');
          }
        })
        .catch(function () {
          setStatus('播放器组件加载失败，请检查网络后重试');
        });
    }

    if (button) {
      button.addEventListener('click', attachAndPlay);
    }

    window.addEventListener('beforeunload', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  }

  document.querySelectorAll('[data-player]').forEach(initPlayer);
}());
