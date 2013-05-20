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

	$('#profileForm').submit(function (e){
		e.preventDefault();
		$.ajax({
			  url: "http://work0protocol.appspot.com/resources/vendors/",
			  cache: false,
			  type: 'POST',
			  data: $(this).serialize(),
			  dataType: 'json',
			  xhrFields: {
				  withCredentials: true
			  },
			  beforeSend: function (){
				  $('#profileForm .btn-primary').attr('disabled', true);
				  $('#page-status').removeClass('alert-success')
	 							.removeClass('alert-error')
	 							.hide();
			  },
			  complete: function (){
				  $('#profileForm .btn-primary').removeAttr('disabled');
			  },
			  success: function (response){
				 $('#page-status').html('Profile('+response.id +') created successfully')
				 				.addClass('alert-success')
				 				.show();
			  },
			  error: function (){
				 $('#page-status').html('Sorry, unable to create profile')
	 							.addClass('alert-error')
	 							.show();
			  }
		});
	});
});