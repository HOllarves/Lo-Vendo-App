;
(function () {
    "use strict";
    $(document).ready(function () {
        $('html').on('keypress', function (e) {
            if (e.keyCode == 13) {
                return false;
            }
        });
    });
})();