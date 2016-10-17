var express = require('express');
var router = express.Router();
bodyParser = require('body-parser'), //parses information from POST
methodOverride = require('method-override'); //used to manipulate POST
var async = require('async');
var Q = require('q');
/* GET users listing. */
router.get('/', function(req, res, next) {
   		//res.end("Hallo");
   		getAllGroupsForUser(req, res);
   		
  
   		
   		
});


/**
 * checks if a user is the owner of given campaign
 * @param {type} campaignId
 * @param {type} userId
 * @param {type} callback
 * @returns {undefined}
 */
function isCampaignOwnCampaign(campaignId, userId, callback) {
    Campaign.findOne({where: {id: campaignId, owner : userId}}).then(function (data) {
        if (!data) {
            return callback(false);
        } else if (data.owner === userId) {
            return callback(true);
        }else{
            return callback(false);
        }


    }, function (err) {
        console.error("User was not owner of group");
        return callback(false);
    });

}


/**
 * checks if a user is the owner of given signature
 * @param {type} campaignId
 * @param {type} userId
 * @param {type} callback
 * @returns {undefined}
 */
function isUserOwnerOfSignature(signatureId, userId, callback) {
    Signature.findOne({where: {id: signatureId, owner : userId}}).then(function (data) {
        if (!data) {
            return callback(false);
        } else if (data.owner === userId) {
            return callback(true);
        }else{
            return callback(false);
        }


    }, function (err) {
        console.error("User was not owner of signature " + signatureId + " " + userId);
        return callback(false);
    });

}


function getAllGroupsForUser(req,res){
                //TODO join anstatt inner select
   		sequelize.query("SELECT g.*"
   			+",(Select count(*) from User where currentGroup = g.id) as amountOfMembers"
                        +",(Select count(*) from View where groupId = g.id) as views,"
   			+"(Select count(*) from Click where groupId = g.id) as clicks, "
                        +"(Select title from Signature where id = g.activeSignature) as currentSignatureTitle, "
   			+"(Select title from Campaign where id = g.activeCampaign) as campaignTitle,"
                        +"(Select id from Campaign where id = g.activeCampaign) as campaignId,"
                        +"(Select url from Campaign where id = g.activeCampaign) as campaignUrl,"
                        +"(Select image from Campaign where id = g.activeCampaign) as campaignImage,"
                        +"(Select color from Campaign where id = g.activeCampaign) as campaignColor"
   			+" FROM Groups g where owner = :adminId ORDER BY updatedAt DESC", 
                {replacements: { adminId: req.tokendata.id},
                    type: sequelize.QueryTypes.SELECT})

                .then(function (groups) {
                    // We don't need spread here, since only the results will be returned for select queries

                    //get all members of group
                    promises = [];
                    groups.forEach(function (group) {
                        promises.push(
    //                            function () {

                                    sequelize.query("SELECT u.email, u.firstname, u.lastname, u.id, u.isAdmin,   u.signatureActivated, u.signatureActivatedAt, u.userInfoUpdatedAt, u.signatureLastRollout, "
                                    +"(select companyInfoUpdatedAt from User where id = u.admin) as companyInfoUpdatedAt, "
                                    +"(Select count(*) from View where userId = u.id) as views, "
                                    +"(select signatureUpdatedAt from Signature where id = (Select id from Signature where id = (Select activeSignature from Groups where id = u.currentGroup))) as signatureUpdatedAt, "
                                    +"(select lastRollout from Signature where id = (Select id from Signature where id = (Select activeSignature from Groups where id = u.currentGroup))) as lastRolloutOSignatureItself, "
                                    + "(Select id from Signature where id = (Select activeSignature from Groups where id = u.currentGroup)) as currentSignature "
                                    + "FROM `User` u where u.currentGroup = :groupId AND (u.id = :adminId OR admin = :adminId)",
                                    {replacements: {adminId: req.tokendata.id, groupId : group.id},
                                        type: sequelize.QueryTypes.SELECT}

                                    ).then(function (members) {
                                        var tempgroup = group;
                                        tempgroup.members = members;
                                        return tempgroup;
                                    })

    //                            })
                                        );


                    });

                    return Promise.all(promises);

                }).then(function (posts) {
                    res.json(posts);
                });
                         
                         
                         
                         
}


router.get('/search/withq', function(req, res, next) {
   		//res.end("Hallo");
//   		  var searchString = req.query.search;
                  var searchString = "%" + req.query.search + "%";
                  if(!searchString){
                      getAllGroupsForUser(req, res);
                  }else{
                      sequelize.query("SELECT g.*"
   			+",(Select count(*) from User where currentGroup = g.id) as amountOfMembers"
                        +",(Select count(*) from View where groupId = g.id) as views,"
   			+"(Select count(*) from Click where groupId = g.id) as clicks "
   			+",(Select title from Campaign where id = g.activeCampaign) as campaignTitle,"
                        +"(Select id from Campaign where id = g.activeCampaign) as campaignId,"
                        +"(Select url from Campaign where id = g.activeCampaign) as campaignUrl,"
                        +"(Select image from Campaign where id = g.activeCampaign) as campaignImage,"
                        +"(Select color from Campaign where id = g.activeCampaign) as campaignColor"
   			+" FROM Groups g where owner = :adminId AND title LIKE :searchString ", 
                {replacements: { adminId: req.tokendata.id, searchString:  searchString},
                    type: sequelize.QueryTypes.SELECT})
 	 			.then(function(groups) {
   		 			// We don't need spread here, since only the results will be returned for select queries
   					
					return res.jsonp(JSON.stringify(groups));
 			 });
   		 
                  }
                      
                     
                  
   		
   		
   		
});

router.get('/:groupId', function(req, res, next) {
   		if(!req.params.groupId) {
			res.status(404);
			res.end();
		}else{
                    
                    var query = "SELECT g.*"
   			+",(Select count(*) from User where currentGroup = g.id) as amountOfMembers"
                        +",(Select count(*) from View where groupId = g.id) as views,"
   			+"(Select count(*) from Click where groupId = g.id) as clicks "
                	+",(Select title from Signature where id = g.activeSignature) as signatureTitle"
   			+",(Select title from Campaign where id = g.activeCampaign) as campaignTitle,"
                 +"(Select image from Campaign where id = g.activeCampaign) as campaignImage,"
                        +"(Select id from Campaign where id = g.activeCampaign) as campaignId,"
                        +"(Select url from Campaign where id = g.activeCampaign) as campaignUrl,"
                        +"(Select color from Campaign where id = g.activeCampaign) as campaignColor"
   			+" FROM Groups g where owner = :adminId AND g.id =  :groupId";
                    
                    
                    
                    sequelize.query(query, {
                        replacements: { adminId: req.tokendata.id, groupId:  req.params.groupId},
                        type: sequelize.QueryTypes.SELECT})
 	 			.then(function(data) {
   		 			// We don't need spread here, since only the results will be returned for select queries
   					
                                         
                                         if(!data){
						res.json({
                                                    success : false,
                                                    message : 'Gruppe ist nicht vorhanden.'
                                                 });
                                        }else{
                                                res.json(data);
                                        }	
					
                                 }, function(err){
                                     console.error(err);
                                 });
                    
               }
  	
});



/**
 * Set active campaign for groups
 * @param {type} param1
 * @param {type} param2
 */
router.put('/modify/campaign', function (req, res) {
    if (!req.body ||  !req.body.groups ||  !Array.isArray(req.body.groups)   || !req.body.groups.length === 0) {
        res.status(404);
        res.json({success: false, message: 'Invalid Parameters'});
    } else {//user wants to set new campaign to group
        //check if group is own group
        if(req.body.campaignId !== null){
             isCampaignOwnCampaign(req.body.campaignId, req.tokendata.id, function (success) {
            if (success === true) {
                Group.update({activeCampaign : req.body.campaignId}, {
                    where:
                            { id : req.body.groups, owner : req.tokendata.id}
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
        }else{  //nutzer wants to remove campaign from group
            Group.update({activeCampaign : null}, {
                    where:
                            { id : req.body.groups, owner : req.tokendata.id}
                }).then(function () {

                    res.json({success: true, message: 'Mitarbeiter aktualisiert.'});
                }, function (err) {
                    console.error(err);
                    res.json({success: false, message: 'Mitarbeiter nicht aktualisiert.'});
                });
        }
        
       
    }
});


/**
 * Set active signature for groups
 * @param {type} param1
 * @param {type} param2
 */
router.put('/modify/signature', function (req, res) {
    if (!req.body ||  !req.body.groups ||  !Array.isArray(req.body.groups)   || !req.body.groups.length === 0 ) {   //signatureId can be null when user wants to remove assignemt from signature to group
        res.json({success: false, code: 100});
    } else {//user wants to set new signature to group
        //check if signature is own group
//        if(req.body.signatureId !== null){
            if(req.body.signatureId){
            
             isUserOwnerOfSignature(req.body.signatureId, req.tokendata.id, function (success) {
                if (success === true) {
                    Group.update({activeSignature : req.body.signatureId}, {
                        where:
                                { id : req.body.groups, owner : req.tokendata.id}
                    }).then(function (data) {
                        if(data[0] > 0){//check if at least one entry got modified
                            res.json({success: true}); 
                        }else{
                            res.json({success: false});
                        }
                        
                    }, function (err) {
                        console.error(err);
                        res.json({success: false, code: 101});
                    });

                } else {
                    res.json({success: false});
                }
            });
        }else{  //nutzer wants to remove signature from group has an extra path because checking if user is owner of signature is obsolute
            Group.update({activeSignature : null}, {
                    where:
                            { id : req.body.groups, owner : req.tokendata.id}
                }).then(function (data) {
                        if(data[0] > 0){    //check if at least one entry got modified
                            res.json({success: true});
                        }else{
                            res.json({success: false});
                        }
                   
                }, function (err) {
                    console.error(err);
                    res.json({success: false, code: 102});
                });
        }
        
       
    }
});






/**
 * Get all employee who could be assigned to group (all employees that are not already member of this group)
 */
router.get('/potmembers/:groupId', function(req, res, next) {
	
	var groupId = -1;	//es existiert keine gruppe mit -1
	if(req.params.groupId && req.params.groupId != "undefined") {	//undefined kann kommen wenn eine neue gruppe erstellt wird
			groupId = req.params.groupId;
	}	



        var searchString = "%" + req.query.search + "%";
//        searchString = searchString.replace(' ', '');
        if(searchString.length === 0){
            getGroupMembers(req, res);
            
        }else{
            
            
             var query = "SELECT u.firstname,u.id, u.email, u.lastname,u.currentGroup,"
                +"(Select title from Groups where id = u.currentGroup) as groupTitle, "
                +"(Select id from Groups where id = u.currentGroup) as groupId ,"
                + "IF(u.currentGroup = :groupId,1,0) AS isMember "
                + "from User u where (admin = :adminId OR id = :adminId) AND (u.firstname LIKE :searchString OR u.lastname LIKE :searchString OR u.email LIKE :searchString OR (CONCAT(u.firstname, ' ', u.lastname) LIKE :searchString))";
    
    
    
             sequelize.query(query, {
             replacements: { adminId: req.tokendata.id, searchString:  searchString, groupId : groupId},     
            type: sequelize.QueryTypes.SELECT})
 	 			.then(function(groups) {
   		 		return res.jsonp(JSON.stringify(groups));
 			 }, function(err){
 			 	console.error(err);
 			 	res.status(404);
				res.end();
 			 });
    }
});

//ausgelagerte Funktion da von anderen routes redirected werden muss
function getGroupMembers(req, res){
    
	var groupId = -1;	//es existiert keine gruppe mit -1
	if(req.params.groupId && req.params.groupId != "undefined") {	//undefined kann kommen wenn eine neue gruppe erstellt wird
			groupId = req.params.groupId;
	}	

    var query = "SELECT u.firstname,u.id, u.email, u.lastname,u.currentGroup,u.isAdmin,u.currentGroup, u.signatureActivated, u.signatureActivatedAt, u.userInfoUpdatedAt, u.signatureLastRollout, "
                 +"(Select count(*) from View where userId = u.id) as views,"
   	         +"(Select count(*) from Click where  userId = u.id) as clicks, "
                 +"(select companyInfoUpdatedAt from User where id = u.admin) as companyInfoUpdatedAt, "
                 +"(select signatureUpdatedAt from Signature where id = (Select id from Signature where id = (Select activeSignature from Groups where id = u.currentGroup))) as signatureUpdatedAt, "
                 +"(select lastRollout from Signature where id = (Select id from Signature where id = (Select activeSignature from Groups where id = u.currentGroup))) as lastRolloutOSignatureItself, "
                 + "(Select title from Campaign where id = (Select activeCampaign from Groups where id = u.currentGroup)) as campaignTitle, "
                 + "(Select url from Campaign where id = (Select activeCampaign from Groups where id = u.currentGroup)) as campaignUrl, "
                 + "(Select image from Campaign where id = (Select activeCampaign from Groups where id = u.currentGroup)) as campaignImage, "
                 + "(Select color from Campaign where id = (Select activeCampaign from Groups where id = u.currentGroup)) as campaignColor, "
                 + "(Select title from Groups where id = u.currentGroup) as groupTitle "
                 + "from User u where u.currentGroup = :groupId  AND ( admin = :adminId OR id = :adminId)";
   
    
    sequelize.query(query, { 
         replacements: { adminId: req.tokendata.id,groupId : groupId},   
        type: sequelize.QueryTypes.SELECT})
 	 			.then(function(groups) {
   		 		return res.jsonp(JSON.stringify(groups));
 			 }, function(err){
 			 	console.error(err);
 			 	res.status(404);
				res.end();
 			 });
}
router.get('/members/:groupId', function(req, res, next) {
	getGroupMembers(req, res);
});


/**
 * sets array of members to default group 
 */
function putUsersToDefaultGroup(adminId, members, formerGroup){
	var deferred = Q.defer();
	
	if(Array.isArray(members) && members.length > 0 ){
		//getDefaultGroupID
		Group.findOne({where : {owner : adminId, isDefault : true}}).then(function(data){
			if(!data || !data.id){
				//TODO
				deferred.reject(false);
			}else{
				
				User.update({currentGroup : data.id}, {
					where : {
						id : members, 
						currentGroup : formerGroup,
						$or : [
				 				{admin : adminId},
				 				{id : adminId}
				 		]
				 	}
				 		}).then(function(){
					
					if(!data){
						//TODO
						deferred.reject(false);
					}else{
						deferred.resolve(true);
						
					}
					
				});
			}
		});
	}else{
		deferred.resolve(true);
	}
	
	
	return deferred.promise;
}



   		
router.post('/', function(req, res, next) {
	if(!req.body.title || !req.tokendata.id){
		res.json({
				success : false,
				message : 'Es wurde kein Titel angegeben oder die Authentifizierung ist nicht korrekt.'
			});
	}else{
		 var GroupObject = req.body;
		 var membersToAdd = GroupObject.membersToAdd;
		
		 GroupObject.owner = req.tokendata.id;
                 GroupObject.isDefault = 0;
                 
		 Group.create(GroupObject).then(function(created){
		 	var groupId = created.id;
		 	var createdId = created.id;
		 	//Update all users to belong to group if members are provided
		 	if(Array.isArray(membersToAdd) &&  membersToAdd.length > 0 ){
		 			User.update({currentGroup : createdId},{
			 		where : {
			 			id : membersToAdd,
			 			$or : [
				 				{admin : req.tokendata.id},
				 				{id : req.tokendata.id}
				 			]
			 		}
			 		
			 	}).then(function(data){
			 		
			 		res.json({
							success : true,
							message : 'Neue Gruppe wurde erstellt.',
                                                        groupId : groupId
						});
				 		
				 		
				 	});
		 	}else{
		 			res.json({
							success : true,
							message : 'Neue Gruppe wurde erstellt.',
                                                        groupId : groupId
						});
		 		
		 	}
		 
				
		 	
		 }, function(err){
		 		console.error("Gruppe erstellen Fehler: " + err);
			 	res.status(404);
				res.json({
					success : false,
					message : 'Neue Gruppe konnte nicht erstellt werden.'
				});
		 });
		
		
	}
	
	 
});



router.put('/', function(req, res, next) {
	 
	if(!req.body || !req.body.id) {
		
		res.status(404);
		res.end();
	}else{
		 var group = req.body;
		
		 var membersToAdd = group.membersToAdd;
		 var membersToRemove = group.membersToRemove;
		 group.owner = req.tokendata.id;
		
	
			Group.update(group,{
			  where: {
			    id: req.body.id,
			    owner : req.tokendata.id
			  }
			}).then(function(data){
				
				
				async.series([
				    function(callback){
				    	//if user was unselected he has to be moved to standard group
				    	putUsersToDefaultGroup(req.tokendata.id, membersToRemove, req.body.id).then(function(data){
				    		 	 callback(null, data);
				    		 },
				    		  function(err){
				    		  	 callback(err);
				    		});
				    },
				    
				    function(callback){
				    	
				    	
				    	//Update all users to belong to group
						if(Array.isArray(membersToAdd) &&  membersToAdd.length > 0 ){
							User.update({currentGroup : req.body.id},{
					 		where : {
					 			id : membersToAdd,
					 			$or : [
					 				{admin : req.tokendata.id},
					 				{id : req.tokendata.id}
					 			]
					 			
					 		}
					 		
						 	}).then(function(data){
						 		callback(null, true);
						 	}, function(err){
						
								console.error(err);
								callback(err);
							});
						}else{
							callback();		//error = null
						}			 	
					 }
		
					
				], function(error, results){	//finally return true	TODO prüfen ob alles erfolgreich war
					
					if(error){
						//TODO
						console.error(error);
						res.json({
								success : false,
								message : 'Neue Gruppe wurde nicht erstellt.'
							});
						
					}else{
						res.json({
								success : true,
								message : 'Neue Gruppe wurder erstellt.'
							});
						
					}
				});

	});
}
});

/**
 * TODO TRANSACTION
 */
router.delete('/:groupId', function(req, res, next) {
	 
	
	
	
	if(!req.params.groupId) {
		res.json({ success: false });
	}else{
		 var idToDel = req.params.groupId;
		
	
			Group.destroy({
			  where: {
			    id: idToDel,
			    owner : req.tokendata.id,
                            isDefault : {
                                $ne : 1
                            }
			  }
			}).then(function(data){
				if(!data){
					res.status(404);
					res.end();
					return;
				}
				//every member has to be moved to default group
				var query = "UPDATE User set currentGroup = (SELECT id from Groups where  isDefault = 1 AND  owner = :adminId ) "
				+ "WHERE currentGroup = :groupId AND (admin = :adminId or id = :adminId)";
				sequelize.query(query, {
                                    replacements: { adminId: req.tokendata.id, groupId : req.params.groupId},   
                                    type: sequelize.QueryTypes.UPDATE})
 	 			.then(function(meta) {
   		 			// We don't need spread here, since only the results will be returned for select queries
   					
   					 
						res.status(200);
		        		res.json({ success: true });
		        }
					,function(err){
						console.error("Fehler beim neu setzen der Gruppen bei gelöschter gruppe" + err);
						
						
					});
 				
			}, function(err){
				
				console.error("Fehler beim neu setzen der Gruppen bei gelöschter gruppe" + err);
			});
	}
	
});


/**
 * Liefert die Statistiken für alle Gruppen. Wird im Dashboard im Gruppenvergleich eingesetzt
 */
router.get('/data/statistics', function(req, res, next) {
    var ret = {
        clicks : null,
        views :null
    };

    
  
    
    var queryViews = "SELECT v.groupId, g.title, count(*) as anzahl, " 
    + "(Select count(*) from User where currentGroup = v.groupId) as amountOfMembers "
    + "FROM View v "
    +"INNER JOIN Groups g ON (v.groupId = g.id) "
    +"where g.owner = :adminId "
    +"GROUP BY v.groupId  ";
    
    
     var queryClicks = "SELECT v.groupId, g.title, count(*) as anzahl, " 
    + "(Select count(*) from User where currentGroup = v.groupId) as amountOfMembers "
    + "FROM Click v "
    +"INNER JOIN Groups g ON (v.groupId = g.id) "
    +"where g.owner = :adminId "
    +"GROUP BY v.groupId  ";
    
    
    var viewPromise =  sequelize.query(queryViews, {   replacements: { adminId: req.tokendata.id}, type: sequelize.QueryTypes.SELECT}).then(function(views){
        
        return views;
    });
    
    var clickPromise = sequelize.query(queryClicks, {   replacements: { adminId: req.tokendata.id}, type: sequelize.QueryTypes.SELECT}).then(function(clicks){
            
             return clicks;
            
        });
    Promise.all([viewPromise, clickPromise]).then(function(values){ 

         ret.views = values[0];
         ret.clicks = values[1];
         res.json(ret);
        
    }).catch(function(e){
        console.error(new Error("Group statistics could not be loaded : "+ e + "admin : " + req.tokendata.id));
         res.json(null);
        
    });
    
});


router.post('/syncGroup', function (req, res, next) 
{
    if (!req.body.title || !req.tokendata.id) {
        res.json({
            success: false,
            message: 'Es wurde kein Titel angegeben oder die Authentifizierung ist nicht korrekt.'
        });
    } else {
        var GroupObject = req.body;
        GroupObject.owner = req.tokendata.id;
        GroupObject.isDefault = 0;


        Group.findOne(
            {
                where: {
                    title: GroupObject.title,
                    owner: req.tokendata.id
                }
            }
        ).then(function (data) {
            if (!data) {
                Group.create(GroupObject).then(function (created) {
                    var groupId = created.id;
                    var createdId = created.id;
                    
                     res.json({
                        success: true,
                        groupExisting : false,
                        groupId: groupId
                    });
                    
                }

                , function (err) {

                    console.error(err);
                    callback(err);
                });

            }
            else {
                res.json({
                    success: true,
                    groupExisting : true,
                    groupId: data.id
                });
            }

        });
    }
        


});




router.post('/del/many', function (req, res, next) {

    if (!req.body.groupids || !Array.isArray(req.body.groupids) || !req.body.groupids.length === 0) {
        res.status(404);
        res.end();
    } else {
        var groupids = req.body.groupids;
        Group.destroy({where: {id: groupids, owner: req.tokendata.id, isDefault: false}}).then(function (data) {
            if (data) {
                
                //alle ehemaligen Mitglieder müssen der Standardgruppe zugewiesen werden
                //build string query for all groups TODO keine gute Lösung TODO sql escape query
//                var idsAsString = groupids[0];
//                for(var i = 1 ; i < groupids.length; i++){
//                    idsAsString+=", ";
//                    idsAsString+=groupids[i];
//                }
                //every member has to be moved to default group
                var query = "UPDATE User set currentGroup = (SELECT id from Groups where  isDefault = 1 AND  owner = :adminId ) "
                + "WHERE currentGroup IN (:groupIds) AND (admin = :adminId OR id = :adminId) ";
                sequelize.query(query, { replacements: { adminId: req.tokendata.id,  groupIds : groupids}, type: sequelize.QueryTypes.UPDATE})
                .then(function(meta) {
                        // We don't need spread here, since only the results will be returned for select queries
                      

                               
                        res.json({ success: true });
        }
                        ,function(err){
                                console.error("Fehler beim neu setzen der Gruppen bei gelöschter gruppe" + err);


                        });

              
            } else {
                console.error("Mitarbeiter konnte nicht gelöscht werden" );
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

module.exports = router;
