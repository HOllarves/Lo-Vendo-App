(function () {

    angular.module('LoVendoApp.controllers')
        .controller('LayoutCtrl', ['$scope', '$rootScope', 'Session', 'AUTH_EVENTS',
            'SimpleRETS', '$uibModal', 'ModalOptions', LayoutCtrl
        ]);

    function LayoutCtrl($scope, $rootScope, Session, AUTH_EVENTS, SimpleRETS, $uibModal, ModalOptions) {
        var layout = this;
        $scope.signUp = true;

        /**
         * Switch which form to show
         * depending on what the user
         * wants to do
         *
         * 
         */

        layout.switchSignIn = function () {
            $scope.signUp = !$scope.signUp;
        };

        /**
         * Logs out user.
         * 
         */

        layout.logout = function () {
            console.log('loggin out!');
            $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess)
        };

        /**
         * Refresh data with q param provided by
         * the search input in the layout
         * 
         */

        layout.search = function () {
            $rootScope.$broadcast('refreshMap');
            $rootScope.$broadcast('refreshSideMenu');
        };

        /**
         * Loads the Side Menu with data
         * on page load
         * 
         */

        $scope.$on('$viewContentLoaded', function () {
            $rootScope.$broadcast('refreshSideMenu');
        });

        /**
         * Event that loads the Side Menu with data
         * provided by the SimpleRETS service
         * 
         */

        $scope.$on('refreshSideMenu', function () {
            SimpleRETS.requestHandler($rootScope.requestObj).then(dataReceived, dataError);

            function dataReceived(data) {
                layout.homes = data;
            }

            function dataError(err) {
                console.log(err);
            }
        });

        /**
         *
         * House Detail Modal Instance
         *
         */

        layout.openComponentModal = function (home) {
            var modalOptions = ModalOptions.getOptions(home);
            var modalInstance = $uibModal.open(modalOptions);
        };

    }
})();
