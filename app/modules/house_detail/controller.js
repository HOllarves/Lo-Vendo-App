;
(function () {
    "use strict";

    angular.module('LoVendoApp.controllers')
        .controller('HouseDetailCtrl', ['home', '$scope', '$rootScope', '$uibModalInstance', '_', 'UserMeta', HouseDetailCtrl]);

    function HouseDetailCtrl(home, $scope, $rootScope, $uibModalInstance, _, UserMeta) {

        var $ctrl = this;
        $ctrl.home = pruneEmpty(home);
        console.log('detail object', $ctrl.home);

        /**
         * Removes 'bad' values from object and replace them
         * with No Disponible
         * @param {Object} obj
         * 
         */

        function pruneEmpty(obj) {
            return function prune(current) {
                _.forOwn(current, function (value, key) {
                    if (_.isUndefined(value) || _.isNull(value) || _.isNaN(value) ||
                        (_.isString(value) && _.isEmpty(value)) ||
                        (_.isObject(value) && _.isEmpty(prune(value)))) {

                        current[key] = "No Disponible"
                    }
                });
                // remove any leftover undefined values from the delete 
                // operation on an array
                if (_.isArray(current)) _.pull(current, undefined);

                return current;

            }(_.cloneDeep(obj)); // Do not modify the original object, create a clone instead
        }

        /**
         * 
         * Closes Modal
         * 
         */

        $scope.closeModal = function () {
            $uibModalInstance.close();
        }

        /**
         * Saves house to the database
         * @param {Object} house
         * 
         */

        $ctrl.saveHouse = function (house) {
            var house_obj = {
                mlsId: house.mlsId,
                addressFull: house.address.full,
                bedrooms: house.property.bedrooms,
                listPrice: house.listPrice,
                photo: house.photos[0],
                bathrooms: house.property.bathsFull,
                sqft: house.property.area
            }

            UserMeta.postSavedHouse(house_obj).then(function (res) {
                console.log(res);
            });
        }

        console.log($rootScope.globalHousesData);

    }

})();