$(document).ready(function() {

	var date = new Date();
	var d = date.getDate();
	var m = date.getMonth();
	var y = date.getFullYear();
	
	var calendar = $('#calendar').fullCalendar({
		header: {
			right: 'agendaWeek'
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
		select: function(start, end, allDay) {
			var title = prompt('Event Title:');
			if (title) {
				calendar.fullCalendar('renderEvent',
					{
						id: title,
						title: title,
						start: start,
						end: end,
						allDay: allDay
					},
					true // make the event "stick"
				);
			}
			calendar.fullCalendar('unselect');
		},
		eventClick: function(event, jsEvent, view){
			calendar.fullCalendar('removeEvents',event.id);
		},
		events: []
	});
	
});