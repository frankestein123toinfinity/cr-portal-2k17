app.controller('userControl', ['$scope','$rootScope','$location','$resource','Facebook', function($scope,$rootScope,$location,$resource,Facebook){
	
	$scope.showDashboard = false;
	$scope.facebookID;

	Facebook.getLoginStatus(function(response){
		if(response.status!='connected') {
			Materialize.toast("Please login first",2000);
			$location.url('/');
		}
		else {
				Facebook.api('/me',function(response){
					$scope.facebookID = 'rajarshi.saha.90';
					console.log($scope.facebookID);
					var User = $resource('/api/userdata/:id', {id:$scope.facebookID});
					User.query({},function(response){
						if(response.length) {
							Facebook.api('/iitb.moodindigo/feed?fields=message,full_picture,permalink_url&limit=10&since=2016-01-01',function(res){
									/// do something here
									$scope.fbposts = res.data;
									
									// $scope.fbposts = $scope.fbposts.filter(function(val){
									// 	return val.link && val.link.match(/https:\/\/www.facebook.com\/.*/);
									// });
									console.log($scope.fbposts);
									$scope.showDashboard = true;
							});
						}
					});
				});
		}	
	});

	$scope.share = function(link){

		Facebook.ui({
			method:'share',
			href:link
		},function(response){
				console.log(response);
				if(response.error_code) {
					Materialize.toast("Aw! Something wrong happened? Did you change your mind?",2000);
				}
				else if(response.post_id) {
					var postID = String($scope.facebookID) + "_" +String(response.post_id) ;

					var User = $resource('/api/userdata/:id',{id:$scope.facebookID});
					User.query({},function(res){
						$scope.user = res[0];
						$scope.user.shares.push(postID);
						$scope.user.totalShares.push(postID);
						console.log(postID);
						var saveUser = $resource('/api/userdata/:id',{id:$scope.user.facebookID},{update:{method:'PUT'}});
						saveUser.update($scope.user,function(){
							Materialize.toast("Hurray! Post shared successfully!",2000,"",function(){
								window.location.pathname="/home";		//reload the page
							});
						});
					});
		
				}
				else if(response.post_id=='') {
					Materialize.toast("You shared it as a message! Unfortunately, you won't get points for it!",2500);
				}
		});
	};

}]);
