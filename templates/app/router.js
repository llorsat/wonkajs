(function(namespace) {

  var views = namespace.views;

  var Router = Backbone.Router.extend({
    
    routes: {
      '%(routeName)s': 'main',
    },

    main: function() {
      var view = new views.Main();
      $('#container').html(view.render().$el);
    },

  });

  new Router();

})(%(namespace)s);