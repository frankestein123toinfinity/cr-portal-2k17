app.controller('prizesControl', ['$scope','$rootScope','$location','$resource','Facebook', function($scope,$rootScope,$location,$resource,Facebook){

	$scope.showPrizesDetails = false;
	$scope.winners = [];

	Facebook.getLoginStatus(function(response){
		if(response.status!='connected') {
			Materialize.toast("Please login first!",2000);
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
					else{				
						var Winners = $resource('/api/winners');
						Winners.query({},function(winners){
							$scope.winners = winners;
							$scope.showPrizesDetails = true; 
						});									//user registered
					}
				});
			});
		}
	});
}]);