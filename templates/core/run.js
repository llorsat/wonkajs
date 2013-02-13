/* 
 * Development live runner
 * This script runs as main file for requirejs when page load.
 * Since here we run the init function on app, that build the require array of files to
 * import with require
 */

(function() {

  function init(libraries, applications, scripts, callback) {

    var components = ['init', 'models', 'collections', 'views', 'router'];
    var requirements = [];

    //loading libraries
    for (var i = 0; i < libraries.length; i++) {
      requirements.push('order!../libraries/' + libraries[i]);
    }

    //loading apps with components
    for (var i = 0; i < components.length; i++) {
      for (var j = 0; j < applications.length; j++) {
        requirements.push('order!../' + applications[j] + '/' + components[i]);
      }
    }

    //loading scripts
    for (var i = 0; i < scripts.length; i++) {
      requirements.push('order!../main/' + scripts[i]);
    }
    
    require(requirements, callback);
    
  };

  var xhr = null;
  var activexmodes = ["Msxml2.XMLHTTP", "Microsoft.XMLHTTP"];
  if (window.ActiveXObject) {
    for (var i=0; i < activexmodes.length; i++) {
      try {
        xhr = new ActiveXObject(activexmodes[i]);
      } catch(e) {}
    }
  } else {
    xhr = new XMLHttpRequest();
  }
  xhr.open('GET', 'package.json', false);
  xhr.send(null);
  
  var packageJSON = JSON.parse(xhr.responseText);

  var libraries = packageJSON.settings.environment.libraries;

  var applications = packageJSON.settings.environment.applications;

  function getURI(application) {
    var l = window.location;
    var protocol = l.protocol;
    var uri = protocol + '//' + l.host + l.pathname.replace('index.html', '') + application + '/templates/';
    return uri;
  }

  var body = $('body');
  var promisesLevelOne = [];
  var promisesLevelTwo = [];
  applications.forEach(function(application) {
    var uri = getURI(application);
    promisesLevelOne.push($.get(uri, function(r) {
      var html = $(r);
      html.find('a').each(function(index, item) {
        var href = $(item).attr('href');
        if ( /templates\/.{1,}\.html/.test(href) ) {
            promisesLevelTwo.push($.get(href, function(res) {
                body.append(res);
            }));
        }
      });
      html.find('li').each(function(index, item) {
        var href = $(item).text();
        if ( /.{1,}\.html/.test(href) ) {
          promisesLevelTwo.push($.get(uri + href, function(res) {
              body.append(res);
          }, 'html'));
        }
      });
    }));
  });

  var scripts = packageJSON.settings.environment.main_files;

  $.when.apply($, promisesLevelOne).done(function() {
    $.when.apply($, promisesLevelTwo).done(function() {
      init(libraries, applications, scripts, function() {
        window.main();
      });
    });
  });

})();
