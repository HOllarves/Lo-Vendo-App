;
(function () {
    "use strict";

    angular.module('LoVendoApp.directives')
        .directive('savedSearches', ['UserMeta', '$rootScope', 'SafetyFilter', function (UserMeta, $rootScope, SafetyFilter) {
            return {
                restrict: 'E',
                templateUrl: './modules/home/saved-searches.html',
                link: function () {},
                controller: function (UserMeta, $rootScope, SafetyFilter, $scope) {

                    //Controller
                    var $savedSearchesCtrl = this;
                    //Showing data
                    $scope.showData = false;
                    //Getting all available tags
                    var avTags = UserMeta.avTags();

                    /**
                     * Fetch saved searches data
                     * 
                     */

                    function loadSavedSearches() {
                        UserMeta.getSavedSearches()
                            .then(function (res) {
                                //Fetching data from server
                                $savedSearchesCtrl.savedSearches = res.saved_searches;
                                //Showing data
                                $scope.showData = true;
                                Object.keys($savedSearchesCtrl.savedSearches).forEach(function (objKey) {
                                    var search_filters = [];
                                    $savedSearchesCtrl.savedSearches[objKey].filters.forEach(function (element) {
                                        // I am iterating over the savedSearches array to split it's  value
                                        // into name and value
                                        var filter = {
                                                name: element.split(':')[0],
                                                value: element.split(':')[1].trim()
                                            }
                                            //Then I am comparing the gotten name with that
                                            // of my avTags array
                                        Object.keys(avTags).forEach(function (tagKey) {
                                            //When they match I assign the correct value to the search_filters array
                                            if (avTags[tagKey].filter == filter.name) {
                                                filter.name = avTags[tagKey].name;
                                                search_filters.push(filter.name + ': ' + filter.value);
                                            }
                                        })
                                    }, this);
                                    //Lastly I filter the search_filters array to remove duplicates
                                    //and assign the data to the exposed object $savedSearchesCtrl.savedSearches
                                    $savedSearchesCtrl.savedSearches[objKey].filters = search_filters.filter(function (elem, pos) {
                                        return search_filters.indexOf(elem) == pos;
                                    });
                                });
                            });
                    }

                    /**
                     * Removes a search from DOM and
                     * database
                     * @param {String} id - Search ID
                     */

                    $savedSearchesCtrl.removeSearch = function (id) {
                        UserMeta.deleteSavedSearch(id).then(function (res) {
                            $savedSearchesCtrl.savedSearches = res.data.saved_searches;
                        })
                    }

                    /**
                     * Match values in the
                     * global request Object
                     * @param {Object}
                     */

                    function matchValues(requestObj, requestArr) {
                        requestArr.forEach(function (element) {
                            //We iterate over the global request object
                            Object.keys(requestObj).forEach(function (objKey) {
                                //If the values match with those in the request array
                                //we assign the value to the global request object
                                if (element.name == objKey && objKey == "buymode" && objKey != "rentmode") {
                                    requestObj[objKey] = true;
                                    return true;
                                }
                                if (element.name == objKey && objKey == "rentmode" && objKey != "buymode") {
                                    requestObj[objKey] = true;
                                    return true;
                                }
                                if (element.name == objKey) {
                                    requestObj[objKey] = parseInt(element.value);
                                }
                            });
                        });
                        return requestObj;
                    }

                    /**
                     * Searches using saved parameters
                     * @param {Object} search
                     */

                    $savedSearchesCtrl.goSearch = function (search) {
                        //First we clean the requestObj
                        $rootScope.$broadcast('cleanRequestObj');
                        var request = [];
                        //I iterate over the array of filters of
                        //the selected search
                        search.filters.forEach(function (element) {
                            //Similar to the prior function, I split the values into
                            //name and value
                            var filter = {
                                name: element.split(':')[0],
                                value: element.split(':')[1].trim()
                            };
                            //I iterate over the avTags array to find matches
                            Object.keys(avTags).forEach(function (tagKey) {
                                //If it matches, I assign the value to the request array
                                if (avTags[tagKey].name == filter.name && filter.value == "Renta") {
                                    filter.name = "rentmode";
                                    return true;
                                }
                                if (avTags[tagKey].name == filter.name && filter.value == "Compra") {
                                    filter.name = "buymode";
                                    return true;
                                }
                                if (avTags[tagKey].name == filter.name) {
                                    filter.name = avTags[tagKey].filter;
                                }

                            });
                            request.push(filter);
                        }, this);
                        //Match values
                        $rootScope.requestObj = matchValues($rootScope.requestObj, request);
                        //Binding search_name to the global requestObj
                        $rootScope.requestObj.cities = search.search_name;
                        //Load city
                        $scope.$parent.layout.loadCity();
                        //Hiding the activeSearch button to avoid having the user saving the same search
                        $scope.$parent.activeSearch = false;
                        //Closing user windows
                        $rootScope.$broadcast('closeUserWindows');

                    }

                    //Invokes function when event is triggered
                    $rootScope.$on('openSavedSearches', loadSavedSearches);
                },
                controllerAs: '$savedSearchesCtrl'
            }
        }]);

})();