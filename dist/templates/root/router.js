(function(namespace) {

  namespace.Router = Backbone.Router.extend({
    
    routes: {
      '': 'main',
    },

    main: function() {
      var view = new namespace.views.Main();
      $('#container').html(view.render().$el);
    },

  });

  new namespace.Router();

})(root);