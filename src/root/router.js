(function(namespace) {

  namespace.Router = Backbone.Router.extend({
    
    routes: {
      '': 'main',
      'credits': 'credits',
      'companies': 'companies'
    },

    main: function() {
      var view = new namespace.views.Main({
        el: $('#main')
      });
    },

    credits: function() {
      var view = new namespace.views.Credits({
        el: $('#main')
      });
    },

    companies: function() {
      var view = new namespace.views.Companies({
        el: $('#main')
      });
    }

  });

  new namespace.Router();

})(root);