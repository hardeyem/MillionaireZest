(function (window, angular) { 'use strict';

  angular.module('AccessModule', [
    'ngRoute',
    'ngMessages',

    'ui.router',

    // App Component Modules
    'MainServices'

  ]);
  angular.module('MainServices', ['ngResource']);

})(window, window.angular);
