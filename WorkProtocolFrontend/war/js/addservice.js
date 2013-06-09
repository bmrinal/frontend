$(function (){
	$.ajax({
	  url: "http://work0protocol.appspot.com/resources/user",
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
				  url: "http://work0protocol.appspot.com/resources/categories/list",
				  cache: false,
				  dataType: "jsonp",
				  complete: function (){
					  $('#view .loading').hide();
				  },
				  success: function (response){
					  var template, categorySource;
					  categorySource = $("#TL_categories").html();
					  Handlebars.registerPartial('leaf', categorySource);
					  template = Handlebars.compile(categorySource);
				
					  $('#view .categories').html(template(response));
				  },
				  error: function (){
					  $('#view .categories').html('<div class="alert alert-error">'
							  + '<button type="button" class="close" data-dismiss="alert">&times;</button>'
							  + 'Sorry, unable to load categories'
							  + '</div>'
					  );
				  }
				});
		  } else {
			  window.location.href = 'http://work0protocol.appspot.com/SignIn?ru=' + window.location.href;
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