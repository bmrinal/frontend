$(function (){
	var currServiceReqId, vendorId;
	
	$.ajax({
		  url: "http://work0protocol.appspot.com/resources/user",
		  dataType: 'json',
		  cache: false,
		  xhrFields: {
			  withCredentials: true
		  },
		  success: function (response){
			  if(response && response.userId){
				    if (!response.isVendor){
				    	$('#page-status').html('Sorry, please register as a vendor to view this page.').addClass('alert-error').show();
				    	$('#view .loading').hide();
				    	return;
				    }
					$.ajax({
					  url: 'http://work0protocol.appspot.com/resources/vendors/myvendor/',
					  cache: false,
					  xhrFields: {
						  withCredentials: true
					  },
					  dataType: "json",
					  success: function (response){
						  if(response && response.id && response.id > 0){
							  wp.mynav.load({
								  targetSelector: '#top-nav',
								  data :{tab: [{
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
									  }]
								  },
							  });
							  vendorId = response.id;							  
							  $.ajax({
								  url: "http://work0protocol.appspot.com/resources/vendors/" + vendorId,
								  cache: false,
								  dataType: "json",
								  complete: function (){
									  $('#view .loading').hide();
								  },
								  success: function (response){
									  var source, template, i, createdDate;
									  source = $('#TL_srs').html();
									  template = Handlebars.compile(source);
									  response.serviceRequests = response.serviceRequests || [];
									  for (i=0; i<response.serviceRequests.length; i++){
										  createdDate = response.serviceRequests[i].createdDate;
										  response.serviceRequests[i].createdDate = $.format.date(new Date(createdDate).toString(), "dd-MMM-yyyy hh:mm:ss");
									  }
									  
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
							} else {
								  $('#view .loading').hide();
								  $('#view .srs').html('<div class="alert alert-error">'
									  + '<button type="button" class="close" data-dismiss="alert">&times;</button>'
									  + 'Sorry, you do not have a vendor profile. Please <a href="/vendorprofile.html">create your profile</a>.'
									  + '</div>'
								  );
							}
					  },
					  error: function (){
						  $('#view .loading').hide();
						  $('#view .srs').html('<div class="alert alert-error">'
							  + '<button type="button" class="close" data-dismiss="alert">&times;</button>'
							  + 'Sorry, unable to fetch your vendor profile.'
							  + '</div>'
						  );
					  }	
					});				  
			  } else {
				  window.location.href = 'http://work0protocol.appspot.com/SignIn?ru=' + window.location.href;
			  }
		  },
		  error: function (){
			 $('#page-status').html('Sorry, unable to authenticate')
							.addClass('alert-error')
							.show();
			 $('#view .loading').hide();
		  }
	});

	$('#view').on('click', 'tbody tr', function(e){
		var source, template, data;

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