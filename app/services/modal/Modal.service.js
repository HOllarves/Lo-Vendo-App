;
(function () {
    "use strict";

    angular.module('LoVendoApp.services')
        .factory("ModalOptions", [ModalOptions]);


    /**
     * Returns modal options for the
     * house detail modal
     * 
     */

    function ModalOptions() {
        function getHouseDetailOptions(home) {
            return {
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: './modules/house_detail/house-detail-modal.html',
                windowClass: 'full-screen',
                controller: 'HouseDetailCtrl',
                controllerAs: '$ctrl',
                resolve: {
                    home: function () {
                        return home;
                    }
                }
            }
        }

        return {
            getHouseDetailOptions: getHouseDetailOptions
        }
    }

})();