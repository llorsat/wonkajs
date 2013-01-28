(function(namespace) {

  var views = namespace.views;

  var getTemplate = function(name) {
    return hbs.compile($('#root-' + name + '-template').html());
  }

  views.Main = Bb.View.extend({
    el: '#container',
    template: getTemplate('main'),
    initialize: function() {
      var me = this;
      me.render();
    },
    render: function() {
      var me = this;
      me.$html(me.template());
      return me;
    }
  });

  views.Message = Backbone.View.extend({
    template: getTemplate('message'),
    render: function() {
      this.$html(this.template(this.model));
      return this;
    },
    events: {
      'click #submit': 'onSubmit',
      'click #close': 'onClose',
    },
    onSubmit: function() {
      var me = this;
      me.$parent().fadeOut('slow', function() {
        me.remove();
      });
      me.options.deferred.resolve();
    },
    onClose: function() {
      var me = this;
      me.$parent().fadeOut('slow', function() {
        me.remove();
      });
      me.options.deferred.reject();
    }
  });

})(root);