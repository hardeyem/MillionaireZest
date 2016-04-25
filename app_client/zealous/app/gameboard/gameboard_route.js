/**
 * Created by TK on 13/02/2016.
 */
(function (window, angular) {
    'use strict';

    angular
        .module('GameBoardModule')

        .config(['$stateProvider', '$urlRouterProvider',
            function($stateProvider, $urlRouterProvider) {
                $urlRouterProvider.otherwise('/');

                $stateProvider
                    .state('gameboard', {
                        url : '/',
                        templateUrl : 'gameboard.html',
                        controller : 'GameBoardCtrl as gameBoard'

                    });
            }
        ]);
})(window, window.angular);