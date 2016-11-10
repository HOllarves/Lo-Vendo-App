(function(){

angular.module('LoVendoApp.services')
    .factory('Authentication', ['$http', '$q', Authentication]);

    function Authentication($http, $q) {

        /**
        * Login method
        *
        * @param {Object} user
        * 
        */

        function login(user){
            var url = AppSettings.api_url + '/auth/signIn';
            var deferred = $q.defer();
            $http.post(url, user).success(loggedIn, authError).error(httpError);
            //Authentication success
            function loggedIn(data) {
                console.log(data);
                deferred.resolve(data);
            }
            //Authentication error
            function authError(err) {
                console.log(err);
                deferred.reject(data);
            }
            //Http error
            function httpError(error){
                console.log(error);
                deferred.reject("Http error" + error);  
            }
            return deferred.promise;
        }

        /**
        * Sign up method
        *
        * @param {Object} user
        * 
        */

        function signUp(user) {
            console.log('Signing up');
            var url = AppSettings.api_url + '/auth/signUp';
            var deferred = $q.defer();

            //Http POST request
            $http.post(url, user).success(loggedIn, authError).error(httpError);
            
            //Authentication success
            function loggedIn(data) {
                console.log(data);
                deferred.resolve(data);
            }
            //Authentication error
            function authError(err) {
                console.log(err);
                deferred.reject(data);
            }
            //Http error
            function httpError(error){
                console.log(error);
                deferred.reject("Http error" + error);  
            }
            return deferred.promise;
        }

        return {
            login: login,
            signUp: signUp
        }
    }

})();