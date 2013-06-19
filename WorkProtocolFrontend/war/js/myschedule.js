$(function (){
	$.ajax({
		  url: wp.cfg['REST_HOST']+'/resources/user',
		  dataType: 'json',
		  cache: false,
		  xhrFields: {
			  withCredentials: true
		  },
		  complete: function (){
			  $('.page-loading').hide();  
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
							  'href': '#',
							  'active': true
						  }, {
							  'text': 'Clients',
							  'href': '/myclients.html'
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
							  'href': '/myclients.html'
						  }, {
							  'text': 'Schedule',
							  'href': '#',
							  'active': true
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
				  $('#myCal').prop('src', 'http://www.google.com/calendar/embed?mode=WEEK&showTitle=0&src=' + response.email + '&ctz=America/Los_Angeles');
			  } else {
				  window.location.href = wp.cfg['REST_HOST']+'/SignIn?ru=' + window.location.href;
			  }
		  },
		  error: function (e){
			 $('#page-status').html('Sorry, unable to authenticate')
							.addClass('alert-error')
							.show();
		  }
	});
});