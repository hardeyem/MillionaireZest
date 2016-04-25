/**
 * Created by TK on 02/03/2016.
 */
(function (window, angular) {
    'use strict';

    angular
        .module('HostModule.access')
        .controller('HostAuthCtrl', ['$state', 'HostAuth',

            function ($state, HostAuth) {

                var vm = this;
                vm.loginUser = {};

                vm.login = function(isValid) {
                    console.log(vm.hostUser);
                    if(isValid){
                        HostAuth.loginHost(vm.hostUser)
                            .then(function(user){
                                console.log(user);
                                if(!user){
                                    vm.failed();
                                } else if(user && HostAuth.isHostLoggedIn) {
                                    //notifySvc.success('You are now logged in.','Login');
                                    console.log('you have successfully logged in');
                                    //vm.closeLogin();
                                    window.location = '/hostmania';
                                }
                            }).catch(function() {
                            vm.failed();
                        });
                    }
                };
                vm.failed = function() {
                    //notifySvc.error('Sorry, those credentials did not match any user!','Login Failed');
                    console.log('sorry, invalid login details');
                };

            }
        ]);
})(window, window.angular);