
/**
	to get the diffrence between dates.
	return integer
*/ 
if(!Date.daysBetween){

	Date.daysBetween = function( date1, date2 ) {
	  //Get 1 day in milliseconds
	  var one_day=1000*60*60*24;

	  // Convert both dates to milliseconds
	  var date1_ms = date1.getTime();
	  var date2_ms = date2.getTime();

	  // Calculate the difference in milliseconds
	  var difference_ms = date2_ms - date1_ms;
	    
	  // Convert back to days and return
	  return Math.round(difference_ms/one_day); 
	};
}
// application name
var appName = "sChatApp";
// application main module creation
var sChatApp = angular.module(appName, ['ui.router', 'angular-growl', 'ngCookies', 'infinite-scroll']);
// constants for applications 
sChatApp.constant("APP_CONFIG", {
	"SCHEME" : "http",
    "URL": "52.76.87.166",
    "PORT": "9876",
    "API": "chatspini"
});

// app configuration 
sChatApp.config(["$stateProvider", "$urlRouterProvider","$httpProvider", function(stateProvider, $urlRouterProvider, $httpProvider){
	$httpProvider.defaults.useXDomain = true;
	$httpProvider.defaults.withCredentials = true;
	$httpProvider.interceptors.push('spiniInterceptor');
	$urlRouterProvider
        // If the url is ever invalid, e.g. '/asdf', then redirect to '/' aka the home state
        .otherwise('/home');

    // load messages state if user already logged in
    function goToMessages($state,$cookies, $timeout){
		var userId = $cookies.get("userId");
		if(angular.isDefined(userId) && userId.length){
			$timeout(function() {
				$state.go("messages");
			});
		}
	};
	// load home state if user not login
	function goToHome($state,$cookies,$timeout){
		var userId = $cookies.get("userId");
		if(angular.isUndefined(userId)){
			$timeout(function() {
				$state.go("home");
			});
		}
	};
	// creating states
	stateProvider.state("home",{
		templateUrl :"view/home.html",
		url : "/home",
		controller:"homeController",
		onEnter: goToMessages
	})
	.state("register",{
		templateUrl :"view/registration-form.html",
		url : "/registration",
		controller:"registerController",
		onEnter: goToMessages
	})
	.state("login",{
		templateUrl :"view/registration-form.html",
		url : "/login",
		controller:"loginController",
		onEnter: goToMessages
	})
	.state("messages",{
		templateUrl :"view/messages.html",
		url : "/messages",
		controller:"messagesController",
		onEnter: goToHome
	})
	.state("users",{
		templateUrl :"view/users.html",
		url : "/users",
		controller:"usersController",
		onEnter: goToHome
	})
	.state("conversations",{
		templateUrl :"view/conversations.html",
		url : "/conversation/:user",
		controller:"conversationsController",
		onEnter: goToHome
	});
}]);
