window.App = {

  rootURI: '',

  init: function(libraries, applications, scripts, callback) {

    var components = ['init', 'models', 'collections', 'views'];
    var requirements = [];

    //loading libraries
    for (var i = 0; i < libraries.length; i++) {
      requirements.push('order!../libraries/' + libraries[i]);
    }

    //loading apps with components
    for (var i = 0; i < components.length; i++) {
      for (var j = 0; j < applications.length; j++) {
        requirements.push('order!../' + applications[j] + '/' + components[i]);
      }
    }

    //loading scripts
    for (var i = 0; i < scripts.length; i++) {
      requirements.push('order!../main/' + scripts[i]);
    }
    
    require(requirements, callback);
    
  },

  namespace: function() {
    var args = Array.prototype.slice.call(arguments);

    var setComponents = function(context, first, rest) {
      if (!context[first]) {
        context[first] = {
          models: {},
          collections: {},
          views: {},
        };
      }
      if (rest.length) {
        setComponents(context[first], _.first(rest), _.rest(rest));
      }
      };

    setComponents(window, _.first(args), _.rest(args));
  },

  message: function(out) {
    if (!out.btns) {
      var btns = ['Aceptar'];
      out.btns = btns;
    } else if (out.btns.length > 2) {
      var toDelet = out.btns.length - 2;
      out.btns.splice(2, toDelet);
    }
    var deferred = $.Deferred();
    var $message = $('#message-container');
    $message.empty();
    $message.html(new MessageView({
      model: out,
      deferred: deferred
    }).render().$el);
    $message.fadeIn('fast');
    return deferred.promise();
  },

  vitrines: {
    max: 999999
  },

  get: function(path, defaultValue) {
    var parts = path.split(".");
    var getValue = function(context, variable, rest) {
      if (context && context[variable]) {
        if (rest.length > 0) {
          return getValue(context[variable], _.first(rest), _.rest(rest));
        } else {
          var obj = context[variable];
          return _.isFunction(obj) ? obj.call(null) : obj;
        }
      } else {
        return defaultValue;
      }
    };
    return getValue(this, _.first(parts), _.rest(parts));
  }
};
