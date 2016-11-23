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
                                lat: 25.7742700,
                                lng: -80.1936600
                            },
                            zoom: 8
                        });

                        //Markers array
                        var markers = [];
                        var markers_relay = [];
                        console.log('on init = ', markers.length);

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
                                });
                            }
                            return r;
                        }
                        //Handling request with SimpleRETS service factory
                        scope.$on('loadMap', function () {
                            SimpleRETS.requestHandler(scope.requestObj).then(dataReceived, dataError);

                            function dataReceived(res) {
                                if (markers.length > 0) {
                                    for (var k = 0; k > markers.length; k++) {
                                        markers[k].setMap(null);
                                        console.log('removing! #', k);
                                    }
                                    markers = [];
                                    console.log('removed!');
                                }
                                var results = res.filter(SafetyFilter.filterData);
                                $rootScope.globalHousesData = results;
                                if (markers.length == 0)
                                    $timeout(loadMarkers(results), 1000);
                            }

                            function dataError(error) {
                                console.log('mapError', error);
                            }

                        });
                        //Randomizes position for matching coordinates
                        function randomPos() {
                            return Math.random() * (0.0001 - 0.00005) + 0.00005;
                        }

                        function loadMarkers(results) {
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
                                markers.push(marker);
                            }
                            var markerCluster = new MarkerClusterer(map, markers, options);
                        }
                        //Initializes event to load m
                        scope.$broadcast('loadMap');
                    }
                }
            }
        ]);

})();