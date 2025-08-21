(function(){
  function copy(sel){
    var el = document.querySelector(sel);
    if(!el) return;
    var text = (el.value != null ? el.value : el.textContent) || '';
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(function(){fallback(text);});
      return;
    }
    fallback(text);
  }
  function fallback(text){
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } finally { document.body.removeChild(ta); }
  }
  document.addEventListener('click', function(e){
    var btn = e.target.closest('[data-copy]');
    if(!btn) return;
    e.preventDefault();
    copy(btn.getAttribute('data-copy'));
  });
})();
