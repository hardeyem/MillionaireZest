/**
 * Created by TK on 13/02/2016.
 */

(function (window, angular) { 'use strict';

    angular.module('MZApp', [
        'ngRoute',
        'ngMessages',

        'ui.router',

        // App Component Modules
        'MZApp.access',
        'MZApp.account',
        'MZApp.entry',
        'MZApp.fq',
        'MZApp.ggame',
        'MZApp.profile',
        'MZApp.settings',
        'MZApp.history',


        'MainServices',
        'MainDirective'

    ]);
    angular.module('MainServices', ['ngResource']);
    angular.module('MainDirective', []);

})(window, window.angular);
