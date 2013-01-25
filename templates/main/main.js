window.main = function() {

  window.spinerizedObjects = [];

  new MainRouter();
  
  Backbone.history.start();

};
