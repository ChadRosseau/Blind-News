 "use strict";

 angular.module("myApp")

     .controller('adminCtrl', function($rootScope, $scope, $location, $state, $firebaseObject) {
        // Login
        var provider = new firebase.auth.GoogleAuthProvider();
        $scope.login = function() {
            firebase.auth().signInWithRedirect(provider);
            firebase.auth().getRedirectResult().then(function(result) {
              if (result.credential) {
                // This gives you a Google Access Token. You can use it to access the Google API.
                var token = result.credential.accessToken;
                // ...
              }
              // The signed-in user info.
              var user = result.user;
             


            }).catch(function(error) {
              // Handle Errors here.
              var errorCode = error.code;
              var errorMessage = error.message;
              // The email of the user's account used.
              var email = error.email;
              // The firebase.auth.AuthCredential type that was used.
              var credential = error.credential;
              // ...
            });
        }
        


     })