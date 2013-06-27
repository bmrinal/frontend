$(function (){
	var currServiceId;

	$.ajax({
	  url: wp.cfg['REST_HOST']+'/resources/user',
	  dataType: 'json',
	  cache: false,
	  xhrFields: {
		  withCredentials: true
	  },
	  success: function (response){
		  if(response && response.userId){
			  if (!response.isVendor){
				  $('#page-status').html('Sorry, please register as a vendor to view this page.').addClass('alert-error').show();
				  $('#view .loading').hide();
				  return;
			  }
			  wp.mynav.load({
				  targetSelector: '#top-nav',
				  data :{tab: [{
						  'text': 'My Business',
						  'href': '/mybusiness.html'
					  }, {
						  'text': 'Services',
						  'href': '#',
						  'active': true
					  }, {
						  'text': 'Schedule',
						  'href': '/myschedule.html'
					  }, {
						  'text': 'Clients',
						  'href': '/myclients.html'
					  }, {
						  'text': 'Settings',
						  'href': '/myprofile.html'
					  }]
				  },
			 });
			$.ajax({
				  url: wp.cfg['REST_HOST']+'/resources/services/myservices/',
				  cache: false,
				  dataType: "json",
				  xhrFields: {
					  withCredentials: true
				  },
				  success: function (response){
					  var template, data, servicesHTML, container;
					  
					  container = $('#view .services .span3');
					  data = {};
					  data.service = response;
					  data['REST_HOST'] = wp.cfg['REST_HOST'];
					  template = Handlebars.compile($("#TL_services").html());
					  servicesHTML = $('<div/>').html($(template(data)));
					  servicesHTML = servicesHTML.find('.service');

					  $.each(servicesHTML, function (ind, val){
						  $(container[ind % 4]).append(val);
					  });
					  $('#view .loading').hide();
				  },
				  error: function (){
					  $('#view .services').html('<div class="alert alert-error">'
							  + '<button type="button" class="close" data-dismiss="alert">&times;</button>'
							  + 'Sorry, unable to load categories'
							  + '</div>'
					  );
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

	$('#view').on('click', '.service', function(e){
		var source, template, data, html;

		e.preventDefault();
		source = $('#TL_requestSrvc').html();
		template = Handlebars.compile(source);
		data = {};
		data.name = $('.srvc-name', this).text();
		$('#srvc-details').html(template(data));
		currServiceId = $(this).data('srvcid'); //store service in closure for easy modal access
		$('#srvc-details').modal();
	});

	$('#srvc-details').on('shown', function (){
		if (currServiceId) {
			$.ajax({
			  url: wp.cfg['REST_HOST']+'/resources/services/'+currServiceId,
			  cache: false,
			  dataType: "jsonp",
			  complete: function (){
				  $('#srvc-details .frm-ldg').hide();
			  },
			  success: function (response){
				  var template, data;
				  template = response.htmlTemplate;
				  data = $.parseJSON(response.metaDataInstance);

				  if (data && template) {
					  $('#srTemplate').html(Mustache.to_html(template, data));
				  } else {
					  $('#srTemplate').html('<div class="alert  alert-error">'
							  + 'Sorry, unable to load service details'
							  + '</div>'
					  );
				  }
			  },
			  error: function (){
				  $('#srTemplate').html('<div class="alert alert-error">'
						  + '<button type="button" class="close" data-dismiss="alert">&times;</button>'
						  + 'Sorry, unable to load service details'
						  + '</div>'
				  );
			  }
			});
		}
	});

});