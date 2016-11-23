;
(function () {
    "use strict";

    angular.module('LoVendoApp.services')
        .factory('SimpleRETS', ['$http', '$q', '$httpParamSerializer', SimpleRETS]);

    function SimpleRETS($http, $q, $httpParamSerializer) {
        var simpleRetsUrl = "https://api.simplyrets.com/";
        var credentials = btoa('jeanc_5ruk2905:7ck54he2rcw05433');

        /**
         * It retrieves all properties
         *
         * 
         */

        function getProperties() {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: simpleRetsUrl + 'properties?limit=20&lastId=0',
                headers: {
                    'Authorization': 'Basic ' + credentials
                }
            }).success(propsReceived, propsError).error(httpError);
            //Properties received
            function propsReceived(data) {
                deferred.resolve(data);

            }
            //Properties error
            function propsError(error) {
                deferred.reject(error);

            }
            //Http error
            function httpError(error) {
                deferred.reject("Http error" + error);

            }
            return deferred.promise;
        }

        /**
         * Handles request and returns all properties
         * that match the request object parameters
         *
         * @param {Object} obj
         * 
         */

        function requestHandler(obj) {
            //Serializing object
            var queryString = $httpParamSerializer(obj);
            console.log('Query = ', simpleRetsUrl + 'properties?' + queryString);
            //Starting async request
            var deferred = $q.defer();
            //Making http request
            $http({
                method: 'GET',
                url: simpleRetsUrl + 'properties?' + queryString,
                headers: {
                    'Authorization': 'Basic ' + credentials
                }
            }).success(propsReceived, propsError).error(httpError);
            //Properties received
            function propsReceived(data) {
                deferred.resolve(data);
            }
            //Properties error
            function propsError(error) {
                deferred.reject('Api error' + error);
            }
            //Http error
            function httpError(error) {
                deferred.reject('Http error' + error);
            }
            return deferred.promise;
        }
        /**
         * Gets specific house using its
         * mlsId
         * 
         * @param {String} id - mlsId
         * 
         */

        function getHouse(id) {
            var deferred = $q.defer();

            $http({
                    method: 'GET',
                    url: simpleRetsUrl + 'properties/' + id,
                    headers: {
                        'Authorization': 'Basic ' + credentials
                    }
                })
                .then(propsReceived)
                .catch(httpError);

            //Properties received
            function propsReceived(data) {
                deferred.resolve(data);
            }
            //Http error
            function httpError(error) {
                deferred.reject('Http error' + error);
            }

            return deferred.promise;
        }
        return {
            getProperties: getProperties,
            getHouse: getHouse,
            requestHandler: requestHandler
        }
    }
})();