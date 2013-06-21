Handlebars.registerHelper('one', function(context, options) {
	var data;
	if($.isArray(context) && context.length > 0){
		data = context[0];
	    return options.fn(data);
	}
});