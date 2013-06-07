$(function (){
	$.ajax({
		  url: "http://work0protocol.appspot.com/resources/user",
		  dataType: 'json',
		  cache: false,
		  xhrFields: {
			  withCredentials: true
		  },
		  success: function (response){
			  var tnData = {};
			  if(response && response.userId){
				  if (response.isVendor){
					  tnData = [{
							  'text': 'My Business',
							  'href': '/mybusiness.html'
						  }, {
							  'text': 'Services',
							  'href': '/myservices.html'
						  }, {
							  'text': 'Schedule',
							  'href': '/myschedule.html'
						  }, {
							  'text': 'Clients',
							  'href': '#',
							  'active': true
						  }, {
							  'text': 'Settings',
							  'href': '/myprofile.html'
						  }];
				  } else {
					  tnData = [{
							  'text': 'My appointments',
							  'href': '#',
							  'active': true
						  }, {
							  'text': 'Schedule',
							  'href': '/myschedule.html'
						  }, {
							  'text': 'Settings',
							  'href': '/myprofile.html'
						  }];
				  }
				  wp.mynav.load({
					  targetSelector: '#top-nav',
					  data : {
						  tab : tnData
					  }
				  });
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