var user = {};

 window.fbAsyncInit = function() {
    FB.init({
      appId      : '786086961493086',
      xfbml      : true,
      cookie     : true,
      version    : 'v2.6'
    });

    if(window.location.pathname=='/') {
      FB.getLoginStatus(function(response){
        console.log(response);
        if(response.status=='connected')
            window.location.href = 'home/instructions';
        });
    }

    else if(window.location.pathname!='/info') {
      FB.getLoginStatus(function(response){
      
        console.log(response);
        if(response.status!='connected'){
          window.location.pathname = '';          
        }

        FB.api("/me",function (response) {                //get the Name    
          if (response) {
           console.log(response);
           user.name = response.name;
          }
        });

        FB.api('me/picture?type=large',function(response){    //get the profile pic
          console.log(response);
          user.profileurl = response.data.url;
          console.log(user);
        });

      });
    }
};
////////// Init checks for logging of user
    //end of function

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));
