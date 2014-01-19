$(function (){
	var fetchProviders, providersXHR, providersArr, currProviderInd, showProviderDetails, servicesXHR, servicesArr, isProviderView, isServiceView,
		showServiceDetails, currServiceInd, scrollPos;

	fetchProviders = function (url){
		if (providersXHR) {
			providersXHR.abort();
		}

		providersXHR = $.ajax({
			url: url,
			cache: false,
			dataType: "jsonp",
			beforeSend: function () {
				$('#wp-spinner').spin('custom');
				$('#no-providers').hide();
				
				$('#view .providers-box').html('');
			},
			complete: function () {
				$('#wp-spinner').spin(false);
			},
			success: function (response){
				var source, template, data, providersHTML, container;
				container = $('#view .providers-box');
				source = $('#TL_providers').html();
				template = Handlebars.compile(source);
				data = {};

				data.provider = response;

				providersArr = data.provider;
				data['REST_HOST'] = wp.cfg['REST_HOST'];
				providersHTML = $('<div/>').html($(template(data).trim()));
				providersHTML = providersHTML.find('.provider');

				if (providersHTML && providersHTML.length > 0){
					var temp = $('<div class="row-fluid"/>');
					$.each(providersHTML, function (ind, val){
						//$(container).append(val);
						temp.append(val);
						if ((ind +1) % 3 === 0 || ((ind+1) === providersHTML.length)) { //every 3rd (or) last set of elements
							$(container).append(temp); //add to main container
							temp = $('<div class="row-fluid"/>');
						}
					});
				} else {
					$('#no-providers').show();
				}

				$('#view .providers .flexslider').flexslider({
					animation: 'slide',
					slideshow: false
				});
			},
			error: function (){}
		});
	};

	//loading all providers on page load
	fetchProviders(wp.cfg['REST_HOST'] + '/resources/vendors/list');

	//provider details view
	$('#view').on('click', ".provider", function(e){
		if ($(e.target).is('a, button, .ghangout')) {
			return;
		}

		scrollPos = $(document).scrollTop();
		currProviderInd = parseInt($(this).data('ind'), 10);
		showProviderDetails(currProviderInd);
	});

	showProviderDetails = function (ind){
		var template, data;

		wp.overlay.open();
		isProviderView = true;
		isServiceView = false;
		template = Handlebars.compile($('#TL_provider-details').html());
		data = {};

		data['REST_HOST'] = wp.cfg['REST_HOST'];
		data.provider = providersArr[ind];
		wp.overlay.setContent(template(data));

		$('.prevNav').toggleClass('disabled', ind === 0);
		$('.nextNav').toggleClass('disabled', ind === (providersArr.length -1));

		if (servicesXHR){
			servicesXHR.abort();
			$('#services .loading').spin(false);
		}

		servicesXHR = $.ajax({
			url: wp.cfg['REST_HOST'] + '/resources/vendors/' + data.provider.id,
			cache: false,
			dataType: "jsonp",
			beforeSend: function (){
				$('#services .loading').spin('custom');
			},
			complete: function (){
				$('#services .loading').spin(false);
			},
			success: function (res){
				var template, data;

				template = Handlebars.compile($('#TL_services').html());
				data = {};
				data['REST_HOST'] = wp.cfg['REST_HOST'];
				data.services = res.services;
				servicesArr = res.services;

				$('#services').html(template(data));
				
				$('#srvc-carousel').flexslider({
				    animation: "slide",
				    controlNav: false,
				    animationLoop: false,
				    slideshow: false,
				    itemWidth: 245,
				    itemMargin: 15
				  });
			}
		});
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

	//service details view
	$('#wp-oly').on('click', "li.srvc", function(e){
		if ($(e.target).is('a, button, .ghangout')) {
			return;
		}

		currServiceInd = parseInt($(this).data('ind'), 10);
		showServiceDetails(currServiceInd);
	});

	showServiceDetails = function (ind){
		var template, data;

		wp.overlay.open();
		isProviderView = false;
		isServiceView = true;
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

		if (isProviderView === true){
			if (currProviderInd !== 0){
				currProviderInd = currProviderInd - 1;
				showProviderDetails(currProviderInd);
			}
		} else if (isServiceView === true){
			if (currServiceInd !== 0){
				currServiceInd = currServiceInd - 1;
				showServiceDetails(currServiceInd);
			}
		}
	});

	$('body').on('click', '.nextNav', function(e){
		e.stopPropagation();
		
		if (isProviderView === true){
			if (currProviderInd !== (providersArr.length -1)){
				currProviderInd = currProviderInd + 1;
				showProviderDetails(currProviderInd);
			}
		} else if (isServiceView === true){
			if (currServiceInd !== (servicesArr.length -1)){
				currServiceInd = currServiceInd + 1;
				showServiceDetails(currServiceInd);
			}
		}
	});

	//appointment
	$('body').on('click', '.wp-appoint', function(e){
		e.stopPropagation();

		window.location.href = '/bookappointment.html?serviceId='
				+ $(this).data('srvcid') + '&vendorUserId='
				+ $(this).data('vendoruserid') + '&duration='
				+ $(this).data('duration');
	});

	//service request
	$('body').on('click', '.wp-quote', function(e){
		e.stopPropagation();

		window.location.href = '/requestquote.html?srvcDefId='
			+ $(this).data('srvcdefid')
			+ '&serviceId=' + $(this).data('srvcid');
	});
	
	PubSub.subscribe('WPOLY_CLOSE', function (){
		$(document).scrollTop(scrollPos);
	});

});