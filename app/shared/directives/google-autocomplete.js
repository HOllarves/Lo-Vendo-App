;
(function () {
    "use strict";

    angular.module('LoVendoApp.directives')
        .directive('googleAutocomplete', ['$state', function ($state) {
            return {
                restrict: 'A',
                link: function (scope, el, atts, ngModel) {
                    var Lng = -80.1917902;
                    var Lat = 25.7616798;
                    var bounds = new google.maps.Circle({
                        center: new google.maps.LatLng(Lat, Lng),
                        radius: 500
                    }).getBounds()

                    var options = {
                        types: ['(cities)'],
                        componentRestrictions: {
                            country: "us"
                        },
                        bounds: bounds
                    };

                    var autocomplete = new google.maps.places.Autocomplete(el[0], options);

                    //Creating event listener for google autocomplete
                    google.maps.event.addListener(autocomplete, 'place_changed', function () {
                        if ($state.current.name == "main.home") {
                            setTimeout(function () {
                                scope.layout.loadCity(el.val(), true);
                            }, 500);
                        }
                        if ($state.current.name == "coverPage") {
                            setTimeout(function () {
                                scope.cover.searchCity(el.val());
                            }, 500);
                        }
                    });
                }
            }
        }]);

})();