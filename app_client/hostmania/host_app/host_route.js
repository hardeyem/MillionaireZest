/**
 * Created by Adekunle Adeyemi on 02/03/2016.
 */
(function (window, angular) {
    'use strict';

    angular
        .module('HostModule')

        .config(['$stateProvider', '$urlRouterProvider',
            function($stateProvider, $urlRouterProvider) {
                $urlRouterProvider.otherwise('/');

                $stateProvider
                    .state('/dash', {
                        url : '/',
                        templateUrl : 'host_app/dash/dash.html',
                        controller : 'HostDashCtrl'

                    });
            }
        ]);
})(window, window.angular);