$(function (){
	$.ajax({
		  url: wp.cfg['REST_HOST']+'/resources/user',
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
							  'text': 'My requests',
							  'href': '/mybusiness.html'
						  },{
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
					  data : {tab : tnData}
				  });
				  $.ajax({
					  url: wp.cfg['REST_HOST']+'/resources/appointment/myappointments',
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
				  wp.util.redirectToSigin();
			  }
		  },
		  error: function (e){
			 $('#page-status').html('Sorry, unable to authenticate')
							.addClass('alert-error')
							.show();
			 $('.page-loading').hide();
		  }
	});
});