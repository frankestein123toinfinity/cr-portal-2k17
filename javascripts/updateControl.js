app.controller('updateControl', ['$scope','$rootScope','$location','$resource','Facebook', function($scope,$rootScope,$location,$resource,Facebook){
	
	$scope.showUpdatePage = false;
	$scope.user = {};
	
	$scope.invalidPhone = function(){
		return !$scope.user.phone.match(/^\d{10}$/);
	};

	$scope.invalidWhatsapp = function(){
		return !$scope.user.whatsapp.match(/^\d{10}$/);
	};

	Facebook.getLoginStatus(function(response){
		if(response.status!='connected') {
			Materialize.toast("Please login first",2000);
			$location.url('/');
		} 
		else{
			Facebook.api('/me',function(res){
				var User = $resource('/api/userdata/:id', {id:res.id});
				User.query({},function(user){
					if(!user.length) {		//no user registered
						Materialize.toast("Please register yourself first!",2000);
						$location.url('/home');
					}
					else{
						$scope.user = user[0];
						$scope.showUpdatePage = true;
					}	
				});
			});
		}
	});

	
	$scope.saveDetails = function(){
		var User = $resource('/api/userdata/:id',{id:$scope.user.facebookID},{update:{method:'PUT'}});
		User.update($scope.user,function(){
			Materialize.toast("Your details have been updated!",2000);
			$location.url('/home');		//reload the page
		});
	};

	$scope.goHome = function(){
		$location.url('/home');
	};

}]);
