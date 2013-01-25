(function(namespace) {

  namespace.Router = Backbone.Router.extend({
    
    routes: {
      '': 'main',
    },

    main: function() {
      new namespace.views.Main();
    },

  });

  new namespace.Router();

})(root);