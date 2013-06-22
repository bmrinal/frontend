var wp = wp || {};

wp.dateUtil = {};

wp.dateUtil.parseDate = function(dateStr){
	var day, month, year, hour, min, sec, re, dateArr;

	re = /^(\d{1,2})(-)(\d{1,2})(-)(\d{4})( )(\d{2})(:)(\d{2})(:)(\d{2})$/;
	
	dateArr = dateStr.match(re);
	year = parseInt(dateArr[5], 10);
	month = parseInt(dateArr[1], 10)-1;
	day = parseInt(dateArr[3], 10);
	hour = parseInt(dateArr[7], 10);
	min = parseInt(dateArr[9], 10);
	sec = parseInt(dateArr[11], 10);
	
	return new Date(year, month, day, hour, min, sec);
}