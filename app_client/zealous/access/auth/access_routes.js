(function (window, angular) {
  'use strict';

  angular
    .module('AccessModule')
      .config(['$httpProvider', function($httpProvider) {
          if (!$httpProvider.defaults.headers.get) {
              $httpProvider.defaults.headers.get = {};
          }


          // force refresh for development
          $httpProvider.defaults.headers.get['If-Modified-Since'] = '0';

      }])
      /*.config(['$locationProvider', function($locationProvider){
       $locationProvider.html5Mode(true);
       }])*/

      .config(['$stateProvider', '$urlRouterProvider',
          function($stateProvider, $urlRouterProvider) {

              $urlRouterProvider.otherwise('/');

              $stateProvider
                  .state('access', {
                      url: '/',
                      templateUrl: 'login.html',
                      controller: 'AccessCtrl as access'
                  })/*.state('access.login', {
                      url: '/login',
                      templateUrl: '../register/register.html',
                      controller: 'RegisterCtrl as register'
                  })*/
                  .state('access.register', {
                      url: '/register',
                      templateUrl: '../register/register.html',
                      controller: 'RegisterCtrl as register'
                  });


          }
      ]);

})(window, window.angular);
