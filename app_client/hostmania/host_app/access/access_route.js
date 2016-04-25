/**
 * Created by Adekunle Adeyemi on 02/03/2016.
 */
(function (window, angular) {
    'use strict';

    angular
        .module('HostModule.access')
        .config([ '$stateProvider',

            function ($stateProvider) {

                $stateProvider
                    .state('access', {
                        url: '/auth',
                        //abstract: false,
                        //template: '<div ui-view> ho are we doing</div>'
                        templateUrl: 'host_app/access/login.html',
                        controller: 'HostAuthCtrl as hostAuth'
                    })
                    /*.state('access.auth', {
                        url: '/auth',
                        templateUrl: 'host_app/access/login.html',
                        controller: 'HostAuthCtrl as hostAuth'
                    })*/;
            }]);

})(window, window.angular);
