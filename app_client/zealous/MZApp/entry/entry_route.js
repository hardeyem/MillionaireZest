/**
 * Created by TK on 13/02/2016.
 */
(function (window, angular) {
    'use strict';

    angular
        .module('MZApp.entry')

        .config(['$stateProvider', '$urlRouterProvider',
            function($stateProvider, $urlRouterProvider) {
                //$urlRouterProvider.otherwise('/');

                $stateProvider
                    .state('entry', {
                        url : '/entry',
                        templateUrl : 'MZApp/entry/entry.html',
                        controller : 'EntryCtrl as entry'

                    });
            }
        ]);
})(window, window.angular);