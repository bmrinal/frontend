var wp = wp || {};

$(function (){
	wp.mynav = {};
	wp.mynav.load = function (info){
		$.ajax({
			  url: 'template/mynav.handlebars',
			  dataType: 'html',
			  success: function(resp) {
				var tData, template;
				tData = info.data;
				template = Handlebars.compile(resp);
				$(info.targetSelector).html(template(tData));
			  }
		});
	};
});