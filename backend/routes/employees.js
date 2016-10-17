var express = require('express');
var router = express.Router();
bodyParser = require('body-parser'), //parses information from POST
methodOverride = require('method-override'); //used to manipulate POST
var rand = require("generate-key");
var emailHandler = require('../helpers/mailhandler');
var helpers = require('../helpers/helperfunctions');
var Q = require('q');
var fs = require("fs"); 
var async = require("async");


/* GET users listing. */
router.get('/', function (req, res, next) {
    //res.end("Hallo");


    sequelize.query("SELECT u.email, u.firstname, u.lastname, u.id, u.isAdmin, u.currentGroup,  u.signatureActivated, u.signatureActivatedAt, u.userInfoUpdatedAt, u.signatureLastRollout ," + 
                    "u.isSyncActivated,  u.isSyncAdmin ,  u.syncAdmin ,  u.adminEmail ,  u.isAutoSync ,  u.isFromGoogle  ,  u.isActivated"
            + ",(Select count(*) from View where userId = u.id) as views,"
            + "(Select count(*) from Click where userId = u.id) as clicks, "
            + "(Select title from Groups where id = u.currentGroup) as groupTitle, "
            +"(select companyInfoUpdatedAt from User where (id = u.admin OR  (id = u.id AND u.isAdmin = 1))) as companyInfoUpdatedAt, "
            +"(select signatureUpdatedAt from Signature where id = (Select id from Signature where id = (Select activeSignature from Groups where id = u.currentGroup))) as signatureUpdatedAt, "
    +"(select lastRollout from Signature where id = (Select id from Signature where id = (Select activeSignature from Groups where id = u.currentGroup))) as lastRolloutOSignatureItself, "
            + "(Select id from Signature where id = (Select activeSignature from Groups where id = u.currentGroup)) as currentSignature, "
            + "(Select title from Signature where id = (Select activeSignature from Groups where id = u.currentGroup)) as currentSignatureTitle, "
            + "(Select title from Campaign where id = (Select activeCampaign from Groups where id = u.currentGroup)) as campaignTitle, "
            + "(Select url from Campaign where id = (Select activeCampaign from Groups where id = u.currentGroup)) as campaignUrl, "
            + "(Select color from Campaign where id = (Select activeCampaign from Groups where id = u.currentGroup)) as campaignColor ,"
            + "(Select image from Campaign where id = (Select activeCampaign from Groups where id = u.currentGroup)) as campaignImage, "
            + "(Select id from Campaign where id = (Select activeCampaign from Groups where id = u.currentGroup)) as campaignId "
            + "FROM `User` u where u.id = :adminId OR admin = :adminId",
            {replacements: {adminId: req.tokendata.id},
                type: sequelize.QueryTypes.SELECT})
            .then(function (employees) {
                // We don't need spread here, since only the results will be returned for select queries
               
             
                return res.json(employees);
            });


});

/**
 * somebody sent feedback with the form in out dashboard
 * @param {type} param1
 * @param {type} param2
 */
router.post('/feedback/webapp', function (req, res) {
    if (!req.body || !req.body.text) {
        res.status(404);
        res.json({success: false, message: 'Invalid Parameters'});
    } else {

        //get user data
        User.findOne({where: {id: req.tokendata.id}}).then(function (user) {
            if (!user) {
                res.json({success: false, message: 'Invalid Parameters'});
                console.error("User Feedback Failed id: " + req.tokendata.id + "text: " + req.body.text);
            } else {
                var feedbackData = {
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email,
                    text: req.body.text
                };
                emailHandler.sendFeedbackFromWebApp(feedbackData).then(function (data) {


                });
                res.json({success: true});
            }

        });
    }
});


/**
 * Save additional user data which is used for signature values and placeholder
 * Firstname and lastname are saved seperately because there are dedicated db columns (because of legacy ^^)
 */
router.post('/userinfo', function (req, res) {
    if (!req.body.userid || !req.body.data) {
        res.json({success: false, message: 'Invalid Parameters'});
    } else {

    //handle firstname and lastname because the values have seperate columns in the db (legacy)
    var userFirstname = req.body.data["ma_vorname"];
    var userLastName = req.body.data["ma_nachname"];


    var json = JSON.stringify(req.body.data);
    console.log(json);
        User.update({userInfo : json,  userInfoUpdatedAt  : sequelize.fn('NOW'), firstname : userFirstname, lastname : userLastName},//save datetime when info was changed to determine if user has to habe an updated signature}, 
            {where: 
                    {
                        $or : [
                            {admin: req.tokendata.id, id : req.body.userid},
                            {isAdmin: true, id : req.body.userid}
                        ]
                    }
            }).then(function(data){
                if(!data){
                      res.json({success: false});
                       console.error("Saving user Info Data failed with no error ");
                }else{
                      res.json({success: true});
                }
                
            }, function(err){
                console.error("Saving user Info Data failed: " + err);
                   res.json({success: false});
                
            });
    }


});



/**
 * Change single value for CompanyInfo or EmployeeInfo JSON structure
 * @param {type} mode employee oder company info
 * @returns {undefined}
 */
function changeSingleInfoValue(req, res, mode){  
    
    //if modeis not employee and not company something went wrong
    var indexWhereDataisStored;
    var indexWhereChangeDatetimeHasToBeStored;
    var idToSearch;
    if(mode === "employee"){
        indexWhereDataisStored = "userInfo";
        indexWhereChangeDatetimeHasToBeStored = "userInfoUpdatedAt";
        idToSearch = req.body.userid;
    }else if(mode === "company"){
        indexWhereDataisStored = "companyInfo";
        indexWhereChangeDatetimeHasToBeStored = "companyInfoUpdatedAt";
        idToSearch = req.tokendata.id;
    }else{
         res.json({success: false, code: 104});
         return;
    }
    
    if (!idToSearch || !req.body.tag ||  req.body.value === null ||  !req.body.type) {
        res.json({success: false, code: 100});
    } else {
    //get user info object
    
    
    
    //load user data to get json structure from user or company
    User.findOne({
        where: 
        {
            $or : [
                {admin: req.tokendata.id, id : idToSearch},
                {isAdmin: true, id : idToSearch}
            ]
        },
        attributes : [
            'userInfo',
            'companyInfo'
        ]
        }).then(function(userObject){
            if(!userObject || !userObject[indexWhereDataisStored]){
                res.json({success: false, code : 101});
            }else{
                
                 //it is a value which is stored in the json structure
                        try{
                            //parse user info object
                            var infoObject = JSON.parse(userObject[indexWhereDataisStored]);
                        }catch(e){
                            res.json({success: false, code : 102});
                            console.error("Parsing JSON User Info:  "+ mode + " " + " ID : " + req.body.userid);
                            return;
                        }
                
                
                
                
                if(req.body.tag === "ma_email"){   //changing employee email is not possible
                      res.json({success: false, code : 105});
                }
                //check if it is the firstname or lastname or email value for an employee. If yes store it directly in the column and not in the JSON structure
                else if(req.body.tag === "ma_vorname" || req.body.tag === "ma_nachname" /*|| req.body.tag === "ma_email"*/){
                    //save it directly into the firstname and lastname column of employee
                    var columnNameToSaveTo;

                    if(req.body.tag === "ma_vorname"){
                        columnNameToSaveTo = "firstname";
                    }else if(req.body.tag === "ma_nachname"){
                         columnNameToSaveTo = "lastname";
                    }
                    var tmpobject = {}; //used to set column to update dynamically
                    tmpobject[columnNameToSaveTo] = req.body.value;
                    
                        //when userinfo or company info is updated than the employee has to be markes as not to have the latest signature via changed date
                        tmpobject["userInfoUpdatedAt"]  = sequelize.fn('NOW');//save datetime when info was changed to determine if user has to habe an updated signature
                    
                    
                    User.update( tmpobject, 
                    {where : { 
                            $or : [
                                        {
                                            admin: req.tokendata.id, id : req.body.userid
                                        },
                                        {
                                            $and : [
                                             {isAdmin: true, id : idToSearch},
                                             {isAdmin: true, id : req.tokendata.id}
                                            ]
                                        }
                                    ]
                    }})
                    .then(function(data){
                        if(!data){  //somethin in the query went wrong
                            res.json({
                                                  success: false,
                                                  code  : 200

                                        });
                        }else if(data[0] !== 1){    //no sql error but no data was updated
                             res.json({
                                                  success: false,
                                                  code  : 201

                                        });
                        }else{  //everything is fine
                            //build user json object because it is expected by frontend
                            infoObject[req.body.tag] = req.body.value;    //set newly set firstname or lastname so that frontend has a correct structure
                            res.json({
                                                  success: true,
                                                  savedObject : infoObject[req.body.tag]

                                        });
                        }

                    });


                }else{
                       
                        //check which type of value it is link or simple key value pair
                        async.series([
                            function(callback){ //replace single value in json object
                                if(req.body.type && req.body.type === "image"){  //field is a simple key value pair
                                    //call process link value
        //                             processImageValue(req.body.value, req.body.tag, req.body.userid);

                                        helpers.signatureHelper.processImageValue(req.body.value, req.body.tag, idToSearch, mode).then(
                                        function resolve(data){ //data is the object with correct image link
                                              infoObject[req.body.tag] = data;
                                              callback();
                                        }
                                        ,
                                        function reject(){
                                              res.json({success: false, code : 103});   
                                              return;
                                        }
                                    );
                                }else{  //is simple text value or link value
                                    infoObject[req.body.tag]  = req.body.value; //set value
                                    callback();
                                };
                            },
                            function(callback){ //save user info object
                                var json = JSON.stringify(infoObject);
                                var dbObject = {};
                                dbObject[indexWhereDataisStored] = json;
                                
                                //when userinfo or company info is updated than the employee has to be markes as not to have the latest signature via changed date
                                dbObject[indexWhereChangeDatetimeHasToBeStored] = sequelize.fn('NOW');  //save datetime when info was changed to determine if user has to have an updated signature
                                


                                User.update(dbObject, 
                                {
                                    where: 
                                        {
                                            $or : [
                                                {
                                                    admin: req.tokendata.id, id : idToSearch},
                                                {
                                                    $and : [
                                                     {isAdmin: true, id : idToSearch},
                                                     {isAdmin: true, id : req.tokendata.id}
                                                    ]
                                                }
                                                
                                               
                                            ]
                                    }
                                }).then(function(data){
                                    if(!data){
                                          res.json({success: false});
                                           console.error("Saving user Info Data failed with no error ");
                                    }else{
                                          res.json({
                                              success: true,
                                              savedObject : infoObject[req.body.tag]

                                    });
                                    }

                                }, function(err){
                                    console.error("Saving user Info Data failed: " + err);
                                       res.json({success: false});

                                });
                            }
                         ]);
                }
                
 
            }
            
        });
        
    

    }
    
};






/**
 * Save only one additional user info value used for signatures.
 * Primarily needed for link field
 */
router.post('/userinfo/single', function (req, res) {
    changeSingleInfoValue(req, res, "employee");
});


/**
 * Save only one additional user info value used for signatures.
 * Primarily needed for link field
 */
router.post('/companyinfo/single', function (req, res) {
    changeSingleInfoValue(req, res, "company");
});

router.get('/getGoogleSyncUsersID/:adminID/:syncAdminEmail', function (req, res, next) {
    if (!req.params.adminID && !req.params.syncAdminEmail) {
        res.status(404);
        res.end();
    } else {
        var SyncAdminEmail = req.params.syncAdminEmail;
        var adminID = req.params.adminID;

        var query = "SELECT u.email, u.firstname, u.lastname, u.id, u.isAdmin, u.currentGroup, u.userInfo, u.signatureActivated, u.signatureActivatedAt, u.userInfoUpdatedAt, u.signatureLastRollout, u.signatureActivated, u.signatureActivatedAt, u.isFromGoogle, u.isAutoSync, u.adminEmail, u.isSyncAdmin, u.createdAt, u.updatedAt, u.syncAdmin, u.isSyncActivated "
                
                + "FROM `User` u where u.adminEmail = :SyncAdminEmail AND (admin = :adminID || (isAdmin = 1 AND id = :adminID))";


        sequelize.query(query,
                {
                    replacements: { adminID: adminID, SyncAdminEmail: SyncAdminEmail },
                    type: sequelize.QueryTypes.SELECT
                }).then(function (data) {
                    if (!data) {
                        res.json({
                            success: false,
                            message: 'Mitarbeiter ist nicht vorhanden.'
                        });
                    } else {
                        res.json(data);
                    }


                });
    }
});




router.get('/:employeeId', function (req, res, next) {
    if (!req.params.employeeId) {
        res.status(404);
        res.end();
    } else {
        var idToFind = req.params.employeeId;
        var query = "SELECT u.email, u.firstname, u.lastname, u.id, u.isAdmin, u.currentGroup, u.userInfo, u.signatureActivated, u.signatureActivatedAt, u.userInfoUpdatedAt, u.signatureLastRollout "
                + ",(Select count(*) from View where userId = u.id) as views,"
                + "(Select count(*) from Click where userId = u.id) as clicks, "
                + "(Select title from Groups where id = u.currentGroup) as groupTitle, "
                + "(Select title from Signature where id = (Select activeSignature from Groups where id = u.currentGroup)) as signatureTitle, "
                +"(select companyInfoUpdatedAt from User where id = u.admin) as companyInfoUpdatedAt, "
                +"(select signatureUpdatedAt from Signature where id = (Select id from Signature where id = (Select activeSignature from Groups where id = u.currentGroup))) as signatureUpdatedAt, "
                +"(select lastRollout from Signature where id = (Select id from Signature where id = (Select activeSignature from Groups where id = u.currentGroup))) as lastRolloutOSignatureItself, "
                + "(Select id from Signature where id = (Select activeSignature from Groups where id = u.currentGroup)) as signatureId, "
                + "(Select title from Campaign where id = (Select activeCampaign from Groups where id = u.currentGroup)) as campaignTitle, "
                + "(Select url from Campaign where id = (Select activeCampaign from Groups where id = u.currentGroup)) as campaignUrl, "
                + "(Select image from Campaign where id = (Select activeCampaign from Groups where id = u.currentGroup)) as campaignImage, "
                + "(Select color from Campaign where id = (Select activeCampaign from Groups where id = u.currentGroup)) as campaignColor "
                + "FROM `User` u where (u.id = :idToFind AND admin = :adminId) OR (u.id = :idToFind AND isAdmin = 1)";


        sequelize.query(query,
                {replacements: {adminId: req.tokendata.id, idToFind: idToFind},
                    type: sequelize.QueryTypes.SELECT}).then(function (data) {
            if (!data) {
                res.json({
                    success: false,
                    message: 'Mitarbeiter ist nicht vorhanden.'
                });
            } else {
                res.json(data);
            }


        });
    }

});



router.post('/snippet', function (req, res) {
    var employeeId = req.tokendata.id;
    var snippedToSend = helpers.getHtmlSnippetForUser(employeeId);
    res.json({success: true,
        snippet: snippedToSend,
        outlookLinks: helpers.getOutlookLinksForUser(employeeId),
        userId: employeeId});
});


router.put('/modify/group', function (req, res) {
    if (!req.body || !req.body.groupId || !req.body.employees || !Array.isArray(req.body.employees) || !req.body.employees.length === 0) {
        res.status(404);
        res.json({success: false, message: 'Invalid Parameters'});
    } else {
        //check if group is own group
        isGroupOwnGroup(req.body.groupId, req.tokendata.id, function (success) {
            if (success === true) {
                User.update({currentGroup: req.body.groupId}, {
                    where:
                            {
                                $or: [
                                    {
                                        id: req.body.employees,
                                        admin: req.tokendata.id,
                                        isAdmin: false
                                    },
                                    {
                                        $and: [
                                            {id: req.tokendata.id},
                                            {id: req.body.employees},
                                            {isAdmin: true},
                                        ]
                                    }
                                ]
                            }
                }).then(function () {

                    res.json({success: true, message: 'Mitarbeiter aktualisiert.'});
                }, function (err) {
                    console.error(err);
                    res.json({success: false, message: 'Mitarbeiter nicht aktualisiert.'});
                });

            } else {
                res.status(403);
                res.json({success: false});
            }

        });
    }
});




router.put('/', function (req, res, next) {
    if (!req.body || !req.body.id) {
        res.status(404);
        res.end();
    } else {
        var employee = req.body;
        User.update(employee, {
            where: {
                $or: [
                    {
                        id: req.body.id,
                        admin: req.tokendata.id,
                        isAdmin: false
                    },
                    {
                        $and: [
                            {id: req.body.id},
                            {id: req.tokendata.id},
                        ]
                    }

                ]

            }
        }).then(function () {

            res.json({success: true, message: 'Mitarbeiter aktualisiert.'});
        }, function (err) {
            console.error(err);
        });
    }
});





router.post('/', function (req, res, next) {

    if (!req.body.email || !req.tokendata.id) {
        res.json({
            success: false,
            message: 'Es wurde keine email angegeben oder die Authentifizierung ist nicht korrekt.'
        });
    } else {
        var EmployeeObject = req.body;


        //check if admin has already an user with this email adress or there is an admin with this adress
        User.findAll({
            where: {
                $or: [
                    {email: req.body.email,
                        admin: req.tokendata.id
                    },
                    {email: req.body.email,
                        isAdmin: true,
                        id: req.tokendata.id
                    }

                ]
            }
        }).then(function (users) {
            if (users.length > 0) {
                res.json({
                    success: false,
                    code: 1
                });
            } else {

                EmployeeObject.isActivated = false;
                EmployeeObject.activationCode = rand.generateKey(10);
                EmployeeObject.admin = req.tokendata.id;
                EmployeeObject.isAdmin = false;			//it is not allowed to create a new admin user
                if (!EmployeeObject.currentGroup) {		//not group is provided so use standard group
                    Group.findOne(
                            {
                                where: {
                                    owner: EmployeeObject.admin,
                                    isDefault: true
                                }
                            }).then(function (data) {
                        if (!data) {
                            console.error("Nutzer anlegen: Standard Gruppe nicht gefunden.");
                            res.status(404);
                            res.end();
                        } else {
                            EmployeeObject.currentGroup = data.id;
                            createEmployee(EmployeeObject, res);
                        }


                    }, function (err) {
                        console.error("Gruppe erstellen: Default-Gruppe wurde nicht gefunden" + err);
                    });

                } else {			//group ist provided

                    //check if group belongs to admin
                    isGroupOwnGroup(EmployeeObject.currentGroup, req.tokendata.id, function (data) {
                        if (data === true) {
                            createEmployee(EmployeeObject, res);
                        } else if (data === false) {
                            res.json({
                                success: false,
                                message: 'Der gewählte Gruppe gehört nicht zum entsprechenden Administrator.'
                            });

                        }
                    });
                }



            }
        });




    }

});

function createEmployee(EmployeeObject, res) {
    User.create(EmployeeObject).then(function (data) {
        if (!data) {
            res.json({
                success: false,
                message: 'Der Mitarbeiter konnte nicht erstellt werden.'
            });
        } else {
//            var activcationCode = EmployeeObject.activationCode;

            //activationcode must be generated on the fly
//             var activcationCode = EmployeeObject.activationCode;

            var employeeId = data.id;

//            var recipient = data.email;
//            var inputData = data;



             res.json({
                        success: true,
                        message: 'E-Mail wurde verschickt.',
                        id : employeeId
                    });

                }


            }, function (er) {
                console.error("Fehler beim Anlegen von Mitarbeiter: " + er);
                  res.json({
                        success: false,
                       code : 104
                    });


            });
}


router.delete('/:employeeId', function (req, res, next) {

    if (!req.params.employeeId) {
        res.status(404);
        res.end();
    } else {
        var employeeId = req.params.employeeId;
        var userEmail = "";
        //get email adresse for employee sending mail

        
        
           User.findOne({where: {
                id: employeeId,
                admin: req.tokendata.id
            }}).then(function (data) {
            if (!data) {
                        res.json({
                            success: false,
                            message: 'Nutzer konnte nicht gelöscht werden.'
                        });
            } else {
                
                userEmail = data.email;
                User.destroy({where: {id: employeeId, admin: req.tokendata.id, isAdmin: false}}).then(function (data) {
                    if (data) {
//                        sendDeletionMails([{email : userEmail}], req.tokendata.id);      //mitarbeiter wurde gelöscht emails
                        res.json({
                            success: true,
                            message: 'Nutzer wurde gelöscht.'
                        });
                    } else {
                        console.error("Mitarbeiter konnte nicht gelöscht werden: " + employeeId);
                        res.json({
                            success: false,
                            message: 'Nutzer konnte nicht gelöscht werden.'
                        });
                    }

                }, function (err) {
                    console.error("Mitarbeiter konnte nicht gelöscht werden"+ employeeId + err);
                    res.json({
                        success: false,
                        message: 'Nutzer konnte nicht gelöscht werden.'
                    });

                });
                
            }});
     }

});

/**
 * Mehrer Mitarbeiter gleichzeitig erzeugen
 */
router.post('/many', function (req, res, next) {
    if (!req.body.empsasjson) {
        res.json({
            success: false,
            code: 0
        });
    } else if (req.body.empsasjson.length < 1) {
        res.json({
            success: false,
            code: 1
        });

    } else {
        var emps = req.body.empsasjson;
        //check if some of the employees already existant
        checkIfAlreadyExistant(emps, req).then(function (data) {
            if (data.success === true) {

                if (data.existentAdresses.length >= emps.length) {   //all given email adresses were already in the system
                    res.json({
                        success: false,
                        code: 76,
                        adresses: data.existentAdresses
                    });
                    return;
                } else {

                    //filter all adressed that are already in the system
                    emps = emps.filter(function (el) {
                        return data.existentAdresses.indexOf(el.Email) < 0;
                    });

                    res.adresses = data.existentAdresses;    //set already existent adresses in response object. will be sent later 
                }




            }


            //get default group if group is not provided
            if (!req.body.group) {
                //get default group
                Group.findOne(
                        {
                            where: {
                                owner: req.tokendata.id,
                                isDefault: true
                            }
                        }).then(function (data) {
                    if (!data) {
                        console.error("Nutzer anlegen: Standard Gruppe nicht gefunden: " + req.tokendata.id);
                        res.json({
                            success: false,
                            code: 2
                        });
                    } else {
                        createManyEmployees(emps, data.id, req, res);
                    }


                }, function (err) {
                    console.error("Gruppe erstellen: Default-Gruppe wurde nicht gefunden" + err);
                    res.json({
                        success: false,
                        code: 3
                    });
                });
            } else {
                //checken ob das eine eigene Gruppe ist
                isGroupOwnGroup(req.body.group, req.tokendata.id, function (data) {
                    if (data === true) {
                        createManyEmployees(emps, req.body.group, req, res);        //mit vorgegebener gruppe erstellen
                    } else {
                        console.error("Nutzer anlegen: Standard Gruppe nicht gefunden.");
                        res.json({
                            success: false,
                            code: 4
                        });
                    }

                });
            }




        });


    }
});

/**
 * Checkt ob die übergebenen Employees aus dem Excel schon existieren.
 * Falls Ja wird die liste der email adresse mit zurückgegeben, Falls nein wird weitergemcht
 * @param {type} emps
 * @param {type} req
 * @returns {unresolved}
 */
function checkIfAlreadyExistant(emps, req) {
    var deferred = Q.defer();

    var emailAdresses = [];

    for (var i = 0; i < emps.length; i++) { //in some cases it is email and in some cases it is Email ->lagacy shit
        if (emps[i].Email) {
            emailAdresses.push(emps[i].Email);
        }else
        if (emps[i].email) {
            emailAdresses.push(emps[i].email);
        }
    }
    if (emailAdresses.length > 0) {
        User.findAll({where: {
                $and: [
                    {email: emailAdresses},
                    {$or: [
                            {admin: req.tokendata.id},
                            {id: req.tokendata.id},
                        ]}
                ]


            }

        }).then(function (data) {
            if (data.length > 0) {
                var existentAdresses = [];
                var uniqueAdresses = [];
                for (var i = 0; i < data.length; i++) {
                    existentAdresses.push(data[i].email);
                }

                //remove duplicated entrys. TODO o(n^2) Laufzeit
                uniqueAdresses = existentAdresses.filter(function (item, pos, self) {
                    return self.indexOf(item) == pos;
                });

                deferred.resolve({success: true, existentAdresses: uniqueAdresses});
            }
            else {
                deferred.resolve({success: false});
            }
        });


    } else {
        deferred.resolve({success: false});
    }

    return deferred.promise;
}


/**
 * Fetches admin data and sends many invitationmails
 * @param {type} emps array of emp objects
 * @param {type} reinvitation
 * @param {type} req
 * @param {type} res
 * @returns {undefined}
 */
//function sendManyInvitationMails(emps,reinvitation req, res) {
//    //get name of invitor
//    User.findOne({where: {isAdmin: true, id: req.tokendata.id}}).then(function (adminobject) {
//        if (!adminobject) {
//            console.error("Invite User: Admin was not found: " + req.tokendata.id);
//            res.json({
//                success: false,
//                code: 9
//            });
//        } else {
//            for (var i = 0; i < emps.length; i++) {
//                var inputData = emps[i];
//                inputData.link = config.webapphost + "/#/activation/employee?ac=" + emps[i].activationCode + "&eid=" + emps[i].id;
//
//                if (!adminobject.firstname) {
//                    inputData.invitor = adminobject.email;
//                } else {
//                    inputData.invitor = adminobject.firstname + " " + adminobject.lastname;
//                }
//                inputData.invitormail = adminobject.email;
//                emailHandler.sendEmployeeInvitation(emps[i].email, inputData).then(function (data) {
//                    if (data === true) {
//
//                    }
//                });
//            }
//            var adressesAlreadyExistent = null; //checken ob addressen schon vorhanden waren beim Importieren
//            if (res.adressesAlreadyExistent) {
//                adressesAlreadyExistent = res.adressesAlreadyExistent;
//            }
//
//            res.json({
//                success: true,
//                adresses: adressesAlreadyExistent,
//                message: 'E-Mail wurde verschickt.'
//            });
//        }
//    });
//}

/**
 * 
 * @param {type} emps die ids der mitarbeiter
 * @param {type} adminid enthält vom admin den namen und email
 * @returns {undefined}
 */
function sendDeletionMails(emps, adminid) {
//    //admin info für die email
//    User.findOne({where: {
//            id: adminid,
//        }}).then(function (adminobject) {
//        if (!adminobject || !adminobject.email) {
//            console.error("Deletionmail konnte nicht geshcickt werden 1" + JSON.stringify(emps) + adminid);
//            return;
//        } else {
//            var inputData = {};
//            if (!adminobject.firstname) {
//                inputData.invitor = adminobject.email;
//            } else {
//                inputData.invitor = adminobject.firstname + " " + adminobject.lastname;
//            }
//            inputData.invitormail = adminobject.email;
//
////            //send mails
////            for (var i = 0; i < emps.length; i++) {
////                emailHandler.sendEmployeeDeletionInfo(emps[i].email, inputData);
////            }
//
//        }
//    });
}

//create many employeed at once
function createManyEmployees(emps, groupId, req, res) {
    var employeeObjects = [];
    for (var i = 0; i < emps.length; i++) {
        employeeObjects.push({
            email: emps[i].Email,
            firstname: emps[i].Vorname,
            lastname: emps[i].Nachname,
            isActivated: false,
            isAdmin: false,
            admin: req.tokendata.id,
            currentGroup: groupId,
            activationCode: rand.generateKey(10)
        });
    }

    //console.log("EXCEL DATA: " + JSON.stringify(employeeObjects));
    User.bulkCreate(employeeObjects).then(function (data) {
// nope bar, you can't be admin!



        //fetch all ids from newly created emps
        //newly created emp ids. Needed in front end to send invitations after wards
        var newEmpIDs = [];
        for (var i = 0; i < data.length; i++) {
            newEmpIDs.push(
              data[i].id
            );
        }
        
        
       
        
         //return success
         //all adresses that were already in the system were set in the last function
         res.json({
                success: true,
                idsAdded :  newEmpIDs,    //newly created emp ids. Needed in front end to send invitations after wards
                adresses : res.adresses
            });


        //we dont send the invitation mail on adding the employees directly but only when user rolls out campaign or signature
        // helpers.invitationHelper.sendManyInvitationMails(newEmps, req, res);
        
        
    }, function (err) {
        if (err) {
            console.error(err);
            res.json({
                success: false,
                code: 4
            });
        }
    });
}
;



/**
 * set user which is already im mailtastic but not synced with google as a google user
 */
router.post('/managedByGoogle', function(req, res, next){
     if (!req.body || !req.body.employeeObject) {
        res.json({
            success: false,
            code: 0
        });
    } else {
        var employeeObject = req.body.employeeObject;
        
       CompanyInfo.findOne({where : {admin : req.tokendata.id }})
               .then(function(companyInfo){
                   if(!companyInfo){
                      return Q.reject();
                       
                   }else{
                         return Q.resolve(companyInfo);
                   }
                   
                   
                })
                .then(function(companyInfo){
                    
                    var objectToUpdate = {
                        
                        isFromGoogle : true,
                        adminEmail : companyInfo.syncAdminEmail,
                        syncAdmin : req.tokendata.id,
                        isSyncActivated : true,
                        isSyncAdmin : employeeObject.isSyncAdmin
                        
                    };
                    
                    return User.update(objectToUpdate, 
                    {
                        where : 
                                { 
                                    $or : [
                                            {admin : req.tokendata.id, id : employeeObject.id},
                                            {isAdmin : true, id : employeeObject.id}
                                    ]
                                    
                                }
                    })
                    
                    
                })
                .then(function(data){
                    if(!data){
                         res.json({
                            success : false,
                            code : 102
                            
                            
                        });
                        
                    }else{
                        res.json({
                            success : true,
                            
                            
                        });
                        
                    }
                    
                })
                .catch(function(e){
                    console.error("Error on route managedByGoogle : " + e);
                    
                        res.json({
                            success : false,
                            code : 103  
                            
                            
                        });

                })

    } 
    
});

/**
add Employee by Google Sync
*/
/**
 * Mehrer Mitarbeiter gleichzeitig erzeugen
 */
router.post('/manySyncUsers', function (req, res, next) {
    if (!req.body.empsasjson) {
        res.json({
            success: false,
            code: 0
        });
    } else if (req.body.empsasjson.length < 1) {
        res.json({
            success: false,
            code: 1
        });

    } else {
        var emps = req.body.empsasjson;
        //check if some of the employees already existant
        checkIfAlreadyExistant(emps, req).then(function (data) {
            if (data.success === true) {

                if (data.existentAdresses.length >= emps.length) {   //all given email adresses were already in the system
                    res.json({
                        success: false,
                        code: 76,
                        adresses: data.existentAdresses
                    });
                    return;
                } else {

                    //filter all adressed that are already in the system
                    emps = emps.filter(function (el) {
                        return data.existentAdresses.indexOf(el.email) < 0;
                    });

                    res.adressesAlreadyExistent = data.existentAdresses;    //set already existent adresses in response object. will be sent later 
                }




            }


            //get default group if group is not provided
            if (!req.body.group) {
                //get default group
                Group.findOne(
                        {
                            where: {
                                owner: req.tokendata.id,
                                isDefault: true
                            }
                        }).then(function (data) {
                            if (!data) {
                                console.error("Nutzer anlegen: Standard Gruppe nicht gefunden: " + req.tokendata.id);
                                res.json({
                                    success: false,
                                    code: 2
                                });
                            } else {
                                createSyncUsers(emps, data.id, req, res);
                            }


                        }, function (err) {
                            console.error("Gruppe erstellen: Default-Gruppe wurde nicht gefunden" + err);
                            res.json({
                                success: false,
                                code: 3
                            });
                        });
            } else {
                //checken ob das eine eigene Gruppe ist
                isGroupOwnGroup(req.body.group, req.tokendata.id, function (data) {
                    if (data === true) {
                        createSyncUsers(emps, req.body.group, req, res);        //mit vorgegebener gruppe erstellen
                    } else {
                        console.error("Nutzer anlegen: Standard Gruppe nicht gefunden.");
                        res.json({
                            success: false,
                            code: 4
                        });
                    }

                });
            }

        });


    }
});



//create google synced users
function createSyncUsers(emps, groupId, req, res) {
    //given groupId must always be the default group id
    
    //generate employee object
    var newEmployeeObjects = [];
    var alreadyEmployeeObjects = [];
    var alreadyEmpsIds = [];
    for (var i = 0; i < emps.length; i++) {
        if (emps[i].id == '' || !emps[i].id) {
            
            var groupToTake =  emps[i].currentGroup ||  groupId;
            newEmployeeObjects.push({
                email: emps[i].email,
                firstname: emps[i].firstname,
                lastname: emps[i].lastname,
                isActivated: false,
                isAdmin: false,
                admin: req.tokendata.id,
                currentGroup: groupToTake,
                isFromGoogle: emps[i].isFromGoogle,
                isAutoSync: emps[i].isAutoSync,
                adminEmail: emps[i].adminEmail,
                isSyncAdmin: emps[i].isSyncAdmin,
                syncAdmin: req.tokendata.id,
                activationCode: rand.generateKey(10),
                isSyncActivated: true
            });
        }
        else {
            alreadyEmpsIds.push(emps[i].id);
        }

    }

    var createdEmployees;
    //create employee objects
    User.bulkCreate(newEmployeeObjects)
            
    .then(function (data)
    {
        createdEmployees = data;
        // nope bar, you can't be admin!
        //all users which were already in the mailtastic system are not google sync users...should not happen often
        return User.update({ isSyncActivated: true, currentGroup: groupId }, {
            where: {
                id: alreadyEmpsIds,
                isAdmin: false
            }})
    }).then(function (updateData) {
        //fetch all ids from newly created emps
        //newly created emp ids. Needed in front end to send invitations after wards
        var newEmpIDs = [];
        for (var i = 0; i < createdEmployees.length; i++) {
            newEmpIDs.push({
                id :createdEmployees[i].id,
                email :createdEmployees[i].email
            }
              
            );
        }
        //return success
        //all adresses that were already in the system were set in the last function
        res.json({
            success: true,
            empsAdded: newEmpIDs    //newly created emp ids. Needed in front end to send invitations after wards. 
        });
    })
    .catch(function(e){

        console.error(err);
        res.json({ success: false, code: 201 });

    });

}
;




/**
 *delete many employees at once
 */
router.post('/del/many', function (req, res, next) {

    if (!req.body.empids || !Array.isArray(req.body.empids)) {
        res.status(404);
        res.end();
    } else {
        var employeeIds = req.body.empids;
        var employeeObjectsToDelete = [];       //enthält die zu löschenden Employeeobjekte da sie zum senden der deletionmail gebraucht werden
        
        //zu löschende Objekte zwischen speichern
        User.findAll({where: {
                id: employeeIds,
                admin: req.tokendata.id
            }}).then(function (data) {
            if (!data) {
                        res.json({
                            success: false,
                            message: 'Nutzer konnte nicht gelöscht werden.'
                        });
            } else {
                employeeObjectsToDelete = data;
                User.destroy({where: {id: employeeIds, admin: req.tokendata.id, isAdmin: false}}).then(function (data) {
                    if (data) {
                        //Emails senden an die Mitarbeiter die gelöscht wurden
//                        sendDeletionMails(employeeObjectsToDelete, req.tokendata.id);
                        res.json({
                            success: true,
                            message: 'Nutzer wurde gelöscht.'
                        });
                    } else {
                        console.error("Mitarbeiter konnte nicht gelöscht werden: " + JSON.stringify(employeeIds));
                        res.json({
                            success: false,
                            message: 'Nutzer konnte nicht gelöscht werden.'
                        });
                    }

                }, function (err) {
                    console.error("Mitarbeiter konnte nicht gelöscht werden" + err);
                    res.json({
                        success: false,
                        message: 'Nutzer konnte nicht gelöscht werden.'
                    });
                });


            }

        });



    }
});
router.post('/mailclients/other', function (req, res) {
    if (!req.body.client) {

    }
    var userId = null;
    if (req.body.userId) {        //wird von einem mitarbeiter gesendet
        userId = req.body.userId;
    } else {                      //wird vom Admin aus gesendet
        userId = req.tokendata.id;
    }



    User.findOne({where: {id: userId}}).then(function (data) {
        data.client = req.body.client;
        emailHandler.sendOtherMailClientMessage(data).then();
    });
    res.json({
        success: true

    });
});
/**
 * Einladungsmail an den admin verschicken damit man die Einladungsmail testen kann
 */
router.post('/invitation/sendinvitationtestmail', function (req, res) {
    if (!req.tokendata.id) {
        res.status(404);
        res.end();
    } else {
        var inputData = null;
        //check if user is my employee
        User.findAll({where: {id: req.tokendata.id}}).then(function (adminobject) {

            if (adminobject.length === 1) {
                inputData = adminobject[0].dataValues;
                inputData.link = config.webapphost + "/#/activation/employee?ac=" + inputData.activationCode + "&eid=" + inputData.id;
                if (!inputData.firstname) {
                    inputData.invitor = inputData.email;
                } else {
                    inputData.invitor = inputData.firstname + " " + inputData.lastname;
                }
                inputData.invitormail = inputData.email;
                emailHandler.sendEmployeeReinvitation(inputData.email, inputData).then(function (data) {


                });
                res.json({
                    success: true

                });
            }
            else {  //user daten konnten nicht geladen werden
                res.json({
                    success: false,
                    message: 'Nutzer konnte nicht gefunden werden.'
                });
            }
        }, function (err) {
            console.error("Mitarbeiter konnte nicht geladen werden" + err);
            res.json({
                success: false,
                message: 'Nutzer konnte nicht erneut eingeladen werden.'
            });
        });
    }

});




/**
 * get all users with given id managed by logged in admin account included admin himself if its in the ids list
 * @param {type} ids        ids of employees to search for
 * @param {type} adminId    ownAdminAccountId
 */
function getAllUsersWithIdManagedByOwnAccount(ids, adminId){
    var deferred = Q.defer();
    
     User.findAll(     //get all users with given id that are managed by admin accuont
                  {
                      where: {
                          
                          $or : 
                                [
                                      {
                                          isAdmin: false, 
                                          admin: adminId,
                                          id: ids
                                      },
                                      {
                                          $and : [
                                              {
                                                  isAdmin: true, 
                                                  id: adminId
                                              },
                                              {
                                                  isAdmin: true, 
                                                  id: ids
                                              }

                                          ]
                                      }
                                ]
                      }
                  }).then(function (users) {
                       deferred.resolve(users);
                      
                  }).catch(function(e){
                      
                      deferred.reject();
                  });
                  
                  
                  return deferred.promise;
    
};


/**
 * send invitation mails to employees
 * @param {type} req
 * @param {type} res
 * @returns {undefined}
 */
router.post('/invitation/send', function (req, res) {
    if (!req.body.userIds || !Array.isArray(req.body.userIds) || !req.tokendata.id) {
        res.json({
            success: false,
            code : 101
        });
       
    }else{
        var userIds = req.body.userIds;
        var adminId = req.tokendata.id;
        getAllUsersWithIdManagedByOwnAccount(userIds, adminId)
                .then(function(emps){
                    if(!emps || emps.lenght === 0){
                        throw("invitition sending no emps found");
                        res.json({
                            success: false,
                            code : 102
                     });
                    }else{
                        
                        res.json({
                            success: true,
                        });    
                        helpers.invitationHelper.sendManyInvitationMails(emps, req, res, false);
                    }
                    
                })
                .catch(function(e){
                    console.error("Exception catched: " + e);
                        res.json({
                       success: false,
                       code : 103
                });
                    
                });
        
          };
});



/**
 * Resend user invitation mail
 */
router.post('/invitation/resend', function (req, res) {
    if (!req.body.userIds || !Array.isArray(req.body.userIds) || !req.tokendata.id) {
        res.json({
            success: false,
            code : 101
        });
       
    } else {
        var userIds = req.body.userIds;
        var myid = req.tokendata.id;
        var inputData = null;
        //check if user is my employee
        User.findAll({where: 
                        {
                            $or : [
                                    {  
                                        admin: myid, 
                                        id: userIds,
                                        isAdmin : false
                                    },{
                                        $and : [
                                            {  

                                               id : userIds,

                                            },
                                            {
                                                id : myid
                                            }
                                        ]
                                        
                                    }
                                 
                            ]
                        }
                     }).then(function (users) {
                        if (users && users.length > 0) {   //der user gehört zum admin

                            //get invitor data for correct name in email
                            User.findOne({where: {isAdmin: true, id: req.tokendata.id}}).then(function (adminobject) {
                                if (adminobject) {
                                        for(var i = 0; i < users.length ; i++){
                                            inputData = users[i].dataValues;
                                            inputData.link = config.webapphost + "/#/activation/employee?ac=" + inputData.activationCode + "&eid=" + inputData.id;
                                            if (!adminobject.firstname) {
                                                inputData.invitor = adminobject.email;
                                            } else {
                                                inputData.invitor = adminobject.firstname + " " + adminobject.lastname;
                                            }
                                            inputData.invitormail = adminobject.email;
                                            emailHandler.sendEmployeeReinvitation(inputData.email, inputData).then(function (data) {


                                            });
                                            
                                        }
                                        
                                       
                                        
                                        res.json({
                                            success: true

                                        });

                                } else {
                                    res.json({
                                        success: false,
                                        message: 'User was not found'
                                    });
                                }
                            }, function (err) {
                                //resend invitation
                                console.error("Query Error:" + err);
                                res.json({
                                    success: false,
                                    message: 'reinvitation could not be sent'
                                });
                            });
                        } else {
                            res.json({
                                success: false,
                                message: 'No users found'
                            });
                        }
                    }, function (err) {
                        console.error("Query Error:" + err);
                        res.json({
                            success: false,
                            message: 'Reinvitation could not be sent'
                        });
                    });
    }

});






/**
 * Create users for versa commerce
 * 
 */

var versaCommerceTemplates = {
        order_confirmation : {
            firstname : "VersaC",
            lastname : "Bestellbest"
        },
        sepa_pre_notification : {
            firstname : "VersaC",
            lastname : "SEPA-Best."
        },
        customer_account_confirmation : {
            firstname : "VersaC",
            lastname : "Kunden-Acc-Best."
        },
        new_password_confirmation : {
            firstname : "VersaC",
            lastname : "Neues-Pass-Best."
        },
        forgotten_password : {
            firstname : "VersaC",
            lastname : "Pass-Vergessen"
        },
        order_canceled_confirmation : {
            firstname : "VersaC",
            lastname : "Bestellung-Storniert"
        },
        order_shipping_confirmation :  {
            firstname : "VersaC",
            lastname : "Bestellung-Verschickt"
        },
        customer_submission : {
            firstname : "VersaC",
            lastname : "Kunde-Submission"
        },
        contact_submission : {
            firstname : "VersaC",
            lastname : "Kontakt-Submission"
        }
    
    };
    
    /**
     * Create users to match mail templates in versa commercs. Versa commerce is a shop system with auto generated mails
     */
router.post('/versacommerce/createmailtplusers', function (req, res) {
    var employeesToCreate = [];
    var groupsToCreate = [];
    var emailDomain = "";
    
    //get email domain from admin
    User.findOne({where : {id : req.tokendata.id}})
                .then(function(admin){
                   
                   
                    if(!admin || !admin.email){
                           return Q.reject("NO admin Email adress found : " + req.tokendata.id)
                    }else{
                        
                            emailDomain = admin.email.split("@");
                            if(!emailDomain || !Array.isArray(emailDomain) ||  emailDomain.length !=2 || !emailDomain[1]){
                                  return Q.reject("Could not determine email domain on creating versa commerce users");
                            }else{
                                emailDomain = emailDomain[1];
                                 return Q.resolve();
                            }
                          
                    }
                })
//                .then(function(emailDomain){
//                    
//                    return new Promise(function (resolve, reject){
//                        
//                        //get default group
//                        Group.findOne({where : {
//                                owner : req.tokendata.id,
//                                isDefault : true
//                        }})
//                        .then(function(group){
//
//
//                            if(!group || !group.id){
//                                return reject("Could not find default group : " + req.tokendata.id)
//
//                            }else{
//                                 return resolve({
//                                     emaildomain : emailDomain,
//                                     defaultGroupId : group.id
//                                 });
//                                 
//                                 emailDomain = emailDomain;
//
//                            }
//                        }).catch(function(e){
//                            return reject(e);
//                        });
//                    });
//                    
//                })
                
                .then(function(){   //create one group for every new user
                        for (var key in versaCommerceTemplates) {
                            var groupTempObject = {};
                            groupTempObject.title = versaCommerceTemplates[key].firstname + " " + versaCommerceTemplates[key].lastname;
                            groupTempObject.isDefault = false;
                            groupTempObject.owner = req.tokendata.id;
                            groupsToCreate.push(groupTempObject);
                        }
                       //return Group.bulkCreate(groupsToCreate);
                       
                      return Q.resolve(groupsToCreate);

                })
                
                .then(function(groupsToCreate){
                    //create all groups and return ids
                    
                       return Promise.all(groupsToCreate.map(function(groupObject) { 
                            return Group.create(groupObject).then(function(result) { 
                                return {
                                    id : result.id,
                                    title :  result.title
                                };
                            });
                        }))
                })
                
                
                .then(function(createdGroups){
                    //create employee objects to create
                    
                    for (var key in versaCommerceTemplates) {
                        var empTempObject = {};
                        empTempObject.firstname = versaCommerceTemplates[key].firstname;
                        empTempObject.lastname = versaCommerceTemplates[key].lastname;
                        empTempObject.email = key + "@" + emailDomain;
                        empTempObject.isAdmin = false;
                        empTempObject.admin = req.tokendata.id;
                        empTempObject.activationCode =    rand.generateKey(10);
                        empTempObject.isActivated = true;
                        
                        var createdGroupId = null;
                        //get id from created group with this name
                        for(var  i = 0 ; i < createdGroups.length ; i++){
                            if(createdGroups[i].title === (versaCommerceTemplates[key].firstname + " " + versaCommerceTemplates[key].lastname)){
                                createdGroupId = createdGroups[i].id;
                                break;;
                            }
                            
                        }
                        if(createdGroupId !== null){
                             empTempObject.currentGroup = createdGroupId;
                             employeesToCreate.push(empTempObject);
                        }else{
                            return Q.reject("could not find created group for versa commerce user");
                            
                        };
                        
                       
        
                     }
                    
                    return Q.resolve(employeesToCreate)
                    
                    
                    
                })
                .then(function(){
                    return User.bulkCreate(employeesToCreate);
                    
                })
                .then(function(data){
                    if(!data){
                        return Q.reject("bulkcreate went wrong");
                    }
                     //everything went ok
             
                    res.json({
                        success : true,
                        usersCreated : data.length
                    });


                })
        
            .catch(function(e){
                console.error("Error on creating versa commerce users for : " + req.tokendata.id + " " + e);
                res.json({
                    success : false,
                    code : 100
                });

            });
});





function isGroupOwnGroup(groupId, userId, callback) {
    Group.findOne({where: {id: groupId}}).then(function (data) {
        if (!data) {
            return callback(false);
        } else if (data.owner === userId) {
            return callback(true);
        }


    }, function (err) {
        console.error("User was not owner of group: " + groupId + " " +userId );
        return callback(false);
    });
}



router.put('/modify/syncActivate', function (req, res) {
    if (!req.body  || !req.body.employees || !Array.isArray(req.body.employees) || !req.body.employees.length === 0) {
        res.status(404);
        res.json({ success: false, message: 'Invalid Parameters' });
    } else {
        User.update({ isSyncActivated: req.body.isSyncActivated }, {
            where: {
                id: req.body.employees,
                isAdmin: false
            }
        }).then(function () {

            res.json({ success: true, message: 'Mitarbeiter aktualisiert.' });
        }, function (err) {
            console.error(err);
            res.json({ success: false, message: 'Mitarbeiter nicht aktualisiert.' });
        });
    }
});

//router.put('/modify/newGroup', function (req, res) {
//    if (!req.body || !req.body.groupId || !req.body.employees || !Array.isArray(req.body.employees) || !req.body.employees.length === 0) {
//        res.status(404);
//        res.json({ success: false, message: 'Invalid Parameters' });
//    } else {
//        //check if group is own group
//
//                User.update({ currentGroup: req.body.groupId }, {
//                    where: {
//                        id: req.body.employees,
//                        isAdmin: false
//                    }
//                }).then(function () {
//
//                    res.json({ success: true, message: 'Mitarbeiter aktualisiert.' });
//                }, function (err) {
//                    console.error(err);
//                    res.json({ success: false, message: 'Mitarbeiter nicht aktualisiert.' });
//                });
//    }
//});


router.put('/modify/defaultGroup', function (req, res)
{
    if (!req.body || !req.body.employees || !Array.isArray(req.body.employees) || !req.body.employees.length === 0) {
        res.status(404);
        res.json({ success: false, message: 'Invalid Parameters' });
    } else {
        //check if group is own group
        Group.findOne(
           {
               where: {
                   owner: req.tokendata.id,
                   isDefault: true
               }
           }).then(function (data) {
               if (!data) {
                   console.error("Nutzer anlegen: Standard Gruppe nicht gefunden: " + req.tokendata.id);
                   res.json({
                       success: false,
                       code: 2
                   });
               } else
               {

                   User.update({ currentGroup: data.id }, {
                       where:
                               {
                                   $or: [
                                       {
                                           id: req.body.employees,
                                           admin: req.tokendata.id,
                                           isAdmin: false
                                       },
                                       {
                                           $and: [
                                               { id: req.tokendata.id },
                                               { id: req.body.employees },
                                               { isAdmin: true },
                                           ]
                                       }
                                   ]
                               }
                   }).then(function () {

                       res.json({ success: true, message: 'Mitarbeiter aktualisiert.' });
                   }, function (err) {
                       console.error(err);
                       res.json({ success: false, message: 'Mitarbeiter nicht aktualisiert.' });
                   });
                  
               }


           }, function (err) {
               console.error("Gruppe erstellen: Default-Gruppe wurde nicht gefunden" + err);
               res.json({
                   success: false,
                   code: 3
               });
           });
    }
});





router.put('/modify/syncType', function (req, res) {
    if (!req.body || !req.body.employees || !Array.isArray(req.body.employees) || !req.body.employees.length === 0) {
        res.status(404);
        res.json({ success: false, message: 'Invalid Parameters' });
    } else {
        User.update({ isAutoSync: req.body.isAutoSync }, {
                        where: {
                            id: req.body.employees,
                            isAdmin: false
                        }
                }).then(function () {

                    res.json({ success: true, message: 'Mitarbeiter aktualisiert.' });
                }, function (err) {
                    console.error(err);
                    res.json({ success: false, message: 'Mitarbeiter nicht aktualisiert.' });
                }); 
    }
});








module.exports = router;
