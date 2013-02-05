jQuery.basicAuth = (function($) {

    methodLogin = function(url, code){
      
      var result = false;
      var url = url;
      var auth = "Basic "+code;
      $.ajax({
	url:url,
	type: 'GET',//method: 'GET',
	beforeSend: function(req) {
	  req.setRequestHeader('Authorization',auth);
	},
	error: function(req, text, error) {
	  result = false;
	},
	success: function(response){
	  result = true;
	}
      });
      return result;
   };
   
   methodLogout = function(){
     alert("Logout coming soon");
  };
   
  return {
    login: methodLogin,
    logout: methodLogout
  }

}(jQuery));