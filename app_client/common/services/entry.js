/**
 * Created by Adekunle Adeyemi on 07/02/2016.
 */

(function (window, angular) {
    'use strict';
    angular
        .module('MZApp.entry')
        .service('Entry', ['$window', '$http','Authentication', entry]);

    function entry($window , $http, Authentication){
        var enterGame = function(entryData){
            return $http.post('/api/game/entry', entryData, {
                headers: {
                    Authorization: 'Bearer '+ Authentication.getToken()
                }
            }).success(function(data){
                //console.log('entered' + data);

            });
        };

        var getEntryDetail = function(){
            $window.localStorage.removeItem('gp-entry-type');
            return $http.get('/api/game/entry-detail', {
                headers: {
                    Authorization: 'Bearer '+ Authentication.getToken()
                }
            }).success(function(data){
                console.log('got type ' + data.entries[0].gameFor);
                saveEntryType(data.entries[0].gameFor);
            });
        };

        var saveEntryType = function(entry){
            if(entry != null || entry != undefined)
                $window.localStorage['gp-entry-type'] = entry;
        };

        var getEntryType = function(){
            return $window.localStorage['gp-entry-type'] ? $window.localStorage['gp-entry-type'] : false ;
        };

        var getFinalEntryDetail = function(){
            return $http.get('/api/game/final-detail', {
                headers: {
                    Authorization: 'Bearer '+ Authentication.getToken()
                }
            }).success(function(data){
                console.log('got final quest detail ' + data);
            });
        };


        return {
            enterGame : enterGame,
            getEntryDetail : getEntryDetail,
            saveEntryType : saveEntryType,
            getEntryType : getEntryType,
            getFinalEntryDetail : getFinalEntryDetail
        }
    }
})(window, window.angular);