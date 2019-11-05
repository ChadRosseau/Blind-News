angular.module("myApp", [])

var app = angular.module("myApp", ["ngRoute", "ui.router", "firebase", "simditor"]);


app.directive('navbar', function() {
    return {
        restrict: 'E',
        templateUrl: 'directives/navbar.html'
    }
});

app.directive('myfooter', function() {
    return {
        restrict: 'E',
        templateUrl: 'directives/footer.html'
    }
});


app.config(function($stateProvider) {
    var home = {
        name: 'home',
        url: 'home',
        templateUrl: 'home.html'
    }

    var about = {
        name: 'about',
        url: 'about',
        templateUrl: 'about.html'
    }

    var article = {
        name: 'article',
        url: 'article',
        templateUrl: 'article.html'
    }

    var createArticle = {
        name: 'createArticle',
        url: 'createArticle',
        templateUrl: 'createArticle.html'
    }
    
    var login = {
        name: 'login',
        url: 'login',
        templateUrl: 'login.html'
    }

    $stateProvider.state(home);
    $stateProvider.state(about);
    $stateProvider.state(article);
    $stateProvider.state(createArticle);
    $stateProvider.state(login);
   
});

app.config(function($routeProvider) {
    $routeProvider
        .when("/home", {
            templateUrl: "home.html",
        })

        .when("/about", {
            templateUrl: "about.html",
        })

        .when("/archive", {
            templateUrl: "archive.html",
        })

        .when("/article", {
            templateUrl: "article.html",
        })

        .when("/createArticle", {
            templateUrl: "createArticle.html",
        })

        .when("/login", {
            templateUrl: "login.html",
        })

        .otherwise({
            redirectTo: '/home'
        });
});