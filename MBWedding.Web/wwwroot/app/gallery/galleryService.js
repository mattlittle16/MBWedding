(function () {
    angular.module("mbsite")
    .factory("galleryService", ['$http', function($http) {

        var getGallery = function () {
            return $http.get('/api/gallery', {
                headers: { 'Accept': 'application/json' }
            }).then(function(response) {
                return response.data;   
            });
        }

        return {
            getGallery: getGallery
        }
    }]);
})();