/**
 * Created by TK on 13/02/2016.
 */

(function(window, angular, undefined) {
    'use strict';

    angular
        .module('MainDirective')
        .directive('qpNavbar', [function () {
            return {
                restrict: 'A',
                templateUrl: 'partials/app_nav.html'
            };
        }]);
})(window, window.angular);
