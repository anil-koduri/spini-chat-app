
// application name
var appName = "sChatApp";
// application main module creation
var sChatApp = angular.module(appName);

// filter for show the date information
sChatApp.filter("spiniChatDate", function($filter){
	return function(data){
		var disPlayDate = $filter("date")(data,'yyyy-MM-dd');
		var elemDate = new Date(disPlayDate);
		var filterDate = $filter('date')(new Date(), 'yyyy-MM-dd');
		var currentDate = new Date(filterDate);
		var daysDiffrence = Date.daysBetween(elemDate, currentDate);
		switch(daysDiffrence){
			case 0:
				return 'Today';
			case 1:
				return 'Yesterday';
			default :
				if(daysDiffrence < 7){
					return daysDiffrence + ' days back';
				} else if(daysDiffrence < 30){
					return Math.round(daysDiffrence/7) + ' weeks back';
				} else {
					return Math.round(daysDiffrence/30) + ' months back';
				}
		}
		return data;
	}
});
