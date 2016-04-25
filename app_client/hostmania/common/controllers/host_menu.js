/**
 * Created by TK on 05/03/2016.
 */
(function(window, angular) {
    'use strict';

    //var jQuery = $.noConflict();
    var jq$ = jQuery;
    angular
        .module('HostMainDirective')
        .controller('HostMenuCtrl', ['$rootScope', '$scope', '$compile', 'HostAuth','$state',
            function ($rootScope, $scope, $compile, HostAuth, $state) {
                $scope.item = "nav bar item";
                var vm = this;

                vm.logout = function(){
                    console.log('logging out.......');
                    HostAuth.logoutHost().then(function(){
                        //$state.go('access');
                        console.log('logged out');
                    })
                }
            }]);
})(window, window.angular);