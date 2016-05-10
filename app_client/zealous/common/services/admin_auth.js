/**
 * Created by Adekunle Adeyemi on 02/03/2016.
 */

(function (window, angular) {
    'use strict';
    angular
        .module('AdminMainServices')
        .service('AdminAuth',['$window','$http', authentication]);
    function authentication ($window, $http) {
        var saveToken = function (token) {
            $window.localStorage['qp-admin-token'] = token;
        };
        var getToken = function () {
            return $window.localStorage['qp-admin-token'];
        };

        var logoutAdmin = function () {
            $window.localStorage.removeItem('qp-admin-token');
        };
        var isAdminLoggedIn = function() {
            var token = getToken();
            if(token){
                var payload = JSON.parse($window.atob(token.split('.')[1]));
                return payload.exp > Date.now() / 1000;
            } else {
                return false;
            }
        };
        var currentAdmin = function() {
            if(isLoggedIn()){
                var token = getToken();
                var payload = JSON.parse($window.atob(token.split('.')[1]));
                return {
                    username : payload.username
                };
            }
        };

        var registerAdmin = function(adminData){
            return $http.post('/api/auth/admin/register', adminData).success(function (data) {
                saveToken(data.token);

            });
        };

        var loginAdmin = function(admin){
            return $http.post('/api/auth/admin/login', admin).success(function (data) {
                saveToken(data.token);
            });
        };
        return {
            saveToken        : saveToken,
            getToken         : getToken,
            logoutAdmin      : logoutAdmin,
            isAdminLoggedIn  : isAdminLoggedIn,
            currentAdmin      : currentAdmin,
            registerAdmin    : registerAdmin,
            loginAdmin       : loginAdmin
        };
    }
})(window, window.angular);