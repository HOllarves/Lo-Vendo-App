;
(function () {
    "use strict";

    angular.module('LoVendoApp.directives')
        .directive('dropdownNoClose', [function () {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    element.on('click', function (e) {
                        e.stopPropagation();
                    });
                }
            };
        }]);

})();