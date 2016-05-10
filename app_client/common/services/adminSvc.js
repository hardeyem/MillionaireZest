/**
 * Created by Adekunle Adeyemi on 04/03/2016.
 */

(function (window, angular) {
    'use strict';
    angular
        .module('AdminMainServices')
        .service('AdminSvc', ['$window', '$http', 'AdminAuth', adminHandler]);

    function adminHandler($window, $http, AdminAuth){

        var getAllHost = function(){
            return $http.get('/api/admin/gethosts',{
                headers : {
                    Authorization : 'Bearer ' + AdminAuth.getToken()
                }
            })
        };

        var getFinalGamers = function(){
            return $http.get('/api/admin/getfinalgamers',{
                headers : {
                    Authorization : 'Bearer ' + AdminAuth.getToken()
                }
            })

        };
        var assignFinalGame = function(data){
            return $http.post('/api/admin/assign_final_game', data,{
                headers : {
                    Authorization : 'Bearer ' + AdminAuth.getToken()
                }
            })
        };


        return {
            getAllHosts     : getAllHost,
            getFinalGamers  : getFinalGamers,
            assignFinalGame : assignFinalGame
        }
    }
})(window, window.angular);