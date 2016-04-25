/**
 * Created by Adekunle Adeyemi on 02/03/2016.
 */
(function (window, angular) { 'use strict';

    angular.module('AdminModule', [
        'ngRoute',
        'ngMessages',

        'ui.router',

        // App Component Modules
        'AdminMainServices',
        'AdminMainDirective',
        'HostMainServices',
        'AdminModule.access',
        'AdminModule.host'

    ]);
    angular.module('AdminMainServices', ['ngResource']);
    angular.module('HostMainServices', ['ngResource']);
    angular.module('AdminMainDirective', []);

})(window, window.angular);
