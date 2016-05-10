/**
 * Created by Adekunle adeyemi on 13/02/2016.
 */
(function (window, angular) {
    'use strict';

    angular
        .module('MZApp')

        .config(['$stateProvider', '$urlRouterProvider',
            function($stateProvider, $urlRouterProvider) {
                //$urlRouterProvider.otherwise('/');

                $stateProvider
                    .state('dashboard', {
                        url : '/dashboard',
                        templateUrl : 'MZApp/dashboard/dash_index.html',
                        controller : 'DashCtrl as dash'
                    })
                    /*.state('dashboard.dash', {
                        url : '/dash',
                        templateUrl : 'MZApp/dashboard/dash.html',
                        controller : 'DashCtrl as dash'
                    })*/
                ;
            }
        ]);
})(window, window.angular);