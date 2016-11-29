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
        .config(function (cfpLoadingBarProvider) {
            cfpLoadingBarProvider.includeSpinner = false;
        })
        .run(['amMoment', function (amMoment) {
            //Setting moment.js locale to spanish
            amMoment.changeLocale('es');
        }]);
})();
