;
(function () {
    "use strict";

    angular.module('LoVendoApp.directives')
        .directive('map', ['SimpleRETS', 'InfoWindowService', 'McOptions', 'ModalOptions', '$rootScope', '$parse', '$uibModal', '$timeout', 'SafetyFilter',
            function (SimpleRETS, InfoWindowService, McOptions, ModalOptions, $rootScope, $parse, $uibModal, $timeout, SafetyFilter) {
                return {
                    restrict: 'A',
                    scope: {
                        requestObj: '='
                    },
                    link: function (scope, el, attrs) {
                        //Creating map instance with GoogleMaps API
                        var map = new google.maps.Map(el[0], {
                            center: {
                                lat: 25.7616798,
                                lng: -80.1917902,
                            },
                            zoom: 10,
                            mapTypeId: google.maps.MapTypeId.HYBRID
                        });

                        //Markers array
                        var markers = [];
                        //MarkerClusterer Object
                        var markerCluster
                            //InfoWindow array
                        var ibArray = [];

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
                                        this.getMap()._infoWindow = new google.maps.InfoWindow();
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

                        scope.$on('loadMap', function () {
                            //Handling request with SimpleRETS service factory
                            SimpleRETS.requestHandler(scope.requestObj).then(dataReceived, dataError);

                            function dataReceived(res) {

                                //If a previous Cluster is present
                                if (markerCluster) {
                                    markerCluster.clearMarkers();
                                    markers = [];
                                }
                                //Filtering through the data
                                var results = res.filter(SafetyFilter.filterData);
                                //Assigning results to global $rootScope
                                $rootScope.globalHousesData = results;
                                //If markers are empty we load new ones
                                if (markers.length == 0)
                                    loadMarkers(results)
                            }

                            function dataError(error) {
                                console.error(error);
                            }


                        });
                        //Randomizes position for matching coordinates
                        function randomPos() {
                            return Math.random() * (0.0001 - 0.00005) + 0.00005;
                        }

                        function loadMarkers(results) {
                            // Fetching marker options from service
                            var options = McOptions.getOptions;
                            // Instantiating map boundaries
                            var bounds = new google.maps.LatLngBounds();
                            for (var i = 0; i < results.length; i++) {
                                var marker = _newGoogleMapsMarker({
                                    _map: map,
                                    _icon: 'assets/images/icon.png',
                                    _lat: results[i].geo.lat,
                                    _lng: results[i].geo.lng,
                                    _head: '|' + new google.maps.LatLng(results[i].geo.lat, results[i].geo.lng),
                                    _data: results[i]
                                });
                                //Extending bounds
                                bounds.extend(marker.getPosition());
                                //Pushing to markers array
                                markers.push(marker);
                            }
                            //Creating Cluster
                            markerCluster = new MarkerClusterer(map, markers, options);
                            //Hiding preloader when map is loaded
                            $timeout(function () {
                                $('.preloader-background')
                                    .delay(1000)
                                    .fadeOut('slow');
                                $('.preloader-wrapper')
                                    .delay(1000)
                                    .fadeOut();
                            }, 500);
                        }

                        scope.$on('recenter', function () {
                            map.setCenter(new google.maps.LatLng(25.7616798, -80.1917902));
                        });

                        google.maps.event.addListener(map, "click", function (event) {
                            for (var i = 0; i < ibArray.length; i++) {
                                ibArray[i].close();
                            }
                        });

                        //Initializes event to load map
                        scope.$broadcast('loadMap');
                    }
                }
            }
        ]);

})();