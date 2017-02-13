;
(function () {
    "use strict";

    angular.module('LoVendoApp.controllers')
        .controller('HouseDetailCtrl', ['home', 'carouselData', 'schoolData', '$scope', '$rootScope', '$window', '$uibModalInstance', '_', 'UserMeta', 'Authentication', 'SimpleRETS', HouseDetailCtrl]);

    function HouseDetailCtrl(home, carouselData, schoolData, $scope, $rootScope, $window, $uibModalInstance, _, UserMeta, Authentication, SimpleRETS) {

        //Controller
        var $ctrl = this;


        //No houses flag
        $scope.noHouses = false;
        if (home.length == 0) {
            $scope.noHouses = true;
        }

        //Cleaning null values
        $ctrl.home = pruneEmpty(home);

        //Initializing number of tiles in carousel
        $scope.numberOfTiles = $window.innerWidth > 769 ? 3 : 1;

        //Initializing carouselData
        $scope.carouselData = carouselData;

        //Initializing schoolData
        if (schoolData == null || schoolData == '' || schoolData == 'Bad-Request') {
            $scope.schoolData = null;
        } else {
            $scope.schoolData = schoolData.schools.school;
        }

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

                        current[key] = ""
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

            UserMeta.postSavedHouse(house_obj)
                .then(function (res) {
                    Materialize.toast('La casa ha sido guardada con éxito', 4000);
                    $scope.houseIsSaved = true;
                })
                .catch(function (error) {
                    Materialize.toast('Ha habido un problema guardando la casa', 4000)
                });
        }

        /**
         * Fetch users save houses to check if house
         * is already saved
         * 
         */

        if (Authentication.isAuthenticated()) {
            UserMeta.getSavedHouses()
                .then(function (res) {
                    res.saved_houses.forEach(function (element) {
                        if (home.mlsId == parseInt(element.mlsId)) {
                            $scope.houseIsSaved = true;
                        }
                    }, this);
                })
                .catch(function () {
                    Materialize.toast('Ha habido un error, intente más tarde', 4000)
                });
        }
    }

})();