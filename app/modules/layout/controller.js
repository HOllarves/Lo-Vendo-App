(function(){

angular.module('LoVendoApp.controllers')
    .controller('LayoutCtrl', ['$scope', LayoutCtrl]);

    function LayoutCtrl($scope){
        var layout = this;
        console.log('LayoutCtrl');
        $scope.signUp = true;

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
