(function(namespace) {

    var views = namespace.views;

    var getTemplate = function(name) {
        return hbs.compile($('#root-' + name + '-template').html());
    }

    views.Main = Bb.View.extend({
        template: getTemplate('main'),
        events: {
            'click .i18n': 'seti18n'
        },
        initialize: function() {
            var me = this;
            me.render();
        },
        render: function() {
            var me = this;
            me.$html(me.template());
            me.$('[data-lang="' + getLanguage() + '"]').addClass('active');
            return me;
        },
        seti18n: function(e) {
            var me = this;
            var target = me.$(e.currentTarget);
            setLanguage(target.data('lang'));
            location.reload(true);
        }
    })

})(root);