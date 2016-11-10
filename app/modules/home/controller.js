(function(){

    angular.module('LoVendoApp.controllers')
        .controller('HomeCtrl', ['$scope', '$rootScope', 'SimpleRETS', 'Authentication', HomeCtrl]);

        function HomeCtrl($scope, $rootScope, SimpleRETS, Authentication) {

            var home = this;

            /**
             * 
             * Hard coded request Object
             * TEMPORARY
             * 
             */

            home.type = ["rental", "residential"];
            home.minprice = 15000;
            home.maxprice = 50000;
            home.status;
            home.limit = "10";
            
            $scope.requestObj = {
                "status": home.status,
                "type": home.type,
                "minprice": home.minprice,
                "maxprice": home.maxprice,
                "limit": home.limit
            };

            /**
            * Sign in function
            *
            * @param {Object} user
            * 
            */

            home.signIn = function(user) {
                console.log('home', user);
                Authentication.login(user).then(function(data){
                    console.log('data');
                    if(data.status == 200){
                        $scope.dismiss();            
                    }
                });
            }

            /**
            * Sign up function
            *
            * @param {Object} user
            * 
            */

            home.signUp = function(user) {
                if(user.password == user.confirm_password){
                    var auth_user = {
                        email: user.email,
                        password: user.password
                    } 
                    Authentication.signUp(auth_user).then(function(data){
                        console.log('data received!');
                        if(data.user && data.status == 201){
                            $scope.dismiss();            
                        }
                    });
                }
            }
        }
})();