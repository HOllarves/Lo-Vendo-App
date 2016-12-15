;
(function () {
    "use strict";

    angular.module('LoVendoApp.directives')
        .directive('map', ['SimpleRETS', 'InfoWindowService', 'McOptions', 'ModalOptions', '$rootScope', '$parse', '$uibModal', '$timeout', 'SafetyFilter', 'REQUEST_LIMIT',
            function (SimpleRETS, InfoWindowService, McOptions, ModalOptions, $rootScope, $parse, $uibModal, $timeout, SafetyFilter, REQUEST_LIMIT) {

                // Array to handle infoWindows
                var ibArray = [];

                /**
                 * Hides preloader
                 * 
                 */

                function hideLoaders() {
                    $timeout(function () {
                        $('.preloader-background')
                            .delay(1000)
                            .fadeOut('slow');
                        $('.preloader-wrapper')
                            .delay(1000)
                            .fadeOut();
                    }, 500);
                }

                /**
                 * Shows preloader
                 * 
                 */

                function showLoaders() {
                    $('.preloader-background')
                        .show();
                    $('.preloader-wrapper')
                        .show();
                }

                /**
                 * Creates new google maps
                 * marker
                 *
                 * @param {Object} param
                 * 
                 */

                function _newGoogleMapsMarker(param) {
                    var r = new google.maps.Marker({
                        map: param._map,
                        position: new google.maps.LatLng(param._lat, param._lng),
                        title: param._head,
                        icon: param._icon
                    });
                    if (param._data) {
                        google.maps.event.addListener(r, 'click', function () {
                            // this -> the marker on which the onclick event is being attached
                            if (!this.getMap()._infoWindow) {
                                this.getMap()._infoWindow = new google.maps.InfoWindow({
                                    maxWidth: 400
                                });
                            }
                            this.getMap()._infoWindow.close();
                            var content = InfoWindowService.getContent(param._data);

                            this.getMap()._infoWindow.setContent(content);
                            //Creates event listener for InfoWindow insances
                            google.maps.event.addListener(this.getMap()._infoWindow, 'domready', function () {
                                $("#iw_container")
                                    .off("click")
                                    .on("click", modalListener);
                                //Opens modal when click is listened
                                function modalListener() {
                                    var modalOptions = ModalOptions.getHouseDetailOptions(param._data);
                                    var modalInstance = $uibModal.open(modalOptions);
                                }
                            });
                            this.getMap()._infoWindow.open(this.getMap(), this);
                            ibArray.push(this.getMap()._infoWindow);
                        });
                    }
                    return r;
                }

                /**
                 * Centers map
                 * @param {Object} map - Map object
                 * @param {Integer} lat - Lat coordinates
                 * @param {Integer} lng - Lng coordinates
                 * 
                 */

                function centerMap(map, lat, lng, zoom) {
                    var latLng = new google.maps.LatLng(lat, lng);
                    map.panTo(latLng);
                    if (zoom) {
                        map.setZoom(zoom);
                    }
                }


                return {
                    restrict: 'A',
                    scope: {
                        requestObj: '='
                    },
                    link: function (scope, el, attrs) {
                        //Markers array
                        var markers = [];
                        //MarkerClusterer Object
                        var markerCluster;
                        //First load flag
                        var firstLoad = true;
                        //Total results by MLS
                        var totalResults = [];
                        //Available results
                        var avResults;
                        //Max results to be loaded
                        var maxResults = REQUEST_LIMIT.maxResults;
                        //Backup array for local Filtering
                        var arrayRelay;
                        // Has backup flag
                        var hasBackup = false;
                        //Array that receives the response of the filter
                        var filteredResults = [];
                        //Var that will hold offset value for queries
                        var offset = 0;
                        //If a city was selected we store it here
                        var saved_city;
                        //Filtered houses array
                        var totalFilteredResults = [];
                        //Triggers recenter on first load
                        var recenter = true;


                        //Creating map instance with GoogleMaps API
                        var map = new google.maps.Map(el[0], {
                            center: {
                                lat: 25.7616798,
                                lng: -80.1917902,
                            },
                            zoom: 10,
                            mapTypeId: google.maps.MapTypeId.HYBRID,
                            mapTypeControl: true,
                            mapTypeControlOptions: {
                                style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                                position: google.maps.ControlPosition.RIGHT_BOTTOM
                            }
                        });

                        //Creating OMS instance
                        var oms = new OverlappingMarkerSpiderfier(map, {
                            keepSpiderfied: true,

                        });

                        /**
                         * Main function of the directive
                         * will be looped over until
                         * maxResults is larger than the total length of totalResults
                         * or the amount of avResults (available results) is smaller than
                         * the maxResults expected
                         * 
                         * @param {Boolean} saved_city - If true, will call filteredChanged function in the controller
                         */

                        function loadMap(saved_city) {
                            if (firstLoad) {
                                showLoaders();
                            }
                            if (maxResults > totalResults.length) {
                                SimpleRETS.requestHandler($rootScope.requestObj).then(dataReceived, dataError);
                            } else {

                                //Removing duplicates
                                totalResults = totalResults.filter(function (value, index, array) {
                                    return array.indexOf(value) == index;
                                });

                                /**
                                 * Assigning results to global $rootScope
                                 * making it available for the whole application
                                 */

                                $rootScope.globalHousesData = totalResults;

                                /**
                                 * A new backup will be created when the
                                 * local filter event is triggered
                                 */

                                hasBackup = false;
                                scope.$broadcast('localFilter');

                                if (saved_city) {
                                    scope.$parent.$parent.layout.filterChanged();
                                }
                            }

                            function dataReceived(res) {
                                if (!res) {
                                    return false;
                                }

                                /**
                                 * Establishing the total amount of results
                                 * that SimplyRETS is capable of sending us
                                 */

                                scope.$broadcast('setTotalResults');
                                if (res.length > 0 && maxResults < avResults) {

                                    //Adding offset
                                    offset += res.length;

                                    //Filtering through the data
                                    filteredResults = res.filter(SafetyFilter.geoData);

                                    //Mergin arrays together
                                    totalResults = $.merge(totalResults, filteredResults);

                                    //Clearing arrays
                                    filteredResults = [];

                                    //Removing duplicates
                                    totalResults = totalResults.filter(function (value, index, array) {
                                        return array.indexOf(value) == index;
                                    });

                                    /**
                                     * Assigning results to global $rootScope
                                     * making it available for the whole application
                                     */

                                    $rootScope.globalHousesData = totalResults;

                                    /**
                                     * A new backup will be created when the
                                     * local filter event is triggered
                                     */

                                    hasBackup = false;
                                    scope.$broadcast('localFilter');


                                    //First load is finished
                                    firstLoad = false;

                                    //Fetching more results every 500 milliseconds
                                    $timeout(function () {
                                        //Adding one to the query offset in order to fetch more data
                                        $rootScope.requestObj.offset = offset;
                                        loadMap();
                                    }, 500);

                                } else {
                                    //If some results were already loaded
                                    if (res.length > 0) {
                                        //Mergin arrays together
                                        totalResults = $.merge(totalResults, res);
                                        //Filtering to avoid bad geoData
                                        totalResults = totalResults.filter(SafetyFilter.geoData);
                                        //Removing duplicates
                                        totalResults = totalResults.filter(function (value, index, array) {
                                            return array.indexOf(value) == index;
                                        });

                                        /**
                                         * Assigning results to global $rootScope
                                         * making it available for the whole application
                                         */

                                        $rootScope.globalHousesData = totalResults;

                                        /**
                                         * A new backup will be created when the
                                         * local filter event is triggered
                                         */

                                        hasBackup = false;
                                        scope.$broadcast('localFilter');

                                        //If the event was triggered by a saved_city, we activate filters
                                        if (saved_city) {
                                            scope.$parent.$parent.layout.filterChanged();
                                        }

                                    } else {

                                        if (totalResults) {
                                            //Filtering to avoid bad geoData
                                            totalResults = totalResults.filter(SafetyFilter.geoData);
                                            //Removing duplicates
                                            totalResults = totalResults.filter(function (value, index, array) {
                                                return array.indexOf(value) == index;
                                            });

                                            /**
                                             * Assigning results to global $rootScope
                                             * making it available for the whole application
                                             */

                                            $rootScope.globalHousesData = totalResults;

                                            /**
                                             * A new backup will be created when the
                                             * local filter event is triggered
                                             */

                                            hasBackup = false;
                                            scope.$broadcast('localFilter');


                                            //If the event was triggered by a saved_city, we activate filters
                                            if (saved_city) {
                                                scope.$parent.$parent.layout.filterChanged();
                                            }
                                        } else {
                                            //No results were presented
                                            Materialize.toast('Su busqueda no ha arrojado resultados', 4000);
                                            hideLoaders();
                                        }

                                    }
                                }
                            }

                            function dataError(error) {
                                Materialize.toast('Ha habido un error, intente nuevamente', 4000);
                                hideLoaders();
                            }
                        }

                        function loadMarkers(results) {
                            //If Clusters are present, we destroy them first
                            if (markerCluster) {
                                markerCluster.clearMarkers();
                                oms.clearMarkers();
                                markers = [];
                            }
                            // Fetching marker options from service
                            var options = McOptions.getOptions;
                            for (var i = 0; i < results.length; i++) {
                                var marker = _newGoogleMapsMarker({
                                    _map: map,
                                    _icon: 'assets/images/icon.png',
                                    _lat: results[i].geo.lat,
                                    _lng: results[i].geo.lng,
                                    _head: '|' + new google.maps.LatLng(results[i].geo.lat, results[i].geo.lng),
                                    _data: results[i]
                                });
                                //Pushing to markers array
                                markers.push(marker);
                                oms.addMarker(marker);
                            }
                            //Creating Cluster
                            markerCluster = new MarkerClusterer(map, markers, options);
                            //Hiding loaders
                            hideLoaders();
                            if (recenter) {
                                scope.$broadcast('recenter');
                                recenter = false;
                            }
                        }
                        //Recenters the map depending on the type of request
                        scope.$on('recenter', function (evt, args) {
                            if(args && args.home){
                                centerMap(map, 25.7616798, -80.1917902, 10);
                            }
                            if (markers && markers.length > 0)
                                centerMap(map, markers[0].position.lat(), markers[0].position.lng());
                            else
                                centerMap(map, 25.7616798, -80.1917902);
                        });


                        /**
                         * Map Events
                         * 
                         */

                        //Sets total results available in SimplyRETS
                        scope.$on('setTotalResults', function () {
                            avResults = $rootScope.totalCount;
                            if (avResults == 0) {
                                Materialize.toast('Su busqueda no ha arrojado resultados', 4000);
                            }

                        });

                        //Reloads map and resets variables.
                        //This event is triggered when activating a saved_search
                        scope.$on('reloadMap', function () {
                            console.log('reloading map');
                            showLoaders();
                            totalResults = [];
                            offset = 0;
                            $rootScope.requestObj.offset = offset;
                            maxResults = REQUEST_LIMIT.simplyRETS;
                            recenter = true;
                            //Passing a boolean to let the function this is being triggered by a saved_city
                            loadMap(true);
                        });
                        //Handles local filters and creates backup
                        scope.$on('localFilter', function () {
                            //If no backup yet we create one
                            if (!hasBackup) {
                                arrayRelay = totalResults
                                hasBackup = true;
                            }
                            //If there's backup we filter over that backup'
                            if (arrayRelay) {

                                console.log('beforeFilter = ', arrayRelay.length);
                                totalFilteredResults = arrayRelay.filter(SafetyFilter.filterData);
                                console.log('After filter = ', totalFilteredResults.length);

                                //Loading new filtered markers
                                loadMarkers(totalFilteredResults);

                            }
                        });
                        //Closes infowindow when clickin on the map (best for mobile)
                        google.maps.event.addListener(map, "click", function (event) {
                            for (var i = 0; i < ibArray.length; i++) {
                                ibArray[i].close();
                            }
                        });
                        //Initializes event to load map
                        loadMap();
                    }
                }
            }
        ]);

})();