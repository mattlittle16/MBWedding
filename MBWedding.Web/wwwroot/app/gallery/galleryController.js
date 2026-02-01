(function () {
    angular.module("mbsite")
    .controller("galleryController", ['$scope', 'galleryService', '$timeout', '$modal', function ($scope, gallery, $timeout, $modal) {
        //Load Gallery
        ////////////////////////////////////////////////////////////////////////
        var onSuccess = function (data) {
            var Images = [];
            for (var i = 0; i < data.length; i++) {
                Images.push({ source: data[i], loaded: false });
            }
            $scope.images = Images;
        }
        var onError = function () {
            $scope.imagesError = "Unable to fetch gallery at this time";
        }
        gallery.getGallery().then(onSuccess, onError);

        $scope.isLoaded = false;

        $scope.imageLoaded = function (index) {
            // use timeout to simulate some time passing
            $timeout(function () {
                $scope.images[index].loaded = true;

                $scope.isLoaded = ($scope.images.filter(function (obj, i) {
                    return obj.loaded === true;
                }).length == $scope.images.length);

                if ($scope.isLoaded) {
                    //console.log("everything loaded");
                }
            }, index * 10);
        }
        ////////////////////////////////////////////////////////////////////////

        //Open Picture
        ////////////////////////////////////////////////////////////////////////        
        $scope.open = function (index, largeImage) {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'myModalContent.html',
                controller: 'galleryModalController',
                size: 'lg',
                resolve: {
                    largeImage: function () { return largeImage; },
                    index: function () { return index; },
                    images: function () { return $scope.images }
                }
            });            
        };               
        ////////////////////////////////////////////////////////////////////////
    }]);

    angular.module("mbsite")
    .controller("galleryModalController", ['$scope', '$modalInstance', 'index', 'images', function ($scope, $modalInstance, index, images) {
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.largeImage = images[index].source;

        $scope.next = function () {
            if (index <= images.length) {
                index = index + 1;
                $scope.largeImage = images[index].source;
            }
        };

        $scope.prev = function () {
            if (index >= 0) {
                if (index > 0) {
                    index = index - 1;
                    $scope.largeImage = images[index].source;
                } else {
                    $scope.largeImage = images[0].source;                     
                }
                
            }            
        };
    }]);
})();