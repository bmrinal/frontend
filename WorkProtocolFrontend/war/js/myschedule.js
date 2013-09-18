$(function (){
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
					wp.mynav.load({
						targetSelector: '#top-nav',
						isVendor: response.isVendor 
					}, 'schedule');

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