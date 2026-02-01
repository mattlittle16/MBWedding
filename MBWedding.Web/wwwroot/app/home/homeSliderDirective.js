(function () {
    angular.module('mbsite').directive('homeSlider', function () {
        return {
            restrict: 'E',
            templateUrl: '/app/home/homeSliderDirective.html',
            replace: false,           
            controller: ['$scope', function ($scope) {
                function BuildSlides() {
                    var slides = [];
                    for (var i = 1; i < 6; i++) {
                        slides.push({ image: '/app/assets/img/slide' + i + '.jpg' })
                    }
                    $scope.slides = slides;
                }
                BuildSlides();
            }]
        }
    });
})();