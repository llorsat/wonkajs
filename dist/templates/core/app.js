window.App = {

  init: function(libraries, applications, scripts, callback) {

    var components = ['init', 'models', 'collections', 'views', 'router'];
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
    $message.html(new root.views.Message({
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
  },

  has: function(path) {
    var value = this.get(path, undefined);
    return value !== undefined;
  },

  set: function(path, value) {
    var parts = path.split(".");
    var setValue = function(context, variable, rest) {
      if (!_.has(context, variable)) {
        context[variable] = {};
      }
      if (rest.length > 0) {
        setValue(context[variable], _.first(rest), _.rest(rest));
      } else {
        context[variable] = value;
      }
    };
    return setValue(this, _.first(parts), _.rest(parts));
  },

  // Html 5 patterns
  patterns: {
    positive: "\\d*",
    date: "(0[1-9]|[12][0-9]|3[01])[-/](0[1-9]|1[012])[-/](19|20)[0-9]{2}",
    datetime: "(0[1-9]|[12][0-9]|3[01])[-/](0[1-9]|1[012])[-/](19|20)[0-9]{2} ([0-1][0-9]|2[0-3]):[0-5][0-9]",
    decimal: "[0-9]{1,}(\\.[0-9]{1,})?",
    zip_code: "[0-9]{4,5}",
    phone: "([0-9]){6,}",
    ext: "([0-9]){3,5}",
    simpleEmail: "\\S+@\\S+\\.\\S+",
    email: "^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)" + "|(\".+\"))" + "@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])" + "|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$",
    numberFormat: "[0-9]{1,3}(,[0-9]{3})*(\\.[0-9]+)?",
    amount: "(([0-9]{1,3}(,[0-9]{3})*(\\.[0-9]+)?)|([0-9]{1,}(\\.[0-9]{1,})?))",
    curp: "([A-Z]|[a-z]){4}\\d{6}([A-Z]|[a-z]){6}\\d{2}",
    rfc: "(([A-Z]|\\u00D1)|([a-z]|\\u00F1)){4}\\d{6}(\\w{3})?",
  }

};
