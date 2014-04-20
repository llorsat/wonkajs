(function() {

  var ParamsMixin = {
    addParams: function(object) {
      for(var i in object) {
        this.addParam(i, object[i]);
      }
      return this;
    },
    addParam: function(param, value) {
      if (!this.params) {
        this.params = {};
      }
      this.params[param] = value;
      return this;
    },
    getParams: function() {
      return this.params || {};
    },
    removeParam: function(param) {
      delete this.params[param];
      return this;
    },
    clearParams: function() {
      delete this.params;
      return this;
    },
    getParam: function(name, defaultValue) {
      if (this.params) {
        return this.params[name];
      }
      return defaultValue;
    },
    serializeData: function(object) {
      var url = "";
      if (_.size(object) === 0) {
        return url;
      }
      for (attribute in object) {
        if (typeof object == "function") {
          url += attribute + "=" + object(attribute) + "&";
        } else {
          url += attribute + "=" + object[attribute] + "&";
        }
      }
      return '?' + url.substring(url.length - 1, 0);
    },
    getParamsQuery: function() {
      return this.serializeData(this.getParams());
    },
    serialize: function() {
      return this.serializeData(this.attributes);
    }
  };

  // Copy params mixin to Model
  _.extend(Backbone.Model.prototype, ParamsMixin);

  // Extend Model
  _.extend(Backbone.Model.prototype, {
    getOrElse: function(name, defaultValue) {
      var value = this.get(name);
      return value !== undefined ? value : defaultValue;
    },
    containsValue: function(value) {
      return _.any(this.attributes, function(attr) {
        return attr == value;
      });
    },
    match: function(text) {
      var reg = new RegExp(text, 'gi');
      return _.any(this.attributes, function(attr) {
        return reg.test(attr);
      });
    },
    toJSON: function() {
      if (typeof(this.attributes) != "undefined") {
        return JSON.parse(JSON.stringify(this.attributes));
      }
      else {
        return {};
      }
    }
  });

  // Copy params mixin to Collection
  _.extend(Backbone.Collection.prototype, ParamsMixin);

  // Extend View  
  var oldDelegateEvents = Backbone.View.prototype.delegateEvents;
  var oldUndelegateEvents = Backbone.View.prototype.undelegateEvents;
  var oldRemove = Backbone.View.prototype.remove;
  var callbacks = {};

  _.extend(Backbone.View.prototype, {
    remove: function() {
      this.undelegateEvents();
      oldRemove.call(this);
    },
    delegateEvents: function(events) {
      oldDelegateEvents.call(this, events);
      this.globalEvents && this.delegateGlobalEvents(this.globalEvents);
    },
    undelegateEvents: function() {
      oldUndelegateEvents.call(this);
      this.globalEvents && this.undelegateGlobalEvents(this.globalEvents);
    },
    delegateGlobalEvents: function(events) {
      for (event in events) {
        var fnName = events[event];
        var fn = this[fnName];
        if (fn && _.isFunction(fn)) {
          var callbackName = event + this.cid;

          if (!callbacks[callbackName]) {
            var wrapperFunction = this._makeWrappper(this, fn);
            callbacks[callbackName] = wrapperFunction;
            Backbone.Events.on(event, wrapperFunction);
          }
        }
      }
    },
    _makeWrappper: function(view, fn) {
      return (function(innerView, innerFn) {
        return function(params, target, subject) {
          if (subject) {
            if (subject == innerView.cid) {
              innerFn.call(innerView, params, target, subject);
            }
          } else {
            innerFn.call(innerView, params, target, subject);
          }
        };
      })(view, fn);
    },
    undelegateGlobalEvents: function(events) {
      for (event in events) {
        var callbackName = event + this.cid;
        if (callbacks[callbackName]) {
          Backbone.Events.off(event, callbacks[callbackName]);
          delete callbacks[callbackName];
        }
      }
    }
  });

})();