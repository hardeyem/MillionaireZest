/**
 * Created by Adekunle Adeyemi on 05/03/2016.
 */
(function(window, angular){
    //'use strict';

    var jq = $.noConflict();

    /******* Video stream implementation *********/

    //$('#remoteVideo').hide();
    //$('#localVideo').hide();

    var localuser;
    var remoteuser;

    var isChannelReady;
    var isInitiator = false;
    var isStarted = false;

    var localVideoStream;
    var remoteVideoStream;
    var pc;

    var isFirefox = false;

    var dataChannel;

    var turnReady;

    // var pc_config;
    // window.turnserversDotComAPI.iceServers(function(data) {
    //    pc_config = {
    //  'iceServers': data
    // };
    // console.log(data);
    // });
    //Ice Servers Added
    var pc_config = {
        'iceServers': [{
            'url': 'stun:stun.l.google.com:19302'
        }]
    };

    // pc_constraints is not currently used, but the below would allow us to enforce
    // DTLS keying for SRTP rather than SDES ... which is becoming the default soon
    // anyway.
    var pc_constraints = {
        'optional': [{
            'DtlsSrtpKeyAgreement': true
        }]
    };

    // Set up audio and video regardless of what devices are present.
    var sdpConstraints = {
        'mandatory': {
            'OfferToReceiveAudio': true,
            'OfferToReceiveVideo': true
        }
    };


    // The following var's act as the interface between our HTML/CSS code
    // and this JS. These allow us to interact between the UI and our application
    // logic

    /*var startButton = document.getElementById("startButton");

    startButton.disabled = false;

    startButton.onclick = createConnection;*/

    //closeButton.onclick = closeDataChannels;

    var localVideo; //= document.querySelector('#localVideo');
    var remoteVideo; //= document.querySelector('#remoteVideo');

    /*var room = location.pathname.substring(1);
    var user = location.pathname.substring(2);*/
    //var socket = io.connect();

    var user;
    var room;

    var constraints = {
        audio: true,
        video: true
    };


    /******* End video stream implemmentation ********/
    var fGameSocket;
    var scopeVm, scope, sce;
    angular
        .module('HostModule.game')
        .controller('GameCtrl', ['$scope', '$sce', 'HostSvc','HostAuth',function($scope, $sce, HostSvc, HostAuth) {
            var vm = this;

            scopeVm = vm;
            scope = $scope;
            sce = $sce;

            //console.log(HostAuth.getToken());
            vm.playerUseLive = [];
            HostSvc.getHostGame().success(function(data){
                console.log('success getting host game');
                console.log(data);

                vm.playerName = data.playerDetail.last_name + ' ' + data.playerDetail.first_name;
                vm.playerAge = data.playerDetail.date_of_birth;
                vm.playerSex = data.playerDetail.sex;
                vm.playerCountry = data.playerDetail.country;
                vm.playerWorth = data.playerDetail.worth;
                vm.playerEarned = data.playerAcc.total_earned;
                vm.playerLastEarned = data.playerAcc.last_earned;

                //used for refrence to game id document
                vm.gameId = data.hostGame._id;

                /////Update conversation//////
                vm.conversations = data.hostGame.conversations;
                if(data.hostGame.level_reached != null && data.hostGame.level_reached != undefined)
                    vm.levelReached = data.hostGame.level_reached;
                else vm.gameLevel = 1;

                vm.playerUseLive[0] = data.hostGame.lives.revert_option;
                vm.playerUseLive[1] = data.hostGame.lives.double_option;
                vm.playerUseLive[2] = data.hostGame.lives.extra_option;


            }).error(function(){

            });
            vm.playerUseLive = [0,0,0];

            localVideo = jq(document).find('video#localVideo');

            vm.startGame = function(){
                console.log('start stream connection');
                isInitiator = true;
                isChannelReady = true;
                createConnection();
            };

            vm.endGame = function(){
                console.log('closing channel');
                closeDataChannels();
            };

            vm.generateQuest = function(level){
                if(level == undefined){
                    console.log('please select a level');
                    return false;
                }
                console.log('generate question for  ' + level);
                var data = {
                    level : level,
                    gameType : "general"
                };

                HostSvc.generateQuestion(data).success(function(response){
                    console.log('generate question complete');
                    vm.question = response.question.question;
                    vm.options = response.question.options;
                    vm.options.correct = response.question.options[response.question.options.correct];
                }).error(function(){
                    console.log('error generating questions');
                });
            };

            var token = HostAuth.getToken();
            fGameSocket = io.connect(':3000/finalQuest',{
                'query': 'token=' + token
            });

            vm.askQuestion = function(){
                var questData = {
                    question : vm.question,
                    options : {
                        a : vm.options.a,
                        b : vm.options.b,
                        c : vm.options.c,
                        d : vm.options.d
                    }
                };

                fGameSocket.emit('game:askQuestion', questData);
            };

            vm.correctAnswer = function(answer){
                if(answer ==  vm.options.correct){
                    console.log('player got it right');
                    fGameSocket.emit('game:playerCorrect', {gameId : vm.gameId, currentLevel : vm.gameLevel});
                }else{
                    //alert host the player is wrong
                    //a
                }
            };

            vm.finalAnswer = function(option){
                fGameSocket.emit('game:playerFinalAnswer', {option : option});
            };
            vm.converse = function(msg){
                console.log('commenting ........');
                console.log(msg);

                fGameSocket.emit('Game:Converse', {msg : msg, gameId : vm.gameId});
            };


            handleGameSocket(vm,$scope, token, fGameSocket);
        }
    ]);

    function handleGameSocket(vm, $scope, token, fGameSocket){


        fGameSocket.on('connect', function(socket){

            console.log("connected to socket with ");
            console.log(socket);
            /*socket.on('authenticated', function () {
             //do other things
             show.emit("user:gameEntered",{});
             }).emit('authenticate', {token: token}); //send the jwt
             */
        });

        /**
         * Used for Streaming video
         */

        fGameSocket.on('created', function(data) {
            console.log('Created room ' + data);
            room = data;
            //isInitiator = true;
        });

        fGameSocket.on('join', function(room) {
            //request from player to join room
            console.log('Another peer made a request to join room ' + room);
            console.log('This peer is the initiator of room ' + room + '!');
            //isChannelReady = true;
        });


        //used to share video stream between player and host
        fGameSocket.on('fStream', function(message) {
            console.log('got strean sdata');
            console.log(message);
            if (message === 'Got user media') {
                maybeStart();
            } else if (message.type === 'offer') {
                if (!isInitiator && !isStarted) {
                    maybeStart();
                }
                pc.setRemoteDescription(new getSessionDescription(message));
                doAnswer();
            } else if (message.type === 'answer' && isStarted) {
                pc.setRemoteDescription(new getSessionDescription(message));
            } else if (message.type === 'candidate' && isStarted) {
                var candidate = getIceCandidate({
                    sdpMLineIndex: message.label,
                    candidate: message.candidate
                });
                pc.addIceCandidate(candidate);
            } else if (message === 'bye' && isStarted) {
                handleRemoteHangup();
            }
        });
        //End video api

        fGameSocket.on('system:Error', function(data){
            console.log(data);
        });

        fGameSocket.on('game:hostValidateAnswer', function(data){
            console.log('got answer');
            console.log(data);
            vm.playerAnswer = data;
            $scope.$apply();
        });

        fGameSocket.on('game:correctAnswer', function(data){
            vm.gameLevel = data.gameLevel;

        });

        fGameSocket.on('game:playerUseLive', function(data){
            console.log('player using live');
            console.log(data);
            var gameData = {
                gameId : vm.gameId,
                liveUsed : data.liveIndex
            };
            if(data.liveIndex == 0){
                console.log('using live revert option');
            }else if(data.liveIndex == 1){
                console.log('using live double option');
            }else if(data.liveIndex == 2){
                console.log('using live three options');
            }
            //update player lives
            fGameSocket.emit('game:hostConfirmLiveUsed', gameData);
            vm.playerUseLive[data.liveIndex] = true;
            $scope.$apply();
        });

        fGameSocket.on('game:userConverse', function(data){
            vm.conversations.push(data);
            $scope.$apply();
            console.log(data);
        });

        fGameSocket.on('system:Error', function(data){
            console.log(data);
        })
    }

    function sendMessage(message) {
        fGameSocket.emit('fStream', message);
    }

    function createConnection() {
        //if (user === '') {
        //    user = document.getElementById("userId").value;
        //}
        //
        //if (room === '') {
        //    room = document.getElementById("roomId").value;
        //}
        //
        //if (user === '' || room === '') {
        //    alert('Both Username and Room Name are Required.');
        //    return false;
        //}
        //$('.navbar-toggle').trigger('click');
        //localuser = document.getElementById("userId").value;
        ///*if (room !== '') {
        //    socket.emit('create or join', room);
        //}*/
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        navigator.getUserMedia(constraints, handleUserMedia, handleUserMediaError);
        if(navigator.mozGetUserMedia) {
            isFirefox = true;
        }
        if (location.hostname != "localhost") {
            //requestTurn('https://computeengineondemand.appspot.com/turn?username=41784574&key=4080218913');
            //console.log('something must be done, not locahost ......');
        }
    }


    ////////////////////////////////////////////////////
    // This next section is where we deal with setting
    // up the actual components of the communication
    // we are interested in using. Starting with the
    // video streams
    ////////////////////////////////////////////////////

    function trace(text) {
        console.log((performance.now() / 1000).toFixed(3) + ": " + text);
    }

    function handleUserMedia(stream) {

        console.log('Adding local stream.');

        scopeVm.localVideoUrl = sce.trustAsResourceUrl(window.URL.createObjectURL(stream));

        //localVideo.src = window.URL.createObjectURL(stream);
        scope.$apply();
        console.log(window.URL.createObjectURL(stream));
        console.log(localVideo);
        localVideoStream = stream;
        sendMessage('Got user media');
        //$('#localimg').hide();
        //$('#localVideo').show();
        if (isInitiator) {
            maybeStart();
        }
    }

    function handleUserMediaError(error) {
        console.log('navigator.getUserMedia error: ', error);
    }

    function maybeStart() {
        console.log('may be start');
        console.log(isStarted);
        console.log(typeof localVideoStream);
        console.log(isChannelReady);

        if (!isStarted && typeof localVideoStream != 'undefined' && isChannelReady) {
            console.log('called start');
            createPeerConnection();
            pc.addStream(localVideoStream);
            // Add data channels
            //createDataConnection();
            isStarted = true;
               console.log('isInitiator', isInitiator);
            if (isInitiator) {
                doCall();
            }
        }
    }

    window.onbeforeunload = function(e) {
        sendMessage('bye');
    };

    /////////////////////////////////////////////////////////
    // Next we setup the data channel between us and the far
    // peer. This is bi-directional, so we use the same
    // connection to send/recv data. However its modal in that
    // one end of the connection needs to kick things off,
    // so there is logic that varies based on if the JS
    // script is acting as the initator or the far end.
    /////////////////////////////////////////////////////////

    function createPeerConnection() {
        console.log('creating peer connection');
        try {
            var servers = null;
            pc = new getRTCPeerConnection(servers, {
                optional: [{
                    RtpDataChannels: true
                }]
            });
            pc.onicecandidate = handleIceCandidate;
            pc.onaddstream = handleRemoteStreamAdded;
            pc.onremovestream = handleRemoteStreamRemoved;

        } catch (e) {
            console.log('Failed to create PeerConnection, exception: ' + e.message);
            alert('Cannot create RTCPeerConnection object.');
            return;
        }
    }

    function getSessionDescription(message) {
        if(isFirefox){
            return new mozRTCSessionDescription(message);
        }
        else{
            return new RTCSessionDescription(message);
        }
    }

    function getIceCandidate(params) {
        if(isFirefox){
            return new mozRTCIceCandidate(params);
        }
        else{
            return new RTCIceCandidate(params);
        }
    }

    function getRTCPeerConnection(params) {
        if(isFirefox){
            return new mozRTCPeerConnection(params);
        }
        else{
            return new webkitRTCPeerConnection(params);
        }
    }


    function handleIceCandidate(event) {
        if (event.candidate) {
            sendMessage({
                type: 'candidate',
                label: event.candidate.sdpMLineIndex,
                id: event.candidate.sdpMid,
                candidate: event.candidate.candidate
            });
        } else {
            console.log('End of candidates.');
            //$('#remoteimg').hide();
            //$('#remoteVideo').show();
        }
    }

    function handleRemoteStreamAdded(event) {
        console.log('Remote stream added.');
        scopeVm.remoteVideoUrl = sce.trustAsResourceUrl(window.URL.createObjectURL(event.stream));
        //remoteVideo.src = window.URL.createObjectURL(event.stream);
        scope.$apply();
        remoteVideoStream = event.stream;
    }

    function handleCreateOfferError(event) {
        console.log('createOffer() error: ', e);
    }

    function doCall() {
        console.log('Sending offer to peer');
        pc.createOffer(setLocalAndSendMessage, handleCreateOfferError);
    }

    function doAnswer() {
        console.log('Sending answer to peer.');
        if(isFirefox) {
            pc.createAnswer(setLocalAndSendMessage, handleCreateAnswerError, sdpConstraints);
        }
        else {
            pc.createAnswer(setLocalAndSendMessage, null, sdpConstraints);
        }
    }

    function setLocalAndSendMessage(sessionDescription) {
        // Set Opus as the preferred codec in SDP if Opus is present.
        sessionDescription.sdp = preferOpus(sessionDescription.sdp);
        pc.setLocalDescription(sessionDescription);
        sendMessage(sessionDescription);
    }

    function handleCreateAnswerError(error) {
        console.log('createAnswer() error: ', e);
    }

    function requestTurn(turn_url) {
        var turnExists = false;
        for (var i in pc_config.iceServers) {
            console.log(pc_config.iceServers[i]);
            if (pc_config.iceServers[i].url.substr(0, 5) === 'turn:') {
                turnExists = true;
                turnReady = true;
                break;
            }
        }
        if (!turnExists) {
            console.log('Getting TURN server from ', turn_url);
            // No TURN server. Get one from computeengineondemand.appspot.com:
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    var turnServer = JSON.parse(xhr.responseText);
                    console.log('Got TURN server: ', turnServer);
                    pc_config.iceServers.push({
                        'url': 'turn:' + turnServer.username + '@' + turnServer.turn,
                        'credential': turnServer.password
                    });
                    turnReady = true;
                }
            };
            xhr.open('GET', turn_url, true);
            xhr.send();
        }
    }

    /*function handleRemoteStreamAdded(event) {
        console.log('Remote stream added.');
        remoteVideo.src = window.URL.createObjectURL(event.stream);
        remoteVideoStream = event.stream;
    }*/

    function handleRemoteStreamRemoved(event) {
        console.log('Remote stream removed. Event: ', event);
    }



    function handleRemoteHangup() {
        //  console.log('Session terminated.');
        // stop();
        // isInitiator = false;
    }



    // Set Opus as the default audio codec if it's present.
    function preferOpus(sdp) {
        var sdpLines = sdp.split('\r\n');
        var mLineIndex;
        // Search for m line.
        for (var i = 0; i < sdpLines.length; i++) {
            if (sdpLines[i].search('m=audio') !== -1) {
                mLineIndex = i;
                break;
            }
        }
        if (mLineIndex === null) {
            return sdp;
        }

        // If Opus is available, set it as the default in m line.
        for (i = 0; i < sdpLines.length; i++) {
            if (sdpLines[i].search('opus/48000') !== -1) {
                var opusPayload = extractSdp(sdpLines[i], /:(\d+) opus\/48000/i);
                if (opusPayload) {
                    sdpLines[mLineIndex] = setDefaultCodec(sdpLines[mLineIndex], opusPayload);
                }
                break;
            }
        }

        // Remove CN in m line and sdp.
        sdpLines = removeCN(sdpLines, mLineIndex);

        sdp = sdpLines.join('\r\n');
        return sdp;
    }

    function extractSdp(sdpLine, pattern) {
        var result = sdpLine.match(pattern);
        return result && result.length === 2 ? result[1] : null;
    }

    // Set the selected codec to the first in m line.
    function setDefaultCodec(mLine, payload) {
        var elements = mLine.split(' ');
        var newLine = [];
        var index = 0;
        for (var i = 0; i < elements.length; i++) {
            if (index === 3) { // Format of media starts from the fourth.
                newLine[index++] = payload; // Put target payload to the first.
            }
            if (elements[i] !== payload) {
                newLine[index++] = elements[i];
            }
        }
        return newLine.join(' ');
    }

    // Strip CN from sdp before CN constraints is ready.
    function removeCN(sdpLines, mLineIndex) {
        var mLineElements = sdpLines[mLineIndex].split(' ');
        // Scan from end for the convenience of removing an item.
        for (var i = sdpLines.length - 1; i >= 0; i--) {
            var payload = extractSdp(sdpLines[i], /a=rtpmap:(\d+) CN\/\d+/i);
            if (payload) {
                var cnPos = mLineElements.indexOf(payload);
                if (cnPos !== -1) {
                    // Remove CN payload from m line.
                    mLineElements.splice(cnPos, 1);
                }
                // Remove CN line in sdp
                sdpLines.splice(i, 1);
            }
        }

        sdpLines[mLineIndex] = mLineElements.join(' ');
        return sdpLines;
    }


})(window, window.angular);