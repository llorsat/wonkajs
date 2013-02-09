(function(namespace) {

  namespace.Router = Backbone.Router.extend({
    
    routes: {
      'demos': 'main',
    },

    main: function() {
      var view = new namespace.views.Main();
      $('#main').html(view.render().$el);
    },

  });

  new namespace.Router();

})(demos);