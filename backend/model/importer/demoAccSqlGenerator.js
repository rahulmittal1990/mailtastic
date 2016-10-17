/**
 * Generted dummy data to show to potential customers
 * @type type
 */


var fs = require("fs");

//ids for mailtastic demo account
//var userIds = [
//     'bb185dbc-2304-4783-9d5c-11e9d5322e59',        //admin
//     '838999b8-e7f2-4ed2-abc2-e1c5ce126ad0',
//     'a283813e-de9d-4fa3-9b22-5d4aec7de67a',
//     'c66cbb82-78bc-4271-b926-2e3c0c6633c7',
//     'cac0a7f3-1ab2-4117-b6d1-5131836fc5f7'
//];
//
//var groups = [
//    131,
//    131,
//    132,
//    130,
//    134,
//    134,
//    134
//];
//
//var campaigns = [
//    100,  
//    100,
//    //101,//wurde gelöscht
//    102,
//    102,
//    102
//];




//Ids for retarus presentation

var userIds = [
    '58869d2a-76e8-412e-8d05-f8b47dd06f77',
    '3af33dd6-bcae-48f1-afed-ccf6f0492016',
    '33da11b7-0211-48b7-8aaf-9fc5bf0dbb81',
    '33d13d91-2190-49e6-b1fb-22d34932df5f',
    '2759c10e-9370-417f-b7fb-9330c366d9b6',
    '1f78e41d-bf7d-4ff1-ba28-633dc47b919a',
    '11906976-532a-40e9-8160-4ce0f3a73402'
];

var groups = [
    17,
    18,
    19,
    20,
    21
];

var campaigns = [
    19,  
    20,
    21,
    22
];


var viewQuery = "INSERT INTO `Click`(`userId`, `groupId`, `campaignId`, `createdAt`) VALUES ($USER$,$GROUP$,$CAMPAIGN$,DATE(NOW()-INTERVAL $DAY$ DAY));";
var clickQuery = "INSERT INTO `View`(`userId`, `groupId`, `campaignId`, `createdAt`) VALUES ($USER$,$GROUP$,$CAMPAIGN$,DATE(NOW()-INTERVAL $DAY$ DAY));";

var amountOfViews  = 201456;
var amountOfClicks = 2318;

var completeTextFile = "";
//generate clickQuery 
for(var i = 0; i < amountOfClicks; i++){
    var user = userIds[randomInt(0, userIds.length)];
    var group = groups[randomInt(0, groups.length)];
    var campaign = campaigns[randomInt(0, campaigns.length)];
    //var days = randomInt(0, 31);
    
    var days = randomInt(0, 200);   //über die letzten 200 Tage verteilen
    
    var tmpQuery = "INSERT INTO `Click`(`userId`, `groupId`, `campaignId`, `createdAt`) VALUES ('" + user + "'," + group + "," +campaign + ",DATE(NOW()-INTERVAL "+days + " DAY));";
//    console.log(tmpQuery);
    completeTextFile+=tmpQuery;
}

//generate writeStream
var wstream = fs.createWriteStream('liveDemoViewsClicks.sql');


//generate viewQuery 
for(var i = 0; i < amountOfViews; i++){
    var user = userIds[randomInt(0, userIds.length)];
    var group = groups[randomInt(0, groups.length)];
    var campaign = campaigns[randomInt(0, campaigns.length)];
    //var days = randomInt(0, 31);
    
    var days = randomInt(0, 200);   //über die letzten 200 Tage verteilen
    
    var tmpQuery = "INSERT INTO `View`(`userId`, `groupId`, `campaignId`, `createdAt`) VALUES ('" + user + "'," + group + "," +campaign + ",DATE(NOW()-INTERVAL "+days + " DAY));";
//    console.log(tmpQuery);
    //completeTextFile+=tmpQuery;
    
    
    
    wstream.write(tmpQuery);
    
}
wstream.end();  //close stream

//    fs.writeFile('liveDemoViewsClicks.sql', completeTextFile, function (err) {
//        if (err) throw err;
//        console.log("Datei wurde erzeugt.");
//      
//    });





function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}