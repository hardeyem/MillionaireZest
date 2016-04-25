/**
 * Created by TK on 03/03/2016.
 */

(function(window, angular){
    'use strict';

    var jq = $.noConflict();
    angular
        .module('AdminModule.host')
        .controller('AdminHostCtrl', ['HostAuth','AdminSvc',function(HostAuth, AdminSvc){
            var vm = this;

            vm.info = "You have logged in";
            vm.submit = function(isValid) {
                if(isValid){
                    console.log(vm.newHost);
                    HostAuth.registerHost(vm.newHost)
                        .then(function(user){
                            if(user) {
                                //notifySvc.success('You have successfully registered as a new admin.','Register');
                                console.log('success adding a new admin');
                                //$state.go('dash');
                                vm.info = "successful added new host " + user;
                            }
                        })
                        .catch(function() {
                            vm.failed();
                        });
                }
            };

            vm.failed = function() {
                //notifySvc.error('Sorry, we were unable to register you at this time!','Registration Failed');
                console.log('error registrign a new host');
            };

            //////////for listing all host////////////
            AdminSvc.getAllHosts().success(function(response){
                //var resData = response.data;
                if(!response.error){
                    //console.log(response);
                    //console.log(response.hosts)
                    vm.hosts = response.hosts;
                }
            }).error(function(){
                console.log('error retrieving hosts');
            });

            //////Get final gamers////////////
            AdminSvc.getFinalGamers().success(function(res){
                console.log(res);
                if(!res.error){
                    if(res.finalGamers){
                        vm.players = res.finalGamers;
                    }else{
                        console.log('there is no final gamer ');
                    }
                }else{

                }
            }).error(function () {
                console.log('error retrieving final gamer');
            });

            vm.assignPlayer =function(id){
                console.log('got host with id ' + id);
                vm.players.forEach(function(player, index){
                    if(player.detail._id == id){
                        console.log(player);
                        updateAssignHostView(player.fq.userId, player.detail, 'player');
                        return;
                    }
                })
            };

            vm.assignHost =function(id){
                console.log('got host with id ' + id);
                vm.hosts.forEach(function(host, index){
                    if(host._id == id){
                        console.log(host);
                        updateAssignHostView(host._id, host, 'host');
                        return;
                    }
                })
            };

            vm.assignGame = function(){
                window.alert('assigning');
                var hostView = jq('.host-assign');
                var playerView = jq('.player-assign');
                var assignData = {
                    hostId : hostView.data('id'),
                    playerId : playerView.data('id')
                };

                if(!assignData.hostId || !assignData.playerId){
                    console.log('you need to pick both host and player');
                    return false;
                }

                console.log('assigning host and player with');
                console.log(assignData);
                AdminSvc.assignFinalGame(assignData).success(function(data){
                    console.log('added game ');
                    console.log(data);
                }).error(function(){
                    console.log('error adding game');
                });
            };

            function updateAssignHostView(id, what, who){
                var view;
                if(who == 'host') {
                    view = jq('.host-assign');
                }else if(who == 'player'){
                    view = jq('.player-assign');
                }

                view.data('id' , id);
                console.log(view.data('id'));
                console.log(what);
                view.find('.assign-name').text(what.last_name + ' ' + what.first_name);
                view.find('.assign-age').text(what.date_of_birth);
                view.find('.assign-country').text(what.country);
            }
            /*vm.hosts = [{name : 'adekunle adeyemi'}, {name : 'omotola omotosho'}];
            console.log(vm.hosts);*/
        }]);
})(window, window.angular);
