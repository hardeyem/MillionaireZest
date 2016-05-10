/**
 * Created by TK on 13/02/2016.
 */
(function (window, angular) {
    'use strict';

    angular
        .module('MZApp')

        .config(['$stateProvider', '$urlRouterProvider',
            function($stateProvider, $urlRouterProvider) {
                $urlRouterProvider.otherwise('/');

                $stateProvider
                    .state('home', {
                        url : '/',
                        redirectTo : {
                            state : 'dashboard'
                        }
                        //templateUrl : 'MZApp/dashboard/dash_index.html',
                        //controller : 'DashCtrl as dash'
                    })
                ;
            }
        ]);
})(window, window.angular);