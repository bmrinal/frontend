$(function (){

	$.ajax({
		  url: "http://work0protocol.appspot.com/resources/user",
		  dataType: 'json',
		  xhrFields: {
			  withCredentials: true
		  },
		  cache: false,
		  complete: function (){
			  $('.page-loading').hide();
		  },
		  success: function (response){
			  if(response && response.userId){
				  console.log(response.nickname);
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
			  params: $(this).serialize(),
			  dataType: 'json',
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