/**
 * Created by TK on 22/01/2016.
 */

(function (window, angular) {
    'use strict';

    angular
        .module('MainModule')
        .directive('accessDirective', [
            '$state',/*'loginSvc',*/
            function($state/*, loginSvc*/) {

                return {
                    restrict: 'A',
                    templateUrl: 'app/navbar/navbar-login-template.html',
                    controller: function($scope) {
                        $scope.accessLogin = function() {
                            /*loginSvc.logout();*/
                            $state.go('access.login');
                        };
                        $scope.accessRegister = function () {
                            $state.go('access.register');
                        };
                    }
                };
            }]);

})(window, window.angular);
