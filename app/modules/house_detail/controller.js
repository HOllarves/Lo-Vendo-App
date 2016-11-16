(function () {
    angular.module('LoVendoApp.controllers')
        .controller('HouseDetailCtrl', ['home', '$scope', '$uibModalInstance', '_', HouseDetailCtrl]);

    function HouseDetailCtrl(home, $scope, $uibModalInstance, _) {

        var $ctrl = this;
        $ctrl.home = pruneEmpty(home);
        console.log('detail object', $ctrl.home);

        /**
         * Removes 'bad' values from object
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

    }

})();