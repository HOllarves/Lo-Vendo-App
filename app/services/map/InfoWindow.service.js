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
                
                var img;
                var listPrice;
                var area;
                var title;

                /**
                 * Formats number with decimal
                 * instead of comma
                 * @param {String} num
                 * 
                 */

                if (data.listPrice)
                    listPrice = data.listPrice.toLocaleString().replace(/,/g, '.');
                else
                    listPrice = 'N/A';

                if (data.property.area)
                    area = data.property.area.toLocaleString().replace(/,/g, '.');
                else
                    area = 'N/A';

                if (data.address.full)
                    title = data.address.full;
                else
                    title = 'N/A'

                /**
                 * Truncates words to a certain limit
                 * @param {String} input
                 * @param {Integer} limit
                 * 
                 */

                var truncate = function (input, limit) {
                    if (limit > input.length) {
                        return input.slice(0, limit);
                    } else {
                        return input.slice(0, limit) + '...';
                    }
                }

                //If no image is presented, we add a default one.
                if (data.photos[0]) {
                    var img = data.photos[0];
                } else {
                    img = 'assets/images/default-house.jpg';
                }

                title = truncate(title, 20);

                return '<div id="iw_container">' +
                    '<div class="iw_image col-sm-6 col-md-6 col-lg-6">' +
                    '<img align="center" class=" text-center" src=' + img + '>' +
                    '</div>' +
                    '<div class="iw_information">' +
                    '<div class="iw_title">' + title + '</div>' +
                    '<div class="iw_title sub">' + data.address.city + '</div>' +
                    '<div class="iw_price"> $' + listPrice + '</div>' +
                    '<ul class="description-small">' +
                    '<li>' + data.property.bathsFull + '<span> BA | </span> </li>' +
                    '<li>' + data.property.bedrooms + '<span> BD | </span> </li>' +
                    '<li>' + area + '<span> ft² </span> </li>' +
                    '</ul>' +
                    '</div>' +
                    '</div>';
            }
        }
    }
})();