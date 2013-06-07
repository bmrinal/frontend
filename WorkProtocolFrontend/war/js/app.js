var wp = wp || {};

$(function (){
	$.ajax({
		  url: "http://work0protocol.appspot.com/resources/user",
		  dataType: 'json',
		  cache: false,
		  xhrFields: {
			  withCredentials: true
		  },
		  success: function (response){
			  var userName, email, user;
			  if(response && response.userId){
				  user = {};
				  $.extend(user, response);
				  wp.user = user;

				  email = user.email;
				  userName = email.split('@');
				  $('#user-info span').html(userName[0]);
				  $('#user-info a').prop('href', user.signOutUrl + '?ru=' + window.location.protocol + '//' + window.location.host);
				  $('#user-info').show();

				  wp.user = {};
				  
			  }
		  }
	});
});