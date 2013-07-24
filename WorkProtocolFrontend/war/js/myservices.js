$(function (){
	var servicesArr;

	$.ajax({
	  url: wp.cfg['REST_HOST']+'/resources/user',
	  dataType: 'json',
	  cache: false,
	  beforeSend: function () {
		  $('#wp-spinner').spin({color:'#B94A48', lines: 12});
	  },
	  xhrFields: {
		  withCredentials: true
	  },
	  success: function (response){
		  if(response && response.userId){
			  if (!response.isVendor){
				  $('#page-status').html('Sorry, please register as a vendor to view this page.').addClass('alert-error').show();
				  return;
			  }
			  wp.mynav.load({
				  targetSelector: '#top-nav',
				  data :{tab: [{
						  'text': 'My Business',
						  'href': '/mybusiness.html'
					  }, {
						  'text': 'Services',
						  'href': '#',
						  'active': true
					  }, {
						  'text': 'Schedule',
						  'href': '/myschedule.html'
					  }, {
						  'text': 'Clients',
						  'href': '/myclients.html'
					  }, {
						  'text': 'Settings',
						  'href': '/myprofile.html'
					  }]
				  },
			 });
			$.ajax({
				  url: wp.cfg['REST_HOST']+'/resources/services/myservices/',
				  cache: false,
				  dataType: "json",
				  complete: function () {
					  $('#wp-spinner').spin(false);
				  },
				  xhrFields: {
					  withCredentials: true
				  },
				  success: function (response){
						var source, template, data, servicesHTML, container;

						container = $('#view .services-box');
						source = $('#TL_services').html();
						template = Handlebars.compile(source);
						data = {};
						
						data.service = response;
						servicesArr = response;

						data['REST_HOST'] = wp.cfg['REST_HOST'];
						servicesHTML = $('<div/>').html($(template(data).trim()));
						servicesHTML = servicesHTML.find('.service');

						if (servicesHTML && servicesHTML.length > 0){
							var temp = $('<div class="row-fluid"/>');
							$.each(servicesHTML, function (ind, val){
								//$(container).append(val);
								temp.append(val);
								if ((ind +1) % 3 === 0 || ((ind+1) === servicesHTML.length)) { //every 3rd (or) last set of elements
									$(container).append(temp); //add to main container
									temp = $('<div class="row-fluid"/>');
								}
							});
						} else {
							$('#no-services').show();
						}

						$('#view .services-box .flexslider').flexslider({
							animation: 'slide',
							slideshow: false
						});
				  },
				  error: function (){
					  $('#view .services-box').html('<div class="alert alert-error">'
							  + '<button type="button" class="close" data-dismiss="alert">&times;</button>'
							  + 'Sorry, unable to load categories'
							  + '</div>'
					  );
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

	//service details view
	$('#view').on('click', ".service", function(e){
		var template, data, ind;

		if ($(e.target).is('a, button')) {
			return;
		}

		wp.overlay.open();
		ind = parseInt($(this).data('ind'), 10);
		template = Handlebars.compile($('#TL_service-details').html());
		data = {};
		
		data['REST_HOST'] = wp.cfg['REST_HOST'];
		data.service = servicesArr[ind];
		wp.overlay.setContent(template(data));

		$('#carousel').flexslider({
		    animation: "slide",
		    controlNav: false,
		    animationLoop: false,
		    slideshow: false,
		    itemWidth: 100,
		    itemMargin: 5,
		    asNavFor: '#slider'
		  });
		   
		  $('#slider').flexslider({
		    animation: "slide",
		    controlNav: false,
		    animationLoop: false,
		    slideshow: false,
		    sync: "#carousel"
		  });
	});

	//appointment
	$('body').on('click', '.wp-appoint', function(e){
		e.stopPropagation();

		window.location.href = '/bookappointment.html?serviceId='
				+ $(this).data('srvcid') + '&vendorId='
				+ $(this).data('vendorid') + '&duration='
				+ $(this).data('duration');
	});
	
});