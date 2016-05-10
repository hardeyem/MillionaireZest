/**
 * Created by TK on 13/02/2016.
 */
(function (window, angular) {
    'use strict';

    angular
        .module('MZApp.ggame')

        .config(['$stateProvider', '$urlRouterProvider',
            function($stateProvider, $urlRouterProvider) {
                $urlRouterProvider.otherwise('/');

                $stateProvider
                    .state('gameboard', {
                        url : '/gameboard',
                        templateUrl : 'MZApp/gameboard/gameboard.html',
                        controller : 'GameBoardCtrl as gameBoard'

                    });
            }
        ]);
})(window, window.angular);