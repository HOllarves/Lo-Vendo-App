(function(){
angular.module('LoVendoApp.directives')
    .directive('modal', [function(){
        return {
            restrict:'AE',
            templateUrl:'./modules/layout/modal.html',
            link: function(scope, el, attrs){
                scope.dismiss = function(){
                    el.modal('hide');
                }
            },
            controller: function(){}
        }
    }])

})();