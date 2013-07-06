(function(namespace) {

  var models = namespace.models;
  var collections = namespace.collections;
  var views = namespace.views;

  var getTemplate = function(name) {
    return hbs.compile($('#root-' + name + '-template').html());
  }

  views.Main = Bb.View.extend({
    template: getTemplate('main'),
    events: {
      'click #install-button': 'onInstall',
      'click #close-installation-bar-button': 'onCloseInstallationBar'
    },
    initialize: function() {
      var me = this;
      me.render();
    },
    render: function() {
      var me = this;
      checkInstallation(function(install) {
        me.$el.html(me.template({
          'install': true
        }));
      });
      return me;
    },
    onInstall: function() {
      var me = this;
      var manifest = App.pkg.homepage + '/manifest.webapp';
      var instalation = navigator.mozApps.install(manifest);
      instalation.onerror = function(e) {
        alert('ERROR: ' + instalation.error.name);
        me.$('#fxos-install-bar').remove();
      }
      instalation.onsuccess = function(e) {
        alert(__('Instalation completed'));
        me.$('#fxos-install-bar').remove();
      }
    },
    onCloseInstallationBar: function(e) {
      var me = this;
      me.$('#fxos-install-bar').remove();
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  });

})(root);