$(function (){
	var currServiceResId, currServiceDefId, respElement, isVendor;
	isVendor = false;

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
				wp.mynav.load({
					targetSelector: '#top-nav',
					isVendor: response.isVendor 
				}, 'business');

				$.ajax({
					  url: wp.cfg['REST_HOST']+'/resources/servicerequests/myrequests',
					  cache: false,
					  xhrFields: {
						  withCredentials: true
					  },
					  dataType: "json",
					  complete: function (){
						  $('#wp-spinner').spin(false);
					  },
					  success: function (response){
						  var data, template;
						  data = {};
						  
						  data.serviceRequests = response;
						  data['isVendor'] = isVendor;
						  template = Handlebars.compile($("#TL_srs").html());

						  $('#view .srs').html(template(data));
					  },
					  error: function (){
						  $('#view .srs').html('<div class="alert alert-error">'
							  + '<button type="button" class="close" data-dismiss="alert">&times;</button>'
							  + 'Sorry, unable to fetch your service requests.'
							  + '</div>'
						  );
					  }	
				});
			  } else {
				  wp.util.redirectToSigin();
			  }
		  },
		  error: function (){
			 $('#page-status').html('Sorry, unable to authenticate')
							.addClass('alert-error')
							.show();
		  }
	});

	//service request
	$('#view').on('click', '.srv-req', function(e){
		var currServiceReqId, source, template, data;

		e.preventDefault();
		currServiceReqId = $(this).data('srvcreqid'); //store service in closure for easy modal access

		if (currServiceReqId) {
			source = $('#TL_sreqtOly').html();
			template = Handlebars.compile(source);
			data = {};
			data.id = currServiceReqId;
	
			wp.overlay.setContent(template(data));
			wp.overlay.open();
	
			$.ajax({
			  url: wp.cfg['REST_HOST']+'/resources/servicerequests/'+currServiceReqId,
			  cache: false,
			  dataType: "jsonp",
			  complete: function (){
				  $('#oly-container .frm-ldg').hide();
			  },
			  success: function (response){
				  var template, data;
				  template = response.htmlTemplate;
				  data = $.parseJSON(response.metaDataInstance);
	
				  if (data && template) {
					  $('#oly-container .serviceForm').html(Mustache.to_html(template, data));
				  } else {
					  $('#oly-container .serviceForm').html('<div class="alert  alert-error">'
							  + 'Sorry, service request details unavailable'
							  + '</div>'
					  );
				  }
			  },
			  error: function (){
				  $('#oly-container .serviceForm').html('<div class="alert alert-error">'
						  + '<button type="button" class="close" data-dismiss="alert">&times;</button>'
						  + 'Sorry, unable to load service request form'
						  + '</div>'
				  );
			  }
			});
		}
	});

	$('body').on('click', '.srs-cancel', function(e){
		wp.overlay.close();
	});

	//service response read only
	$('#view').on('click', '.srvc-respro', function(e){
		var currServiceResId, source, template, data;

		e.preventDefault();
		currServiceResId = $(this).data('srvcresid');

		if (currServiceResId) {
			source = $('#TL_srespROOly').html();
			template = Handlebars.compile(source);
			data = {};
			data.id = currServiceResId;
	
			wp.overlay.setContent(template(data));
			wp.overlay.open();

			$.ajax({
			  url: wp.cfg['REST_HOST']+'/resources/serviceresponses/'+currServiceResId,
			  cache: false,
			  dataType: "jsonp",
			  complete: function (){
				  $('#oly-container .frm-ldg').hide();
			  },
			  success: function (response){
				  var template, data;
				  template = Handlebars.compile($('#TL_srespROFields').html());
				  data = response;

				  if (data && template) {
					  $('#oly-container .srvcResponseROForm').html(template(data));
				  } else {
					  $('#oly-container .srvcResponseROForm').html('<div class="alert alert-error">'
							  + 'Sorry, service response details unavailable'
							  + '</div>'
					  );
				  }
			  },
			  error: function (){
				  $('#oly-container .srvcResponseROForm').html('<div class="alert alert-error">'
						  + '<button type="button" class="close" data-dismiss="alert">&times;</button>'
						  + 'Sorry, unable to load service response form'
						  + '</div>'
				  );
			  }
			});
		}
	});

	//service response
	$('#view').on('click', '.srvc-resp', function(e){
		var source, template, data;

		e.preventDefault();
		currServiceDefId = $(this).data('srvcdefid');

		if (currServiceDefId) {
			source = $('#TL_srespOly').html();
			template = Handlebars.compile(source);
			data = {};
			data.id = $(this).data('srvcreqid');

			wp.overlay.setContent(template(data));
			wp.overlay.open();

			$.ajax({
			  url: wp.cfg['REST_HOST']+'/resources/servicedefinitions/'+currServiceDefId,
			  cache: false,
			  dataType: "jsonp",
			  complete: function (){
				  $('#oly-container .frm-ldg').hide();
			  },
			  success: function (response){
				  var template, data;
				  template = response.responseHtmlTemplate;
				  data = $.parseJSON(response.responseHtmlMetaData);
	
				  if (data && template) {
					  $('#oly-container .srvcResponseForm').html($("#TL_srespForm").html() + Mustache.to_html(template, data));
				  } else {
					  $('#oly-container .srvcResponseForm').html('<div class="alert  alert-error">'
							  + 'Sorry, service response form unavailable'
							  + '</div>'
					  );
				  }
			  },
			  error: function (){
				  $('#oly-container .srvcResponseForm').html('<div class="alert alert-error">'
						  + '<button type="button" class="close" data-dismiss="alert">&times;</button>'
						  + 'Sorry, unable to load service response form'
						  + '</div>'
				  );
			  }
			});
	
			respElement = $(this);
		}
	});

	$('body').on('submit', '.responseForm', function (e){
		var form, params, action;

		e.preventDefault();
		form = $('#oly-container .responseForm');
		params = form.serialize();
		$.ajax({
		  url: wp.cfg['REST_HOST']+'/resources/serviceresponses',
		  data: params,
		  dataType: "jsonp",
		  beforeSend: function (){
			  $('#oly-container .srs-oly-close span').show();
		  },
		  success: function (response){
			  wp.overlay.close();
			  respElement.html('Response Sent')
			  	.removeClass('srvc-resp btn-success')
			  	.addClass('btn-info')
			  	.addClass('srvc-respro')
			  	.data('srvcresid', response.id);
			  //$('#page-status').html('Service response ('+ response.id +') submitted').removeClass('hide');
		  },
		  error: function (){
			  $('#oly-container .srvcResponseForm').prepend('<div class="alert alert-error">'
					  + '<button type="button" class="close" data-dismiss="alert">&times;</button>'
					  + 'Sorry, unable to create a service response'
					  + '</div>'
			  );
		  }
		});
	});
});