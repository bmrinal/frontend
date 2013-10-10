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
				  if (userType === wp.constants.VENDORUSER || userType === wp.constants.VENDORADMIN){
					  $.ajax({
						  url: 'template/vendorprofile.handlebars',
						  dataType: 'html',
						  cache: false,
						  beforeSend: function (){
							  $('#wp-spinner').spin('custom');
						  },
						  success: function(resp) {
							  var urlTypes, urlObj, descTypes, descObj;

							  $('#profileForm').prop('method', 'GET').html(resp)
							  	.prop('action', wp.cfg['REST_HOST']+'/resources/user/insert')
							  	.show();

							  $('#profileForm input[name="name"]').val(response.name || '');
							  $('#profileForm input[name="email"]').val(response.email || '');
							  $('#profileForm input[name="mobilePhone"]').val(response.mobilePhone || '');

							  if ($.isArray(response.imageIds)) {
								$.each(response.imageIds, function (ind, v){
									var picpane = Mustache.to_html(pictempl, { src : wp.cfg['REST_HOST']+'/resources/images/'+v, imageId: v });
									$('#profileForm .sr-photo-row').append(picpane);
								});
							  }
							  if ($.isArray(response.urls)) {
								  urlTypes = {
										  'WEB': 'userUrlWeb',
										  'FACEBOOK': 'userUrlFacebook',
										  'LINKEDIN': 'userUrlLinkedIn'
								  }
								  for (var i=0; i<response.urls.length; i++) {
									  urlObj = response.urls[i];
									  $('#profileForm input[name=' +urlTypes[urlObj.urlType]+ ']').val(urlObj.urlLocation || '');
								  }
							  }

							  if ($.isArray(response.descriptions)) {
								  descTypes = {
										  'SHORT_DESCRIPTION': 'userDescription1',
										  'SPECIALIZATION': 'userDescription2',
										  'EDUCATION': 'userDescription3',
										  'PROFESSIONAL_EXPERIENCE': 'userDescription4',
										  'LANGUAGES': 'userDescription5',
										  'REGISTRATION': 'userDescription6',
										  'AWARDS_AND_RECOGNITIONS': 'userDescription7',
										  'MEMBERSHIPS': 'userDescription8'
								  }
								  for (var j=0; j<response.descriptions.length; j++) {
									  descObj = response.descriptions[j];
									  $('#profileForm textarea[name=' +descTypes[descObj.vendorDescriptionType]+ ']').val(descObj.description || '');
								  }
							  }

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
				  }, 'profile');

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