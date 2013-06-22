$(function (){
	var params, OPENEVENT_ID;
	
	params = $.deparam.querystring();
	OPENEVENT_ID = 'busy';

	$.ajax({
		  url: wp.cfg['REST_HOST']+'/resources/user',
		  dataType: 'json',
		  cache: false,
		  xhrFields: {
			  withCredentials: true
		  },
		  success: function (response){
			  if(response && response.userId){
				  $('#addEvent input[name="phone"]').val(response.mobilePhone || '');
				  $.ajax({
					  url: wp.cfg['REST_HOST']+'/resources/calendar/freebusy?serviceId='+ params.serviceId +'&vendorId=' + params.vendorId,
					  cache: false,
					  dataType: "json",
					  complete: function (){
						  $('#view .loading').hide();
					  },
					  success: function (response){
						  var date, d, m, y, calendar, eventsArr, openSlots;
						  
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
								  eventsArr.push({
									  id: OPENEVENT_ID,
									  title: 'Book',
									  className: 'wp-event-editable',
									  allDay: false,
									  start: wp.dateUtil.parseDate(openSlots[i].startTime),
									  end: wp.dateUtil.parseDate(openSlots[i].endTime)
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
								  if (event.id === OPENEVENT_ID) {
										//calendar.fullCalendar('removeEvents',event.id);
									  start = $.fullCalendar.formatDate(event.start, 'MM-dd-yyyy HH:mm:ss');
									  end = $.fullCalendar.formatDate(event.end, 'MM-dd-yyyy HH:mm:ss');
									  
									  $('#startTime').html(start);
									  $('#endTime').html(end);
									  $('#addEvent').modal();
								  }
							  },
							  events: eventsArr
						  });

						  //book new appointment
						  $('#addEvent .appt-book').on('click', function (){
							  var qsParams;

							  qsParams = {
									  vendorId: params.vendorId,
									  serviceId: params.serviceId,
									  eventStartTime: start,
									  eventEndTime: end
							  };
							  
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
										  calendar.fullCalendar('renderEvent',{
											  id: title,
											  title: title,
											  start: start,
											  end: end,
											  allDay: false,
											  className: 'wp-event-busy'
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
				  window.location.href = wp.cfg['REST_HOST']+'/SignIn?ru=' + window.location.href;
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