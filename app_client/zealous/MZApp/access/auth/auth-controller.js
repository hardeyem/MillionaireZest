/**
 * Created by TK on 22/01/2016.
 */

(function (window, angular) {
    'use strict';
    var jq = $.noConflict();

    angular
        .module('MZApp.access')
        .controller('AuthCtrl', ['$state','$rootScope','$location', 'Authentication',
            function($state, $rootScope, $location, Authentication){
            $rootScope.testName = "Sign Up";
                $rootScope.toastMsg = "welcome";
                var vm = this;
                loginHandler(vm, Authentication,$location, $state);
           /* $rootScope.loginView = function(){
                console.log("login clicked");
                window.alert('login clicked');
                //showAuth();
                $state.go('access.login');

            };
            $rootScope.registerView = function(){
                console.log('showing register view');
                window.alert('register clicked');
                //showAuth();
                $state.go('access.register');
            }*/
        }]);

    function showAuth(){
        var accessAuthView = jq('.access-auth');
        if(!accessAuthView.is(":visible")){
            jq('.access-auth').css({'display':'block'});
        }
    }

    function loginHandler(vm, Authentication, $location, $state){

        vm.pageHeader = {
            title: 'Sign in to Loc8r'
        };
        vm.credentials = {
            email : "",
            password : ""
        };
        //used for returning user to the page he was
        vm.returnPage = $location.search().page || '/dash';
        vm.onSubmit = function () {
            vm.formError = "";
            if (!vm.credentials.email || !vm.credentials.password) {
                vm.formError = "All fields required, please try again";
                return false;
            } else {
                vm.doLogin();
            }
        };
        vm.doLogin = function() {
            vm.formError = "";
            Authentication
                .login(vm.credentials)
                .error(function(err){
                    vm.formError = err;
                })
                .then(function(){

                    //confirm that the user has logged in completely
                    if(Authentication.isLoggedIn){
                        $state.go('dashboard');
                    }else{
                        window.alert('you have not logged in');
                    }
                    //$state.go('/dashboard');
                    //window.alert('login successful');

                    /*$location.search('dash', null);
                     $location.path(vm.returnPage);*/
                });
        };
    }
})(window, window.angular);
