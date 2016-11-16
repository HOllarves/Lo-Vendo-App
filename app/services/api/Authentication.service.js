(function () {

    angular.module('LoVendoApp.services')
        .factory('Authentication', ['$http', '$q', '$window', '$rootScope', 'Session', Authentication]);

    function Authentication($http, $q, $window, $rootScope, Session) {

        /**
         * Login method
         *
         * @param {Object} user
         * 
         */

        function login(user) {
            var url = AppSettings.api_url + '/auth/signIn';
            var deferred = $q.defer();
            $http.post(url, user).success(loggedIn, authError).error(httpError);
            //Authentication success
            function loggedIn(data) {
                //Creating smaller user object with
                //only the info we need
                var user = {
                        user: data.user,
                        token: data.token
                    }
                //Storing user data in sessionStorage
                $window.sessionStorage["userInfo"] = JSON.stringify(user);
                //Assigning user to global object
                $rootScope.credentials = user;
                //Resolving data
                deferred.resolve(data);
            }
            //Authentication error
            function authError(err) {
                deferred.reject(data);
            }
            //Http error
            function httpError(error) {
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
                //Creating smaller user object with
                //only the info we need
                var user = {
                        user: data.user,
                        token: data.token
                    }
                //Storing user data in sessionStorage
                $window.sessionStorage["userInfo"] = JSON.stringify(user);
                //Assigning user to global object
                $rootScope.credentials = user;
                //Resolving data
                deferred.resolve(data);
            }
            //Authentication error
            function authError(err) {
                console.log(err);
                deferred.reject(data);
            }
            //Http error
            function httpError(error) {
                console.log(error);
                deferred.reject("Http error" + error);
            }
            return deferred.promise;
        }

        //check if the user is authenticated
        function isAuthenticated() {
            return !!Session.user;
        };

        return {
            login: login,
            signUp: signUp,
            isAuthenticated: isAuthenticated
        }
    }

})();