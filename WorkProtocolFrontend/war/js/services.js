$(function (){
	var ajaxUrl, currServiceId;
	
	ajaxUrl = $.deparam.querystring();
	
	if (ajaxUrl.hasOwnProperty('id')) {
		ajaxUrl = "http://work0protocol.appspot.com/resources/categories/" + ajaxUrl.id;
	} else {
		ajaxUrl = "http://work0protocol.appspot.com/resources/services/list";
	}
	$.ajax({
	  url: ajaxUrl,
	  cache: false,
	  dataType: "jsonp",
	  complete: function (){
		  $('#view .loading').hide();
	  },
	  success: function (response){
		  var template, data;
		  template = $('#TL_services').html();
		  data = {};
		  data.service = response.services || response.service || [];
		  $('#view .services').html(Mustache.to_html(template, data));
	  },
	  error: function (){
		  $('#view .services').html('<div class="alert alert-error">'
				  + '<button type="button" class="close" data-dismiss="alert">&times;</button>'
				  + 'Sorry, unable to load services'
				  + '</div>'
		  );
	  }
	});

	$('#view').on('click', '.service', function(e){
		var template, data, html;

		e.preventDefault();
		template = $('#TL_requestSrvc').html();
		data = {};
		data.name = $('a', this).text();
		$('#srForm').html(Mustache.to_html(template, data));
		$('#srForm').modal();

		currServiceId = $(this).data('srvcid'); //store service in closure for easy modal access
	});
	
	$('#srForm').on('shown', function (){
		if (currServiceId) {
			$.ajax({
			  url: 'http://work0protocol.appspot.com/resources/services/'+currServiceId,
			  cache: false,
			  dataType: "jsonp",
			  complete: function (){
				  $('#srForm .frm-ldg').hide();
			  },
			  success: function (response){
				  var template, data;
				  template = response.htmlTemplate;
				  data = $.parseJSON(response.htmlMetaData);

				  if (data && template) {
					  $('#srForm form').html(Mustache.to_html(template, data));
				  } else {
					  $('#srForm form').html('<div class="alert  alert-error">'
							  + 'Sorry, service form unavailable'
							  + '</div>'
					  );
				  }
			  },
			  error: function (){
				  $('#srForm form').html('<div class="alert alert-error">'
						  + '<button type="button" class="close" data-dismiss="alert">&times;</button>'
						  + 'Sorry, unable to load service request form'
						  + '</div>'
				  );
			  }
			});
		}
	});
	
	$('#view').on('click', '.modal-footer .btn-primary', function (){
		var form, params;
		
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
	});
});