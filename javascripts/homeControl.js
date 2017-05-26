app.controller('homeControl', ['$scope','$rootScope','$location','Facebook','$resource', function($scope,$rootScope,$location,Facebook,$resource){
	
	$scope.notifications = [];

	$(document).ready(function(){
	   $('.collapsible').collapsible({
	     accordion : true // A setting that changes the collapsible behavior to expandable instead of the default accordion style
	   });
	});

	$scope.mainuser = {};
	$scope.showLoading = true;
	$scope.showPanel = false;
	$scope.showRegister = false;				//false by default, set to true for debugging
	$scope.showUpdateButton = false;

	Facebook.getLoginStatus(function(response){			//init
		if(response.status!=='connected'){
			Materialize.toast('You must be logged in first',1500,'',function(){
				$location.url('/');			
			});
		}
		else{
			Facebook.api('/me?fields=email,name,id',function(res){
				$scope.mainuser.name = res.name;
				$scope.mainuser.facebookID = res.id;
				//$scope.mainuser.email = res.email;
				Facebook.api('/me/picture?type=large',function(res){
					$scope.mainuser.profileurl = res.data.url;
					console.log($scope.mainuser);					//all facebook data compiled

					var User = $resource('/api/userdata/:id', {id:$scope.mainuser.facebookID});
					User.query({},function(response){
						if(!response.length){				//user is new, need to register his/her details
							Materialize.toast('Seems like you are new here!',2000);
							$scope.showLoading = $scope.showPanel = false;
							$scope.showRegister = true;
						}
						else {	
							var Notifications = $resource('/api/notifications');
  							Notifications.query({},function(notifs){
  								$scope.notifications = notifs;
 								$scope.notifications = $scope.notifications.filter(function(val){
 									if(val.text) {
 										return true;
 									}
 									else {
 										return false;
 									}
 								});
 								$scope.notifications.push({
 									text: "To increase your score and win exciting prizes, share our posts in your college groups \
 									to increase our reach."
 								});
 								$scope.notifications.push({
 									text: "To get points, the share should be public, otherwise your points will be deducted."
 								});
  								$('#info').openModal();
  							});						
							//update the user data
							Materialize.toast('Updating your scores, just hold on!',2000);
							$scope.showUpdateButton = true;
							$scope.showRegister = $scope.showLoading = false;
							$scope.showPanel = true;
							$scope.mainuser = response[0];
							// $scope.mainuser.likes = 0;
							// $scope.mainuser.totalLikes = 0;
							var likes=0;
							countLikes(0,likes);
						}
					});
				});
			});

		}
	});

	function countLikes(index,likes){
		if(index>=$scope.mainuser.shares.length) {
			$scope.mainuser.likes = likes;

			var totalLikes = 0;
			countTotalLikes(0,totalLikes);
		}
		else{
			Facebook.api(String($scope.mainuser.shares[index])+"?fields=likes.limit(10000)",function(fb_response){
				console.log(fb_response);
				if(fb_response.likes) {			//some likes found
 					likes += fb_response.likes.data.length;
				}
				countLikes(index+1,likes);
			});
		}
	}

	function countTotalLikes(index,totalLikes) {						//run all the remaining functions inside it
		if(index>=$scope.mainuser.totalShares.length) {
			$scope.mainuser.totalLikes = totalLikes;

			$scope.mainuser.totalScore = $scope.mainuser.totalLikes + $scope.mainuser.totalShares.length*10 + $scope.mainuser.totalIdeasScore;
			$scope.mainuser.score = $scope.mainuser.likes + $scope.mainuser.shares.length*10 + $scope.mainuser.ideasScore;

			var User = $resource('/api/userdata/:id',{id:$scope.mainuser.facebookID}, {update:{method:'PUT'}});
			User.update($scope.mainuser,function(response){
				Materialize.toast('Your score has been updated successfully!',2000);
				console.log(response);
			});

			if(window.location.pathname=='/home')	
				$location.url('/home/user');
			//alert("Success");
			console.log('Im still in home!');
		}
		else{
			Facebook.api(String($scope.mainuser.totalShares[index])+"?fields=likes.limit(10000)",function(fb_response){
				console.log(fb_response);
				if(fb_response.likes) {			//some likes found
					totalLikes += fb_response.likes.data.length;
				}
				countTotalLikes(index+1,totalLikes);
			});
		}	
	}

	$scope.saveDetails = function(){
		var addUser = $resource('/api/userdata/add');
		addUser.save($scope.mainuser);
		window.location.pathname = "/home";
	};

	$scope.invalidPhone = function(){
		return !$scope.mainuser.phone.match(/^\d{10}$/);	
	};

	$scope.invalidWhatsapp = function(){
		return !$scope.mainuser.whatsapp.match(/^\d{10}$/);
	};
	
	// $scope.invalidZip = function(){
	// 	return !$scope.mainuser.zipcode.match(/^\d{6}$/);			//some pain here
	// };	

	$scope.logout = function(){
		Facebook.logout(function(response){
			Materialize.toast('Successfully logged out! See you again!',1500);
			$location.url('/');			
		});
	};

	$scope.updateDetails = function(){
		$location.url('/home/update');
	};

	$scope.openInfo = function(){
		$('#info').openModal();
	};

}]);
