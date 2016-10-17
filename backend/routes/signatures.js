var express = require('express');
var router = express.Router();
bodyParser = require('body-parser'); //parses information from POST
//methodOverride = require('method-override'); //used to manipulate POST
//var fs = require("fs");
var async = require("async");
var Promise = sequelize.Promise;
//var rand = require("generate-key");
var helpers = require('../helpers/helperfunctions');
var Q = require('q');
var signatureFieldStructure = require("../helpers/signatureGeneration/fields.json"); 
var moment = require('moment');

var controllers = require("../controllers");

var signatureHelper = require("../helpers/signatureGeneration/signaturehelperClass");
/* GET users listing. */
router.get('/', function (req, res, next) {
    //res.end("Hallo");

//    Signature.findAll({where : {owner : req.tokendata.id}}).then(
                sequelize.query("SELECT s.*, "
                        +"(select companyInfoUpdatedAt from User where id= :adminId) as companyInfoUpdatedAt "
                        + " FROM Signature s where owner = :adminId", {replacements: { adminId: req.tokendata.id},type: sequelize.QueryTypes.SELECT}
                ).then(
        
            
                function(signatures){

                 if(!signatures){
                        res.json({
                             success: false
                         });

                         return Promise.reject();

                 }else{

                      // We don't need spread here, since only the results will be returned for select queries

                         //get all Groups where the campaign is active
                         promises = [];
                         signatures.forEach(function (signature) {
                             promises.push(
         //                            function () {

                                          sequelize.query("SELECT g.*"
                                                 + ",(Select count(*) from User where currentGroup = g.id) as amountOfMembers"
                                                 + ",(Select count(*) from View where groupId = g.id) as views "
                                                 + ",(Select count(*) from Click where groupId = g.id) as clicks "
                                                 + ",(Select title from Campaign where id = g.activeCampaign) as campaignTitle,"
                                                 + "(Select id from Campaign where id = g.activeCampaign) as campaignId,"
                                                 + "(Select url from Campaign where id = g.activeCampaign) as campaignUrl,"
                                                 + "(Select color from Campaign where id = g.activeCampaign) as campaignColor"
                                                 + " FROM Groups g where owner = :adminId AND g.activeSignature = :signatureId", {replacements: { adminId: req.tokendata.id, signatureId : signature.id },type: sequelize.QueryTypes.SELECT}

                                         ).then(function (groups) {
                                             var tempsignature = signature;
                                             tempsignature.activegroups = groups;
                                             return tempsignature;
                                         })
                             );
                         });

                         return Promise.all(promises);

                 }

             },function(err){
                 console.error("Error on loading Signatures: " + err);
                  res.json({
                             success: false
                         });

             }).then(function(signaturesResults){    //everything worked well
                 res.json({success : true, data : signaturesResults}  );
             }).catch(function(){        //some uncaught promise was rejected
                 res.json({success : false, code : 104}  );
             });


});

/**
 * Get specific signature by id
 */
router.get('/single/:signatureId', function (req, res, next) {
    if (!req.params.signatureId) {
        res.json({
            success: false,
            code : 100
        });
    } else {
        
            var signatureObject ;
            Signature.findOne(          //find signature with id
                    {where : 
                        {
                            id : req.params.signatureId, 
                            owner : req.tokendata.id
                        }
            }).then(function(signature){    //check if signature was found
                if(!signature){
                    return Q.reject("query failed");
                }else{
                    signatureObject = signature;
                    return Q.resolve(signature);
                }
                
            })
            .then(
            function(signature){       //get timestamp when the signature relevant company info was changed
                return User.findOne({where : { id : req.tokendata.id}}).then(function(data){
                    if(!data){
                         return Q.reject("Admin data could not be loaded");
                    }else{
                          signatureObject.dataValues.companyInfoUpdatedAt = data.companyInfoUpdatedAt;  //set timestamp when the company info was last updated because when company info is updated than the signature is no longer latest
                          return Q.resolve(signature);
                    }
                    
                });
            })        
            .then( 
                function resolve(signature){ //get array of groups in which the signature is used
                    return getGroupsInWhichSignatureIsActive(signature.id, req.tokendata.id);
            }).then( 
                function resolve(groups){ //everything was fine -> return signature in response
                    signatureObject.dataValues.activeGroups = groups;
                    res.json({
                        success: true,
                        data : signatureObject
                    });
                }
            ).catch(function(err){      //something went wrong so dont deliver data
                console.error("get single signature data went wrong : "  + req.params.signatureId);
                res.json({
                        success: false,
                        code : 102
                });
                
            });
    }

});

/**
 * Find all groups in which a given signature id is active
 * @param {type} signatureId
 * @param {type} owner
 * @returns {Q@call;defer.promise}
 */
function getGroupsInWhichSignatureIsActive(signatureId, owner){
    var deferred = Q.defer();
    if (!signatureId || !owner) {
        deferred.reject("invalid call parameter");
        console.error("groups in which signature is active: invalid call parameters " + owner + " " + signatureId);
        
    } else {
        
              sequelize.query("SELECT g.*"
                                        + ",(Select count(*) from User where currentGroup = g.id) as amountOfMembers"
                                        + ",(Select title from Campaign where id = g.activeCampaign) as campaignTitle,"
                                        + "(Select id from Campaign where id = g.activeCampaign) as campaignId,"
                                        + "(Select url from Campaign where id = g.activeCampaign) as campaignUrl,"
                                        + "(Select color from Campaign where id = g.activeCampaign) as campaignColor,"
                                        + "(Select image from Campaign where id = g.activeCampaign) as campaignImage"
                                        + " FROM Groups g where owner = :adminId AND g.activeSignature = :signatureId", {replacements: { adminId: owner, signatureId : signatureId },type: sequelize.QueryTypes.SELECT}

                                )
        
        
           .then(function(groups){
                if(!groups){
                      deferred.reject("no data founf");
                      console.error("groups in which signature is active: no data " + owner + " " + signatureId);
                }else{
                    
                     deferred.resolve(groups);
                }
                
            }, function(err){
                   deferred.reject("query rejected");
                   console.error("groups in which signature is active: query rejected " + owner + " " + signatureId);
                
            });
    }
    
    
    return deferred.promise;
}


/**
 * Get all groups in which the signature with given id is active
 */
router.get(':signatureId/usedin/groups', function (req, res, next) {
    if (!req.params.signatureId) {
        res.json({
            success: false,
            code : 100
        });
    } else {
        
        
        getGroupsInWhichSignatureIsActive(req.params.signatureId, req.tokendata.id).then(
                function resolve(groups){
                     res.json({
                        success: true,
                        data : groups
                    });
                    
                },
                function reject(err){
                     res.json({
                        success: false,
                        code : 101
                    });
                }
                );
    }

});






/**
 * Update Signature with given id
 */
router.put('/', function (req, res, next) {
    if (!req.body || !req.body.id || !req.body.signatureTpl || !req.body.signatureData || !req.body.title) {
        res.json({
            success: false,
            code : 100
        });
    } else {
        var signatureId = req.body.id;  //get signature id
         
        var signatureObject = {};
        signatureObject.signatureTplToEdit = req.body.signatureTpl;
        signatureObject.signatureDataToEdit = JSON.stringify(req.body.signatureData);
        signatureObject.title = req.body.title;
        
        var oldTemplate = "";
        var oldSigData = "";
        
        //check if signature tpl has changed because only then the signature changedAt has to be set to the current moment.
        //changedAt  datetime has to be set only if the structure is changed. There is no need to inform employees for new signature
        Signature.findOne({where : { id : req.body.id}})
                .then(function(data){
                    
                    //if the old template is another then the new one, we set our indicator to know that the signature was updated
                    oldTemplate = data.signatureTplToEdit;
                    oldSigData = data.signatureDataToEdit;
                    
                    
                    if(oldTemplate !== signatureObject.signatureTpl || oldSigData !== signatureObject.signatureData){
                        signatureObject.signatureUpdatedAt = sequelize.fn('NOW');
                        return Q.reject();     //set signatureUpdatedAt timestamp
                    }
                    else{
                         return Q.resolve();  //dont set signatureUpdatedAt timestamp
                    }
                   
                })
                .then(
                
                    function resolve(){     //save object regular
                         Signature.update(signatureObject, {where : {id : signatureId, owner : req.tokendata.id}}).then(function(updatedObject){
                            if(!updatedObject){
                                res.json({
                                    success: false,
                                    code : 101
                                 });
                            }else{
                                  res.json({
                                    success: true,
                                    //object : updatedObject  //return updated object so that frontend
                                 });
                            }
                         });
                    },
                    function rejected(){    //save object as single values because it seems that only then the fn("NOW") is resolved correctly on saving the object to database
                        Signature.update(
                                
                                {
                                    signatureTplToEdit : signatureObject.signatureTplToEdit,
                                    signatureDataToEdit : signatureObject.signatureDataToEdit,
                                    title : signatureObject.title,
                                    signatureUpdatedAt : sequelize.fn('NOW')            //sequlize function for NOW()
                                    
                                }
                        
                        
                        , {where : {id : signatureId, owner : req.tokendata.id}}).then(function(updatedObject){
                            if(!updatedObject){
                                res.json({
                                    success: false,
                                    code : 101
                                 });
                            }else{
                                  res.json({
                                    success: true,
                                    //object : updatedObject  //return updated object so that frontend
                                 });
                            }

                        }); 

                    }
                );
    }

});


router.post('/', function (req, res, next) {
    if (!req.body || !req.body.signatureTpl || !req.body.signatureData || !req.body.title) {
        res.json({
            success: false,
            code : 100
        });
        return;
    }
  
    
    req.body.owner = req.tokendata.id;
    req.body.signatureDataToEdit =  JSON.stringify(req.body.signatureData);
    req.body.signatureTplToEdit =  req.body.signatureTpl;
    
    Signature.create(req.body).then(function (createdObject) {
          if(createdObject.id){
              res.json({
                  success: true,
                  signatureId : createdObject.id
               });
          }else{
              res.json({
                  success: false,
                  signatureId : 101
              });
          }
    });

});


router.post('/delete', function (req, res, next) {
    if (!req.body || !req.body.sigIds || !Array.isArray(req.body.sigIds) || req.body.sigIds.length === 0) {
        res.json({
            success: false,
            code : 100
        });
        return;
    }
  
           
    Signature.destroy({
            where: {
                id: req.body.sigIds,
                owner : req.tokendata.id
            }
        }).then(function (data) {
            
            
            //delete active Signature from groups
            Group.update({activeSignature : null}, {where : {activeSignature : req.body.sigIds, owner : req.tokendata.id}});
            
            if(!data){
                 res.json({success: false, code : 101});
            }else{
                 res.json({success: true});
            }
        });

});




/**
 * Get all groups where the signatureId is active
 * send the Integration E-Mail to the employee
 */
router.post('/rollout/signature', function (req, res, next) {
    if (!req.body.sigId ) {
        
        console.error("Parameter missing on activating signature id. SigId admin: " + req.tokendata.id);
        res.json({
            success: false,
            code : 100
        });
    } else {
            var signatureTpl = null;    //to store version with is in editing mode to rolled out mode
            var signatureData = null;   
            var employeesListToProcess;
            //select all employees which are in a group where the signature is active
            sequelize.query( 
                    "SELECT u.* ,"
                    +" (select companyInfoUpdatedAt from User where id = u.admin) as companyInfoUpdatedAt,"
                    +" (select lastRollout from Signature where id = (select activeSignature from Groups where id = u.currentGroup)) as lastRollout, "
                    +" (select signatureTplToEdit from Signature where id = (select activeSignature from Groups where id = u.currentGroup)) as signatureTplToEdit, "
                    +" (select signatureUpdatedAt from Signature where id = :sigId) as signatureUpdatedAt"
                    +" FROM User u where u.currentGroup IN (Select id from Groups where activeSignature = :sigId)"
                    +" AND  (u.id = :adminId OR admin = :adminId)",
                    {
                        replacements: 
                        {
                            adminId: req.tokendata.id,
                            sigId : req.body.sigId
                        },
                        type: sequelize.QueryTypes.SELECT
                    })
                    .then(function(employees){
                        if(!employees){
                           return Q.reject();
                        }else{
                            
                            employeesListToProcess = employees;
                            return Q.resolve();
                            
                          
                        }
                    })
                    
                    .then(function(){   //mark signature as rollout out and set rolled out tpl and rolledout signature data
                         return  Signature.update(
                                {
                                    lastRollout : sequelize.fn('NOW'), 
                                    signatureTplRolledOut : sequelize.col('signatureTplToEdit'),
                                    signatureDataRolledOut : sequelize.col('signatureDataToEdit'),
                                }, 
                                {where : {id : req.body.sigId}});

                    })
                    .then(function(){
                        
                        return processEmployeeRollout(employeesListToProcess, req, res, "signature", "signature");
                        
                        
                    })
                    
                    .catch(function(e){
                        console.error("Sig Rollout Exception Caught: " + e);
                        res.json({
                            success: false,
                            code : 100
                        });

                    });
    }

});






/**
 * Determine if group has a signature or active campaign
 * send the Integration E-Mail to the employee
 */
router.post('/rollout/employee', function (req, res, next) {
    if (!req.body.empId ) {
        
        console.error("Parameter missing on activating signature id. SigId admin: " + req.tokendata.id);
        res.json({
            success: false,
            code : 100
        });
    } else {
        
            User.findOne(
                    {
                        where :{ 
                            $and : [
                                    {
                                        id : req.body.empId
                                    },
                                    {
                                        $or : [
                                            {admin : req.tokendata.id},
                                            {id : req.tokendata.id}
                                        ]
                                    }
                            ]
                        }
                    })
                    .then(function(employee){
                        if(!employee){
                            res.json({
                                success: false,
                                code : 108
                            });
                        }else{
                            
                            //set datetime when the signature for the user was last rolledout to NOW.
                            //THis is needed to determine if user was already invited, but did not activate or if he was not yet invited for curent signature
                            User.update({signatureLastRollout : sequelize.fn("NOW")}, {where : { id : req.body.empId}})
                                    .then(function(data){
                                        helpers.invitationHelper.sendManyInvitationMails([employee.dataValues], req, res);
                                        res.json({
                                            success: true,
                                            code : 109
                                        });
                                        
                                    });
                            
                            
                        }
                    })
                    .catch(function(e){
                         console.error("Rollout employee Exception Caught: " + e);
                    });
                
    }

});




/**
 * Determine if group has a signature or active campaign
 * send the Integration E-Mail to the employee
 */
router.post('/rollout/group', function (req, res, next) {
    if (!req.body.groupId ) {
        
        console.error("Parameter missing on activating signature id. SigId admin: " + req.tokendata.id);
        res.json({
            success: false,
            code : 100
        });
    } else {
        
            //select all employees which are in a group and get if active signature, active campaign and when the last updates were
            sequelize.query( 
                    "SELECT u.* ,"
                    +" (select companyInfoUpdatedAt from User where id = u.admin) as companyInfoUpdatedAt,"
                    +" (select activeSignature from Groups where id = u.currentGroup) as signatureId, "
                    +" (select activeCampaign from Groups where id = u.currentGroup) as campaignId, "
                    +" (Select count(*) from View where userId = u.id) as views, "
                    +" (select lastRollout from Signature where id = (select activeSignature from Groups where id = u.currentGroup)) as lastRollout, "
                    +" (select signatureUpdatedAt from Signature where id = signatureId) as signatureUpdatedAt"
                    +" FROM User u where u.currentGroup = :groupId"
                    +" AND  (u.id = :adminId OR admin = :adminId)",
                    {
                        replacements: 
                        {
                            adminId: req.tokendata.id,
                            groupId : req.body.groupId
                        },
                        type: sequelize.QueryTypes.SELECT
                    })
                    .then(function(employees){
                        if(!employees){
                           return Q.reject();
                        }else{
                          if(employees[0].signatureId && employees[0].lastRollout){

                            //set signatureId to request because it is needed in the next step
                              req.body.sigId = employees[0].signatureId;
                              
                            
                              return processEmployeeRollout(employees, req, res, "signature", "group");
                          }else if(employees[0].campaignId){
                              return processEmployeeRollout(employees, req, res, "campaign");       //can this happen at all? Should not i think!!
                          }else{
                                res.json({
                                    success: true,
                                    amountOfInvitationsSent : 0   
                                  
                                });
                          }
                        }
                    })
                    
                    .catch(function(e){
                            console.error("Sig Rollout Exception Caught: " + e);

                    });
    }

});




/**
 * Users do have an own timestamp for when the signature was rolledout to them.
 * This ist used to determine if they were already invited but not updated or never invited for latest signature
 * @param {type} employees
 * @returns {undefined}
 */
function setSignatureRolledoutTimestampForEmployees(employees){
    var deferred = Q.defer();

    //check parameters
    if(!employees || !Array.isArray(employees) || employees.length === 0){
        console.error("Setting Signature Single Timestamp for Rollout signature did fail : " +  JSON.stringify(employees));
        Q.reject();
    }
    
    //extract ids from employee object array
    var employeeIds = [];
    for(var i = 0 ; i < employees.length ; i++){
        employeeIds.push(employees[i].id);
    }
    
    //udate timestamp for employees of last rollout of signature
    User.update({signatureLastRollout : sequelize.fn("NOW")}, {where : { id : employeeIds}}).then(function(){
            deferred.resolve();
    }, function(){
             console.error("Setting Signature Single Timestamp for Rollout signature did fail 2 : " +  JSON.stringify(employees) +   JSON.stringify(employeeIds));
             deferred.reject();
    });
    
    return deferred.promise;
     
}






/**
 * Iterate over the employee list and send an invitation if necessary
 * @param {array} employees 
 *  @param {string} rolloutType group, signature or employee. Determines which type of rollout the user has started. This is needed because depending on the context the determination if signature is outdated is different
 * @param {type} mode signature or campaign. When signature it checks if the user has already the newest signature. 
 * When campaign then function checks if user has already views because then the snippet was already integrated
 */
function processEmployeeRollout(employees, req, res, mode, rolloutType){
    var deferred = Q.defer();
    
    if(!employees || employees.length === 0){
        return deferred.reject();
    }else{
        
        
        
        //SORT EMPLOYEES
        var employeesToInform = [];
        var employeesWithEasySync = [];
        var employeesWithGoogleSync = [];
        
        
        employees.forEach(function (employee) {
           //check if user is using easy sync.
           //if yes the user must not get an email
           
          //CHECK USERS WITH OUTLOOK SYNC
            if(employee.lastOutlookEasySync){
               //var lastSyncTime = moment(employee.lastOutlookEasySync, "YYYY-MM-DD");
                 var lastSyncTime = moment(new Date(employee.lastOutlookEasySync)); 
               
                //console.error("last valid easy sync : " + lastSyncTime);
               if (lastSyncTime.isValid()) {
                    
                    var today = moment();
                   
                    var diffDays = today.diff(lastSyncTime, 'days');
                  //  console.log("DAYDIFF EASY SYNC =" + diffDays);
                    if (diffDays < config.timeNoSyncTillReceiveEmailAgain) {
                      employeesWithEasySync.push(employee);
                      return;       //stop processing this element and go on with next element because this user has installed easy sync

                    }
                }else{
                     console.error("INVALID EASY SYNC TIME DATE =" + lastSyncTime);
                }
            }
            
            //CHECK GOOGLE SYNC USERS
            if(employee.isFromGoogle == true){
                
                if(employee.isSyncActivated){   //if sync is deactivated dont do anything with this user
                     employeesWithGoogleSync.push(employee);
                }
               
                return;       //stop processing this element and go on with next element because this user has installed easy sync
            }
            
            //CECK USERS WITHOUT AUTO SYNC
            if(mode === "signature"){
                if(rolloutType === "signature"){     //if we are rolling out signature, then every employee has to be informed no matter what
                    employeesToInform.push(employee);

                }else{

                    //check the signature status from the employee
                    var sigStatus = helpers.signatureHelper.getSignatureStatus(employee, req.body.sigId, rolloutType);

                     //if status is outdated the user has to be informed
                     if(sigStatus === "outdated"){
                         employee.sigStatus = sigStatus;
                         employeesToInform.push(employee);

                     }
                }
            }else if(mode === "campaign"){       //when user is only using the campaign feature
               
               //if employee has views than he has integrated the campaign already
                if(!(employee.views > 0)){
                    employeesToInform.push(employee);
                }
            }
        });


//PROCESS EMPLOYEES
        var promise = new Promise(function(resolve,reject){
            //nothng to do 
            if(employeesToInform.length === 0 && employeesWithEasySync.length === 0 && employeesWithGoogleSync.length === 0){//no one was affected
                reject();
            }else{
                resolve();
            }
        });
        
        promise.
                
        then(function(){
             //users which are using easy sync
            if(employeesWithEasySync.length > 0){    

                //process easy sync users
                
                controllers.employee.checkIfDataMissingForEmployeeAndSendMail(employeesWithEasySync, req.body.sigId,  req.tokendata.id); //send email if there is data missing
                
              
            }
            return Q.resolve();
        })
        
        .then(function(){
            //users which are using google sync
           if(employeesWithGoogleSync.length > 0){    
               //process google sync users
             // controllers.employee.checkIfDataMissingForEmployeeAndSendMail(employeesWithGoogleSync, req.body.sigId,  req.tokendata.id); //send email if there is data missing is already called from inner function
              controllers.signature.processSignatureSyncForGoogleUsers(employeesWithGoogleSync,   req.tokendata.id);
              
           }
           return Q.resolve();

        })

        .then(function(){
                //users which must be informed via mail
            if(employeesToInform.length > 0){      //at least one employee that has to be informed via e-mail about the changes
                //send invitationmail to every employee
                helpers.invitationHelper.sendManyInvitationMails(employeesToInform, req, res);

                
            }
            return Q.resolve();
        })
        
        .then(function(){
            
            if(rolloutType === "signature"){        //set rollout timestamps
                //set last rollout datetime on signature
                Signature.update({lastRollout : sequelize.fn("NOW")}, {where : { id : req.body.sigId, owner : req.tokendata.id}})
                .then(setSignatureRolledoutTimestampForEmployees(employeesToInform))    //set last rollout timestamp for single employee MAYBE DONT NEED THIS ANYMORE
                .then(function(data){
                    if(!data){
                        return Q.reject();
                    }else{
                        return Q.resolve();
                    }

                }).catch(function(e){
                       return Q.reject();
                       console.error("Sig Rollout Exception Caught: " + e);
                });
            }
            return Q.resolve();
        })
        .then(function(){   //finished without problems
            res.json({
                success: true,  
                amountWithGoogleSync : employeesWithGoogleSync.length,      //frontend wants to display how many users were informed
                amountOfInvitationsSent : employeesToInform.length,      //frontend wants to display how many users were informed
                amountWithEasySync : employeesWithEasySync.length
            });
            return  deferred.resolve();
        })
        .catch(function(e){
               res.json({
                    success: false,  
                    amountWithGoogleSync : employeesWithGoogleSync.length,      //frontend wants to display how many users were informed
                    amountOfInvitationsSent : employeesToInform.length,      //frontend wants to display how many users were informed
                    amountWithEasySync : employeesWithEasySync.length
                });
            return  deferred.reject(e);
        })
        
        return deferred.promise;
    }
}

/**
 * Get json field structure which is used for the signature designer in frontend
 */
router.get('/infoFieldStructure', function (req, res, next) {
        if(!signatureFieldStructure){
            res.json({
                success: false,
            });
        }else{
             res.json({
                success: true,
                data : signatureFieldStructure
            }); 
        }
 });






module.exports = router;
