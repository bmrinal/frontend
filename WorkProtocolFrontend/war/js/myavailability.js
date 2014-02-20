$(function (){
	var profileId, userType, calendar, date, firstDayOfWeek, convertToCalEvnt, eventsArr, addEvents;

	$.ajax({
		  url: wp.cfg['REST_HOST']+'/resources/user',
		  dataType: 'json',
		  cache: false,
		  xhrFields: {
			  withCredentials: true
		  },
		  beforeSend: function (){
			  $('#wp-spinner').spin('custom');
		  },
		  complete: function (){
			  $('#wp-spinner').spin(false);
		  },
		  success: function (response){
			  var template;

			  if(response && response.userId){
				  userType = wp.util.getUserType(response);

				  if (userType === wp.constants.USER){
					  $('#page-status').html('Sorry, please register as a vendor to view this page.').addClass('alert-error').show();
					  return;
				  }

				  $('#availability').prop('action', wp.cfg['REST_HOST'] + '/resources/availability')
				  $('#availability input[name="vendorId"]').val(response.vendorId);

				  wp.mynav.load({
					'targetSelector': '#top-nav',
					'userType': userType
				  }, 'availability');

				  $('#view').show();
				  $.ajax({
					  url: wp.cfg['REST_HOST']+'/resources/availability/myavailability',
					  cache: false,
					  dataType: "jsonp",
					  success: function (response){
						  var d, m, y, evntStartDate, evntEndDate;

						  eventsArr = [];
						  for (var i=0; i<response.length; i++){
							  eventsArr = eventsArr.concat(addEvents(response[i]));
						  }

						  calendar = $('#calendar').fullCalendar({
							  header: {
								  left: '',
								  center: '', 
								  right: ''
							  },
							  columnFormat: 'ddd',
							  allDaySlot: false,
							  year: date.getFullYear(),
							  month: date.getMonth(),
							  date: date.getDate()+1,
							  minTime: '12:00am',
							  defaultView: 'agendaWeek',
							  slotMinutes:  60,
							  events: eventsArr,
							  eventClick: function(calEvent, jsEvent, view) {
								  if (confirm('Do you want to delete this schedule - "' + calEvent.title +'"')){
									  $.ajax({
										  url: wp.cfg['REST_HOST'] + '/resources/availability/delete?'+calEvent.id,
										  cache: false,
										  dataType: 'jsonp',
										  success: function (){
											  $('#calendar').fullCalendar('removeEvents', calEvent.id);
										  }
									  });
								  }
							  }
						  });
					  },
					  error: function (){
						  $('#page-status').html("Sorry, unable to load the availability").addClass('alert-error').show();
					  }
				  });
				  
				  $.ajax({
						url: wp.cfg['REST_HOST'] + '/resources/vendors/' + response.vendorId,
						cache: false,
						dataType: "jsonp",
						beforeSend: function (){
							$('.services-box .loading').spin('custom');
						},
						complete: function (){
							$('.services-box .loading').spin(false);
						},
						success: function (res){
							var source, template, data, servicesHTML, container;

							container = $('#view .services-box select');
							source = $('#TL_services').html();
							template = Handlebars.compile(source);
							data = {};
							
							data.service = res.services;
							data['REST_HOST'] = wp.cfg['REST_HOST'];
							$(container).append($(template(data).trim())).show();
						}
				  });

				  /* template = Handlebars.compile($("#TL_vendorUsers").html());
				  $('#vendorUsers').html(template(response)); */
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

	date = new Date();
	firstDayOfWeek = new Date(date.setDate(date.getDate() - date.getDay())); //first day of the week

	convertToCalEvnt = function (daysOfWeek, time){
		  var newDate = new Date(firstDayOfWeek);
		  newDate.setDate(firstDayOfWeek.getDate() + daysOfWeek);
		  newDate.setHours(time/ 60);
		  newDate.setMinutes(0);
		  newDate.setSeconds(0);
		  
		  return newDate;
	};

	addEvents = function (response){
		var daysOfWeek, evts, retArr;
		retArr = [];
		evts = response.startTimesEndTimes;
		  
		if (evts) {
		  for (var j=0; j<evts.length; j++){
			  daysOfWeek = evts[j].daysOfWeek -1; //javascript week 1(Sun) - 7(Sat) but java 0(Sun) - 6(Sat)
			  retArr.push({
				  id: 'id=' + response.id + '&startTime=' + evts[j].startTime + '&endTime=' + evts[j].endTime + '&daysOfWeek=' + evts[j].daysOfWeek,
				  title: response.serviceName,
				  allDay: false,
				  start: convertToCalEvnt(daysOfWeek, evts[j].startTime),
				  end: convertToCalEvnt(daysOfWeek, evts[j].endTime)
			  });
		  }
		}
		return retArr;
	}

	$('#availability input[name="daysOfWeek"]').change(function (e){
		var isChecked, tr;

		isChecked = $(this).prop('checked')
		tr = $(this).closest('tr')

		$('select', tr).prop('disabled', !isChecked);
	});

	$('#availability').submit(function (e){
		 e.preventDefault();

		 if ($('#availability input[name="daysOfWeek"]:checked').length > 0){
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
					 $('#availability .btn-success').attr('disabled', true);
					 $('#page-status').removeClass('alert-success')
					 .removeClass('alert-error')
					 .hide();
				 },
				 complete: function (){
					 $('#availability .btn-success').attr('disabled', false);
				 },
				 success: function (response){
					 var arr = addEvents(response);
					 $.each(arr, function (i, v){
						 calendar.fullCalendar('renderEvent', v);
					 });
					 arr
					 $('html').scrollTop(0);
					 $('#page-status').html('Successfully added')
					 	.addClass('alert-success')
					 	.show();
				 },
				 error: function (){
					 eventsArr.pop();
					 $('#page-status').html('Sorry, unable to process your request at this time')
					 .addClass('alert-error')
					 .show();
				 }
			 });
		 }
	});
});