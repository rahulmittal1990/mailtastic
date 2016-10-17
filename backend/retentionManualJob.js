/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//dependencies
Sequelize =  require('sequelize');
var db = require('./model/db');	
var emailHandler = require('./helpers/mailhandler');



//LOGGING
require( "console-stamp" )( console, {
    metadata: function () {
        return ("[" + process.memoryUsage().rss + "]");
    },
    colors: {
        stamp: "yellow",
        label: "white",
        metadata: "green"
    }
} );

//
////job creation
//var CronJob = require('cron').CronJob;
//
////Retention Cronjob
//new CronJob('00 00 10 * * *', function() {
//    console.log('Retentionmail check');
//    checkForRetentionMails();
//}, function(){
//    console.error("Retention Cronjob stopped");
//}, true);
//
//try {
//    new CronJob('* * * * * *', function() {
//        console.log('Retentionmail Checker Running');
//        //checkForRetentionMails();
//    });
//} catch(ex) {
//    console.error("Retentionmail Cronjob not valid");
//}

//all retention functions
 var retentions = [];

function day1WelcomeMail(){
 sequelize.query("SELECT u.email, u.firstname"
            + " FROM `User` u where isAdmin=1"
            +" AND"
            +" DATE(createdAt) = DATE_SUB(CURDATE(), INTERVAL 1 DAY)",
            {type: sequelize.QueryTypes.SELECT})
                .then(function (users) {
                    console.error("Retention: Welcome Mail: " + JSON.stringify(users));
                    for(var i = 0; i < users.length ; i++){
                        emailHandler.sendRetentionMail(users[i], "./templates/triggermails/1dayWelcomeMail/html.html", "Ihr Start mit Mailtastic");
                    }
                }, function(err){
                        console.error("Retention mail query failure: noCampaignAfter3Days: " + err);
                });
            

}
retentions.push(day1WelcomeMail); //hinzufügen zu den retention tests

function noCampaignAfter3Days(){
    sequelize.query("SELECT u.email, u.firstname"
            + " FROM `User` u where isAdmin=1"
            +" AND"
            +" DATE(createdAt) = DATE_SUB(CURDATE(), INTERVAL 3 DAY)"
            +" AND" 
            +" (select count(*) from Campaign where owner=u.id) = 0",
            {type: sequelize.QueryTypes.SELECT})
                .then(function (users) {
                    console.error("Retention: No Campaign After 3 Days: " + JSON.stringify(users));
                    for(var i = 0; i < users.length ; i++){
                        emailHandler.sendRetentionMail(users[i], "./templates/triggermails/3daysNoCampaign/html.html", "Kampagne erstellen ");
                    }
                }, function(err){
                        console.error("Retention mail query failure: noCampaignAfter3Days: " + err);
                });
            
}
retentions.push(noCampaignAfter3Days); //hinzufügen zu den retention tests

function noEmpsAfter7Days(){
    sequelize.query("SELECT u.email, u.firstname"
            + " FROM `User` u where isAdmin=1"
            +" AND"
            +" DATE(createdAt) = DATE_SUB(CURDATE(), INTERVAL 7 DAY)"
            +" AND" 
            +" (select count(*) from User where admin=u.id) = 0",
            {type: sequelize.QueryTypes.SELECT})
                .then(function (users) {
                    console.error("Retention: No Emps After 7 Days: " + JSON.stringify(users));
                    for(var i = 0; i < users.length ; i++){
                           emailHandler.sendRetentionMail(users[i], "./templates/triggermails/7daysNoEmps/html.html", "Bessere Ergebnisse");
                    }

                }, function(err){
                    console.error("Retention mail query failure: noEmpsAfter7Days: " + err);
                });
   
}
retentions.push(noEmpsAfter7Days); //hinzufügen zu den retention tests

function noGroupAfter10Days(){
    sequelize.query("SELECT u.email, u.firstname"
            +" FROM `User` u where isAdmin=1"
            +" AND"
            +" DATE(createdAt) = DATE_SUB(CURDATE(), INTERVAL 10 DAY)"
            +" AND" 
            +" (select count(*) from Groups where owner=u.id) = 1",
            {type: sequelize.QueryTypes.SELECT})
                .then(function (users) {
                     console.error("Retention: No Group After 10 Days: " + JSON.stringify(users));
                     for(var i = 0; i < users.length ; i++){
                           emailHandler.sendRetentionMail(users[i], "./templates/triggermails/10daysNoGroup/html.html", "Mitarbeiter organisieren");
                    }
                }, function(err){
                    console.error("Retention mail query failure: noGroupAfter10Days: " + err);
                });
   
}
retentions.push(noGroupAfter10Days); //hinzufügen zu den retention tests


function noCampaignActiveAfter14Days(){
    sequelize.query("SELECT u.email, u.firstname"
            + " FROM `User` u where isAdmin=1"
            +" AND"
            +" DATE(createdAt) = DATE_SUB(CURDATE(), INTERVAL 14 DAY)"
            +" AND" 
            +" (select count(*) from Campaign where owner = u.id) > 0"
             +" AND" 
            +" (select count(*) from User where admin = u.id) > 0"
            +" AND" 
            +" (select count(*) from Campaign where id IN (SELECT activeCampaign from Groups where owner = u.id)) = 0",
            {type: sequelize.QueryTypes.SELECT})
                .then(function (users) {
                    console.error("Retention: No Campaign Active After 14 Days: " + JSON.stringify(users));
                    for(var i = 0; i < users.length ; i++){
                           emailHandler.sendRetentionMail(users[i], "./templates/triggermails/14daysNoActiveCampaign/html.html", "Kampagne anzeigen lassen");
                    }

                }, function(err){
                    console.error("Retention mail query failure: noCampaignActiveAfter14Days: " + err);
                });
   
}
retentions.push(noCampaignActiveAfter14Days); //hinzufügen zu den retention tests
/**
 * Wird versendet wenn die Trial ended
 * @returns {undefined}
 */
function trialEnded(){
 sequelize.query("SELECT u.email, u.firstname"
            + " FROM `User` u where isAdmin=1"
            +" AND"
            +" forceAllow = 0 "
            +" AND "
            +" ISNULL(isaacCustomerNumber) "
            +" AND"
            +" DATE(createdAt) = DATE_SUB(CURDATE(), INTERVAL 14 DAY)",
            {type: sequelize.QueryTypes.SELECT})
                .then(function (users) {
                    console.error("Retention: trialEnded: " + JSON.stringify(users));
                    for(var i = 0; i < users.length ; i++){
                        emailHandler.sendRetentionMail(users[i], "./templates/triggermails/trialended/html.html", "Ihre Mailtastic-Trial endet heute");
                    }
                }, function(err){
                        console.error("Retention mail query failure: trialEnds: " + err);
                });
            

}
retentions.push(trialEnded); //hinzufügen zu den retention tests


/*
 * Executes all retention functions
 */
function checkForRetentionMails(){
    console.log("Length of Retention Checks: " + retentions.length);
    for(var  i = 0 ; i < retentions.length ; i++){
        try{
            retentions[i]();
        }catch(ex){
            console.error("Retention mail failure. There was no function at index: " + i);
        }
    }
}

 checkForRetentionMails();