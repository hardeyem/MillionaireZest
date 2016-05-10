/**
 * Created by Adekunle Adeyemi on 08/03/2016.
 */

(function(window, angular){
    'use strict';
    angular
        .module('VideoServices')
        .factory('VideoStream', ['$q', function($q){
            var stream;
            return {
                get: function () {
                    if (stream) {
                        return $q.when(stream);
                    } else {
                        var d = $q.defer();
                        navigator.getUserMedia({
                            video: true,
                            audio: true
                        }, function (s) {
                            stream = s;
                            d.resolve(stream);
                        }, function (e) {
                            d.reject(e);
                        });
                        return d.promise;
                    }
                }
            };
        }]);

})(window, window.angular);