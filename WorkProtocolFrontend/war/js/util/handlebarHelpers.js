Handlebars.registerHelper('one', function(context, options) {
	var data;
	if ($.isArray(context) && context.length > 0) {
		data = context[0];
	    return options.fn(data);
	} else {
		options.inverse(this);
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

/* https://github.com/danharper/Handlebars-Helpers */

/**
 * If Equals
 * if_eq this compare=that
 */
Handlebars.registerHelper('if_eq', function(context, options) {
    if (context == options.hash.compare)
        return options.fn(this);
    return options.inverse(this);
});

/**
 * Unless Equals
 * unless_eq this compare=that
 */
Handlebars.registerHelper('unless_eq', function(context, options) {
    if (context == options.hash.compare)
        return options.inverse(this);
    return options.fn(this);
});


/**
 * If Greater Than
 * if_gt this compare=that
 */
Handlebars.registerHelper('if_gt', function(context, options) {
    if (context > options.hash.compare)
        return options.fn(this);
    return options.inverse(this);
});

/**
 * Unless Greater Than
 * unless_gt this compare=that
 */
Handlebars.registerHelper('unless_gt', function(context, options) {
    if (context > options.hash.compare)
        return options.inverse(this);
    return options.fn(this);
});


/**
 * If Less Than
 * if_lt this compare=that
 */
Handlebars.registerHelper('if_lt', function(context, options) {
    if (context < options.hash.compare)
        return options.fn(this);
    return options.inverse(this);
});

/**
 * Unless Less Than
 * unless_lt this compare=that
 */
Handlebars.registerHelper('unless_lt', function(context, options) {
    if (context < options.hash.compare)
        return options.inverse(this);
    return options.fn(this);
});


/**
 * If Greater Than or Equal To
 * if_gteq this compare=that
 */
Handlebars.registerHelper('if_gteq', function(context, options) {
    if (context >= options.hash.compare)
        return options.fn(this);
    return options.inverse(this);
});

/**
 * Unless Greater Than or Equal To
 * unless_gteq this compare=that
 */
Handlebars.registerHelper('unless_gteq', function(context, options) {
    if (context >= options.hash.compare)
        return options.inverse(this);
    return options.fn(this);
});


/**
 * If Less Than or Equal To
 * if_lteq this compare=that
 */
Handlebars.registerHelper('if_lteq', function(context, options) {
    if (context <= options.hash.compare)
        return options.fn(this);
    return options.inverse(this);
});

/**
 * Unless Less Than or Equal To
 * unless_lteq this compare=that
 */
Handlebars.registerHelper('unless_lteq', function(context, options) {
    if (context <= options.hash.compare)
        return options.inverse(this);
    return options.fn(this);
});

/**
 * Convert new line (\n\r) to <br>
 * from http://phpjs.org/functions/nl2br:480
 */
Handlebars.registerHelper('nl2br', function(text) {
    text = Handlebars.Utils.escapeExpression(text);
    var nl2br = (text + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + '<br>' + '$2');
    return new Handlebars.SafeString(nl2br);
});