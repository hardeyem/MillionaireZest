/**
 * Created by TK on 13/02/2016.
 */

(function(window, angular, undefined) {
    'use strict';

    angular
        .module('MainDirective')
        .directive('qpLeftNavbar', [function () {
            return {
                restrict: 'A',
                templateUrl: '../partials/left_navbar.html',
                controller : 'NavbarCtrl as navbar'

            };
        }]);
})(window, window.angular);
