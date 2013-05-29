$(function (){
	var params, ajaxUrl, currServiceDefId, vendorTempl, filterByCategory;
	
	params = $.deparam.querystring();
	filterByCategory = params.hasOwnProperty('id');
	if (filterByCategory === true) {
		ajaxUrl = "http://work0protocol.appspot.com/resources/categories/" + params.id;
	} else {
		ajaxUrl = "http://work0protocol.appspot.com/resources/servicedefinitions/list";
	}
	$.ajax({
	  url: "http://work0protocol.appspot.com/resources/user",
	  dataType: 'json',
	  cache: false,
	  xhrFields: {
		  withCredentials: true
	  },
	  success: function (response){
		  var userName, email;
		  if(response && response.userId){
			email = response.email;
			userName = email.split('@');
			$('#user-info span').html(userName[0]);
			$('#user-info a').prop('href', response.signOutUrl + '?ru=' + window.location.protocol + '//' + window.location.host);
			$('#user-info').show();

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
						  data.serviceDefinition = response.serviceDefinitions;
					  } else {
						  data.serviceDefinition = response;
					  }
					  servicesHTML = $(template(data));
			 
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
							  + 'Sorry, unable to load service definitions'
							  + '</div>'
					  );
				  }
				});				
		  } else {
			  window.location.href = response.signInUrl + '?ru=' + window.location.href;
		  }
	  },
	  error: function (e){
		 $('#page-status').html('Sorry, unable to authenticate')
						.addClass('alert-error')
						.show();
		 $('.page-loading').hide();
	  }
	});

	$('#view').on('click', '.service', function(e){
		var source, template, data, html;

		e.preventDefault();
		source = $('#TL_requestSrvc').html();
		template = Handlebars.compile(source);
		data = {};
		data.name = $('.srvc-name', this).text();
		$('#srForm').html(template(data));
		currServiceDefId = $(this).data('srvcid'); //store service in closure for easy modal access
		$('#srForm').modal();
	});
	
	$('#srForm').on('shown', function (){
		if (currServiceDefId) {
			$("#srForm input[name='serviceDefinitionId']").val(currServiceDefId);
			$.ajax({
			  url: 'http://work0protocol.appspot.com/resources/servicedefinitions/'+currServiceDefId,
			  cache: false,
			  xhrFields: {
				  withCredentials: true
			  },
			  dataType: "json",
			  complete: function (){
				  $('#srForm .frm-ldg').hide();
			  },
			  success: function (response){
				  var template, data;
				  template = response.htmlTemplate;
				  data = $.parseJSON(response.htmlMetaData);

				  if (data && template) {
					  $('#srTemplate').html(Mustache.to_html(template, data));
				  } else {
					  $('#srTemplate').html('<div class="alert  alert-error">'
							  + 'Sorry, service definition form unavailable'
							  + '</div>'
					  );
				  }
			  },
			  error: function (){
				  $('#srTemplate').html('<div class="alert alert-error">'
						  + '<button type="button" class="close" data-dismiss="alert">&times;</button>'
						  + 'Sorry, unable to load service definition form'
						  + '</div>'
				  );
			  }
			});
		}
	});
	
	$('#view').on('click', '.modal-footer .btn-primary', function (){
		var form, params, action;
		action = $(this).data('action');
	
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
			  $('#page-status').html('Service ('+ response.id +') submitted').removeClass('hide');
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