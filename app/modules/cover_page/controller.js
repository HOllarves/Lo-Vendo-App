;
(function () {
    "use strict";

    angular.module('LoVendoApp.controllers')
        .controller('CoverPageCtrl', ['$scope', '$rootScope', '$state', CoverPageCtrl]);

    function CoverPageCtrl($scope, $rootScope, $state) {
        var cover = this;
        $scope.city = '';
        cover.searchCity = function (city) {
            $scope.city = city;
            if ($scope.city) {
                $state.go('main.home', {
                    city: $scope.city
                });
            } else {
                Materialize.toast('Por favor introduzca una ciudad', 4000);
            }
        }
    }
})();