;
(function () {
    "use strict";

    angular.module('LoVendoApp.directives')
        .directive('savedHouses', ['UserMeta', '$rootScope', function (UserMeta, Authentication, $rootScope) {
            return {
                restrict: 'E',
                templateUrl: './modules/home/saved-houses.html',
                link: function () {},
                controller: function (UserMeta, $rootScope, $scope) {

                    var $savedHouseCtrl = this;

                    //Flag that will control the showing of data
                    $scope.showData = false;

                    /**
                     * Fetch saved houses data
                     * 
                     */
                    function loadSavedHouses() {
                        UserMeta.getSavedHouses()
                            .then(function (res) {
                                $savedHouseCtrl.savedHouses = res.saved_houses;
                                $scope.showData = true;
                                console.log($scope.showData);
                                console.log($savedHouseCtrl.savedHouses);
                            });
                    }

                    /**
                     * Removes saved house from DOM and DB
                     * 
                     */

                    $savedHouseCtrl.removeHouse = function (house) {
                            console.log(house);
                            UserMeta.deleteSavedHouse(house._id).then(function (res) {
                                $savedHouseCtrl.savedHouses = res.data.saved_houses;
                            });

                        }
                        //Invokes function when event is triggered
                    $rootScope.$on('openSavedHouses', loadSavedHouses);
                },
                controllerAs: '$savedHouseCtrl'
            }
        }]);

})();