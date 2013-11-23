$(function (){
	var profileId, userType, calendar, date, firstDayOfWeek, convertToCalEvnt, eventsArr;

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
						  var d, m, y, evntStartDate, evntEndDate, evts;

						  eventsArr = [];
						  for (var i=0; i<response.length; i++){
							  evts = response[i].startTimesEndTimes;
							  
							  for (var j=0; j<evts.length; j++){
								  eventsArr.push({
									  id: eventsArr.length,
									  title: 'Service Id : '+response[i].serviceId,
									  allDay: false,
									  start: convertToCalEvnt(evts[j].daysOfWeek, evts[j].startTime),
									  end: convertToCalEvnt(evts[j].daysOfWeek, evts[j].endTime)
								  });
							  }
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
							  events: eventsArr
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
							$(container).append($(template(data).trim()));
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
	
	$('#availability input[name="srvc"]').change(function (e){
		$('#availability .services-box').toggle($(this).val() === '0');
		$('#availability .services-box select').prop('disabled', $(this).val() === '-1');
	});

	$('#availability input[name="daysOfWeek"]').change(function (e){
		var isChecked, tr;

		isChecked = $(this).prop('checked')
		tr = $(this).closest('tr')

		$('select', tr).prop('disabled', !isChecked);
	});
	
	$('#availability').submit(function (e){
		e.preventDefault();
		var serviceId;
		 
		 if ($('#availability input[name="srvc"]').val() === "-1") {
			 serviceId = 0; 
		 } else {
			 serviceId = $('#availability select[name="serviceId"]').val();
		 }
		 $('#availability input[name="daysOfWeek"]:checked').each(function (){
			var tr, daysOfWeek;

			tr = $(this).closest('tr');
			daysOfWeek = parseInt($(this).val(), 10);
			eventsArr.push({
				  id: eventsArr.length,
				  title: 'Service Id : '+serviceId,
				  allDay: false,
				  start: convertToCalEvnt(daysOfWeek, $('select[name="startTime"]', tr).val()),
				  end: convertToCalEvnt(daysOfWeek, $('select[name="endTime"]', tr).val())
			});
			calendar.fullCalendar('renderEvent', eventsArr[eventsArr.length - 1]);
		 });

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
				  $('#addspecialist .btn-success').removeAttr('disabled');
			  },
			  success: function (response){
				 var serviceId;
				 
				 if ($('#availability .services-box').val() === -1) {
					 serviceId = 0; 
				 } else {
					 serviceId = $('#availability .services-box select').val();
				 }
				 $('#availability input[name="daysOfWeek"]:checked').each(function (){
					var tr = $(this).closest('tr') ;

					calendar.fullCalendar('renderEvent', {
						  title: 'Service Id : '+serviceId,
						  allDay: false,
						  start: convertToCalEvnt($(this).val(), $('select[name="startTime"]', tr).val()),
						  end: convertToCalEvnt($(this).val(), $('select[name="endTime"]', tr).val())
					});
				 });

				 $('html').scrollTop(0);
				 $('#page-status').html('Successfully added')
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