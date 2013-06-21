$(function (){
	var profileId;
	$.ajax({
		  url: wp.cfg['REST_HOST']+'/resources/user',
		  dataType: 'json',
		  cache: false,
		  xhrFields: {
			  withCredentials: true
		  },
		  success: function (response){
			  if(response && response.userId){
				  if (response.isVendor){
					  tnData = [{
							  'text': 'My Business',
							  'href': '/mybusiness.html'
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
							  'href': '#',
							  'active': true
						  }];
					  $.ajax({
						  url: wp.cfg['REST_HOST']+'/resources/vendors/myvendor',
						  dataType: 'json',
						  cache: false,
						  xhrFields: {
							  withCredentials: true
						  },
						  complete: function (){
							  $('.page-loading').hide();
						  },
						  success: function (response){
							  var urlTypes, urlObj, descTypes, descObj;
							  profileId = 'vendorId';
							  //load vendor profile template
							  $.ajax({
								  url: 'template/vendorprofile.handlebars',
								  dataType: 'html',
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
								  }
							  });
						  },
						  error: function (e){
							  $('#page-status').html('Sorry, unable to access your profile.')
											  .addClass('alert-error')
											  .show();
						  }
					  });
				  } else {
					  tnData = [{
							  'text': 'My requests',
							  'href': '/mybusiness.html'
						  },{
							  'text': 'My appointments',
							  'href': '/myclients.html'
						  }, {
							  'text': 'Schedule',
							  'href': '/myschedule.html'
						  }, {
							  'text': 'Settings',
							  'href': '#',
							  'active': true
						  }];
					  $('.page-loading').hide();
					  profileId = 'userId';
					  $.ajax({
						  url: 'template/userprofile.handlebars',
						  dataType: 'html',
						  success: function(resp) {
							  $('#profileForm').prop('method', 'GET').html(resp)
							  	.prop('action', wp.cfg['REST_HOST']+'/resources/user/insert')
							  	.show();
							  if (response.id) {
								  $('#profileForm').append('<input name="'+profileId+'" type="hidden" value="' +response.userId+ '">');
							  }
							  $('#profileForm input[name="email"]').val(response.email || '');
							  $('#profileForm input[name="mobilePhone"]').val(response.mobilePhone || '');
						  }
					  });
				  }
				  wp.mynav.load({
					  targetSelector: '#top-nav',
					  data : {
						  tab : tnData
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
			 $('.page-loading').hide();
		  }
	});

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
				  $('#profileForm .btn-primary').attr('disabled', true);
				  $('#page-status').removeClass('alert-success')
	 							.removeClass('alert-error')
	 							.hide();
			  },
			  complete: function (){
				  $('#profileForm .btn-primary').removeAttr('disabled');
			  },
			  success: function (response){
				 var statusMsg;

				 /* if ($('#profileForm input[name="'+profileId+'"]').length > 0){
					 statusMsg = 'Profile updated successfully';					 
				 } else {
					 statusMsg = 'Profile created successfully';
					 $('#profileForm').append('<input name="'+profileId+'" type="hidden" value="' +response.id+ '">');
				 } */
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