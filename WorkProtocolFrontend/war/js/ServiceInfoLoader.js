var wp = wp || {};

wp.helpers = {};

wp.helpers.loadServiceInfo = function (serviceId, targetSelector){
	$.ajax({
		  url: wp.cfg['REST_HOST']+'/resources/services/' + serviceId,
		  cache: false,
		  dataType: "jsonp",
		  success: function (response){
			  wp.util.templateLoader({'templateUrl': 'template/serviceinfo.handlebars',
					  'data': response,
					  'targetSelector': targetSelector
			  });
		  },
		  error: function (){}
	});
};