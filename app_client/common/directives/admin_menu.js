/**
 * Created by TK on 03/03/2016.
 */
(function(window, angular, undefined) {
    'use strict';

    angular
        .module('AdminMainDirective')
        .directive('qpAdminMenu', [function () {
            return {
                restrict: 'A',
                templateUrl: '../partials/admin_menu.html',
                controller : 'AdminMenuCtrl as menuCtrl'
            };
        }]);
})(window, window.angular);
