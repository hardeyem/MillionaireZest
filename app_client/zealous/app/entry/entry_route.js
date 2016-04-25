/**
 * Created by TK on 13/02/2016.
 */
(function (window, angular) {
    'use strict';

    angular
        .module('EntryModule')

        .config(['$stateProvider', '$urlRouterProvider',
            function($stateProvider, $urlRouterProvider) {
                $urlRouterProvider.otherwise('/');

                $stateProvider
                    .state('entry', {
                        url : '/',
                        templateUrl : 'entry.html',
                        controller : 'EntryCtrl as entry'

                    });
            }
        ]);
})(window, window.angular);