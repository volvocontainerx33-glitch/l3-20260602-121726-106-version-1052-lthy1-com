(function () {
  const video = document.getElementById('movie-video');
  const button = document.getElementById('movie-play-button');

  if (!video || !button || typeof movieSource === 'undefined') {
    return;
  }

  let prepared = false;

  function prepareVideo() {
    if (prepared) {
      return;
    }

    prepared = true;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = movieSource;
    } else if (window.Hls && window.Hls.isSupported()) {
      const hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(movieSource);
      hls.attachMedia(video);
    } else {
      video.src = movieSource;
    }
  }

  function playMovie() {
    prepareVideo();
    button.classList.add('is-hidden');
    const playPromise = video.play();

    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function () {
        button.classList.remove('is-hidden');
      });
    }
  }

  button.addEventListener('click', playMovie);
  video.addEventListener('click', function () {
    if (video.paused) {
      playMovie();
    }
  });
  video.addEventListener('play', function () {
    button.classList.add('is-hidden');
  });
}());
