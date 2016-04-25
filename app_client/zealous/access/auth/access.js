/**
 * Created by Adekunle Adeyemi on 12/02/2016.
 */

(function(window , angular){
    'use strict';

    angular.module('AccessModule')

        // optimize for production
        .config(['$compileProvider', function($compileProvider) {
            //turn off debug information in production - new in angular 1.3
            $compileProvider.debugInfoEnabled(false);
        }])
        /*.config(['$locationProvider', function($locationProvider){
            $locationProvider.html5Mode(true);
        }])*/
        .run(['$rootScope',  '$route',   '$location', '$state',   '$stateParams',
            function($rootScope, $route , $location, $state, $stateParams){
                $rootScope.user = { name: 'Fernando' };

            }
        ]);

})(window, window.angular);







