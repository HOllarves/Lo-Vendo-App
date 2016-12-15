$(document).ready(function () {

    if (!window.initializeAutoComplete) {
        window.initializeAutoComplete = function initializeAutoComplete() {
            var Lng = -80.1917902;
            var Lat = 25.7616798;
            var bounds = new google.maps.Circle({
                center: new google.maps.LatLng(Lat, Lng),
                radius: 5000
            }).getBounds()

            var options = {
                types: ['(cities)'],
                componentRestrictions: {
                    country: "us"
                },
                bounds: bounds
            };

            var input = document.getElementById('Search_Field');
            var autocomplete = new google.maps.places.Autocomplete(input, options);
        }
    }
});