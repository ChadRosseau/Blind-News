 "use strict";

 angular.module("myApp")

     .controller('mainCtrl', function($rootScope, $scope, $location, $state, $firebaseObject, $firebaseArray, $sce) {
        // CHECK USER
        var user = firebase.auth().currentUser;

        firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
            console.log("I'm logged in!");
             $rootScope.user = user;

            let ref = database.ref("users/" + user.uid);
            let siteInfo = $firebaseObject(ref);
            $scope.profile = siteInfo;

          } else {
            console.log("No user");
          }
        });
        
        // LOGOUT
        $scope.logout = function() {
            firebase.auth().signOut().then(function() {
                console.log("Signed out");
                $rootScope.user = null;
                $state.go("home");
            }).catch(function(error) {
                console.log("Not signed out");
            });
        }


        let ref = database.ref("siteInfo");
        let siteInfo = $firebaseObject(ref);
        siteInfo.$bindTo($scope, 'siteInfo');

        ref = database.ref("articles");
        siteInfo = $firebaseArray(ref);
        $scope.articles = siteInfo;

        $scope.reverseOrder = function() {
             var getArticle = firebase.database().ref("articles/");
             var usersObject = $firebaseArray(getArticle);
             $scope.articles = usersObject;
             $scope.articles.$loaded().then(function(otherWay) {
                 var otherWay = $scope.articles;
                 otherWay.reverse();
                 $scope.articles = otherWay;
             });
         }
         $scope.reverseOrder();


      
        var date = new Date();

        $scope.articleS = function(article) {
            $state.go("article");
            $rootScope.chosenArticle = article;
            $rootScope.chosenArticle.body = $sce.trustAsHtml(article.body);
            window.scrollTo(0, 0);
        }

        // // New Profile
        // $scope.createUser = function(newUser) {
        //     var user = firebase.auth().currentUser;
        //     var date = new Date(newUser.dob)
        //     var day = date.getDay();
        //     var month = date.getMonth();
        //     var year = date.getFullYear();

        //     firebase.database().ref('users/' + user.uid).set({
        //         fullName: newUser.name,
        //         dob: `${day}/${month}/${year}`,
        //         role: "user"
        //     });
        // }

        $scope.editArticle= function(article) {

             
                let editedArticle = {
                     title: article.title,
                     subTitle: article.subTitle,
                     author: article.author,
                     body: article.body.toString(),
                     tags: article.tags,
                     url: article.url,
                     key: article.key,
                     date: article.date
                 }
                 console.log(editedArticle)
                 console.log(database.ref("articles/" + article.key).set(editedArticle))
                database.ref("articles/" + article.key).set(editedArticle);

        }   




     })