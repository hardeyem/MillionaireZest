(function (window, angular, localStorage, undefined) {  'use strict';

  angular
    .module('xs.cache', [])
    .factory('xsStorageFactory', [function() {

      return function (storageKey) {
        return {
          set: function ( itemKey, value ) {
            var compositeKey = storageKey + '.' + itemKey;
            return localStorage.setItem(compositeKey, angular.toJson(value));
          },
          get: function ( itemKey ) {
            var compositeKey = storageKey + '.' + itemKey;
            var value = localStorage.getItem(compositeKey);
            return angular.fromJson(value);
          },
          remove: function ( itemKey ) {
            var compositeKey = storageKey + '.' + itemKey;
            return localStorage.removeItem(compositeKey);
          },
          removeAll: function() {
            var length = localStorage.length;
            var idx = 0;
            for (var i = 0; i < length; i++) {
              var key = localStorage.key(idx);
              // remove storage key that begin with "storageKey."
              if(key.indexOf(storageKey + '.') === 0 ){
                localStorage.removeItem(key);
              } else {
                idx++;
              }
            }
          }
        };
      };
    }])

    .factory('xsCacheFactory', ['$cacheFactory', 'xsStorageFactory', function ($cacheFactory, xsStorageFactory) {

      return function (storageKey, capacity) {
        var cache = $cacheFactory(storageKey, {
          capacity: capacity
        });
        var storage = xsStorageFactory(storageKey);

        return {
          set: function ( itemKey, value ) {
            cache.put(itemKey, value);
            storage.set(itemKey, value);
          },
          get: function ( itemKey ) {
            var value = null;
            if (cache.get(itemKey)) {
              // found in ngCacheFactory
              value = cache.get(itemKey);
            } else {
              // not in cache
              if (storage.get(itemKey)) {
                // but found in local storage
                // get from storage - put in ngCacheFactory
                cache.put(itemKey, storage.get(itemKey));
                // and re-get from ngCacheFactory
                value = cache.get(itemKey);
              }
            }
            return value === undefined ? null : value;
          },
          remove: function ( itemKey ) {
            // remove specific items by sub-key
            cache.remove(itemKey);
            storage.remove(itemKey);
          },
          removeAll: function() {
            cache.removeAll();
            storage.removeAll();
          }
        };
      };
    }]);

})(window, window.angular, window.localStorage);


