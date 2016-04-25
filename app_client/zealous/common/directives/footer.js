/**
 * Created by TK on 13/02/2016.
 */

(function(window, angular, undefined) {
    'use strict';

    angular
        .module('MainDirective')
        .directive('qpFooter', [function () {
            return {
                restrict: 'E',
                templateUrl: '../partials/footer.html',
                controller : 'FooterCtrl'

            };
        }]);
})(window, window.angular);

