;
(function () {
    "use strict";

    angular.module('LoVendoApp.services')
        .factory('GreatSchools', ['$http', '$q', 'x2js', GreatSchools])

    function GreatSchools($http, $q, x2js) {

        /**
         * Get nearby schools
         * @param {Integer} lat - Latitude coordinates
         * @param {Integer} long - Longitude coordinates
         * 
         */

        function getNearbySchools(city, zip) {
            var deferred = $q.defer();
            var schoolsUrl = "https://warm-lowlands-68974.herokuapp.com" + '/schools';

            $http.get(schoolsUrl, {
                params: {
                    "city": city,
                    "zip": zip,
                    "state": "FL",
                    "limit": 5
                }
            })
                .then(dataReceived)
                .catch(dataError);

            function dataReceived(res) {
                //Converting response to JSON
                var json_data = x2js.xml_str2json(res.data);
                return deferred.resolve(json_data);
            }

            function dataError(err) {
                return deferred.resolve('Bad-Request');
            }

            return deferred.promise;
        }

        return {
            getNearbySchools: getNearbySchools
        }
    }

})();