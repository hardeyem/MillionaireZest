/**
 * Created by TK on 02/03/2016.
 */

(function (window, angular) {
    'use strict';

    angular
        .module('MZApp.fq')

        .config(['$stateProvider', '$urlRouterProvider',
            function($stateProvider, $urlRouterProvider) {
                $urlRouterProvider.otherwise('/');

                $stateProvider
                    .state('finalquest', {
                        url : '/fianlquest',
                        templateUrl : 'MZApp/finalquest/fquest.html',
                        controller : 'FQuestCtrl as fq'

                    });
            }
        ]);
})(window, window.angular);