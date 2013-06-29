(function(namespace) {

  var models = namespace.models;
  var collections = namespace.collections;
  var views = namespace.views;

  var getTemplate = function(name) {
    return hbs.compile($('#demos-apiconsole-' + name + '-template').html());
  }

  views.Main = Bb.View.extend({
    template: getTemplate('main'),
    events: {
      'submit': 'onLoadEndpoint'
    },
    initialize: function() {
      var me = this;
      me.render();
    },
    render: function() {
      var me = this;
      me.$el.html(me.template({
        'base_url': App.pkg.settings.api,
        'endpoints': App.pkg.settings.endpoints
      }));
      me.$('textarea').html('{\n\toauth_token: "M1XM3JENZII0WPIZ2IIGS1O5JCATVDIUZXZHPD0GZMVFQOEG",\n\tv: "20130202",\n\tll: "40.7,-74"\n}')
      me.editor = CodeMirror.fromTextArea(me.$('textarea')[0], {
        matchBrackets: true,
        styleActiveLine: true,
        smartIndent: false,
        tabSize: 2,
        mode: "javascript",
        json: true,
        autoCloseBrackets: true,
        placeholder: 'Params here as JSON...'
      });
      return me;
    },
    onLoadEndpoint: function(e) {
      e.stopPropagation();
      e.preventDefault();
      var me = this;
      me.$('button[type="submit"]').text('Loading...');
      me.$('#results').html('');
      var form = formToJSON(me.$('form'));
      form.params = me.editor.getValue().replace(/\n/gi, '').replace(/ /gi, '');
      console.log(form);
      try {
        form.params = form.params == '' ? {} : eval('(' + form.params + ')');
      } catch(e) {
        alert(__('There is an syntax error, please check you json object.'));
        return false;
      }
      window.tests.evaluations = {};
      var endpoint = uri(form.endpoint) + (form.id != '' ? ('/' + form.id) : '');
      window.tests.add(form.verb + '-' + form.endpoint, function() {
        var data = {
          method: form.verb,
          resource: endpoint,
          params: form.params
        };
        window.tests.call(data, function() {
          me.$('button[type="submit"]').text('Make request');
        });
      });
      window.tests.evaluate(me.$('#results'));
    }
  });

})(demos.apiconsole);