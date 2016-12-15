;
(function () {
    "use strict";

    angular.module('LoVendoApp.directives')
        .directive('sideMenu', function () {
            return {
                restrict: 'E',
                templateUrl: './modules/layout/navbar/side-menu.html'
            }
        })

})();