/**
 * Created by TK on 13/02/2016.
 */

(function(window , angular){
    'use strict';

    angular.module('GameBoardModule')


        // optimize for production
        .config(['$compileProvider', function($compileProvider) {
            //turn off debug information in production - new in angular 1.3
            $compileProvider.debugInfoEnabled(false);
        }])
        /*.config(['$httpProvider', function($httpProvider){
            $httpProvider.interceptors.push(['$q','$location', 'Authentication',
                function($q, $location, Authentication){
                    return {
                        'request' : function(config){
                            config.headers = config.headers || {};
                            if(Authentication.isLoggedIn()){
                                config.headers.Authorization = 'Bearer ' + Authentication.getToken();
                            }

                            return config;
                        }, 'responseError' : function(response){
                            if(response.status === 401 || response.status == 400){
                                console.log('server response error');
                            }

                            return $q.reject(response);
                        }
                    }
                }
            ]);
        }])*/
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