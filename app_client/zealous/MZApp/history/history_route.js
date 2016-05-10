/**
 * Created by Adekunle Adeyemi on 29/02/2016.
 */
(function (window, angular) {
    'use strict';

    angular
        .module('MZApp.history')

        .config(['$stateProvider', '$urlRouterProvider',
            function($stateProvider, $urlRouterProvider) {
                //$urlRouterProvider.otherwise('/');

                $stateProvider
                    .state('history', {
                        url : '/history',
                        templateUrl : 'MZApp/history/history_index.html'
                        //controller : 'ProfileCtrl as profile'

                    });
            }
        ]);
})(window, window.angular);