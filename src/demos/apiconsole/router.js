(function(namespace) {

  var views = namespace.views;

  var Router = Backbone.Router.extend({
    
    routes: {
      'demos/apiconsole': 'main',
    },

    main: function() {
      new views.Main({
        el: $('#main')
      });
    },

  });

  new Router();

})(demos.apiconsole);