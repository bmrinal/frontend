$(function (){
	var params, steps, currentStep;

	params = wp.util.qsToJSON();
	steps = [$('#srTemplate'), $('#srVendors'), $('#srReview')];

	currentStep = 0;
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
				  $.ajax({
					  url: wp.cfg['REST_HOST']+'/resources/servicedefinitions/' + params.srvcDefId,
					  cache: false,
					  dataType: "jsonp",
					  complete: function (){
						  $('#wp-spinner').spin(false);
					  },
					  success: function (response){
						  var template, data, temp;
						  template = response.requestHtmlTemplate;
						  data = $.parseJSON(response.requestHtmlMetaData);

						  $('#view .rq-form').prop('action', wp.cfg['REST_HOST']+'/resources/servicerequests');
						  $('#view .rq-form input[name="serviceId"]').val(params.serviceId);

						  if (data && template) {
							  $('#srTemplate').html($('#TL_services').html());
							  $('#srTemplate .wp-details').html(Mustache.to_html(template, data));

							  $.ajax({
								  url: wp.cfg['REST_HOST']+'/resources/services/' + params.serviceId,
								  cache: false,
								  dataType: "jsonp",
								  success: function (response){
									  var source, template, data = {};

									  data.vendor = response.vendors;
									  data.currentVendorId = response.wpVendorId;
									  data['REST_HOST'] = wp.cfg['REST_HOST'];

									  $('#view .srvc-name').html(response.wpName || '');
									  source = $('#TL_vendors').html();
									  template = Handlebars.compile(source);
									  
									  $('#srVendors').html(template(data));

									  //service info at the top
									  $('#view .wp-srvc-info .wp-srvc-info-h span').html(response.wpName);
									  wp.util.templateLoader({'templateUrl': 'template/serviceinfo.handlebars',
											  'data': response,
											  'targetSelector': '#view .wp-srvc-info .wp-srvc-info-b'
									  });
									  $('#view .wp-srvc-info').show();								  
								  }
								});							  
						  } else {
							  $('#page-status').html('<div class="alert  alert-error">'
									  + 'Sorry, service request form unavailable'
									  + '</div>'
							  ).addClass('alert-error');
						  }
					  },
					  error: function (){
						  $('#page-status').html('<div class="alert alert-error">'
								  + '<button type="button" class="close" data-dismiss="alert">&times;</button>'
								  + 'Sorry, unable to load service request form'
								  + '</div>'
						  ).addClass('alert-error');
					  }
				  });

				  $('#view .wp-srvc-info-h').on('click', function (e){
					  e.preventDefault();
					  $('#view .wp-srvc-info-b').toggle();
				  });
			  }else {
				  wp.util.redirectToSigin();
			  }
		  },
		  error: function (e){
			  $('#page-status').html('Sorry, unable to authenticate')
				  .addClass('alert-error')
				  .show();
		  }
	});

	$('#view').on('click', '.wp-cancel', function (e){
		window.location.href = '/services.html';
	});

	$('#view').on('click', '.wp-back, .wp-next', function (e){
		var nextStep;

		nextStep = parseInt($(this).data('step'), 10);

		steps[currentStep].hide();
		steps[nextStep].show();
		
		currentStep = nextStep;
	});

	$('#view .rq-form').submit(function (e){
		var formParams;

		e.preventDefault();

		formParams = $(this).serialize();
		$.ajax({
			url: $(this).attr('action'),
			data: formParams,
			dataType: "jsonp",
			beforeSend: function (){
				$('#view .submitting').show();
			},
			complete: function (){
				$('#view .submitting').hide();
			},
			success: function (response){
				/* wp.util.scrollToTop();
				$('#page-status').html('Service request ('+ response.id +') submitted')
					.addClass('alert-success')
					.removeClass('hide'); */
				window.location.href = '/services.html?rdcode=rq.yes';
			},
			error: function (){
				$('#page-status').html('Sorry, unable to create service request')
					.addClass('alert-success')
					.removeClass('hide');
			}
		});
	});	
});