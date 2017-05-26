app.controller('leaderboardControl', ['$scope','$rootScope','$location','$resource','Facebook', function($scope,$rootScope,$location,$resource,Facebook){
	
	$scope.showLeaderboardDetails = false;

	Facebook.getLoginStatus(function(response){
		if(response.status!='connected') {
			Materialize.toast("Please login first",2000);
			$location.url('/');
		}
		else{
			Facebook.api('/me',function(response){				
				var checkid = response.id;
				var User = $resource('/api/userdata/:id',{id:checkid});
				User.query({},function(res){									//user not registered
					if(!res.length) {
						Materialize.toast('You need to register first',2000);
						$location.url('/home');
					}
					else{													//user registered
						$scope.showLeaderboardDetails = true; 
					}
				});
			});
		}
	});
}]);

app.controller('leaderMain', ['$scope','$rootScope','$location','$resource','Facebook', function($scope,$rootScope,$location,$resource,Facebook){
	$scope.showMain = false;
	$scope.leaders = null;

	Facebook.getLoginStatus(function(response){
		if(response.status=='connected') {
			var User = $resource('/api/leaderboard/all/:id/:method', {id:'secure',method:'main'});
			User.query({},function(res){
				$scope.leaders = res;
				$scope.showMain = true;
			});
		}
	});
}]);

app.controller('leaderSub', ['$scope','$rootScope','$location','$resource','Facebook', function($scope,$rootScope,$location,$resource,Facebook){
	
	$scope.showSub = false;
	$scope.leaders = null;

	Facebook.getLoginStatus(function(response){
		if(response.status=='connected') {
			var User = $resource('/api/leaderboard/all/:id/:method', {id:'secure',method:'sub'});
			User.query({},function(res){
				$scope.leaders = res;
				$scope.showSub = true;
			});
		}
	});
}]);
