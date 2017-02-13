;
(function () {
    "use strict";

    angular.module('LoVendoApp.directives')
        .directive('GoogleAdsense', function () {
            return {
                restrict: 'A',
                replace: true,
                template: `<ins class=”adsbygoogle”
                style = ”display: block;”
                data - ad - client = ”ca - pub - 9691079903692025
                data - ad - slot = ”xxxxxxxx″
                data - ad - format = "auto" > < /ins>'`,
                controller: function () {
                    (adsbygoogle = window.adsbygoogle || []).push({});
                }
            };
        });

})();