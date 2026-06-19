import{H as Hls}from'./hls-vendor-dru42stk.js';
document.querySelectorAll('video[data-hls]').forEach(function(video){
  var src=video.getAttribute('data-hls');
  var trigger=document.querySelector('[data-player-trigger="'+video.id+'"]');
  var started=false;
  function boot(){
    if(!started){
      started=true;
      if(video.canPlayType('application/vnd.apple.mpegurl')){video.src=src}
      else if(Hls&&Hls.isSupported()){var hls=new Hls();hls.loadSource(src);hls.attachMedia(video);hls.on(Hls.Events.MANIFEST_PARSED,function(){video.play().catch(function(){})})}
      else{video.src=src}
    }
    video.play().catch(function(){})
  }
  if(trigger){trigger.addEventListener('click',function(){trigger.classList.add('is-hidden');boot()})}
  video.addEventListener('play',function(){if(trigger){trigger.classList.add('is-hidden')}if(!started){boot()}});
  video.addEventListener('click',function(){if(!started){boot()}})
});