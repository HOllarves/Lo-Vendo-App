(function(){
    angular.module("LoVendoApp", [
        "ui.router",
        "ngMessages",
        "angular-jwt",
        "LoVendoApp.routes",
        "LoVendoApp.controllers",
        "LoVendoApp.directives",
        "LoVendoApp.services"
    ])
    .constant('AUTH_EVENTS', {
        loginSuccess : 'auth-login-success',
        loginFailed : 'auth-login-failed',
        logoutSuccess : 'auth-logout-success',
        sessionTimeout : 'auth-session-timeout',
        notAuthenticated : 'auth-not-authenticated',
    });
})();
