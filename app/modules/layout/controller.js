(function(){

angular.module('LoVendoApp.controllers')
    .controller('LayoutCtrl', ['$scope', '$rootScope', LayoutCtrl]);

    function LayoutCtrl($scope, $rootScope){
        var layout = this;
        console.log('LayoutCtrl');
        $scope.signUp = true;
        console.log('Layout rootScope', $rootScope);

        /**
        * Switch which form to show
        * depending on what the user
        * wants to do
        *
        * 
        */
        
        layout.switchSignIn = function(){
            $scope.signUp = !$scope.signUp;
        }
    }
})();
