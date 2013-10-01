$(function (){
	$.ajax({
		  url: wp.cfg['REST_HOST']+'/resources/user',
		  dataType: 'json',
		  cache: false,
		  beforeSend: function (){
			  $('#wp-spinner').spin('custom');
		  },
		  xhrFields: {
			  withCredentials: true
		  },
		  success: function (response){
			  if(response && response.userId){
				  var userType = wp.util.getUserType(response);

				  wp.mynav.load({
						'targetSelector': '#top-nav',
						'userType': userType 
				  }, 'clients');
				  $.ajax({
					  url: wp.cfg['REST_HOST']+'/resources/appointment/myappointments',
					  dataType: 'json',
					  cache: false,
					  xhrFields: {
						  withCredentials: true
					  },
					  complete: function (){
						  $('#wp-spinner').spin(false);
					  },
					  success: function (response){
						  var hTemplate, hData, bTemplate, bData;

						  hData = {};
						  hData.isVendor = response.length > 0 && response[0].isVendor;
						  hTemplate = Handlebars.compile($("#TL_appointmentHeader").html());
						  $('#appointments thead').html(hTemplate(hData));

						  bData = {};
						  bData.appointment = response;
						  bTemplate = Handlebars.compile($("#TL_appointments").html());
						  $('#appointments tbody').html(bTemplate(bData));
						  
						  $('#appointments').show();
					  },
					  error: function (e){
						 $('#page-status').html('Sorry, unable to access your profile.')
										.addClass('alert-error')
										.show();
					  }
				});
			  } else {
				  wp.util.redirectToSigin();
			  }
		  },
		  error: function (e){
			 $('#page-status').html('Sorry, unable to authenticate')
							.addClass('alert-error')
							.show();
		  }
	});
});