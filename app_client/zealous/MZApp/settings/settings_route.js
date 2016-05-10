/**
 * Created by Adekunle Adeyemi on 29/02/2016.
 */
(function (window, angular) {
    'use strict';

    angular
        .module('MZApp.settings')

        .config(['$stateProvider', '$urlRouterProvider',
            function($stateProvider, $urlRouterProvider) {
                //$urlRouterProvider.otherwise('/');

                $stateProvider
                    .state('settings', {
                        url : '/settings',
                        templateUrl : 'MZApp/settings/setting_index.html'
                        //controller : 'ProfileCtrl as profile'

                    });
            }
        ]);
})(window, window.angular);