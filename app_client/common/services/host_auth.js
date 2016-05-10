/**
 * Created by TK on 03/03/2016.
 */

(function (window, angular) {
    'use strict';
    angular
        .module('HostMainServices')
        .service('HostAuth',['$window','$http', authentication]);
    function authentication ($window, $http) {
        var saveToken = function (token) {
            $window.localStorage['qp-host-token'] = token;
        };
        var getToken = function () {
            return $window.localStorage['qp-host-token'];
        };

        var logoutHost = function () {
            $window.localStorage.removeItem('qp-host-token');
        };
        var isHostLoggedIn = function() {
            var token = getToken();
            if(token){
                var payload = JSON.parse($window.atob(token.split('.')[1]));
                return payload.exp > Date.now() / 1000;
            } else {
                return false;
            }
        };
        var currentHost = function() {
            if(isLoggedIn()){
                var token = getToken();
                var payload = JSON.parse($window.atob(token.split('.')[1]));
                return {
                    username : payload.username,
                    last_name : payload.last_name
                };
            }
        };

        var registerHost = function(hostData){
            return $http.post('/api/auth/host/register', hostData).success(function (data) {
                saveToken(data.token);

            });
        };

        var loginHost = function(admin){
            return $http.post('/api/auth/host/login', admin).success(function (data) {
                saveToken(data.token);
            });
        };
        return {
            saveToken        : saveToken,
            getToken         : getToken,
            logoutHost      : logoutHost,
            isHostLoggedIn  : isHostLoggedIn,
            currentHost      : currentHost,
            registerHost    : registerHost,
            loginHost       : loginHost
        };
    }
})(window, window.angular);