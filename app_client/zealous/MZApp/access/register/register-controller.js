(function (window, angular) {
  'use strict';

  angular
    .module('MZApp.access')
    .controller('RegisterCtrl', ['$state','$location', 'Authentication', RegisterCtrl]);
  function RegisterCtrl(  $state, $location, Authentication) {
      //$rootScope.hello = "welcome to register";
      var vm = this;
      vm.hello = "welcome to register";
      vm.hi = "hi how are you doing";
      vm.show = "Registration controller";
      vm.authCredentials = {
          email: "",
          password: "",
          confirmPassword : "",
          mobile : ""
      };
      vm.credentials = {
          first_name : "",
          last_name : "",
          sex : "",
          date_of_birth : "",
          address : "",
          city : "",
          state:"",
          country : '',
          title : '',
          terms : false
      };
      vm.returnPage = $location.search().page || '#/home';
      vm.registerUser = function () {
          console.log('form submition');
          console.log(vm.credentials.title);
          console.log(vm.authCredentials);
          console.log(vm.credentials);

          vm.formError = "";

          console.log(vm.credentials.day);

          var day = vm.credentials.day.toString();
          var month = vm.credentials.month.toString();
          var year = vm.credentials.year.toString();

          //console.log('got title as ' + vm.credentials.title);

          vm.credentials.date_of_birth = day + "-" + month + "-" + year;
          console.log(vm.date_of_birth);
          if (!vm.authCredentials.mobile || !vm.authCredentials.email || !vm.authCredentials.password || !vm.authCredentials.confirmPassword
          || !vm.credentials.first_name || !vm.credentials.last_name || !vm.credentials.sex
          || !vm.credentials.address || !vm.credentials.city || !vm.credentials.state || !vm.credentials.country) {
              vm.formError = "Fields with * are required, please try again";
              return false;
          }else{

              console.log('all forms field correct');
              if (vm.authCredentials.password == vm.authCredentials.confirmPassword) {
                  if(!day || !month || !year){
                      vm.formError = "Your date of birth is incorrect";
                      return false;
                  }
                  if(vm.credentials.terms){
                      console.log('agreed the terms');
                      vm.doRegister();
                  }else{
                      vm.formError = "You must agree with the terms and conditions";
                      return false;
                  }

              } else {
                  vm.formError = "Password not match";
                  return false;
              }
          }

          window.alert("sending form");
      };
      vm.doRegister = function () {
          vm.formError = "";

          console.log(vm.authCredentials);
          console.log(vm.credentials);
          window.alert('do registering'+ vm.authCredentials);
          Authentication.registerAuth(vm.authCredentials)
              .error(function (err) {
                  vm.formError = err;
                  window.alert("error registering")
              })
              .then(function () {
                  //window.alert("success registering");
                  Authentication.registerDetails(vm.credentials)
                      .error(function(err){
                          vm.formError = err;
                      })
                      .then(function(){
                          //window.alert("success registering details");
                          //$location.search('page', null);
                          window.location = '/dash';
                      });
              });
      };
  }
    /*var vm = this;
      vm.hello = "registry form";
    vm.credentials = new userSvc();
    vm.onSubmit = function(isValid) {
        //window.alert('form submmit');
        window.console.log('registring');
      if(isValid){
          vm.credentials.$save()
              .then(function(user){
                  if(user) {
                      //notifySvc.success('You have successfully registered with Lead Assistant.','Register');
                      $state.go('home');
                  }
              })
              .catch(function() {
                  vm.failed();
              });
      }
  };
    vm.failed = function() {
        window.alert('registry failed');
        //notifySvc.error('Sorry, we were unable to register you at this time!','Registration Failed');
    };
  }*/

})(window, window.angular);


