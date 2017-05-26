app.controller('ideasControl', ['$scope','$rootScope','$location','$resource','Facebook', function($scope,$rootScope,$location,$resource,Facebook){
	
	$scope.idea = {};
	$scope.user = {};
	$scope.showIdeaForm = false;
	$scope.acceptedIdeas = $scope.rejectedIdeas = $scope.pendingIdeas = [];
	
	$scope.resetIdea = function(){
		$scope.idea = {};
	};

	$scope.submitIdea = function(){
		$scope.userIdea = {
			name: $scope.user.name,
			facebookID: $scope.user.facebookID,
			title:$scope.idea.title,
			category:$scope.idea.category,
			message:$scope.idea.message,
			secure:true
		};

		var Idea = $resource('/api/ideas');
		Idea.save($scope.userIdea);
		$scope.userIdea = $scope.idea = {};
		Materialize.toast("Idea submitted! You are awesome!",2000);
		$location.url('/home/user');
	};

	//Init
	Facebook.getLoginStatus(function(response){
		if(response.status!='connected') {
			Materialize.toast('Please login first!',2000);
			$location.url('/home');
		}
		else {
			Facebook.api('/me',function(response){				
				var checkid = response.id;
				var User = $resource('/api/userdata/:id',{id:checkid});
				User.query({},function(res){									//user not registered
					if(!res.length) {
						Materialize.toast('You need to register first',2000);
						$location.url('/home');
					}
					else{													//user registered
						$scope.user = res[0];
						console.log($scope.user);
						//// find out all the user previous ideas, only then load the page
						var Ideas = $resource('/api/ideas/:id',{id:$scope.user.facebookID});
						Ideas.query({},function(myideas){
							$scope.prevIdeas = myideas;
							$scope.pendingIdeas = $scope.prevIdeas.filter(function(val){
								return val.pending;
							});
							$scope.acceptedIdeas = $scope.prevIdeas.filter(function(val){
								return val.accepted;
							});
							$scope.rejectedIdeas = $scope.prevIdeas.filter(function(val){
								return val.rejected;
							});
							$scope.showIdeaForm = true;
						}); 
					}
				});
			});
		}
	});

}]);
