(function () {

    angular.module('LoVendoApp.services')
        .factory("ModalOptions", [ModalOptions]);


    /**
     * Returns modal options for the
     * house detail modal
     * 
     */

    function ModalOptions() {
        return {
            getOptions: function (home) {
                return {
                    animation: true,
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    templateUrl: './modules/house_detail/modal-detail.html',
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
        }
    }

})();