var app = angular.module('CR', ['ui.router','ngResource','facebook','ui.materialize']);

app.config(['$stateProvider','$urlRouterProvider','$locationProvider','FacebookProvider',function($stateProvider,$urlRouterProvider,$locationProvider,FacebookProvider) {
	
	FacebookProvider.init('333400450156052');

	$urlRouterProvider.otherwise('/404');
	$urlRouterProvider.when('/home','/home/user');
	$urlRouterProvider.when('/home/leaderboard','/home/leaderboard/main');
	$stateProvider
	.state('regportal',{
		url:'/',
		controller:'regPortalControl'
	})
	.state('login',{
		url:'/login',
		templateUrl:'views/login.html',
		controller: 'loginControl'
	})
	.state('404',{
		url:'/404',
		templateUrl:'views/404.html'
	})
	.state('home',{
		url:'/home',
		templateUrl:'views/home.html',
		controller:'homeControl'
	})
	.state('home.user',{
		url:'/user',
		templateUrl:'views/user.html',
		controller: 'userControl'
	})
	.state('home.instructions',{
		url:'/guidelines',
		templateUrl:'views/instructions.html',
		controller:'instructionsControl'
	})
	.state('home.contact',{
		url:'/contact',
		templateUrl:"views/contact.html",
		controller:'contactControl'
	})
	.state('home.leaderboard',{
		url:'/leaderboard',
		templateUrl:'views/leaderboard.html',
		controller:'leaderboardControl'
	})
	.state('home.leaderboard.main',{
		url:'/main',
		templateUrl:'views/leaderMain.html',
		controller:'leaderMain'
	})
	.state('home.leaderboard.sub',{
		url:'/sub',
		templateUrl:'views/leaderSub.html',
		controller:'leaderSub'
	})
	.state('home.prizes',{
		url:'/winners',
		templateUrl:'views/prizes.html',
		controller:'prizesControl'
	})
	.state('home.update',{
		url:'/update',
		templateUrl:'views/update.html',
		controller:'updateControl'
	})
	.state('home.venue',{
		url:'/venue',
		templateUrl:'views/venue.html',
		controller:'venueControl'
	})
	.state('home.ideas',{
		templateUrl:'ideas-options.html'
	})
	.state('home.something1',{
		url:'/ideas/something1',
		templateUrl:'views/giveanidea.html',
		controller:'ideasControl'
	})
	.state('home.something2',{
		url:'/ideas/something2',
		templateUrl:'views/giveanidea.html',
		controller:'ideasControl'
	})
	.state('home.something3',{
		url:'/ideas/something3',
		templateUrl:'views/giveanidea.html',
		controller:'ideasControl'
	})
	.state('home.something4',{
		url:'/ideas/something4',
		templateUrl:'views/giveanidea.html',
		controller:'ideasControl'
	})
	.state('home.something5',{
		url:'/ideas/something5',
		templateUrl:'views/giveanidea.html',
		controller:'ideasControl'
	})

	$locationProvider.html5Mode(true);
}]);

app.controller('regPortalControl', ['$scope', function($scope){
	window.location.href = "/#/regportal/";
}]);

app.controller('loginControl', ['$scope','$rootScope','$location','Facebook', function($scope,$rootScope,$location,Facebook){

	Facebook.getLoginStatus(function(response){
		if(response.status=='connected') {
			Materialize.toast('Redirecting to home...',1500,'',function(){
				window.location.href = '/#/home/user';
			});
		}
		else{
			$scope.login();
		}
	});

	$scope.login = function(){
		Facebook.login(function(response){
			if(response.status=='connected') {
				Materialize.toast('Redirecting to home...',1500,'',function(){
					window.location.href = '/#/home/user';					
				});
			}
			else {
				Materialize.toast('Please approve the app permissions!',1500);
				$location.url('/');
			}
		},{scope:'public_profile,user_friends,email,publish_actions,user_posts',return_scopes:true});
	};

}]);


