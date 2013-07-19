$(function (){
	var params, OPENEVENT_ID, BUSYEVENT_ID, bookEvntStartStr, bookEvntEndStr;

	params = wp.util.qsToJSON();
	OPENEVENT_ID = 'open';
	BUSYEVENT_ID = 'busy';

	$.ajax({
	  url: wp.cfg['REST_HOST']+'/resources/user',
	  dataType: 'json',
	  cache: false,
	  xhrFields: {
		  withCredentials: true
	  },
	  success: function (response){
		  if(response && response.userId){
			  var data, template;
			  data = {};

			  data['isProxyBooking'] = (response.vendorId === parseInt(params.vendorId, 10));
			  data['phone'] = response.mobilePhone;
			  template = Handlebars.compile($("#TL_addEvent").html());

			  $('#addEvent').html(template(data));

			  $.ajax({
				  url: wp.cfg['REST_HOST']+'/resources/calendar/freebusy?serviceId='+ params.serviceId +'&vendorId=' + params.vendorId,
				  cache: false,
				  dataType: "json",
				  beforeSend: function (){
					  $('#wp-spinner').spin({color:'#B94A48', lines: 12});
				  },
				  complete: function (){
					  $('#wp-spinner').spin(false);
				  },
				  success: function (response){
					  var date, d, m, y, calendar, eventsArr, openSlots, busySlots, evntStartDate, evntEndDate;
					  
					  if ($.isArray(response.errors) && response.errors.length > 0){
						  $('#page-status').html("Sorry, unable to load vendor's calendar").addClass('alert-error').show();
						  return;
					  }
					  date = new Date();
					  d = date.getDate();
					  m = date.getMonth();
					  y = date.getFullYear();
					  eventsArr = [];
					  
					  if (response.hasOwnProperty('freeTimePeriods')){
						  openSlots = response.freeTimePeriods;
						  for (var i=0; i<openSlots.length; i++){
							  evntStartDate = wp.util.parseDate(openSlots[i].startTime);
							  evntEndDate = wp.util.parseDate(openSlots[i].endTime);

							  eventsArr.push({
								  id: OPENEVENT_ID+evntStartDate,
								  title: 'Available',
								  className: 'wp-event-open',
								  allDay: false,
								  start: evntStartDate,
								  end: evntEndDate
							  });
						  }
					  }

					  if (response.hasOwnProperty('busyTimePeriods')){
						  busySlots = response.busyTimePeriods;
						  for (var j=0; j<busySlots.length; j++){
							  evntStartDate = wp.util.parseDate(busySlots[j].startTime);
							  evntEndDate = wp.util.parseDate(busySlots[j].endTime);

							  eventsArr.push({
								  id: BUSYEVENT_ID+evntStartDate,
								  title: 'Not available',
								  className: 'wp-event-busy',
								  allDay: false,
								  start: evntStartDate,
								  end: evntEndDate
							  });
						  }
					  }

					  calendar = $('#calendar').fullCalendar({
						  header: {
							  left: 'prev,next today',
							  center: 'title', 
							  right: ''
						  },
						  allDaySlot: false,
						  year: y,
						  month: m,
						  date: d+1,
						  minTime: '9:00am',
						  maxTime: '6:00pm',
						  defaultView: 'agendaWeek',
						  slotMinutes:  parseInt(params.duration, 10),
						  eventClick: function(event, jsEvent, view){
							  if (event.id.match(OPENEVENT_ID)) {
								  bookEvntStartStr = $.fullCalendar.formatDate(event.start, 'MM-dd-yyyy HH:mm:ss');
								  bookEvntEndStr = $.fullCalendar.formatDate(event.end, 'MM-dd-yyyy HH:mm:ss');
								  
								  $('#startTime').html(bookEvntStartStr);
								  $('#endTime').html(bookEvntEndStr);
								  openAddEventView();
							  }
						  },
						  events: eventsArr
					  });

					  $('.wp-legend').show();
					  $('#addEvent form').on('submit', function (e){
						  e.preventDefault();
						  $('#addEvent .appt-book').click();
					  });

					  //book new appointment
					  $('#addEvent').on('submit', '.wp-addEvent', function (){
						  var qsParams, formParams;

						  qsParams = {
								  vendorId: params.vendorId,
								  serviceId: params.serviceId,
								  eventStartTime: bookEvntStartStr,
								  eventEndTime: bookEvntEndStr
						  };

						  formParams = $('#addEvent form').serializeArray();
						  
						  $.each(formParams, function (ind, obj){
							  qsParams[obj.name] = obj.value;
						  });

						  $.ajax({
							  url: wp.cfg['REST_HOST']+'/resources/calendar/event',
							  cache: false,
							  data: qsParams,
							  dataType: "jsonp",
							  beforeSend: function (){
								  $('#view .loading').html('Booking appointment...').show();
							  },
							  complete: function (){
								  $('#view .loading').hide();
							  },
							  success: function (response){
								  var title;
								  
								  title = response.eventSummary;
								  
								  if (title) {
									  /* $('#addEvent').modal('hide');
									  $('#page-status').addClass('alert-success').html('Appointment booked successfully.').show();
									  calendar.fullCalendar('removeEvents',OPENEVENT_ID+wp.util.parseDate(bookEvntStartStr));
									  calendar.fullCalendar('renderEvent',{
										  id: BUSYEVENT_ID+bookEvntStartStr,
										  title: title,
										  start: wp.util.parseDate(bookEvntStartStr),
										  end: wp.util.parseDate(bookEvntEndStr),
										  allDay: false,
										  className: 'wp-event-booked'
									  }, true); // true makes the event "stick" */

									  window.location.href = '/services.html?rdcode=ba.yes';
								  } else {
									  $('#page-status').addClass('alert-error').html('Sorry, unable to book appointment at this time. Please try again later.').show();
								  }
							  },
							  error: function (){
								  $('#page-status').addClass('alert-error').html('Sorry, unable to book appointment at this time. Please try again later.').show();
							  }
						  });
					  });

					  $('#addEvent .appt-cancel').on('click', function (){
						  closeAddEventView();
					  });
				  },
				  error: function (){
					  $('#page-status').html("Sorry, unable to load vendor's calendar").addClass('alert-error').show();
				  }
			  });

			  //load service details
			  $.ajax({
				  url: wp.cfg['REST_HOST']+'/resources/services/' + params.serviceId,
				  cache: false,
				  dataType: "jsonp",
				  success: function (response){
					  $('#view .wp-srvc-info .wp-srvc-info-h span').html(response.wpName);

					  wp.util.templateLoader({'templateUrl': 'template/serviceinfo.handlebars',
							  'data': response,
							  'targetSelector': '#view .wp-srvc-info .wp-srvc-info-b'
					  });
					  
					  $('#view .wp-srvc-info').show();
				  },
				  error: function (){}
			  });

			  $('#view .wp-srvc-info-h').on('click', function (){
				  $('#view .wp-srvc-info-b').toggle();
			  });
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

	//setting the overlay height as same as view port height
	$('#wp-oly').css('min-height', $(window).height());

	var openAddEventView = function (){
		$('#wp-main').hide();
		$('#wp-oly').addClass('open');
		wp.util.scrollToTop();
	};
	
	var closeAddEventView = function (){
		$('#wp-main').show();
		$('#wp-oly').removeClass('open');
	};

	$('#wp-oly').on('click', function(e){
		var t = $(e.target);

		if (t.is('.wp-oly-close') || t.parent('body').length > 0) {
			e.preventDefault();
			closeAddEventView();
		}
	});

	$(document).on('keyup', function(e){
		if (e.which == 27 ) {
			closeAddEventView();
		}
	});

});