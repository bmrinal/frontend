$(function (){
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
});