var express = require('express');
var router = express.Router();
bodyParser = require('body-parser'), //parses information from POST
        methodOverride = require('method-override'); //used to manipulate POST
var passwordTool = require('password-hash-and-salt');


/* GET users listing. */
router.get('/', function (req, res, next) {
    //res.end("Hallo");

    // User.findAll({admin : '69e4c616-77da-11e5-9834-69bc730ee968'}).then(function(data){
    // return res.jsonp(JSON.stringify(data));
//    			
    // });

    var query = "SELECT u.*"
            + ",(Select count(*) from View where userId = u.id) as views,"
            + "(Select count(*) from Click where userId = u.id) as clicks, "
            + "(Select title from Groups where id = u.currentGroup) as groupname "
            + "FROM `User` u where u.admin = :adminId";

    sequelize.query(query, {replacements: {adminId: req.tokendata.id}, type: sequelize.QueryTypes.SELECT})
            .then(function (groups) {
                // We don't need spread here, since only the results will be returned for select queries
              
                return res.jsonp(JSON.stringify(groups));
            });


});


/* GET users listing. */
router.get('/', function (req, res, next) {
    //res.end("Hallo");

    // User.findAll({admin : '69e4c616-77da-11e5-9834-69bc730ee968'}).then(function(data){
    // return res.jsonp(JSON.stringify(data));
//    			
    // });

    var query = "SELECT u.*"
            + ",(Select count(*) from View where userId = u.id) as views,"
            + "(Select count(*) from Click where userId = u.id) as clicks, "
            + "(Select title from Groups where id = u.currentGroup) as groupname "
            + "FROM `User` u where u.admin = :adminId";

    sequelize.query(query, {replacements: {adminId: req.tokendata.id}, type: sequelize.QueryTypes.SELECT})
            .then(function (groups) {
                // We don't need spread here, since only the results will be returned for select queries
            
                return res.jsonp(JSON.stringify(groups));
            });


});


/**
 * Accountdaten wie Name, Firmenname email und isaac Token
 * Get account relevant data like userInfo, companyInfo, activationCode etc
 */
router.get('/accountdata', function (req, res, next) {

    User.findOne({
        where: {
            id: req.tokendata.id
        },
        attributes: ['email', 'firstname', 'activationCode', 'id', 'lastname', 'companyName','isaacCustomerNumber', 'isaacCustomerToken','forceAllow', 'userInfo', 'companyInfo', 'tourSeen', 'companyInfoUpdatedAt', 'isaacCustomPlan' , 'isaacCustomAddition' ]
    }).then(function (user) {
        
        if(!user){
            res.json({success: false, message: 'Not found.'});
        }else{
            
            //
            
//            if(user.dataValues.companyInfo){
//                try{
//                    var companyInfo = JSON.parse(user.dataValues.companyInfo);
//                    user.dataValues.companyName = companyInfo["u_name"];
//                  
//                }catch(e){
//                    console.error("Could not parse company info on /accountdata : " + e);
//                }
//            }
            
            //send back data
              res.json(user);
            
            
        }
        //set company Info successfully
        
       
       
    }, function (err) {
        console.error(err);
        res.json({success: false, message: 'Not found.'});
    });

});


/**
 * Create company info for the first time when its needed
 * @param {type} param1
 * @param {type} param2 
 */
router.post('/companyinfo',function(req, res, next){
    
    if (!req.body) {
        res.json({success: false, message: 'Invalid Parameters'});
    } else {
           try {
               console.error(req.body);
               
                var json = JSON.stringify(req.body);
                   User.update({companyInfo: json}, {where: {id: req.tokendata.id}}).then(function (data) {
                            if(!data){
                                 res.json({success: false , code : "113"});
                            }else{
                                 res.json({success: true});
                            }
                           
                        }, function(err){
                             res.json({success: false, code: "112"});  //no valid json
                             console.error("Saving Company Info failure: " + err);
                            
                        });
            } catch (e) {
                  res.json({success: false, code: "234"});  //no valid json
            }
    }
});


router.post('/accountdata', function (req, res, next) {


    if (!req.body || !req.body.firstname || !req.body.lastname || !req.body.companyName) {
        res.json({success: false, message: 'Invalid Parameters'});
    } else {
        var userId = req.tokendata.id;

        if (req.body.password) { //wants to change password


            if (req.body.password.length < 6) {   //passwort muss mindestens 6 zeichen lang sein TODO sonderzeichen fordern
                res.json({success: false, code: 3, message: 'Wrong password'});
            } else {
                checkPassword(userId, req.body.password, function (result) {

                    if (result.verified === false) {
                        res.json({success: false, code: 3, message: 'Wrong password'});
                    } else {    //password was correct
                        
                        //prepare companyInfo JSON object
//                        var companyInfo;
//                        try{
//                            companyInfo = JSON.parse(result.userObject.companyInfo);
//                            companyInfo["u_name"] = req.body.companyName;
//                            companyInfo = JSON.stringify(companyInfo);
//                        }catch(e){
//                            console.error("Could not parse companyInfo data post /accountdata : " + e);
//                            
//                        }
                        
                        
                        
                        
                        
                        var userObject = {
                            firstname: req.body.firstname,
                            lastname: req.body.lastname,
                            companyName : req.body.companyName
                            //companyInfo: companyInfo      //account data is not mapped with signature info data company name
                        };
                        //check if password has to be changed
                        if (req.body.newpassword) {
                            passwordTool(req.body.newpassword).hash(function (error, hash) {
                                if (error) {
                                    res.json({success: false, message: "2"});
                                } else {
                                    userObject.password = hash;
                                    User.update(userObject, {
                                        where:
                                                {id: userId}
                                    }).then(function () {
                                        res.json({success: true, message: 'Mitarbeiter aktualisiert.'});
                                    }, function (err) {
                                        console.error(err);
                                        res.json({success: false, message: 'Mitarbeiter nicht aktualisiert.'});
                                    });
                                }
                            });

                        } else {  //simply update userobject without changing password
                            User.update(userObject, {
                                where:
                                        {id: userId}
                            }).then(function () {
                                res.json({success: true, message: 'Mitarbeiter aktualisiert.'});
                            }, function (err) {
                                console.error(err);
                                res.json({success: false, message: 'Mitarbeiter nicht aktualisiert.'});
                            });
                        }
                    }
                });

            }




        } else {  //no password provided
            res.json({success: false, message: 'No password'});

        }
    }
});

function checkPassword(id, pass, callback) {
    User.findOne({
        where: {
            id: id,
            isAdmin: true
        },
        attributes: ['password', 'companyInfo']
    }).then(function (data) {
        if (!data) {
            callback({verified : false});
        } else {



            //make hash of password
            passwordTool(pass).verifyAgainst(data.password, function (error, verified) {
                if (error)
                    callback({verified : false});
                if (!verified) {
                    callback({verified : false});
                } else {
                    callback({verified : true, userObject : data});       //return user object aswell 
                }
            });
        }
    });
}
;



//router.post('/createuser/beta', function (req, res, next) {
//
//    //create user
//    var EmployeeObject = req.body;
//    if (EmployeeObject.key != 666666) {
//        res.json({success: false, message: "1"});
//    } else {
//
//        EmployeeObject.isActivated = true;
//        EmployeeObject.isAdmin = true;			//it is not allowed to create a new admin user
//        EmployeeObject.currentGroup = 0;
//
//        passwordTool(EmployeeObject.password).hash(function (error, hash) {
//            if (error) {
//                res.json({success: false, message: "2"});
//            } else {
//                EmployeeObject.password = hash;
//                User.create(EmployeeObject).then(function (userdata) {
//                    var groupdata = {
//                        title: "Standard-Abteilung",
//                        owner: userdata.id,
//                        isDefault: true
//                    };
//
//                    //create first froup
//                    Group.create(groupdata).then(function (firstgroup) {
//
//                        //set group on new created user
//
//                        User.update({currentGroup: firstgroup.id}, {where: {id: userdata.id}}).then(function () {
//
//                            res.json({success: true});
//                        });
//
//
//                    });
//                });
//            }
//
//
//        });
//
//    }
//});
//router.delete('/:userId', function (req, res, next) {
//
//    if (!req.params.userId) {
//        res.status(404);
//        res.end();
//    } else {
//        var query = "DELETE from User where isAdmin=0 and id =" + req.params.userId;
//        sequelize.query(query, {replacements: { adminId: req.tokendata.id},type: sequelize.QueryTypes.UPDATE}).then(function (campaign) {
//            res.status(200);
//            res.json({success: true});
//        });
//    }
//});


router.get('/stats/overall', function (req, res) {
   
      var query = "SELECT u.email, CONCAT(u.firstname, ' ', u.lastname) as userName, u.companyName, u.createdAt, u.forceAllow, u.tourSeen, u.isaacCustomPlan, u.isaacCustomAddition, "+
            "(select count(*) as amountOfUsers from User where admin =  :adminId OR id = :adminId ) as amountOfUsers," +
            "(select count(*) from Campaign where owner IN (SELECT id from User where admin = :adminId OR id = :adminId )) as amountOfCampaigns " +        
            "FROM `User` u where u.id = :adminId";
    
    
    
    sequelize.query(query, {
        replacements: {adminId: req.tokendata.id},
        type: sequelize.QueryTypes.SELECT}).then(function (data) {
        
        //determine company Info    company info is no longer mapped with signature company info
//        if(data.length > 0){
//            try{
//
//                var dataFromJson = JSON.parse(data[0].companyInfo);
//                data[0].companyName = dataFromJson["u_name"];
//                delete data[0].companyInfo;
//            }catch(e){
//                console.error("Could not set company name from companyInfo Json Structure: /stats/overall " + e);
//
//            }
//        }
        res.json({
            success: true,
            data: data
        });
    }, function (err) {
        console.error(err);
        res.json({
            success: false,
        });
    });

});


/**
 * Set payment information for user to identify later in payment system
 */
router.post('/paymentcreds', function (req, res) {
    if (!req.body || !req.body.isaacCustomerNumber || !req.body.isaacCustomerNumber) {
        res.json({success: false, message: 'Invalid Parameters'});
    } else {
       
        User.update({isaacCustomerNumber: req.body.isaacCustomerNumber, isaacCustomerToken: req.body.isaacCustomerToken, isaacCustomPlan : req.body.isaacCustomPlan, isaacCustomAddition : req.body.isaacCustomAddition}, {where: {id: req.tokendata.id}}).then(function (data) {
            if(!data){
                console.error("Payment Creds Update error : " + JSON.stringify(data));
                res.json({success: false, code : 22});
            }else{
                 res.json({success: true});
            }
          
        }, function(err){
            console.error("Payment Creds : " + err);
            res.json({success: false});
        });
    }
});

/**
 * Mark introduction tour as seen
 */
router.post('/marktourasseen', function (req, res) {
    
        User.update({tourSeen: true}, {where: {id: req.tokendata.id}}).then(function (data) {
            
            if(!data){
                console.error("Mark Tour as seen error - userId : " + req.tokendata.id);
               res.json({success: false});
            }else{
                 res.json({success: true});
            }
          
        }, function(err){
            console.error("Mark Tour as seen error - userId : " + req.tokendata.id);
            res.json({success: false});
        });
    
});

router.get('/verifyPwd/:password', function (req, res, next) {

    if (req.params.password) {
        if (req.params.password.length < 6) {   //passwort muss mindestens 6 zeichen lang sein TODO sonderzeichen fordern
            res.json({ success: false, code: 3, message: 'Wrong password' });
        } else {
            var userId = req.tokendata.id;
            checkPassword(userId, req.params.password, function (result) {

                if (result.verified === false) {
                    res.json({ success: false, code: 3, message: 'Wrong password' });
                } else {
                    res.json({ success: true, code: 1, message: 'password is correct' });
                }
            });
        }

    }


});





module.exports = router;
