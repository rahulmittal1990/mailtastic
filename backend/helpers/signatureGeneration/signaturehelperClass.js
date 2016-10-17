
var moment = require('moment');
var async = require("async");
var Promise = sequelize.Promise;
//var rand = require("generate-key");

var $q = require('q');
var signatureFields = require("../../helpers/signatureGeneration/fields.json"); 
/**
 * this module es responsible for handling the signature generation 
 * @returns {undefined}
 */


/**
 * SignatureHelper needs an admin object to handle data fetching correct
 * @param {type} adminId
 * @returns {SignatureHelper}
 */
var SignatureHelper = function(adminId){
    
    this.adminId = adminId;
     /**
                * holding the whole data which is needed for generating signatures
                */
    this.dataManager = 
                 {
                        fields : {},
                        employeeData : {},
                        companyData : {},
                        signatureData : {},
                        signatureTpl : "",
                        signatureTitle : "",
                        signatureId : "",
                        signatureLastRollout : "",
                        activeInGroups : [], //in welchen Gruppen ist die Signatur aktiv,
                        campaignIsUsed  : false     //mark if campaign is used in the signature designer so thtat the button turns blue
                        
                };
    
};

//DEFINING METHOS AS PROTOTYPE IS CHEAPER THEN DEFINING IT INSIDE CLASS BECAUSE THEN THEY WILL ONLY BE CREATED ONCE AND NOT EVERYTIME AN OBJECT IS INSTANTIATED


 /**
                  * replace placeholders in a html without handlebars
                  * @param {type} tpl
                  * @param {type} values
                  * @returns {unresolved}
                  */
SignatureHelper.prototype.replacePlaceholders = function(tpl, values){
    //replace all values in template
    for (var key in values) {
        // skip loop if the property is from prototype
           tpl = tpl.replaceAll("{{{" +key + "}}}", values[key]);
           tpl = tpl.replaceAll("{{" +key + "}}", values[key]);
    }

    //clear template from empty placeholders
    tpl = tpl.replaceAll(/\{\{(.*?)\}\}/g , "");

    return tpl;
};






/**
 * @param {type} mode
 * @returns {SignatureHelper@call;prepareDataForBackend}
* Get empty info data to save if user or company has an empty info data column
* @param {type} tpl
* @param {type} values
* @returns {unresolved}
*/
SignatureHelper.prototype.getEmptyFieldInfoStructure = function(mode){
    
    
//    var cloneOfA = JSON.parse(JSON.stringify(a));
    
    
//    var fields =  require("./fields.json");
    
    //clone field object always work with clone of object
      var fields =  JSON.parse(JSON.stringify(signatureFields));
    
    var ret;
    if(mode === "employee"){
       ret = this.prepareDataForBackend("employee", fields);
    }else if(mode === "company"){
          ret = this.prepareDataForBackend("company", fields);
    }
    return ret;
};





                /**
                  * 
                  * @param {type} html
                  * @param {type} employeeId
                  * @returns {undefined}Generate Preview and take the already loaded data from datamanager here in the service
                  */
SignatureHelper.prototype.generatePreviewComplete = function(employeeId){
                       
                   //merge all data sources with field structure
                    this.mergeDbDataWithStructure("company", this.dataManager.companyData, this.dataManager.fields);
                    this.mergeDbDataWithStructure("employee", this.dataManager.employeeData, this.dataManager.fields);
                    this.mergeDbDataWithStructure("signatureData", this.dataManager.signatureData, this.dataManager.fields);
                   
                   //get html content with placeholders
                    var htmltpl = this.dataManager.signatureTpl;                                     //get template
                    
                      //remove all marks for missing used value because it will be determined in the next step
                    this.clearMarkedAsMissing(this.dataManager.fields);   //DONT NEEED THIS HERE
                    
                    //get all field object in easily accesible array
                    var fieldData = this.getFieldStructureAsFlatArray(this.dataManager.fields);
                    
                    return this.generatePreview(htmltpl, fieldData, employeeId);
                    
};




                 /**
                  
                 * @param {type} html   HTML Template in which the placeholders habe to be replaced
                 * @param {type} fieldData  Data values with which the placeholders has to be replaced
                 * @returns {undefined}* Generate HTML from Signature, Employee and Other relevant Data 
                  */
                 SignatureHelper.prototype.generatePreview = function(html, fieldData, employeeId){
                     
                     var instance = this;
                     
                    /**
                     * Generate HTML for image 
                     * @param {type} imgObject
                     * @returns {String}
                     */
                    this.generateImageHtmlFromObject = function(imgObject){
                        var resultHtml = "";
                        var defaultImage = imgObject.defaultImage;
                        var whichImage = imgObject.value.whichImage;
                        
                        //remove https from default image
                       defaultImage= defaultImage.replace("https://", "http://");
                        
                        var tag = imgObject.tag;
                        var imgDimensions = imgObject.imgdimension;
                        
                        imgObject = imgObject.value;    //we had whole tag object to determine default image if no image was specified
                        
                        
                         //if user has not provided http or https
                        if (imgObject.url && !imgObject.url.startsWith("http://") && !imgObject.url.startsWith("https://") && tag !== "ma_skype") {
                                imgObject.url = "http://" + imgObject.url;
                        }
                        
                        
                        
                        
                        if(imgObject.showAs === "text"){
                            resultHtml = "<a target='_blank' href='" +imgObject.url +"'>" + imgObject.linkText + "</a>";
                        }else if(imgObject.showAs === "image"){
                            
                            //check if default image
                            var imageToShow =  whichImage  === "default" ?  defaultImage :  imgObject.image;
                            var url = imgObject.url;
                            //check if skype so generate url for skype call
                            if(tag === "ma_skype"){
                                url = "skype:" + url + "?call";
                            }
                           
                            
                            
                           //check if a custom width was given
                             //check if a custom width was given
                           var widthString = "";
                           //use only custom width when it is not default image
                            if(whichImage  !== "default" && imgDimensions && imgDimensions.mode === "custom" && imgDimensions.width && imgDimensions.height){
                               widthString = 'width="' + imgDimensions.width + '" height="'+ imgDimensions.height +'"';
                            }
                            
                            resultHtml = 
                                     "<a target='_blank' href='" +url +"'>"
                                   
                                        + "<img " + widthString +  " src=\"" + imageToShow  +"\" alt=\""+ imgObject.altText  +"\"  >" 
                                     + "</a>";
                           
                        }
                        return resultHtml;
                    };
                    
                    
                    /**
                     * Generate HTML for  link fields
                     * @param {type} linkObject
                     * @returns {String}
                     */
                    this.generateLinkHtmlFromObject = function(linkObject){

                        
                          //set color of link
                        var colorStyleString = "";
                        if(linkObject.linkcolor){
                            colorStyleString = 'style="color : ' + linkObject.linkcolor + ';color : ' + linkObject.linkcolor + ' !important;"'
                        }
                        
                        linkObject = linkObject.value;

                         //when no linktext is provided than use url as linktext
                        if(!linkObject.linkText){
                            linkObject.linkText = linkObject.url;
                        }
                        
                        
                              //if user has not provided http or https
                        if (linkObject.url && !linkObject.url.startsWith("http://") && !linkObject.url.startsWith("https://")) {
                                linkObject.url = "http://" + linkObject.url;
                        }
                       
                       
                        var resultHtml = "";
                        
                        resultHtml = "<a " + colorStyleString + " target='_blank' href='" +linkObject.url +"'>" + linkObject.linkText + "</a>";
                         return resultHtml;

                    };
                    
                    /**
                     * Generate HTML for campaignbanner
                     * @returns {String}
                     */
                    this.generateCampaignHtmlForUser = function(employeeId){
                        //mark campaign banner in signature Designer as used
                        instance.dataManager.campaignIsUsed = true;
                        
                        
                        
                        if(employeeId === "dummy"){    //generate dummy image
                            return '<a target="_blank" href="https://www.mailtastic.de"><img width="700" height="210" moz-do-not-send="true" src="https://www.mailtastic.de/img/common/dummyBanner.png" alt="Aktuell können Sie einige Informationen nicht sehen. Bitte aktivieren Sie externe Inhalte, um die Mail vollständig angezeigt zu bekommen." /></a>';
                        }else{
                            var rawSnippetTpl = '<a target="_blank" href="$$$APIURL$$$/li/$$$USERID$$$"><img width="700" height="210" moz-do-not-send="true" src="$$$APIURL$$$/im/$$$USERID$$$/ad?m=o&track=n" alt="Aktuell können Sie einige Informationen nicht sehen. Bitte aktivieren Sie externe Inhalte, um die Mail vollständig angezeigt zu bekommen." /></a>';   //ad?m=o means it is for outlook because every image there has to be 700x210px - moz-do-not-send="true" is for thunderbird
                            var userId = employeeId;
                            var backendUrl = config.imageapihost;
                            if(!userId){
                               console.error("generate campaign html for user : no user id");
                                return null;
                            }else{
                                var ret = rawSnippetTpl.replaceAll("$$$APIURL$$$", backendUrl);
                                //replace api url

                                //replace userid
                                 return ret.replaceAll("$$$USERID$$$", userId);
                            }
                        }
                    };
                    
                    
                    
//                      /**
//                 * replace tags which are marked with {{}} with the values
//                 * @param {type} tpl
//                 * @param {type} values
//                 * @returns {unresolved}
//                 */
//                    this.replacePlaceholders = function(tpl, values){
//                        //replace all values in template
//                        for (var key in values) {
//                            // skip loop if the property is from prototype
//                               tpl = tpl.replaceAll("{{{" +key + "}}}", values[key]);
//                               tpl = tpl.replaceAll("{{" +key + "}}", values[key]);
//                        }
//
//                        //clear template from empty placeholders
//                        //tpl = tpl.replaceAllRegex(/\{\{(.*?)\}\}/g , "");
//
//                        return tpl;
//                    };
                    
                    
                    
                    /**
                     * Generate tracking image pixel so that it is possible to track if the employee has the latest signature integrated
                     * @returns {undefined}
                     */
                    this.generateTrackingPixelHtml = function(){
                     
                        
                        var timestamp = moment().format();
                        var html = '<div><img alt="" style="width: 0;  max-width: 0; max-height: 0; height: 0;" src="' 
                                + config.imageapihost 
                                +  '/picserve/activatesig/' 
                                + this.dataManager.signatureId  
                                + '/' 
                                +  employeeId 
                                + '/' 
                                +  timestamp 
                                + '?track=n'        //is necessary because in integration page when showing preview there it must not track a view. Is cutted out when copy to clipboard
                                +'"></div>';
                        
                        return html;
                        
                        
                    };
                    
                    //set value to false. Only when campaign html is generated than mark it as used so that the button in the signature designer turns blue
                    this.dataManager.campaignIsUsed = false;
               
                    var content = html;

                    //parse all placeholders in template
                    var regExForPlaceholders = /\{\{(.*?)\}\}/g;
                    
                    //tag entry in edtor
                    var foundTagEntry;
                    
                    //values to replace the placeholders afterwards
                    var context = {};

                    do {
                        foundTagEntry = regExForPlaceholders.exec(content);
                        if (foundTagEntry) {
                            //check if it is tag for campaign banner 
                            if(foundTagEntry[1] === "kampagnen_banner"){   //kampagnen banner
                                var campaignBannerSnippet = this.generateCampaignHtmlForUser(employeeId);
                                context[foundTagEntry[1]] = campaignBannerSnippet;        //context um wert erweitern
                                
                            }else{  //its a regular tag so get field value from structure
                                //get value for tag
                                var tagOject = fieldData[foundTagEntry[1]];
                                if(!tagOject){  //fals jemand ein eigenes Tag reingeschrieben hat
                                    //to nothing
                                    context[foundTagEntry[1]] = "";        //context um wert erweitern
                                }
                                else if (!tagOject.value) {  //element muss rot markiert werden. Einfacher Wert und kein value
                                    tagOject.markedAsMissing = true;
                                    tagOject.markedAsUsed = true;
//                                     if(tagOject.locked === false){   //wenn feldwert nicht gesetzt und mitarbeier darf wert selbst ausfüllen dann soll der Tag in der Preview auftauchen.
//                                          context[foundTagEntry[1]] = "{{"  +tagOject.tag + "}}";
//                                     }else{
//                                         context[foundTagEntry[1]] = "";        //context um wert erweitern
//                                     }
                                      context[foundTagEntry[1]] = "";   //wenn wert fehlt darf eifnach gar nichts angezeigt werden      

                                }else if(tagOject.value && typeof tagOject.value === 'object' && !tagOject.value.url){      //objekt wert aber keine url gesetzt. URL wird von allen Objekten benutzt
                                     tagOject.markedAsMissing = true;
                                     tagOject.markedAsUsed = true;
//                                     if(tagOject.locked === false){   //wenn feldwert nicht gesetzt und mitarbeier darf wert selbst ausfüllen dann soll der Tag in der Preview auftauchen.
//                                          context[foundTagEntry[1]] = "{{"  +tagOject.tag + "}}";
//                                     }else{
//                                          context[foundTagEntry[1]] = "";        //context um wert erweitern
//                                     }
                                     
                                     
                                      context[foundTagEntry[1]] = "";        //context um wert erweitern. Wenn Wert fehlt darf einfach gar nichts angezeigt werden
                                     
                                } 
                                else {      //objekt wert ist gesetzt
                                    if(tagOject.type === "image"){
                                          context[foundTagEntry[1]] = this.generateImageHtmlFromObject(tagOject);        //context um wert erweitern

                                    }else if(tagOject.type === "link"){
                                         context[foundTagEntry[1]] = this.generateLinkHtmlFromObject(tagOject);        //context um wert erweitern
                                    }
                                    else{
                                          context[foundTagEntry[1]] = tagOject.value;        //context um wert erweitern
                                    }
                                    tagOject.markedAsMissing = false; //vorhandene Objekte müssen ent-marktiert werden
                                     tagOject.markedAsUsed = true;
                                }
                                
                            }
                        }
                    } while (foundTagEntry);

//                    var template = Handlebars.compile(content);
                    
                    //use simple replace because otherwise we need also {{{}}} and this can confuse the user
                    var replacedHtml = this.replacePlaceholders(content, context);
                    
                    //$scope.data.preview = $sce.trustAsHtml(template(context));
                    
                    
                    //add invisible tracking pixel so that it is possobile to track if the newst signature was integrated by the employee
                   
                    
                    //set inline style for horizontal lines
                    replacedHtml = replacedHtml.replaceAll("<hr />", "<hr style=\"border: none;margin:0;height: 1px; color: grey; background-color: grey;\" />");


                    //test for MAC MAIL = include it in a div
                    //replacedHtml ='<div style="font-family: Arial, Helvetica, sans-serif;font-size : 12px;line-height : 130%; letter-spacing : 0.7px;">' + replacedHtml + '</div>'
                    
                    //outlook css fix
//                    var outLookCssFix =  
//                           '<!--[if mso]>'+
//                             '<style type="text/css">'+
//                             'body, table, div, td{font-family: Arial, Helvetica, sans-serif !important;line-height : 130% !important;letter-spacing : 0.7px;}'+
//                             'span{line-height : 130% !important;}'+
//                             '</style>'+
//                             '<![endif]-->';
//                    
//                    var commonCSS = 
//                                '<style type="text/css">' +
//                                "tr img{width : 100%;}" +
//                                'body, table, div, td{font-family: Arial, Helvetica, sans-serif;font-size : 12px;line-height : 130%; letter-spacing : 0.7px;}'+
//                                'span{line-height : 130%;}'+
//                                "hr{border: none;margin:0;height: 1px; color: grey; background-color: grey; }" +
//                                "</style>";
                        
                        
                        
                            var outLookCssFix =   //fix only line height and letter spacing
                           '<!--[if mso]>'+
                             '<style type="text/css">'+
                             'body, table, div, td, span{line-height : 130% !important;letter-spacing : 0.2px;}'+
                             '</style>'+
                             '<![endif]-->';
                    
                    var commonCSS =  //fix only line height and letter spacing
                                '<style type="text/css">' +
                                "body, table, div, td, span{line-height : 130%; letter-spacing : 0.2px;}"+
                                "hr{border: none;margin:0;height: 1px; color: grey; background-color: grey; }" +
                                "</style>"; 
                    
                    //add css for making img in td width 100%
                     replacedHtml = outLookCssFix + commonCSS + replacedHtml;
                               
                               
                               
                                                              
                   var trackingPixel =  this.generateTrackingPixelHtml();      
                   var ret = {
                       snippet : replacedHtml,
                       trackingPixel : trackingPixel
                   };

           
                   return ret;
                     
};

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};





/**
* Merge data from backend with field structure on the right sidebar
* @param mode determines if company data oder employee data
* @param dbdata data from backend to merge
* @param structure JSON structure which represents the field values for signature
* @returns {undefined}
*/
SignatureHelper.prototype.mergeDbDataWithStructure = function (mode, dbdata, structure) {


    if(mode === "company" || mode === "employee"){
        if (mode === "company") {
            var fieldToSearch = structure.company.groups;   //search company fields

        } else if (mode === "employee") {
            var fieldToSearch = structure.employee.groups;   //search company fields
        }
        for (var i = 0; i < fieldToSearch.length; i++) {   //search in every group
            for (var u = 0; u < fieldToSearch[i].entries.length; u++) {   //search every element

                if (fieldToSearch[i].entries[u] && fieldToSearch[i].entries[u].tag && dbdata[fieldToSearch[i].entries[u].tag]) {
                    fieldToSearch[i].entries[u].value = dbdata[fieldToSearch[i].entries[u].tag];
                } else {
                    fieldToSearch[i].entries[u].value = "";
                }
            }
        }
    }else if(mode === "signatureData"){
        var fieldsToSearch = [
            structure.company.groups,
            structure.employee.groups
        ];
        for (var x = 0; x < fieldsToSearch.length; x++) {
            var fieldToSearch = fieldsToSearch[x];   //search company and employee  fields
            for (var i = 0; i < fieldToSearch.length; i++) {   //search in every group

                for (var u = 0; u < fieldToSearch[i].entries.length; u++) {   //search every element in group
                    if(x === 0){    //signature data has company and employee data 
                                        
                        if(fieldToSearch[i].entries[u] && fieldToSearch[i].entries[u].tag && dbdata.company[fieldToSearch[i].entries[u].tag]){
                                     fieldToSearch[i].entries[u].locked = dbdata.company[fieldToSearch[i].entries[u].tag].locked;    //currently iterating company
                                     
                                     
                                       //handle image dimensions. These are stored here because they are have the scope of a signature
                                        if(fieldToSearch[i].entries[u].type === "image" && dbdata.company[fieldToSearch[i].entries[u].tag].imgdimension){
                                            fieldToSearch[i].entries[u].imgdimension = dbdata.company[fieldToSearch[i].entries[u].tag].imgdimension;
                                        }
                                        
                                                                                  //handle link color. These are stored here because they are have the scope of a signature
                                        if(fieldToSearch[i].entries[u].type === "link" && dbdata.company[fieldToSearch[i].entries[u].tag].linkcolor){
                                            fieldToSearch[i].entries[u].linkcolor = dbdata.company[fieldToSearch[i].entries[u].tag].linkcolor;
                                        }

                        }

                    }else if(x === 1){
                         if(fieldToSearch[i].entries[u] && fieldToSearch[i].entries[u].tag && dbdata.employee[fieldToSearch[i].entries[u].tag]){
                                      fieldToSearch[i].entries[u].locked = dbdata.employee[fieldToSearch[i].entries[u].tag].locked;  //currently iterating employee
                                      
                                       //handle image dimensions. These are stored here because they are have the scope of a signature
                                                       if(fieldToSearch[i].entries[u].type === "image" && dbdata.employee[fieldToSearch[i].entries[u].tag].imgdimension){
                                                         fieldToSearch[i].entries[u].imgdimension = dbdata.employee[fieldToSearch[i].entries[u].tag].imgdimension;
                                                     }
                                                     
                                                     
                                                                                                          
                                                      //handle image dimensions. These are stored here because they are have the scope of a signature
                                                       if(fieldToSearch[i].entries[u].type === "link" && dbdata.employee[fieldToSearch[i].entries[u].tag].linkcolor){
                                                         fieldToSearch[i].entries[u].linkcolor = dbdata.employee[fieldToSearch[i].entries[u].tag].linkcolor;
                                                     }

                        }

                    }
                }
            }
        }

    }
                    
};



 /**
* Get json field data for signature fields etc
* @returns {unresolved}
*/
SignatureHelper.prototype.loadJsonFieldStructure = function(){
    //work with copy of json fields because otherwise many employees will share same object
   if(signatureFields){
        return $q.resolve(JSON.parse(JSON.stringify(signatureFields)));
   }else{
        return $q.reject();
   }

};
                
                
                
/**
 * clear every marked as missing data flag and markedAsUsedAndSet in frontend structure
 * Thiese flags are primarily used to show the correct color on the button in the designer (red, green, blue)
 * @returns {undefined}
 */
SignatureHelper.prototype.clearMarkedAsMissing = function (fieldStructure) {
    var fieldsToSearch = [
       fieldStructure.company.groups,
       fieldStructure.employee.groups
    ];
    for (var x = 0; x < fieldsToSearch.length; x++) {
        var fieldToSearch = fieldsToSearch[x];   //search company fields
        for (var i = 0; i < fieldToSearch.length; i++) {   //search in every group

            for (var u = 0; u < fieldToSearch[i].entries.length; u++) {   //search every element
                delete fieldToSearch[i].entries[u].markedAsMissing;
                delete fieldToSearch[i].entries[u].markedAsUsed;
            }
        }
    }
};
                
                
                
/**
  * Get field structure as flat array so it can be used to generate Preview
  * Used for generating preview
  * @param {type} fieldStructure
  * @returns {undefined}
  */
 SignatureHelper.prototype.getFieldStructureAsFlatArray = function(fieldStructure){
     var retObject = [];


      var fieldsToSearch = [
         fieldStructure.company.groups,
         fieldStructure.employee.groups
     ];
     for (var x = 0; x < fieldsToSearch.length; x++) {
         var fieldToSearch = fieldsToSearch[x];   //search company fields
         for (var i = 0; i < fieldToSearch.length; i++) {   //search in every group

             for (var u = 0; u < fieldToSearch[i].entries.length; u++) {   //search every element
                 //retObject.push(fieldToSearch[i].entries[u]);   
                  retObject[fieldToSearch[i].entries[u].tag] = fieldToSearch[i].entries[u];
             }
         }
     }
     return retObject;
 };


                





/**
* load employee data to map with signature placeholders
* if no employeeINfo data is stored so take empty data from json fields structure file
* if userId === dummy then load dummy data. Is needed for groups with no members
* @returns {$q@call;defer.promise}
*/
SignatureHelper.prototype.getEmployeeAccountData = function(userId, fields){
           var deferred = $q.defer();

           var instance = this;


           //check if id is available
          if(!userId ){   //get selected ID from Preview field
                return $q.reject("Employee acctoun data : No userid priveded");
          }
          if(userId !== "dummy"){
           var query = "SELECT u.email, u.firstname, u.lastname, u.id, u.isAdmin, u.currentGroup, u.userInfo, u.signatureActivated, u.signatureActivatedAt, u.userInfoUpdatedAt, u.signatureLastRollout "
           + ",(Select count(*) from View where userId = u.id) as views,"
           + "(Select count(*) from Click where userId = u.id) as clicks, "
           + "(Select title from Groups where id = u.currentGroup) as groupTitle, "
           + "(Select title from Signature where id = (Select activeSignature from Groups where id = u.currentGroup)) as signatureTitle, "
           +"(select companyInfoUpdatedAt from User where id = u.admin) as companyInfoUpdatedAt, "
           +"(select signatureUpdatedAt from Signature where id = (Select id from Signature where id = (Select activeSignature from Groups where id = u.currentGroup))) as signatureUpdatedAt, "
           + "(Select id from Signature where id = (Select activeSignature from Groups where id = u.currentGroup)) as signatureId, "
           + "(Select title from Campaign where id = (Select activeCampaign from Groups where id = u.currentGroup)) as campaignTitle, "
           + "(Select url from Campaign where id = (Select activeCampaign from Groups where id = u.currentGroup)) as campaignUrl, "
           + "(Select image from Campaign where id = (Select activeCampaign from Groups where id = u.currentGroup)) as campaignImage, "
           + "(Select color from Campaign where id = (Select activeCampaign from Groups where id = u.currentGroup)) as campaignColor "
           + "FROM `User` u where (u.id = :idToFind AND admin = :adminId) OR (u.id = :idToFind AND isAdmin = 1)";


   sequelize.query(query,
           {replacements: {adminId: instance.adminId, idToFind: userId},
               type: sequelize.QueryTypes.SELECT})





               .then(function(data){
               if(!data || !data.length === 0){
                   deferred.reject();
               }else if(!data[0].userInfo){   //no employee info is set in backend so we have to set initial employee info
                   var employeeId = userId;       //get selected employee
                   if(!employeeId){
                         deferred.reject("Mitarbeiter Daten konnten nicht vorbereitet werden.");   
                   }else{

                           var dataToSave = instance.prepareDataForBackend("employee", fields);



                            //handle firstname and lastname because the values have seperate columns in the db (legacy)
//                            var userFirstname =     dataToSave["ma_vorname"];
//                            var userLastName  =     dataToSave["ma_nachname"];

//handle firstname and lastname because the values have seperate columns in the db (legacy)
                            dataToSave["ma_vorname"] = data[0].firstname;
                            dataToSave["ma_nachname"] = data[0].lastname;
                            dataToSave["ma_email"] = data[0].email;


                           var json = JSON.stringify(dataToSave);

                               User.update({userInfo : json,  userInfoUpdatedAt  : sequelize.fn('NOW')},//save datetime when info was changed to determine if user has to habe an updated signature}, 
                                   {where: 
                                           {
                                               $or : [
                                                   {admin: instance.adminId, id : employeeId},
                                                   {isAdmin: true, id : employeeId}



                                               ]
                                           }
                                   }).       
                            then(function (data) {
                               if (data) {
                                   
                                   
                                    //merge field array with newly saved data for employee
                                   instance.mergeDbDataWithStructure("employee", dataToSave, fields);
                                   
                                   //set info of employee
                                   instance.dataManager.employeeData  =   dataToSave;     //save employee data in datamanager
                                   
                                  
                                   deferred.resolve();
                               } else {
                                   deferred.reject("CompanyInfo speichern war nicht erfolgreich.");
                               }

                           });
                   }
               }else{  //employee info is loaded so merge with field structure
                   try{
                       var employeeResultData = JSON.parse(data[0].userInfo);

                       //set firstname and lastname because it has an own column
                       employeeResultData["ma_vorname"] = data[0].firstname;
                       employeeResultData["ma_nachname"] =data[0].lastname;
                       employeeResultData["ma_email"] =data[0].email;


                       instance.dataManager.employeeData  =   employeeResultData;     //save employee data in datamanager
                       instance.mergeDbDataWithStructure("employee", employeeResultData, fields);
                       deferred.resolve();   
                   }catch(e){
                        deferred.reject(e);   
                   }


               }

           });

          }else if(userId === "dummy"){
               var employeeResultData = {};
               employeeResultData = this.employeeDummyData;
               this.dataManager.employeeData  =   employeeResultData;     //save employee data in datamanager
               this.mergeDbDataWithStructure("employee", employeeResultData, fields);
               deferred.resolve();   

          }

           return deferred.promise;
};
                        
                        
                        
                        
                        /**
                     * Get Signature Data. Currently this is only which field is locked and which is not.
                     * Further ist merges the data with the field data array in the designer
                     * @param fields Field to merge data with
                     * @returns {undefined}
                     */
                    SignatureHelper.prototype.getSignatureData =  function(signatureId, fields){
                        
                        var instance = this;
                        
                        var deferred = $q.defer();

                        if(signatureId === "create" ){ //todo check if it is really UUID
                            deferred.resolve("creationmode");       //no need to get signature data
                        }else if(typeof signatureId === "string"){
                             //check if id is available
                                Signature.findOne(          //find signature with id
                                      {where : 
                                          {
                                              id : signatureId, 
                                              owner : instance.adminId
                                          }
                                }).
                                     
                                    
                                    
                                    
                                    then(function(data){
                                if(!data ){
                                    deferred.reject();      //data is not valid so reject
                                }else{  //signature data is loaded so merge with field structure
                                    //$scope.mergeDbDataWithStructure("signatureData", JSON.parse(data.data.signatureData));  //map data from backend with field data
                                        data.data = data;
                                   
                                    try{
                                        instance.mergeDbDataWithStructure("signatureData", JSON.parse(data.data.signatureDataRolledOut), fields);
                                        instance.dataManager.signatureTpl = data.data.signatureTplRolledOut;
                                        instance.dataManager.signatureData  =  JSON.parse(data.data.signatureDataRolledOut);

                                        instance.dataManager.signatureTitle = data.data.title;
                                        instance.dataManager.signatureId = data.data.id;
                                        instance.dataManager.activeGroups = data.data.activeGroups;
                                        instance.dataManager.signatureLastRollout = data.data.lastRollout;
                                        instance.dataManager.signatureUpdatedAt = data.data.signatureUpdatedAt;
                                        instance.dataManager.companyInfoUpdatedAt = data.data.companyInfoUpdatedAt;
                  
                                        deferred.resolve();   
                                        
                                    }catch(e){
                                         deferred.reject("Parsing json error");
                                        
                                    }
                                 
                                }

                            });
                        }else{
                            deferred.reject("invalid state");
                        }

                        return deferred.promise;
                    };
                        
                        
                   
                    /**
                    * load company data to map with signature placeholders
                    * @returns {$q@call;defer.promise}
                    */
                    SignatureHelper.prototype.getCompanyAccountData = function(fields){
                    
                    
                    //save instance from outer scope
                    var instance = this;
                    
                    var deferred = $q.defer();
                    
                     User.findOne({
                            where: {
                                id: instance.adminId
                            },
                            attributes: ['email', 'firstname', 'lastname', 'companyName','companyInfo', 'isaacCustomerNumber', 'isaacCustomerToken','forceAllow', 'companyInfo', 'userInfo']
                        })
                    
                    
                    
                                .then(function (data) {
                                    if (!data) {
                                      console.error("get company account data : no data");
                                    } else {
                                        if (!data.companyInfo || !data.companyInfo === "") {  //user has no company Info so save dummy
                                            
                                            //prepare initial structure for company info data 
                                            var dataToSet = prepareDataForBackend("company", fields);
                                            
                                            
                                            if(data.companyName && !dataToSet["u_name"]){   //check if there is a value set in companyName column. (old customer in which companyName was stored as column value in user table)
                                                 //set company name correctly for the first time. After that there is no mapping between company signature name and account data
                                                dataToSet["u_name"] = data.companyName;   
                                            }
                                           
                                           //story company info because no info was there
                                            User.update({companyInfo : JSON.stringify(dataToSet)}, {where : { id : instance.adminId}}).then(function (data) {
                                                if (data.success === true) {
                                                   
                                               
                                                    instance.dataManager.companyData  =  dataToSet;
                                                    //no need to merge data because data from json array is the same
                                                    
                                                    
                                                    instance.mergeDbDataWithStructure("company", dataToSet, fields);
                                                    instance.clearMarkedAsMissing(fields);
                                                    
                                                } else {
                                                      console.error("save company info was not possible");
                                                }
                                                deferred.resolve();
                                            });
                                        } else {
                                            try {
                                                
                                                var companyDataObject = JSON.parse(data.companyInfo);
                                                instance.dataManager.companyData  =  companyDataObject;
                                                instance.mergeDbDataWithStructure("company", companyDataObject, fields);
                                                //$scope.mergeDbDataWithStructure("company", companyDataAsJson);
                                                instance.clearMarkedAsMissing(fields);
                                                deferred.resolve();
                                            } catch (e) {
                                                //alert(Strings.errors.TECHNISCHER_FEHLER);
                                                deferred.reject(e);
                                            }
                                           
                                           
                                        }
                                    }
                                });
                    
                    return deferred.promise;
                };
                    
                    
                    //static variable because shared by all objects
                SignatureHelper.employeeDummyData =
                {
                    "ma_vorname":"Max", 
                    "ma_nachname":"Mustermann", 
                    "ma_strasse":"Musterstraße 1", 
                    "ma_ort" : "Musterort", 
                    "ma_email":"max@mustermann.de", 
                    "ma_mobil":"0176 4588 6665", 
                    "ma_tel":" 06685 558 665", 
                    "ma_fax":" 06685 558 665 55", 
                    "ma_firma" : "Musterfirma",
                    "ma_abteilung" : "Musterabteilung",
                    "ma_position":"CEO", 
                    "ma_website":"www.maxmustermann.co", 
                    "ma_skype":"maxmu", 
                    "ma_fb":
                    {
                        "showAs":"image", 
                        "altText":"alternativ", 
                        "linkText":"sdfsdf3", 
                        "image":"http://localhost:3333/images/siglinks/employee/bf9c96a5-97dc-483a-9ac2-fe4c59d31b99/mitarbeiter_fb-Jx14l8uRH2.png", 
                        "url":"fsdf", 
                        "whichImage":"own"
                    }, 
                    "ma_googlep":
                    {
                        "showAs":"text", 
                        "altText":"te", 
                        "linkText":"text", 
                        "url":"fsfdsfdd", 
                        "whichImage":"default"
                    }, 
                    "ma_instagram":"", 
                    "ma_twitter":"", 
                    "ma_linkedin":"", 
                    "ma_xing":"", 
                };
                
            
                /**
                 * go through fields array and get all entrys where the employee is able to edit data
                 * is needed for integration page when employee has to enter missing data
                 * 
                 * @returns all fields which are used in signature template and are not locked
                 */
                SignatureHelper.prototype.getUserFieldsToComplete = function(){
                    if(!this.dataManager || !this.dataManager.signatureData || !this.dataManager.employeeData || !this.dataManager.companyData || !this.dataManager.fields ){
                        return $q.reject("getUserFieldsToComplete: not all data is loaded");
                        
                    }else{
                        try{
                            var fieldsToSearch = [
                               //fieldStructure.company.groups,     //not necesarry to search in company values because its not possible for employee to edit these fields
                               this.dataManager.fields.employee.groups
                           ];
                            var tagArrayToRet = [];
                        
                            for (var x = 0; x < fieldsToSearch.length; x++) {
                                var fieldToSearch = fieldsToSearch[x];   //search  fields
                                for (var i = 0; i < fieldToSearch.length; i++) {   //search in every group
                                    for (var u = 0; u < fieldToSearch[i].entries.length; u++) {   //search every element
                                        if(fieldToSearch[i].entries[u].markedAsUsed && !fieldToSearch[i].entries[u].locked){
                                            tagArrayToRet.push(fieldToSearch[i].entries[u]);
                                        } 
                                    }
                                }
                            }
                        }catch(e){
                            return $q.reject("getUserFieldsToComplete: exception on iterating over fields");
                            
                        }
                        return $q.resolve(tagArrayToRet);
                    }
                    
                };

                   

               /**
                 * Get all relevant data to generate Signature
                 * @param {type} userId the userId has to be provided because the signature preview can be displayed with users and signatures that are not assigned together
                 * @returns object with {fieldStructure, employeeData, companyData, signatureData}
                 */
                SignatureHelper.prototype.getRelevantDataForSignature = function(userId, signatureId, version){
                     var deferredOuter = $q.defer();
                    
                    //save instance from outer scope
                    var instance = this;
                    
                    
                     this.loadJsonFieldStructure()
                         .then(   
                            function(data){
                              instance.dataManager.fields = data;
                               return $q.resolve();
                            }
                        )
                        .then(   
                            function(){
                               return  $q.all([
                                    instance.getCompanyAccountData(instance.dataManager.fields).catch(),    //load company data and employee data parallel
                                    instance.getEmployeeAccountData(userId, instance.dataManager.fields).catch(),
                                    instance.getSignatureData(signatureId, instance.dataManager.fields, version).catch()
                                ]);
                            }
                        ).then(function(){
                            deferredOuter.resolve(instance.dataManager);    //in dataManager all the data is stored
                        }).catch(function(message){
                            deferredOuter.reject(message);
                            
                        });
                    
                    return deferredOuter.promise;
                };

               
                 /**
                 * Remove unecessary structure from data to prepare for storing in database
                 * Signature data is used to store signature data including value "locked"
                 * employee und company is only used when a news field value strucutre has to be created in backend
                 * if a single new value has to be stored the method saveFieldValue is used for every type of value
                 * @returns {undefined}
                 */
                SignatureHelper.prototype.prepareDataForBackend = function (mode, fields) {
                   
                     var returndata = {};
                    if(mode === "company" || mode === "employee"){
                         //prepare company data and user data
                       
                        if (mode === "company") {
                            var fieldToSearch = fields.company.groups;   //search company fields

                        } else if (mode === "employee") {
                            var fieldToSearch = fields.employee.groups;   //search company fields
                        }

                        for (var i = 0; i < fieldToSearch.length; i++) {   //search in every group
                            for (var u = 0; u < fieldToSearch[i].entries.length; u++) {   //search every element
                                var valueToSet = "";
                                if (fieldToSearch[i].entries[u].value) {
                                    valueToSet = fieldToSearch[i].entries[u].value;
                                }
                                returndata[fieldToSearch[i].entries[u].tag] = valueToSet;   //daten setzen
                            }
                        }
                        
                  
                    }else 
                        
                    if(mode === "signatureData"){        
                        /**
                        * Gets information which field is locked for employee to edit and which is not. Parses company data and employee data
                        * @returns array
                        */
                         var signatureData = {};
                         signatureData.company = {};
                         signatureData.employee = {};
                          //iterate over all fields
                           var fieldsToSearch = [
                               fields.company.groups,
                              fields.employee.groups
                           ];
                           for (var x = 0; x < fieldsToSearch.length; x++) {
                               var fieldToSearch = fieldsToSearch[x];   //search company fields
                               for (var i = 0; i < fieldToSearch.length; i++) {   //search in every group
                                   for (var u = 0; u < fieldToSearch[i].entries.length; u++) {   //search every element
                                       var dataToSet;
                                           if(x === 0){    //company data
                                           dataToSet = signatureData.company;
                                       }else if(x === 1){//employee data
                                           dataToSet = signatureData.employee;
                                       }
                                       dataToSet[fieldToSearch[i].entries[u].tag] = {};        //create object. Maybe later have to save more than one attribute
                                       dataToSet[fieldToSearch[i].entries[u].tag].locked = fieldToSearch[i].entries[u].locked;
                                       
                                       
                                       
                                       //store image dimensions
                                        dataToSet[fieldToSearch[i].entries[u].tag].imgdimension = fieldToSearch[i].entries[u].imgdimension;
                                        
                                                                                
                                        //store image dimensions
                                        dataToSet[fieldToSearch[i].entries[u].tag].linkcolor = fieldToSearch[i].entries[u].linkcolor;

                                   }
                               }
                           }
                        
                        returndata = signatureData;
                    }
                   
                    return returndata;
                };



module.exports = SignatureHelper;