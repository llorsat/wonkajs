//Wonka helpers

//Aliases for global objects
window.Bb = window.Backbone;
window.hbs = window.Handlebars;

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
  App.set('pkg', JSON.parse(xhr.responseText));  
}

//Set languages
if (App.has('pkg.settings.i18n.languages')) {
  if(window[App.pkg.settings.storage_engine].hasOwnProperty(App.pkg._id + '-language')) {
    setLanguage(window[App.pkg.settings.storage_engine][App.pkg._id + '-language']);
  } else {
    setLanguage(App.pkg.settings.i18n.languages[0]);
  }  
}

function formToJSON(selector) {
  var json = {}
  _.each(selector.serializeArray(), function(item) {
    if (_.has(json, item.name)) {
      if (_.isArray(json[item.name])) {
        json[item.name].push(item.value);
      } else {
        json[item.name] = [json[item.name], item.value];
      }
    } else {
      json[item.name] = item.value;  
    }
    
  });
  return json;
}

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
  window[App.pkg.settings.storage_engine][App.pkg._id + '-language'] = language;

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

//Authentication validation
function isAuthenticated() {
  var storageEngine = App.pkg.settings.storage_engine;
  var name = App.pkg._id;
  var auth = window[App.pkg.settings.auth_module];
  if (window[storageEngine][name + '-session']) {
    var data = JSON.parse(window[storageEngine][name + '-session']);
    data['empty'] = false;
    window.user = new auth.models.User(data);
  } else {
    window.user = new auth.models.User();
  }
  return !window.user.get('empty');
}

window.isMobile = {
  Android: function() {
    return navigator.userAgent.match(/Android/i);
  },
  BlackBerry: function() {
    return navigator.userAgent.match(/BlackBerry/i);
  },
  iOS: function() {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  },
  Opera: function() {
    return navigator.userAgent.match(/Opera Mini/i);
  },
  Windows: function() {
    return navigator.userAgent.match(/IEMobile/i);
  },
  FXOS: function() {
    var re = new RegExp('^(.*)Mobile(.*)Firefox(.*)$', 'gi');
    return re.test(navigator.userAgent);
  },
  any: function() {
    return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows() || isMobile.FXOS);
  }
};

//Backbone Router extensions
_.extend(Backbone.Router.prototype, {
  route: function(route, name, callback) {
    if (!_.isRegExp(route)) route = this._routeToRegExp(route);
    if (!callback) callback = this[name];
    var routerinstance = this;
    Backbone.history.route(route, _.bind(function(fragment) {
      var loginRequired = routerinstance['loginRequired'] || [];
      var logoutRequired = routerinstance['logoutRequired'] || [];
      if (loginRequired.indexOf(fragment) != -1) {
        if (!isAuthenticated()) {
          var login = App.pkg.settings.login_route || "#login";
          Backbone.history.navigate(login, {trigger: true}, {replace: true});
          return false;
        }
      }
      if (logoutRequired.indexOf(fragment) != -1) {
        if (isAuthenticated()) {
          var home = App.pkg.settings.home_route || "#home";
          Backbone.history.navigate(home, {trigger: true}, {replace: true});
          return false;
        }
      }
      var args = this._extractParameters(route, fragment);
      callback && callback.apply(this, args);
      this.trigger.apply(this, ['route:' + name].concat(args));
      this.trigger('route', name, args);
      Backbone.history.trigger('route', this, name, args);
    }, this));
    return this;
  }
});
