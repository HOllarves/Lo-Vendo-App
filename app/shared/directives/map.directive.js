(function () {

    angular.module('LoVendoApp.directives')
        .directive('map', ['SimpleRETS', 'InfoWindowService', 'McOptions', 'ModalOptions', '$rootScope', '$parse', '$uibModal',
            function (SimpleRETS, InfoWindowService, McOptions, ModalOptions, $rootScope, $parse, $uibModal) {
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
                                            var modalOptions = ModalOptions.getOptions(param._data);
                                            var modalInstance = $uibModal.open(modalOptions);
                                        }
                                    });
                                    this.getMap()._infoWindow.open(this.getMap(), this);
                                });
                            }
                            return r;
                        }
                        //Handling request with SimpleRETS service factory
                        scope.$on('refreshMap', function () {
                            SimpleRETS.requestHandler(scope.requestObj).then(dataReceived, dataError);
                            var options = McOptions.getOptions;

                            function dataReceived(res) {
                                var markers = [];
                                for (var i = 0; i < res.length; i++) {
                                    var marker = _newGoogleMapsMarker({
                                        _map: map,
                                        _icon: 'assets/images/icon.png',
                                        _lat: res[i].geo.lat,
                                        _lng: res[i].geo.lng,
                                        _head: '|' + new google.maps.LatLng(res[i].geo.lat, res[i].geo.lng),
                                        _data: res[i]
                                    });
                                    markers.push(marker);
                                }
                                markerCluster = new MarkerClusterer(map, markers, options);
                            }

                            function dataError(error) {
                                console.log('mapError', error);
                            }

                        });
                        //Randomizes position for matching coordinates
                        function randomPos() {
                            return Math.random() * (0.0001 - 0.00005) + 0.00005;
                        }
                        scope.$broadcast('refreshMap');
                    }
                }
            }
        ]);

})();