;
(function () {
    "use strict";

    angular.module('LoVendoApp.routes')
        .config(function ($stateProvider, $urlRouterProvider) {
            $stateProvider
                .state('coverPage', {
                    url: '/',
                    views: {
                        'coverPage': {
                            templateUrl: 'modules/cover_page/cover-page.html',
                            controller: 'CoverPageCtrl',
                            controllerAs: 'cover'
                        }
                    }
                })
                .state('main', {
                    url: '',
                    abstract: true,
                    views: {
                        'main-view': {
                            templateUrl: 'modules/layout/layout.html',
                            controller: 'LayoutCtrl',
                            controllerAs: 'layout'
                        }
                    }
                })
                .state('main.home', {
                    url: '/home/:city',
                    abstract: false,
                    views: {
                        'content': {
                            templateUrl: 'modules/home/home.html',
                            controller: 'HomeCtrl',
                            controllerAs: 'home'
                        }
                    }
                });
            $urlRouterProvider.otherwise('/');
        })
        .run(function ($rootScope) {
            $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
                if (toState.title) {
                    $rootScope.title = toState.title;
                }
            });
        });
})();
