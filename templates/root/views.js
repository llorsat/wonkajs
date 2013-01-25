(function(namespace) {

    var views = namespace.views;

    var getTemplate = function(name) {
        return hbs.compile($('#root-' + name + '-template').html());
    }

    views.Main = Bb.View.extend({
        el: '#container',
        template: getTemplate('main'),
        initialize: function() {
            var me = this;
            me.render();
        },
        render: function() {
            var me = this;
            me.$html(me.template());
            return me;
        }
    })

})(root);