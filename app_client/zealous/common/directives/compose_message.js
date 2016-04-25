/**
 * Created by TK on 13/02/2016.
 */

(function(window, angular, undefined) {
    'use strict';

    angular
        .module('MainDirective')
        .directive('qpMessages', [function () {
            return {
                restrict: 'E',
                templateUrl: '../partials/compose_message.html',
                controller : 'ComposeCtrl'

            };
        }]);
})(window, window.angular);

