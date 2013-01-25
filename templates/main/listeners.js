$(document).ajaxError(function(e, out) {
  App.message({
    title: out.statusText,
    message: out.responseText
  });
});
