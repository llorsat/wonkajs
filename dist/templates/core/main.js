window.main = function() {

  window.applicationCache.addEventListener('updateready', function(e) {
    console.log('cache ready');
    if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
      window.applicationCache.swapCache();
      window.location.reload();
    }
  }, false);

  Backbone.emulateJSON = true;
  
  Backbone.history.start();

};
