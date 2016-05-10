/**
 * Created by Adekunle Adeyemi on 07/02/2016.
 */

(function (window, angular) {
    'use strict';
    angular
        .module('MainServices')
        .service('Authentication',['$window','$http','$q', authentication]);
    function authentication ($window, $http, $q) {
        var defer = $q.defer();
        var saveToken = function (token) {
            $window.localStorage['qp-token'] = token;
        };
        var getToken = function () {
            return $window.localStorage['qp-token'];
        };
        var registerAuth = function (user) {
            return $http.post('/api/auth/register', user).success(function (data) {
                saveToken(data.token);

            });
        };
        var registerDetails = function(user){
            return $http.post('/api/register/details', user,{
                headers: {
                    Authorization: 'Bearer '+ getToken()
                }
            }).success(function (data) {

            });
        };
        var login = function (user) {
            return $http.post('/api/auth/login', user).success(function (data) {
                saveToken(data.token);
            });
        };
        var logout = function () {
            $window.localStorage.removeItem('qp-token');
            if(!isLoggedIn()){
                defer.resolve(true);
            }else {
                defer.reject(false);
            }

            return defer.promise;
        };
        var isLoggedIn = function() {
            var token = getToken();
            if(token){
                var payload = JSON.parse($window.atob(token.split('.')[1]));
                return payload.exp > Date.now() / 1000;
            } else {
                return false;
            }
        };
        var currentUser = function() {
            if(isLoggedIn()){
                var token = getToken();
                var payload = JSON.parse($window.atob(token.split('.')[1]));
                return {
                    email : payload.email
                };
            }else{
                return false;
            }
        };

        var registerAdmin = function(adminData){
            return $http.post('/api/admin/register', adminData).success(function (data) {
                saveToken(data.token);

            });
        };

        var loginAdmin = function(admin){
            return $http.post('/api/admin/login', admin).success(function (data) {
                saveToken(data.token);
            });
        };
        return {
            saveToken        : saveToken,
            getToken         : getToken,
            registerAuth     : registerAuth,
            registerDetails  : registerDetails,
            login            : login,
            logout           : logout,
            isLoggedIn       : isLoggedIn,
            currentUser      : currentUser,
            registerAdmin    : registerAdmin,
            loginAdmin       : loginAdmin
        };
    }
})(window, window.angular);