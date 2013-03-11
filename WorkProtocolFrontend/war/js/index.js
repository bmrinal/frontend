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

		  /* response = {
				    'category': [{
				        "id": "35003",
				        "name": "EventManagement",
				        "leaf": {
				            'category': [{
				                "id": "31010",
				                "name": "AllHands"
				            }, {
				                "id": "35004",
				                "name": "Birthdays"
				            }, {
				                "id": "40003",
				                "name": "PressMeet"
				            }]
				        }
				    }, {
				        "id": "37007",
				        "name": "Catering",
				        "leaf": {
				            'category': [{
				                "id": "34002",
				                "name": "Italian"
				            }, {
				                "id": "38007",
				                "name": "Mexican"
				            }]
				        }
				    }, {
				        "id": "35003",
				        "name": "EventManagement",
				        "leaf": {
				            'category': [{
				                "id": "31010",
				                "name": "AllHands"
				            }, {
				                "id": "35004",
				                "name": "Birthdays"
				            }, {
				                "id": "40003",
				                "name": "PressMeet"
				            }]
				        }
				    }, {
				        "id": "35003",
				        "name": "EventManagement",
				        "leaf": {
				            'category': [{
				                "id": "31010",
				                "name": "AllHands",
				                "leaf": {
						            'category': [{
						                "id": "31010",
						                "name": "AllHands"
						            }, {
						                "id": "35004",
						                "name": "Birthdays"
						            }, {
						                "id": "40003",
						                "name": "PressMeet"
						            }]
						        }
				            }, {
				                "id": "35004",
				                "name": "Birthdays"
				            }, {
				                "id": "40003",
				                "name": "PressMeet"
				            }]
				        }
				    }, {
				        "id": "35003",
				        "name": "EventManagement",
				        "leaf": {
				            'category': [{
				                "id": "31010",
				                "name": "AllHands"
				            }, {
				                "id": "35004",
				                "name": "Birthdays"
				            }, {
				                "id": "40003",
				                "name": "PressMeet"
				            }]
				        }
				    }]
				}; */
		  categorySource = $("#TL_categories").html();
		  Handlebars.registerPartial('leaf', categorySource);
		  template = Handlebars.compile(categorySource);
	
		  $('#view .categories').html(template(response.category));
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