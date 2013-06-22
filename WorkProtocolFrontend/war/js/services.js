$(function (){
	var params, ajaxUrl, currServiceId, currServiceDefId, vendorTempl, filterByCategory;
	
	params = $.deparam.querystring();
	filterByCategory = params.hasOwnProperty('id');
	if (filterByCategory === true) {
		ajaxUrl = wp.cfg['REST_HOST']+'/resources/categories/' + params.id;
	} else {
		ajaxUrl = wp.cfg['REST_HOST']+'/resources/services/list';
	}
	$.ajax({
	  url: ajaxUrl,
	  cache: false,
	  dataType: "jsonp",
	  success: function (response){
		  var source, template, data, servicesHTML, container;
		  container = $('#view .services');
		  source = $('#TL_services').html();
		  template = Handlebars.compile(source);
		  data = {};

		  if (filterByCategory === true){
			  data.service = response.services;
		  } else {
			  data.service = response;
		  }
		  data['REST_HOST'] = wp.cfg['REST_HOST'];
		  servicesHTML = $(template(data));
 
		  /* container.append(servicesHTML);
		  container.masonry({
			    // options
			    itemSelector : '.service',
			    columnWidth : 242
			  }).each(function (){
				  $('#view .loading').hide();
			  });	*/
		  
		  servicesHTML.imagesLoaded(function (){
			  container.append(servicesHTML);
			  container.masonry({
			    // options
			    itemSelector : '.service',
			    columnWidth : 242
			  }).each(function (){
				  $('#view .loading').hide();
			  });
		  });
	  },
	  error: function (){
		  $('#view .loading').hide();
		  $('#view .services').html('<div class="alert alert-error">'
				  + '<button type="button" class="close" data-dismiss="alert">&times;</button>'
				  + 'Sorry, unable to load services'
				  + '</div>'
		  );
	  }
	});

	//appointment
	$('#view').on('click', '.wp-appoint', function(e){
		e.stopPropagation();

		window.location.href = '/bookappointment.html?serviceId='
				+ $(this).data('srvcid') + '&vendorId='
				+ $(this).data('vendorid') + '&duration='
				+ $(this).data('duration');
	});

	//service request
	$('#view').on('click', '.wp-quote', function(e){
		var source, template, data, html;

		e.preventDefault();
		source = $('#TL_requestSrvc').html();
		template = Handlebars.compile(source);
		data = {};
		data.name = $('.srvc-name', $(this).closest('.service')).text();
		$('#srForm').html(template(data));
		currServiceId = $(this).data('srvcid'); //store service in closure for easy modal access
		currServiceDefId = $(this).data('srvcdefid');
		$('#srForm').modal();
	});
	
	$('#srForm').on('shown', function (){
		//fetching service request form
		$('#srForm form').prop('action', wp.cfg['REST_HOST']+'/resources/servicerequests');
		if (currServiceDefId) {
			$("#srForm .serviceData input[name='serviceId']").val(currServiceId);
			$.ajax({
			  url: wp.cfg['REST_HOST']+'/resources/servicedefinitions/'+currServiceDefId,
			  cache: false,
			  dataType: "jsonp",
			  complete: function (){
				  $('#srForm .frm-ldg').hide();
			  },
			  success: function (response){
				  var template, data;
				  template = response.requestHtmlTemplate;
				  data = $.parseJSON(response.requestHtmlMetaData);

				  if (data && template) {
					  $('#srTemplate').html(Mustache.to_html(template, data));
				  } else {
					  $('#srTemplate').html('<div class="alert  alert-error">'
							  + 'Sorry, service request form unavailable'
							  + '</div>'
					  );
				  }
			  },
			  error: function (){
				  $('#srTemplate').html('<div class="alert alert-error">'
						  + '<button type="button" class="close" data-dismiss="alert">&times;</button>'
						  + 'Sorry, unable to load service request form'
						  + '</div>'
				  );
			  }
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
	});
});