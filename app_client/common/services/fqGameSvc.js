/**
 * Created by Adekunle Adeyemi on 07/03/2016.
 */
(function (window, angular) {
    'use strict';
    angular
        .module('MZApp.fq')
        .service('FQGameSvc', ['$window', '$http', 'Authentication', hostHandler]);

    function hostHandler($window, $http, Authentication){

        var getFQGame = function(){
            return $http.get('/api/game/final_quest', {
                headers : {
                    Authorization : 'Bearer '+ Authentication.getToken()
                }
            })
        };
        var generateQuestion = function(data){
            return $http.post('/api/host/generate_question', data,{
                headers : {
                    Authorization : 'Bearer '+ Authentication.getToken()
                }
            })
        };

        return{
            getFQGame : getFQGame,
            generateQuestion : generateQuestion
        }
    }


})(window, window.angular);
