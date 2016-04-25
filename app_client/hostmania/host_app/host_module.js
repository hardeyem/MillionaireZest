/**
 * Created by Adekunle Adeyemi on 02/03/2016.
 */
(function (window, angular) { 'use strict';

    angular.module('HostModule', [
        'ngRoute',
        'ngMessages',

        'ui.router',

        // App Component Modules
        'HostMainServices',
        'HostMainDirective',
        'HostModule.access',
        'HostModule.game'

    ]);
    angular.module('HostMainServices', ['ngResource']);
    angular.module('HostMainDirective', []);

})(window, window.angular);
