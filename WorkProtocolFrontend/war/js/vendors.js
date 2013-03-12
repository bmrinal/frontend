$(function (){
	$.ajax({
	  url: "http://work0protocol.appspot.com/resources/vendors/list",
	  cache: false,
	  dataType: "jsonp",
	  complete: function (){
		  $('#view .loading').hide();
	  },
	  success: function (response){
		  var source, template, data, vendorsHTML, container;
		  container = $('#view .vendors');
		  source = $('#TL_vendors').html();
		  template = Handlebars.compile(source);
		  data = {};
		  data.vendor = response.vendors || [];
		  vendorsHTML = $(template(data));
		  
		  vendorsHTML.imagesLoaded(function (){
			  container.append(vendorsHTML);
			  container.masonry({
			    // options
			    itemSelector : '.vendor',
			    columnWidth : 242
			  }).each(function (){
				  $('#view .loading').hide();
			  });
		  });
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