;
(function () {
    "use strict";

    angular.module('LoVendoApp.directives')
        .directive('savedSearches', ['UserMeta', '$rootScope', function (UserMeta, $rootScope) {
            return {
                restrict: 'E',
                templateUrl: './modules/home/saved-searches.html',
                link: function () {},
                controller: function (UserMeta, $rootScope, $scope) {
                    var $savedSearchesCtrl = this;
                    //showing data
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
                                var search_filters = [];
                                Object.keys($savedSearchesCtrl.savedSearches).forEach(function (objKey) {
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
                     * Searches using saved parameters
                     * @param {Object} search
                     */
                    $savedSearchesCtrl.goSearch = function (search) {
                        var request = [];
                        //I iterate over the array of filters of
                        //the selected search
                        search.filters.forEach(function (element) {
                            //Similar to the prior function, I split the values into
                            //name and value
                            var filter = {
                                    name: element.split(':')[0],
                                    value: element.split(':')[1].trim()
                                }
                                //I iterate over the avTags array to find matches
                            Object.keys(avTags).forEach(function (tagKey) {
                                //If it matches, I assign the value to the request array
                                if (avTags[tagKey].name == filter.name) {
                                    filter.name = avTags[tagKey].filter;
                                } else {

                                }
                            });
                            request.push(filter);
                        }, this);
                        var matches = [];
                        request.forEach(function (element, index) {
                            //We iterate over the global request object
                            Object.keys($rootScope.requestObj).forEach(function (objKey) {
                                //If the values match with those in the request array
                                //we assign the value to the global request object
                                if (element.name == objKey) {
                                    $rootScope.requestObj[objKey] = parseInt(element.value);
                                    matches.push(element);
                                } else {
                                    //If not we check if they do not match with previous matches
                                    matches.forEach(function (element) {
                                        if (element.name != objKey && objKey != 'limit') {
                                            $rootScope.requestObj[objKey] = null;
                                        }
                                    }, this);
                                }
                                //I must find a way to loop through the object without overwriting my previous
                                //assignments of values on my requestObj properties.
                            });
                        });
                        //Binding search_name to the global requestObj
                        $rootScope.requestObj.q = search.search_name;
                        //Calling the filterChanged function that reloads the data and map
                        $scope.$parent.layout.filterChanged();
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