$(function (){
	var profileId, userType;

	$.ajax({
		  url: wp.cfg['REST_HOST']+'/resources/user',
		  dataType: 'json',
		  cache: false,
		  xhrFields: {
			  withCredentials: true
		  },
		  beforeSend: function (){
			  $('#wp-spinner').spin('custom');
		  },
		  complete: function (){
			  $('#wp-spinner').spin(false);
		  },
		  success: function (response){
			  if(response && response.userId){
				  userType = wp.util.getUserType(response);

				  if (userType === wp.constants.USER){
					  $('#page-status').html('Sorry, please register as a vendor to view this page.').addClass('alert-error').show();
					  return;
				  }

				  wp.mynav.load({
					'targetSelector': '#top-nav',
					'userType': userType
				  }, 'specialists');

				  $('#addspecialist').prop('method', 'GET')
				  	.prop('action', wp.cfg['REST_HOST']+'/resources/user/upsertVendorUser')
				  	.show();
			  } else {
				  wp.util.redirectToSigin();
			  }
		  },
		  error: function (e){
			 $('#page-status').html('Sorry, unable to authenticate')
							.addClass('alert-error')
							.show();
			 $('#wp-spinner').spin(false);
		  }
	});

	$('#addspecialist').submit(function (e){
		e.preventDefault();
		$.ajax({
			  url: $(this).prop('action'),
			  cache: false,
			  type: $(this).prop('method'),
			  data: $(this).serialize(),
			  dataType: 'json',
			  xhrFields: {
				  withCredentials: true
			  },
			  beforeSend: function (){
				  $('#addspecialist .btn-success').attr('disabled', true);
				  $('#page-status').removeClass('alert-success')
	 							.removeClass('alert-error')
	 							.hide();
			  },
			  complete: function (){
				  $('#addspecialist .btn-success').removeAttr('disabled');
			  },
			  success: function (response){
				 var statusMsg;

				 $('html').scrollTop(0);
				 $('#page-status').html('Request sent to specialist')
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