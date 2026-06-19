import { H as Hls } from './hls-vendor-dru42stk.js';

var video = document.getElementById('main-video');
var cover = document.getElementById('player-cover');
var hlsInstance = null;

function attachStream() {
  if (!video) {
    return Promise.resolve();
  }

  var streamUrl = video.getAttribute('data-stream-url');

  if (!streamUrl) {
    return Promise.resolve();
  }

  if (video.canPlayType('application/vnd.apple.mpegurl')) {
    if (video.src !== streamUrl) {
      video.src = streamUrl;
    }
    return video.play();
  }

  if (Hls && Hls.isSupported()) {
    if (!hlsInstance) {
      hlsInstance = new Hls({
        enableWorker: true,
        lowLatencyMode: false
      });
      hlsInstance.loadSource(streamUrl);
      hlsInstance.attachMedia(video);
    }
    return video.play();
  }

  video.src = streamUrl;
  return video.play();
}

function beginPlay() {
  if (cover) {
    cover.classList.add('is-hidden');
  }
  var promise = attachStream();
  if (promise && typeof promise.catch === 'function') {
    promise.catch(function () {
      if (cover) {
        cover.classList.remove('is-hidden');
      }
    });
  }
}

if (cover) {
  cover.addEventListener('click', beginPlay);
}

if (video) {
  video.addEventListener('play', function () {
    if (cover) {
      cover.classList.add('is-hidden');
    }
  });
  video.addEventListener('click', function () {
    if (video.paused) {
      beginPlay();
    }
  });
}
