/**
 * Created by TK on 15/02/2016.
 */
//var CronJobManager = require('cron-job-manager');
var CronJob = require('cron').CronJob;
var socket = require('../module/socket_server');

//var GameUpdate = mongoose.model('GameUpdate');
var questionProvider = require('../model-provider/questions');
var util = require('../util/util');

var updateGame = require('../model-provider/gameUpdate');
var Entry = require('../model-provider/entry-provider');


var cronServer = {};


/***used to test for cron jobs*****/
var count = 1;
var roundCount = 1;
var phaseCount = 1;
var maxPhase = 1;
var isLastPhase = false;
var isLastRound = false;

cronServer.init = function(server, sessionStore, myCookieParser){

    console.log("cron initialised called");
    socket.init(server, sessionStore, myCookieParser);

    this.jobsInit();

};

var roundTaskHandler = function(){
    isLastPhase = false;
    isLastRound = false;
    var self = cronServer;
    var type = "gameA";//////for mocking test
    if(roundCount <= 3){
        console.log("starting round job" + roundCount);
        console.log("round count <= 3");
        console.log(roundCount);
        console.log(phaseCount);

        questionProvider.getRoundQuestion(1, function(err , docs){

            console.log("got question");
            console.log(err);
            console.log(docs);
            var options = {
                timeRem : 15
            };
            console.log(new Date().setMonth(-1));
            cronServer.timeSent = Date.now();
            console.log("question sent time : " + cronServer.timeSent);

            console.log("got " + docs + " question");



            var question = [];
            var type;
            socket.emitCurrentPhase(phaseCount);
            docs.forEach(function(questData, index){
                if(index == 0){
                    if(phaseCount == 1)
                        type = 'typeA';
                    else
                        type = generateType(phaseCount, "typeA");

                    console.log('emitting quest to type ' + type);
                    //console.log(docs[i]);

                    socket.emitGeneralQuestion(type, questData, {time : 30, round : roundCount , phase : phaseCount});
                    question.push(
                        {
                            type : type,
                            questionId : questData._id
                        }
                    )

                }else if(index == 1){
                    //var type;
                    if(phaseCount == 1)
                        type = 'typeB';
                    else
                        type = generateType(phaseCount, "typeB");
                    console.log(type +' quest');
                    //console.log(docs[i]);
                    socket.emitGeneralQuestion(type, questData, {time : 30, round : roundCount , phase : phaseCount});
                    question.push(
                        {
                            type : type,
                            questionId : questData._id
                        }
                    )
                }else if(index == 2){
                    //var type;
                    if(phaseCount == 1)
                        type = 'typeC';
                    else
                        type = generateType(phaseCount, "typeC");

                    console.log(type +' quest');
                    //console.log(docs[i]);
                    socket.emitGeneralQuestion(type, questData, {time : 30, round : roundCount , phase : phaseCount});

                    question.push(
                        {
                            type : type,
                            questionId : questData._id
                        }
                    )
                }
            });


            var updateData = {
                phase : phaseCount,
                round : roundCount,
                timeAsked : cronServer.timeSent,
                question : question
            };
            console.log(updateData);

            /// update the gameUpdate document
            updateGame.updateGame(updateData, function(done, updated){
                if(done){
                    console.log('updated done');

                } else{
                    console.log(updated);
                }
            });

            //socket.emitQuestion(type, question);


            if(roundCount == 3){


                console.log("round == 3 stoping task");
                isLastRound = true;
                cronServer.roundTaskManager.stop();
                roundCount = 1;//initialized back
                phaseCount++;//increament the phase here
            }else{

                roundCount++;
            }

        });


    }else{
        console.log("round count >= 3");
        console.log(roundCount);
        //this.roundTaskManager.stop('roundTask');
        cronServer.roundTaskManager.stop();

        //this.roundTaskManager.deleteJob('roundTask');//don't delete
        roundCount = 1;//initialized back
        phaseCount++;//increament the phase here

    }
};

var phaseTaskHandler = function(){
    var self = cronServer;

    if (phaseCount <= maxPhase) {

        if(isLastRound){
            socket.runLastRoundTask("socket got last round", phaseCount);

            console.log('calculating game winners....');
        }

        socket.setCurrentPhase(phaseCount);

        console.log("phascecount <= 1");
        console.log('phase count' + phaseCount);
        console.log('round ' + roundCount);
        self.roundTaskManager.start();



    }else{
        socket.runLastGameTask(maxPhase);
        console.log("phasecount > 1");
        console.log('phase count' + phaseCount);
        console.log('round ' + roundCount);
        self.phaseTaskManager.stop();
        phaseCount = 1; //initialized back
        roundCount = 1;
    }
};

var dailyTaskHandler = function(){
    var timeToStart = 3 * 60; //convert to second with delay of 2 seconds
    socket.emitGameStart(timeToStart);
    console.log('running cron job' + count);


    var currentDate = util.getCurrentDadteString();

    if(cronServer.gameDateStart == null || cronServer.gameTimeStart == null){
        cronServer.gameTimeStart = new Date().setHours(12, 18);
        cronServer.gameDateStart = currentDate;
    }///try to store this in the db for admin to be able to manipulate

    console.log("start time : " + cronServer.gameTimeStart);

    var updateData = {
        gameTimeStart : cronServer.gameTimeStart,
        start : true
    };

    //get the total entry for the day
    Entry.getTotalEntry(function(done, totalEntry){
       if(done){
           var totalEntry = totalEntry;
           console.log('total entry of ' + totalEntry);
           maxPhase = generateMaxPhase(totalEntry);
           updateGame.createGameUpdate(updateData, function(done, update){
               if(done){
                   //game update created
                   console.log(update);
                   socket.maxPhase = maxPhase;
               } else{
                   //game update not created
               }
           });
       }   else {
           console.log('unable to get total entry');
       }
    });


    var self = cronServer;
    self.phaseTaskManager.start();
    if(count == 3){
        self.roundTaskManager.stop();
        self.phaseTaskManager.stop();
        this.dailyTaskManager.stop();
        phaseCount = 1;
        roundCount = 1;

    }
};

function generateType(phase, type){

    if(phase > 1){
        return "phase"+ phase + type;
    }else{
        return type;
    }

}

function generateMaxPhase(totalEntry){
    if(totalEntry <= 999){
        return 2;
    }else if(totalEntry <= 9999){
        return 3;
    }else if(totalEntry <= 99999){
        return 4;
    }else if(totalEntry <= 999999){
        return 5;
    }else if(totalEntry <= 9999999){
        return 6;
    }else if(totalEntry <= 99999999){
        return 7;
    }else if(totalEntry <= 999999999){
        return 8;
    }else if(totalEntry <= 9999999999){
        return 9;
    }else{
        return 10;
    }
}
cronServer.validateNextPhaseUsers = function(){


};

cronServer.getPhase = function(){
    return phaseCount;
};
cronServer.getRound = function(){
    return roundCount;
};

cronServer.isLastRoundActive = function(round){
    console.log('got round' + round);
    return isLastRound;
};

cronServer.updateEarned = function(){
    console.log("updating earned called...");
};

cronServer.dailyTaskManager = new CronJob({
    cronTime : '00 59 05 * * 0-6',
    onTick : dailyTaskHandler,
    start: true,
    onComplete: function(){
        console.log('daily cron job finished suddenly');
    },
    timeZone: "West Central Africa"


});

cronServer.phaseTaskManager = new CronJob({
    cronTime : '0 */2 * * * *',
    onTick : phaseTaskHandler,
    start:false,
    onComplete : function() {
        console.log('Phase completed');
        cronServer.roundTaskManager.stop();
        phaseCount = 0;//initialized back
        roundCount = 0;//initialized back
   }
});

cronServer.roundTaskManager = new CronJob({
    cronTime : '0 */1 * * * *',
    onTick : roundTaskHandler,
    start : false,
    onComplete : function(){
        console.log("round completed" +  roundCount);
    }
});

cronServer.jobsInit = function(){


};


module.exports = cronServer;
