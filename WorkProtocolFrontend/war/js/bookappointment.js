$(function (){
	var params, OPENEVENT_ID, BUSYEVENT_ID, bookEvntStartStr, bookEvntEndStr;
	
	params = $.deparam.querystring();
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
					  complete: function (){
						  $('#view .loading').hide();
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
									  $('#addEvent').modal();
								  }
							  },
							  events: eventsArr
						  });

						  //book new appointment
						  $('#addEvent .appt-book').on('click', function (){
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
										  $('#addEvent').modal('hide');
										  $('#page-status').addClass('alert-success').html('Appointment booked successfully.').show();
										  calendar.fullCalendar('removeEvents',OPENEVENT_ID+wp.util.parseDate(bookEvntStartStr));
										  calendar.fullCalendar('renderEvent',{
											  id: BUSYEVENT_ID+bookEvntStartStr,
											  title: title,
											  start: wp.util.parseDate(bookEvntStartStr),
											  end: wp.util.parseDate(bookEvntEndStr),
											  allDay: false,
											  className: 'wp-event-booked'
										  }, true); // true makes the event "stick"
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
							  $('#addEvent').modal('hide');
							  calendar.fullCalendar('unselect');
						  });
					  },
					  error: function (){
						  $('#page-status').html("Sorry, unable to load vendor's calendar").addClass('alert-error').show();
					  }
				  });
			  } else {
				  wp.util.redirectToSigin();
			  }
		  },
		  error: function (e){
			 $('#page-status').html('Sorry, unable to authenticate')
							.addClass('alert-error')
							.show();
			 $('#view .loading').hide();
		  }
		});

});