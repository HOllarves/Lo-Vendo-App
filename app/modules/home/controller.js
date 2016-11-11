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
        home.minprice = 15000;
        home.maxprice = 50000;
        home.status;
        home.limit = "10";

        $scope.requestObj = {
            "status": home.status,
            "type": home.type,
            "minprice": home.minprice,
            "maxprice": home.maxprice,
            "limit": home.limit
        };

        /**
         * Sign in function
         *
         * @param {Object} user
         * 
         */

        home.signIn = function (user) {
            console.log('home', user);
            home.submitted = true;
            Authentication.login(user).then(function (data) {
                console.log('data', data);
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
            console.log(jwtHelper.isTokenExpired(credentials.token));
            if (jwtHelper.isTokenExpired(credentials.token)) {
                Session.destroy();
                $rootScope.currentUser = null;
                home.currentUser = null;
            } else {
                $rootScope.currentUser = credentials;
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
            console.log('set current user', $rootScope);
            home.currentUser = $rootScope.currentUser;
            Session.create(home.currentUser.user, home.currentUser.token);
            $rootScope.isAuthenticated = Authentication.isAuthenticated();
        }

        /**
         * Logs out user.
         * 
         */
        function logout() {
            home.currentUser = null;
            Session.destroy();
        }

        function sessionTimeout() {
            console.log('Hey!');
        }

        function notAuthenticated() {
            console.log('not authenticated');
        }

        $scope.$on(AUTH_EVENTS.notAuthenticated, notAuthenticated);
        $scope.$on(AUTH_EVENTS.sessionTimeout, sessionTimeout);
        $scope.$on(AUTH_EVENTS.logoutSuccess, logout);
        $scope.$on(AUTH_EVENTS.loginSuccess, setCurrentUser);
    }
})();