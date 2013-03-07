$(function (){
	var ajaxUrl, currServiceReqId, vendorId;
	
	ajaxUrl = $.deparam.querystring();
	
	if (ajaxUrl.hasOwnProperty('id')) {
		vendorId = ajaxUrl.id;
		ajaxUrl = "http://work0protocol.appspot.com/resources/vendors/" + ajaxUrl.id;
	} else {
		$('#view .srs').html('Missing vendor id in the request');
	}

	$.ajax({
	  url: ajaxUrl,
	  cache: false,
	  dataType: "jsonp",
	  complete: function (){
		  $('#view .loading').hide();
	  },
	  success: function (response){
		  var source, template;
		  source = $('#TL_srs').html();
		  template = Handlebars.compile(source);
		  $('#view .srs').html(template(response)); 
	  },
	  error: function (){
		  $('#view .srs').html('<div class="alert alert-error">'
				  + '<button type="button" class="close" data-dismiss="alert">&times;</button>'
				  + 'Sorry, unable to load service requests'
				  + '</div>'
		  );
	  }
	});
	
	$('#view').on('click', '.wp-sr', function(e){
		var source, template, data, html;

		e.preventDefault();
		currServiceReqId = $(this).data('srvcreqid'); //store service in closure for easy modal access

		source = $('#TL_srsModal').html();
		template = Handlebars.compile(source);
		data = {};
		data.name = $('a', this).text();
		data.id = currServiceReqId;
		data.vendorId = vendorId;
		$('#svcRespDialog').html(template(data));
		$('#svcRespDialog').modal();
	});

	$('#svcRespDialog').on('shown', function (){
		if (currServiceReqId) {
			$.ajax({
			  url: 'http://work0protocol.appspot.com/resources/servicerequests/'+currServiceReqId,
			  cache: false,
			  dataType: "jsonp",
			  complete: function (){
				  $('#svcRespDialog .frm-ldg').hide();
			  },
			  success: function (response){
				  var template, data;
				  template = response.htmlTemplate;
				  data = $.parseJSON(response.metaDataInstance);

				  if (data && template) {
					  $('#svcRespDialog .serviceForm').html(Mustache.to_html(template, data));
				  } else {
					  $('#svcRespDialog .serviceForm').html('<div class="alert  alert-error">'
							  + 'Sorry, service request details unavailable'
							  + '</div>'
					  );
				  }
			  },
			  error: function (){
				  $('#svcRespDialog .serviceForm').html('<div class="alert alert-error">'
						  + '<button type="button" class="close" data-dismiss="alert">&times;</button>'
						  + 'Sorry, unable to load service request form'
						  + '</div>'
				  );
			  }
			});
		}
	});

	$('#view').on('click', '.modal-footer .btn-primary', function (){
		var form, params, action;
		action = $(this).data('action');
		if (action === "next"){
			$('#svcRespDialog .serviceForm').hide();
			$('#svcRespDialog .responseForm').show();
			$(this).data('action', 'submit').html('Submit');
		} else if (action === "submit"){
			form = $('#svcRespDialog .responseForm');
			params = form.serialize();
			$.ajax({
			  url: form.attr('action'),
			  data: params,
			  dataType: "jsonp",
			  beforeSend: function (){
				  $('#svcRespDialog .modal-footer span').show();
			  },
			  complete: function (){
			  },
			  success: function (response){
				  $('#svcRespDialog').modal('hide');
				  $('#page-status').html('Service response ('+ response.id +') submitted').removeClass('hide');
			  },
			  error: function (){
				  $('#srForm .modal-body').prepend('<div class="alert alert-error">'
						  + '<button type="button" class="close" data-dismiss="alert">&times;</button>'
						  + 'Sorry, unable to create a service response'
						  + '</div>'
				  );
			  }
			});
		}
	});

});