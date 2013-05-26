$(function (){
	$.ajax({
		  url: "http://work0protocol.appspot.com/resources/user",
		  dataType: 'json',
		  cache: false,
		  xhrFields: {
			  withCredentials: true
		  },
		  complete: function (){
			  $('.page-loading').hide();  
		  },
		  success: function (response){
			  if(response && response.userId){
				  $('#user-info span').html(response.nickname);
				  $('#user-info a').prop('href', response.signOutUrl + '?ru=' + window.location.protocol + '//' + window.location.host);
				  $('#user-info').show();
				  $('#view').show();
				  
				  $('#myCal').prop('src', 'http://www.google.com/calendar/embed?showTitle=0&src=' + response.email + '&ctz=America/Los_Angeles');
			  } else {
				  window.location.href = response.signInUrl + '?ru=' + window.location.href;
			  }
		  },
		  error: function (e){
			 $('#page-status').html('Sorry, unable to authenticate')
							.addClass('alert-error')
							.show();
		  }
	});
});