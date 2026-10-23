// One theme preference for every Fotomigo page. Follow the device until chosen.
(function () {
  'use strict';
  var root = document.documentElement;
  var system = window.matchMedia('(prefers-color-scheme: dark)');
  var preference = null;
  var button;

  function readPreference() {
    try {
      var saved = localStorage.getItem('fotomigo-theme');
      preference = saved === 'light' || saved === 'dark' ? saved : null;
    } catch (e) { /* Retain this page's choice if storage is unavailable. */ }
  }

  function show() {
    var mode = preference || (system.matches ? 'dark' : 'light');
    root.setAttribute('data-theme', mode);
    if (!button) return;
    var label = 'Switch to ' + (mode === 'dark' ? 'light' : 'dark') + ' mode';
    button.setAttribute('data-mode', mode);
    button.setAttribute('aria-label', label);
    button.setAttribute('title', label);
  }

  readPreference();
  show(); // Set the palette before the page paints.
  document.addEventListener('DOMContentLoaded', function () {
    button = document.querySelector('.theme');
    show();
    if (!button) return;
    button.addEventListener('click', function () {
      preference = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      show();
      try { localStorage.setItem('fotomigo-theme', preference); } catch (e) {}
    });
  });
  system.addEventListener('change', show);
  window.addEventListener('storage', function (event) {
    if (event.key === 'fotomigo-theme' || event.key === null) {
      readPreference();
      show();
    }
  });
  window.addEventListener('pageshow', function () { readPreference(); show(); });
})();
