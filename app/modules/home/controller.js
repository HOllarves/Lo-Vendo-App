;
(function () {
    "use strict";

    angular.module('LoVendoApp.controllers')
        .controller('HomeCtrl', ['$scope', '$rootScope', 'SimpleRETS',
            'Authentication', 'AUTH_EVENTS', 'REQUEST_LIMIT', '$window',
            'Session', 'jwtHelper', 'ModalOptions', '$uibModal', HomeCtrl
        ]);

    function HomeCtrl($scope, $rootScope, SimpleRETS, Authentication, AUTH_EVENTS, REQUEST_LIMIT, $window, Session, jwtHelper, ModalOptions, $uibModal) {

        //Controller
        var home = this;

        home.type = [];
        home.limit = REQUEST_LIMIT.simplyRETS;
        home.cities = [];

        $rootScope.requestObj = {
            "type": home.type,
            "minprice": null,
            "maxprice": null,
            "minbeds": null,
            "maxbeds": null,
            "minbaths": null,
            "maxbaths": null,
            "minarea": null,
            "maxarea": null,
            "buymode": false,
            "rentmode": false,
            "limit": home.limit,
            "offset": 0,
            "cities": home.cities,
            "q": null
        };

        /**
         * Sign in function
         *
         * @param {Object} user
         * 
         */

        home.signIn = function (user) {
            home.submitted = true;
            Authentication.login(user)
                .then(function (data) {
                    if (data.status == 200) {
                        //Dismissing modal
                        $scope.dismiss();
                        //Assigning userObj
                        $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                    } else {
                        $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
                    }
                })
                .catch(function () {
                    $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
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
                    if (data.status == 400 && data.message == "Email already in use") {
                        Materialize.toast('Este correo ya está en uso.', 4000);
                    }
                });
            }
        }


        // if a session exists for current user (page was refreshed)
        // log him in again
        if ($window.sessionStorage["userInfo"]) {
            var credentials = JSON.parse($window.sessionStorage["userInfo"]);
            if (jwtHelper.isTokenExpired(credentials.token)) {
                Session.destroy();
                $rootScope.credentials = null;
                home.userObj = null;
                Materialize.toast('Debes volver a iniciar sesión', 4000)
            } else {
                $rootScope.credentials = credentials;
                home.userObj = credentials;
                Session.create(home.userObj.user, home.userObj.token);
                $rootScope.isAuthenticated = Authentication.isAuthenticated();
                Materialize.toast('Bienvenido de vuelta. ' + home.userObj.user.name, 4000);
            }
        }

        /**
         * Sets current user
         * 
         */

        function setuserObj() {
            home.userObj = $rootScope.credentials;
            Session.create(home.userObj.user, home.userObj.token);
            $rootScope.isAuthenticated = Authentication.isAuthenticated();
            Materialize.toast('¡Bienvenido! ' + home.userObj.user.name, 4000);
        }

        /**
         * Logouts user
         * 
         */

        function logoutSuccess() {
            if ($rootScope.isAuthenticated) {
                Session.destroy();
                $rootScope.credentials = null;
                home.userObj = null;
            } else {
                $rootScope.credentials = null;
                home.userObj = null;
            }
            $window.sessionStorage.removeItem("userInfo");
            $rootScope.isAuthenticated = Authentication.isAuthenticated();
        }

        /**
         * On login failed
         * 
         */

        function loginFailed() {
            Materialize.toast('Hubo un problema con tus credenciales, intenta de nuevo', 4000);
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
         * Returns user to search mode
         * 
         */

        home.backToSearch = function () {
            $rootScope.inUserWindow = false;
            $rootScope.$broadcast('closeUserWindows');
        }



        /**
         * Auth Events
         * 
         */

        $scope.$on(AUTH_EVENTS.loginFailed, loginFailed);
        $scope.$on(AUTH_EVENTS.logoutSuccess, logoutSuccess);
        $scope.$on(AUTH_EVENTS.loginSuccess, setuserObj);
    }
})();