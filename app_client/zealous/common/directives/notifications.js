/**
 * Created by TK on 13/02/2016.
 */

(function(window, angular, undefined) {
    'use strict';

    angular
        .module('MainDirective')
        .directive('qpNotifications', [function () {
            return {
                restrict: 'E',
                templateUrl: '../partials/notification.html',
                controller : 'NotificationCtrl'

            };
        }]);
})(window, window.angular);

