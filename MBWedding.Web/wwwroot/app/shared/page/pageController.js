(function () {
    angular.module('mbsite')
    .controller('pageController', ['$scope', function ($scope) {
       
        $scope.navbarCollapsed = true;
        $scope.mobileNav = false;

    }]);
})();