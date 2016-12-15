;
(function () {
    "use strict";

    angular.module('LoVendoApp.services')
        .factory('SafetyFilter', ['$rootScope', SafetyFilter]);

    function SafetyFilter($rootScope) {

        /**
         * It filters data to avoid bad results from SimpleRETS API
         * @param {Array} - Instace of the object passed in the filter function
         * 
         */

        function filterData(objInstance) {

            // 'this' will be any custom parameter passed to the filter function
            var customFilter = this;

            var filters;
            //If no instance, return false
            if (!objInstance)
                return false;

            var ok = true;
            if (!customFilter) {
                filters = $rootScope.requestObj;
            } else {
                filters = customFilter
            }


            //Checking if object have coordinates
            if (!objInstance.geo.lat || !objInstance.geo.lng || objInstance.geo.lat == null || objInstance.geo.lng == null) {
                ok = false;
            }

            //Comparing with requestObj
            if (filters.minprice != undefined) {
                if (ok)
                    ok = filters.minprice < objInstance.listPrice
            }
            if (filters.maxprice != undefined) {
                if (ok)
                    ok = filters.maxprice >= objInstance.listPrice
            }
            if (filters.minbeds != undefined) {
                if (ok)
                    ok = filters.minbeds < objInstance.property.bedrooms
            }
            if (filters.maxbeds != undefined) {
                if (ok)
                    ok = filters.maxbeds >= objInstance.property.bedrooms
            }
            if (filters.minbaths != undefined) {
                if (ok)
                    ok = filters.minbaths < objInstance.property.bathsFull
            }
            if (filters.minarea != undefined) {
                if (ok)
                    ok = filters.minarea <= objInstance.property.area
            }
            if (filters.maxarea != undefined) {
                if (ok)
                    ok = filters.maxarea >= objInstance.property.area
            }
            if (filters.maxbaths != undefined) {
                if (ok)
                    ok = filters.maxbaths >= objInstance.property.bathsFull
            }
            if (filters.rentmode) {
                if (ok)
                    ok = objInstance.listPrice < 20000
            }
            if (filters.buymode) {
                if (ok)
                    ok = objInstance.listPrice > 20000
            }
            if (filters.type) {
                if (filters.type.length == 0) {
                    if (ok)
                        return ok;
                } else {
                    if (filters.type.length == 2) {
                        if (ok)
                            return ok;
                    } else {
                        if (filters.type == 'Casas' && filters.type != 'Apartamentos' && objInstance.address.unit == null) {
                            if (ok)
                                return ok;
                        } else if (filters.type == 'Apartamentos' && filters.type != 'Casas' && objInstance.address.unit) {
                            if (ok)
                                return ok;
                        }
                    }
                }
            } else {
                if (ok)
                    return ok;
            }
        }

        /**
         * Makes sure an object contains
         * geo data
         * 
         * @param {Object} objInstance - Instance passed by the filter function
         */

        function geoData(objInstance) {
            var ok = true;
            //Checking if object have coordinates
            if (objInstance.geo.lat == null || objInstance.geo.lng == null) {
                ok = false;
            }

            return ok;
        }
        return {
            filterData: filterData,
            geoData: geoData
        }
    }

})();