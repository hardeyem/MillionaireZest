/**
 * Created by TK on 13/02/2016.
 */

(function(window, angular, undefined) {
    'use strict';

    angular
        .module('MainDirective')
        .directive('qpLiveShow', [function () {
            return {
                restrict: 'E',
                templateUrl: '../partials/live_show.html',
                controller : 'LiveCtrl'

            };
        }]);
})(window, window.angular);

