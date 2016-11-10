(function(){

angular.module('LoVendoApp.services')
    .factory('McOptions', [McOptions]);

    /**
    * Returns marker options associated
    * with the map
    *
    * 
    */

    function McOptions(){
        return {
            getOptions: {
                styles: [{
                    textColor: 'white',
                    height: 53,
                    url: "assets/images/m1.png",
                    width: 53
                },
                {
                    textColor: 'white',
                    height: 56,
                    url: "assets/images/m2.png",
                    width: 56
                },
                {
                    textColor: 'white',
                    height: 66,
                    url: "assets/images/m3.png",
                    width: 66
                },
                {
                    textColor: 'white',
                    height: 78,
                    url: "assets/images/m4.png",
                    width: 78
                },
                {
                    textColor: 'white',
                    height: 90,
                    url: "assets/images/m5.png",
                    width: 90
                }],
                maxZoom: 17
            }
        }
    }
})();