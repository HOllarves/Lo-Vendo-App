(function () {

    angular.module('LoVendoApp.services')
        .service('Session', ['$rootScope', Session])

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