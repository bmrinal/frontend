var wp = wp || {};

$(function (){
	wp.mynav = {};
	wp.mynav.data = {};

	wp.mynav.data[wp.constants.VENDORADMIN] = [{'id' : 'profile',
			'text': 'Profile',
			'href': '/myprofile.html'				
		},{'id' : 'settings',
			'text': 'My Business',
			'href': '/mysetting.html'				
		},
		{'id' : 'specialists',
			'text': 'Specialists',
			'href': '/myspecialists.html'				
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
	];

	wp.mynav.data[wp.constants.VENDORUSER] = [{'id' : 'profile',
			'text': 'Profile',
			'href': '/myprofile.html'				
		},{'id' : 'services',
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
	];
	
	wp.mynav.data[wp.constants.USER] = [
      { 'id' : 'profile',
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
  	];

	wp.mynav.load = function (info, activeTab){
		var navData = {}, userType;

		userType = info.userType;
		switch (userType){
			case wp.constants.VENDORADMIN :
				info.data = $.extend({}, wp.mynav.data['vendorAdmin']);
				break;
			case wp.constants.VENDORUSER :
				info.data = $.extend({}, wp.mynav.data['vendorUser']);
				break;
			default :
				info.data = $.extend({}, wp.mynav.data['user']);
		};

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