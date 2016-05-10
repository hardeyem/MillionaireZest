/**
 * Created by TK on 03/03/2016.
 */

(function(window, angular) {
    'use strict';

    //var jQuery = $.noConflict();
    var jq$ = jQuery;
    angular
        .module('AdminMainDirective')
        .controller('AdminMenuCtrl', ['$rootScope', '$scope', '$compile', 'AdminAuth', '$element',
            function ($rootScope, $scope, $compile, AdminAuth, $element) {
            $scope.item = "nav bar item";
            var vm = this;
        }]);
})(window, window.angular);