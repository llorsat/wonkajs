window.MainRouter = Backbone.Router.extend({
  
  routes: {
    '': 'root',
    '*actions': 'defaultRoute'
  },

  root: function() {
    new root.views.Main();
  },
  
  defaultRoute: function() {
    new root.views.Main();
  }

});
