/**
 * Created by Adekunle Adeyemi on 02/03/2016.
 */
(function(window , angular){
    'use strict';

    angular.module('HostModule')

        // optimize for production
        .config(['$compileProvider', function($compileProvider) {
            //turn off debug information in production - new in angular 1.3
            $compileProvider.debugInfoEnabled(false);
        }])
        /*.config(['$locationProvider', function($locationProvider){
         $locationProvider.html5Mode(true);
         }])*/
        .run(['$rootScope',  '$route',   '$location', '$state',   '$stateParams', 'HostAuth',
            function($rootScope, $route , $location, $state, $stateParams, HostAuth){
                $rootScope.user = { name: 'Fernando' };
                $rootScope.$on('$stateChangeStart', function (e, toState, toParams, fromState, fromParams) {
                    //e.preventDefault();
                    //window.alert('state change');
                    if(!HostAuth.isHostLoggedIn()){
                        /*e.preventDefault();
                         window.alert('you are not logged in');*/
                        //$state.go('/access');
                        window.location.hash = '/auth';
                        //$state.go('access.auth');
                        //window.location = '/authorizer/#/access/auth';
                    }else{
                        //window.alert("you are logged in");
                        console.log('you are welcome logged in user');
                        e.stopPropagation();
                    }
                });
            }
        ]);

})(window, window.angular);

