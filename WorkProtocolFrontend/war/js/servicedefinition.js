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
		  if(response && response.userId){
			  if (!response.isVendor){
				  $('#page-status').html('Sorry, please register as a vendor to view this page.').addClass('alert-error').show();
				  $('#view .loading').hide();
				  return;
			  }
			  wp.mynav.load({
				  targetSelector: '#top-nav',
				  data :{tab: [{
						  'text': 'My Business',
						  'href': '/mybusiness.html'
					  }, {
						  'text': 'Services',
						  'href': '#',
						  'active': true
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
			  window.location.href = 'http://work0protocol.appspot.com/SignIn?ru=' + window.location.href;
		  }
	  },
	  error: function (e){
		 $('#page-status').html('Sorry, unable to authenticate')
						.addClass('alert-error')
						.show();
		 $('#view .loading').hide();
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
		$('#sr-form-fields').hide();
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
			  beforeSend: function (){
				  $('#srForm .frm-ldg').show();
			  },
			  complete: function (){
				  $('#srForm .frm-ldg').hide();
			  },
			  success: function (response){
				  var template, data;
				  template = response.htmlTemplate;
				  data = $.parseJSON(response.htmlMetaData);

				  $('#srMetaFields input[name="wpName"]').val(response.name + ' by ' + wp.user.userName);
				  if (data && template) {
					  $('#srTemplate').html(Mustache.to_html(template, data));
				  } else {
					  $('#srTemplate').html('<div class="alert  alert-error">'
							  + 'Sorry, service definition form unavailable'
							  + '</div>'
					  );
				  }
				  $('#sr-form-fields').show();
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
	
	//photos
	$('#view').on('click', '#sr-photo-trigger', function (){
		$('#file-inp').click();
	});
	$('#file-inp').on('change', function (e){
		var template, picpane, files, i;

		files = this.files;
		template = $('#TL_pic').html();
		
		for (i = 0; i < files.length; i++) {
			picpane = Mustache.to_html(template, { name : files[i].name });
			$('#sr-form-fields .sr-photo-row').append(picpane);
			uploadAnImage(i, files[i]);
		}
	});
	
	var uploadAnImage = function (ind, file){
		var xhr, fd, upload, loader;

		fd = new FormData();
		fd.append("images", file, file.name);

		xhr = new XMLHttpRequest();
        upload = xhr.upload;
        loader = $('#sr-form-fields .sr-photo-row .sr-photo-col:eq(' + ind + ')').find('.sr-photo-prog');

        upload.addEventListener("progress", function (ev) {
	        if (ev.lengthComputable) {
	        	loader.css('width', (ev.loaded / ev.total) * 100 + "%");
	        }
	    }, false);

        upload.addEventListener("load", function (ev) {
        	console.log('upload finished...'+xhr.responseText);
        	loader.css('background-color', '#00FF00');
	    }, false);

        upload.addEventListener("error", function (ev) {
        	console.log('upload failed...');
        	loader.css({'width': '100%',
        		'background-color': '#FF0000'
        	});
        }, false);

	    xhr.open("POST", "http://work0protocol.appspot.com/resources/images/upload", true);
	    xhr.send(fd);
	}
});