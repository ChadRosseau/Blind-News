 "use strict";

 angular.module("myApp")

     .controller('mainCtrl', function($rootScope, $window, $scope, $location, $state, $firebaseObject, $firebaseArray, $sce) {
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

         $scope.goArticle = function(key) {
            $window.location.href = '/#/article/' + key;
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



         // New Profile
         $scope.createUser = function(newUser) {
             var user = firebase.auth().currentUser;
             var dob = newUser.dob;
             var email = newUser.email;
             firebase.database().ref('users/' + user.uid).set({
                 fullName: newUser.fullName,
                 dob: dob,
                 email: email,
                 role: "user"
             });
         }

         $scope.editArticle = function(article) {

             let editedArticle = {
                 title: article.title,
                 subTitle: article.subTitle,
                 author: article.author,
                 webBody: article.appBody,
                 appBody: article.appBody.replace(/<\/?[^>]+(>|$)/g, ""),
                 tags: article.tags,
                 url: article.url,
                 key: article.key,
                 date: article.date
             }
             console.log(editedArticle)
             console.log(database.ref("articles/" + article.key).set(editedArticle))
             database.ref("articles/" + article.key).set(editedArticle);
             window.location.replace("/#/archive");
         }


         // Get all users
         $scope.getUsers = function() {
             let allUsers = database.ref("users");
             allUsers = $firebaseArray(allUsers);
             $scope.allUsers = allUsers;
             let userEmails = [];
             let userEmailsString = "";
             allUsers.$loaded()
                 .then(function() {
                     angular.forEach(allUsers, function(user) {
                         userEmails.push(user.email);
                         userEmailsString = userEmailsString + ", " + user.email;
                     })
                     userEmailsString = userEmailsString.slice(2);
                     console.log(userEmails);
                     console.log(userEmailsString);
                     $scope.allEmails = userEmailsString;
                 })
         }

         $scope.getUsers();





     })



     .controller('chosenCtrl', function($rootScope, $scope, $location, $state, $firebaseObject, $firebaseArray, $sce) {

         const articleBody = document.getElementById("articleBody");

         var promise1 = new Promise(function(resolve, reject) {
             setTimeout(function() {

                 let url = $location.path();
                 url = url.slice(9, 40);
                 console.log(url);

                 let ref = database.ref("articles/" + url);
                 let siteInfo = $firebaseObject(ref);
                 $rootScope.chosenArticle = siteInfo;
                 resolve($rootScope.chosenArticle);

             }, 1000);
         });

         promise1.then(function(value) {
             setTimeout(function() {
                console.log(value.webBody)
                 value.webBody = $sce.trustAsHtml(value.webBody);
                 articleBody.innerHTML = value.webBody;
             }, 300);

         });




     })