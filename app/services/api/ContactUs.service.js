;
(function () {
    "use strict";

    angular.module('LoVendoApp.services')
        .factory('ContactUsService', ['$http', '$q', ContactUsService]);

    function ContactUsService($http, $q) {

        /**
         * Send new contactUs message
         * @param {Object} newMessage - name, email and message
         * 
         */

        function contactUs(newMessage) {
            var deferred = $q.defer();
            var url = AppSettings.api_url + '/contact';

            $http.post(url, newMessage)
                .then(dataSent)
                .catch(dataError);

            function dataSent(response) {
                deferred.resolve(response);
            }

            function dataError(err) {
                console.error('Something went wront');
                deferred.reject(err);
            }

            return deferred.promise;
        }



        return {
            contactUs: contactUs
        }
    }

})();