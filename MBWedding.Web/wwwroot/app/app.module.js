(function () {
    angular.module('mbsite', [
        'ngRoute',
        'ui.bootstrap',
        'ngAnimate',
        'timer',
        'ngSanitize',
        'sticky', //side bar
        'masonry' //guestbook
    ])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: '/app/home/home.html',
                controller: 'homeController'
            })
            .when('/ourstory', {
                templateUrl: '/app/our-story/ourStory.html',
                controller: 'ourStoryController'
            })
            .when('/gallery', {
                templateUrl: '/app/gallery/gallery.html',
                controller: 'galleryController'
            })
            .when('/guestbook', {
                templateUrl: '/app/guestbook/guestbook.html',
                controller: 'guestbookController'
            })
            .when('/weddingparty', {
                templateUrl: '/app/weddingparty/weddingparty.html',
                controller: 'weddingpartyController'
            })
            .when('/info', {
                templateUrl: '/app/info/info.html',
                controller: 'infoController'
            })
            .when('/lodging', {
                templateUrl: '/app/lodging/lodging.html',
                controller: 'lodgingController'
            })
            .when('/gifts', {
                templateUrl: '/app/gifts/gifts.html',
                controller: 'giftsController'
            })
            .otherwise({ redirectTo: '/' });
    }])
    .run(['$rootScope', function ($rootScope) {
        console.log("For any of my developer friends poking around, I really like Hochstaders Slow and Low Rye Whiskey");
    }]);

    //woo easter eggs
    $(window).konami({
        cheat: function () {
            console.log("KONAMI ACTIVATED! ALL YOUR ELEMENTS ARE BELONG TO US");
            var s = document.createElement('script'); s.setAttribute('src', 'https://nthitz.github.io/turndownforwhatjs/tdfw.js');
            document.body.appendChild(s);
        }
    });
})();
