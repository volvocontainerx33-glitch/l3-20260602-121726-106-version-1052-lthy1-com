(function(){
  var btn=document.querySelector('.menu-btn');
  var panel=document.querySelector('.mobile-panel');
  if(btn&&panel){btn.addEventListener('click',function(){panel.classList.toggle('open')})}
  document.querySelectorAll('.site-search-form').forEach(function(form){form.addEventListener('submit',function(e){e.preventDefault();var q=form.querySelector('input').value.trim();if(q){location.href='search.html?q='+encodeURIComponent(q)}})});
  var slides=[].slice.call(document.querySelectorAll('.hero-slide'));
  var dots=[].slice.call(document.querySelectorAll('.hero-dot'));
  if(slides.length){var current=0;var show=function(i){slides.forEach(function(s,n){s.classList.toggle('active',n===i)});dots.forEach(function(d,n){d.classList.toggle('active',n===i)});current=i};dots.forEach(function(d,i){d.addEventListener('click',function(){show(i)})});setInterval(function(){show((current+1)%slides.length)},5200)}
  var scope=document.querySelector('[data-filter-scope]');
  if(scope){var kw=document.querySelector('[data-filter-keyword]');var year=document.querySelector('[data-filter-year]');var items=[].slice.call(scope.querySelectorAll('.movie-card'));var empty=document.querySelector('.empty');var apply=function(){var k=(kw&&kw.value||'').trim().toLowerCase();var y=year&&year.value||'';var visible=0;items.forEach(function(item){var t=(item.getAttribute('data-title')||'').toLowerCase();var g=(item.getAttribute('data-genre')||'').toLowerCase();var yy=item.getAttribute('data-year')||'';var ok=(!k||t.indexOf(k)>-1||g.indexOf(k)>-1)&&(!y||yy===y);item.style.display=ok?'block':'none';if(ok)visible++});if(empty){document.body.classList.toggle('no-results',visible===0)}};if(kw)kw.addEventListener('input',apply);if(year)year.addEventListener('change',apply);apply()}
})();