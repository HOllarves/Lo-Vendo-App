;
(function () {
    "use strict";

    angular.module('LoVendoApp.services')
        .service('InfoWindowService', [InfoWindowService]);

    /**
     * Constructs Info Window in DOM
     *
     */

    function InfoWindowService() {
        return {
            getContent: function (data) {
                return '<div id="iw_container">' +
                    '<div class="hidden-xs col-sm-5 col-md-5 col-lg-5">' +
                    '<img align="center" class="img-responsive text-center" src=' + data.photos[0] + '>' +
                    '</div>' +
                    '<div class="col-xs-6 col-sm-4 col-md-4 col-lg-4">' +
                    '<div class="iw_title">' + data.address.full + '</div>' +
                    '<div class="iw_title sub">' + data.address.city + '</div>' +
                    '<div class="iw_price"> $' + data.listPrice + '</div>' +
                    '</div>' +
                    '<div class="col-xs-6 col-sm-3 col-md-3 col-lg-3 pd10">' +
                    '<ul class="descriptionSmall">' +
                    '<li>' + data.property.bathsFull + '<span> Baths </span> </li>' +
                    '<li>' + data.property.bedrooms + '<span> Bedrooms </span> </li>' +
                    '<li>' + data.property.area + '<span> Sqft </span> </li>' +
                    '</ul>' +
                    '</div>' +
                    '</div>';
            }
        }
    }
})();