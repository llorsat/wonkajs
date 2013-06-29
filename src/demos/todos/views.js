(function(namespace) {

  var views = namespace.views;
  var collections = namespace.collections;

  var ENTER_KEY = 13;

  var getTemplate = function(name) {
    return hbs.compile($('#demos-todos-' + name + '-template').html());
  }

  views.Main = Bb.View.extend({
    template: getTemplate('main'),
    events: {
      'keypress #new-todo': 'onAddTodo'
    },
    initialize: function() {
      var me = this;
      me.collection = new collections.Todos();
      me.listenTo(me.collection, 'add', me.onRenderTask);
      me.counter = 0;
      me.render();
    },
    render: function() {
      var me = this;
      me.$el.html(me.template());
      return me;
    },
    onAddTodo: function(e) {
      var me = this;
      var target = me.$(e.currentTarget);
      var title = target.val();
      if (title != '' && e.keyCode == ENTER_KEY) {
        me.counter++;
        me.collection.add({
          title: title,
          id: me.counter
        });
        target.val('');
      }
    },
    onRenderTask: function(todo) {
      var me = this;
      var todoView = new views.Todo({model: todo});
      me.$('#todo-list').append(todoView.render().$el);
    }
  });

  views.Todo = Bb.View.extend({
    tagName: 'li',
    template: getTemplate('todo'),
    events: {
      'click .toggle': 'onToggle'
    },
    render: function() {
      var me = this;
      me.$el.html(me.template(me.model.toJSON()));
      return me;
    },
    onToggle: function(e) {
      var me = this;
      var target = me.$(e.currentTarget);
      me.model.set('completed', target.prop('checked'));
      if (target.prop('checked')) {
        me.$('.task').css('text-decoration', 'line-through');
      } else {
        me.$('.task').css('text-decoration', 'none');
      }
    }
  });

})(demos.todos);