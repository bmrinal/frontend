$(function (){
	var profileId, userType, calendar;

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
						  var date, firstDayOfWeek, d, m, y, evntStartDate, evntEndDate, eventsArr, evts;

						  date = new Date();
						  firstDayOfWeek = new Date(date.setDate(date.getDate() - date.getDay())); //first day of the week
						  eventsArr = [];

						  for (var i=0; i<response.length; i++){
							  evts = response[i].startTimesEndTimes;
							  
							  for (var j=0; j<evts.length; j++){
								  evntStartDate = new Date(firstDayOfWeek);
								  evntStartDate.setDate(firstDayOfWeek.getDate() + evts[j].daysOfWeek);
								  evntStartDate.setHours(evts[j].startTime / 60);
								  evntStartDate.setMinutes(0);
								  evntStartDate.setSeconds(0);
								  
								  evntEndDate = new Date(firstDayOfWeek);
								  evntEndDate.setDate(firstDayOfWeek.getDate() + evts[j].daysOfWeek);
								  evntEndDate.setHours(evts[j].endTime / 60);
								  evntEndDate.setMinutes(0);
								  evntEndDate.setSeconds(0);
								  
								  eventsArr.push({
									  id: eventsArr.length,
									  title: 'Service Id : '+response[i].serviceId,
									  allDay: false,
									  start: evntStartDate,
									  end: evntEndDate
								  });
							  }
						  }

						  calendar = $('#calendar').fullCalendar({
							  header: {
								  left: '',
								  center: '', 
								  right: ''
							  },
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
				 var statusMsg;

				 $('html').scrollTop(0);
				 $('#page-status').html('Successfully added')
					 .addClass('alert-success')
					 .show();
				 
				 //calendar.fullCalendar('renderEvent', );
			  },
			  error: function (){
				 $('#page-status').html('Sorry, unable to process your request at this time')
	 							.addClass('alert-error')
	 							.show();
			  }
		});		
	});
});