/*jslint nomen: true */
/*global define, navigator, location, window, chrome */
/*https://raw.github.com/alcacoop/gaia-chrono-app/master/www/js/lib/install.js*/
(function() {

  var dispatcher = $({}),
      prop;

  //Create event functions based on dispatcher object

  function createDispatchFn(id) {
    return function() {
      return dispatcher[id].apply(dispatcher, arguments);
    };
  }

  /**
   * Detects if the current app has been installed.
   *
   * See https://github.com/wavysandbox/install/blob/master/README.md
   * for details on how to use.
   *
   */
  App.install = function() {
    var fn = install[install.type + 'Install'];
    if (fn) {
      fn();
    } else {
      install.trigger('error', 'unsupported install: ' + install.type);
    }
  }

  function triggerChange(state) {
    install.state = state;
    install.trigger('change', install.state);
  }

  /**
   *  The install state. Values are:
   *  'unknown': the code has not tried to detect any state.
   *
   * @type {String}
   */

  var install = window.install = {};

  install.state = 'unknown';

  install.check = function() {
    var apps = navigator.mozApps,
      request;

    if (navigator.mozApps) {
      //Mozilla web apps
      install.type = 'mozilla';
      request = navigator.mozApps.checkInstalled(install.mozillaInstallUrl);
      request.onsuccess = function() {
        if (this.result) {
          triggerChange('installed');
        } else {
          triggerChange('uninstalled');
        }
      };

      request.onerror = function(err) {
        // Just console log it, no need to bother the user.
        install.error = err;
        triggerChange('error');
      };

    } else if (typeof chrome !== 'undefined' &&
      chrome.webstore &&
      chrome.app) {
      //Chrome web apps
      install.type = 'chrome';
      if (chrome.app.isInstalled) {
        triggerChange('installed');
      } else {
        triggerChange('uninstalled');
      }
    } else if (typeof window.navigator.standalone !== 'undefined') {
      install.type = 'ios';
      if (window.navigator.standalone) {
        triggerChange('installed');
      } else {
        triggerChange('uninstalled');
      }
    } else {
      install.type = 'unsupported';
      triggerChange('unsupported');
    }
  };

  /* Mozilla/Firefox installation */
  var base = location.href.split("#")[0]; // WORKAROUND: remove hash from url
  base = base.replace("index.html", ""); // WORKAROUND: remove index.html
  install.mozillaInstallUrl = base + 'manifest.webapp';

  install.mozillaInstall = function() {
    var installRequest = navigator.mozApps.install(install.mozillaInstallUrl);

    installRequest.onsuccess = function(data) {
      triggerChange('installed');
    };

    installRequest.onerror = function(err) {
      install.error = err;
      triggerChange('error');
    };
  };

  /* Chrome installation */
  install.chromeInstallUrl = null;
  install.chromeInstall = function() {
    chrome.webstore.install(install.chromeInstallUrl, function() {
      triggerChange('installed');
    }, function(err) {
      install.error = err;
      triggerChange('error');
    });
  };

  /* iOS installation */
  //Right now, just asks that something show a UI
  //element mentioning how to install using the Safari
  //"Add to Home Screen" button.
  install.iosInstall = function() {
    install.trigger('showiOSInstall', navigator.platform.toLowerCase());
  };

  //Allow install to do events.
  install.on = createDispatchFn('on');
  install.off = createDispatchFn('off');
  install.trigger = createDispatchFn('trigger');


  //Start up the checks
  install.check();

  var updateIndex = function() {
    if (install.state == 'uninstalled') {
      $('#install-bar').show();
    } else if (install.state == 'installed' || install.state == 'unsupported') {
      $('#install-bar').hide();
    }
  }

  $('#install-button').on('click', function() {
    App.install();
  });

  window.install.on('change', updateIndex);

})();