var express = require('express');
var router = express.Router();
var url = require('url');
var $q = require('q');
var moment = require('moment');
bodyParser = require('body-parser'), //parses information from POST
        methodOverride = require('method-override'); //used to manipulate POST
var accountHelper = require('../helpers/accounthelper');
/* GET users listing. */
router.get('/neu/:userId', function (req, res, next) {

    //get user id on parse url

    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;


    if (!req.params.userId) {
        console.error("User Id wurde nicht übergeben");
        res.status(404);
        res.end();
    } else {

        //check if user is allowed to (paid, testaccount, etc)
        accountHelper.checkIfAccountActive(req.params.userId).then(function (data) {
            if (data === true) {
                //get user id
                var userId = req.params.userId;
                //get active campaign for user
                var query = "SELECT g.id as groupId, c.id as campaignId, c.url  from Groups g join Campaign c on g.activeCampaign = c.id  where g.id = (select currentGroup from User where id = :userId)";

                sequelize.query(query, {replacements: {userId: userId}, type: sequelize.QueryTypes.SELECT}).then(function (result) {
                    //TODO send 404
                    if (!result || !Array.isArray(result) || result.length == 0) {
                        return res.redirect("https://www.mailtastic.de");
                        console.error("User konnte keiner Kampagne zugeordnet werden - UserId :" + userId);
                        return;
                    }
                    var viewmodel = {
                        userId: userId,
                        campaignId: result[0].campaignId,
                        groupId: result[0].groupId
                    };

                    //TODO send 404
                    if (!viewmodel.userId || !viewmodel.campaignId || !viewmodel.groupId) {
                         return res.redirect("https://www.mailtastic.de");
                        console.error("Clickmodel nicht vollständig: " + JSON.stringify(viewmodel));
                        return;
                    }

                    //create new View Entry
                    Click.create(viewmodel).then(function (created) {
                         checkIfItWasFirstClick(userId);
                        
                       

                    });
                    
                    
                    
                     //get image name
                    //TODO send 404
                    var url = result[0].url;
                    if (!url) {
                        return res.redirect("https://www.mailtastic.de");
                        console.error("URL beim Click nicht vorhanden"+ JSON.stringify(viewmodel));
                        return;
                    } else {
                        if (!url.startsWith("http://") && !url.startsWith("https://")) {
                            url = "http://" + url;
                        }

                        return res.redirect(url);


                        //res.redirect(url);
                    }




                });
            } else {
                return res.redirect("https://www.mailtastic.de");
            }
        });


    }

});

/**
 * serve image content when using integration of versa commerce
 */
router.get('/versacom/:adminId/:templateName', function (req, res, next) {
    //determine if outlook link
     
                       var adminId = req.params.adminId;
                       var emailToUse = req.params.templateName;
                     
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
                            processGenericLink(adminId, emailToUse, res );
                            
                        }).catch(function(){
                            processGenericLink(adminId, emailToUse,  res );
                        });
    
    
    
    
});
/**
 * serve link when 3rd party centralized signature software is used in company
 */
router.get('/company/:adminId/:employeeEmail', function (req, res, next) {


processGenericLink(req.params.adminId,req.params.employeeEmail,   res);

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
function processGenericLink(adminId, employeeEmail,   res){
    
     //get user id on parse url

    if (!adminId || !employeeEmail) {
        console.error("company linkserve failed: admin: " + adminId + "employee: " + employeeEmail);
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
                    if (data === true) {
                        //get user id
                        var userId = id;
                        //get active campaign for user
                        var query = "SELECT g.id as groupId, c.id as campaignId, c.url  from Groups g join Campaign c on g.activeCampaign = c.id  where g.id = (select currentGroup from User where id = :userId)";

                        sequelize.query(query, {replacements: {userId: userId}, type: sequelize.QueryTypes.SELECT}).then(function (result) {
                            //TODO send 404
                            if (!result || !Array.isArray(result) || result.length == 0) {
                                console.error("User konnte keiner Kampagne zugeordnet werden - UserId :" + userId);
                                 return res.redirect("https://www.mailtastic.de");
                                
                                
                            }
                            var viewmodel = {
                                userId: userId,
                                campaignId: result[0].campaignId,
                                groupId: result[0].groupId
                            };

                            //TODO send 404
                            if (!viewmodel.userId || !viewmodel.campaignId || !viewmodel.groupId) {
                                 console.error("Clickmodel nicht vollständig: " + JSON.stringify(viewmodel));
                                 return res.redirect("https://www.mailtastic.de");
                               
                            }

                            //create new View Entry
                            Click.create(viewmodel).then(function (created) {
                                checkIfItWasFirstClick(userId);



                            });
                            
                            
                                //get image name
                                //TODO send 404
                                var url = result[0].url;
                                if (!url) {
                                     console.error("URL beim Click nicht vorhanden"+ JSON.stringify(viewmodel));
                                   return res.redirect("https://www.mailtastic.de");
                                   
                                   
                                } else {
                                    if (!url.startsWith("http://") && !url.startsWith("https://")) {
                                        url = "http://" + url;
                                    }

                                    return res.redirect(url);


                                    //res.redirect(url);
                                }


                        });
                    } else {
                        return res.redirect("https://www.mailtastic.de");
                    }
                });
                
            }).catch(function(){
             return res.redirect("https://www.mailtastic.de");
            });
        }
}

/**
 * when the first click for a user or a new employee is tracked than intercom gets informed
 * @param {type} userId
 * @returns {undefined}
 */
function checkIfItWasFirstClick(userId){
    
    if(!userId){
        console.error("Creating first click intercom event failed : missing userId");
        return;
    }
    
    var query = 
            "SELECT count(*) as amountOfClicks, "
            + "(select email from User where id = (select admin from User where id  = :userId) OR (id = :userId AND isAdmin = 1 )) as adminEmail "
            + "from Click where userId = :userId";
            sequelize.query(query, {replacements: {userId: userId}, type: sequelize.QueryTypes.SELECT}).then(function (result) {
         
                if(result && Array.isArray(result) && result.length === 1 && result[0].amountOfClicks && result[0].amountOfClicks === 1){
                    //intercom
                    // Create a event
                    
                    var time = moment().format("X");
//                    console.error("time :" + time);
                    
                    if(result[0].adminEmail){
                        intercomClient.events.create({
                            event_name: 'User or employee created first click',
                            created_at:   time,
                            email: result[0].adminEmail,

                        }).catch(function(e){

                            console.error("Creating first click intercom event failed : intercom error " + e);
                        });
                    }else{
                        console.error("Creating first click intercom event failed : missing admin email" + result);
                    }
                    

                };
         
            });
}



module.exports = router;
