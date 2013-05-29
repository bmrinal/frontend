$(function (){
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
					  url: "http://work0protocol.appspot.com/resources/vendors/myvendor",
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

						  $('#view').show();
						  if (response.id) {
							  $('#profileForm').append('<input name="vendorId" type="hidden" value="' +response.id+ '">');
						  }
						  $('#profileForm input[name="vendorName"]').val(response.name || '');
						  $('#profileForm input[name="vendorPhone"]').val(response.phone || '');
						  $('#profileForm input[name="vendorMobilePhone"]').val(response.mobilePhone || '');
						  
						  if ($.isArray(response.locations)) {
							  $('#profileForm input[name="vendorLocationStreet1"]').val(response.locations[0].streetAddress1 || '');
							  $('#profileForm input[name="vendorLocationStreet2"]').val(response.locations[0].streetAddress2 || '');
							  $('#profileForm input[name="vendorLocationCity"]').val(response.locations[0].city || '');
							  $('#profileForm input[name="vendorLocationState"]').val(response.locations[0].city || '');
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
					  },
					  error: function (e){
						 $('#page-status').html('Sorry, unable to access your profile.')
										.addClass('alert-error')
										.show();
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

	$('#profileForm').submit(function (e){
		e.preventDefault();
		$.ajax({
			  url: "http://work0protocol.appspot.com/resources/vendors/",
			  cache: false,
			  type: 'POST',
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

				 if ($('#profileForm input[name="vendorId"]').length > 0){
					 statusMsg = 'Profile updated successfully';					 
				 } else {
					 statusMsg = 'Profile created successfully';
					 $('#profileForm').append('<input name="vendorId" type="hidden" value="' +response.id+ '">');
				 }
				 $('#page-status').html(statusMsg)
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