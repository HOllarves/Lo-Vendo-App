$(document).ready(function () {
    if (!window.initializeAutoComplete) {
        window.initializeAutoComplete = function initializeAutoComplete() {
            var options = {
                types: ['(cities)'],
                componentRestrictions: {
                    country: "us"
                }
            };
            var input = document.getElementById('Search_Field');
            var autocomplete = new google.maps.places.Autocomplete(input, options);
        }
    }
});