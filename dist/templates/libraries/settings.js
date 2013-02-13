//Here we load the package.json on the App.pkg object when page load

if (!App.has('pkg')) {
  var xhr = null;
  var activexmodes = ["Msxml2.XMLHTTP", "Microsoft.XMLHTTP"];
  if (window.ActiveXObject) {
    for (var i=0; i < activexmodes.length; i++) {
      try {
        xhr = new ActiveXObject(activexmodes[i]);
      } catch(e) {}
    }
  } else {
    xhr = new XMLHttpRequest();
  }
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