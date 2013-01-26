(function() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'package.json', false);
  xhr.send(null);

  App.pkg = JSON.parse(xhr.responseText);

  if(window[App.pkg.settings.storage_engine].hasOwnProperty('language')) {
    setLanguage(window[App.pkg.settings.storage_engine]['language']);
  } else {
    setLanguage(App.pkg.settings.i18n.languages[0]);
  }
})();