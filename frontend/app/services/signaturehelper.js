/*global define*/
    'use strict';
/**
 * 
 * @param {type} param1
 * @param {type} param2Service for helping with signature handling (NOT SERVICE FOR SENDING SIGNATURE REQUESTS TO BACKEND)
 * Methods for generating signatures on base of data etc
 */
     angular.module('mailtasticApp.services').service('signatureHelperService', [
        'signatureService',
        'alertService',
        '$q',
        '$http',
        'employeeService',
        'userService',
        function (signatureService , alertService, $q, $http, employeeService,userService) {

          var ownServiceObject = this;      //to call own member function

            // nagivate back
            this.deleteSigs = function (id, $scope) {
                var deferred = $q.defer();
                
                
                    var ids = [];
                    if (!id) {    //mehrere markierte sollen gelöscht werden

                        for (var i = 0; i < $scope.data.selectedSigs.length; i++) {
                            ids.push($scope.data.selectedSigs[i].id);

                        }
                        if (ids.length === 0) {
                            alert("Bitte selektieren Sie mindestens einen Mitarbeiter.");
                             deferred.reject("no selection");
                        }
                    } else {      //einzelner soll gelöscht werden mit übergebener id
                        ids.push(id);
                    }

                    var text = ids.length > 1 ? 'Möchten Sie diese Signaturen wirklich löschen?' : 'Möchten Sie diese Signatur wirklich löschen?';
                    bootbox.confirm({
                                size: 'small',
                                message: text,
                                callback: function (result) {
                                    if (result === true) {
                                        //get all ids
                                        signatureService.delete(ids).then(function (res) {
                                            if (res.success !== true) {
                                                alertService.defaultErrorMessage(Strings.signature.list.errors.DELETION_FAILED);
                                                 deferred.reject("pressed no on modal");
                                            }else{
                                                alertService.defaultSuccessMessage(Strings.signature.list.success.DELETION_COMPLETED);
                                                deferred.resolve();
                                            }
                                        
                                        });

                                    }else{
                                        deferred.reject("pressed no on modal");
                                    }

                                }
                            });
                            
                return deferred.promise;
                            
                 };
                 
                 
                 
                 /**
                  * replace placeholders in a html without handlebars
                  * @param {type} tpl
                  * @param {type} values
                  * @returns {unresolved}
                  */
                 this.replacePlaceholders = function (tpl, values){
                    
                    
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
                  * 
                  * @param {type} html
                  * @param {type} employeeId
                  * @returns {undefined}Generate Preview and take the already loaded data from datamanager here in the service
                  */
                this.generatePreviewComplete = function(employeeId){
                       
                   //merge all data sources with field structure
                    ownServiceObject.mergeDbDataWithStructure("company", ownServiceObject.dataManager.companyData, ownServiceObject.dataManager.fields);
                    ownServiceObject.mergeDbDataWithStructure("employee", ownServiceObject.dataManager.employeeData, ownServiceObject.dataManager.fields);
                    ownServiceObject.mergeDbDataWithStructure("signatureData", ownServiceObject.dataManager.signatureData, ownServiceObject.dataManager.fields);
                   
                   //get html content with placeholders
                    var htmltpl = ownServiceObject.dataManager.signatureTpl;                                     //get template
                    
                      //remove all marks for missing used value because it will be determined in the next step
                    ownServiceObject.clearMarkedAsMissing(ownServiceObject.dataManager.fields);   //DONT NEEED THIS HERE
                    
                    //get all field object in easily accesible array
                    var fieldData = ownServiceObject.getFieldStructureAsFlatArray(ownServiceObject.dataManager.fields);
                    
                    return ownServiceObject.generatePreview(htmltpl, fieldData, employeeId);
                    
                };
                 
                 /**
                  
                 * @param {type} html   HTML Template in which the placeholders habe to be replaced
                 * @param {type} fieldData  Data values with which the placeholders has to be replaced
                 * @returns {undefined}* Generate HTML from Signature, Employee and Other relevant Data 
                  */
                 this.generatePreview = function(html, fieldData, employeeId){
                     
                    /**
                     * Generate HTML for image 
                     * @param {type} imgObject
                     * @returns {String}
                     */
                    this.generateImageHtmlFromObject = function(imgObject){
                         var resultHtml = "";
                        var defaultImage = imgObject.defaultImage;
                        var whichImage = imgObject.value.whichImage;
                        
                        var tag = imgObject.tag;
                        var imgDimensions = imgObject.imgdimension;
                        imgObject = imgObject.value;    //we had whole tag object to determine default image if no image was specified
                        
                        
                          
                        //if user has not provided http or https
                        if (imgObject.url && !imgObject.url.startsWith("http://") && !imgObject.url.startsWith("https://")) {
                                imgObject.url = "http://" + imgObject.url;
                        }
                        
                        
                        if(imgObject.showAs === "text"){
                            resultHtml = "<a target='_blank' href='" +imgObject.url +"'>" + imgObject.linkText + "</a>";
                        }else if(imgObject.showAs === "image"){
                          var imageToShow =  whichImage  === "default" ?  defaultImage :  imgObject.image;
                            var url = imgObject.url;
                            //check if skype so generate url for skype call
                            if(tag === "ma_skype"){
                                url = "skype:" + url + "?call";
                            }
                           
                           
                           //check if a custom width was given
                           var widthString = "";
                             //use only custom width when it is not default image
                            if(whichImage  !== "default" && imgDimensions && imgDimensions.mode === "custom" && imgDimensions.width && imgDimensions.height){
                               widthString = 'width="' + imgDimensions.width + '" height="'+ imgDimensions.height +'"';
                            }
                            
                            resultHtml = 
                                     "<a target='_blank' href='" +url +"'>"
                                     //+ "<img src=\"" + imageToShow  +"\" alt=\""+ imgObject.altText  +"\" style=\"width:100%;\"  >" 
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
                        ownServiceObject.dataManager.campaignIsUsed = true;
                        
                        
                        
                        if(employeeId === "dummy"){    //generate dummy image
                            return '<a target="_blank" href="https://www.mailtastic.de"><img src="https://www.mailtastic.de/img/signatures/defaultimg/Beispiel-Banner.png" alt="Aktuell können Sie einige Informationen nicht sehen. Bitte aktivieren Sie externe Inhalte, um die Mail vollständig angezeigt zu bekommen." /></a>'
                        }
                        else if(!ownServiceObject.dataManager.employeeCampaignTitle){
                            return "";
                            
                        }
                        else{
                            
                            //generate image but not the campaign tracking because otherwise a view is tracked
                            
                            var rawSnippetTpl = '<a target="_blank" href="$$$CAMPAIGNURL$$$"><img src="$$$CAMPAIGNIMAGE$$$" alt="Aktuell können Sie einige Informationen nicht sehen. Bitte aktivieren Sie externe Inhalte, um die Mail vollständig angezeigt zu bekommen." /></a>';
                            var userId = employeeId;
                            var backendUrl = GlobalConfig.config.apiUrl;
                            if(!userId){
                                alertService.defaultErrorMessage(Strings.errors.DATEN_NICHT_GELADEN);
                                return null;
                            }else{
                                var ret = rawSnippetTpl.replace("$$$CAMPAIGNURL$$$", ownServiceObject.dataManager.employeeCampaignUrl);
                                //replace api url

                                //replace userid
                                 return ret.replace("$$$CAMPAIGNIMAGE$$$", ownServiceObject.dataManager.employeeCampaignImage);
                            }
                        }
                    };
                    
                    
                    
                      /**
                 * replace tags which are marked with {{}} with the values
                 * @param {type} tpl
                 * @param {type} values
                 * @returns {unresolved}
                 */
                    this.replacePlaceholders = function(tpl, values){
                        //replace all values in template
                        for (var key in values) {
                            // skip loop if the property is from prototype
                               tpl = tpl.replaceAll("{{{" +key + "}}}", values[key]);
                               tpl = tpl.replaceAll("{{" +key + "}}", values[key]);
                        }

                        //clear template from empty placeholders
                        //tpl = tpl.replaceAllRegex(/\{\{(.*?)\}\}/g , "");

                        return tpl;
                    };
                    
                    
                    
                    /**
                     * Generate tracking image pixel so that it is possible to track if the employee has the latest signature integrated
                     * @returns {undefined}
                     */
                    this.generateTrackingPixelHtml = function(){
                     
                        
                        
//                        var html = '<div><img style="width: 0;  max-width: 0; max-height: 0; height: 0;" src="' 
//                                + GlobalConfig.config.apiUrl 
//                                +  '/picserve/activatesig/' 
//                                + ownServiceObject.dataManager.signatureId  
//                                + '/' 
//                                +  employeeId 
//                                +'"></div>';
//                        
//                        return html;
                        
                        return "";
                        
                        
                    };
                    
                    //set value to false. Only when campaign html is generated than mark it as used so that the button in the signature designer turns blue
                    ownServiceObject.dataManager.campaignIsUsed = false;
               
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
                                     if(tagOject.locked === false){   //wenn feldwert nicht gesetzt und mitarbeier darf wert selbst ausfüllen dann soll der Tag in der Preview auftauchen.
                                          context[foundTagEntry[1]] = "{{"  +tagOject.tag + "}}";
                                     }else{
                                         context[foundTagEntry[1]] = "";        //context um wert erweitern
                                     }
                                }else if(tagOject.value && typeof tagOject.value === 'object' && !tagOject.value.url){      //objekt wert aber keine url gesetzt. URL wird von allen Objekten benutzt
                                     tagOject.markedAsMissing = true;
                                     tagOject.markedAsUsed = true;
                                     if(tagOject.locked === false){   //wenn feldwert nicht gesetzt und mitarbeier darf wert selbst ausfüllen dann soll der Tag in der Preview auftauchen.
                                          context[foundTagEntry[1]] = "{{"  +tagOject.tag + "}}";
                                     }else{
                                          context[foundTagEntry[1]] = "";        //context um wert erweitern
                                     }
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
                    replacedHtml += this.generateTrackingPixelHtml();
                   
                    //set inline style for horizontal lines
                    replacedHtml = replacedHtml.replaceAll("<hr />", "<hr style=\"border: none;margin:0;height: 1px; color: grey; background-color: grey;\" />");

                  
                   //outlook css fix
//                    var outLookCssFix =  
//                           '<!--[if mso]>'+
//                             '<style type="text/css">'+
//                             'body, table, div, td{font-family: Arial, Helvetica, sans-serif !important;line-height : 130% !important;letter-spacing : 0.5px;}'+
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
                    
                    
                   return replacedHtml;
                     
                 };
                 
                 
                 
                 
                
                /**
                 * Merge data from backend with field structure on the right sidebar
                 * @param mode determines if company data oder employee data
                 * @param dbdata data from backend to merge
                 * @param structure JSON structure which represents the field values for signature
                 * @returns {undefined}
                 */
                this.mergeDbDataWithStructure = function (mode, dbdata, structure) {


                    if(mode === "company" || mode === "employee"){
                        if (mode === "company") {
                            var fieldToSearch = structure.company.groups;   //search company fields

                        } else if (mode === "employee") {
                            var fieldToSearch = structure.employee.groups;   //search company fields
                        }
                        for (var i = 0; i < fieldToSearch.length; i++) {   //search in every group
                            for (var u = 0; u < fieldToSearch[i].entries.length; u++) {   //search every element

                                if (fieldToSearch[i].entries[u] && fieldToSearch[i].entries[u].tag && dbdata[fieldToSearch[i].entries[u].tag]) {    //only set value when its available
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
                                    if(x === 0){    //company data
                                        
                                        if(fieldToSearch[i].entries[u] && fieldToSearch[i].entries[u].tag && dbdata.company[fieldToSearch[i].entries[u].tag]){
                                                     fieldToSearch[i].entries[u].locked = dbdata.company[fieldToSearch[i].entries[u].tag].locked;    //currently iterating company
                                                     
                                                      //handle image dimensions. These are stored here because they are have the scope of a signature
                                                     if(fieldToSearch[i].entries[u].type === "image" && dbdata.company[fieldToSearch[i].entries[u].tag].imgdimension){
                                                         fieldToSearch[i].entries[u].imgdimension = dbdata.company[fieldToSearch[i].entries[u].tag].imgdimension;
                                                     }
                                                     
                                                       //handle image dimensions. These are stored here because they are have the scope of a signature
                                                     if(fieldToSearch[i].entries[u].type === "link" && dbdata.company[fieldToSearch[i].entries[u].tag].linkcolor){
                                                         fieldToSearch[i].entries[u].linkcolor = dbdata.company[fieldToSearch[i].entries[u].tag].linkcolor;
                                                     }
                                        }
                                       
                                    }else if(x === 1){  //employee data
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
                 * 
                 * @returns {unresolved}Load json field Structure for company and employee data
                 */
                this.loadJsonFieldStructure = function(){
                            // perform some asynchronous operation, resolve or reject the promise when appropriate.
                            return $q(function(resolve, reject) {
                                 signatureService.getJsonInfoFields()
                                    .then(function (res) {
                                       // $scope.fields = res.data;   //make sure json is always loaded before loading data
                                         resolve(res.data);
                                    }).catch(function(){
                                        reject();
                                    });
                            });
                };
                
                
                
                    /**
                 * clear every marked as missing data flag and markedAsUsedAndSet in frontend structure
                 * Thiese flags are primarily used to show the correct color on the button in the designer (red, green, blue)
                 * @returns {undefined}
                 */
                this.clearMarkedAsMissing = function (fieldStructure) {
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
                this.getFieldStructureAsFlatArray = function(fieldStructure){
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
                * holding the whole data which is needed for generating signatures
                */
                this.dataManager = {
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





                 /**
                 * load employee data to map with signature placeholders
                 * if no employeeINfo data is stored so take empty data from json fields structure file
                 * if userId === dummy then load dummy data. Is needed for groups with no members
                 * @returns {$q@call;defer.promise}
                 */
                this.getEmployeeAccountData = function(userId, fields){
                            var deferred = $q.defer();


                            //check if id is available
                           if(!userId ){   //get selected ID from Preview field
                                 return $q.reject("Employee acctoun data : No userid priveded");
                           }
                           if(userId !== "dummy"){
                                                           employeeService.getOne(userId).then(function(data){
                                if(!data || !data.length === 0){
                                    deferred.reject("get employee account data no data");
                                }else if(!data[0].userInfo){   //no employee info is set in backend so we have to set initial employee info
                                    var employeeId = userId;       //get selected employee
                                    if(!employeeId){
                                          deferred.reject("Mitarbeiter Daten konnten nicht vorbereitet werden.");   
                                    }else{


                                            //when there is no data get a fresh field from backend
                                            
                                             ownServiceObject.loadJsonFieldStructure()
                                                     .then(function(json){
                                                                                                 
                                            
                                                        var fields = json;

                                                        var dataToSave = ownServiceObject.prepareDataForBackend("employee", fields);


                                                        ownServiceObject.dataManager.employeeCampaignTitle  =   data[0].campaignTitle;     //store campaigntitle. If there is no campaign active the campaign image container should not be shown in frontend
                                                          ownServiceObject.dataManager.employeeCampaignUrl = data[0].campaignUrl;  
                                                          ownServiceObject.dataManager.employeeCampaignImage = data[0].campaignImage; 

                                                        //handle firstname and lastname of employee because it is different columns (lagacy)
                                                        dataToSave["ma_vorname"] = data[0].firstname;
                                                        dataToSave["ma_nachname"] = data[0].lastname;
                                                        dataToSave["ma_email"] = data[0].email;

                                                        employeeService.setEmployeeInfo( employeeId, dataToSave).then(function (data) {
                                                            if (data.success === true) {



                                                                //set info of employee
                                                                 ownServiceObject.dataManager.employeeData  =   dataToSave;     //save employee data in datamanager

                                                                  //merge field array with newly saved data for employee
                                                                ownServiceObject.mergeDbDataWithStructure("employee", dataToSave, fields);
                                                                deferred.resolve();
                                                            } else {
                                                                deferred.reject("Employee speichern war nicht erfolgreich 1.");
                                                            }

                                                        });
                                                         
                                                         
                                                     }).catch(function(e){
                                                          deferred.reject("CompanyInfo speichern war nicht erfolgreich 2.");
                                                     });
    
                                    }
                                }else{  //employee info is loaded so merge with field structure
                                    try{
                                        var employeeResultData = JSON.parse(data[0].userInfo);
                                        
                                        //set firstname and lastname because it has an own column
                                        employeeResultData["ma_vorname"] = data[0].firstname;
                                        employeeResultData["ma_nachname"] =data[0].lastname;
                                        employeeResultData["ma_email"] =data[0].email;
                                        
                                        
                                        ownServiceObject.dataManager.employeeData  =   employeeResultData;     //save employee data in datamanager
                                        ownServiceObject.dataManager.employeeCampaignTitle  =   data[0].campaignTitle;     //store campaigntitle. If there is no campaign active the campaign image container should not be shown in frontend
                                        ownServiceObject.dataManager.employeeCampaignUrl = data[0].campaignUrl;  
                                        ownServiceObject.dataManager.employeeCampaignImage = data[0].campaignImage; 
                                                 
                                                 
                                        ownServiceObject.mergeDbDataWithStructure("employee", employeeResultData, fields);
                                        deferred.resolve();   
                                    }catch(e){
                                         deferred.reject(e);   
                                    }
                                    
                                  
                                }

                            });
                               
                           }else if(userId === "dummy"){
                                var employeeResultData = {};
                                employeeResultData = ownServiceObject.employeeDummyData;
                                ownServiceObject.dataManager.employeeData  =   employeeResultData;     //save employee data in datamanager
                                ownServiceObject.mergeDbDataWithStructure("employee", employeeResultData, fields);
                                deferred.resolve();   
                               
                           }

                            return deferred.promise;
                            };
                        
                        
                        
                        
                        /**
                     * Get Signature Data. Currently this is only which field is locked and which is not.
                     * Further ist merges the data with the field data array in the designer
                     * @param fields Field to merge data with
                     * @param version determines if rolled out version or version which is currently in editing has to be taken
                     * @returns {undefined}
                     */
                    this.getSignatureData = function(signatureId, fields, version){
                        var deferred = $q.defer();

                        if(signatureId === "create" ){ //todo check if it is really UUID
                            deferred.resolve("creationmode");       //no need to get signature data
                        }else if(typeof signatureId === "string"){
                             //check if id is available
                             signatureService.getOne(signatureId).then(function(data){
                                if(data.success !== true ||  !data.data ||  !data.data.signatureDataToEdit){
                                    deferred.reject("get signature data no data");      //data is not valid so reject
                                }else{  //signature data is loaded so merge with field structure
                                    //$scope.mergeDbDataWithStructure("signatureData", JSON.parse(data.data.signatureData));  //map data from backend with field data

                                    try{
                                        
                                             //check if the version to edit or the already rolledout version is shown
                                        if(version === "rolledOut" &&  data.data.signatureTplRolledOut){    //if the rolled out version is asked but there is only a to edit version. This can be when signature is assigend to group but never rolled out
                                            ownServiceObject.mergeDbDataWithStructure("signatureData", JSON.parse(data.data.signatureDataRolledOut), fields);
                                            ownServiceObject.dataManager.signatureTpl = data.data.signatureTplRolledOut;
                                            ownServiceObject.dataManager.signatureData  =  JSON.parse(data.data.signatureDataRolledOut);
                                        }else{
                                            ownServiceObject.mergeDbDataWithStructure("signatureData", JSON.parse(data.data.signatureDataToEdit), fields);
                                            ownServiceObject.dataManager.signatureTpl = data.data.signatureTplToEdit;
                                            ownServiceObject.dataManager.signatureData  =  JSON.parse(data.data.signatureDataToEdit);
                                        }
                                      
                                        ownServiceObject.dataManager.signatureTitle = data.data.title;
                                        ownServiceObject.dataManager.signatureId = data.data.id;
                                        ownServiceObject.dataManager.activeGroups = data.data.activeGroups;
                                        ownServiceObject.dataManager.signatureLastRollout = data.data.lastRollout;
                                        ownServiceObject.dataManager.signatureUpdatedAt = data.data.signatureUpdatedAt;
                                        ownServiceObject.dataManager.companyInfoUpdatedAt = data.data.companyInfoUpdatedAt;
                                       
                                        
                                       
//                                    $scope.data.tinymceModel = data.data.signatureTpl;
//                                    $scope.data.signatureTitle = data.data.title;
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
                    this.getCompanyAccountData = function(fields){
                    
                    var deferred = $q.defer();
                    
                    userService.getAccountData()
                                .then(function (data) {
                                    if (!data) {
                                        alert(Strings.errors.DATEN_NICHT_GELADEN);
                                    } else {
                                        if (!data.companyInfo || !data.companyInfo === "") {  //user has no company Info so save dummy
                                            
                                            //prepare initial structure for company info data 
                                            var dataToSet = ownServiceObject.prepareDataForBackend("company", fields);
                                            
                                            
                                            if(data.companyName && !dataToSet["u_name"]){   //check if there is a value set in companyName column. (old customer in which companyName was stored as column value in user table)
                                                 //set company name correctly
                                                dataToSet["u_name"] = data.companyName;   
                                            }
                                           
                                           //story company info because no info was there
                                            userService.setCompanyInfo(dataToSet).then(function (data) {
                                                if (data.success === true) {
                                                    //TODO nachricht etc dass profil zum ersten mal angelegt wurde ist nicht nötig mit den company daten zu mergen weil es ja ohnehin keine Gibt
                                               
                                                    ownServiceObject.dataManager.companyData  =  dataToSet;
                                                    //no need to merge data because data from json array is the same
                                                    
                                                    ownServiceObject.mergeDbDataWithStructure("company", dataToSet, fields);
                                                     ownServiceObject.clearMarkedAsMissing(fields);
                                                } else {
                                                    alert("CompanyInfo speichern war nicht erfolgreich.");
                                                }
                                                deferred.resolve();
                                            });
                                        } else {
                                            try {
                                                
                                                var companyDataObject = JSON.parse(data.companyInfo);
                                                ownServiceObject.dataManager.companyData  =  companyDataObject;
                                                ownServiceObject.mergeDbDataWithStructure("company", companyDataObject, fields);
                                                //$scope.mergeDbDataWithStructure("company", companyDataAsJson);
                                                ownServiceObject.clearMarkedAsMissing(fields);
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
                    
                    
                    
                this.employeeDummyData = 
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
                }
                ;
            
                /**
                 * go through fields array and get all entrys where the employee is able to edit data
                 * is needed for integration page when employee has to enter missing data
                 * 
                 * @returns all fields which are used in signature template and are not locked
                 */
                this.getUserFieldsToComplete = function(){
                    if(!ownServiceObject.dataManager || !ownServiceObject.dataManager.signatureData || !ownServiceObject.dataManager.employeeData || !ownServiceObject.dataManager.companyData || !ownServiceObject.dataManager.fields ){
                        return $q.reject("getUserFieldsToComplete: not all data is loaded");
                        
                    }else{
                        try{
                            var fieldsToSearch = [
                               //fieldStructure.company.groups,     //not necesarry to search in company values because its not possible for employee to edit these fields
                               ownServiceObject.dataManager.fields.employee.groups
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
                 * @param {type} userId
                 * @returns object with {fieldStructure, employeeData, companyData, signatureData}
                 */
                this.getRelevantDataForSignature = function(userId, signatureId, version){
                     var deferredOuter = $q.defer();
                    
                    
                    
                    
                     ownServiceObject.loadJsonFieldStructure()
                         .then(   
                            function(data){
                              ownServiceObject.dataManager.fields = data;
                               return $q.resolve();
                            }
                        )
                        .then(   
                            function(){
                               return  $q.all([
                                    ownServiceObject.getCompanyAccountData(ownServiceObject.dataManager.fields).catch(),    //load company data and employee data parallel
                                    ownServiceObject.getEmployeeAccountData(userId, ownServiceObject.dataManager.fields).catch(),
                                    ownServiceObject.getSignatureData(signatureId, ownServiceObject.dataManager.fields, version).catch()
                                ]);
                            }
                        ).then(function(){
                            deferredOuter.resolve(ownServiceObject.dataManager);    //in dataManager all the data is stored
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
                this.prepareDataForBackend = function (mode, fields) {
                   
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
                                       if(fieldToSearch[i].entries[u].imgdimension){
                                             dataToSet[fieldToSearch[i].entries[u].tag].imgdimension = fieldToSearch[i].entries[u].imgdimension;
                                       }
                                       
                                       //store image dimensions
                                       if(fieldToSearch[i].entries[u].linkcolor){
                                             dataToSet[fieldToSearch[i].entries[u].tag].linkcolor = fieldToSearch[i].entries[u].linkcolor;
                                       }
                                      
                                   }
                               }
                           }
                        
                        returndata = signatureData;
                    }
                   
                    return returndata;
                };


                /**
                 * Determines if the signature is in Status rolled out or not rolledout
                 * @param {type} signatureObject
                 * @returns {undefined}
                 * false It is not rolled our if the change timestamp is before the Rollout Timestamp
                 * true otherwise
                 * null on invalid call parameters
                 * @return 
                 */
                this.isSignatureRolledOut = function(signatureObject){
                    var ret = null;
                    //invalid parameters
                    if(!signatureObject){
                          return ret;
                    }
                    //never rolledout
                    else if(!signatureObject.lastRollout){
                        ret = false;
                    }
                   
                   
                    
                    
                    
                     //determine rollout status of signature
                            var lastRollOut             =   moment(new Date( signatureObject.lastRollout));
                            var lastCompanyInfoChange   =   moment(new Date( signatureObject.companyInfoUpdatedAt));
                            var lastSignatureChanged    =   moment(new Date( signatureObject.signatureUpdatedAt));
                            
                            //if there was never a rollout or the rollout was before last company data change or before last signature change
                            if(!signatureObject.lastRollout || lastRollOut.isBefore(lastCompanyInfoChange) || lastRollOut.isBefore(lastSignatureChanged)){
                                  ret = false;
                            }else{
                                ret = true;
                            }
                    
                    return ret;
                };



                /**
                 * Determine if user has the latest signature based on actualisation datetimes
                 * @param {type} employeeObject
                 * @param mode Determines if it is the context of group, employee or signature. 
                 * @param signatureId OPTIONAL only when it is in a context where the service helper has not load any signature data before (for example on employee list)
                 * Because when company data was changed, it must be displayed at the signature but not on the employee details page for example
                 * @returns 
                 * error -> wrong parameters
                 * outdated -> signature is old 
                 * rolledout -> signature is rolledout but not activated yet
                 * latest -> latest signature is rolledout and activated
                 */
                this.getHasUserLatestSignature = function(employee, mode, signatureId){
                      
                    //if not signatureId provided take the one from data manager  
                    if(!signatureId){
                        signatureId = ownServiceObject.dataManager.signatureId;
                    }
                    
                     
                   
                     
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
                    var lastRolloutOfSignature                      =   moment(new Date(employee.lastRolloutOSignatureItself));      //last rollout datetime of signature itself
                    var lastRolloutOfSignatureForSingleEmployee     =   moment(new Date(employee.signatureLastRollout));  

                    
                    
                    
                    if(    //when last rollout for single employee was before the change time then it is outdated
                        (employee.userInfoUpdatedAt && signatureActivatedAt.isBefore(employeeInfoChangedAt))        //show outdated when user info has changed
                        ||  
                        (employee.lastRolloutOSignatureItself && signatureActivatedAt.isBefore(lastRolloutOfSignature))){        //show outdatad when signature was rolledout since
                        //signature was never activated for this employee
                        return "outdated";
                    }else{
                        return "latest";
                    }
                    
                    
                    
                    
                    
                };

        }]);
