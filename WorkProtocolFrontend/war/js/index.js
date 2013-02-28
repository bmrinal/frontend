$(function (){
	$.ajax({
	  url: "http://work0protocol.appspot.com/resources/categories/list",
	  cache: false,
	  dataType: "jsonp",
	  complete: function (){
		  $('#view .loading').hide();
	  },
	  success: function (response){
		  var template, data;
		  template = $('#TL_categories').html();
		  $('#view .categories').html(Mustache.to_html(template, response)); 
	  },
	  error: function (){
		  $('#view .categories').html('<div class="alert alert-error">'
				  + '<button type="button" class="close" data-dismiss="alert">&times;</button>'
				  + 'Sorry, unable to load categories'
				  + '</div>'
		  );
	  }
	});
});