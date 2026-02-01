(function () {
    angular.module('mbsite')
    .directive('scrollTop', function () {
        return {
            restrict: 'E',
            scope: {

            },
            controller: ['$scope', function($scope) {
                $scope.showScrollTop = false;
            }],
            templateUrl: '/app/shared/scrollTop/scrollTop.html',
            link: function (scope, ele, attrs) {                
                angular.element(window).bind('scroll', function () {
                    if (window.scrollY >= 100) {
                        scope.$apply(function () {
                            scope.showScrollTop = true;
                        });
                    } else {
                        scope.$apply(function () {
                            scope.showScrollTop = false;
                        });
                    }

                    scope.scrollTop = function () {
                        $('html, body').animate({ scrollTop: 0 }, function () { });
                    };
                });
            }
        }
    });
})();