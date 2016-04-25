/**
 * Created by TK on 02/03/2016.
 */

(function (window, angular) {
    'use strict';

    angular
        .module('FQuestModule')

        .config(['$stateProvider', '$urlRouterProvider',
            function($stateProvider, $urlRouterProvider) {
                $urlRouterProvider.otherwise('/');

                $stateProvider
                    .state('fquest', {
                        url : '/',
                        templateUrl : 'fquest.html',
                        controller : 'FQuestCtrl as fq'

                    });
            }
        ]);
})(window, window.angular);