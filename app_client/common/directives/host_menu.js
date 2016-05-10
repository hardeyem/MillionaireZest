/**
 * Created by TK on 05/03/2016.
 */
(function(window, angular, undefined) {
    'use strict';

    angular
        .module('HostMainDirective')
        .directive('qpHostMenu', [function () {
            return {
                restrict: 'A',
                templateUrl: '../partials/host_menu.html',
                controller : 'HostMenuCtrl as hostMenu'
            };
        }]);
})(window, window.angular);