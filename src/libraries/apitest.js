(function() {
  
  var templateResult =    '<h2><p>{{ method }} {{ resource }}</p></h2>'
                        + '<hr>'
                        + '<h3>Relative duration</h3>'
                        + '<pre class="alert alert-info">{{ duration }}</pre>'
                        + '<h3>Params</h3>'
                        + '<pre>{{ params }}</pre>'
                        + '{{# if success }}'
                        + '<h3>Success</h3>'
                        + '<pre class="alert alert-success">{{ success }}</pre>'
                        + '{{/ if }}'
                        + '{{# if error }}'
                        + '<h3>Error</h3>'
                        + '<pre class="alert alert-error">{{ error }}</pre>'
                        + '{{/ if }}';

  var convert = function(ms) {
    if (ms > 1000) {
      return (ms/1000) + 's';
    } else {
      return ms + 'ms';
    }
  }

  var show = function(container, data) {
    var template = hbs.compile(templateResult);
    data.method = data.method.toUpperCase();
    data.params = JSON.stringify(data.params, null, 2);
    if (data.hasOwnProperty('success')) {
      data.success = JSON.stringify(data.success, null, 2);
    }
    if (data.hasOwnProperty('error')) {
      data.error = JSON.stringify(data.error, null, 2);
    }
    container.append(template(data));
  }

  window.tests = {
    resultContainer: null,
    evaluations: {},
    add: function(name, fn) {
      this.evaluations[name] = fn;
    },
    call: function(data, callback) {
      var me = this;
      switch(data.method) {
        case 'post':
          var timeStart = new Date().getTime();
          $.post(data.resource, data.params, function(response) {
            var duration = new Date().getTime() - timeStart;
            data.success = response;
            data.duration = convert(duration);
            show(me.resultContainer, data);
            if (callback) {
              callback(data);
            }
          }, 'json').error(function(response) {
            var duration = new Date().getTime() - timeStart;
            data.error = response;
            data.duration = convert(duration);
            show(me.resultContainer, data);
            if (callback) {
              callback(data);
            }
          });
          break;
        case 'get':
          var query = '?';
          for (var i in data.params) {
            query += i + '=' + data.params[i] + '&';
          }
          query = query.substring(0, query.length - 1);
          var url = data.resource + query;
          var timeStart = new Date().getTime();
          $.getJSON(url, function(response) {
            var duration = new Date().getTime() - timeStart;
            data.success = response;
            data.duration = convert(duration);
            show(me.resultContainer, data);
            if (callback) {
              callback(data);
            }
          }).error(function(response) {
            var duration = new Date().getTime() - timeStart;
            data.error = response;
            data.duration = convert(duration);
            show(me.resultContainer, data);
            if (callback) {
              callback(data);
            }
          });
          break;
        case 'put':
          data['_method'] = 'put';
          var timeStart = new Date().getTime();
          $.post(data.resource, data.params, function(response) {
            var duration = new Date().getTime() - timeStart;
            data.success = response;
            data.duration = convert(duration);
            show(me.resultContainer, data);
            if (callback) {
              callback(data);
            }
          }, 'post').error(function(response) {
            var duration = new Date().getTime() - timeStart;
            data.error = response;
            data.duration = convert(duration);
            show(me.resultContainer, data);
            if (callback) {
              callback(data);
            }
          });
          break;
        case 'delete':
          data['_method'] = 'delete';
          var timeStart = new Date().getTime();
          $.post(data.resource, data.params, function(response) {
            var duration = new Date().getTime() - timeStart;
            data.success = response;
            data.duration = convert(duration);
            show(me.resultContainer, data);
            if (callback) {
              callback(data);
            }
          }, 'post').error(function(response) {
            var duration = new Date().getTime() - timeStart;
            data.error = response;
            data.duration = convert(duration);
            show(me.resultContainer, data);
            if (callback) {
              callback(data);
            }
          });
          break;
      }
    },
    evaluate: function(container) {
      this.resultContainer = container;
      for(var i in this.evaluations) {
        this.evaluations[i]();
      }
    }
  }

})();