(function(namespace) {
  
  var collections = namespace.collections;
  var models = namespace.models;

  collections.Todos = Bb.Collection.extend({
    model: models.Todo
  });

})(demos.todos);