(function (window, angular) {
  'use strict';

  angular
    .module('MZApp.access')
      .config(['$stateProvider', '$urlRouterProvider',
          function($stateProvider, $urlRouterProvider) {

              //$urlRouterProvider.otherwise('/');

              $stateProvider
                  .state('access', {
                      url: '/access',
                      abstract : true,
                      /*redirectTo: {
                          state: 'access.auth'
                          //params: { id: 123}
                      }*/
                      template: '<div ui-view></div>'
                      /*controller: 'AuthCtrl as auth'*/
                  }).state('access.auth', {
                      url: '/auth',
                      parent : 'access',
                      templateUrl: 'MZApp/access/auth/login.html',
                      controller: 'AuthCtrl as auth'
                  })
                  .state('access.register', {
                      url: '/register',
                      parent : 'access',
                      templateUrl: 'MZApp/access/register/register.html',
                      controller: 'RegisterCtrl as register'
                  })
              ;


          }
      ]);

})(window, window.angular);
