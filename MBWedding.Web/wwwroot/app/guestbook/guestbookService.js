(function () {
    angular.module("mbsite")
    .factory("guestbookService", ['$http', function ($http) {

        var getGuestbook = function () {
            return $http.get('/api/guestbook', {
                headers: { 'Accept': 'application/json' }
            }).then(function (response) {
                return response.data;
            });
        }

        return {
            getGuestbook: getGuestbook
        }
    }]);
})();
