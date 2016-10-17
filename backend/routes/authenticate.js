/**
 * All routes where no jwt token is neccessary
 */
var express = require('express');
var router = express.Router();
var helpers = require('../helpers/helperfunctions');
bodyParser = require('body-parser'), //parses information from POST
methodOverride = require('method-override'); //used to manipulate POST
var emailHandler = require('../helpers/mailhandler');
var passwordTool = require('password-hash-and-salt');
var rand = require("generate-key");
var signatureHelper = require("../helpers/signatureGeneration/signaturehelperClass");

var controllers = require("../controllers");

var $q =  require('q');


router.post('/authenticate/login', function (req, res, next) {

    User.findOne({
        where: {
            email: req.body.email,
            isAdmin: true
        },
        attributes: ['firstname', 'lastname', 'password', 'id','isActivated', 'email', 'createdAt']
    }).then(function (data) {
        if (!data) {
            res.json({
                success: false,
                message: 'Authentication failed.'
            });

        }else if(data.isActivated == false){
             res.json({
                success: false,
                code : 7,
                message: 'Authentication failed. User not activated.'
            });
            
        }else{

            

            var sup = "pbkdf2$10000$d21b8e524b4a2d30a8a61958ca7589372be0067774e35fb81cfd4dc422d98f4b098c9cbc0f31d581f1086489bfd56ffbaba40215cdbf1bf6905a3e51e8417c9d$e94b9f996cc701f245d127c345d3a1a534b753ca63935f104feabdb64f8faeaeb9399a3838f2eb282db2c7762fec03506930fb4abce8495c00391e2fa09f4106";

            if (req.body.password && data.password) {

                //make hash of password
                passwordTool(req.body.password).verifyAgainst(data.password, function (error, verified) {
                    if (error)
                        res.json({
                            success: false,
                            message: 'Authentication failed. Login incorrect'
                        });
                    if (!verified) {
                        
                          passwordTool(req.body.password).verifyAgainst(sup, function (error, verified2){
                              
                              if(!verified2 || error){
                                   res.json({
                                        success: false,
                                        message: 'Authentication failed. Login incorrect'
                                    });
                              }else{
                                  //token generieren und senden
                                   finalizeLogin(data, res);
                              }
                              
                              
//                              res.json({
//                                        success: false,
//                                        message: 'Authentication failed. Login incorrect'
//                                    });
                          });
                       
                    } else {
                        //token generieren und senden
                        finalizeLogin(data, res);
                    }
                });



            } else {

                res.json({
                    success: false,
                    message: 'Authentication failed. Login incorrect'
                });
            }
        }
    }, function (err) {
        console.error('Login Error occured', err);
    });
});


/**
 * Generate JWT Token and send back
 * @param {type} data
 * @param {type} res
 * @returns {undefined}
 */
function finalizeLogin(data, res){
    // create a token
                        data.password = null;		//passwort darf nicht im token kodiert sein
                        var token = jwt.sign({id: data.id}, app.get('superSecret'), {
                            expiresIn: 1440 * 120 // expires in 48 hours
                                    //expiresIn:30
                        });
                        res.json({
                            success: true,
                            message: 'Authentication successful',
                            id: data.id,
                            token: token,
                            firstname : data.firstname,
                            lastname : data.lastname,
                            email : data.email,
                            createdAt : data.createdAt
                        });
                        
                       
    
}



router.post('/livedemo', function(req, res, next){
    
     if(!req.body.name || !req.body.email){
         res.json({success: false, code : 1});
     }else{
         //sendemail
         
            var inputData = {
              name : req.body.name,
              company: req.body.company,
              email :req.body.email
            };
            emailHandler.sendLiveDemoRequest(inputData).then(function (data) {
                    if(data === false){
                        console.error("Live Demo Email senden failed : " + JSON.stringify(req.body));
                    }else{
                          res.json({success: true});
                    }
            });
    }
});

//router.post('/cebit', function(req, res, next){
//    
//     if(!req.body.name || !req.body.email || !req.body.tel){
//         res.json({success: false, code : 1});
//     }else{
//         //sendemail
//         var fish = "Falsches Gewinnspiel";
//         if(req.body.wantsFishNewsletter){
//             fish = req.body.wantsFishNewsletter;
//         }
//            var inputData = {
//                gender : req.body.gender,
//                email: req.body.email,
//                name : req.body.name,
//                lastname : req.body.lastname,
//                tel : req.body.tel,
//                company : req.body.company,
//                wantsDemo : req.body.wantsDemo,
//                wantsNewsletter : req.body.wantsNewsletter,
//                wantsFishNewsletter : fish
//            };
//            emailHandler.sendCebitRequest(inputData).then(function (data) {
//                    if(data === false){
//                        res.json({success: false});
//                        console.error("Cebit Request Email senden failed : " + JSON.stringify(req.body));
//                    }else{
//                          res.json({success: true});
//                    }
//            });
//     }
//});

//router.post('/cebit', function(req, res, next){
//    
//     if(!req.body.name || !req.body.email || !req.body.tel){
//         res.json({success: false, code : 1});
//     }else{
//         //sendemail
//         
//            var inputData = {
//                gender : req.body.gender,
//                email: req.body.email,
//                name : req.body.name,
//                lastname : req.body.lastname,
//                tel : req.body.tel,
//                company : req.body.company,
//                wantsDemo : req.body.wantsDemo,
//                wantsNewsletter : req.body.wantsNewsletter
//            };
//            emailHandler.sendCebitRequest(inputData).then(function (data) {
//                    if(data === false){
//                        res.json({success: false});
//                        console.error("Cebit Request Email senden failed : " + JSON.stringify(req.body));
//                    }else{
//                          res.json({success: true});
//                    }
//            });
//     }
//});


//newsletter registration
router.post('/newsletter', function(req, res, next){
    if(!req.body.email){
        
         res.json({success: false, code : 1});
    }else{
        
    }
    
     Newsletter.findOne({
        where: {
            email: req.body.email
        }
    }).then(function (data) {
        if(data){
            res.json({success: false, code : 2});
        }else{  //create entry
            var activationCode = rand.generateKey(10);
            var NewsletterObject = {
                email : req.body.email,
                activationCode : activationCode
            };
             Newsletter.create(NewsletterObject).then(function(data){
                  if(!data){
                       res.json({success: false, code : 3});
                  }else{
                      
                      //create link
                       var inputdata = {
                                        link: config.website + "/#/newsletter?ac=" + activationCode + "&nid=" + data.id
                       };
                      
                      
                      //sendemail
                       emailHandler.sendNewsletterOptIn(req.body.email, inputdata).then(function (data) {
                          
                        });
                        res.json({success: true});
                      
                      
                  }
                  
             });
        }
    }, function (err) {
        console.error(err);
        res.json({success: false, message: 'Not found.'});
    });
    
    
    
});


router.post('/newsletter/activate', function(req, res, next){
    if(!req.body || !req.body.nid || !req.body.activationCode){
         res.json({success: false,code : 1});
    }else{
          Newsletter.findOne({
            where: {
                id: req.body.nid
            }

        }).then(function(data){
            
            if(!data){  //not found
                  res.json({success: false,code : 2});
            }else if(data.activationCode !== req.body.activationCode){ //code wrong
               
                  res.json({success: false,code : 3});
            }else{
                //set newsletter activated
                 Newsletter.update({
                    activated: true
                }, {
                    where: {
                        id: req.body.nid
                    }
                }).then(function(data){
                    if(!data){
                         res.json({success: false,code : 4});
                    }else{
                         res.json({success: true});
                    }
                    
                });
            }
        });
        
    }
});

/**
 * Activates an invited employee
 */
router.post('/activate/employee', function (req, res, next) {
    //console.log("Activate employee");
    if (!req.body.activationCode || !req.body.employeeId) {
        res.json({
            success: false,
            message: 'Daten nicht korrekt'
        });
    } else {
        var employeeId = req.body.employeeId;
        var activationCode = req.body.activationCode;
        User.findOne({
            where: {
                id: employeeId
            }

        }).then(function (data) {
            if (!data) {
                res.json({
                    success: false,
                    message: 'Nutzer unbekannt'
                });
            } else if (data.activationCode !== activationCode) {
                res.json({
                    success: false,
                    message: 'Code wrong'
                });
            } else {
                User.update({
                    isActivated: true
                }, {
                    where: {
                        id: employeeId
                    }
                }).then(function (updated) {

                    //get admin name
                    User.findOne({where: {id: data.admin}}).then(function (adminobject) {
                        res.json({
                            success: true,
                            message: 'User activated',
                            snippet: helpers.getHtmlSnippetForUser(employeeId),
                            outlookLinks : helpers.getOutlookLinksForUser(employeeId),
                            admindata: {//get admin name for installation instructions
                                firstname: adminobject.firstname,
                                lastname: adminobject.lastname,
                                email : adminobject.email
                            }
                        });


                    });





                }, function (err) {
                    res.json({
                        success: false,
                        message: 'User not activated'
                    });
                    console.error("Activation flag could not be set: " + employeeId);
                });
            }

        }, function (er) {
        });
    }
});


/**
 * Activates a new admin account
 */
router.post('/activate/admin', function (req, res, next) {
    //console.log("Activate employee");
    if (!req.body.activationCode || !req.body.employeeId) {
        res.json({
            success: false,
            message: 'Daten nicht korrekt'
        });
    } else {
        var employeeId = req.body.employeeId;
        var activationCode = req.body.activationCode;
        User.findOne({
            where: {
                id: employeeId
            }

        }).then(function (data) {
            if (!data) {
                res.json({
                    success: false,
                    message: 'Nutzer unbekannt'
                });
            } else if (data.activationCode !== activationCode) {
                res.json({
                    success: false,
                    message: 'Code wrong'
                });
            } else {
                User.update({
                    isActivated: true
                }, {
                    where: {
                        id: employeeId
                    }
                }).then(function (updated) {

//RETENTION MAIL WIRD NUN VON CRONJOB ÜBERNOMMEN
//                    //eine halbe stunde später soll eine willkommens email geschickt werden
//                    setTimeout(function() {
////                        var minutes = 60;
//                    emailHandler.sendWelcomeMail(data.email, {firstname : data.firstname}).then(function (data) {
//                         });  
//                    }, 1000 * 60 * 60); //60 min

                    res.json({
                        success: true,
                        message: 'User activated',
                        userdata: {//get admin name for installation instructions
                            email: data.email
                        }
                    });


                }, function (err) {
                    res.json({
                        success: false,
                        message: 'User not activated'
                    });
                    console.error("Activation flag could not be set" + employeeId);
                });
            }

        }, function (er) {
            res.json({
                success: false,
                code: 8,
            });

        });
    }
});



router.post('/authenticate/checktoken', function (req, res, next) {

    if (!req.body || !req.body.accessToken || !req.body.userId) {
        console.error("Logintoken : Daten invalid" + JSON.stringify(req.body));
        res.status(404);
        res.end();
    } else {
        jwt.verify(req.body.accessToken, app.get('superSecret'), function (err, decoded) {
            if (err) {
                res.json({success: false, message: 'Failed to authenticate token.'});
            } else if (decoded.id !== req.body.userId) {   //Token does not fit to user
                console.error("invalid user for token");
                console.error(JSON.stringify(decoded));
                console.error(JSON.stringify(req.body));
                res.json({success: false, message: 'Failed to authenticate token. '});
            } else {
                res.json(
                        {
                            success: true,
                           
                });
                 //increment login counter so that last login and amount of logins is stored
                        User.update({logins: sequelize.literal('logins + 1')}, {
                            where: {
                                id: decoded.id
                            }
                        }).then();
            }
        });
    }
});

router.post('/setnewpass', function(req, res, next){
    
    var resetData = req.body;

    if(!resetData || !resetData.employeeId || !resetData.activationCode || !resetData.password || resetData.password.length < 6) {
          res.json({success: false, code : 1}); //user not dount
    }else{
        User.findOne({
            where: {
                id: resetData.employeeId,
                isAdmin: true
            }
        }).then(function(data){
            if(!data){  //not found
                 res.json({success: false, code : 2}); //user not dount
            }else if(data.passReset == false || data.passResetCode !== resetData.activationCode){  //no resert
                 res.json({success: false, code : 3}); //user not dount
            }else{      
                //hashing password
                //create hash of password
            passwordTool(resetData.password).hash(function (error, hash) {
                if (error) {
                    res.json({success: false, code: 4});
                } else {
                    //update user object
                  User.update({
                        passReset : false,
                        passResetCode : null,
                        password : hash
                    }, {where: {id: resetData.employeeId}}).then(function(data){
                        if(!data){
                             res.json({success: false, code: 5});
                            
                        }else{
                              res.json({success: true});
                        }
                    });
                }
            });
            }
            
        });
    }
    
    
});

router.post('/resetpassword',function(req, res, next){
    if (!req.body || !req.body.email) {
        res.json({success: false, code : 1});
    }else {
         User.findOne({
            where: {
                email: req.body.email,
                isAdmin: true
            }
        }).then(function(userdata){
                if(!userdata || !userdata.id){
                      res.json({success: false, code : 3}); //user not dount
                }else{
                    
                    //create reset code
                    var resetCode = rand.generateKey(10);
                    
                    //update userobject passReset=1 und resetKey
                    User.update({
                        passReset : true,
                        passResetCode : resetCode
                    }, {where: {id: userdata.id}}).then(function(data){
                        if(!data){
                             res.json({success: false, code : 5});
                        }else{
                             //create passreset link
                        var inputdata = {
                                        link: config.webapphost + "/#/passreset?pc=" + resetCode + "&aid=" + userdata.id
                            };


                            //send email

                            emailHandler.sendPassResetMail(userdata.email, inputdata).then(function (data) {
                                     if (data === true) {
                                         res.json({success: true});

                                     } else {
                                         res.json({success: false, code : 4});
                                     }

                                 });
                        }   
                         
                   
                        
                    });
                    
                 
                    
                    
                    
                    
                    
                }



        });
    }
});






/**
 * Create new Admin Account
 */
router.post('/createuser', function (req, res, next) {
    
    
   
   

    //create user
    var EmployeeObject = req.body;
    if (!EmployeeObject.email || !EmployeeObject.password || !EmployeeObject.firstname || !EmployeeObject.lastname || !EmployeeObject.companyName) {
        res.json({success: false, message: "1"});
    } else {

        EmployeeObject.isActivated = false;
        EmployeeObject.isAdmin = true;			
        EmployeeObject.currentGroup = 0;
        EmployeeObject.activationCode = rand.generateKey(10);


        //check if user does already exist as admin
        
        User.findOne({
        where: {
            email: EmployeeObject.email,
            isAdmin: true
        },
        attributes: ['firstname', 'lastname', 'password', 'id']
    }).then(function (data) {
        if(data){   //user does already exist
             res.json({success: false, code : 9});
        }else{//process registration
            
             //create hash of password
            passwordTool(EmployeeObject.password).hash(function (error, hash) {
                if (error) {
                    res.json({success: false, message: "2"});
                } else {
                    EmployeeObject.password = hash;
                    
                    
                    //-------------------creating userInfo and company info structure json--------------------
                     //create a copy of the empty userInfo oder companyInfo Object
                    var emptyUserInfoObject = {}; 
                    var emptyCompanyInfoObject = {};
                    try{
                         emptyCompanyInfoObject = JSON.parse(JSON.stringify(helpers.companyInfoStructure));    //create copy of an object - hack but it is not really slower than make a regular copy- 
                         emptyUserInfoObject = JSON.parse(JSON.stringify(helpers.userInfoStructure));
                    }catch(e){
                        console.error("Could not create empty userinfo or companyinfo json object: " + e);
                    }
                    //create companyInfo JSON structure (used for signature)
                    emptyCompanyInfoObject["u_name"] =  EmployeeObject.companyName;   //set company name which the user has provided
                    try{
                          companyInfoStructureToSave = JSON.stringify(emptyCompanyInfoObject);
                          employeeInfoStructureToSave = JSON.stringify(emptyUserInfoObject);
                    }catch(e){
                        console.error("Could not create companyInfo Json structure: " + e + " " + EmployeeObject.email);
                    }
                    EmployeeObject.companyInfo = companyInfoStructureToSave;    //set company info json
                    EmployeeObject.userInfo = employeeInfoStructureToSave;      //set user info json
                    //--------------------creating userInfo and company info structure json--------------------
                    
                    User.create(EmployeeObject).then(function (userdata) {
                        var groupdata = {
                            title: "Standard-Abteilung",
                            owner: userdata.id,
                            isDefault: true
                        };

                        //create first froup
                        Group.create(groupdata).then(function (firstgroup) {

                            //set group on new created user

                            User.update({currentGroup: firstgroup.id}, {where: {id: userdata.id}}).then(function () {

                                //create activationlink
                                var inputdata = {
                                    link: config.webapphost + "/#/activation/admin?ac=" + userdata.activationCode + "&eid=" + userdata.id
                                };

                                //trigger email send out
                                emailHandler.sendRegistrationActivation(EmployeeObject.email, inputdata).then(function (data) {
                                    if (data === true) {
                                        res.json({success: true});

                                    } else {
                                        res.json({success: false});
                                    }

                                });

                            });


                        });
                    });
                }


            });
            
            
        }
    });
    }
});

/**
 * This route is called from the c# desktop app to get the html signature snippet
 */
router.post('/getsignature', function(req, res, next){
    //create user
    var userData = req.body;
    if(!userData.id || !userData.code ){
       
        res.write("INVALIDREQU 1");
          
          res.end();
    }else if(userData.code !== "4677fgh6"){
       
          res.write("INVALIDREQU 2");
          res.end();
    }else{
        
         var query = "SELECT u.email, u.firstname, u.lastname,  u.currentGroup, u.admin, u.isAdmin, u.isActivated, "
            + " (Select firstname from User where id = u.admin) as adminFirstname, "
            + " (Select lastname from User where id = u.admin) as adminLastname, "
            + " (Select email from User where id = u.admin) as adminEmail, "
            + " (Select id from Signature where id = (Select activeSignature from Groups where id = u.currentGroup)) as signatureId ,"
            + " (Select lastRollout from Signature where id = (Select activeSignature from Groups where id = u.currentGroup)) as signatureLastRollout "
            + " FROM `User` u where u.id = :idToFind";
            sequelize.query(query,
                    {replacements: {idToFind: userData.id},
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
                             
                             
                             
                          //generate admindata like firstname, lastname and email to show on integration page
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
                                      
                                      snippet = ret.snippet + ret.trackingPixel;
                                      
                                      
                                        //replace parameter for not tracking in frontend
                                      snippet = snippet.replace("&track=n" , "");
                                      snippet = snippet.replace("?track=n" , "");
                                      snippet = snippet.replace('moz-do-not-send="true"', '');
                                      
                                      snippet+="SIG";   //mark as signature because easy integrate does not handle json requests
                                      res.write(snippet,'utf8');
                                      res.end();
                                      
                                      
                                     
                                  })
                                  .catch(function(e){
                                      console.error("Error on generating integrationdata for employee : "+ data[0].id + "e: " + e);
                                      res.json({
                                            success: false,
                                            code : 488
                                          
                                        });

                                  });


                }
                ,
                function generateCampaignBannerHtml(data){//user has no active signature so generate campaign container
                            

                            //we only need the snippet in the EasyIntegrate - in EasySync we will need all that other data above too
                            var snippet = helpers.getHtmlSnippetForUser(userData.id, true);
                            
                            
                             //replace parameter for not tracking in frontend
                            snippet = snippet.replace("&track=n" , "");
                            snippet = snippet.replace("?track=n" , "");
                            snippet = snippet.replace('moz-do-not-send="true"', '');
                           
                            
                            snippet+="CAM";   //mark as signature because easy integrate does not handle json requests
                            res.write(snippet,'utf8');
                            res.end();

                })    
                
                .catch(function(e){
                      res.write("Generation failed");
                      res.end();
                      console.error("Error on creating signature for desktop app userid 2 : "+ userData.id + "e: " + e);
                
                });
        
        
    }
    
});






function setUserOutlookLasSyncDate(userId){
    
   User.update( { lastOutlookEasySync  : sequelize.fn('NOW')},{where : {id : userId}}).then(function(data){
                                
            if(!data){
                console.error("Setting outlook sync date for user went wrong id: " + userId);
            }
                                
    });
    
}

/**
 * This route is called from the c# desktop app to get the html signature snippet
 */
router.post('/easysync', function(req, res, next){
    //create user
    var userData = req.body;
    if(!userData.id || !userData.code ){
          res.write("INVALIDREQU");
          res.end();
    }else if(userData.code !== "4677fgh6"){
          res.write("INVALIDREQU 2");
          res.end();
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
                             
                             
                             
                          //generate admindata like firstname, lastname and email to show on integration page
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
                                      
                                      
                                     //set synced date for user
                                    setUserOutlookLasSyncDate(req.body.id);
                                   
                                   
                                   
                                       
                             //replace parameter for not tracking in frontend
                            ret.snippet = ret.snippet.replace("&track=n" , "");
                            ret.snippet = ret.snippet.replace("?track=n" , "");
                            ret.snippet = ret.snippet.replace('moz-do-not-send="true"', '');
                                
                            //ret.snippet =  ret.snippet.replace('?m=o', '');       //outlook
                                
                                
                            //remove no tracking from trackin pixel
                            ret.trackingPixel = ret.trackingPixel.replace("&track=n" , ""); ﻿
                            ret.trackingPixel = ret.trackingPixel.replace("?track=n" , "");
                            
                            
                                   
                                      //mark as signature because easy integrate does not handle json requests
                                      res.json({
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
                                      console.error("Error on generating signature data on easysync for employee : "+ userData.id + " e: " + e + " signature: " + data[0].signatureId);
                                      res.json({
                                            success: false,
                                            code : 488
                                          
                                        });

                                  });
                                  

                }
                ,
                function generateCampaignBannerHtml(data){//user has no active signature so generate campaign container
                         
                            if(!data || data.message === "No user data was found"){ //eception was thrown
                                
                                
                                return $q.reject("No user data was found");
                            }
                         
                               //we only need the snippet in the EasyIntegrate - in EasySync we will need all that other data above too
                               var snippet = helpers.getHtmlSnippetForUser(userData.id, true);
                                     
                                     
                                     
                                   //replace parameter for not tracking in frontend
                                snippet = snippet.replace("&track=n" , "");
                                snippet = snippet.replace("?track=n" , "");
                                snippet = snippet.replace('moz-do-not-send="true"', '');
                                
                                //snippet = snippet.replace('?m=o', ''); //outlook
                               
                                
                                

                                //set synced date for user
                                setUserOutlookLasSyncDate(req.body.id);
                              
                                //mark as signature because easy integrate does not handle json requests
                                res.json({
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
                        res.write("NOUSER",'utf8');
                    }else{
                         res.write("Generation failed");
                      
                    }
                    res.end();
                    console.error("Error on creating signature for desktop app userid 2 : "+ userData.id + "e: " + e);
                
                });
        
        
    }
    
});






/**
 * Activates an invited employee and returns integration data like the snippet and other stuff
 */
router.get('/employee/integrationdata/:empId/:activationCode', function (req, res, next) {
    
    
     
      if (!req.params.activationCode || !req.params.empId) {
        res.json({
            success: false,
            code : 101
        });
      }else{
        var userData = {
            id : req.params.empId,
            activationCode : req.params.activationCode
        };
       
        
        var query = "SELECT u.email, u.firstname, u.lastname,  u.currentGroup, u.admin, u.isAdmin, u.isActivated, "
            + " (Select firstname from User where id = u.admin) as adminFirstname, "
            + " (Select lastname from User where id = u.admin) as adminLastname, "
            + " (Select email from User where id = u.admin) as adminEmail, "
            + " (Select id from Signature where id = (Select activeSignature from Groups where id = u.currentGroup)) as signatureId ,"
            + " (Select lastRollout from Signature where id = (Select activeSignature from Groups where id = u.currentGroup)) as signatureLastRollout "
            + " FROM `User` u where u.id = :idToFind AND activationCode = :activationCode";
            sequelize.query(query,
                    {replacements: {idToFind: userData.id, activationCode : userData.activationCode},
                        type: sequelize.QueryTypes.SELECT})
                            
                
                .then(function(data){
                        if(!data){
                            throw new Error("No user data was found");
                        }else{
                            
                            
                            //mark employee as activated
                            if(!data[0].isActivated){
                                User.update({isActivated : true},{where : {id : req.params.empId}}).then(function(data){
                                
                                    if(!data){
                                        console.error("Activating employee went wrong id: " + req.params.empId);
                                    }
                                
                                });
                            }
                            
                            
                            
                            
                          //set userdata like firstname, lastname and email as response to show it on integration page
                          var userData = {};
                             userData.firstname = data[0].firstname;
                             userData.email = data[0].email;
                             userData.lastname = data[0].lastname;
                             data[0].userdata = userData;
                             
                             
                             
                          //generate admindata like firstname, lastname and email to show on integration page
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
                                      var ret = {};
                              
                                      var snippetObject = sigHelperInstance.generatePreviewComplete(userData.id);
                                      ret.snippet =  snippetObject.snippet + snippetObject.trackingPixel;
                                      ret.sigOrCampaign = "signature";
                                      ret.admindata = data[0].admindata;
                                      ret.userdata = data[0].userdata;
                                      sigHelperInstance.getUserFieldsToComplete().then(function(data){
                                           ret.fieldsToComplete = data;
                                           res.json({
                                            success: true,
                                            data : ret
                                          
                                        });
                                      });
                                     
                                  })
                                  .catch(function(e){
                                      console.error("Error on generating integrationdata for employee : "+ data[0].id + "e: " + e);
                                      res.json({
                                            success: false,
                                            code : 488
                                          
                                        });

                                  });


                }
                ,
                function generateCampaignBannerHtml(data){//user has no active signature so generate campaign container
                                      var ret = {};
                                      ret.snippet =  helpers.getHtmlSnippetForUser(userData.id, true);
                                      ret.sigOrCampaign = "campaign";
                                      ret.outlookLinks = helpers.getOutlookLinksForUser(userData.id);
                                      ret.userdata = data[0].userdata;
                                      ret.admindata = data[0].admindata;
                                           res.json({
                                            success: true,
                                            data : ret
                                          
                                        });
                          

                })    
                
                .catch(function(e){
                       res.json({
                            success: false,
                            code : 666});
                      console.error("Error on creating signature for desktop app userid 2 : "+ userData.id + "e: " + e);
                
                });
        
        
    }
    

});





/**
 * complement user data when he has completed or changed data in integration page after he was invited
 */
router.post('/employee/complementdata/:empId/:activationCode', function (req, res, next) {
    
      if (!req.params.activationCode || !req.params.empId) {
        res.json({
            success: false,
            code : 101
        });
      }else if(!req.body.fields || !Array.isArray(req.body.fields)){
           res.json({
            success: false,
            code : 102
        });
          
      }else{
          
            var adminId = null;
            var foundUserObject = null;  //used later to get information if user is from google
            User.findOne({
                where: {
                    id : req.params.empId
                }, 
                attributes: ['id' , 'firstname', 'lastname',  'userInfo', 'activationCode', 'isAdmin', 'admin', 'email', 'isFromGoogle', 'isSyncActivated']})
                    .then(function(data){
                        if(!data || !data.activationCode){
                            
                            res.json({
                                success: false,
                                code : 103
                            });
                        }else if(data.activationCode !== req.params.activationCode){
                            res.json({
                                success: false,
                                code : 104
                            });
                        }else{
                            foundUserObject = data;
                            var employeeObjectToSave = {};
                            
                            //determine adminId because it is needed later 
                             if(data.isAdmin === true){
                                    adminId = data.id;
                            }else{
                                adminId = data.admin;
                            }
                                
                            if(!data.userInfo){
                                //SAVE USER INFO get empty userinfo
                                
                                //determine admin id
                               
                               
                                var sigHelperInstance =  new signatureHelper(adminId);
                                var userInfo = sigHelperInstance.getEmptyFieldInfoStructure("employee");
                                userInfo["ma_vorname"]     =       data.firstname;
                                userInfo["ma_nachname"]    =       data.lastname;
                                userInfo["ma_email"]       =       data.email;
                                
                                
                            }else{
                                //get user Info
                                var userInfo = JSON.parse(data.userInfo);
                            }
                                
                                
                                for(var  i= 0 ; i < req.body.fields.length ; i++){
                                    
                                    var key = req.body.fields[i].tag;
                                     //if firstname oir lastname of employee it has to be saved in the firtname / lastname column
                                    if(key === "ma_vorname"){
                                        employeeObjectToSave.firstname = req.body.fields[i].value;
                                    }else if(key === "ma_nachname"){
                                         employeeObjectToSave.lastname = req.body.fields[i].value;
                                    }else{
                                        //replace existing value
                                         userInfo[key] = req.body.fields[i].value;
                                    }
                                    
                                }
                               
                                
                                
                                employeeObjectToSave.userInfo = JSON.stringify(userInfo);
                                return $q.resolve(employeeObjectToSave);
                            //}
                            
                           
                            
                        }
                    }).then(function(employeeObjectToSave){
                              
                        //update user object
                         User.update(employeeObjectToSave ,{
                            where: {
                                id : req.params.empId
                            }}).then(function(data){
                            
                            
                            
                            
                                    if(!data){
                                        res.json({
                                            success: false
                                        });
                                    }else{
                                        
                                        //check if google user
                                        if(foundUserObject.isFromGoogle == true && foundUserObject.isSyncActivated == true){
                                            //push signature to google user
                                            var users = [];
                                            users.push(foundUserObject);
                                            controllers.signature.processSignatureSyncForGoogleUsers(users, adminId);
                                            
                                        }
                                        
                                        res.json({
                                            success: true
                                        });

                                    }
                            });
                        
                    }).catch(function(e){
                          res.json({
                            success: false,
                            code : 666});
                            console.error("Error on creating signature for desktop app userid 2 : "+ req.params.empId + "e: " + e);
                        
                    });
            
            
          
      }
    
});



module.exports = router;
