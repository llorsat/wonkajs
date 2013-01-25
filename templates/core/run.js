user = null;

(function() {

  var xhr = new XMLHttpRequest();
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
      App.init(libraries, applications, scripts, function() {
        window.main();
      });
    });
  });

})();
