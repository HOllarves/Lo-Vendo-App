(function(){
    angular.module("LoVendoApp", [
        //Main Modules
        "LoVendoApp.routes",
        "LoVendoApp.controllers",
        "LoVendoApp.directives",
        "LoVendoApp.services",
        //3rd Party Modules
        "ui.router",
        "ngSanitize",
        "ngAnimate",
        "ngMessages",
        "angular-jwt",
        "ui.bootstrap",
        "lodash"
    ])
    //Authentication events
    .constant('AUTH_EVENTS', {
        loginSuccess : 'auth-login-success',
        loginFailed : 'auth-login-failed',
        logoutSuccess : 'auth-logout-success',
        notAuthenticated : 'auth-not-authenticated',
    });
})();
