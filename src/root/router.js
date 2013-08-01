(function(namespace) {

  namespace.Router = Backbone.Router.extend({
    
    routes: {
      '': 'main',
      'credits': 'credits',
      'companies': 'companies'
    },

    main: function() {
      $('.nav-collapse.in').attr('style', 'height: 0');
      $('.nav-collapse.in').removeClass('in');
      App.loadingBar.show();
      var view = new namespace.views.Main({
        el: $('#container')
      });
    },

    credits: function() {
      $('.nav-collapse.in').attr('style', 'height: 0');
      $('.nav-collapse.in').removeClass('in');
      App.loadingBar.show();
      var view = new namespace.views.Credits({
        el: $('#container')
      });
    },

    companies: function() {
      $('.nav-collapse.in').attr('style', 'height: 0');
      $('.nav-collapse.in').removeClass('in');
      App.loadingBar.show();
      var view = new namespace.views.Companies({
        el: $('#container')
      });
    }

  });

  new namespace.Router();

})(root);