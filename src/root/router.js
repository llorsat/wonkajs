(function(namespace) {

  namespace.Router = Backbone.Router.extend({
    
    routes: {
      '': 'main',
    },

    main: function() {
      var view = new namespace.views.Main({
        el: $('#main')
      });
    },

  });

  new namespace.Router();

})(root);