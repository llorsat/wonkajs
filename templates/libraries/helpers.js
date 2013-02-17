//Wonka helpers

//Aliases for global objects
window.Bb = window.Backbone;
window.hbs = window.Handlebars;

//API uri builder
function uri() {
  var uri = App.pkg.settings.api;
  _.each(arguments, function(item) {
    uri += item + '/';
  });
  return uri.substring(0, uri.length - 1);
};

// Init the I18n with language specified
function setLanguage(language) {
  window[App.pkg.settings.storage_engine]['language'] = language;

  var xhr = null;
  var activexmodes = ["Msxml2.XMLHTTP", "Microsoft.XMLHTTP"];
  if(window.ActiveXObject) {
    for(var i = 0; i < activexmodes.length; i++) {
      try {
        xhr = new ActiveXObject(activexmodes[i]);
      } catch(e) {}
    }
  } else {
    xhr = new XMLHttpRequest();
  }
  xhr.open('GET', 'languages/' + language + '.json', false);
  xhr.send(null);

  if(xhr.status == 200 || xhr.status == 201) {
    var response = JSON.parse(xhr.responseText);
    Globalize.culture(language);
    Globalize.addCultureInfo(language, {
      messages: response,
    });
  }
};

//Create a new namespace
function namespace() {
  var args = Array.prototype.slice.call(arguments);
  var setComponents = function(context, first, rest) {
    if(!context[first]) {
      context[first] = {
        models: {},
        collections: {},
        views: {},
      };
    }
    if(rest.length) {
      setComponents(context[first], _.first(rest), _.rest(rest));
    }
  };
  setComponents(window, _.first(args), _.rest(args));
};

//Return a localized string
function __(stringToTranslate) {
  return Globalize.localize(stringToTranslate, Globalize.culture()) || stringToTranslate;
};

//Handlebars helper for localize string
Handlebars.registerHelper("__", function(string) {
  return __(string);
});

Handlebars.registerHelper('asset', function(application, resource){
  if (App.get('stage') == 'dev') {
    return application + "/resources/" + resource;
  } else if (App.get('stage') == 'prod') {
    return application + '/' + resource;
  }
});