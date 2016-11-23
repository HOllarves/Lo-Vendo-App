;
(function () {
    "use strict";

    angular.module('LoVendoApp.controllers')
        .controller('HomeCtrl', ['$scope', '$rootScope', 'SimpleRETS',
            'Authentication', 'AUTH_EVENTS', '$window',
            'Session', 'jwtHelper', 'ModalOptions', '$uibModal', HomeCtrl
        ]);

    function HomeCtrl($scope, $rootScope, SimpleRETS, Authentication, AUTH_EVENTS, $window, Session, jwtHelper, ModalOptions, $uibModal) {

        //Setting visual model
        var home = this;

        /**
         * 
         * Hard coded request Object
         * TEMPORARY
         * 
         */

        home.type = [];
        home.minprice;
        home.maxprice;
        home.minbeds;
        home.maxbeds;
        home.minbaths;
        home.maxbaths;
        home.minarea;
        home.maxarea;
        home.status;
        home.q;
        home.limit = "5";

        $rootScope.requestObj = {
            "status": home.status,
            "type": home.type,
            "minprice": home.minprice,
            "maxprice": home.maxprice,
            "minbeds": home.minbeds,
            "maxbeds": home.maxbeds,
            "minbaths": home.minbaths,
            "maxbaths": home.maxbaths,
            "minarea": home.minarea,
            "maxarea": home.maxarea,
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
                    if (data.user && data.status == 201) {
                        //Dismissing modal
                        $scope.dismiss();
                        //Assigning credentials
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


        /**
         * Opens saved houses window
         * 
         */
        $scope.showSavedHouses = false;
        $scope.$on('openSavedHouses', function () {
            if ($scope.showSavedSearches)
                $scope.showSavedSearches = false;
            if ($scope.showSavedHouses)
                $scope.showSavedHouses = false;
            else
                $scope.showSavedHouses = true;
        });

        /**
         * Open saved searches window
         * 
         */

        $scope.showSavedSearches = false;
        $scope.$on('openSavedSearches', function () {
            if ($scope.showSavedHouses)
                $scope.showSavedHouses = false;
            if ($scope.showSavedSearches)
                $scope.showSavedSearches = false;
            else
                $scope.showSavedSearches = true;
        });

        /**
         * Closes user windows
         * 
         */
        $scope.$on('closeUserWindows', function () {
            if ($scope.showSavedSearches) {
                $scope.showSavedSearches = false;
            }
            if ($scope.showSavedHouses) {
                $scope.showSavedHouses = false;
            }
        })

        /**
         *
         * House Detail Modal Instance
         *
         */

        home.openComponentModal = function (home) {
            let modalOptions = ModalOptions.getHouseDetailOptions(home);
            var modalInstance = $uibModal.open(modalOptions);
        };

        /**
         * Auth Events
         * 
         */

        $scope.$on(AUTH_EVENTS.notAuthenticated, notAuthenticated);
        $scope.$on(AUTH_EVENTS.logoutSuccess, logoutSuccess);
        $scope.$on(AUTH_EVENTS.loginSuccess, setCurrentUser);
    }
})();