$(function (){
	var params;

	params = wp.util.qsToJSON();

	$.ajax({
		  url: wp.cfg['REST_HOST']+'/resources/user',
		  dataType: 'json',
		  cache: false,
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
						  $('#view .loading').hide();
					  },
					  success: function (response){
						  var template, data;
						  template = response.requestHtmlTemplate;
						  data = $.parseJSON(response.requestHtmlMetaData);

						  $('#view .rq-form').prop('action', wp.cfg['REST_HOST']+'/resources/servicerequests');
						  $('#view .rq-form input[name="serviceId"]').val(params.serviceId);

						  if (data && template) {
							  $('#srTemplate').html(Mustache.to_html(template, data));
							  
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
				wp.util.scrollToTop();
				$('#page-status').html('Service request ('+ response.id +') submitted')
					.addClass('alert-success')
					.removeClass('hide');
			},
			error: function (){
				$('#page-status').html('Sorry, unable to create service request')
					.addClass('alert-success')
					.removeClass('hide');
			}
		});
	});	
});
	
/*	$('#srForm').on('shown', function (){
		//fetching service request form
		$('#srForm form').prop('action', wp.cfg['REST_HOST']+'/resources/servicerequests');
		if (currServiceDefId) {
			$("#srForm .serviceData input[name='serviceId']").val(currServiceId);

			});
		}

		//fetching vendor details
		if (currServiceId) {
			$("#srForm .serviceData input[name='serviceId']").val(currServiceId);
			$.ajax({
			  url: wp.cfg['REST_HOST']+'/resources/services/'+currServiceId,
			  cache: false,
			  dataType: "jsonp",
			  success: function (response){
				  var data = {};

				  data.vendor = response.vendors;
				  data.currentVendorId = response.wpVendorId;
				  vendorTempl(data);
			  }
			});
		}
	});

	function vendorTempl(param){
		var source, template, data;

		source = $('#TL_vendors').html();
		template = Handlebars.compile(source);
		data = param;
		data['REST_HOST'] = wp.cfg['REST_HOST'];
		$('#srForm .vendors').html(template(data));
	}
	
	$('#view').on('click', '.modal-footer .btn-primary', function (){
		var form, params, action;
		action = $(this).data('action');
		if (action === "next"){
			$('#srTemplate').hide();
			$('#srForm .vendors-wrap').show();
			$(this).data('action', 'submit').html('Submit');
		} else if (action === "submit"){
			form = $('#srForm .modal-body form');
			params = form.serialize();
			$.ajax({
			  url: form.attr('action'),
			  data: params,
			  dataType: "jsonp",
			  beforeSend: function (){
				  $('#srForm .modal-footer span').show();
			  },
			  complete: function (){
			  },
			  success: function (response){
				  $('#srForm').modal('hide');
				  $('#page-status').html('Service request ('+ response.id +') submitted').removeClass('hide');
			  },
			  error: function (){
				  $('#srForm .modal-body').prepend('<div class="alert alert-error">'
						  + '<button type="button" class="close" data-dismiss="alert">&times;</button>'
						  + 'Sorry, unable to create a service request'
						  + '</div>'
				  );
			  }
			});
		}
	}); */