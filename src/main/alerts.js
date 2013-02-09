window.MessageView = Backbone.View.extend({
  template: hbs.compile($('#message-template').html()),
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