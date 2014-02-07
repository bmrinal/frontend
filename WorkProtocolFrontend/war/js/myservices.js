$(function (){
	var servicesArr, userType, locationsArr, pictempl;

	$.ajax({
	  url: wp.cfg['REST_HOST']+'/resources/user',
	  dataType: 'json',
	  cache: false,
	  beforeSend: function () {
		  $('#wp-spinner').spin('custom');
	  },
	  xhrFields: {
		  withCredentials: true
	  },
	  success: function (response){
		  if(response && response.userId){
			  userType = wp.util.getUserType(response);

			  if (userType === wp.constants.USER){
				  $('#page-status').html('Sorry, please register as a vendor to view this page.').addClass('alert-error').show();
				  return;
			  }

			  if (userType === wp.constants.VENDORADMIN){
				  $('.srvc-add').show();
			  }
			  wp.mynav.load({
				'targetSelector': '#top-nav',
				'userType': userType 
			  }, 'services');

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
				+ $(this).data('srvcid') + '&vendorUserId='
				+ $(this).data('vendoruserid') + '&duration='
				+ $(this).data('duration');
	});
	
	//edit service
	$('body').on('click', '.wp-edit', function(e){
		var template, data, ind, htmlTmpl, htmlMetaData, locationId, editLocationArr, locationTmpl;

		e.stopPropagation();
		wp.overlay.open();
		ind = parseInt($(this).data('ind'), 10);
		template = Handlebars.compile($('#TL_requestSrvc').html());
		data = {};
		data.service = servicesArr[ind];

		data['REST_HOST'] = wp.cfg['REST_HOST'];
		wp.overlay.setContent(template(data));

		$('#sr-form-fields').prop('action', wp.cfg['REST_HOST']+'/resources/services');
		//$("#sr-form-fields input[name='serviceDefinitionId']").val(data.service.id);

		htmlTmpl = data.service.htmlTemplate;
		htmlMetaData = $.parseJSON(data.service.metaDataInstance);

		if (htmlTmpl && htmlMetaData) {
			$('#srTemplate').html(Mustache.to_html(htmlTmpl, htmlMetaData));

			//show selected photos
			$.each(data.service.wpImageIds, function (ind, v){
				var picpane = Mustache.to_html(pictempl, { src : wp.cfg['REST_HOST']+'/resources/images/'+v, imageId: v });
				$('#sr-form-fields .sr-photo-row').append(picpane);
			});

			//show selected location
			locationId = data.service.wpLocationId || '';
			if (locationId){
				editLocationArr = [];
				$.each(locationsArr, function (i, v){
					var val;
					val = locationsArr[i];
					if (locationId === val.id){
						val.selected = true;
					}
					editLocationArr.push(locationsArr[i]);
				});

				locationTmpl = Handlebars.compile($('#TL_location').html());
				$('#srvc-location').html(locationTmpl({location: editLocationArr}));
			}
		} else {
			$('#srTemplate').html('<div class="alert  alert-error">'
			  + 'Sorry, service instance details form unavailable'
			  + '</div>'
			);
		}
	});
	
	//fetch location data
	$.ajax({
		url: wp.cfg['REST_HOST']+'/resources/vendors/myvendor',
		dataType: 'json',
		cache: false,
		xhrFields: {
			withCredentials: true
		},
		success: function (response){
			locationsArr = response.locations || [];
		}
	});
	
	//cost fields
	$('body').on('change', 'input[name="wpServicePaymentType"]', function (){
		var val, checked, fc, cph;
	
		val = $(this).val();
		checked = this.checked;
	
		fc = $('#wpFixedCost');
		cph = $('#wpCostPerHour');
	
		if (val === 'fixedcost'){
			$('#wpFixedCost').toggle(checked).prop('disabled', !checked).focus();
		} else if (val === 'timeandmaterials'){
			$('#wpCostPerHour').toggle(checked).prop('disabled', !checked).focus();
		}
	});

	//photos - set up
	$('#wp-main').append('<iframe id="picframe" name="picframe"></iframe>');
	$('#picupload').prop('action', wp.cfg['REST_HOST']+'/ImageUpload');
	$('#picupload input[name="ru"]').val('http://'+window.location.host+'/jsproxy.html');

	//trigger file browse
	$('body').on('click', '#sr-photo-trigger', function (){
		$('#file-inp').click();
	});

	//do upload
	$('#file-inp').on('change', function (e){
		$('#sr-photo-trigger').hide();
		$('#sr-photo-loading').show();
		$('#picupload').submit();
	});

	//after upload
	pictempl = $('#TL_pic').html();
	wp.jsproxy = {};
	wp.jsproxy.callback = function (data){
		var imageIds;

		$('#sr-photo-trigger').show();
		$('#sr-photo-loading').hide();

		if (data){
			imageIds = data['imageId'].split(",");

			$.each(imageIds, function (ind, v){
				var picpane = Mustache.to_html(pictempl, { src : wp.cfg['REST_HOST']+'/resources/images/'+v, imageId: v });
				$('#sr-form-fields .sr-photo-row').append(picpane);
			});
		}
	};
	
	$('body').on('click', '#sr-form-close', function (){
		wp.overlay.close();
	});
});