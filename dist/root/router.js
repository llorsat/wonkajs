(function(namespace) {

  var views = namespace.views;

  var Router = Backbone.Router.extend({
    
    routes: {
      '': 'main',
    },

    main: function() {
      var view = new views.Main();
      $('#container').html(view.render().$el);
    },

  });

  new Router();

})(root);