
// application name
var appName = "sChatApp";
// application main module creation
var sChatApp = angular.module(appName);


// home controller
sChatApp.controller("homeController", ["$scope", "$cookies", "RestServices", "$state", 
	function($scope, $cookies, RestServices, $state){
		// logout the user from sight
		$scope.logout = function(){
			$cookies.remove("userId");
			RestServices.query("POST", "logout",{}, {},{}, function(data){
				$state.go("home");
			})
		};
		// check for user logged in or not. if user not logged in it return false
		$scope.checkLoginStatus = function(){
			var userId = $cookies.get("userId");
			return angular.isDefined(userId) && userId.length;
		}
}]);
// users controller
sChatApp.controller("usersController",["$scope", "$cookies", "RestServices", "$state", 
	function($scope, $cookies, RestServices, $state){
		$scope.usersList = [];
		// getting users list
		RestServices.query("GET", "users", {},{},{},null)
		.then(function(data){
			var usersList = angular.fromJson(data.data);
			usersList.UsersList.splice(usersList.UsersList.indexOf($cookies.get("userId")),1);
			$scope.usersList = usersList.UsersList;
		});

}]);
// registration controller
sChatApp.controller("registerController", ["$scope", "RestServices","$timeout", "$state", "growl","$cookies",
	function($scope, RestServices, $timeout, $state, growl, cookies){
	$scope.user = {
		userId : "",
		password : ""
	};
	$scope.heading = "Registraion";
	// create new user
	$scope.submit = function(){
		RestServices.query("POST", "register",{}, $scope.user,{}, function(data){
			$scope.message = angular.fromJson(data);
		}).then(function(data){
			if(data.status == 200){
				cookies.put("userId",$scope.user.userId);
				growl.success($scope.message);
				$timeout(function(){$state.go("messages");},1000);				
			}
		}, function(error){
			var err = angular.fromJson($scope.message);
			$scope.message = err.err;
			growl.error($scope.message);
		});
	}
	
	
}]);
// login controller
sChatApp.controller("loginController", ["$scope", "RestServices","$timeout", "$state", "growl", "$cookies",
	function($scope, RestServices, $timeout, $state, growl, cookies){
	$scope.user = {
		userId : "",
		password : ""
	};
	$scope.heading = "Login";
	// login user 
	$scope.submit = function(){
		RestServices.query("POST", "login",{}, $scope.user,{}, function(data){
			$scope.message = angular.fromJson(data);
		}).then(function(data){
			if(data.status == 200){
				cookies.put("userId",$scope.user.userId);
				growl.success($scope.message);
				$timeout(function(){$state.go("messages");},1000);				
			}
		}, function(error){
			var err = angular.fromJson($scope.message);
			$scope.message = err.err;
			growl.error($scope.message);
		});
	}
}]);
// messages Controller
sChatApp.controller("messagesController", ["$scope", "RestServices", "$cookies","growl", "$state",
	function($scope, RestServices, $cookies, growl, $state){

	var userObject = {
		"userId" : $cookies.get("userId")
	};
	$scope.chatHistory = [];

	RestServices.query("POST", "message/uniqueuser",{}, userObject,{}, null)
	.then(function(data){
		if(data.status == 200){
			$cookies.put("userId",userObject.userId);
			var response = angular.fromJson(data.data);
			$scope.chatHistory = response.chat_history_user_list;
		}
	}, function(error){
		growl.error(error.data);
	});
}]);

sChatApp.controller('conversationsController',["$scope", "RestServices", "$stateParams","growl","$state", "$cookies", "$filter",
	function($scope, RestServices, $stateParams, growl, $state, $cookies, $filter){
		var user = $stateParams.user;
		var filterDate = $filter('date')(new Date(), 'yyyy-MM-dd');
		var toDay = new Date(filterDate);
		var toDayFlag = false;

		$scope.sentData = {
		  "fromUserId" : $cookies.get("userId"),
		  "toUserId" : user,
		  "page" : 1,
		  "limit" : 5
		};
		
		angular.element("html").height("102%");
		$scope.isLoading = false;
		$scope.conversations = [];
		$scope.message = "";
		$scope.showingDate = angular.copy(toDay);
		// show dates in view
		$scope.showChangeDates = function(cDate){
			var filterDate = $filter('date')(cDate, 'yyyy-MM-dd');
			var changeDate = new Date(filterDate);
			if(angular.isUndefined($scope.showingDate)){
				$scope.showingDate = changeDate;
				return true;
			}
			if($scope.showingDate.getTime() != changeDate.getTime()){
				$scope.showingDate = changeDate;
							
				if($scope.showingDate.getTime() == toDay.getTime() && !toDayFlag){
					toDayFlag = true;
					return false;
				}
				return true;
			}
			return false;
		};
		// send message
		$scope.sendMessage = function(message){
			if(message.length){
				var message = {
					fromUserId:$scope.sentData.fromUserId,
					toUserId : $scope.sentData.toUserId,
					message : message
				}
				RestServices.query("POST", "message",{}, message,{}, null)
				.then(function(data){
					$scope.message = "";
					var response = angular.fromJson(data.data);
					$scope.conversations.push(response["Message Sent"]);
				}, function(error){
					growl.error(error.data);
				});
			}
		};
		// get users conversation
		$scope.getConversations = function(){
			if(!$scope.isLoading){
				$scope.isLoading = true;
				RestServices.query("POST", "message/btw",{}, $scope.sentData,{}, null)
				.then(function(data){
					$scope.isLoading = false;
					if(data.status == 200){
						var response = angular.fromJson(data.data);
						$scope.conversations = $scope.conversations.concat(response.history);
						if(response.history.length){
							$scope.sentData.page++;
						}
					}
				}, function(error){
					$scope.isLoading = false;		
					growl.error(error.data);			
				});

			}
		};
}]);