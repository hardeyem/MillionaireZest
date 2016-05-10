/**
 * Created by TK on 13/02/2016.
 */

(function (window, angular) {
    'use strict';
    var jq = jQuery;

    var gameIO;
    var scope;
    var rootScope;
    var dns = 'ws://ec2-52-24-83-81.us-west-2.compute.amazonaws.com';
    angular
        .module('MZApp.ggame')
        .controller('GameBoardCtrl', ['$state', '$rootScope', '$scope', '$location', 'Authentication','Entry','CommentSvc',
            function ($state, $rootScope,  $scope, $location, Authentication, Entry, CommentSvc) {
                var vm  = this;
                //window.alert('welcome dash');
                $scope.user = "Adeyemi";
                scope = $scope;
                rootScope = $rootScope;
                //$rootScope.token = Authentication.getToken();
                var token = Authentication.getToken();
                vm.gameType = "none";
                vm.point = '0000';
                vm.earnToday = '0.00';
                vm.lastEarned = '0.00';
                vm.entryFee = '0.00';
                vm.phase = '0';
                vm.round = '0';

                vm.remTime = '0';
                vm.question = "Questions are provided here";
                vm.questionId = '';
                vm.option = {};
                vm.option.a = "Option a is found here";
                vm.option.b = "Option b is found here";
                vm.option.c = "Option c is found here";
                vm.option.d = "Option d is found here";

                vm.optBtn = false;

                //$rootScope.token = token;

                CommentSvc.loadComments().success(function(res){
                    console.log(res);
                    vm.comments = res.comments;
                }).error(function(){
                    console.log('error retrieving people talk');
                });

                //attach dns on production
                var commentIO = io.connect('/comment',{
                    'query': 'token=' + token
                });
                commentIO.on('connect', function(){
                    console.log('connected to commet IIO');
                });

                //attach dns on production
                var generalIO = io.connect('/mq', {
                    'query' : 'token=' + token
                });
                generalIO.on('connect', function(data){
                    console.log('connected to general socket');
                });
                jq('.new-comment').on('keydown', function(event){
                    //console.log(event);
                    if(event.keyCode == 13 || event.which == 13){
                        console.log('commenting...');
                        var commentData = {
                            comment : jq(this).text()
                        };
                        console.log(commentData);

                        commentIO.emit('game:comment', commentData);

                        jq(this).text('');
                        return true;
                    }

                });

                commentIO.on('game:newComment', function(data){
                    //console.log(data);
                    //make sure we have the details of the user
                    var newComment = {
                        comment : data.comment,
                        lastName : vm.user
                    };
                    console.log(newComment);

                    vm.comments.push(newComment);

                    if(!("Notification" in window)){
                        alert("broswernot support notification");
                        console.log("broswernot support notification");
                    }else if(Notification.permission === "granted"){
                        console.log("notification granted");
                        var notification = new Notification("Sending new nootification");
                    }else if(Notification.permission == 'denied'){
                        console.log("notification denied");
                        Notification.requestPermission(function(permission){
                            if(!('permission' in Notification)){
                                Notification.permission = permission;
                            }
                            if(permission == "granted"){
                                console.log("permisison granted");
                                var notification = new Notification("Sending new nootification");
                            }
                        })
                    }
                    if(!$rootScope.$digest())
                        $scope.$apply();
                });

                vm.answer = function(opt){
                    console.log('user answer quest');
                    vm.optBtn = false;
                    //$scope.$apply();
                    if(remCounter.timer)
                        remCounter.stopTimer();
                    var data = {
                        questId : vm.questionId,
                        answer : opt,
                        round : parseInt(vm.round),
                        phase : parseInt(vm.phase)

                    };
                    console.log(data);
                    gameIO.emit('game:answer', data);


                };
                //sliding();
                carousel();
                handleEntry(token, Entry, vm);

                generalIO.on('game:Phase' , function(data){
                   console.log('current phase is ' + data.currentPhase);
                    var phase = 1;
                    var phaseTBody = jq('table.current-phase').find('tbody');
                    if(phase == 1){
                        var tr = phaseTBody.find('tr:last');
                        var labelCell = tr.find('td').eq(1);
                        labelCell.empty();
                        labelCell.append('<i class="material-icons">label_outline</i>');
                    }else if(phase > 1){
                        //get the less part
                        for(var i = 1; i > 8; i++){
                            var tr = phaseTBody.find('tr').eq(i);
                            tr.find('td').eq(1).empty();


                            if(i > phase){
                                tr.find('td').eq(1).append('<i class="material-icons">trending_flat</i>');
                            }else if(i == phase){
                                curTr.find('td').eq(1).append('<i class="material-icons">label</i>');
                            }else{
                                tr.find('td').eq(1).append('<i class="material-icons">label_outline</i>');
                            }
                        }

                    }
                });
            }
        ]);

    function handleEntry(token, Entry, vm){
        Entry.getEntryDetail().error(function(err){

        }).then(function(){
            vm.gameType = Entry.getEntryType();
            vm.entryFee = 1.00;
            //scope.$apply();
            //var entryType = Entry.getEntryType();
            //handleEntry(Entry);
            //make sure the entry type is gotten before connecting to game;
            handleGameSocket(vm, token , vm.gameType);
        });
    }

    String.prototype.capitalizeFirstLetter = function(){
        return this.charAt(0).toUpperCase() + this.slice(1);
    };

    function handleGameSocket(vm, token, entryType){
        //connect with socket with your token for validation at the server side

        var gameType = 'game'+ entryType.capitalizeFirstLetter();
        console.log("connecting to game type : " + gameType);
        //attach dns on production
        gameIO = io.connect('/' + gameType,{
            'query': 'token=' + token
        });

        gameIO.on('connect', function(socket){
            console.log("connected to socket with " + gameType);

            /*socket.on('authenticated', function () {
                    //do other things
                gameIO.emit("user:gameEntered",{});
                }).emit('authenticate', {token: token}); //send the jwt
*/
        });
        gameIO.on("error", function(error) {
            if (error.type == "UnauthorizedError" || error.code == "invalid_token") {
                // redirect user to login page perhaps?
                console.log("User's token has expired");
                window.alert("You have no valid session relogin to continue");
                window.location = '/access';
            }
        });

        gameIO.on('game,deny', function(data){
            console.log('receive deny emit');
            console.log(data);
        });

        gameIO.on('game:error', function(data){
            console.log('receive game error');
            console.log(data);
        });

        gameIO.on('game:validateAnswer', function(data){
            console.log('receive validate answer');
            console.log(data);

            var userOpt, correctOpt, nextTime;

            nextTime = Math.round(data.nextTime);
            correctOpt = data.correctOpt;
            userOpt = data.userOpt;
            vm.point = data.totalPoint;
            //scope.$apply();

            if(data.isCorrect){
                if(correctOpt == userOpt) {
                    console.log('correct!!!');
                    jq('.quest-btn').find('button[data-opt="' + correctOpt + '"]').addClass('correct');



                }
            }else{
                console.log('wrong!!!');
                jq('.quest-btn').find('button[data-opt="'+correctOpt+'"]').addClass('correct');
                jq('.quest-btn').find('button[data-opt="'+userOpt+'"]').addClass('wrong');

            }

            if(startTimeCounter.timer)
                startTimeCounter.stopTimer();
            startTimeCounter.startTimer(nextTime);

            if(!rootScope.$digest())
                scope.$apply();
        });

        gameIO.on('game:userUpdate', function(data){
            console.log('receive validate answer');
            console.log(data);

        });

        gameIO.on('system:game-start', function(data){
            console.log('game started');
            console.log(data);
            if(data.starting){
                var timeToStart = data.timeToStart;
                startTimeCounter.startTimer(timeToStart);
            }
        });

        gameIO.on('game:question', function(data){
            console.log("got question");
            console.log(data);
            var questionData = data.question;
            var options = data.options;
            updateQuestionView(vm, questionData, options);
        });

        gameIO.on('game:earned', function(data){
            console.log(data);
            vm.earnToday = data.total_earned;
            vm.lastEarned = data.last_earned;
            vm.point = data.total_point;
            if(!rootScope.$digest())
                scope.$apply();
        });

        gameIO.on('game:lastRound', function(data){
            gameIO.emit('user:gameMove', data);
        });

        //scope.$apply();
    }

    function updateQuestionView(vm, questionData, options){
        var questBtn = jq('div.quest-btn');

       /* var optionAV = jq('span.quest-opt').eq(0);
        var optionBV = jq('span.quest-opt').eq(1);
        var optionCV = jq('span.quest-opt').eq(2);
        var optionDV = jq('span.quest-opt').eq(3);

        var remView = jq('rem-time > span.time-counter');
        var startView = jq('start-time > span.time-counter');
        var roundView = jq('round > span.time-counter');
        var phaseView = jq('phase > span.time-counter');*/

        //get the question id
        //questView.data('id',questionData._id);
        vm.questionId = questionData._id;
        vm.questionTime = questionData.time;

        //gameIO question
        vm.question = questionData.question;
        //questView.text(questionData.question);

        //gameIO options
        vm.option.a = questionData.options.a;
        vm.option.b = questionData.options.b;
        vm.option.c = questionData.options.c;
        vm.option.d = questionData.options.d;
        /*optionAV.text(questionData.options.a);
        optionBV.text(questionData.options.b);
        optionCV.text(questionData.options.c);
        optionDV.text(questionData.options.d);*/

        //update roundView
        vm.round = options.round;
        vm.phase = options.phase;

        jq('.quest-btn').find('button').removeClass('correct', 'wrong');
        vm.optBtn = true;

        console.log(options.time);
        remCounter.startTimer(options.time, vm);
        if(!rootScope.$digest())
            scope.$apply();

        //questBtn.find('button').attr('disabled', false);
        //roundView.text(options.round);
        //update phaseView
        //phaseView.text(options.phase);
    }
    var remCounter = {};

    remCounter.startTimer = function(time, vm){

        var timeCount = time - 1;
        remCounter.timer = setInterval(function(){
            if(timeCount == 0){
                remCounter.stopTimer();
                vm.optBtn = false;
                clearInterval(remCounter.timer);
            }else{
                jq('div.rem-time').find('span.time-counter').text(timeCount);
                //vm.remTime = timeCount;
                //scope.$apply();
                timeCount--;
            }
        },1000);
    };

    remCounter.stopTimer = function(){
        clearInterval(remCounter.timer);
    };

    var startTimeCounter = {};
    startTimeCounter.startTimer = function(startTime){
        var startView= jq('div.start-time');
        var counterView = startView.find('span.time-counter'),
            modeView = startView.find('span.time-mode');

        var timeCount = startTime - 2;
        startTimeCounter.timer = setInterval(function(){
            var timeObj  = calculateTime(timeCount);
            //console.log(counterView);
            counterView.text(timeObj.time);
            modeView.text(timeObj.mode);


            if(timeCount < 1){
                //clearInterval(startTimeCounter.startTimer);
                clearInterval(startTimeCounter.timer);
                //startTimeCounter.stopTimer();
            }else{
                timeCount--;

            }
        }, 1000);
    };
    startTimeCounter.stopTimer = function(){
        if(startTimeCounter.timer)
            clearInterval(startTimeCounter.timer);
    };

    function updateTimeStartView(timeToStart){
        var startView= jq('div.start-time');
        var counterView = startView.find('span.time-counter'),
            modeView = startView.find('span.time-mode');

        var timeCount = timeToStart - 2;
        var startTimer = setInterval(function(){
            //console.log("time count" + timeCount);
            var timeObj  = calculateTime(timeCount);
            //console.log(counterView);
            counterView.text(timeObj.time);
            modeView.text(timeObj.mode);


            if(timeCount < 1){
                clearInterval(startTimer);
            }else{
                timeCount--;

            }

        }, 1000);

    }



    function calculateTime(timeParam){
        //console.log("got time" + timeParam);
        var timeSet = timeParam / 60;
        var mode, time;
        if( timeSet < 1 ){
            time = timeParam;
            //console.log("time rem : " + time);
            mode = "sec";
            //ok it is a seconds time
        }else {
            mode = "mins";
            var timeRem = timeParam % 60;
            //it is a minute time let the view know what to render
            if(timeRem == 0){
                time = timeSet + ":00";
            }else {
                time = Math.floor(timeSet)+":" + timeRem;
            }

        }

        //console.log("returning " + time + " : " + mode);
        return {time : time , mode : mode};
    }


    function carousel(){
        var carousel = jq(".carousel > ul");
        var firstLi = carousel.children("li:first");
        var lastLi = carousel.children("li:last");
        var t = setInterval(function(){
            jq(".carousel ul").animate({marginLeft : -200}, 1000, function(){
                var last = jq(this).children("li:last");
                var first = jq(this).children("li:first");
                //var noOfChild = jq(this).find("li").eq();
                //con sole.log('no of child : ' + noOfChild);
                //console.log(last);
                //console.log(first);
                //if(jq(this).css('marginLeft') == )
                jq(this).css({marginLeft: 0});
                last.after(first);
                //console.log(last);

            })
        }, 5000);
    }


    function sliding(){

        var slider = jq('.slider');
        var slide = 'li';
        var transTime = 1000;
        var timeBtwSlide = 5000;
        function slides(){return slider.children(slide)}

        slides().fadeOut();
        //set active classes
        slides().first().addClass('active-slide');
        slides().first().fadeIn(transTime);
        //auto scroll
        var interval = setInterval(function(){
            var i = slider.find(slide+'.active-slide').index();
            slides().eq(i).removeClass('active-slide');
            slides().eq(i).fadeOut(transTime);
            if(slides().length == i+1)i=-1;//looop start
            slides().eq(i+1).fadeIn(transTime);
            slides().eq(i+1).addClass('active-slide');
        }, transTime + timeBtwSlide);

    };


})(window, window.angular);