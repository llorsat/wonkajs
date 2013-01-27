(function() {
  if (!App.has('pkg')) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'package.json', false);
    xhr.send(null);
    if (xhr.status == '200') {
      App.set('pkg', JSON.parse(xhr.responseText));  
    }
  }

  if (App.has('pkg.settings.i18n.languages')) {
    if(window[App.pkg.settings.storage_engine].hasOwnProperty('language')) {
      setLanguage(window[App.pkg.settings.storage_engine]['language']);
    } else {
      setLanguage(App.pkg.settings.i18n.languages[0]);
    }  
  }
  
})();