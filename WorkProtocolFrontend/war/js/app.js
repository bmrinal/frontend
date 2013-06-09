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
				  email = user.email;
				  userName = email.split('@');
				  user.userName = userName[0];
				  wp.user = user; //store user info for global access

				  $('#user-info span').html(user.userName);
				  $('#user-info a').prop('href', user.signOutUrl + '?ru=' + window.location.protocol + '//' + window.location.host);
				  $('#user-info').show();
			  }
		  }
	});
});