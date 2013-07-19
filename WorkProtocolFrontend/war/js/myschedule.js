$(function (){
	$.ajax({
		  url: wp.cfg['REST_HOST']+'/resources/user',
		  dataType: 'json',
		  cache: false,
		  xhrFields: {
			  withCredentials: true
		  },
		  beforeSend: function (){
			  $('#wp-spinner').spin({color:'#B94A48', lines: 12});
		  },
		  complete: function (){
			  $('#wp-spinner').spin(false);
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

				  $('#myCal').append($('<iframe/>', {
					  'frameborder': '0',
					  'scrolling': 'no',
					  'src': 'http://www.google.com/calendar/embed?mode=WEEK&showTitle=0&src=' + response.email + '&ctz=America/Los_Angeles'
				  	})
				  );
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