/**
 * Created by Adekunle Adyemi on 05/03/2016.
 */
(function (window, angular) {
    'use strict';
    angular
        .module('HostMainServices')
        .service('HostSvc', ['$window', '$http', 'HostAuth', hostHandler]);

    function hostHandler($window, $http, HostAuth){

        var getHostGame = function(){
            return $http.get('/api/host/get_host_game', {
                headers : {
                    Authorization : 'Bearer '+ HostAuth.getToken()
                }
            })
        };
        var generateQuestion = function(data){
            return $http.post('/api/host/generate_question', data,{
                headers : {
                    Authorization : 'Bearer '+ HostAuth.getToken()
                }
            })
        };

        /*var comment = function(commentText){
            return $http.post('/api/host/comment', data,{
                headers : {
                    Authorization : 'Bearer '+ HostAuth.getToken()
                }
            })
        }*/

        return{
            getHostGame : getHostGame,
            generateQuestion : generateQuestion
        }
    }


})(window, window.angular);
