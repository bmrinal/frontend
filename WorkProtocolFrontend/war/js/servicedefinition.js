$(function (){
	var params, ajaxUrl, currServiceDefId, vendorTempl, filterByCategory, pictempl, picpane;
	
	params = $.deparam.querystring();
	filterByCategory = params.hasOwnProperty('id');
	if (filterByCategory === true) {
		ajaxUrl = wp.cfg['REST_HOST']+'/resources/categories/' + params.id;
	} else {
		ajaxUrl = wp.cfg['REST_HOST']+'/resources/servicedefinitions/list';
	}
	$.ajax({
	  url: wp.cfg['REST_HOST']+'/resources/user',
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
					  container = $('#view .services .span3');
					  source = $('#TL_services').html();
					  template = Handlebars.compile(source);
					  data = {};

					  if (filterByCategory === true){
						  data.serviceDefinition = response.serviceDefinitions;
					  } else {
						  data.serviceDefinition = response;
					  }
					  data['REST_HOST'] = wp.cfg['REST_HOST'];
					  servicesHTML = $('<div/>').html($(template(data)));
					  servicesHTML = servicesHTML.find('.service');

					  $.each(servicesHTML, function (ind, val){
						  $(container[ind % 4]).append(val);
					  });
					  
					  $('#view .loading').hide();
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
			  window.location.href = wp.cfg['REST_HOST']+'/SignIn?ru=' + window.location.href;
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
		$('#sr-form-fields').prop('action', wp.cfg['REST_HOST']+'/resources/services');
		if (currServiceDefId) {
			$("#srForm input[name='serviceDefinitionId']").val(currServiceDefId);
			$.ajax({
			  url: wp.cfg['REST_HOST']+'/resources/servicedefinitions/'+currServiceDefId,
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

				  //fetch location data
				  $.ajax({
					  url: wp.cfg['REST_HOST']+'/resources/vendors/myvendor',
					  dataType: 'json',
					  cache: false,
					  xhrFields: {
						  withCredentials: true
					  },
					  success: function (response){
						  var locationTmpl;

						  if (response && response.locations){
							  locationTmpl = Handlebars.compile($('#TL_location').html());
							  $('#srvc-location').html(locationTmpl({location: response.locations}));
						  }
					  }
				  });
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

	//cost fields
	$('#view').on('change', 'input[name="wpServicePaymentType"]', function (){
		var val, checked, fc, cph;

		val = $(this).val();
		checked = this.checked;

		fc = $('#wpFixedCost');
		cph = $('#wpCostPerHour');

		if (val === 'fixedcost'){
			$('#wpFixedCost').toggle(checked).prop('disabled', !checked).focus();
		} else if (val === 'timeandmaterials'){
			$('#wpCostPerHour').toggle(checked).prop('disabled', !checked).focus();
		}
	});

	//photos - set up
	$('#picupload').prop('action', wp.cfg['REST_HOST']+'/ImageUpload');
	$('#picupload input[name="ru"]').val('http://'+window.location.host+'/jsproxy.html');
	$('#view').on('click', '#sr-photo-trigger', function (){
		$('#file-inp').click();
	});

	//do upload
	$('#file-inp').on('change', function (e){
		$('#sr-photo-trigger').hide();
		$('#sr-photo-loading').show();
		$('#picupload').submit();
	});

	//after upload
	pictempl = $('#TL_pic').html();
	wp.jsproxy = {};
	wp.jsproxy.callback = function (data){
		var imageIds;

		$('#sr-photo-trigger').show();
		$('#sr-photo-loading').hide();

		if (data){
			imageIds = data['imageId'].split(",");

			$.each(imageIds, function (ind, v){
				picpane = Mustache.to_html(pictempl, { src : wp.cfg['REST_HOST']+'/resources/images/'+v, imageId: v });
				$('#sr-form-fields .sr-photo-row').append(picpane);
			});
		}
	};

	/* ########### XHR Upload ############ */

	/* $('#file-inp').on('change', function (e){
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

	    xhr.open("POST", wp.cfg['REST_HOST']+'/resources/images/upload', true);
	    xhr.send(fd);
	}; */
});