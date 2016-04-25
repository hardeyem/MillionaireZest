/**
 * Created by Adekunle Adeyemi on 03/03/2016.
 */
(function (window, angular) {
    'use strict';

    angular
        .module('AdminModule.host')

        .config(['$stateProvider', '$urlRouterProvider',
            function($stateProvider, $urlRouterProvider) {
                $urlRouterProvider.otherwise('/');

                $stateProvider
                    .state('host', {
                        url : '/host',
                        templateUrl : 'admin_app/host/host.html',
                        controller : 'AdminHostCtrl as adminHost'
                    })
                    .state('host.addhost', {
                        url : '/addhost',
                        templateUrl : 'admin_app/partials/add_host.html',
                        controller : 'AdminHostCtrl as adminHost'
                    })
                    .state('host.assignHost', {
                        url : '/assignHost',
                        templateUrl : 'admin_app/partials/assign_host.html',
                        controller : 'AdminHostCtrl as adminHost'
                    });
            }
        ]);
})(window, window.angular);
