/**
 * Created by TK on 13/02/2016.
 */

(function (window, angular) {
    'use strict';
    //var jq = $.noConflict();

    angular
        .module('MZApp')
        .controller('DashCtrl', ['$state', '$rootScope', '$location', 'Authentication',
            function ($state, $rootScope, $location, Authentication) {
                var vm  = this;
                //window.alert('welcome dash');
                $rootScope.user = "Adeyemi";
                //$rootScope.token = Authentication.getToken();

            }
        ]);
})(window, window.angular);