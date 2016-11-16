(function () {

    angular.module('LoVendoApp.controllers')
        .controller('HomeCtrl', ['$scope', '$rootScope', 'SimpleRETS',
            'Authentication', 'AUTH_EVENTS', '$window',
            'Session', 'jwtHelper', HomeCtrl
        ]);

    function HomeCtrl($scope, $rootScope, SimpleRETS, Authentication, AUTH_EVENTS, $window, Session, jwtHelper) {

        //Setting visual model
        var home = this;

        /**
         * 
         * Hard coded request Object
         * TEMPORARY
         * 
         */

        home.type = ["rental", "residential"];
        home.minprice;
        home.maxprice;
        home.status;
        home.q;
        home.limit = "200";

        $rootScope.requestObj = {
            "status": home.status,
            "type": home.type,
            "minprice": home.minprice,
            "maxprice": home.maxprice,
            "limit": home.limit,
            "q": home.q
        };

        /**
         * Sign in function
         *
         * @param {Object} user
         * 
         */

        home.signIn = function (user) {
            home.submitted = true;
            Authentication.login(user).then(function (data) {
                if (data.status == 200) {
                    //Dismissing modal
                    $scope.dismiss();
                    //Assigning currentUser
                    $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                }
            });
        }

        /**
         * Sign up function
         *
         * @param {Object} user
         * 
         */

        home.signUp = function (user) {
            home.submitted = true;
            console.log(user);
            if (user.password == user.confirm_password) {
                var valid_user = {
                    name: user.name,
                    email: user.email,
                    password: user.password
                }
                Authentication.signUp(valid_user).then(function (data) {
                    console.log('data received!', data);
                    if (data.user && data.status == 201) {
                        //Dismissing modal
                        $scope.dismiss();
                        //Assigning currentUser
                        $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                    }
                });
            }
        }


        // if a session exists for current user (page was refreshed)
        // log him in again
        if ($window.sessionStorage["userInfo"]) {
            var credentials = JSON.parse($window.sessionStorage["userInfo"]);
            console.log(credentials);
            if (jwtHelper.isTokenExpired(credentials.token)) {
                Session.destroy();
                $rootScope.credentials = null;
                home.currentUser = null;
            } else {
                $rootScope.credentials = credentials;
                home.currentUser = credentials;
                Session.create(home.currentUser.user, home.currentUser.token);
                $rootScope.isAuthenticated = Authentication.isAuthenticated();
            }
        }

        /**
         * Sets current user
         * 
         */

        function setCurrentUser() {
            home.currentUser = $rootScope.credentials;
            Session.create(home.currentUser.user, home.currentUser.token);
            $rootScope.isAuthenticated = Authentication.isAuthenticated();
        }

        /**
         * Logouts user
         * 
         */

        function logoutSuccess() {
            if ($rootScope.isAuthenticated) {
                Session.destroy();
                $rootScope.credentials = null;
                home.currentUser = null;
            } else {
                $rootScope.credentials = null;
                home.currentUser = null;
            }
            $window.sessionStorage.removeItem("userInfo");
            $rootScope.isAuthenticated = Authentication.isAuthenticated();
        }

        /**
         * Sign up function
         *
         * @param {String} query
         * 
         */

        function notAuthenticated() {
            console.log('not authenticated');
        }

        $scope.$on(AUTH_EVENTS.notAuthenticated, notAuthenticated);
        $scope.$on(AUTH_EVENTS.logoutSuccess, logoutSuccess);
        $scope.$on(AUTH_EVENTS.loginSuccess, setCurrentUser);
    }
})();