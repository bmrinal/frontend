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
				  
				  $.ajax({
					  url: "http://work0protocol.appspot.com/resources/appointment/myappointments",
					  dataType: 'json',
					  cache: false,
					  xhrFields: {
						  withCredentials: true
					  },
					  complete: function (){
						  $('.page-loading').hide();
					  },
					  success: function (response){
						  var template, data;
						  data = {};
						  data.appointment = response;
						  template = Handlebars.compile($("#TL_appointments").html());
					
						  $('#appointments tbody').html(template(data));
						  $('#appointments').show();
					  },
					  error: function (e){
						 $('#page-status').html('Sorry, unable to access your profile.')
										.addClass('alert-error')
										.show();
					  }
				});
			  } else {
				  window.location.href = response.signInUrl + '?ru=' + window.location.href;
			  }
		  },
		  error: function (e){
			 $('#page-status').html('Sorry, unable to authenticate')
							.addClass('alert-error')
							.show();
			 $('.page-loading').hide();
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
				 var statusMsg;

				 if ($('#profileForm input[name="vendorId"]').length > 0){
					 statusMsg = 'Profile updated successfully';					 
				 } else {
					 statusMsg = 'Profile created successfully';
					 $('#profileForm').append('<input name="vendorId" type="hidden" value="' +response.id+ '">');
				 }
				 $('#page-status').html(statusMsg)
					 .addClass('alert-success')
					 .show();
			  },
			  error: function (){
				 $('#page-status').html('Sorry, unable to process your request at this time')
	 							.addClass('alert-error')
	 							.show();
			  }
		});
	});
});