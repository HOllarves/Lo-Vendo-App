(function(){

angular.module('LoVendoApp.directives')
    .directive('sideMenu', function(){
        return {
            restrict: 'E',
            templateUrl:'./modules/layout/side-menu.html',
            link: function(scope, el, attrs){},
            controller: function(){}
        }
    })

})();