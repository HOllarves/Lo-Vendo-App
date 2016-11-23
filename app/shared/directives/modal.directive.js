;
(function () {
    "use strict";
    
    angular.module('LoVendoApp.directives')
        .directive('modal', [function () {
            return {
                restrict: 'AE',
                templateUrl: './modules/home/login-modal.html',
                link: function (scope, el, attrs) {
                    //Removes Modal
                    scope.dismiss = function () {
                        el.modal('hide');
                    }
                },
                controller: function () {}
            }
        }])

})();