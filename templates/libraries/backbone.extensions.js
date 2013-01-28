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

    isBackboneModel: true,

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
      if (typeof(this.attributes) !== "undefined") {
        return JSON.parse(JSON.stringify(this.attributes));
      }
      else {
        return {};
      }
    },

    errors: [],

    formErrors: function() {
      var messages = [];
      var errors = this.errors;
      for (var i = 0; i < errors.length; i++) {
        messages.push('* ' + errors[i].message);
      }
      return messages;
    },

    isValid: function() {
      this.errors = []
      for (var i = 0; i < this.validations.length; i++) {
        var validation = this.validations[i](this.attributes);
        if (typeof validation === "object") {
          this.errors.push(validation);
        }
      }
      if (this.errors.length === 0) {
        return true;
      }
      return false;
    }

  });

  // Copy params mixin to Collection
  _.extend(Backbone.Collection.prototype, ParamsMixin);

  // Extend Collection
  _.extend(Backbone.Collection.prototype, {

    clearFlexigridSort: function() {
      this.lastOrderField = null;
      this.lastOrderType = null;
    },

    matched: function(filterText) {
      var collection = new this.constructor();
      collection.addParams(collection.getParams());
      collection.reset(this.filter(function(m){
        return m.match(filterText);
      }));
      return collection;
    },

    search: function(attribute, value) {
      var collection = new this.constructor();
      collection.addParams(collection.getParams());
      collection.reset(this.filter(function(m) {
        return m.get(attribute) == value;
      }));
      return collection;
    },

    setToModels: function() {
      if(arguments.length == 1) {
        this.each(function(m) {
          m.set(arguments[0]);
        });
      } else {
        this.each(function(m) {
          m.set(arguments[0], arguments[1]);
        });
      }
    },

    getTotalSum: function(attribute) {
      return this.reduce( function(acc, model){
        return acc + parseFloat(model.get(attribute));
      }, 0);
    },
    
    flexigridSort: function(callback) {
      var collection = this;
      var getWeight = _.memoize(function(str, multiply) {
        if (_.isNumber(str)) {
          return multiply * str;  
        } else {
          str = str.toLowerCase();
          str = str.split("");
          str = _.map(str, function(letter) { 
            return String.fromCharCode(multiply * letter.charCodeAt(0));
          });
          return str;
        }
      });
      return function(field, type) {
        if (!type) {
          return;
        }
        if (field == collection.lastOrderField && type == collection.lastOrderType) {
          return;
        }

        if (type == "asc") {
          collection.comparator = function(model) {
            return getWeight(model.get(field), 1);
          };
        } else if (type == "desc") {
          collection.comparator = function(model) {
            return getWeight(model.get(field), -1);
          };
        }
        collection.sort();
        collection.comparator = null;

        collection.lastOrderField = field;
        collection.lastOrderType = type;

        if (_.isFunction(callback)) {
          callback(collection);
        }
      };
    }
  });

  // Extend View  
  var oldDelegateEvents = Backbone.View.prototype.delegateEvents;
  var oldUndelegateEvents = Backbone.View.prototype.undelegateEvents;
  var oldRemove = Backbone.View.prototype.remove;
  var callbacks = {};

  _.extend(Backbone.View.prototype, {

    $find: function(args) {
      return this.$el.find(args);
    },

    $children: function(args) {
      return this.$el.children(args);
    },

    $html: function(args) {
      return this.$el.html(args);
    },

    $parent: function(args) {
      return $(this.$el.parent(args));
    },

    $trigger: function(evt, obj) {
      return this.$el.trigger(evt, obj);
    },

    close: function() {
      if (_.isFunction(arguments[0])) {
        arguments[0]();
      }
      this.undelegateEvents();
      var vitrine = this.$el.closest('.vitrine');
      if (vitrine.length > 0) {
        vitrine.undelegate();
        vitrine.remove();
        //remove tooltips
        $('.tooltip').remove(); 
      }
    },

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
    },

    globalTrigger: function(eventName, params, subject) {
      var target = this.cid;
      Backbone.Events.trigger(eventName, params, target, subject);
    },

    sendEvent: function(view, eventName, params) {
      if (view && view.cid) {
        view = view.cid;
      } 
      this.globalTrigger(eventName, params, view);
    },

    openDialog: function(name, baseElem) {
      var deferred = $.Deferred();
      if (!baseElem) {
        baseElem = this.$el;
      }

      if (_.isString(name)) {
        var dialog = baseElem.find("#" + name + "-dialog");
      } else {
        var dialog = baseElem.closest(".dialog");
        var baseElem = dialog.closest(".vitrine");
      }

      this.closeDialog(baseElem).done(function() {
        dialog.slideDown('fast').promise().done(function() {
          deferred.resolve();
        })
      });
      return deferred.promise();
    },

    closeDialog: function(baseElem) {
      // by event
      if (baseElem && baseElem["currentTarget"]) {
        baseElem = $(baseElem["currentTarget"]).closest('.vitrine');
      }
      // by element
      if (!baseElem) {
        baseElem = this.$el;
      }
      return baseElem.find(".dialog").slideUp('fast').promise();
    },

    autoVitrineHeight: function() {
      var vitrine = this.$el.closest('.vitrine');
      var height = 0;
      if (vitrine.children('.vitrine-content').children('.grid-container').size() > 0) {
        height = $(vitrine.children('.vitrine-content').children('.grid-container')).height() + 55;
      } else {
        height = $(vitrine.children('.vitrine-content').children('div')).height() + 55;
      }
      vitrine.css('height', height);
    },

    resizeVitrine: function() {
      this.autoVitrineHeight();
    },

    hide: function() {
      this.$el.closest('.vitrine').hide();
    },

    initSpinner: function() {
      var self = this;
      add_spiner(self.$el.closest(".vitrine-content"));
    },
    
    openVitrine: function(options, callback) {
        openVitrine(options, callback);
    },

    showMessage: function(options) {
        App.message(options);
    }
    
  });

  var oldExtend = Backbone.View.extend;
  Backbone.View.extend = function(protoProps, helpers){
    var classProps = null;
    if (_.isArray(helpers)) {
      _.each(helpers, function(helper) {
        for (propName in helper) {
          if (protoProps[propName]) {
            protoProps[propName];
            _.extend(protoProps[propName], helper[propName]);  
          } else {
            protoProps[propName] = helper[propName];
          }
        }
      });
    } else {
      classProps = helpers;
    }
    return oldExtend.call(this, protoProps, classProps);
  };

})();