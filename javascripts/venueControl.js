app.controller('venueControl', ['$scope','$rootScope','$resource','$location','Facebook', function($scope,$rootScope,$resource,$location,Facebook){
	
	$scope.showVenueBox = false;
	$scope.user = {};
	$scope.venue = {};

	Facebook.getLoginStatus(function(response){
		if(response.status!='connected') {
			Materialize.toast("Please login first",2000);
			$location.url('/');
		}
		else{
			Facebook.api('/me',function(res){
				$scope.user.facebookID = res.id;
				var User = $resource('/api/userdata/:id',{id:$scope.user.facebookID});
				User.query({},function(data){
					if(!data.length) {
						Materialize.toast("Please register your details first!",2000);
						$location.url('/home');
					}
					else{
						$scope.user = data[0];
						$scope.showVenueBox = true;
					}
				});
			});
		}
	});

	$scope.goHome = function(){
		$location.url('/home/user');
	};

	$scope.sendVenueDetails = function(){
		var Venue = $resource('/api/venue');
		$scope.venue.secure = true;
		$scope.venue.username = $scope.user.name;
		$scope.venue.facebookID = $scope.user.facebookID;
		Venue.save($scope.venue);
		Materialize.toast("Venue details sent successfully!",2000);
		$location.url('/home/user');
	};

}]);
