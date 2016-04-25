(function (window, angular) {
  'use strict';

angular
    .module('MainModule.services')
    .factory('userSvc', [/*'$resource',*/
        function( ){
            /*var User = $resource('/api/users/:id', {id: '@id'},{

                // secure REST endpoints
                update: { method: 'PUT' },

                // non-secured REST endpoints
                save  : { method: 'POST', url: '/api/auth/register'},
                checkDupes : { method: 'POST', url: '/api/auth/check-email'}
            });
            User.prototype.update = function() {
                return this.$update({id: this._id});
            };
            User.prototype.checkDupes = function (data) {
                return this.$checkDupes({email: data.email});
            };
            return User;*/

        var baseUrl = "api/auth";
        /*function changeUser(user){
            angular.extend(currentUser, user);
        }
        function urlBase64Decode(str){
            var output = str.replace('-','+').replace('_','/');
            switch (output.length % 4){
                case 0: break;
                case 2: output += '=='; break;
                case 3: output += '='; break;
                default : throw 'Ilegal base64 url string';
            }
            return window.atob(output);
        }

        function  getUserFromToken(){
            var token = $localStorage.token;
        }*/

        var saveToken = function (token) {
            $window.localStorage['lmq-token'] = token;
        };
        var getToken = function () {
            return $window.localStorage['lmq-token'];
        };
        var register = function(user) {
            return $http.post(baseUrl + '/register', user).success(function(data){
                saveToken(data.token);
            });
        };
        var login = function(user) {
            return $http.post(baseUrl + '/login', user).success(function(data) {
                saveToken(data.token);
            });
        };
        var logout = function() {
            $window.localStorage.removeItem('lmq-token');
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
                    email : payload.email,
                    lastName : payload.last_name
                };
            }
        };
        return {
            saveToken : saveToken,
            getToken : getToken,
            register : register,
            login : login,
            logout : logout,
            isLoggedIn : isLoggedIn,
            currentUser : currentUser
        };


   }]);

})(window, window.angular);

