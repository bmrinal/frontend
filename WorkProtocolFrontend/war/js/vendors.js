$(function (){
	$.ajax({
	  url: "http://work0protocol.appspot.com/resources/vendors/list",
	  cache: false,
	  dataType: "jsonp",
	  complete: function (){
		  $('#view .loading').hide();
	  },
	  success: function (response){
		  var source, template;
		  source = $('#TL_vendors').html();
		  template = Handlebars.compile(source);
		  $('#view .vendors').html(template(response)); 
	  },
	  error: function (){
		  $('#view .vendors').html('<div class="alert alert-error">'
				  + '<button type="button" class="close" data-dismiss="alert">&times;</button>'
				  + 'Sorry, unable to load vendors'
				  + '</div>'
		  );
	  }
	});
});