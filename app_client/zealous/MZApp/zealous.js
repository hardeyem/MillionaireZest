/**
 * Created by TK on 13/02/2016.
 */

(function(window , angular){
    'use strict';

    angular.module('MZApp')


        // optimize for production
        .config(['$compileProvider', function($compileProvider) {
            //turn off debug information in production - new in angular 1.3
            $compileProvider.debugInfoEnabled(true);
        }])
        /*.config(['$locationProvider', function($locationProvider){
            $locationProvider.html5Mode(true);
        }])*/
        .run(['$rootScope',  '$route',   '$location', '$state',   '$stateParams', 'Authentication',
            function($rootScope, $route , $location, $state, $stateParams, Authentication){
                //$rootScope.token = Authentication.getToken();

                $rootScope.errors = $rootScope.errors || [];

                $rootScope.$state = $state;
                $rootScope.$stateParams = $stateParams;
                $rootScope.stateHistory = [];
                $rootScope.isLoggedIn = false;
                $rootScope.user = {
                    isLoggedIn: false,
                    name: '',
                    email: ''
                };
                //$rootScope.user = { name: 'Fernando' };
                $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                    //e.preventDefault();
                    //window.alert('state change');

                    if (toState.redirectTo) {
                        event.preventDefault();
                        $state.go(toState.redirectTo.state, toParams);
                    }

                    if(!Authentication.isLoggedIn()){
                        if( toState.name !== 'access.auth' && toState.name !== 'access.register' ) {
                            event.preventDefault();
                            /*$timeout(function(){

                            });*/
                            $state.go('access.auth', {notify :false});
                            //$state.go('access.auth');
                            //console.log('You are not logged in');
                        }
                     }else{
                        //window.alert("you are logged in");
                        console.log('you are welcome logged in user');
                        $rootScope.stateHistory.push(toState.name);
                     }
                });

                $rootScope.goBack = function () {
                    var prevState = $rootScope.stateHistory.length > 1 ? $rootScope.stateHistory.splice(-2)[0] : "/";
                    $state.go(prevState);
                };

                $rootScope.logOut = function(){
                    $state.go('access.auth', {notify : false});
                };

                $rootScope.goState = function(stateName){
                    $state.go(stateName, {notify : false});
                };
            }
        ]);

})(window, window.angular);