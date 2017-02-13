;
(function () {
    "use strict";

    angular.module('LoVendoApp.services')
        .factory('NearbyPlaces', ['$http', '$httpParamSerializer', '$q', NearbyPlaces]);

    function NearbyPlaces($http, $httpParamSerializer, $q) {

        var url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=AIzaSyAj07qhVC9wn2Qs90TyBqWDpVVv42bx2FM";

        /**
         * Returns list of nearby places
         * @param {Float} lat - lat coordinates
         * @param {Float} lng - lng coordinates
         * @param {Integer} radius - search radius
         * 
         */

        function getNearbyPlaces(lat, lng, radius) {
            var deferred = $q.defer();
            var map_instance = angular.copy(map);
            var service = new google.maps.places.PlacesService(map_instance);
            var city = new google.maps.LatLng(lat, lng);
            var request = {
                location: city,
                radius: radius
            }

            service.nearbySearch(request, dataReceived);

            function dataReceived(data) {
                deferred.resolve(data);
            }

            return deferred.promise;
        }

        return {
            getNearbyPlaces: getNearbyPlaces
        }
    }

})();