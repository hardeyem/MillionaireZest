/**
 * Created by Adekunle Adeyemi on 05/03/2016.
 */
(function (window, angular) {
    'use strict';

    angular
        .module('HostModule.game')

        .config(['$stateProvider', '$urlRouterProvider',
            function($stateProvider, $urlRouterProvider) {
                $urlRouterProvider.otherwise('/');

                $stateProvider
                    .state('game', {
                        url : '/game',
                        templateUrl : 'host_app/game/game.html',
                        controller : 'GameCtrl as game'
                    })
                    /*.state('host.addhost', {
                        url : '/addhost',
                        templateUrl : 'admin_app/partials/add_host.html',
                        controller : 'AdminHostCtrl as adminHost'
                    })
                    .state('host.assignHost', {
                        url : '/assignHost',
                        templateUrl : 'admin_app/partials/assign_host.html',
                        controller : 'AdminHostCtrl as adminHost'
                    })*/;
            }
        ]);
})(window, window.angular);