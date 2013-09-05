var wp = wp || {};

wp.overlay = function (){
	var openOly, closeOly, isOpen;

	//setting the overlay height as same as view port height
	$('#wp-oly, #wp-oly .wp-oly-body').css('min-height', $(window).height());

	isOpenOly = function (){
		return isOpen;
	}
	openOly = function (){
		$('#wp-main').hide();
		$('#wp-oly').addClass('open');
		wp.util.scrollToTop();
		isOpen = true;
	};

	closeOly = function (){
		$('#wp-main').show();
		$('#wp-oly').removeClass('open');
		isOpen = false;
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
		isOpen: isOpenOly,
		open: openOly,
		close: closeOly,
		setContent: function (html){
			$('#wp-oly .wp-oly-body').html(html);
		}
	}
}();