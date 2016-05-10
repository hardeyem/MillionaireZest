/**
 * Created by Adekunle Adeyemi on 29/02/2016.
 */
(function (window, angular) {
    'use strict';

    angular
        .module('MZApp.profile')

        .config(['$stateProvider', '$urlRouterProvider',
            function($stateProvider, $urlRouterProvider) {
                //$urlRouterProvider.otherwise('/');

                $stateProvider
                    .state('profile', {
                        url : '/profile',
                        templateUrl : 'MZApp/profile/profile_index.html',
                        controller : 'ProfileCtrl as profile'

                    });
            }
        ]);
})(window, window.angular);