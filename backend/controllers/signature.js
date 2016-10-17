'use strict';

var google = require('googleapis');
var createAPIRequest = require('googleapis/lib/apirequest');

var async = require("async");
/* xml escaping escape html characters into unicode string , google does not access direct html signature*/
var xmlescape = require("xml-escape");

/* instantiate common*/
var common = require("./common");

/*for parsing XML response from google*/
var parseString = require('xml2js').parseString;
var employeeCtrl = require("./employeeCtrl");

var employeeCtrl = require("./employeeCtrl");

var self = new function () {
    
    /* get list of all the users in the directory*/
    this.getListOfUsers = function (req, res, next) {
        common.getAuthClient(function (oAuthClient) {
            
            /* if there is no token provided then send error back*/
            if (req.body == null || !req.body || !req.body.googleToken) {
                
              
                
                
                res.send("Invalid Token").status(500);
                return;
            }
            
            /*required to do further action other wise it will say  - invalid_grant */
            oAuthClient.credentials = req.body.googleToken;

            var service = google.admin('directory_v1');
            /* call to google server */
            service.users.list({
                auth: oAuthClient,
                customer: 'my_customer',
                orderBy: 'email'
            }, function (err, response) {
                if (err) {
                    var errorCode = 100;
                    if(err.message === "Domain not found."){//is no admin account
                        
                        errorCode = 666;
                    }  
                     res.json({
                         success : false,
                         code : errorCode
                     });
                    
                    return console.error('The API returned an error: ' + err);
                }
                /* user may have several fields, we only require name and email, so create another array 
                 * and send that back */
                var users = response.users;
                var listToSend = [];
                if (users.length == 0) {
                    console.log('No users in the domain.');
                } else {
                    
                    for (var i = 0; i < users.length; i++) {
                        var user = users[i];
                        listToSend.splice(listToSend.length, 0, { firstname: user.name.givenName, lastname: user.name.familyName, email: user.primaryEmail, isAdmin: user.isAdmin, group : user.orgUnitPath })
                    }
                    /* list of name and email */
                    res.json(listToSend);
                }
            });
        });

    };
    
    
    
    /**
     * Get the current signature which is assined in google
     * Is needed to only push the campaign below it
     * @returns {undefined}
     */
    this.getCurrentGoogleSignature = function(email, adminId){
        return new Promise(function(resolve, reject){
            if (email == null || !email ) {
                return reject("no email provided")
            }
            
            
            CompanyInfo.findOne({where : {admin : adminId}})
                .then(function(companyInfo){
                    if(!companyInfo){
                        return reject("companyInfo not found for admin :" + adminId);
                    }
                    if(!companyInfo.accessTokenKey){
                         return reject("companyInfo not providing token:" + adminId);
                    }
                     
                    var token = companyInfo.accessTokenKey;
                    
                    
                common.getAuthClient(function (oAuthClient) {
                    /* if there is no token provided then send error back*/
                    if (!token) {
                        return reject("Invalid Token");
                    }
                    /*required to do further action other wise it will say  - invalid_grant */
                    try{
                          oAuthClient.credentials = JSON.parse(token);
                    }catch(e){
                        return reject("Invalid Token : could not parse token");
                    }
                  

                    //get coogle client service
                    var service = google.admin('directory_v1');
                    var domain = email.split("@")[1];
                    var userName = email.split("@")[0];
                    
                    ///////
                     var xmlText = "<?xml version='1.0' encoding='utf-8'?>" 
                        + "<atom:entry xmlns:atom='http://www.w3.org/2005/Atom' xmlns:apps='http://schemas.google.com/apps/2006'>" 
                        + "<apps:property name='signature' value='' />" 
                        + "</atom:entry>";
                
                var _options = {

                    /* oAuthClient we prepared in above client and provided access_token above*/
                    auth: oAuthClient,
                    headers:{
                        accept: 'application/atom+xml'
                    }

                };
                
                /*code studied in the createApiRequest to make following object*/
                var parameters = {
                    options: {
                        method: 'GET',
                        url : 'https://apps-apis.google.com/a/feeds/emailsettings/2.0/' + domain + '/' + userName + '/signature',

                    },
                    params: _options,
                    requiredParams: [],
                    pathParams: [],
                    context: service
                };
                /* it will call to google server with above provide options and will get the signature */
                createAPIRequest(parameters, function (err, response) {
                    
                 
                    
                    
                    if (err) {
                       reject(err);
                    } else {
                        //parse XML response from google
                         parseString(response, function (err, result) {
                             if(err){
                                 reject("error parsing google xml" + response);
                             }else{
                                 
                                 try{
                                     var toRespond = result["entry"]["apps:property"][0]["$"]["value"];
//                                     console.error("JSON GOOGLE RESPONSE" +  toRespond);
                                     resolve(toRespond);
                                     
                                 }catch(e){
                                     console.error("could not get google sync existing signature : + " + e + " admin: " + adminId);
                                     
                                 }
                                  
                             }
                            
                         });
                        
                        
                      
                    }
                });
            }, function err(err){
                 reject(err);
                
            });
         });
    });
};



    
    
    
    
    /* updates the signature */
    this.updateSignature = function (req, res, next) {
        
        common.getAuthClient(function (oAuthClient) {
            /* if there is no token provided then send error back*/
            if (req.body == null || !req.body || !req.body.googleToken) {
                res.send("Invalid Token").status(500);
                return;
            }
            /*required to do further action other wise it will say  - invalid_grant */
            oAuthClient.credentials = req.body.googleToken;

            var service = google.admin('directory_v1');
            
            var userStatus = [];
            var processedCount = 0;
            async.each(req.body.data.users, function (user) {
                var domain = user.email.split("@")[1];
                var userName = user.email.split("@")[0];
                
                /* xml format taken from google admin sdk website 
                 * we must escape the signature value othewise google will return error
                 */

                var xmlText = "<?xml version='1.0' encoding='utf-8'?>" 
                        + "<atom:entry xmlns:atom='http://www.w3.org/2005/Atom' xmlns:apps='http://schemas.google.com/apps/2006'>" 
                        + "<apps:property name='signature' value='" + xmlescape(req.body.data.signature) + "' />" 
                        + "</atom:entry>";
                
                var _options = {

                    /* oAuthClient we prepared in above client and provided access_token above*/
                    auth: oAuthClient,
                    headers:{
                        accept: 'application/atom+xml'
                    },

                    /* to POST/PUT your custom body add to media member
                     * code studied in the createApiRequest to make following object
                     * */

                    media:{
                        body: xmlText,
                        mimeType: 'application/atom+xml'
                    }
                };
                
                /*code studied in the createApiRequest to make following object*/
                var parameters = {
                    options: {
                        method: 'PUT',

                    },
                    mediaUrl: 'https://apps-apis.google.com/a/feeds/emailsettings/2.0/' + domain + '/' + userName + '/signature',
                    params: _options,
                    requiredParams: [],
                    pathParams: [],
                    context: service
                };
                /* it will call to google server with above provide options and will update the signature */
                return createAPIRequest(parameters, function (err, response) {
                    if (err) {
                        console.log(err)
                        userStatus.splice(userStatus.length, 0, { email: user.email, status: "failed", statusDesc: err });
                    } else {
                        
                        userStatus.splice(userStatus.length, 0, { email: user.email, status: "success", statusDesc: "" });
                    
                    }
                    processedCount = processedCount + 1;

                    /* once all users signature are updated then update the client with status code for each email id*/
                    if (processedCount == req.body.data.users.length) {
                        res.json(userStatus);
                    }
                });
            }, function (err) {
            
            
            });
        });
    };
    
    
    
    
    /**
     * Push the current signature or campaign banner into the signature of google synced user
     * @param {type} users list of user objects with needed email as object member
     * @param {type} signature
     * @param {type} token
     * @returns {undefined}
     */
    this.processSignatureSyncForGoogleUsers = function (users,  adminId) {
        
        //TODO check for parameters
        return new Promise(function(resolve, reject){
            
        //get google auth token
        
        CompanyInfo.findOne({where : {admin : adminId}})
                .then(function(companyInfo){
                    if(!companyInfo){
                        return reject("companyInfo not found for admin :" + adminId)
                    }
                    if(!companyInfo.accessTokenKey){
                         return reject("companyInfo not providing token:" + adminId)
                    }
                     
                    var token = companyInfo.accessTokenKey;
                    
                    
                common.getAuthClient(function (oAuthClient) {
                    /* if there is no token provided then send error back*/
                    if (!token) {
                        return reject("Invalid Token");
                    }
                    /*required to do further action other wise it will say  - invalid_grant */
                    try{
                          oAuthClient.credentials = JSON.parse(token);
                    }catch(e){
                        return reject("Invalid Token : could not parse token");
                    }
                  

                    //get coogle client service
                    var service = google.admin('directory_v1');

                    var userStatus = [];
                    var processedCount = 0;


                    //iterate over given users
                    async.each(users, 
                        function (user, callback) {
                            var domain = user.email.split("@")[1];
                            var userName = user.email.split("@")[0];

                            /* xml format taken from google admin sdk website 
                             * we must escape the signature value othewise google will return error
                             */

                             employeeCtrl.getCompleteSignatureForEmployee(user)
                             
                                    .then(function(signature){
                                        
                                        return new Promise(function(resolve, reject){
                                            
                                          
                                            
                                            
                                            
                                              //campaign
                                            if(signature.signatureOrCampaign === "campaign"){   //get current signature to push
                                                //if it is only campaign then the existing signature in google must stay and campaign must be under current signature
                                                self.getCurrentGoogleSignature(user.email, adminId).then(function(existingSignature){

                                                    if(existingSignature.includes(config.ownhost)){
                                                        var signatureToDeliver = existingSignature;
                                                        resolve(signatureToDeliver); //if snippet already contains campaign banner container push same content again
                                                    }else{
                                                        var signatureToDeliver = existingSignature + signature.snippet;
                                                         //remove outlook and non tracking parameters 
                                                        signatureToDeliver = signatureToDeliver.replace('?m=o', '');       //outlook
                                                        signatureToDeliver = signatureToDeliver.replace("&track=n" , "");
                                                        signatureToDeliver = signatureToDeliver.replace("?track=n" , "");
                                                        signatureToDeliver = signatureToDeliver.replace('moz-do-not-send="true"', '');
                                                        signatureToDeliver = signatureToDeliver.replace('width="700" height="210"', '');   
                                                        resolve(signatureToDeliver);
                                                    }
                                                    

                                                }).catch(function(e){
                                                    reject(e);
                                                });
                                            }else{
                                                
                                                //check if user has to get an email because of missing data for signature
                                                employeeCtrl.checkIfDataMissingForEmployeeAndSendMail([user], signature.signatureId, adminId);
                                                
                                                //signature +  tracking pixel
                                                //dont get existing  signature to push
                                                var signatureToDeliver = signature.snippet +  signature.trackingPixel;
                                                //remove outlook and non tracking parameters 
                                                signatureToDeliver = signatureToDeliver.replace('?m=o', '');       //outlook
                                                signatureToDeliver = signatureToDeliver.replace("&track=n" , "");
                                                signatureToDeliver = signatureToDeliver.replace("?track=n" , "");
                                                signatureToDeliver = signatureToDeliver.replace('moz-do-not-send="true"', '');
                                                signatureToDeliver = signatureToDeliver.replace('width="700" height="210"', '');   
                                                resolve(signatureToDeliver);
                                            }
                                        });
                                        
                                      
                                        
                                    })
                                    
                             
                                    .then(function(signature){

                                        var xmlText = "<?xml version='1.0' encoding='utf-8'?>" 
                                            + "<atom:entry xmlns:atom='http://www.w3.org/2005/Atom' xmlns:apps='http://schemas.google.com/apps/2006'>" 
                                            + "<apps:property name='signature' value='" + xmlescape(signature) + "' />" 
                                            + "</atom:entry>";

                                        var _options = {

                                            /* oAuthClient we prepared in above client and provided access_token above*/
                                            auth: oAuthClient,
                                            headers:{
                                                accept: 'application/atom+xml'
                                            },

                                            /* to POST/PUT your custom body add to media member
                                             * code studied in the createApiRequest to make following object
                                             * */

                                            media:{
                                                body: xmlText,
                                                mimeType: 'application/atom+xml'
                                            }
                                        };

                                        /*code studied in the createApiRequest to make following object*/
                                        var parameters = {
                                            options: {
                                                method: 'PUT',

                                            },
                                            mediaUrl: 'https://apps-apis.google.com/a/feeds/emailsettings/2.0/' + domain + '/' + userName + '/signature',
                                            params: _options,
                                            requiredParams: [],
                                            pathParams: [],
                                            context: service
                                        };
                                        /* it will call to google server with above provide options and will update the signature */
                                        createAPIRequest(parameters, function (err, response) {
                                            if (err) {
                                                console.error(err);
                                                userStatus.splice(userStatus.length, 0, { email: user.email, status: "failed", statusDesc: err });
                                            } else {
                                                   console.log("Signature pushed to google user : " + user.email)
                                                userStatus.splice(userStatus.length, 0, { email: user.email, status: "success", statusDesc: "" });

                                            }
                                            processedCount = processedCount + 1;

                                            callback();
                                        });



                                    }).catch(function(e){
                                        console.error("Error on syncing signature to google: " + e);
                                        callback("ERROR OCCURED IN GOOGLE SYNC SIGNATURE PROCESS: " + e);
                                    });


                        }, function (err) { //called when all iterating is done
                            if(err){
                                 console.error("Error on syncing signature to google outer loop: " + err);
                                 reject(err);
                            }else{

                                 resolve(userStatus);
                            }

                        });
                    });
                    
                    
                });
        }); 
    
    };
    
    
  
    
    
};
exports.getListOfUsers = self.getListOfUsers;
exports.updateSignature = self.updateSignature;
exports.processSignatureSyncForGoogleUsers = self.processSignatureSyncForGoogleUsers;
