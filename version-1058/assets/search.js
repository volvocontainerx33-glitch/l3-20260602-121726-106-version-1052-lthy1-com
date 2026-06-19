(function(){
  var data=window.SITE_MOVIES||[];
  var input=document.querySelector('[data-search-input]');
  var box=document.querySelector('[data-search-results]');
  var count=document.querySelector('[data-search-count]');
  function card(m){return '<a class="movie-card" href="'+m.url+'" data-title="'+escapeHtml(m.title)+'" data-genre="'+escapeHtml(m.genre)+'" data-year="'+escapeHtml(String(m.year))+'"><div class="poster"><img src="'+m.cover+'" alt="'+escapeHtml(m.title)+'"><span class="tag-top">'+escapeHtml(String(m.year||''))+'</span><span class="tag-bottom">'+escapeHtml(m.category)+'</span></div><div class="card-body"><h3 class="card-title">'+escapeHtml(m.title)+'</h3><div class="card-meta"><span>'+escapeHtml(m.region)+'</span><span>'+escapeHtml(m.type)+'</span></div><p class="card-line">'+escapeHtml(m.one)+'</p></div></a>'}
  function escapeHtml(s){return String(s||'').replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  function run(){var q=(input&&input.value||'').trim().toLowerCase();var result=data.filter(function(m){var hay=(m.title+' '+m.genre+' '+m.tags+' '+m.region+' '+m.type+' '+m.one).toLowerCase();return !q||hay.indexOf(q)>-1}).slice(0,160);if(box){box.innerHTML=result.map(card).join('')}if(count){count.textContent=q?'找到 '+result.length+' 条相关内容':'输入片名、类型或地区进行搜索'}}
  var params=new URLSearchParams(location.search);var init=params.get('q')||'';if(input){input.value=init;input.addEventListener('input',run)}run()
})();