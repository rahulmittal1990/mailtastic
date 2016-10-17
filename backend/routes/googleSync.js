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
var controllers = require("../controllers");

/* GET users listing. */
router.get('/', function (req, res, next) {
    sequelize.query("SELECT c.syncInfoId, c.admin, c.syncAdminEmail, c.isAutomaticSync, c.isGoogleStructure, " +
        " c.accessTokenKey, c.isDisconnected FROM `CompanyInfo` c "+
        " where c.admin = :adminId ",
         {replacements: {adminId: req.tokendata.id},
             type: sequelize.QueryTypes.SELECT })
            .then(function (companyinfo) {
                // We don't need spread here, since only the results will be returned for select queries
                return res.json(companyinfo);
            });
});


router.post('/', function (req, res, next)
{
    var companyObject = req.body;
    if (!req.tokendata.id) {
        res.json({
            success: false,
            message: 'Es wurde keine email angegeben oder die Authentifizierung ist nicht korrekt.'
        });
    } else
    {


        CompanyInfo.findOne(
                          {
                              where: {
                                  admin: req.tokendata.id
                              }
                          }).then(function (data) {
                              if (!data) {
                                 //delete ID because creating with null as id leads to erro
                                  delete companyObject["syncInfoId"];
                                  console.error(JSON.stringify(companyObject));
                                  companyObject.admin = req.tokendata.id;
                                  CompanyInfo.create(companyObject).then(function (data) {
                                      if (!data) {
                                          res.json({
                                              success: false,
                                              message: 'Der Mitarbeiter konnte nicht erstellt werden.'
                                          });
                                      } else {

                                          var admin = data.admin;

                         
                                          res.json({
                                              success: true,
                                              message: 'E-Mail wurde verschickt.',
                                              id: admin
                                          });

                                      }


                                  }, function (er) {
                                      console.error("Fehler beim Anlegen von Mitarbeiter: " + er);
                                      res.json({
                                          success: false,
                                          code: 104
                                      });


                                  });

                              } else {

                                  CompanyInfo.update({
                                      admin: req.tokendata.id, adminEmail: req.body.adminEmail, isAutomaticSync: req.body.isAutomaticSync,
                                      isGoogleStructure: req.body.isGoogleStructure,
                                      updatedAt: sequelize.fn('NOW'), isDisconnected: req.body.isDisconnected, accessTokenKey:req.body.accessTokenKey
                                  },//save datetime when info was changed to determine if user has to habe an updated signature}, 
                                           {
                                               where:
                                                      {
                                                          $or: [
                                                              { admin: req.tokendata.id }
                                                          ]
                                                      }
                                           }).then(function (data) {
                                               if (!data) {
                                                   res.json({ success: false });
                                                   console.error("Saving company Info Data failed with no error ");
                                               } else {
                                                   res.json({ success: true });
                                               }

                                           }, function (err) {
                                               console.error("Saving company Info Data failed: " + err);
                                               res.json({ success: false });

                                           });
                                 
                                                              }


                          }, function (err) {
                              console.error("Gruppe erstellen: Default-Gruppe wurde nicht gefunden" + err);
                          });


    }

});


router.put('/', function (req, res) {
    if (req.body.syncInfoId == null || req.body.syncInfoId == "") {
        res.json({ success: false, message: 'Invalid Parameters' });
    } else {

        //var json = JSON.stringify(req.body.data);

        CompanyInfo.update({ admin: req.body.admin, adminEmail: req.body.adminEmail, isAutomaticSync: req.body.isAutomaticSync, isGoogleStructure: req.body.isGoogleStructure, updatedAt: sequelize.fn('NOW'), isDisconnected: req.body.isDisconnected },//save datetime when info was changed to determine if user has to habe an updated signature}, 
            {
                where:
                       {
                           $or: [
                               { syncInfoId: req.body.syncInfoId }
                           ]
                       }
            }).then(function (data) {
                if (!data) {
                    res.json({ success: false });
                    console.error("Saving company Info Data failed with no error ");
                } else {
                    res.json({ success: true });
                }

            }, function (err) {
                console.error("Saving company Info Data failed: " + err);
                res.json({ success: false });

            });
    }


});


router.delete('/:companyInfoId', function (req, res, next) {

    if (!req.params.companyInfoId) {
        res.status(404);
        res.end();
    } else {
        
        CompanyInfo.destroy({where : {
                syncInfoId : req.params.companyInfoId,
                admin : req.tokendata.id
                
        }})
            .then(function(data){
                if(!data){
                        res.json({ success: false, code : 100 });
                }else{
                    
                        res.json({ success: true });
                }
                
            });
    }

});


/* signature apis */
router.post('/listusers', controllers.signature.getListOfUsers);




/**
 * update all google users in the given groups with the newest signature
 */
router.post('/updatesignature/groups', function(req, res, next){
     if (!req.body.groups || !Array.isArray(req.body.groups) || req.body.groups.length === 0) {
        res.json({ success: false, code: '103' });
    } else {
       //get all users which are member of the groups and that are google users
       
       User.findAll(
               {
                    where : { 
                        isFromGoogle : true, 
                        isSyncActivated : true,
                        syncAdmin : req.tokendata.id,
                        currentGroup : req.body.groups
                    }
                })
                .then(function(employees){

                    if(employees.length > 0){
                        return  controllers.signature.processSignatureSyncForGoogleUsers(employees,  req.tokendata.id);
                    }else{
                        return Q.resolve([]);

                    }
                  

                })
                .then(function(userStatus){
                    //everything worked
                     res.json({ success : true, users : userStatus});

                })        
                .catch(function(e){
                    console.error("error on processing google sync users for group : " + e)
                     res.json({ success : false, code : 106});
                    
                });
        
    }
    
    
});




router.put('/updatesignature',  function(req, res, next){
     
    
     
//     req.body.data = {
//         users :  req.body.users,
//         signature : "<h1>welcome</h1>"
//     };
     
//      controllers.signature.updateSignature(req, res, next)
           
     
     controllers.employee.getCompleteSignatureForEmployee(req.body.users[0]).
             then(function(employee){
                 req.body.signature = employee.snippet;
                 
                 return controllers.signature.processSignatureSyncForGoogleUsers(req.body.users,  req.tokendata.id).catch(function(e){
                        res.json({ success : false, code : 884});
                     
                 });
                 
                 
                 
             })
            .then(function(userStatus){
                  res.json({ success : true, users : userStatus});
                 
             }).catch(function(e){
                 if(e === "Invalid Token"){
                      res.send("Invalid Token").status(500);
                 }else{
                        res.json({ success : false, code : 885});
                     
                 }
               
                 
             });
     
     
 });


module.exports = router;
