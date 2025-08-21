(function () {
  function setActive() {
    try {
      var path = location.pathname.split('/').pop() || 'index.html';
      if (path === '') path = 'index.html';
      document.querySelectorAll('#navbar-container a.nav-link').forEach(function(a){
        var href = a.getAttribute('href') || '';
        var target = href.split('#')[0] || href;
        var isActive = (target === path) || (path === 'index.html' && (href === 'index.html' || href === './' || href === '/'));
        if (isActive) {
          a.classList.add('active');
          if (a.parentElement && a.parentElement.classList) a.parentElement.classList.add('active');
        }
      });
    } catch (e) { console.warn('[navbar] active-state error:', e); }
  }

  function inject(html) {
    var container = document.getElementById('navbar-container');
    if (!container) {
      console.warn('[navbar] No #navbar-container found; creating at top of body.');
      container = document.createElement('div');
      container.id = 'navbar-container';
      document.body.insertBefore(container, document.body.firstChild);
    }
    container.innerHTML = html;
    setActive();
  }

  async function loadPartial() {
    var baseFromScript = (function(){
      try {
        var s = document.currentScript && document.currentScript.src;
        if (!s) return null;
        var u = new URL(s, location.href);
        return u.pathname.replace(/[^/]+$/, '');
      } catch (_) { return null; }
    })();
    var candidates = [
      new URL('partials/navbar.html', location.href).href,
      baseFromScript ? (location.origin + baseFromScript + 'partials/navbar.html') : null,
      location.origin + '/partials/navbar.html'
    ].filter(Boolean);

    var lastErr = null;
    for (var i=0; i<candidates.length; i++) {
      try {
        var r = await fetch(candidates[i], { cache: 'no-store' });
        if (r.ok) return r.text();
        lastErr = new Error('HTTP ' + r.status + ' fetching ' + candidates[i]);
      } catch (e) { lastErr = e; }
    }
    throw lastErr || new Error('No candidates worked');
  }

  if (location.protocol === 'file:') {
    console.error('[navbar] Cannot fetch partial from file://. Please serve via http://localhost or HTTPS.');
    inject('<nav class="navbar navbar-light bg-light"><a class="navbar-brand" href="index.html">browserPGP</a></nav>');
    return;
  }

  loadPartial().then(function(html){
    inject(html);
  }).catch(function(err){
    console.error('[navbar] Failed to load partial:', err);
    inject('<nav class="navbar navbar-light bg-light"><a class="navbar-brand" href="index.html">browserPGP</a></nav>');
  });
})();