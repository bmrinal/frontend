$(function (){
	var params, BUSYEVENT_ID;
	
	params = $.deparam.querystring();
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
				  $.ajax({
					  url: wp.cfg['REST_HOST']+'/resources/calendar/freebusy?serviceId='+ params.serviceId +'&vendorId=' + params.vendorId,
					  cache: false,
					  dataType: "json",
					  complete: function (){
						  $('#view .loading').hide();
					  },
					  success: function (response){
						  var date, d, m, y, calendar, eventsArr, busySlots, re, stDateArr, etDateArr;
						  
						  if ($.isArray(response.errors) && response.errors.length > 0){
							  $('#page-status').html("Sorry, unable to load vendor's calendar").addClass('alert-error').show();
							  return;
						  }
						  date = new Date();
						  d = date.getDate();
						  m = date.getMonth();
						  y = date.getFullYear();
						  eventsArr = [];
						  re = /^(\d{1,2})(-)(\d{1,2})(-)(\d{4})( )(\d{2})(:)(\d{2})(:)(\d{2})$/;
						  
						  if (response.hasOwnProperty('busyTimePeriods')){
							  busySlots = response.busyTimePeriods;
							  for (var i=0; i<busySlots.length; i++){
								  stDateArr = busySlots[i].startTime.match(re);
								  etDateArr = busySlots[i].endTime.match(re);
								  
								  eventsArr.push({
									  id: BUSYEVENT_ID,
									  title: 'Busy',
									  className: 'wp-event-busy',
									  allDay: false,
									  start: new Date(parseInt(stDateArr[5]), parseInt(stDateArr[1])-1, parseInt(stDateArr[3]), parseInt(stDateArr[7]), parseInt(stDateArr[9]), parseInt(stDateArr[11])),
									  end: new Date(parseInt(etDateArr[5]), parseInt(etDateArr[1])-1, parseInt(etDateArr[3]), parseInt(etDateArr[7]), parseInt(etDateArr[9]), parseInt(etDateArr[11]))
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
							  minTime: '9:00am',
							  maxTime: '6:00pm',
							  year: y,
							  month: m,
							  date: d+1,
							  defaultView: 'agendaWeek',
							  selectable: true,
							  selectHelper: true,
							  select: function(s, e, allday) {
								  start = s;
								  end = e;
								  $('#addEvent').modal();
								  
							  },
							  eventClick: function(event, jsEvent, view){
								  /* if (event.id !== BUSYEVENT_ID && confirm('Do you want to delete this event')) {
										calendar.fullCalendar('removeEvents',event.id);
								     }
								   */
							  },
							  events: eventsArr
						  });
						  
						  //book new appointment
						  $('#addEvent .appt-book').on('click', function (){
							  var qsParams, stStr, etStr;
							  
							  stStr = (start.getMonth() + 1) + '-' + start.getDate() + '-' + start.getFullYear()
							  + ' ' + start.getHours() + ':' + start.getMinutes() + ':' + start.getSeconds();
							  etStr = (end.getMonth() + 1) + '-' + end.getDate() + '-' + end.getFullYear()
							  + ' ' + end.getHours() + ':' + end.getMinutes() + ':' + end.getSeconds();
							  
							  qsParams = {
									  vendorId: params.vendorId,
									  serviceId: params.serviceId,
									  eventStartTime: stStr,
									  eventEndTime: etStr
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
											  className: 'wp-event-editable'
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