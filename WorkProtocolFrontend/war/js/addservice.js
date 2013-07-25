$(function (){
	var categoryHash, fetchServices, servicesXHR, serviceDefsArr, locationDetails;
	
	categoryHash = {};
	$.ajax({
	  url: wp.cfg['REST_HOST']+'/resources/user',
	  dataType: 'json',
	  beforeSend: function(){
		  $('#wp-spinner').spin({color:'#B94A48', lines: 12});
	  },
	  cache: false,
	  xhrFields: {
		  withCredentials: true
	  },
	  success: function (response){
		  if(response && response.userId){
			if (!response.isVendor){
				$('#page-status').html('Sorry, please register as a vendor to view this page.').addClass('alert-error').show();
				return;
			}
			wp.mynav.load({
				targetSelector: '#top-nav',
				isVendor: response.isVendor 
			}, 'services');

			$.ajax({
			  url: wp.cfg['REST_HOST']+'/resources/categories/list',
			  cache: false,
			  dataType: "jsonp",
			  success: function (response){
				  var template, categorySource;
				  categorySource = $("#TL_categories").html();
				  template = Handlebars.compile(categorySource);
			
				  $.each(response, function (k, v){
					  categoryHash[v.id] = v.children || [];
				  });

				  $('#view .categories').html(template(response));
				  $('#view .categories .selectpicker').selectpicker();
			  },
			  error: function (){
				  /*$('#view .categories').html('<div class="alert alert-error">'
						  + '<button type="button" class="close" data-dismiss="alert">&times;</button>'
						  + 'Sorry, unable to load categories'
						  + '</div>'
				  );*/
			  }
			});

			fetchServices = function (url, filterByCategory){
				if (servicesXHR) {
					servicesXHR.abort();
				}

				servicesXHR = $.ajax({
					url: url,
					cache: false,
					dataType: "jsonp",
					beforeSend: function () {
						$('#wp-spinner').spin({color:'#B94A48', lines: 12});
						$('#no-services').hide();
						
						$('#view .services-box').html('');
					},
					complete: function () {
						$('#wp-spinner').spin(false);
					},
					success: function (response){
						var source, template, data, servicesHTML, container;
						container = $('#view .services-box');
						source = $('#TL_serviceDefs').html();
						template = Handlebars.compile(source);
						data = {};
						
						if (filterByCategory === true){
							data.servicedefs = response.serviceDefinitions || {};
							serviceDefsArr = response.serviceDefinitions || [];
						} else {
							data.servicedefs = response;
							serviceDefsArr = response;
						}
						data['REST_HOST'] = wp.cfg['REST_HOST'];
						servicesHTML = $('<div/>').html($(template(data).trim()));
						servicesHTML = servicesHTML.find('.service');

						if (servicesHTML && servicesHTML.length > 0){
							var temp = $('<div class="row-fluid"/>');
							$.each(servicesHTML, function (ind, val){
								//$(container).append(val);
								temp.append(val);
								if ((ind +1) % 3 === 0 || ((ind+1) === servicesHTML.length)) { //every 3rd (or) last set of elements
									$(container).append(temp); //add to main container
									temp = $('<div class="row-fluid"/>');
								}
							});
						} else {
							$('#no-services').show();
						}

						$('#view .services .flexslider').flexslider({
							animation: 'slide',
							slideshow: false
						});
					},
					error: function (){
						/* $('#view .services').html('<div class="alert alert-error">'
								+ '<button type="button" class="close" data-dismiss="alert">&times;</button>'
								+ 'Sorry, unable to load services'
								+ '</div>'
						); */
					}
				});
			};

			//loading all services on page load
			fetchServices(wp.cfg['REST_HOST'] + '/resources/servicedefinitions/list', false);

			$('#view').on('change', '#categories', function (e){
				var template, data, val;
				val = $(this).val();

				$('#view .services-box').html(''); //services
				$('#view .category2').html(); //second level categories

				if (val === '-1') { // all categories
					fetchServices(wp.cfg['REST_HOST'] + '/resources/servicedefinitions/list', false);
					$('#view .category2').html('');
				} else { // filter by one category
					fetchServices(wp.cfg['REST_HOST']+'/resources/categories/' + val, true);

					//refresh second category list
					template = Handlebars.compile($('#TL_categories2').html());
					data = {};
					data.categories = categoryHash[val];
					$('#view .category2').html(template(data));
				}
			});

			//handling secondary category selection
			$('#view').on('click', '#category2 a', function(e){
				var val;

				e.preventDefault();
				$('#category2 a.active').removeClass('active');
				$(this).addClass('active');
				val = $(this).data('catid');
				fetchServices(wp.cfg['REST_HOST']+'/resources/categories/' + val, true);
			});

			//service definition details
			$('#view').on('click', ".service", function(e){
				var template, data, ind, htmlTmpl, htmlMetaData;

				if ($(e.target).is('a, button')) {
					return;
				}

				wp.overlay.open();
				ind = parseInt($(this).data('ind'), 10);
				template = Handlebars.compile($('#TL_requestSrvc').html());
				data = {};
				
				data['REST_HOST'] = wp.cfg['REST_HOST'];
				data.serviceDef = serviceDefsArr[ind];
				wp.overlay.setContent(template(data));

				$('#sr-form-fields').prop('action', wp.cfg['REST_HOST']+'/resources/services');
				//$("#sr-form-fields input[name='serviceDefinitionId']").val(data.service.id);

				htmlTmpl = data.serviceDef.htmlTemplate;
				htmlMetaData = $.parseJSON(data.serviceDef.htmlMetaData);

				if (data.serviceDef.name) {
					$('#srMetaFields input[name="wpName"]').val(data.serviceDef.name + ' by ' + wp.user.userName);
				}

				if (htmlTmpl && htmlMetaData) {
					$('#srTemplate').html(Mustache.to_html(htmlTmpl, htmlMetaData));
					$('#srvc-location').html(locationDetails);
				} else {
					$('#srTemplate').html('<div class="alert  alert-error">'
					  + 'Sorry, service definition form unavailable'
					  + '</div>'
					);
				}
			});
			
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
						locationDetails = locationTmpl({location: response.locations});
					  }
				}
			});

			//cost fields
			$('body').on('change', 'input[name="wpServicePaymentType"]', function (){
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

			$('body').on('click', '#sr-form-close', function (){
				wp.overlay.close();
			});
			//submit new service
			$('body').on('submit', '#sr-form-fields', function (e){
				var form, params, action;
				e.preventDefault();

				form = $(this);
				action = form.data('action');
			
				params = form.serialize();
				$.ajax({
				  url: form.attr('action'),
				  data: params,
				  dataType: "jsonp",
				  success: function (response){
					  if(response.errors){
						  form.prepend('<div class="alert alert-error">'
								  + '<button type="button" class="close" data-dismiss="alert">&times;</button>'
								  + response.errors[0].message
								  + '</div>'
						  );
						  return;
					  }

					  wp.overlay.close();
					  $('#page-status').html('Service ('+ response.wpName +') created successfully').removeClass('hide');
				  },
				  error: function (){
					  form.prepend('<div class="alert alert-error">'
							  + '<button type="button" class="close" data-dismiss="alert">&times;</button>'
							  + 'Sorry, unable to create a service request'
							  + '</div>'
					  );
				  }
				});
			});

			
		  } else {
			  wp.util.redirectToSigin();
		  }
	  },
	  error: function (e){
		 $('#page-status').html('Sorry, unable to authenticate')
						.addClass('alert-error')
						.show();
	  }
	});
});