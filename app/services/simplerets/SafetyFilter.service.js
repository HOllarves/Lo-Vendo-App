;
(function () {
    "use strict";

    angular.module('LoVendoApp.services')
        .factory('SafetyFilter', ['$rootScope', SafetyFilter]);

    function SafetyFilter($rootScope) {

        /**
         * It filters data to avoid bad results from SimpleRETS API
         * @param {Array} - The array is iterated over inside the function
         * 
         */

        function filterData(objInstance) {
            if (!objInstance)
                return false;
            var ok = true;
            if ($rootScope.requestObj.minprice != undefined) {
                ok = $rootScope.requestObj.minprice < objInstance.listPrice
            }
            if ($rootScope.requestObj.maxprice != undefined) {
                ok = $rootScope.requestObj.maxprice >= objInstance.listPrice
            }
            if ($rootScope.requestObj.minbeds != undefined) {
                ok = $rootScope.requestObj.minbeds < objInstance.property.bedrooms
            }
            if ($rootScope.requestObj.maxbeds != undefined) {
                ok = $rootScope.requestObj.maxbeds >= objInstance.property.bedrooms
            }
            if ($rootScope.requestObj.minbaths != undefined) {
                ok = $rootScope.requestObj.minbaths < objInstance.property.bathsFull
            }
            if ($rootScope.requestObj.maxbaths != undefined) {
                ok = $rootScope.requestObj.maxbaths >= objInstance.property.bathsFull
            }
            if ($rootScope.requestObj.type) {
                if ($rootScope.requestObj.type.length == 0) {
                    ok = true;
                } else {
                    if ($rootScope.requestObj.type.length == 2) {
                        ok = true;
                    } else {
                        if ($rootScope.requestObj.type == 'residential' && objInstance.property.type == "RES") {
                            ok = true;
                            return ok;
                        } else {
                            ok = false;
                        }
                        if ($rootScope.requestObj.type == 'rental' && objInstance.property.type == "RNT") {
                            ok = true;
                            return ok;
                        } else {
                            ok = false;
                        }
                    }
                }
            } else {
                ok = true;
            }
            return ok;
        }
        return {
            filterData: filterData
        }
    }

})();