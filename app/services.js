// rest calls for all services
sChatApp.factory("RestServices", ["APP_CONFIG","$http", function RestServices(APP_CONFIG, $http){
	var restService = {};
	var urlString = APP_CONFIG.SCHEME + "://" + APP_CONFIG.URL + ":" + APP_CONFIG.PORT +"/" + APP_CONFIG.API + "/";
	restService.query = function(method, url, params, data, headers, transformResponse, withCredentials){
		url = urlString + url;
		return $http({
			method : method,
			url : url, 
			params : params,
			data : data,
			headers : headers,
			transformResponse : transformResponse
		});
	};

	return restService;

}]);

sChatApp.factory('spiniInterceptor', ['$log',"$cookies","$window", function($log, $cookies, $window) {  
    var myInterceptor = {
        responseError : function(error){
        	$log.debug(error);
        	if(error.status == 403){
				$cookies.remove("userId");
				$window.location.reload();
			}
			return error;
        }
    };

    return myInterceptor;
}]);