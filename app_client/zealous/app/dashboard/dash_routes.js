/**
 * Created by TK on 13/02/2016.
 */
(function (window, angular) {
    'use strict';

    angular
        .module('DashModule')

        .config(['$stateProvider', '$urlRouterProvider',
            function($stateProvider, $urlRouterProvider) {
                $urlRouterProvider.otherwise('/');

                $stateProvider
                    .state('dashboard', {
                        url : '/',
                        templateUrl : 'dash.html',
                        controller : 'DashCtrl'

                    });
            }
        ]);
})(window, window.angular);