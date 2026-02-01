(function () {
    angular.module("mbsite")
    .controller("guestbookController", ['$scope', 'guestbookService', function ($scope, guestBook) {
        //Load Posts
        var OnSuccess = function(data) {
            $scope.posts = data;
            $scope.loadingPosts = false;
        }
        var OnError = function () {
            $scope.postsError = "Unable to retreive posts at this time";
        }
        $scope.loadingPosts = true;
        guestBook.getGuestbook().then(OnSuccess, OnError);
    }]);
})();
