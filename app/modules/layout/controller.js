;
(function () {
    "use strict";

    angular.module('LoVendoApp.controllers')
        .controller('LayoutCtrl', ['$scope', '$rootScope', 'Session', 'AUTH_EVENTS',
            'SimpleRETS', '$uibModal', '$filter', 'ModalOptions', 'SafetyFilter', '_', 'UserMeta', LayoutCtrl
        ]);

    function LayoutCtrl($scope, $rootScope, Session, AUTH_EVENTS, SimpleRETS, $uibModal, $filter, ModalOptions, SafetyFilter, _, UserMeta) {
        var layout = this;
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
            $rootScope.$broadcast('loadMap');
        };

        /**
         *
         * House Detail Modal Instance
         *
         */

        layout.openComponentModal = function (home) {
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
            name: "residential",
            selected: false
        }, {
            displayName: "Apartamento",
            name: "rental",
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
            $rootScope.requestObj.minprice = 20000;
            if ($rootScope.requestObj.maxprice <= 20000) {
                $rootScope.requestObj.maxprice = null;
                var maxPriceTag = {
                    name: "Precio Max",
                    filter: "maxprice"
                }
                layout.removeTag(maxPriceTag);
            }
            console.log($rootScope.requestObj);
            layout.filterChanged($rootScope.requestObj);
        }

        /**
         * Sets filter in rent mode
         * 
         */

        layout.rentMode = function () {
            $rootScope.requestObj.minprice = null;
            $rootScope.requestObj.maxprice = 20000;
            layout.filterChanged($rootScope.requestObj);
        }

        /**
         * Broadcast event to open saved houses window
         * 
         */

        layout.showSavedHouses = function () {
            $scope.inUserWindow = true;
            $rootScope.$broadcast('openSavedHouses');
        }

        /**
         * Returns user to search mode
         * 
         */
        
        layout.backToSearch = function(){
            $scope.inUserWindow = false;
            $rootScope.$broadcast('closeUserWindows');
        }

        /**
         * Broadcast event to open saved searches window
         * 
         */

        layout.showSavedSearches = function () {
            $scope.inUserWindow = true;
            $rootScope.$broadcast('openSavedSearches');
        }

        //Tags that will be shown in the filter
        layout.avTags = UserMeta.avTags();

        /**
         * Gets triggered when a filter is changed
         * 
         */

        layout.filterChanged = function (obj) {
            if (!obj) {
                obj = $rootScope.requestObj;
            }
            Object.keys(obj).forEach(function (objKey) {
                Object.keys(layout.avTags).forEach(function (tagKey) {
                    if (obj[objKey] && layout.avTags[tagKey].filter == objKey && objKey != "limit") {
                        layout.avTags[tagKey].value = obj[objKey];
                    }
                    if (obj[objKey] && layout.avTags[tagKey].filter == objKey && objKey == "type") {
                        layout.avTags[tagKey].value = obj[objKey]
                            .join(', ')
                            .replace(/\w\S*/g, function (txt) {
                                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                            });
                    }
                });
            });
            layout.tags = layout.avTags.filter(function (obj) {
                return obj.value;
            });
            if (layout.tags.length > 0) {
                $scope.activeFilters = true;
            }
            if (!$scope.activeSearch) {
                $scope.activeSearch = true;
            }
            $rootScope.$broadcast('loadMap');
        }


        /**
         * Removes a tag from tags array and requestObj when the user deletes it
         * 
         */

        layout.removeTag = function (tag) {
            console.log(tag);
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
            layout.tags.forEach(function (element) {
                $scope.activeSearch = false;
                if (element.id == 9) {
                    $scope.activeSearch = true;
                }
            }, this);
            //Refreshing map
            $rootScope.$broadcast('loadMap');
        }

        /**
         * Saves current search to the database
         * 
         */

        layout.saveSearch = function (search_name) {
            if (!search_name) {
                search_name = $rootScope.requestObj.q;
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
            UserMeta.postSavedSearch(search_obj).then(function (data) {
                console.log(data);
            });

        }

        layout.saveHouse = function (house) {
            console.log(house);
        }
    }
})();
