//App object to allocate info on package.json file and allocate App variables

window.App = {

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
  }

};
