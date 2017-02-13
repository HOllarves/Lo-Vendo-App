;
(function () {
    "use strict";

    angular.module('LoVendoApp.services')
        .factory('ModalOptions', ['$rootScope', 'SafetyFilter', 'GreatSchools', ModalOptions]);


    /**
     * Returns modal options for the
     * house detail modal
     * 
     */

    function ModalOptions($rootScope, SafetyFilter, GreatSchools) {

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
                    },
                    carouselData: function () {

                        //Min price will be 20% less than max price
                        var minPrice = home.listPrice - (home.listPrice * .30);
                        //Max price 20% more than listPrice
                        var maxPrice = home.listPrice + (home.listPrice * .30);
                        //Min area is 20% less than property area
                        var minArea = home.property.area - (home.property.area * .30);
                        //Max area is 20% more than property area
                        var maxArea = home.property.area + (home.property.area * .30);

                        var carouselFilter = {
                            "minprice": minPrice,
                            "maxprice": maxPrice,
                            "maxbeds": home.property.bedrooms,
                            "maxbaths": home.property.bathsFull,
                            "minarea": minArea,
                            "maxarea": maxArea,
                            "limit": 20,
                            "offset": 0,
                            "cities": home.address.city
                        };

                        //Filtering similar houses from root global house data object
                        var carouselData = $rootScope.globalHousesData.filter(SafetyFilter.filterData, carouselFilter);

                        return carouselData;
                    },
                    schoolData: function () {
                        //Making call to API
                        return GreatSchools.getNearbySchools(home.address.city, home.address.postalCode)
                    }
                }
            }
        }

        return {
            getHouseDetailOptions: getHouseDetailOptions
        }
    }

})();