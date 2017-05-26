app.controller('instructionsControl', ['$scope','$rootScope','$location','$resource','Facebook', function($scope,$rootScope,$location,$resource,Facebook){
	
	$scope.showInstructions = false;

	Facebook.getLoginStatus(function(response){
		if(response.status!='connected') {
			Materialize.toast('Please login first!',2000);
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
						$scope.showInstructions = true; 
					}
				});
			});
		}
	});

}]);
