/**
 * Created by TK on 13/02/2016.
 */

(function(window , angular){
    'use strict';

    angular.module('ProfileModule')


        // optimize for production
        .config(['$compileProvider', function($compileProvider) {
            //turn off debug information in production - new in angular 1.3
            $compileProvider.debugInfoEnabled(false);
        }])
        .config(['$locationProvider', function($locationProvider){
            $locationProvider.html5Mode(true);
        }])
        .run(['$rootScope',  '$route',   '$location', '$state',   '$stateParams', 'Authentication',
            function($rootScope, $route , $location, $state, $stateParams, Authentication){
                //$rootScope.token = Authentication.getToken();

                //$rootScope.user = { name: 'Fernando' };
                $rootScope.$on('$stateChangeStart', function (e, toState, toParams, fromState, fromParams) {
                    //e.preventDefault();
                    //window.alert('state change');
                    if(!Authentication.isLoggedIn()){
                        //e.preventDefault();
                        //window.alert('you are not logged in');
                        //$state.go('/access');
                        window.location = '/access/auth';
                    }else{
                        //window.alert("you are logged in");
                        console.log('you are welcome logged in user');
                        //e.stopPropagation();
                    }
                });
            }
        ]);

})(window, window.angular);