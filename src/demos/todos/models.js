(function(namespace) {
  
  var models = namespace.models;

  models.Todo = Bb.Model.extend({
    defaults: {
      completed: false
    }
  });

})(demos.todos);