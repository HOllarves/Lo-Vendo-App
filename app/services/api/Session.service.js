;
(function () {
    "use strict";

    angular.module('LoVendoApp.services')
        .service('Session', ['$rootScope', Session])

    /**
     * Creates session using the user data
     * and the token provided by the server
     * 
     */

    function Session($rootScope) {
        this.create = function (user, token) {
            this.user = user;
            this.token = token;
        };
        this.destroy = function () {
            this.user = null;
            this.token = null;
        };
        return this;
    }

})();