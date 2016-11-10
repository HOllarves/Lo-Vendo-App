(function(){

angular.module('LoVendoApp.services')
    .factory('ObjectSerializer', [ObjectSerializer]);

    /**
    * Object Serializer
    * 
    */

    function ObjectSerializer() {
        return {
            /**
            * It serializes request object
            *
            * @param {Object} obj
            * 
            */
            serialize: function(obj){
                var pairs = [];
                for (var prop in obj) {
                    if (!obj.hasOwnProperty(prop)) {
                        continue;
                    }
                    if (Object.prototype.toString.call(obj[prop]) == '[object Object]') {
                        pairs.push(ObjectSerializer(obj[prop]));
                        continue;
                    }
                    pairs.push(prop + '=' + obj[prop]);
                }
                return pairs.join('&');
            },
            /**
            * Removes undefined or empty elements
            * from request object
            *
            * @param {Object} obj
            * 
            */
            cleaner: function(obj){
                for (var property in obj){
                    if(!property || typeof property == "undefined"){
                        delete obj.property;
                    }
                }
                return obj;
            }
        }
    }
})();