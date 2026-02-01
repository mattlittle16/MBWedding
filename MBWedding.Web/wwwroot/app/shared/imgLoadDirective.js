(function () {
    angular.module('mbsite')
    .directive('imgLoad', function() {
        return {
            restrict: 'A',
            link: function (scope, ele, attrs) {
                ele.bind('load', function () {
                    scope.$apply(attrs.imgLoad);
                });

                ele.bind('error', function () {
                    
                });
            }
        }
    });
})();