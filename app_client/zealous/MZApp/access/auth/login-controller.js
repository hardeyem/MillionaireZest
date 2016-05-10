(function (window, angular) {
  'use strict';

  angular
    .module('AccessModule')
    .controller('LoginCtrl', [
             '$state', 'Authentication','$rootScope','$location',

      function($state, Authentication, $rootScope, $location) {
          //var jq = $.noConflict();
          $rootScope.toastMsg = "welcome";
          var vm = this;
          vm.pageHeader = {
              title: 'Sign in to Loc8r'
          };
          vm.credentials = {
              email : "",
              password : ""
          };
          vm.returnPage = $location.search().page || '/';
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
                      $state.go('/home');
                      /*$location.search('home', null);
                      $location.path(vm.returnPage);*/
                  });
          };
  }]);

})(window, window.angular);


