$(function (){
	$.ajax({
	  url: "http://work0protocol.appspot.com/resources/user",
	  dataType: 'json',
	  cache: false,
	  xhrFields: {
		  withCredentials: true
	  },
	  success: function (response){
		  var userName, email;
		  if(response && response.userId){
			email = response.email;
			userName = email.split('@');
			$('#user-info span').html(userName);
			$('#user-info a').prop('href', response.signOutUrl + '?ru=' + window.location.protocol + '//' + window.location.host);
			$('#user-info').show();
			  
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
			  window.location.href = response.signInUrl + '?ru=' + window.location.href;
		  }
	  },
	  error: function (e){
		 $('#page-status').html('Sorry, unable to authenticate')
						.addClass('alert-error')
						.show();
		 $('.page-loading').hide();
	  }
	});
});