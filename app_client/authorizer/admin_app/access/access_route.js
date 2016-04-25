/**
 * Created by Adekunle Adeyemi on 02/03/2016.
 */
(function (window, angular) {
    'use strict';

    angular
        .module('AdminModule.access')
        .config([ '$stateProvider',

            function ($stateProvider) {

                $stateProvider
                    .state('access', {
                        url: '/access',
                        //abstract: false,
                        template: '<div ui-view> ho are we doing</div>'
                    })
                    .state('access.auth', {
                        url: '/auth',
                        templateUrl: 'admin_app/access/auth/login.html',
                        controller: 'AdminAuthCtrl as adminAuth'
                    })
                    .state('access.register', {
                        url: '/register',
                        templateUrl: 'admin_app/access/register/register.html',
                        controller: 'AdminRegisterCtrl as adminRegister'
                    });
            }]);

})(window, window.angular);
