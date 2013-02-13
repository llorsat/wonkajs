(function() {
  
  $(document).ajaxError(function(e, response) {
    alert(response.statusText + ' : ' + response.responseText);
  });

})();