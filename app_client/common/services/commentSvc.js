/**
 * Created by Adekunle Adeyemi on 12/03/2016.
 */
(function(window, angular) {
    'use strict';
    angular
        .module('MainServices')
        .service('CommentSvc', ['$window', '$http', 'Authentication', commentHandler]);

    function commentHandler ($window, $http, Authentication){

        var loadComments = function(){
            return $http.get('/api/game/comments', {
                headers : {
                    Authorization : 'Bearer '+ Authentication.getToken()
                }
            })
        };

        var newComment = function(data){
            return $http.post('/api/game/comment', data, {
                headers : {
                    Authorization : 'Bearer '+ Authentication.getToken()
                }
            });
        };

        return {
            loadComments : loadComments,
            newComment : newComment
        }
    }
})(window, window.angular);