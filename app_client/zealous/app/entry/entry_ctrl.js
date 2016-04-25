/**
 * Created by TK on 13/02/2016.
 */

(function (window, angular) {
    'use strict';
    //var jq = $.noConflict();

    angular
        .module('EntryModule')
        .controller('EntryCtrl', ['$state', '$rootScope', '$location', 'Authentication','Entry',
            function ($state, $rootScope, $location, Authentication, Entry) {
                var vm  = this;
                //window.alert('welcome dash');
                vm.user = "Adeyemi";
                //$rootScope.token = Authentication.getToken();
                var token = Authentication.getToken();
                //$rootScope.token = token;
                //handleGameSocket(token)

                vm.submitEntry = function(){
                    console.log('submitting');
                    window.alert("you are submitting your entry");
                    var entryDetails = {
                        type : vm.type,
                        amount : vm.amount
                    };

                    console.log(entryDetails);
                    Entry.enterGame(entryDetails).then(function(res){
                        //window.location = "/dash";
                        console.log("entry successul");
                        console.log(res.data);
                        if(res.data.error){
                            vm.msg = res.data.detail.msg;
                        }else{
                            vm.msg = res.data.detail.msg;
                            window.alert("you have successfully entered the show");
                        }

                    });

                }
            }
        ]);
})(window, window.angular);