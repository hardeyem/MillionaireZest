/**
 * Created by TK on 04/03/2016.
 */
(function (window, angular) {
    'use strict';

    angular
        .module('HostModule')
        .controller('HostDashCtrl', [
            '$rootScope', '$location',
            function(     $rootScope,   $location ){
                var vm = this;

                /*reportSvc.counts().$promise.then(function(results) {
                 //vm.user = $rootScope
                 vm.leads = results.leads;
                 vm.reminders = results.reminders;
                 vm.tracking = results.tracking;
                 vm.username = $rootScope.user.username;
                 });*/

                //console.dir($rootScope);


            }]);

})(window, window.angular);