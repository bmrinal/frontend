$(function (){
	var fetchSpecialists, specialistsXHR, specialistsArr, currSpecialistInd, showSpecialistDetails, servicesXHR, servicesArr, isSpecialistView, isServiceView,
		showServiceDetails, currServiceInd, scrollPos;

	fetchSpecialists = function (url){
		if (specialistsXHR) {
			specialistsXHR.abort();
		}

		specialistsXHR = $.ajax({
			url: url,
			cache: false,
			dataType: "jsonp",
			beforeSend: function () {
				$('#wp-spinner').spin('custom');
				$('#no-specialists').hide();
				
				$('#view .specialists-box').html('');
			},
			complete: function () {
				$('#wp-spinner').spin(false);
			},
			success: function (response){
				var source, template, data, specialistsHTML, container, specialists;
				container = $('#view .specialists-box');
				source = $('#TL_specialists').html();
				template = Handlebars.compile(source);
				data = {};
				specialists = [];

				$.each(response, function (ind, admin){
					if (admin.isVendor){
						admin.vendorAdminName = admin.nickname;
						specialists.push(admin);

						if (admin.vendorUsers) {
							$.each(admin.vendorUsers, function (vuInd, vuVal){
								vuVal.vendorAdminName = admin.nickname;
								specialists.push(vuVal);
							});
						}
					}
				});

				data.specialist = specialists;

				specialistsArr = data.specialist;
				data['REST_HOST'] = wp.cfg['REST_HOST'];
				specialistsHTML = $('<div/>').html($(template(data).trim()));
				specialistsHTML = specialistsHTML.find('.specialist');

				if (specialistsHTML && specialistsHTML.length > 0){
					var temp = $('<div class="row-fluid"/>');
					$.each(specialistsHTML, function (ind, val){
						//$(container).append(val);
						temp.append(val);
						if ((ind +1) % 3 === 0 || ((ind+1) === specialistsHTML.length)) { //every 3rd (or) last set of elements
							$(container).append(temp); //add to main container
							temp = $('<div class="row-fluid"/>');
						}
					});
				} else {
					$('#no-specialists').show();
				}

				$('#view .specialists .flexslider').flexslider({
					animation: 'slide',
					slideshow: false
				});
			},
			error: function (){}
		});
	};

	//loading all specialists on page load
	fetchSpecialists(wp.cfg['REST_HOST'] + '/resources/user/list');

	//specialist details view
	$('#view').on('click', ".specialist", function(e){
		if ($(e.target).is('a, button, .ghangout')) {
			return;
		}

		scrollPos = $(document).scrollTop();
		currSpecialistInd = parseInt($(this).data('ind'), 10);
		showSpecialistDetails(currSpecialistInd);
	});

	showSpecialistDetails = function (ind){
		var template, data;

		wp.overlay.open();
		isSpecialistView = true;
		isServiceView = false;
		template = Handlebars.compile($('#TL_specialist-details').html());
		data = {};

		data['REST_HOST'] = wp.cfg['REST_HOST'];
		data.specialist = specialistsArr[ind];
		wp.overlay.setContent(template(data));

		$('.prevNav').toggleClass('disabled', ind === 0);
		$('.nextNav').toggleClass('disabled', ind === (specialistsArr.length -1));

		if (servicesXHR){
			servicesXHR.abort();
			$('#services .loading').spin(false);
		}

		servicesXHR = $.ajax({
			url: wp.cfg['REST_HOST'] + '/resources/vendors/' + data.specialist.vendorId,
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
		isSpecialistView = false;
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

		if (isSpecialistView === true){
			if (currSpecialistInd !== 0){
				currSpecialistInd = currSpecialistInd - 1;
				showSpecialistDetails(currSpecialistInd);
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
		
		if (isSpecialistView === true){
			if (currSpecialistInd !== (specialistsArr.length -1)){
				currSpecialistInd = currSpecialistInd + 1;
				showSpecialistDetails(currSpecialistInd);
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
		var redirectUrl, duration;
		e.stopPropagation();

		redirectUrl = '/bookappointment.html?serviceId='
			+ $(this).data('srvcid') + '&vendorUserId='
			+ $(this).data('vendoruserid') + '&vendorId='
			+ $(this).data('vendorid');

		duration = $(this).data('duration');
		if (duration) {
			redirectUrl += '&duration=' + duration;
		}
		window.location.href = redirectUrl;
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