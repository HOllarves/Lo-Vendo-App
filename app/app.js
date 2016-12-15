;
(function () {
    "use strict";

    angular.module("LoVendoApp", [
            //Main Modules
            "LoVendoApp.routes",
            "LoVendoApp.controllers",
            "LoVendoApp.directives",
            "LoVendoApp.services",
            //3rd Party Modules
            "ui.router",
            "ui.bootstrap",
            "slickCarousel",
            "ngSanitize",
            "angularGrid",
            "angular-loading-bar",
            "cb.x2js",
            "ngAnimate",
            "ngMessages",
            "angular-jwt",
            "angularMoment",
            "lodash"
        ])
        //Authentication events
        .constant('AUTH_EVENTS', {
            loginSuccess: 'auth-login-success',
            loginFailed: 'auth-login-failed',
            logoutSuccess: 'auth-logout-success',
        })
        .constant('REQUEST_LIMIT', {
            "simplyRETS": 500,
            "maxResults": 1400
        })
        .config(['cfpLoadingBarProvider', '$httpProvider', function (cfpLoadingBarProvider, $httpProvider) {

            /**
             * Http interceptor to cancel all pending promises
             * when called
             * 
             */

            $httpProvider.interceptors.push(function ($q) {

                return {
                    request: function (config) {
                        if (!config.timeout) {
                            config.cancel = $q.defer();
                            config.timeout = config.cancel.promise;
                        }
                        return config;
                    },
                    responseError: function (response) {
                        if (response.config.timeout.$$state.value === 'Cancel!') {
                            return response || $q.when('bypassed');
                        }
                    }
                }

            });

            //Removing spinner from angularLoader
            cfpLoadingBarProvider.includeSpinner = false;

        }])
        .run(['$rootScope', '$http', 'amMoment', function ($rootScope, $http, amMoment) {

            //Setting moment.js locale to spanish
            amMoment.changeLocale('es');

            /**
             * Event that iterates over all Http pending request
             * and cancels them
             */

            $rootScope.$on('cancelAllRequests', function () {
                if ($http.pendingRequests.length > 0) {
                    $http.pendingRequests.forEach(function (pendingReq, index, array) {
                        if (pendingReq.cancel) {
                            //Resolving all pending requests
                            pendingReq.cancel.resolve('Cancel!');
                        }
                        if (index == array.length - 1) {
                            //Reloading map
                            $rootScope.$broadcast('reloadMap');
                        }
                    })
                } else {
                    //If no pending requests, just reload the map
                    $rootScope.$broadcast('reloadMap');
                }

            });

        }]);
})();
