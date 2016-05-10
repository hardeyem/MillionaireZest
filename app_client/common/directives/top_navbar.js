/**
 * Created by TK on 13/02/2016.
 */

(function(window, angular, undefined) {
    'use strict';

    angular
        .module('MainDirective')
        .directive('qpTopNavbar', ['$compile', function ($compile) {
            return {
                scope : {},
                restrict: 'AE',
                templateUrl: 'partials/top_navbar.html',
                controller : 'NavbarCtrl as navbar'
            };
        }]);
})(window, window.angular);
