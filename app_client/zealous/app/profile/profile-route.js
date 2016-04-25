/**
 * Created by Adekunle Adeyemi on 29/02/2016.
 */
(function (window, angular) {
    'use strict';

    angular
        .module('ProfileModule')

        .config(['$stateProvider', '$urlRouterProvider',
            function($stateProvider, $urlRouterProvider) {
                $urlRouterProvider.otherwise('/');

                $stateProvider
                    .state('profile', {
                        url : '/',
                        templateUrl : 'profile.html',
                        controller : 'ProfileCtrl as profile'

                    });
            }
        ]);
})(window, window.angular);