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
                templateUrl: 'partials/message.html'
                //controller : 'MessageCtrl'

            };
        }]);
})(window, window.angular);

