$(function (){
	
	$('#formTarget').submit(function (e){
		e.preventDefault();
		$('#view .loading').show();
		$.ajax({
			  url: "http://work0protocol.appspot.com/resources/vendors/",
			  cache: false,
			  params: $(this).serialize(),
			  dataType: "jsonp",
			  complete: function (){
				  $('#view .loading').hide();
			  },
			  success: function (response){
				 $('#view .status').html('Profile created successfully');
			  },
			  error: function (){
				  $('#view .status').html('Sorry, unable to create profile');
			  }
		});
	});

});