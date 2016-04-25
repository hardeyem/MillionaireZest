(function(window, angular, undefined){ 'use strict';

  angular
    .module('AdminModule.access')
    .directive('emailDupeValidator', ['$q','$http',

      function($q, $http){
        return {
          restrict: 'A',
          require: 'ngModel',
          link: function(scope, element, attrs, ngModel) {
            ngModel.$asyncValidators.duplicateEmail = function(modelValue) {
              // angular 1.3 new $q promise format
              return $q(function(resolve, reject) {
                userSvc.checkDupes({email: modelValue}).$promise.then(function(response) {
                  if(response.validEmail === true){
                    resolve();
                  } else {
                    reject();
                  }
                });
              });
            };
          }
        };
   }]);

})(window, window.angular);