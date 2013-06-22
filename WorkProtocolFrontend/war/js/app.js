var wp = wp || {};

$(function (){
	var restApiHost;
	wp.cfg = {}; //to store config data
	wp.user = {}; //to store user data

	if(window.location.hostname.match('myworkprotocol')){
		restApiHost = 'http://work1protocol.appspot.com';
	} else {
		restApiHost = 'http://work0protocol.appspot.com';
	}

	wp.cfg['REST_HOST'] = restApiHost;
	$.ajax({
		  url: wp.cfg['REST_HOST']+'/resources/user',
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
			  } else {
				  $('#wp-signup-banner').html('<div class="alert alert-info"><a href="'+ wp.cfg['REST_HOST'] +'/SignOut?ru='+ wp.cfg['REST_HOST'] +'/SignIn?isVendor=true">Sign up</a></div>');
			  }
		  }
	});
});