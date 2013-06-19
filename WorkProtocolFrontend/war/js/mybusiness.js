$(function (){
	var currServiceReqId, respElement, isVendor;
	isVendor = false;

	$.ajax({
		  url: wp.cfg['REST_HOST']+'/resources/user',
		  dataType: 'json',
		  cache: false,
		  xhrFields: {
			  withCredentials: true
		  },
		  success: function (response){
			  var tnData = {};
			  if(response && response.userId){
				if (response.isVendor){
					  isVendor = true;
					  tnData = [{
							  'text': 'My Business',
							  'href': '#',
							  'active': true  
						  }, {
							  'text': 'Services',
							  'href': '/myservices.html'
						  }, {
							  'text': 'Schedule',
							  'href': '/myschedule.html'
						  }, {
							  'text': 'Clients',
							  'href': '/myclients.html'
						  }, {
							  'text': 'Settings',
							  'href': '/myprofile.html'
						  }];
				  } else {
					  tnData = [{
							  'text': 'My requests',
							  'href': '#',
							  'active': true
						  },{
							  'text': 'My appointments',
							  'href': '/myclients.html'
						  }, {
							  'text': 'Schedule',
							  'href': '/myschedule.html'
						  }, {
							  'text': 'Settings',
							  'href': '/myprofile.html'
						  }];
				  }
				wp.mynav.load({
				  targetSelector: '#top-nav',
				  data :{tab: tnData}
				});
				    
				$.ajax({
					  url: wp.cfg['REST_HOST']+'/resources/servicerequests/myrequests',
					  cache: false,
					  xhrFields: {
						  withCredentials: true
					  },
					  dataType: "json",
					  complete: function (){
						  $('#view .loading').hide();
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
				  window.location.href = wp.cfg['REST_HOST']+'/SignIn?ru=' + window.location.href;
			  }
		  },
		  error: function (){
			 $('#page-status').html('Sorry, unable to authenticate')
							.addClass('alert-error')
							.show();
			 $('#view .loading').hide();
		  }
	});

	//service request
	$('#view').on('click', '.srv-req', function(e){
		var source, template, data;

		e.preventDefault();
		currServiceReqId = $(this).data('srvcreqid'); //store service in closure for easy modal access

		source = $('#TL_sreqtModal').html();
		template = Handlebars.compile(source);
		data = {};
		data.id = currServiceReqId;
		$('#svcReqtDialog').html(template(data));
		$('#svcReqtDialog').modal();
	});

	$('#svcReqtDialog').on('shown', function (){
		if (currServiceReqId) {
			$.ajax({
			  url: wp.cfg['REST_HOST']+'/resources/servicerequests/'+currServiceReqId,
			  cache: false,
			  dataType: "jsonp",
			  complete: function (){
				  $('#svcReqtDialog .frm-ldg').hide();
			  },
			  success: function (response){
				  var template, data;
				  template = response.htmlTemplate;
				  data = $.parseJSON(response.metaDataInstance);

				  if (data && template) {
					  $('#svcReqtDialog .serviceForm').html(Mustache.to_html(template, data));
				  } else {
					  $('#svcReqtDialog .serviceForm').html('<div class="alert  alert-error">'
							  + 'Sorry, service request details unavailable'
							  + '</div>'
					  );
				  }
			  },
			  error: function (){
				  $('#svcReqtDialog .serviceForm').html('<div class="alert alert-error">'
						  + '<button type="button" class="close" data-dismiss="alert">&times;</button>'
						  + 'Sorry, unable to load service request form'
						  + '</div>'
				  );
			  }
			});
		}
	});

	//service response read only
	$('#view').on('click', '.srvc-respro', function(e){
		var source, template, data;

		e.preventDefault();
		source = $('#TL_srespRO').html();
		template = Handlebars.compile(source);
		data = {};
		data.id = $(this).data('srvcreqid');
		data.amount = $(this).data('amount');
		data.comments = $(this).data('comments');
		$('#svcRespDialogRO').html(template(data));
		$('#svcRespDialogRO').modal();
	});

	//service response
	$('#view').on('click', '.srvc-resp', function(e){
		var source, template, data;

		e.preventDefault();
		source = $('#TL_srespModal').html();
		template = Handlebars.compile(source);
		data = {};
		data.id = $(this).data('srvcreqid');
		$('#svcRespDialog').html(template(data));
		$('#svcRespDialog').modal();

		respElement = $(this);
	});

	$('#view').on('click', '.modal-footer .sr-resp', function (){
		var form, params, action;
		form = $('#svcRespDialog .responseForm');
		params = form.serialize();
		$.ajax({
		  url: wp.cfg['REST_HOST']+'/resources/serviceresponses',
		  data: params,
		  dataType: "jsonp",
		  beforeSend: function (){
			  $('#svcRespDialog .modal-footer span').show();
		  },
		  success: function (response){
			  $('#svcRespDialog').modal('hide');
			  respElement.removeClass('srvc-resp btn-warning').addClass('btn-success').html('Responded');
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
	});
});