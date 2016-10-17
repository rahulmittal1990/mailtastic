if (typeof String.prototype.startsWith != 'function') {
  // see below for better implementation!
  String.prototype.startsWith = function (str){
    return this.indexOf(str) === 0;
  };
}


if (typeof String.prototype.replaceAll != 'function') {
  // see below for better implementation!
  String.prototype.replaceAll = function (search, replacement){
    return this.split(search).join(replacement);
  };
}
var gm = require('gm').subClass({imageMagick: true});;  //needed for image manipulation for outlook
var fs = require("fs");
var resizer = require('limby-resize')({
    imagemagick: require('imagemagick'),
});                                                      // needed for gif image resize with breaking animation                       
var helper = {};
var Q = require('q');
var path = require('path');
var async = require("async");
var rand = require("generate-key"); //neded for getting random number for image name
var mkdirp = require('mkdirp'); //create if not existing folder
var moment = require('moment');
 var emailHandler = require('../helpers/mailhandler');
 var snippedTemplate = '<a href="' + config.ownhost + '/li/'
+ '$$$'
+ '" style="outline:0 !important;display:block;">'
+  '<img $OUTLSIZE$ moz-do-not-send="true" src="' + config.imageapihost + '/im/'
+ '$$$'
+ '/ad$OUTLOOK$" border="0" alt="Aktuell können Sie einige Informationen nicht sehen. Bitte aktivieren Sie externe Inhalte, um die Mail vollständig angezeigt zu bekommen." style="color:blue;font-size:12px;"/></a>';
  
function getSnippet(employeeId, outlook){   //wenn outlook === true dann wird der zusätzliche get parameter angehängt
   
	var snippedToSend = snippedTemplate;
	snippedToSend = snippedToSend.replaceAll("$$$", employeeId);
        
        if(outlook && outlook === true){
           snippedToSend = snippedToSend.replaceAll("$OUTLOOK$", "?m=o&track=n");
           snippedToSend = snippedToSend.replaceAll("$OUTLSIZE$", 'width="700" height="210"');
        
        }else{
             snippedToSend = snippedToSend.replaceAll("$OUTLOOK$", "?track=n");
             snippedToSend = snippedToSend.replaceAll("$OUTLSIZE$", "");
        }
	return snippedToSend;
}	

/**
 * Outlook hat einen eigenen Link weil dort das Bild immer auf feste größe gemerged wird
 * @type String
 */
var imageLink =  config.imageapihost + '/im/$$$' + '/ad?m=o';
var clickLink =  config.ownhost + '/li/$$$';
function getOutlookLinksForUser(employeeId){
    
    var ret = {
        first :  imageLink.replaceAll("$$$", employeeId),
        second : clickLink.replaceAll("$$$", employeeId)
    };
    return ret;
    
}

var imageTransformation = {
    
    maximagewidth : 700,
    maximageheight : 210,
    
    createTransparentImageForOutlook : function(filename, filetype){
       
        var imagePath = "public/images/"+filename+ "."+filetype;
        //var tempImagePath = "public/images/"+filename+ "_tmp" + "." + filetype;  //für das bauen des verkleinerten Bildes
        
            gm(imagePath).size(function(err, value){
//          console.log("-------------------------------------------------------------------" + JSON.stringify(value));
            var isBigSize = value.width > imageTransformation.maximagewidth || value.height > imageTransformation.maximageheight


            if (filetype == "gif") {
                if (isBigSize) {
                    resizer.resize(imagePath, {
                        width: imageTransformation.maximagewidth,
                        height: imageTransformation.maximageheight,
                        coalesce: true, // animated gif support ( if your image magick supports )
                        destination: imagePath,
                    }).then(function(){
                        imageTransformation.mergeGifs(filename, filetype);
                    });
                } else {
                    imageTransformation.mergeGifs(filename, filetype);
                }

            }
            else {

                if (isBigSize) {
                    gm(imagePath).resize(imageTransformation.maximagewidth, imageTransformation.maximageheight).write(imagePath, function(e){
                        console.log(e || 'done'); // What would you like to do here?
                          imageTransformation.mergeImages(filename , filetype);
                    });

                }else{
                     imageTransformation.mergeImages(filename, filetype);
                    //imageTransformation.extractframes(filename, filetype);
                }
                }
       });
    },
    /**
     * Transparentes bild mit dem eigentlichen Bild mergen für 
     * @param {type} filename
     * @param {type} filetype
     * @returns {undefined}
     */
    mergeImages : function(filename, filetype){
        var transparentImagePath = 'public/images/transparent.png';
        var imagePath = "public/images/"+filename+ "."+filetype;
        gm(transparentImagePath)
                        .draw(['image Over 0,0 0,0 ' + imagePath])
                        .write("public/images/" + filename + "_outlook.png", function(e){
                            console.log(e||'done'); // What would you like to do here?
                         });
        
    },
    mergeGifs: function(filename,filetype){
        gm()
        .command("convert")
        .in('public/images/transparent.gif')
        .in("null:")
        .in("public/images/" + filename + ".gif")
        .in("-layers", "Composite")
        .write("public/images/" + filename + "_outlook.gif", function (err) {
        if (err) {
            console.log("error");
        }
        });
    },
    mergeFrames: function (filename, tempFileName, callback) {
        var transparentImagePath = 'public/images/transparent.png';
        var imagePath = "public/images/temp/" + filename + "/" + tempFileName;
        var ext = path.extname(tempFileName);
        tempFileName = tempFileName.replace(ext, "");
        tempFileName = ("00" + tempFileName.split("-")[1]).slice(-3);
        gm(transparentImagePath)
            .draw(['image Over 0,0 0,0 ' + imagePath])
            .write("public/images/temp/" + filename + "/" + tempFileName + ext, function (e) {
                console.log(e || 'done');
                callback();
            });

    },
    extractframes: function (filename, filetype) {
        var dirPath = "public/images/temp/" + filename + "/";
        var imageDelay=500;
        fs.mkdir(dirPath, function (err) {
    
        });
        async.waterfall([function (callback) {
            gm()
                .command("convert")
                .in("-coalesce", '')
                .in("public/images/" + filename + ".gif")
                //.in("-thumbnail",  "250x250")
                // .in("+polaroid") 
                // insert other options...
                .write(dirPath + "/targets.png", function (err,value) {
                    if (err) return console.log(err);
                  gm("public/images/" + filename + ".gif").identify('%Tcs', function (err, format) {
                        if (err) return console.log(err);
                        imageDelay=parseInt(format.split('cs')[0],10);
                    });
                   
                    callback();

                });
        },
            function (callback) {
                var dirPath = "public/images/temp/" + filename + "/";
                fs.readdir(dirPath, function (err, filenames) {
                    if (err) {

                        return;
                    }
                    async.each(filenames, function (tempFileName, callback) {
                        var imagePath = dirPath + tempFileName;
                        gm(imagePath).size(function (err, value) {
                            var isBigSize = value.width > imageTransformation.maximagewidth || value.height > imageTransformation.maximageheight;
                            if (isBigSize) {
                                gm(imagePath).resize(imageTransformation.maximagewidth, imageTransformation.maximageheight).write(imagePath, function (e) {
                                    console.log(e || 'done'); // What would you like to do here?
                                    imageTransformation.mergeFrames(filename, tempFileName, function () {
                                        fs.unlink(imagePath, function () {
                                            callback();
                                        });
                                    });
                                });
                            } else {
                                imageTransformation.mergeFrames(filename, tempFileName, function () {
                                    fs.unlink(imagePath, function () {
                                        callback();
                                    });
                                });
                            }
                        });
                    }, function (err) {
                        if (err) {
                            console.log("error");
                        }
                        // Square has been called on each of the numbers
                        // so we're now done!
                        gm()
                            .command("convert")
                            .in("-dispose", "2")
                            .in("-delay", imageDelay)
                            .in(dirPath + "*.png")
                            .in("-coalesce")
                            .in("-layers", 'TrimBounds')
                            .write("public/images/" + filename + "_outlook.gif", function (err) {
                                if (err) return console.log(err);
                                callback();
                                // fs.createReadStream("public/images/" + filename + "_outlook.gif").pipe(fs.createWriteStream("public/images/" + filename + ".gif"));
                                fs.readdir(dirPath, function (err, filenames) {
                                    if (err) {

                                        return;
                                    }
                                    async.each(filenames, function (tempFileName, callback) {
                                        var imagePath = dirPath + tempFileName;
                                        fs.unlink(imagePath, function () {
                                            callback();
                                        });
                                         
                                    }, function (err) {
                                        if (err) {
                                            console.log("error");
                                        }
                                        fs.rmdirSync(dirPath);
                                    });
                                });
                            });
                    });
                });
            }
        ]);
    },

    // function is not is in used
    extractallimages: function (filename, filetype) {
        var imagePath = "public/images/" + filename + "." + filetype;
        var buffer = fs.readFileSync(imagePath);
        gm(imagePath).resize(imageTransformation.maximagewidth, imageTransformation.maximageheight).write(imagePath, function (e) {
            console.log(e || 'done'); // What would you like to do here?
            imageTransformation.mergeImages(filename, filetype);


        });
        var frame = gm(buffer).selectFrame(1);

        async.foreach(buffer, function (item, index, arr) {
            gm(item).selectFrame(index)
                .write("public/images/temp/tempImg_" + index + ".png", function (err) {
                    if (err)
                        console.log(err);
                });
        });

    },



    /**
     * 
     * @param {type} imageToDetermine
     * @returns {imageTransformation.determineImageType.helperfunctionsAnonym$2}detect image type 
     */
    determineImageType : function(imageToDetermine){
         var image = "";
        var imageType = "";
        if (imageToDetermine.indexOf("png;base64") > -1) {
            image = imageToDetermine.replace(/^data:image\/png;base64,/, "");			//png
            imageType = "png";
        } else if (imageToDetermine.indexOf("jpeg;base64") > -1) {
            image = imageToDetermine.replace(/^data:image\/jpeg;base64,/, "");		//jpeg
            imageType = "jpg";
        } else if (imageToDetermine.indexOf("jpg;base64") > -1) {
            image = imageToDetermine.replace(/^data:image\/jpg;base64,/, "");			//jpg 
            imageType = "jpeg";
        }
        else if (imageToDetermine.indexOf("gif;base64") > -1) {
            image = imageToDetermine.replace(/^data:image\/gif;base64,/, "");			//jpg 
            imageType = "gif";
        }

        return {image: image, imageType: imageType};
    },
    
    
    /**
     * Load the image with the given path and send it as response
     * @param {type} imagepath
     * @param {type} res Response Object
     * @returns {undefined}
     */
    serveImage : function(imagepath, res){
         //serve image from campaign
    var img = fs.readFile(imagepath, function (err, data) {
        if (err) {
            console.error("Error on reading file: " + err);
            res.end("Fehler beim Lesen der Bilddatei");
        } else {
            res.writeHead(200,
                    {
                        'Expires': 'Sat, 26 Jul 1997 05:00:00 GMT',
                        'Last-Modified': gmdate() + " GMT",
                        'Content-Type': 'image/png',
                        'Cache-directive': 'no-cache',
                        'Cache-Control': 'no-store, no-cache, must-revalidate,post-check=0, pre-check=0',
                        'Pragma': 'no-cache'

                    });
            res.end(data, 'binary');
            ('');
        }

    });
        
    }
    
    
};



var signatureHelper = {
    
    
    /**
     * if new image is provided -> store image on server and return link
     * if image was not changed in frontend -> return old link
     * if default image has to be used ->  return link from default image
     * @param {type} linkObject object values like image alt text etc
     * @param {type} tag 
     * @param {type} Id id of employee or company
     * @param {type} type employee or company
     * @returns {Q@call;defer.promise}
     */
    processImageValue : function(linkObject, tag, id , type){
    var deferred = Q.defer();
    var retObj = {};
    

    if(!(type === "employee" || type === "company")){   //is it is neither employee nor company the call is invalid
        deferred.reject();
        return;
    }
   
    
    if(linkObject.showAs === "text"){ //when has to be shown as text than no image processing is necessary
        deferred.resolve(linkObject);
        
    }else if(linkObject.showAs === "image"){  
        if(linkObject.whichImage === "default"){ //if as image is used default image than the correct image path was already set in the frontend
            deferred.resolve(linkObject);
        }else if(linkObject.whichImage === "own"){ 
            if (linkObject.image !== null && typeof linkObject.image === 'object' && linkObject.image.$ngfDataUrl !== null) {   //new uploaded image
                //new image was uploaded
                
                var image = helper.imageTransformation.determineImageType(linkObject.image.$ngfDataUrl);
                var imageType = image.imageType;
                var randomnumber = rand.generateKey(10);
                
                //create folder for user
                var path = 'public/images/siglinks/' +type + '/'+id;
                mkdirp(path, function(err) { 
                     // path exists unless there was an error
                    if(err){
                         deferred.reject();
                         return;
                        
                    }else{
                        //write file to disk
                        var imageFileName = tag + "-" + randomnumber+ "." + imageType;
                        fs.writeFile(path + "/" + imageFileName , image.image, 'base64', function (err) {
                            if (err) {
                                console.error(err);
                                deferred.reject();
                                return;
                            }
                            //to store in next function
                            var newImagePath = config.imageDirUrl + "siglinks/" + type + "/" + id + "/" + imageFileName;
                            
                            newImagePath = newImagePath.replace("https://", "http://"); //image should not be served via https because some windows terminal clients do not show them in outlook. 
                            
                            linkObject.image = newImagePath;
                            deferred.resolve(linkObject);
                        });
                    }
               });
            }else if(linkObject.image &&  linkObject.image.startsWith('http')){ //seems to be an image path so image was not changed in frontend TODO only allow images from http//www.app.mailtastic.de
                 deferred.resolve(linkObject);
                
            } 
            else {    //invalid parameters
                deferred.reject();
            }
        }
    }
    return deferred.promise;
},


    /**
     * returns the signature status for an employee
     * 
     * 
     * @param {type} employee
     * @param {type} signatureId
     * @returns {String} 
     *      "error" on error
     *      "outdated" when outdated
     *      "latest" when it is the latest
     */
    getSignatureStatus : function(employee, signatureId, mode){
        
//        if(!signatureId || !employee){
//            return "error";
//        }
//        
//        
//         //signature was never activated for this employee
//        if(!employee.signatureActivated || !employee.signatureActivatedAt){
//               return "outdated";
//        }
//        if(employee.signatureActivated !== signatureId){
//             return "outdated";
//            
//        }
//        
//        
//        var companyInfoChangedAt    =   moment(new Date(employee.companyInfoUpdatedAt));      //when was the company info changed
//        var employeeInfoChangedAt   =   moment(new Date(employee.userInfoUpdatedAt));         //when was the user info changed
//        var signatureChangedAt      =   moment(new Date(employee.signatureUpdatedAt));        //when was the signature changed
//        var signatureActivatedAt    =   moment(new Date(employee.signatureActivatedAt));      //when was this signature activated for the user
//        
//        
//        if(!employee.companyInfoUpdatedAt && !employee.userInfoUpdatedAt && !employee.signatureUpdatedAt){ //information was never updated so the signature must be latest
//             return "latest";
//        }
//        else if(    //something was changed so compare dates
//                (employee.companyInfoUpdatedAt && signatureActivatedAt.isBefore(companyInfoChangedAt)) 
//                || 
//                (employee.userInfoUpdatedAt && signatureActivatedAt.isBefore(employeeInfoChangedAt))
//                ||  
//                (employee.signatureUpdatedAt && signatureActivatedAt.isBefore(signatureChangedAt))){
//            //signature was never activated for this employee
//            return "outdated";
//        }else{
//            return "latest";
//        }
        
        
        
 
                     
                    if(!signatureId || !employee){
                        return "error";
                    }


                    //employee has no signature active or employee has another signature activated than in his group is active
                    if(!employee.signatureActivated || employee.signatureActivated !== signatureId){
                        return "outdated";
                    }

                    //get all relevant timestamps
                    var companyInfoChangedAt                        =   moment(new Date(employee.companyInfoUpdatedAt));      //when was the company info changed
                    var employeeInfoChangedAt                       =   moment(new Date(employee.userInfoUpdatedAt));         //when was the user info changed
                    var signatureChangedAt                          =   moment(new Date(employee.signatureUpdatedAt));        //when was the signature changed
                    var signatureActivatedAt                        =   moment(new Date(employee.signatureActivatedAt));      //when was this signature activated for the user
                    var lastRolloutOfSignature                      =   moment(new Date(employee.lastRollout));      //last rollout datetime of signature itself
                    var lastRolloutOfSignatureForSingleEmployee     =   moment(new Date(employee.signatureLastRollout));  

                    
                    
                    
                    if(    //when last rollout for single employee was before the change time then it is outdated
                        (employee.userInfoUpdatedAt && signatureActivatedAt.isBefore(employeeInfoChangedAt))        //show outdated when user info has changed
                        ||  
                        (employee.lastRollout && signatureActivatedAt.isBefore(lastRolloutOfSignature))){        //show outdatad when signature was rolledout since
                        //signature was never activated for this employee
                        return "outdated";
                    }else{
                        return "latest";
                    }
        
           
                      
                   
//                     
//                    if(!signatureId || !employee){
//                        return "error";
//                    }

//                    //user has another signature activated then in his current group is active
//                    if(employee.signatureActivated !== signatureId){
//                      return "outdated";
//
//                    }

//                    //get all relevant timestamps
//                    var companyInfoChangedAt                        =   moment(new Date(employee.companyInfoUpdatedAt));      //when was the company info changed
//                    var employeeInfoChangedAt                       =   moment(new Date(employee.userInfoUpdatedAt));         //when was the user info changed
//                    var signatureChangedAt                          =   moment(new Date(employee.signatureUpdatedAt));        //when was the signature changed
//                    var signatureActivatedAt                        =   moment(new Date(employee.signatureActivatedAt));      //when was this signature activated for the user
//                    var lastRolloutOfSignature                      =   moment(new Date(employee.lastRollout));      //last rollout datetime of signature itself
//                    var lastRolloutOfSignatureForSingleEmployee     =   moment(new Date(employee.signatureLastRollout));  
//
//                    if(!employee.companyInfoUpdatedAt && !employee.userInfoUpdatedAt && !employee.signatureUpdatedAt){ //information was never updated so the signature must be latest
//                         return "latest";
//                    }
//                    else{ //now it depends on if it is the context of employee, group or signature 
//                        
//                        if(mode === "employee" || mode === "group"){
//                            //employee should not be marked as outdated when only the company info was changed
//                            
//                            if(    //when last rollout for single employee was before the change time then it is outdated
//                                (employee.userInfoUpdatedAt && lastRolloutOfSignatureForSingleEmployee.isBefore(employeeInfoChangedAt))        //show outdated when user info has changed
//                                ||  
//                                (employee.signatureUpdatedAt && lastRolloutOfSignatureForSingleEmployee.isBefore(lastRolloutOfSignature))){        //show outdatad when signature data has changed
//                                //signature was never activated for this employee
//                                return "outdated";
//                            }else if(    //when last rollout for single employee was after the change time, but it is not activated yet it is "rolledout"
//                                (employee.userInfoUpdatedAt && signatureActivatedAt.isBefore(employeeInfoChangedAt))        //show outdated when user info has changed
//                                ||  
//                                (employee.signatureUpdatedAt && signatureActivatedAt.isBefore(lastRolloutOfSignature))){        //show outdatad when signature data has changed
//                                //signature was never activated for this employee
//                                return "rolledout";
//                            }
//                            
//                            else{
//                                return "latest";
//                            }
//                            
//                        }else if(mode === "signature" ){
//                            if(    //something was changed so compare dates
//                                (employee.companyInfoUpdatedAt && lastRolloutOfSignatureForSingleEmployee.isBefore(companyInfoChangedAt))      //show outdated when company info has changed
//                                || 
//                                (employee.userInfoUpdatedAt && lastRolloutOfSignatureForSingleEmployee.isBefore(employeeInfoChangedAt))        //show outdated when user info has changed
//                                ||  
//                                (employee.signatureUpdatedAt && lastRolloutOfSignatureForSingleEmployee.isBefore(signatureChangedAt))){        //show outdatad when signature data has changed
//                                //signature was never activated for this employee
//                                return "outdated";
//                            }else{
//                                return "latest";
//                            }
//                            
//                        }
//                   }
                    
                }
            };
   

    
    






var invitationHelper = {
    sendManyInvitationMails : function(emps, req, res, reinvite){
         //get name of invitor
    User.findOne({where: {isAdmin: true, id: req.tokendata.id}}).then(function (adminobject) {
        if (!adminobject) {
            console.error("Invite User: Admin was not found: " + req.tokendata.id);
            res.json({
                success: false,
                code: 9
            });
        } else {
            for (var i = 0; i < emps.length; i++) {
                var inputData = emps[i];
                inputData.link = config.webapphost + "/#/activation/employee?ac=" + emps[i].activationCode + "&eid=" + emps[i].id;

                if (!adminobject.firstname) {
                    inputData.invitor = adminobject.email;
                } else {
                    inputData.invitor = adminobject.firstname + " " + adminobject.lastname;
                }
                inputData.invitormail = adminobject.email;
                
                
                //should user be invited for first time or reinvite (its a different mail)
                if(reinvite && reinvite===true){
                     emailHandler.sendEmployeeReinvitation(emps[i].email, inputData).then(function (data) {
                            if (data === true) {

                            }
                        });
                }else{
                    if(emps[i].isActivated == 0){
                        emailHandler.sendEmployeeInvitation(emps[i].email, inputData).then(function (data) {
                            if (data === true) {

                            }
                        });
                    }else{
                        emailHandler.sendEmployeeSomethingChangedMail(emps[i].email, inputData).then(function (data) {
                            if (data === true) {

                            }
                        });
                        
                    }
                    
                }
                
                
            }
            var adressesAlreadyExistent = null; //checken ob addressen schon vorhanden waren beim Importieren
            if (res.adressesAlreadyExistent) {
                adressesAlreadyExistent = res.adressesAlreadyExistent;
            }

          
        }
    });
        
    },
        /**
     * Send mail to sync users when data is missing for signature
     * @param {type} emps
     * @param {type} adminId
     * @returns {undefined}
     */
    sendMissingDataEmail : function(emps, adminId){
        
        User.findOne({where: {isAdmin: true, id: adminId}}).then(function (adminobject) {
            if (!adminobject) {
                console.error("Sending Data Completion mail failed: Admin was not found: " + adminId);

            } else {
                for (var i = 0; i < emps.length; i++) {
                    var inputData = emps[i];
                    inputData.link = config.webapphost + "/#/datacompletion/employee?ac=" + emps[i].activationCode + "&eid=" + emps[i].id;  //create link

                    if (!adminobject.firstname) {
                        inputData.invitor = adminobject.email;
                    } else {
                        inputData.invitor = adminobject.firstname + " " + adminobject.lastname;
                    }
                    inputData.invitormail = adminobject.email;


                    emailHandler.sendSyncUserDataMissingMail(emps[i].email, inputData).then(function (data) {
                        if (data === true) {

                        }
                    });

                }
            }
        })
    }  

    
};



function gmdate() {
    //  discuss at: http://phpjs.org/functions/gmdate/
    // original by: Brett Zamir (http://brett-zamir.me)
    //    input by: Alex
    // bugfixed by: Brett Zamir (http://brett-zamir.me)
    //  depends on: date
    //   example 1: gmdate('H:m:s \\m \\i\\s \\m\\o\\n\\t\\h', 1062402400); // Return will depend on your timezone
    //   returns 1: '07:09:40 m is month'

//  var dt = typeof timestamp === 'undefined' ? new Date() : // Not provided
//  typeof timestamp === 'object' ? new Date(timestamp) : // Javascript Date()
//  new Date(timestamp * 1000); // UNIX timestamp (auto-convert to int)
//  timestamp = Date.parse(dt.toUTCString()
//    .slice(0, -4)) / 1000;
//  return this.date(format, timestamp);
//  

    var time = new Date((+new Date()) + (5 * 60 * 60000)); // js times are ms

//    alert(time.toUTCString()); 
    return time.toUTCString();
}






helper.imageTransformation = imageTransformation;
helper.getHtmlSnippetForUser = getSnippet;
helper.getOutlookLinksForUser = getOutlookLinksForUser;
helper.signatureHelper = signatureHelper;
helper.invitationHelper = invitationHelper;

helper.userInfoStructure = {
    
    
};

helper.companyInfoStructure = {
    
    
};


module.exports = helper;