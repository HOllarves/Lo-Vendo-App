;
(function () {
    "use strict";

    angular.module('LoVendoApp.directives')
        .directive('savedHouses', ['UserMeta', 'SimpleRETS', 'ModalOptions', 'Authentication', '$rootScope', '$uibModal', function (UserMeta, SimpleRETS, ModalOptions, Authentication, $rootScope, $uibModal) {
            return {
                restrict: 'E',
                templateUrl: './modules/home/saved-houses.html',
                link: function () {},
                controller: function (UserMeta, $rootScope, $scope) {

                    //Controller
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
                            });
                    }

                    /**
                     * Removes saved house from DOM and DB
                     * @param {Object} house - Instance of the house intented for removal
                     */

                    $savedHouseCtrl.removeHouse = function (house) {
                        UserMeta.deleteSavedHouse(house._id).then(function (res) {
                            $savedHouseCtrl.savedHouses = res.data.saved_houses;
                        });

                    };

                    /**
                     * Open House Detail modal
                     * 
                     */

                    $savedHouseCtrl.openHouseDetailModal = function (house_id) {
                        SimpleRETS.getHouse(house_id).then(function (res) {
                            var home = res;
                            var modalOptions = ModalOptions.getHouseDetailOptions(home);
                            var modalInstance = $uibModal.open(modalOptions);
                        }).catch(function () {
                            Materialize.toast('Esta casa ya no existe', 4000);
                        });
                    }

                    //Invokes function when event is triggered
                    $rootScope.$on('openSavedHouses', loadSavedHouses);
                },
                controllerAs: '$savedHouseCtrl'
            }
        }]);

})();