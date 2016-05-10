/**
 * Created by Adekunle Adeyemi on 30/04/2016.
 */
(function (window, angular) {
    'use strict';

    angular
        .module('MZApp.account')

        .config(['$stateProvider', '$urlRouterProvider',
            function($stateProvider, $urlRouterProvider) {
                //$urlRouterProvider.otherwise('/');

                $stateProvider
                    .state('account', {
                        url : '/account',
                        templateUrl : 'MZApp/account/account_index.html'
                        //controller : 'DashCtrl as dash'
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