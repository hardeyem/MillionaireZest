/**
 * Created by Adekunle Adeyemi on 25/02/2016.
 */
(function (window, angular) {
    'use strict';

    angular
        .module('RegisterModule')
        .config(['$httpProvider', function($httpProvider) {
            if (!$httpProvider.defaults.headers.get) {
                $httpProvider.defaults.headers.get = {};
            }


            // force refresh for development
            $httpProvider.defaults.headers.get['If-Modified-Since'] = '0';

        }])

        .config(['$stateProvider', '$urlRouterProvider',
            function($stateProvider, $urlRouterProvider) {

                $urlRouterProvider.otherwise('/');

                $stateProvider
                    .state('register', {
                        url: '/',
                        templateUrl : 'register.html',
                        controller: 'RegisterCtrl as register'
                    })

            }
        ]);

})(window, window.angular);
