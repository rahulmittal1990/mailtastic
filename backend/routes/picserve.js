var express = require('express');
var router = express.Router();
var url = require('url');
var mongoose = require('mongoose'), //mongo connection
        bodyParser = require('body-parser'), //parses information from POST
        methodOverride = require('method-override'); //used to manipulate POST
var fs = require("fs");
var accountHelper = require('../helpers/accounthelper');
var helpers = require('../helpers/helperfunctions');
var $q = require('q');
var moment = require('moment');
var config = require('../config/config.js');



/* GET users listing. */
router.get('/neu/:userId', function (req, res, next) {
    //console.log('Request Cookies: ', req.cookies)
    //res.cookie('mailtasticsession', '2000', {httpOnly: true });


    //get user id on parse url

    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    

    if (!req.params.userId) {
        console.error("User id wurde nicht übergeben");
        res.status(404);
        res.end();
    } else {

        //check if user is allowed to (paid, testaccount, etc)
        accountHelper.checkIfAccountActive(req.params.userId).then(function (data) {
            if (data === true) {      //acount is active thus serve image

                //determine if outlook link
                var serveOutlookImage = req.query.m;
                if (serveOutlookImage === "o") {
                    serveOutlookImage = true;

                } else {
                    serveOutlookImage = false;
                }
                
                //which dummy image is used? When it is outlook then the big one 700x210px  ->otherwise 1x1px
                var dummyImagePath = "public/images/dummy.png";
                //determine dummy image
                if(serveOutlookImage == true){
                    dummyImagePath = "public/images/common/trackingpixel/mailtastic.png";
                }
                
                

                //get user id
                var userId = req.params.userId;

                //get active campaign for user
                var query = "SELECT g.id as groupId, c.id as campaignId, c.image  from Groups g join Campaign c on g.activeCampaign = c.id  where g.id = (select currentGroup from User where id = :userId)";

                sequelize.query(query, {replacements: {userId: userId}, type: sequelize.QueryTypes.SELECT}).then(function (result) {
                    //TODO send 404
                    if (!result || !Array.isArray(result) || result.length == 0) {
                        // res.end("NOT FOUND");
                        helpers.imageTransformation.serveImage(dummyImagePath, res);
//                        console.error("User konnte keiner Kampagne zugeordnet werden - UserId :" + userId);
                        return;
                    }
                    var viewmodel = {
                        userId: userId,
                        campaignId: result[0].campaignId,
                        groupId: result[0].groupId
                    };

                    //User ist keiner Kampagne zu geordnet oder es fehlen andere Dinge
                    if (!viewmodel.userId || !viewmodel.campaignId || !viewmodel.groupId || !result[0].image) {
//                res.end("NOT FOUND");
                        console.error(JSON.stringify(viewmodel)); 
                        helpers.imageTransformation.serveImage(dummyImagePath, res);

                    } else {

                        //get image name
                        var imagename = result[0].image.substr(result[0].image.lastIndexOf('/') + 1);

                        //wenn es sich um einen outlook link handelt wird das outlook bild angezeigt
                        if (serveOutlookImage === true) {
                            //transform to transparent image name
                            var name = imagename.substr(0, imagename.lastIndexOf('.'));
                            //check if is gif
                            if(imagename.indexOf(".gif") > -1){
                                 imagename = name + "_outlook" + ".gif";
                            }else{
                                  imagename = name + "_outlook" + ".png";
                            }
                            
                           
                        }

                        //build path for reading image
                        var imagepath = "public/images/" + imagename;
                        var referer = req.headers.referer;
                        
//                        console.error("Ref: " + req.headers.referer);
//                        console.error("Origin: " + req.headers.origin);
                        if (referer === (config.webapphost + "/") ) {		//installation page asks for pic so dont increment view count
//                            console.log("Serve image from mailtastic");
                            helpers.imageTransformation.serveImage(imagepath, res);
                        } else {
//                            console.log("Serve image from outside: " + referer + "!= " + (config.webapphost + "/"));
                            //create new View Entry
                            
                            
                            
                             var track = req.query.track;
                             if(track !== "n"){
                            
                                View.create(viewmodel).then(function (created) {
                                    //get image name
                                    //TODO send 404
                                    if (!result[0].image) {
                                        res.end("IMAGE NOT FOUND");
                                        console.error("Image not found :" + JSON.stringify(viewmodel));
                                        return;
                                    }
                                    
                                    //if it was first view it has to be tracked on intercom
                                    checkIfItWasFirstView(userId);



                                });
                            }
                            
                            helpers.imageTransformation.serveImage(imagepath, res);
                            
                           
                            
                        }
                        
                    }
                });

            } else {      //account not active serve dummy image

                helpers.imageTransformation.serveImage(dummyImagePath, res);
            }
        });


    }

});



/**
 * serve image content when using central organized signatures when using only marketing banner
 */
router.get('/company/:adminId/:employeeEmail', function (req, res, next) {
     //determine if outlook link
                        var serveOutlookImage = req.query.m;
                        if (serveOutlookImage === "o") {
                            serveOutlookImage = true;

                        } else {
                            serveOutlookImage = false;
                        }
                        processGenericImage(req.params.adminId, req.params.employeeEmail,serveOutlookImage, true, res );
});

/**
 * serve image content when using integration of versa commerce
 */
router.get('/versacom/:adminId/:templateName', function (req, res, next) {
     //determine if outlook link
     
                       var adminId = req.params.adminId;
                       var emailToUse = req.params.templateName;
                        var serveOutlookImage = req.query.m;
                        if (serveOutlookImage === "o") {
                            serveOutlookImage = true;

                        } else {
                            serveOutlookImage = false;
                        }
                        
                        //generate domain name
                         User.findOne(
                            {
                                where : {
                                     id : adminId
                            }
                        }).then(function(adminData){
                           
                            if(adminData && adminData.email){
                                var adminDomain = adminData.email.split("@");
                                if(adminDomain.length > 0){
                                    emailToUse = emailToUse + "@" + adminDomain[1];
                                }
                                
                            }
                            processGenericImage(adminId, emailToUse, serveOutlookImage, true , res );
                            
                        }).catch(function(){
                            processGenericImage(adminId, emailToUse, serveOutlookImage, true , res );
                        });
                        
                        
                        
                      
});

/**
 * function for generic pics like used in generic snippet for company to include via existing signature solution or versa commerce
 * @param {type} adminId
 * @param {type} employeeEmail
 * @param {type} outlook serve special outlook image or not
 * @param {type} smallDummyImage use small dummy image or large
 * @param {type} res
 * @returns {undefined}
 */
function processGenericImage(adminId, employeeEmail, outlook ,smallDummyImage ,  res){
    var dummyImagePath = "public/images/dummy.png";
    //determine dummy image
    if(smallDummyImage == true){
       dummyImagePath = "public/images/common/trackingpixel/mailtastic.png";
    }
             //check params 
    if (!adminId || !employeeEmail) {
        console.error("company picserve failed: admin: " + adminId + "employee: " + employeeEmail);
        res.status(404);
        res.end();
    } 
        else {
            User.findOne(
                {
                    where : {
                        $or : [
                            {admin : adminId},
                            {id : adminId}
                        ],
                        email : employeeEmail
                }
            }).then(function(data){
                if(!data || !data.id){
                    return $q.reject();
                }
                else{
                     return $q.resolve(data.id);
                }
                
            }).then(function(id){
               
                //check if user is allowed to (paid, testaccount, etc)
                accountHelper.checkIfAccountActive(id).then(function (data) {
                    if (data === true) {      //acount is active thus serve image
                        var serveOutlookImage = outlook;
                        //get user id
                        var userId = id;

                        //get active campaign for user
                        var query = "SELECT g.id as groupId, c.id as campaignId, c.image  from Groups g join Campaign c on g.activeCampaign = c.id  where g.id = (select currentGroup from User where id = :userId)";

                        sequelize.query(query, {replacements: {userId: userId}, type: sequelize.QueryTypes.SELECT}).then(function (result) {
                            //TODO send 404
                            if (!result || !Array.isArray(result) || result.length == 0) {
                                // res.end("NOT FOUND");
                                //helpers.imageTransformation.serveImage("public/images/dummy.png", res);
                                      helpers.imageTransformation.serveImage(dummyImagePath, res);
//                                    console.error("User konnte keiner Kampagne zugeordnet werden - UserId :" + userId);
                                return;
                            }
                            var viewmodel = {
                                userId: userId,
                                campaignId: result[0].campaignId,
                                groupId: result[0].groupId
                            };

                            //User ist keiner Kampagne zu geordnet oder es fehlen andere Dinge
                            if (!viewmodel.userId || !viewmodel.campaignId || !viewmodel.groupId || !result[0].image) {
        //                res.end("NOT FOUND");
                                console.error(JSON.stringify(viewmodel)); 
                                //helpers.imageTransformation.serveImage("public/images/dummy.png", res);
                                   helpers.imageTransformation.serveImage(dummyImagePath, res);
                            } else {

                                //get image name
                                var imagename = result[0].image.substr(result[0].image.lastIndexOf('/') + 1);

                                //wenn es sich um einen outlook link handelt wird das outlook bild angezeigt
                                if (serveOutlookImage === true) {
                                    //transform to transparent image name
                                    var name = imagename.substr(0, imagename.lastIndexOf('.'));
                                     //check if is gif
                                    if(imagename.indexOf(".gif") > -1){
                                         imagename = name + "_outlook" + ".gif";
                                    }else{
                                          imagename = name + "_outlook" + ".png";
                                    }
                                }

                                //build path for reading image
                                var imagepath = "public/images/" + imagename;
                                
                                //check if view has to be tracked. When it was send by the integration page there should not be tracked any view or tracking
                               
                                View.create(viewmodel).then(function (created) {
                                    //if it was first view it has to be tracked on intercom
                                    checkIfItWasFirstView(userId);
                                });
                               
                               
                                //helpers.imageTransformation.serveImage(imagepath, res);
                                helpers.imageTransformation.serveImage(imagepath, res);
                            }
                        });

                    } else {      //account not active serve dummy image

                        //helpers.imageTransformation.serveImage("public/images/dummy.png", res);
                           helpers.imageTransformation.serveImage(dummyImagePath, res);
                    }
                });
            }).catch(function(){
                //helpers.imageTransformation.serveImage("public/images/dummy.png", res);
                   helpers.imageTransformation.serveImage(dummyImagePath, res);
            });
    }
}







/**
 * Mark the Signature for an employee as activated with timestamp of activation time
 * Used to determine if an employee has implemented latest signature
 * Marks signature only as activated when the signature or the companyInfodata or the data for the employee was not changed since pixel was generated
 * 
 */
router.get('/activatesig/:sigId/:empId/:timestamp', function (req, res, next) {
    serveTrackingPixel(res);        //return pixel no matter if it is valid
    
    //check if view has to be tracked. When it was send by the integration page there should not be tracked any view or tracking
    var track = req.query.track;
    
    if (!req.params.sigId || !req.params.empId || !req.params.timestamp) {
       
        console.error("Parameter missing on activating signature id. SigId: " + req.params.sigId + "empId: " + req.params.empId + "timestamp: " + req.params.timestamp);
       
    } 
    else if(track === "n"){
        
        return;
    }
    
    else {
        
           
        
            //check if it is only the web app which display the image
            var referer = req.headers.referer;
            if (referer === (config.webapphost + "/")) {
                 //web app is displaying image so this is no activation
                 return;
            }else{
                 //get user data
            
                var adminId = null;
                var companyInfoUpdated = null;
                var userInfoUpdatedAt = null;
                var signatureWasRolledOutAt = null;
                var pixelTimeStamp = moment(new Date(req.params.timestamp));
                
                
                //check if user is admin or not
                User.findOne({where : {id : req.params.empId}})
                        .then(function(userObject){
                            if(!userObject){
                                throw new Error("userObject was not found");
                            }else{
                                
                                //userInfo last updated is on admin and on regular employee the same
                                if(userObject.userInfoUpdatedAt){
                                    userInfoUpdatedAt = moment(new Date(userObject.userInfoUpdatedAt));
                                }  
                                
                                //check if user is admin
                                if(userObject.isAdmin === true){
                                    adminId = req.params.empId;
                                    return $q.resolve(userObject);
                                    
                                }else{
                                    adminId = userObject.admin;
                                    return $q.reject(userObject);
                                }
                            }
                            
                        })
                        .then(
                            function userWasAdmin(userObject){  //check admin user timestamps. No need to make another query to the database
                                if(userObject.companyInfoUpdatedAt){
                                    companyInfoUpdated = moment(new Date(userObject.companyInfoUpdatedAt));
                                }
                                return $q.resolve();

                            },
                            function userWasNoAdmin(userObject){

                                //query admin user object to get company info updated timestamp
                                User.findOne({where : {id : adminId}})
                                        .then(function(adminObject){
                                            if(!adminObject){
                                                 throw new Error("adminobject was not found admin " + adminId);
                                            }else{
                                                if(adminObject.companyInfoUpdatedAt){
                                                    companyInfoUpdated = moment(new Date(adminObject.companyInfoUpdatedAt));
                                                    
                                                }
                                                return $q.resolve();

                                            }
                                        }) .catch(function(e){
                                             console.error("Signature activation was not successfull admin object not found" + e);
                                         });
                            }
                        
                        )
                        .then(function(){   //get signature updated timestamp
                            var deferred = $q.defer();
                             Signature.findOne({where : { id : req.params.sigId, owner : adminId}})
                                     .then(function(sigObject){
                                        if(!sigObject){
                                                        throw new Error("sigObject was not found sigID: " + req.params.sigId + " admin: " + adminId);
                                        }else{
                                               if(sigObject.signatureUpdatedAt){
                                                       signatureWasRolledOutAt = moment(new Date(sigObject.signatureUpdatedAt));
                                               }

                                               deferred.resolve();
                                        }
                                    }) .catch(function(e){
                                             console.error("Signature activation was not successfull signauture not found" + e);
                                         });
                             
                             return deferred.promise;

                        })
                        
                        .then(function(){   //determine if we have to set pixel as activated
                                
                                    if(companyInfoUpdated && pixelTimeStamp.isBefore(companyInfoUpdated)){
                                          return $q.reject();
                                    }else if(userInfoUpdatedAt && pixelTimeStamp.isBefore(userInfoUpdatedAt)){
                                          return $q.reject();
                                    }else if(signatureWasRolledOutAt && pixelTimeStamp.isBefore(signatureWasRolledOutAt)){
                                        return $q.reject();
                                    }else{
                                         return $q.resolve();
                                    }
                                    
                        })
                        .then(
                            function markUserAsActivated(){
                                    User.update(
                                    {
                                        signatureActivated : req.params.sigId, 
                                        signatureActivatedAt : sequelize.fn('NOW') 
                                    },{
                                        where : 
                                        {
                                            id : req.params.empId
                                        }
                                    }
                                    ).then(function(data){
                                        if(!data){
                                                throw new Error("user could not be set as activated");
                                            
                                        }
                                    });
                            },
                            function dontMarkUserAsActivated(){ //dont do anything
                                return;
                            }
                        )
                        .catch(function(e){
                              console.error("Signature activation was not successfull sid id: "  + req.params.sigId + "empId: " + req.params.empId + " timstamp: " + req.params.timestamp);


                        });
                
                //check last update of own user data
                
            }
            
            
    }

});


/**
 * when the first impression for a user or a new employee is tracked than intercom gets informed
 * @param {type} userId
 * @returns {undefined}
 */
function checkIfItWasFirstView(userId){
    
    if(!userId){
        console.error("Creating first impression intercom event failed : missing userId");
        return;
    }
    
    var query = 
            "SELECT count(*) as amountOfViews, "
            + "(select email from User where id = (select admin from User where id  = :userId) OR (id = :userId AND isAdmin = 1 )) as adminEmail "
            + "from View where userId = :userId";
            sequelize.query(query, {replacements: {userId: userId}, type: sequelize.QueryTypes.SELECT}).then(function (result) {
         
                if(result && Array.isArray(result) && result.length === 1 && result[0].amountOfViews && result[0].amountOfViews === 1){
                    //intercom
                    // Create a event
                    
                    var time = moment().format("X");
                    //console.error("time :" + time);
                    
                    if(result[0].adminEmail){
                        intercomClient.events.create({
                            event_name: 'User or employee created first impression',
                            created_at:   time,
                            email: result[0].adminEmail,

                        }).catch(function(e){

                            console.error("Creating first impression intercom event failed : intercom error " + e);
                        });
                    }else{
                        console.error("Creating first impression intercom event failed : missing admin email" + result);
                    }
                    

                };
         
            });
}

/**
 * load trackingpixel for tracking if the siganture was integrated and send it as response
 * @param {type} res
 * @returns {undefined}
 */
function serveTrackingPixel(res){
    helpers.imageTransformation.serveImage("public/images/common/trackingpixel/mailtastic.png" , res);
}



function gmdate() {
    //  discuss at: http://phpjs.org/functions/gmdate/
    // original by: Brett Zamir (http://brett-zamir.me)
    //    input by: Alex
    // bugfixed by: Brett Zamir (http://brett-zamir.me)
    //  depends on: date
    //   example 1: gmdate('H:m:s \\m \\i\\s \\m\\o\\n\\t\\h', 1062402400); // Return will depend on your timezone
    //   returns 1: '07:09:40 m is month'

//  var dt = typeof timestamp === 'undefined' ? new Date() : // Not provided
//  typeof timestamp === 'object' ? new Date(timestamp) : // Javascript Date()
//  new Date(timestamp * 1000); // UNIX timestamp (auto-convert to int)
//  timestamp = Date.parse(dt.toUTCString()
//    .slice(0, -4)) / 1000;
//  return this.date(format, timestamp);
//  

    var time = new Date((+new Date()) + (5 * 60 * 60000)); // js times are ms

//    alert(time.toUTCString()); 
    return time.toUTCString();
}






module.exports = router;
