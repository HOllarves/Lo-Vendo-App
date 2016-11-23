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
                    var $ctrl = this;
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
                                $ctrl.savedSearches = res.saved_searches;
                                //Showing data
                                $scope.showData = true;
                                var search_filters = [];
                                Object.keys($ctrl.savedSearches).forEach(function (objKey) {
                                    $ctrl.savedSearches[objKey].filters.forEach(function (element) {
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
                                    //and assign the data to the exposed object $ctrl.savedSearches
                                    $ctrl.savedSearches[objKey].filters = search_filters.filter(function (elem, pos) {
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

                    $ctrl.removeSearch = function (id) {
                        UserMeta.deleteSavedSearch(id).then(function (res) {
                            $ctrl.savedSearches = res.data.saved_searches;
                        })
                    }


                    /**
                     * Searches using saved parameters
                     * @param {Object} search
                     */

                    $ctrl.goSearch = function (search) {
                        var base_filters = [];
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
                                //If it matches, I assign the value to the base_filters array
                                if (avTags[tagKey].name == filter.name) {
                                    filter.name = avTags[tagKey].filter;
                                }
                                base_filters.push(filter);
                            })
                        }, this);
                        //I filter over the base_filters array to remove duplicates
                        //and assign it to the request array. This array will populate the
                        //global requestObject
                        var request = base_filters.filter(function (elem, pos) {
                            return base_filters.indexOf(elem) == pos;
                        });
                        //We iterate over the global request object
                        Object.keys($rootScope.requestObj).forEach(function (objKey) {
                            Object.keys(request).forEach(function (elKey) {
                                //If the values match with those in the request array
                                //we assign the value to the global request object
                                if (objKey == request[elKey].name) {
                                    $rootScope.requestObj[objKey] = parseInt(request[elKey].value);
                                }
                            }, this);
                        });
                        //Binding search_name to the global requestObj
                        $rootScope.requestObj.q = search.search_name;
                        //Calling the filterChanged function that reloads the data and map
                        $scope.$parent.layout.filterChanged();
                        //Hiding the activeSearch button to avoid having the user saving the same search
                        $scope.$parent.activeSearch = false;
                        $rootScope.$broadcast('closeUserWindows');

                    }

                    //Invokes function when event is triggered
                    $rootScope.$on('openSavedSearches', loadSavedSearches);
                },
                controllerAs: '$ctrl'
            }
        }]);

})();