
import { H as Hls } from './hls-vendor-dru42stk.js';

function bindPlayer(box) {
  var video = box.querySelector('.js-hls-player');
  var button = box.querySelector('[data-play-button]');

  if (!video) {
    return;
  }

  function prepare() {
    var source = video.getAttribute('data-src');

    if (!source || video.dataset.ready === 'true') {
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
    } else if (Hls && Hls.isSupported()) {
      var hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(source);
      hls.attachMedia(video);
      video._hls = hls;
    } else {
      video.src = source;
    }

    video.dataset.ready = 'true';
  }

  function play() {
    prepare();
    var playPromise = video.play();

    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function () {
        video.controls = true;
      });
    }
  }

  if (button) {
    button.addEventListener('click', play);
  }

  video.addEventListener('play', function () {
    if (button) {
      button.classList.add('hidden');
    }
  });

  video.addEventListener('pause', function () {
    if (button && video.currentTime === 0) {
      button.classList.remove('hidden');
    }
  });
}

document.querySelectorAll('[data-player-box]').forEach(bindPlayer);
