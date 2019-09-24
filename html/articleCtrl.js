 "use strict";

 angular.module("myApp")

     .controller('articleCtrl', function($rootScope, $scope, $location, $state, $firebaseObject) {

         let ref = database.ref("articles");
         let articles = $firebaseObject(ref);
         articles.$bindTo($scope, 'articles');

         let newArticle;

         //RESIZING
         var file;
         var fileName = null;
         var fileButton;

         var fileButton;

         setTimeout(function() {
             fileButton = document.getElementById('fileUpload');
             console.log(fileButton)


             fileButton.addEventListener("change", function(e) {

                 file = fileButton.files[0];
                 fileName = file.name;
                 document.getElementById('imageName').innerHTML = fileName;
                 // RESIZING!
                 ImageTools.resize(this.files[0], {
                     width: 700, // maximum width
                     height: 700 // maximum height

                 }, function(blob, didItResize) {
                     // didItResize will be true if it managed to resize it, otherwise false (and will return the original file as 'blob')
                     var url = window.URL.createObjectURL(blob);
                     console.log(url)
                     document.getElementById('preview').style.backgroundImage = "url(" + url + ")";
                     // you can also now upload this blob using an XHR.
                     file = blob;

                 });

             })
         }, 2000)





         $scope.createArticle = function(article) {
             $scope.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
             var newKey = firebase.database().ref().child('articles').push().key;
             var storageRef = firebase.storage().ref();
             var tags = [];
             if (article.tags.politics) {
                 tags.push("Politics");
             };
             if (article.tags.science) {
                 tags.push("Science");
             };
             if (article.tags.history) {
                 tags.push("History");
             };
             if (article.tags.economics) {
                 tags.push("Economics");
             };
             if (article.tags.city) {
                 tags.push("City");
             };
             if (article.tags.Technology) {
                 tags.push("Technology");
             };
             if (article.tags.breakingNews) {
                 tags.push("Breaking News");
             };




             alertify.confirm('Create Article?', 'Are you sure you want to post this article?', function() {
                 try {
                     var uploadTask = storageRef.child('gallery/' + newKey + "/" + fileName).put(file);
                     // Register three observers:
                     // 1. 'state_changed' observer, called any time the state changes
                     // 2. Error observer, called on failure
                     // 3. Completion observer, called on successful completion
                     uploadTask.on('state_changed', function(snapshot) {
                         // Observe state change events such as progress, pause, and resume
                         // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                         var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                         console.log('Upload is ' + progress + '% done');
                         switch (snapshot.state) {
                             case firebase.storage.TaskState.PAUSED: // or 'paused'
                                 console.log('Upload is paused');
                                 break;
                             case firebase.storage.TaskState.RUNNING: // or 'running'
                                 console.log('Upload is running');
                                 break;
                         }
                     }, function(error) {
                         // Handle unsuccessful uploads
                         alertify.alert('Alert Message!: ' + error);
                     }, function() {
                         // Handle successful uploads on complete
                         // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                         uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                             console.log('File available at', downloadURL);
                             var date = new Date();
                             var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                             var year = date.getFullYear();
                             var month = months[date.getMonth()];
                             var day = date.getDate();
                             newArticle = {
                                 title: article.title,
                                 subTitle: article.subTitle,
                                 author: article.author,
                                 webBody: "<br>" + article.body,
                                 appBody: article.body.replace(/<\/?[^>]+(>|$)/g, ""),
                                 tags: tags,
                                 url: downloadURL,
                                 key: newKey,
                                 date: `${day} ${month} ${year}`
                             }
                             database.ref("articles/" + newKey).set(newArticle);
                             $rootScope.chosenArticle = newArticle;
                         });

                     });
                     $state.go("article");

                 } catch (error) {
                     alertify.alert('Alert Message: ' + error);
                 }


             }, function() {
                 alertify.error('Article not created');
             });




         }




     })