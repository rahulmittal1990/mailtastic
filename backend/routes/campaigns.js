var express = require('express');
var router = express.Router();
var mongoose = require('mongoose'), //mongo connection
        bodyParser = require('body-parser'), //parses information from POST
        methodOverride = require('method-override'); //used to manipulate POST
var fs = require("fs");
var async = require("async");
var moment = require('moment');
var Promise = sequelize.Promise;
var rand = require("generate-key");
var helpers = require('../helpers/helperfunctions');
/* GET users listing. */
router.get('/', function (req, res, next) {
    //res.end("Hallo");


    sequelize.query("SELECT c.*"
            + ",(Select count(*) from View where campaignId = c.id) as views,"
            + "(Select count(*) from Click where campaignId = c.id) as clicks, "
            + "(Select count(*) from User where currentGroup IN (Select id from Groups where activeCampaign = c.id)) as amountOfActiveUsers "
            + "FROM `Campaign` c where owner = :adminId ORDER BY UpdatedAt DESC", {replacements: { adminId: req.tokendata.id },type: sequelize.QueryTypes.SELECT})
            .then(function (campaigns) {
                // We don't need spread here, since only the results will be returned for select queries
                
                //get all Groups where the campaign is active
                promises = [];
                campaigns.forEach(function (campaign) {
                    promises.push(
//                            function () {
                               
                                 sequelize.query("SELECT g.*"
                                        + ",(Select count(*) from User where currentGroup = g.id) as amountOfMembers"
                                        + ",(Select count(*) from View where groupId = g.id) as views,"
                                        + "(Select count(*) from Click where groupId = g.id) as clicks "
                                        + ",(Select title from Campaign where id = g.activeCampaign) as campaignTitle,"
                                        + "(Select id from Campaign where id = g.activeCampaign) as campaignId,"
                                        + "(Select url from Campaign where id = g.activeCampaign) as campaignUrl,"
                                        + "(Select color from Campaign where id = g.activeCampaign) as campaignColor"
                                        + " FROM Groups g where owner = :adminId AND g.activeCampaign = " + campaign.id, {replacements: { adminId: req.tokendata.id },type: sequelize.QueryTypes.SELECT}

                                ).then(function (groups) {
                                    var tempcampaign = campaign;
                                    tempcampaign.activegroups = groups;
                                    return tempcampaign;
                                })
                                                
//                            })
                                    );


                });

                return Promise.all(promises);

            }).then(function (posts) {
        res.json(posts);
    });



//			return res.json(campaigns);
//                    });


});


router.get('/:campaignId', function (req, res, next) {
    if (!req.params.campaignId) {
        res.status(404);
        res.end();
    } else {
        var idToFind = req.params.campaignId;
        
         sequelize.query("SELECT c.*"
            + ",(Select count(*) from View where campaignId = c.id) as views,"
            + "(Select count(*) from Click where campaignId = c.id) as clicks, "
            + "(Select count(*) from User where currentGroup IN (Select id from Groups where activeCampaign = c.id)) as amountOfActiveUsers "
            + "FROM `Campaign` c where owner = :adminId AND c.id = :idToFind", {replacements: { adminId: req.tokendata.id, idToFind : idToFind },type: sequelize.QueryTypes.SELECT})
        
        
        
        
      .then(function (campaign) {
            if (!campaign) {
                res.json({
                    success: false,
                    message: 'Kampagne ist nicht vorhanden.'
                });
            } else {
                 sequelize.query("SELECT g.*"
                                        + ",(Select count(*) from User where currentGroup = g.id) as amountOfMembers"
                                        + ",(Select count(*) from View where groupId = g.id) as views,"
                                        + "(Select count(*) from Click where groupId = g.id) as clicks "
                                        + ",(Select title from Campaign where id = g.activeCampaign) as campaignTitle,"
                                        + "(Select id from Campaign where id = g.activeCampaign) as campaignId,"
                                        + "(Select url from Campaign where id = g.activeCampaign) as campaignUrl,"
                                        + "(Select color from Campaign where id = g.activeCampaign) as campaignColor"
                                        + " FROM Groups g where owner = :adminId AND g.activeCampaign =  :idToFind", {replacements: { adminId: req.tokendata.id, idToFind : idToFind },type: sequelize.QueryTypes.SELECT}

                                ).then(function (groups) {
                                    if(campaign.length === 0){
                                        res.json({success : false});
                                    }else{
                                         var tempcampaign = campaign[0];
                                         tempcampaign.activegroups = groups;
                                         res.json(tempcampaign);
                                    }
                                   
                                });
                
                
              
            }


        }, function (err) {
            console.error(err);
        });
    }

});


/**
 * MOVED TO HELPER FUNCTIONS!!!!!!
 * @param {type} param1
 * @param {type} param2M
 */
//function determineImageType(imageToDetermine) {
//    var image = "";
//    var imageType = "";
//    if (imageToDetermine.indexOf("png;base64") > -1) {
//        image = imageToDetermine.replace(/^data:image\/png;base64,/, "");			//png
//        imageType = "png";
//    } else if (imageToDetermine.indexOf("jpeg;base64") > -1) {
//        image = imageToDetermine.replace(/^data:image\/jpeg;base64,/, "");		//jpeg
//        imageType = "jpg";
//    } else if (imageToDetermine.indexOf("jpg;base64") > -1) {
//        image = imageToDetermine.replace(/^data:image\/jpg;base64,/, "");			//jpg 
//        imageType = "jpeg";
//    }
//
//    return {image: image, imageType: imageType};
//}
//;

router.put('/', function (req, res, next) {
    if (!req.body || !req.body.id) {
        res.status(404);
        res.end();
        return;
    }

    var campaignId = req.body.id;
    var campaign = req.body;
    var imageHasBeenStored = false;
    var newImagePath = null;

    async.series([
        function (callback) {
            if (req.body.image !== null && typeof req.body.image === 'object' && req.body.image.$ngfDataUrl !== null) {
                //new image was uploaded
//                var image = determineImageType(req.body.image.$ngfDataUrl);
                
                var image = helpers.imageTransformation.determineImageType(req.body.image.$ngfDataUrl);
                
                var imageType = image.imageType;
                imageHasBeenStored = true;
                var randomnumber = rand.generateKey(10);
                fs.writeFile("public/images/" + campaignId + "-" + randomnumber+ "." + imageType, image.image, 'base64', function (err) {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    
                     //für outlook wird ein bild in fester größe generiert
                      helpers.imageTransformation.createTransparentImageForOutlook(campaignId + "-" + randomnumber, imageType);
                    
                    //to store in next function
                    newImagePath = config.imageDirUrl + campaignId + "-" + randomnumber+"." + imageType;
                    callback();
                });

            } else {
                callback();
            }


        },
        function (callback) {

            //if new image has been uploaded save it to db
            if (imageHasBeenStored === true) {
                campaign.image = newImagePath;
            }
            Campaign.update(campaign, {
                where: {
                    id: campaignId,
                    owner: req.tokendata.id
                }
            }).then(function () {
                res.json({
                    success: true
                });
            }, function (err) {
                res.status(404);
                res.end();
                console.error(err);

            });
        }
    ]);


});



/* GET users listing. */
router.get('/results/:campaignId', function (req, res, next) {
    //res.end("Hallo");
    if (!req.params.campaignId) {
        res.status(404);
        res.end();
    } else {
        var campaignId = req.params.campaignId;
        var query = "select e.*" + "(Select count(*) from views where campaignId = :campaignId  and userId = e.id) as views," + "(Select count(*) from views where campaignId = :campaignId  and userId = e.id) as clicks," + "from employee e where e.id in (select userId from views where campaignId = CampaignId) or e.id in (select userId from clicks where campaignId = :campaignId )";
        sequelize.query(query, {
            replacements: { campaignId: campaignId},
            type: sequelize.QueryTypes.SELECT
        }).then(function (campaigns) {
            // We don't need spread here, since only the results will be returned for select queries
            // console.log(campaigns);
            return res.json(campaigns);
        }, function (err) {
            console.error(err);
        });
    }

});







router.post('/', function (req, res, next) {
    /**
     * Handle Image
     */


//    var image = determineImageType(req.body.image.$ngfDataUrl);
    
     var image = helpers.imageTransformation.determineImageType(req.body.image.$ngfDataUrl);
    
    var imageType = image.imageType;




    req.body.owner = req.tokendata.id;
    req.body.image = "";			//because otherwise there will be a validation error when storing campaign object


    

    //create campaign
    Campaign.create(req.body).then(function (createdObject) {

        //get id from created Object
        var idFromNewcampaign = createdObject.id;

        var imagePath = "public/images/" + idFromNewcampaign + "." + imageType;
       

        fs.writeFile(imagePath, image.image, 'base64', function (err) {
            if (err) {
                console.error(err);
                return;
            }
            
           
           //für outlook wird ein bild in fester größe generiert
           helpers.imageTransformation.createTransparentImageForOutlook(idFromNewcampaign, imageType);
                
           //update image path of campaign
            var tempImageDir = config.imageDirUrl + idFromNewcampaign + "." + imageType;
            Campaign.update({image: tempImageDir}, {where: {id: idFromNewcampaign}}).then(function () {
                
                res.json({
                    success: true,
                    id : idFromNewcampaign
                });
            }, function (err) {
                console.error(err);
            });
        });



    }, function (err) {

        console.error("Kampagne konnte nicht gespeichert werden: " + err);
        res.status(500);
        res.end();
    });
});





router.delete('/:campaignId', function (req, res, next) {

    if (!req.params.campaignId) {
        res.status(404);
        res.end();
    } else {
        var idToDel = req.params.campaignId;


        Campaign.destroy({
            where: {
                id: idToDel,
                owner : req.tokendata.id
            }
        }).then(function () {
            
            
            //delete active Signature from groups
            Group.update({activeCampaign : null}, {where : {activeCampaign : idToDel, owner : req.tokendata.id}});
            
            res.status(200);
            res.json({message: true});

        });
    }
});
router.post('/del/many', function (req, res, next) {

     if (!req.body.campaignIds || !Array.isArray(req.body.campaignIds)) {
        res.status(404);
        res.end();
    } else {
       
    Campaign.destroy({
            where: {
                id: req.body.campaignIds,
                owner : req.tokendata.id
            }
        }).then(function () {
            
            
             //delete active Signature from groups
            Group.update({activeCampaign : null}, {where : {activeCampaign : req.body.campaignIds, owner : req.tokendata.id}});
            
            
            res.status(200);
            res.json({message: true});

        });
    }
});




router.get('/data/statisticsbygroup/:campaignId', function (req, res, next) {
    if (!req.params.campaignId) {
        res.status(404);
        res.end();
    }

    var ret = {
        views: [],
        clicks: []
    };

//        var queryViews = "select count(*) as anzahl,"
//        +"(select title from Groups where groupId = v.groupId) as groupTitle," 
//        +"(select id from Groups where groupId = v.groupId) as groupId,"
//        +"(select count(*) from User where currentGroup = v.groupId ) as amountOfMembers "
//        +"from View v where campaignId = " + req.params.campaignId + " GROUP BY v.groupId";


    var queryViews = "select v.groupId, count(*) as anzahl,"
            + "(select title from Groups where id = v.groupId) as title, "
            + "(select id from Groups where id = v.groupId) as groupId,"
            + "(select count(*) from User where currentGroup = v.groupId ) as amountOfMembers "
            + "from View v where campaignId = :campaignId GROUP BY v.groupId";


    var queryClicks = "select v.groupId, count(*) as anzahl,"
            + "(select title from Groups where id = v.groupId) as title, "
            + "(select id from Groups where id = v.groupId) as groupId,"
            + "(select count(*) from User where currentGroup = v.groupId ) as amountOfMembers "
            + "from Click v where campaignId = :campaignId GROUP BY v.groupId";

    sequelize.query(queryViews, { replacements: { campaignId: req.params.campaignId},type: sequelize.QueryTypes.SELECT}).then(function (views) {
        ret.views = views;

        sequelize.query(queryClicks, { replacements: { campaignId: req.params.campaignId},type: sequelize.QueryTypes.SELECT}).then(function (clicks) {

            ret.clicks = clicks;
            res.json(ret);

        }, function (err) {
            console.error(err);
            res.status(404);
            res.end();

        });
    }, function (err) {

        console.error(err);
        res.status(404);
        res.end();

    });


});



router.get('/data/statistics', function (req, res, next) {

    if (!req.query.begin || !req.query.end) {
        res.status(404);
        res.end();
    }

    var begin = moment(req.query.begin, "YYYY-MM-DD");
    var end = moment(req.query.end, "YYYY-MM-DD");



    //add one day to end so views from today are already there
        end = end.add(1, 'days');
//         console.log("----------------------------------" + moment(end).format('YYYY-MM-DD'));
       

    if (!begin.isValid() || !end.isValid()) {
        return res.json({message: "date(s) invalid", success: false});

    }

    var diffDays = end.diff(begin, 'days');
    //console.log("DAYDIFF =" + diffDays);


    if (diffDays > 365) {
        return res.json({message: "daterange invalid", success: false});
    }
    else {
        var ret = {};
        //get date as string
        begin = moment(begin).format('YYYY-MM-DD');
        end = moment(end).format('YYYY-MM-DD');
        var userId = req.tokendata.id;



            var queryViews = 
                    "SELECT v.campaignId, DATE(v.createdAt) AS day, count(*) as anzahl, c.title, c.color "
                    +"FROM View v "
                    +"INNER JOIN Campaign c ON (v.campaignId = c.id) "
                    +" where c.owner = :adminId AND v.createdAt BETWEEN :begin AND :end "
                    +"GROUP BY v.campaignId, day ORDER BY campaignId";

             var queryClicks = 
                    "SELECT v.campaignId, DATE(v.createdAt) AS day, count(*) as anzahl, c.title, c.color "
                    +"FROM Click v "
                    +"INNER JOIN Campaign c ON (v.campaignId = c.id) "
                    +" where c.owner = :adminId AND v.createdAt BETWEEN :begin AND :end "
                    +"GROUP BY v.campaignId, day ORDER BY campaignId";



            var viewPromise = sequelize.query(queryViews, {replacements: { adminId: userId, begin : begin, end: end},type: sequelize.QueryTypes.SELECT}).then(function (views) {

                    return views;
            });


            var clickPromise =  sequelize.query(queryClicks, {replacements: {  adminId: userId, begin : begin, end: end},type: sequelize.QueryTypes.SELECT}).then(function (clicks) {

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


    }
});


router.get('/data/statistics/single', function (req, res, next) {

    if (!req.query.begin || !req.query.end) {
        res.status(404);
        res.end();
    }

    var begin = moment(req.query.begin, "YYYY-MM-DD");
    var end = moment(req.query.end, "YYYY-MM-DD");
    var campaignId = req.query.campaignId;
    if (!campaignId || campaignId == "") {
        res.status(404);
        res.end();
    }

    if (!begin.isValid() || !end.isValid()) {
        res.json({message: "date(s) invalid", success: false});

    }

    var diffDays = end.diff(begin, 'days');
    //console.log("DAYDIFF =" + diffDays);


    if (diffDays > 365) {
        res.json({message: "daterange invalid", success: false});
    }
    else {
        var ret = {};
        
        
          //add one day to end so views from today are already there
         end = end.add(1, 'days');
//         console.log("----------------------------------" + moment(end).format('YYYY-MM-DD'));
        
        //get date as string
        begin = moment(begin).format('YYYY-MM-DD');
        end = moment(end).format('YYYY-MM-DD');
        
        
        
      
        
        var userId = req.tokendata.id;


        var queryViews = "select v.campaignId,DATE(v.createdAt) AS day, count(*) as anzahl, (select title from Campaign where id=v.campaignId) as title, (select color from Campaign where id=v.campaignId) as color from View v where v.campaignId =  :campaignId   AND createdAt <= :end AND createdAt >= :begin   group by campaignId, day ORDER BY campaignId";
        var queryClicks = "select v.campaignId,DATE(v.createdAt) AS day, count(*) as anzahl, (select title from Campaign where id=v.campaignId) as title, (select color from Campaign where id=v.campaignId) as color from Click v where v.campaignId = :campaignId  AND createdAt <= :end AND createdAt >= :begin   group by campaignId, day ORDER BY campaignId";




        sequelize.query(queryViews, {replacements: { campaignId: campaignId, begin : begin, end: end},type: sequelize.QueryTypes.SELECT}).then(function (views) {
            ret.views = views;

            sequelize.query(queryClicks, {replacements: { campaignId: campaignId, begin : begin, end: end},type: sequelize.QueryTypes.SELECT}).then(function (clicks) {

                ret.clicks = clicks;
                res.json(ret);

            }, function (err) {
                console.error(err);
                res.status(404);
                res.end();

            });
        }, function (err) {

            console.error(err);
            res.status(404);
            res.end();

        });

    }
});

module.exports = router;
