var wp = wp || {};

wp.overlay = function (){
	var openOly, closeOly;

	//setting the overlay height as same as view port height
	$('#wp-oly').css('min-height', $(window).height());

	openOly = function (){
		$('#wp-main').hide();
		$('#wp-oly').addClass('open');
		wp.util.scrollToTop();
	};

	closeOly = function (){
		$('#wp-main').show();
		$('#wp-oly').removeClass('open');
	};

	$('#wp-oly').on('click', function(e){
		var t = $(e.target);
		
		if (t.is('.wp-oly-close') || t.parent('body').length > 0) {
			e.preventDefault();
			closeOly();
		}
	});
	
	$(document).on('keyup', function(e){
		if (e.which == 27 ) {
			closeOly();
		}
	});
	
	return {
		open: openOly,
		close: closeOly,
		setContent: function (html){
			$('#wp-oly .wp-oly-body').html(html);
		}
	}
}();