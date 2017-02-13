;
(function () {
    "use strict";

    angular.module('LoVendoApp.controllers')
        .controller('LayoutCtrl', ['$scope', '$rootScope', 'Session', 'AUTH_EVENTS',
            'SimpleRETS', '$uibModal', '$filter', 'ModalOptions', 'SafetyFilter', '_', 'UserMeta', 'REQUEST_LIMIT', LayoutCtrl
        ]);

    function LayoutCtrl($scope, $rootScope, Session, AUTH_EVENTS, SimpleRETS, $uibModal, $filter, ModalOptions, SafetyFilter, _, UserMeta, REQUEST_LIMIT) {
        //Setting controller
        var layout = this;
        //Sets signup as first form
        $scope.signUp = true;

        /**
         * Switch which form to show
         * depending on what the user
         * wants to do
         *
         * 
         */


        layout.switchSignIn = function () {
            $scope.signUp = !$scope.signUp;
        };

        /**
         * Logs out user.
         * 
         */

        layout.logout = function () {
            $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess)
        };

        /**
         * Refresh data with q param provided by
         * the search input in the layout
         * 
         */

        layout.search = function () {
            layout.filterChanged();
        };

        /**
         *
         * House Detail Modal Instance
         *
         */

        layout.openComponentModal = function (home) {
            //Checking types
            home.listPrice = parseInt(home.listPrice);
            home.property.area = parseInt(home.property.area);
            //Opening modal
            let modalOptions = ModalOptions.getHouseDetailOptions(home);
            var modalInstance = $uibModal.open(modalOptions);
        };

        /**
         * Handles side menu
         * 
         */

        layout.handleSideMenu = function () {
            $rootScope.$broadcast('closeUserWindows');
            if ($scope.showSideMenu) {
                $scope.showSideMenu = false;
            } else {
                $scope.showSideMenu = true;
            }
        }

        /**
         * Subnavbar data
         * 
         */

        $scope.showFilters = false;
        layout.houseTypes = [{
            displayName: "Casa",
            name: "Casas",
            selected: false
        }, {
            displayName: "Apartamento",
            name: "Apartamentos",
            selected: false
        }];

        /**
         * Selects a house type, filters and
         * puts it in the requestObj.type array
         * 
         */

        layout.select = function () {
            $rootScope.requestObj.type = layout.houseTypes
                .filter(function (item) {
                    return item.selected
                })
                .map(function (item) {
                    return item.name
                });
            layout.filterChanged();
        }

        /**
         * Sets filter in buy mode
         * 
         */

        layout.buyMode = function () {
            if ($scope.rentActive) {
                $scope.rentActive = false;
            }
            if ($rootScope.requestObj.rentmode) {
                $rootScope.requestObj.rentmode = false;
                var maxPriceTag = {
                    name: "Precio Max",
                    filter: "maxprice"
                }
                layout.removeTag(maxPriceTag);
            }
            $scope.buyActive = true;
            $rootScope.requestObj.buymode = true;
            layout.filterChanged($rootScope.requestObj);
        }

        /**
         * Sets filter in rent mode
         * 
         */

        layout.rentMode = function () {
            if ($scope.buyActive) {
                $scope.buyActive = false;
            }
            if ($rootScope.requestObj.buymode) {
                $rootScope.requestObj.buymode = false;
            }
            $scope.rentActive = true;
            $rootScope.requestObj.rentmode = true;
            layout.filterChanged($rootScope.requestObj);
        }

        /**
         * Broadcast event to open saved houses window
         * 
         */

        layout.showSavedHouses = function () {
            $rootScope.inUserWindow = true;
            $rootScope.$broadcast('openSavedHouses');
        }

        /**
         * Broadcast event to open saved searches window
         * 
         */

        layout.showSavedSearches = function () {
            $rootScope.inUserWindow = true;
            $rootScope.$broadcast('openSavedSearches');
        }

        /**
         * Recenters map in Florida
         * 
         */

        layout.centerFlorida = function () {
            $rootScope.$broadcast('recenter', {
                home: true
            });
        }

        /**
         * Gets triggered when a filter is changed
         * 
         */

        layout.filterChanged = function (obj) {
            if (!obj) {
                obj = $rootScope.requestObj;
            }
            //Tags that will be shown in the filter
            layout.avTags = UserMeta.avTags();
            Object.keys(obj).forEach(function (objKey) {
                Object.keys(layout.avTags).forEach(function (tagKey) {
                    if (obj[objKey] && layout.avTags[tagKey].filter == objKey && objKey != "limit" && objKey != "cities" && objKey != "q") {
                        layout.avTags[tagKey].value = obj[objKey];
                    }
                    if (obj[objKey] && layout.avTags[tagKey].filter == objKey && objKey == "type") {
                        layout.avTags[tagKey].value = obj[objKey]
                            .join(', ')
                            .replace(/\w\S*/g, function (txt) {
                                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                            });
                    }
                    if (obj[objKey] && layout.avTags[tagKey].filter == objKey && objKey == "buymode") {
                        if ($scope.rentActive) {
                            $scope.rentActive = false;
                        }
                        $scope.buyActive = true;
                        layout.avTags[tagKey].value = "Compra";
                    }
                    if (obj[objKey] && layout.avTags[tagKey].filter == objKey && objKey == "rentmode") {
                        if ($scope.buyActive) {
                            $scope.buyActive = false;
                        }
                        $scope.rentActive = true;
                        layout.avTags[tagKey].value = "Renta";
                    }
                });
            });
            //Filtering tags that have a value assigned
            layout.tags = layout.avTags.filter(function (obj) {
                return obj.value;
            });
            //Showing active filters dropdown
            if (layout.tags.length > 0) {
                $scope.activeFilters = true;
            }
            //Allowing the user to save search
            if (!$scope.activeSearch) {
                $scope.activeSearch = true;
            }
            //Activating local filters in map
            $rootScope.$broadcast('localFilter');
        }


        /**
         * Removes a tag from tags array and requestObj 
         * when the user deletes it
         * @param {Object} tag
         */

        layout.removeTag = function (tag) {
            if (!layout.tags) {
                layout.tags = UserMeta.avTags();
            }
            if (tag.filter == "rentmode") {
                $scope.rentActive = false;
            }
            if (tag.filter == "buymode") {
                $scope.buyActive = false;
            }
            var arr = layout.tags.filter(function (obj, index) {
                return obj.name != tag.name
            });
            layout.tags = arr;
            Object.keys($rootScope.requestObj).forEach(function (key) {
                if (key == tag.filter) {
                    if (key == 'type') {
                        $rootScope.requestObj[key] = [];
                    } else {
                        $rootScope.requestObj[key] = null;
                    }
                }
            });
            //If tags array is empty, hiding Active Filters button
            if (layout.tags.length == 0) {
                $scope.activeFilters = false;
                $scope.activeSearch = false;
            }
            //If a search is not present in the tagsArray
            layout.tags.forEach(function (element, index, array) {
                $scope.activeSearch = false;
                if (index == array.length - 1) {
                    $scope.activeSearch = true;
                }
            }, this);
            //Refreshing map
            $rootScope.$broadcast('localFilter');
        }

        /**
         * Reloads map with new results from city
         * 
         */

        layout.loadCity = function () {
            $rootScope.requestObj.cities = $rootScope.requestObj.cities.split(",")[0];
            $rootScope.requestObj.limit = REQUEST_LIMIT.simplyRETS;
            $rootScope.$broadcast('cancelAllRequests');
        }

        /**
         * Saves current search to the database
         * @param {String} search_name
         * 
         */

        layout.saveSearch = function (search_name) {
            console.log(search_name);
            if (!search_name || search_name.length == 0) {
                Materialize.toast('Debes llenar el campo de busqueda', 4000);
                return false;
            }
            var send_filters = [];
            var filters = layout.tags.filter(function (obj) {
                return obj.filter != "q"
            });
            filters.forEach(function (element) {
                send_filters.push(element.filter + ': ' + element.value);
            }, this);
            var search_obj = {
                search_name: search_name,
                filters: send_filters
            }
            UserMeta.postSavedSearch(search_obj)
                .then(function (data) {
                    Materialize.toast('Busqueda guardada con exito', 4000);
                })
                .catch(function () {
                    Materialize.toast('Ha habido un problema guardando tu busqueda', 4000);
                });
        }

        /**
         * Cleans the global requestObj
         * 
         */

        $scope.$on('cleanRequestObj', function (evt, args) {
            //Reseting requestObj
            Object.keys($rootScope.requestObj).forEach(function (key) {
                if (key != 'limit') {
                    $rootScope.requestObj[key] = null;
                } else {
                    $rootScope.requestObj[key] = REQUEST_LIMIT.simplyRETS;
                }
            });
        })
    }
})();
