(function (window, angular) {
  'use strict';

  angular
    .module('AdminModule.access')
    .controller('AdminRegisterCtrl', ['$state', 'AdminAuth', RegisterCtrl]);
  function RegisterCtrl(    $state,   AdminAuth) {
    var vm = this;
    //vm.newUser = new userSvc();
    vm.submit = function(isValid) {
      if(isValid){
        console.log(vm.newAdmin);
        AdminAuth.registerAdmin(vm.newAdmin)
          .then(function(user){
            if(user) {
              //notifySvc.success('You have successfully registered as a new admin.','Register');
              console.log('success adding a new admin');
              $state.go('dash');
            }
          })
          .catch(function() {
            vm.failed();
          });
      }
    };
    vm.failed = function() {
      //notifySvc.error('Sorry, we were unable to register you at this time!','Registration Failed');
      console.log('error registrign a new admin');
    };
  }

})(window, window.angular);


