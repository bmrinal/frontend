var wpGlobal = {};

$(function (){
	$.ajax({
		  url: "http://work0protocol.appspot.com/resources/user",
		  dataType: 'json',
		  cache: false,
		  xhrFields: {
			  withCredentials: true
		  },
		  success: function (response){
			  var userName, email;
			  if(response && response.userId){
				  email = response.email;
				  userName = email.split('@');
				  $('#user-info span').html(userName[0]);
				  $('#user-info a').prop('href', response.signOutUrl + '?ru=' + window.location.protocol + '//' + window.location.host);
				  $('#user-info').show();
				  
				  wpGlobal.user = {};
				  wpGlobal.user.id = response.userId;
				  wpGlobal.user.email = response.email;
				  wpGlobal.user.name = response.nickname;
			  }
		  }
	});
});