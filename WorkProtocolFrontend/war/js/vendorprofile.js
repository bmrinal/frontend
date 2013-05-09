$(function (){
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