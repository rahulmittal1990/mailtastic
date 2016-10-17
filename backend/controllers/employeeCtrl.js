'use strict';

var $q =  require('q');

var helpers = require('../helpers/helperfunctions');
var signatureHelper = require("../helpers/signatureGeneration/signaturehelperClass");
var self = new function () {
   /* get list of all the users in the directory*/
    this.getCompleteSignatureAndInfosForEmployee = function (employeeObject) {
       var deferred = $q.defer();
        
       
        var userData = employeeObject;
        if(!userData.id || !userData.email ){
            return $q.reject("parameter missing in getCompleteSignatureAndInfosForEmployee : " + userData.id + " : " + userData.email);
             
        }else{

            var query = "SELECT u.email, u.firstname, u.lastname,u.activationCode,  u.currentGroup, u.admin, u.isAdmin, u.isActivated, "
                + " (Select firstname from User where id = u.admin) as adminFirstname, "
                + " (Select lastname from User where id = u.admin) as adminLastname, "
                + " (Select email from User where id = u.admin) as adminEmail, "
                + " (Select id from Signature where id = (Select activeSignature from Groups where id = u.currentGroup)) as signatureId ,"
                + " (Select lastRollout from Signature where id = (Select activeSignature from Groups where id = u.currentGroup)) as signatureLastRollout "
                + " FROM `User` u where u.id = :idToFind and u.email=:emailtofind";
                sequelize.query(query,
                        {
                            replacements: {
                                idToFind: userData.id,
                                emailtofind:userData.email
                            },
                            type: sequelize.QueryTypes.SELECT})


                    .then(function(data){
                             if(!data || !Array.isArray(data) || data.length === 0){
                                throw new Error("No user data was found");
                            }else{
                                 //set userdata like firstname, lastname and email as response to show it on integration page
                                 var userData = {};
                                 userData.firstname = data[0].firstname;
                                 userData.email = data[0].email;
                                 userData.lastname = data[0].lastname;
                                 data[0].userdata = userData;

                                //generate admindata like firstname, lastname and email
                                var admindata = {};

                                if(data[0].isAdmin == true){
                                    admindata.firstname = data[0].firstname;
                                    admindata.email = data[0].email;
                                    admindata.lastname = data[0].lastname;

                                }else{
                                     admindata.firstname = data[0].adminFirstname;
                                    admindata.email = data[0].adminEmail;
                                    admindata.lastname = data[0].adminLastname;
                                }
                                data[0].admindata = admindata;


                                //if user has a signature and if that signature was rolled out before generate signature html
                                if(data[0].signatureId && data[0].signatureLastRollout){
                                   return $q.resolve(data);

                                }else{    //user has no signature so generate campaign banner container
                                   return $q.reject(data);
                                }
                            }


                        })
                    .then(
                    function generateSignatureHtml(data){   //user has active signature so generate signature
                            if(data === null || data.message){
                                return $q.reject();
                            }
                            var adminId;
                              if(data[0].isAdmin == true){
                                  adminId =  userData.id;

                              }else{
                                 adminId = data[0].admin;

                              }

                                //have to set admin because the requests were copied code and need the admin id
                                var sigHelperInstance = new signatureHelper(adminId);

                                sigHelperInstance.getRelevantDataForSignature(userData.id, data[0].signatureId)
                                    .then(function(){
                                        //we only need the snippet in the EasyIntegrate - in EasySync we will need all that other data above too
                                        var ret = sigHelperInstance.generatePreviewComplete(userData.id);

                                        deferred.resolve({
                                          signatureId : data[0].signatureId,
                                          snippet: ret.snippet,
                                          trackingPixel : ret.trackingPixel,
                                          activationCode: data[0].activationCode,
                                          userName: data[0].firstname + ' ' + data[0].lastname,
                                          email: data[0].email,
                                          adminEmail: data[0].admindata.email,
                                          adminFirstName: data[0].admindata.firstname,
                                          adminLastName: data[0].admindata.lastname,
                                          signatureOrCampaign : "signature"

                                        });


                                      })
                                      .catch(function(e){
                                         
                                            deferred.reject("Error on generating signature data for employee : "+ userData.id + " e: " + e + " signature: " + data[0].signatureId)

                                      });


                    }
                    ,
                    function generateCampaignBannerHtml(data){//user has no active signature so generate campaign container

                                if(!data || data.message === "No user data was found"){ //eception was thrown


                                    return $q.reject("No user data was found");
                                }

                                   //we only need the snippet in the EasyIntegrate - in EasySync we will need all that other data above too
                                   var snippet = helpers.getHtmlSnippetForUser(userData.id, true);
                                   
                                   

                                    //mark as signature because easy integrate does not handle json requests
                                    deferred.resolve({
                                        snippet: snippet,
                                        trackingPixel : "",
                                        activationCode: data[0].activationCode,
                                        userName: data[0].firstname + ' ' + data[0].lastname,
                                        email: data[0].email,
                                        adminEmail: data[0].admindata.email,
                                        adminFirstName: data[0].admindata.firstname,
                                        adminLastName: data[0].admindata.lastname,
                                        signatureOrCampaign : "campaign"

                                    });

                    })    

                    .catch(function(e){
                        if(e === "No user data was found"){
                            deferred.reject("Error on creating signature for desktop app userid 2 : "+ userData.id + "e: " + e);
                        }else{
                            deferred.reject("Error on creating signature for desktop app userid 2 : "+ userData.id + "e: " + e);

                        }
                       
                    });


        }
        
        return deferred.promise;
    };


/**
 * check if there is data missing for employees with given signature and send mail if yes
 * @param {type} employeesWithSync
 * @param {type} signatureId
 * @param {type} adminId
 * @returns {undefined}
 */
    this.checkIfDataMissingForEmployeeAndSendMail = function(employeesWithSync, signatureId, adminId){
      if(!employeesWithSync || !Array.isArray(employeesWithSync)){
          //nothing to do here
          return;
      }else{
        var items = employeesWithSync;
        var checkIfDataMissing = function(employee){ // sample async action
                var deferred = $q.defer();
                
                
                var sigHelperInstance = new signatureHelper(adminId);
                sigHelperInstance.getRelevantDataForSignature(employee.id, signatureId)
                        .then(
                            function(){
                                 sigHelperInstance.generatePreviewComplete(employee.id);
                                 return sigHelperInstance.getUserFieldsToComplete();

                            }
                        ).then(
                            function(data){
//                                console.error("UserFieldsToComplete" + JSON.stringify(data));
                                
                                for(var i = 0; i < data.length ; i++){
                                    if(!data[i].value || ((data[i].type === "image" || data[i].type === "link") && !data[i].value.url)){     //when there is no value set send email
                                        helpers.invitationHelper.sendMissingDataEmail([employee], adminId);
                                        break;
                                    }
                                }
                                deferred.resolve();
                            }
                        ).catch(function(e){
                             deferred.reject(e);
                            
                        });
                return deferred.promise;
        };
        
        
        $q.all(employeesWithSync.map(checkIfDataMissing))
                .done(function(){
                    //everything allright
                }, function(e){
                    console.error('Processing Sync Users failed admin : %s , signatureId : %s , employees : %s , error : %s',adminId ,signatureId , JSON.stringify(employeesWithSync), e );
                    
                });
      }
    };





};
exports.getCompleteSignatureForEmployee = self.getCompleteSignatureAndInfosForEmployee;
exports.checkIfDataMissingForEmployeeAndSendMail = self.checkIfDataMissingForEmployeeAndSendMail;

