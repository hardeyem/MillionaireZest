/**
 * Created by TK on 13/02/2016.
 */

(function (window, angular) { 'use strict';

    angular.module('HistoryModule', [
        'ngRoute',
        'ngMessages',

        'ui.router',

        // App Component Modules
        'MainServices',
        'MainDirective'

    ]);
    angular.module('MainServices', ['ngResource']);
    angular.module('MainDirective', []);

})(window, window.angular);
