$(function (){
	var profileId, userType;

	$.ajax({
		  url: wp.cfg['REST_HOST']+'/resources/user',
		  dataType: 'json',
		  cache: false,
		  xhrFields: {
			  withCredentials: true
		  },
		  success: function (response){
			  if(response && response.userId){
				  userType = wp.util.getUserType(response);
				  if (userType === wp.constants.VENDORADMIN){
					  $.ajax({
						  url: wp.cfg['REST_HOST']+'/resources/vendors/myvendor',
						  dataType: 'json',
						  cache: false,
						  xhrFields: {
							  withCredentials: true
						  },
						  beforeSend: function (){
							  $('#wp-spinner').spin('custom');
						  },
						  success: function (response){
							  var urlTypes, urlObj, descTypes, descObj;
							  profileId = 'vendorId';
							  //load vendor profile template
							  $.ajax({
								  url: 'template/vendorprofile.handlebars',
								  dataType: 'html',
								  cache: false,
								  success: function(resp) {
									  $('#profileForm').prop('method', 'POST').html(resp)
									  	.prop('action', wp.cfg['REST_HOST']+'/resources/vendors/')
									  	.show();
									  if (response.id) {
										  $('#profileForm').append('<input name="'+profileId+'" type="hidden" value="' +response.id+ '">');
									  }
									  $('#profileForm input[name="vendorName"]').val(response.name || '');
									  $('#profileForm input[name="vendorPhone"]').val(response.phone || '');
									  $('#profileForm input[name="vendorMobilePhone"]').val(response.mobilePhone || '');
									  
									  if ($.isArray(response.imageIds)) {
										$.each(response.imageIds, function (ind, v){
											var picpane = Mustache.to_html(pictempl, { src : wp.cfg['REST_HOST']+'/resources/images/'+v, imageId: v });
											$('#profileForm .sr-photo-row').append(picpane);
										});
									  }
									  
									  if ($.isArray(response.locations)) {
										  $('#profileForm input[name="vendorLocationStreet1"]').val(response.locations[0].streetAddress1 || '');
										  $('#profileForm input[name="vendorLocationStreet2"]').val(response.locations[0].streetAddress2 || '');
										  $('#profileForm input[name="vendorLocationCity"]').val(response.locations[0].city || '');
										  $('#profileForm input[name="vendorLocationState"]').val(response.locations[0].stateOrProvince || '');
										  $('#profileForm input[name="vendorLocationZip"]').val(response.locations[0].zipCode || '');
										  $('#profileForm input[name="vendorLocationPhone"]').val(response.locations[0].phone || '');
									  }
									  
									  $('#profileForm input[name="vendorNumberOfEmployees"]').val(response.numberOfEmployees || '');
									  
									  if ($.isArray(response.contacts)) {
										  $('#profileForm input[name="vendorContactEmail"]').val(response.contacts[0].email || '');
										  $('#profileForm input[name="vendorContactPhone"]').val(response.contacts[0].mobilePhone || '');
										  $('#profileForm input[name="vendorContactText"]').val(response.contacts[0].textPhone || '');
									  }
									  
									  if ($.isArray(response.urls)) {
										  urlTypes = {
												  'WEB': 'vendorUrlWeb',
												  'FACEBOOK': 'vendorUrlFacebook',
												  'TWITTER': 'vendorUrlTwitter',
												  'LINKEDIN': 'vendorUrlLinkedIn'
										  }
										  for (var i=0; i<response.urls.length; i++) {
											  urlObj = response.urls[i];
											  $('#profileForm input[name=' +urlTypes[urlObj.urlType]+ ']').val(urlObj.urlLocation || '');
										  }
									  }
									  
									  if ($.isArray(response.descriptions)) {
										  descTypes = {
												  'BASIC': 'vendorDescription1',
												  'PASSION': 'vendorDescription2',
												  'DIFFERENTIATOR': 'vendorDescription3',
												  'TRAINING': 'vendorDescription4'
										  }
										  for (var j=0; j<response.descriptions.length; j++) {
											  descObj = response.descriptions[j];
											  $('#profileForm textarea[name=' +descTypes[descObj.vendorDescriptionType]+ ']').val(descObj.description || '');
										  }
									  }
									  
									  $('#wp-spinner').spin(false);
								  }
							  });
						  },
						  error: function (e){
							  $('#page-status').html('Sorry, unable to access your profile.')
											  .addClass('alert-error')
											  .show();
							  $('#wp-spinner').spin(false);
						  }
					  });
				  } else if (userType === wp.constants.VENDORUSER){
					  $.ajax({
						  url: 'template/vendoruserprofile.handlebars',
						  dataType: 'html',
						  cache: false,
						  beforeSend: function (){
							  $('#wp-spinner').spin('custom');
						  },
						  success: function(resp) {
							  $('#profileForm').prop('method', 'GET').html(resp)
							  	.prop('action', wp.cfg['REST_HOST']+'/resources/user/upsertVendorUser')
							  	.show();
							  $('#profileForm input[name="email"]').val(response.email || '');
							  $('#profileForm input[name="mobilePhone"]').val(response.mobilePhone || '');

							  $('#wp-spinner').spin(false);
						  }
					  });
				  } else {
					  //profileId = 'userId';
					  $.ajax({
						  url: 'template/userprofile.handlebars',
						  dataType: 'html',
						  cache: false,
						  beforeSend: function (){
							  $('#wp-spinner').spin('custom');
						  },
						  success: function(resp) {
							  $('#profileForm').prop('method', 'GET').html(resp)
							  	.prop('action', wp.cfg['REST_HOST']+'/resources/user/insert')
							  	.show();
							  /* if (response.id) {
								  $('#profileForm').append('<input name="'+profileId+'" type="hidden" value="' +response.userId+ '">');
							  } */
							  $('#profileForm input[name="email"]').val(response.email || '');
							  $('#profileForm input[name="mobilePhone"]').val(response.mobilePhone || '');
							  
							  $('#wp-spinner').spin(false);
						  }
					  });
				  }
				  
				  wp.mynav.load({
					'targetSelector': '#top-nav',
					'userType': userType
				  }, 'settings');

			  } else {
				  wp.util.redirectToSigin();
			  }
		  },
		  error: function (e){
			 $('#page-status').html('Sorry, unable to authenticate')
							.addClass('alert-error')
							.show();
			 $('#wp-spinner').spin(false);
		  }
	});

	//photos - set up
	$('#wp-main').append('<iframe id="picframe" name="picframe"></iframe>');
	$('#picupload').prop('action', wp.cfg['REST_HOST']+'/ImageUpload');
	$('#picupload input[name="ru"]').val('http://'+window.location.host+'/jsproxy.html');
	$('body').on('click', '#sr-photo-trigger', function (){
		$('#file-inp').click();
	});

	//do upload
	$('#file-inp').on('change', function (e){
		$('#sr-photo-trigger').hide();
		$('#sr-photo-loading').show();
		$('#picupload').submit();
	});

	//after upload
	var pictempl = $('#TL_pic').html();
	wp.jsproxy = {};
	wp.jsproxy.callback = function (data){
		var imageIds;

		$('#sr-photo-trigger').show();
		$('#sr-photo-loading').hide();

		if (data){
			imageIds = data['imageId'].split(",");

			$.each(imageIds, function (ind, v){
				var picpane = Mustache.to_html(pictempl, { src : wp.cfg['REST_HOST']+'/resources/images/'+v, imageId: v });
				$('#profileForm .sr-photo-row').append(picpane);
			});
		}
	};
	
	$('#profileForm').submit(function (e){
		e.preventDefault();
		$.ajax({
			  url: $(this).prop('action'),
			  cache: false,
			  type: $(this).prop('method'),
			  data: $(this).serialize(),
			  dataType: 'json',
			  xhrFields: {
				  withCredentials: true
			  },
			  beforeSend: function (){
				  $('#profileForm .btn-success').attr('disabled', true);
				  $('#page-status').removeClass('alert-success')
	 							.removeClass('alert-error')
	 							.hide();
			  },
			  complete: function (){
				  $('#profileForm .btn-success').removeAttr('disabled');
			  },
			  success: function (response){
				 var statusMsg;

				 /* if ($('#profileForm input[name="'+profileId+'"]').length > 0){
					 statusMsg = 'Profile updated successfully';					 
				 } else {
					 statusMsg = 'Profile created successfully';
					 $('#profileForm').append('<input name="'+profileId+'" type="hidden" value="' +response.id+ '">');
				 } */
				 $('html').scrollTop(0);
				 $('#page-status').html('Profile updated successfully')
					 .addClass('alert-success')
					 .show();
			  },
			  error: function (){
				 $('#page-status').html('Sorry, unable to process your request at this time')
	 							.addClass('alert-error')
	 							.show();
			  }
		});
	});
});