(function(namespace) {

  var views = namespace.views;
  var collections = namespace.collections;
  var models = namespace.models;

  var getTemplate = function(name) {
    return hbs.compile($('#%(appName)s-' + name + '-template').html());
  }

  views.Main = Bb.View.extend({
    template: getTemplate('main'),
    initialize: function() {
      var me = this;
      me.render();
    },
    render: function() {
      var me = this;
      me.$el.html(me.template());
      App.loadingBar.set(100);
      App.loadingBar.changed(App.loadingBar.hide);
      return me;
    }
  });

})(%(namespace)s);