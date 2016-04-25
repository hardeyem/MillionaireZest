/**
 * Created by TK on 02/03/2016.
 */
(function (window, angular) {
    'use strict';

    angular
        .module('AdminModule.access')
        .controller('AdminAuthCtrl', ['$state', 'AdminAuth',

            function ($state, AdminAuth) {

                var vm = this;
                vm.loginUser = {};

                vm.login = function(isValid) {
                    console.log(vm.adminUser);
                    if(isValid){
                        AdminAuth.loginAdmin(vm.adminUser)
                            .then(function(user){
                                console.log(user);
                                if(!user){
                                    vm.failed();
                                } else if(user && AdminAuth.isAdminLoggedIn) {
                                    //notifySvc.success('You are now logged in.','Login');
                                    console.log('you have successfully logged in');
                                    //vm.closeLogin();
                                    window.location = '/authorizer';
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