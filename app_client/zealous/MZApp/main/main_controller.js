/**
 * Created by TK on 28/04/2016.
 */

(function (window, angular) {
    'use strict';
    //var jq = $.noConflict();

    angular
        .module('ZealousModule')
        .controller('DashCtrl', ['$state', '$rootScope', '$location',// 'Authentication',
            function ($state, $rootScope, $location) {
                var vm  = this;
                //window.alert('welcome dash');
                $rootScope.user = "Adeyemi";
                //$rootScope.token = Authentication.getToken();

            }
        ]);
})(window, window.angular);