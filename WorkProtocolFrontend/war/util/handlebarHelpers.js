Handlebars.registerHelper('one', function(context, options) {
	var data;
	if ($.isArray(context) && context.length > 0) {
		data = context[0];
	    return options.fn(data);
	}
});

Handlebars.registerHelper('checkbox', function(value, selectValue, options) {
	var data, selected;

	data = {};
	if (value) {
		selected = (value === selectValue);
		data.value = value;
		data.selected = selected;
	    return options.fn(data);
	}
});