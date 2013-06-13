$(function (){
	$.ajax({
	  url: wp.cfg['REST_HOST']+'/resources/vendors/list',
	  cache: false,
	  dataType: "json",
	  complete: function (){
		  $('#view .loading').hide();
	  },
	  success: function (response){
		  var source, template, data, vendorsHTML, container;
		  container = $('#view .vendors');
		  source = $('#TL_vendors').html();
		  template = Handlebars.compile(source);
		  data = {};
		  data.vendor = response;
		  data['REST_HOST'] = wp.cfg['REST_HOST'];
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