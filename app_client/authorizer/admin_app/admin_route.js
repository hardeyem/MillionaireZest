/**
 * Created by Adekunle Adeyemi on 02/03/2016.
 */
(function (window, angular) {
    'use strict';

    angular
        .module('AdminModule')

        .config(['$stateProvider', '$urlRouterProvider',
            function($stateProvider, $urlRouterProvider) {
                $urlRouterProvider.otherwise('/');

                $stateProvider
                    .state('dash', {
                        url : '/',
                        templateUrl : 'admin_app/dash/dash.html',
                        controller : 'AdminDashCtrl'

                    });
            }
        ]);
})(window, window.angular);