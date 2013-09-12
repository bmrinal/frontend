$(function (){
	var params, vendorTempl, fetchServices, categoryHash, servicesXHR, servicesArr, currServiceInd, showServiceDetails;

	categoryHash = {};
	params = wp.util.qsToJSON();
	if (params.rdcode){
		switch (params.rdcode) {
			case 'ba.yes' :
				$('#page-status').addClass('alert-success').html('Appointment booked').show();
				break;
			case 'rq.yes' :
				$('#page-status').addClass('alert-success').html('Service request submitted').show();
				break;
		}
	}

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
		  $('#view .categories').html('<div class="alert alert-error">'
				  + '<button type="button" class="close" data-dismiss="alert">&times;</button>'
				  + 'Sorry, unable to load categories'
				  + '</div>'
		  );
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
				source = $('#TL_services').html();
				template = Handlebars.compile(source);
				data = {};
				
				if (filterByCategory === true){
					data.service = response.services || [];
					if (response.children) {
						$.each(response.children, function(i, v){
							if (v.services) {
								$.merge(data.service, v.services);
							}
						});
					}
				} else {
					data.service = response;
				}

				servicesArr = data.service;
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
	fetchServices(wp.cfg['REST_HOST'] + '/resources/services/list', false);

	$('#view').on('change', '#categories', function (e){
		var template, data, val;
		val = $(this).val();

		$('#view .services-box').html(''); //services
		$('#view .category2').html(); //second level categories

		if (val === '-1') { // all categories
			fetchServices(wp.cfg['REST_HOST'] + '/resources/services/list', false);
			$('#view .category2').html('');
		} else { // filter by one category
			fetchServices(wp.cfg['REST_HOST']+'/resources/categories/' + val, true);

			//refresh second category list
			template = Handlebars.compile($('#TL_categories2').html());
			data = categoryHash[val];
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

	//service details view
	$('#view').on('click', ".service", function(e){
		if ($(e.target).is('a, button, .ghangout')) {
			return;
		}

		currServiceInd = parseInt($(this).data('ind'), 10);
		showServiceDetails(currServiceInd);
	});

	showServiceDetails = function (ind){
		var template, data;

		wp.overlay.open();


		template = Handlebars.compile($('#TL_service-details').html());
		data = {};
		
		data['REST_HOST'] = wp.cfg['REST_HOST'];
		data.service = servicesArr[ind];
		wp.overlay.setContent(template(data));

		$('.prevNav').toggleClass('disabled', ind === 0);
		$('.nextNav').toggleClass('disabled', ind === (servicesArr.length -1));

		$('#carousel').flexslider({
		    animation: "slide",
		    controlNav: false,
		    animationLoop: false,
		    slideshow: false,
		    itemWidth: 100,
		    itemMargin: 5,
		    asNavFor: '#slider'
		  });
		   
		  $('#slider').flexslider({
		    animation: "slide",
		    controlNav: false,
		    animationLoop: false,
		    slideshow: false,
		    sync: "#carousel"
		  });
	};

	$(document).on('keyup', function(e){
		var keycode = e.which;

		if (wp.overlay.isOpen()){
			if (keycode == 37) {
				$('.prevNav').click();
			} else if (keycode == 39) {
				$('.nextNav').click();
			}
		}
	});
	
	$('body').on('click', '.prevNav', function(e){
		e.stopPropagation();

		if (currServiceInd !== 0){
			currServiceInd = currServiceInd - 1;
			showServiceDetails(currServiceInd);
		}
	});

	$('body').on('click', '.nextNav', function(e){
		e.stopPropagation();

		if (currServiceInd !== (servicesArr.length -1)){
			currServiceInd = currServiceInd + 1;
			showServiceDetails(currServiceInd);
		}
	});

	//appointment
	$('body').on('click', '.wp-appoint', function(e){
		e.stopPropagation();

		window.location.href = '/bookappointment.html?serviceId='
				+ $(this).data('srvcid') + '&vendorId='
				+ $(this).data('vendorid') + '&duration='
				+ $(this).data('duration');
	});

	//service request
	$('body').on('click', '.wp-quote', function(e){
		e.stopPropagation();

		window.location.href = '/requestquote.html?srvcDefId='
			+ $(this).data('srvcdefid')
			+ '&serviceId=' + $(this).data('srvcid');
	});

	//service request
	$('body').on('click', '.wp-video', function(e){
		$('#videotrigger').click();
	});

});