(function (window, angular) {  'use strict';

  angular
    .module('MainModule.services')
    // cache factories for specific components
    .factory('userCacheSvc', ['xsCacheFactory', function(xsCacheFactory) {
      return xsCacheFactory('user', 500);
    }])
    /*.factory('leadCacheSvc', ['xsCacheFactory', function(xsCacheFactory) {
      return xsCacheFactory('lead', 500);
    }])
    .factory('settingsCacheSvc', ['xsCacheFactory', function(xsCacheFactory) {
      return xsCacheFactory('settings', 500);
    }])
    .factory('debugCacheSvc', ['xsCacheFactory', function(xsCacheFactory) {
      return xsCacheFactory('debug', 500);
    }]);*/


})(window, window.angular);
