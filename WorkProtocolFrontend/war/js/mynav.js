var wp = wp || {};

$(function (){
	wp.mynav = {};
	wp.mynav.data = {
			'vendor' :[{'id' : 'settings',
							'text': 'My Business',
							'href': '/myprofile.html'				
						},
						{'id' : 'specialists',
							'text': 'Specialists',
							'href': '/addspecialist.html'				
						},
						{'id' : 'services',
							'text': 'Services',
							'href': '/myservices.html'
						},
						{'id' : 'clients',
							'text': 'Appointments',
							'href': '/myclients.html'
						},
						{'id' : 'business',
							'text': 'Requests',
							'href': '/mybusiness.html'
						},
						{'id' : 'schedule',
							'text': 'Calendar',
							'href': '/myschedule.html'
						}
				  ], 
			'user' : [
			          { 'id' : 'settings',
			        	  'text': 'Profile',
			        	  'href': '/myprofile.html'
			          },
			          { 'id' : 'clients',
			        	  'text': 'Appointments',
			        	  'href': '/myclients.html'
			          },
			          {'id' : 'business',
			        	  'text': 'Requests',
			        	  'href': '/mybusiness.html'
			          },
			          { 'id' : 'schedule',
			        	  'text': 'Calendar',
			        	  'href': '/myschedule.html'
			          }
				  	]
	};

	wp.mynav.load = function (info, activeTab){
		var navData = {};
		
		if (info.isVendorAdmin) {
			info.data = $.extend({}, wp.mynav.data['vendor']);
		} else {
			info.data = $.extend({}, wp.mynav.data['user']);
		}

		$.each(info.data, function (i, v){
			if (v.id === activeTab) {
				info.data[i].active = true;
			}
		});

		$.ajax({
			  url: 'template/mynav.handlebars',
			  cache: false,
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