jQuery.basicAuth = (function($) {

    methodLogin = function(url, user,password) {
      
      var result = {};
      var url = url;
      var string = user+':'+password;
      var auth = "Basic "+$.base64.encode(string);
      $.ajax({
	url:url,
	async:false,
	type: 'GET',//method: 'GET',
	beforeSend: function(req) {
	  req.setRequestHeader('Authorization',auth);
	},
	error: function(req, text, error) {
	  result = {};
	},
	success: function(response) {
	  localStorage.basicAuth = auth.replace('Basic ','');
	  result = {'response':response,'status':true};
	}
      });
      return result;
   };
   
   methodLogout = function() {
     if(localStorage.removeItem("basicAuth")){
       localStorage.removeItem("basicAuth");
     }
     alert("Logout coming soon");
  };
   
  methodHaveSession = function() {
    var response = {};
    if (localStorage.basicAuth) {
      response = {'code':localStorage.basicAuth};
    }
    return response;
  }
  
  return {
    login: methodLogin,
    logout: methodLogout,
    haveSession: methodHaveSession
  }

}(jQuery));