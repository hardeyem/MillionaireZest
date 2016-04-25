/**
 * Created by Adekunle Adyemi on 25/02/2016.
 */
(function (window, angular) { 'use strict';

    angular.module('RegisterModule', [
        'ngRoute',
        'ngMessages',

        'ui.router',

        // App Component Modules
        'MainServices'

    ]);
    angular.module('MainServices', ['ngResource']);

})(window, window.angular);

