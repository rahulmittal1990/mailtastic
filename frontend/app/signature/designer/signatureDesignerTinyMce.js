'use strict';
angular.module('mailtasticApp.signature', ['ui.tinymce']);
angular.module('mailtasticApp.signature')



        .controller('SignatureDesignerCtrl', 
['$scope',  
    'userService',  
    'alertService', 
    '$state', 
    '$sce', 
    '$timeout', 
    '$uibModal', 
    '$http', 
    '$q',
    'employeeService',
    'signatureService', 
    'signatureHelperService',
    function ($scope,  userService,  alertService, $state, $sce, $timeout, $uibModal, $http, $q,employeeService, signatureService, signatureHelperService) {


                $scope.rightbar = {
                    activeTab: "company",
                    campaignImgLink : ""
                };
                $scope.data = {
                    tinymceModel: '<span style="font-size: 14px; font-family: arial, helvetica, sans-serif;" data-mce-style="font-size: 14px; font-family: arial, helvetica, sans-serif;"></span>',
                    //tinymceModel: '<span style="font-size: 14px; font-family: arial, helvetica, sans-serif;" data-mce-style="font-size: 14px; font-family: arial, helvetica, sans-serif;">Hier Text eingeben...</span>',
                   
            preview: "",
                    selectedEmployee : {},
                    employees : [],
                    signatureTitle : "",
                    showEmployeeDataShownAsTagInfo : false,
                    changesMade : false ,//did the user edit the name or ,
                    mceInitFinished : false
                };
                
                $scope.loadingPromise = "";
                
                /**
                 * tiny mce editor options
                 */
                $scope.tinymceOptions = {
                    inline: false,
                    height: "300px",
                    plugins: 'advlist autolink link image lists charmap preview table code textcolor colorpicker lineheight hr fullscreen',
                    skin: 'lightgray',
                    theme: "modern",
                    theme_modern_buttons3_add: "tablecontrols",
                    language: 'de',
                    //lineheight_formats: "0px 2px 4px 6px 8px 9px 10px 11px 12px 14px 16px 18px 20px 22px 24px 26px 36px",
                    lineheight_formats: "1.0 1.1 1.2 1.3 1.4 1.5 1.6 1.7 1.8 1.9 2.0 2.2 2.4 2.6 2.8 3.5 4.0",
                    fontsize_formats: "4px 6px 8px 10px 12px 14px 18px 24px 36px",  
                  
                    menubar: '',
                    toolbar: [
                        "undo redo | fontselect  fontsizeselect  lineheightselect",
                        "forecolor  backcolor | bold  italic  underline | link | table | hr | styleselect | fullscreen"
                    ],
                    content_css : '../../css/tinymceeditor.css',
                    force_br_newlines : true,
                    force_p_newlines : false,
                    forced_root_block : 'div', // Needed for 3.x
                     style_formats: [
            {title: 'Open Sans', inline: 'span', styles: { 'font-family':'Open Sans'}},
            {title: 'Arial', inline: 'span', styles: { 'font-family':'arial'}},
            {title: 'Book Antiqua', inline: 'span', styles: { 'font-family':'book antiqua'}},
            {title: 'Comic Sans MS', inline: 'span', styles: { 'font-family':'comic sans ms,sans-serif'}},
            {title: 'Courier New', inline: 'span', styles: { 'font-family':'courier new,courier'}},
            {title: 'Georgia', inline: 'span', styles: { 'font-family':'georgia,palatino'}},
            {title: 'Helvetica', inline: 'span', styles: { 'font-family':'helvetica'}},
            {title: 'Impact', inline: 'span', styles: { 'font-family':'impact,chicago'}},
            {title: 'Symbol', inline: 'span', styles: { 'font-family':'symbol'}},
            {title: 'Tahoma', inline: 'span', styles: { 'font-family':'tahoma'}},
            {title: 'Terminal', inline: 'span', styles: { 'font-family':'terminal,monaco'}},
            {title: 'Times New Roman', inline: 'span', styles: { 'font-family':'times new roman,times'}},
            {title: 'Verdana', inline: 'span', styles: { 'font-family':'Verdana'}}
        ],
                    setup: function(e) {

                        e.on('change', function () {
                            if($scope.data.mceInitFinished){
                                 $scope.data.changesMade = true;
                            }
                        });
                        e.on('init', function (ed) {
                            
                            
                            ed.target.editorCommands.execCommand("fontSize", false, "14px");
                            ed.target.editorCommands.execCommand("fontName", false, "arial,helvetica,sans-serif");
                        });
                        
                          e.on('reset', function(ed) {
            alert("RESET DONE");
        });
         e.on('blur', function() {
           // alert("BLUR DONE");
            
            e.execCommand("fontName", true, "Arial");
             //this.execCommand("fontSize", false, "14px");
        });
         e.on('activate', function() {
            //alert("ACTIVATE DONE");
            // e.execCommand("fontName", true, "Arial");
              //this.execCommand("fontSize", false, "14px");
        });
         e.on('focus', function(ed) {
                ed.target.editorCommands.execCommand("fontSize", false, "14px");
                ed.target.editorCommands.execCommand("fontName", false, "arial,helvetica,sans-serif");
            //alert("FOCUS DONE");
             //e.execCommand("fontName", true, "Arial");
              //this.execCommand("fontSize", false, "14px");
        });
                    }
                };



                /**
                 * Field Structure which is shown on the right side and which is merged with the user and company data 
                 */
                $scope.fields = "";     //wird mit json datei gefüllt


                /**
                 * When selected user ist changed the correct data for him has to be loaded
                 * @returns {undefined}
                 */
                $scope.updateSelectedUser = function(){
                    
                    signatureHelperService.getEmployeeAccountData($scope.data.selectedEmployee, $scope.fields).then(
                    function(){
                        $scope.rightbar.campaignImgLink = GlobalConfig.config.apiUrl +   "/im/" + $scope.data.selectedEmployee + "/ad";
                        $scope.generatePreview();
                    }, function(){
                        alertService.defaultErrorMessage(Strings.errors.DATEN_NICHT_GELADEN);
                        
                    });
                };


                /**
                 * Check if in structure is one element markes as missing
                 * @returns {undefined}
                 */
                $scope.getIsOneElementMarkedAsMissing = function(){
                    
                    //at the beginnung data isnt loaded
                    if(! ($scope.fields.company && $scope.fields.company.groups && $scope.fields.employee && $scope.fields.employee.groups)){
                        return false;
                    }
                    
                    
                     var fieldsToSearch = [
                       $scope.fields.company.groups,
                       $scope.fields.employee.groups
                    ];
                    for (var x = 0; x < fieldsToSearch.length; x++) {
                        var fieldToSearch = fieldsToSearch[x];   //search company fields
                        for (var i = 0; i < fieldToSearch.length; i++) {   //search in every group

                            for (var u = 0; u < fieldToSearch[i].entries.length; u++) {   //search every element
                                if(fieldToSearch[i].entries[u].markedAsMissing && fieldToSearch[i].entries[u].locked === true){
                                    return true;
                                };
                            }
                        }
                    }
                    
                    return false;
                    
                };

                /**
                 * Get Data and merge with signature editor and mark missing data flag (with red buttons)
                 * @returns {undefined}
                 */
                $scope.counter = 0;
                $scope.generatePreview = function () {
                  
                  
                    //click inside the edit field to set focus. This is needed because otherwise the line height is not activated directly
//                    $('#tinymce').click();
                  
//               
//                    var tinyMce1 =   $('#tinymce');
//                    tinyMce1.click();
//                    tinyMce1.blur();
//                    tinyMce1.focus();
//                    
//                    var tinyMce2 =   $('#tinymcetextarea');
//                     tinyMce2.click();
//                    tinyMce2.blur();
//                    tinyMce2.focus();
//                    
//                    
//                    tinymce.execCommand('mceFocus',false,'tinymcetextarea');
                   $timeout(doIt ,100);     //   This is needed because otherwise the line height is not activated directly
                   
                  
                  
                  function doIt(){
                        //remove all marks for missing used value because it will be determined in the next step
                        signatureHelperService.clearMarkedAsMissing($scope.fields);

                        //get html content with placeholders
                        var content = $scope.data.tinymceModel;


                        //set content from editor
                        signatureHelperService.dataManager.signatureTpl = content;  

                        //set current signatureData (like LOCKED value) and dont take data which was loaded from backend initially
                        signatureHelperService.dataManager.signatureData = signatureHelperService.prepareDataForBackend("signatureData", $scope.fields);  

                        //generate Preview
                        var resultHtml = signatureHelperService.generatePreviewComplete($scope.data.selectedEmployee);



                        //if result data contains placeholder brackets show info area
                        if(resultHtml.contains("{{") && resultHtml.contains("}}")){
                            $scope.data.showEmployeeDataShownAsTagInfo = true;
                        }else{
                            $scope.data.showEmployeeDataShownAsTagInfo = false;
                        }
                        $scope.data.preview = $sce.trustAsHtml(resultHtml);

                        
                        if($scope.counter === 0){//   This is needed because otherwise the line height is not activated directly
                             //$("#previewbutton").click();
                             $timeout($scope.generatePreview, 200);
                             //$scope.generatePreview();
                             $scope.counter = 1;
                        }else if($scope.counter === 1){
                             $scope.counter = 0;
                        }
                      
                  }
                    
                };
                
                
                
          
                /**
                 * Insert placeholder into signature editor
                 * @param {type} element
                 * @returns {undefined}
                 */
                $scope.insertPlaceholder = function (element) {
                    var editorInstance = tinymce.EditorManager.editors[0];
                    editorInstance.insertContent('{{' + element + "}}");
                    $timeout($scope.generatePreview, 500);
                    
                };




                $scope.initData = function () {

 //construct campaign image link
                       if(signatureHelperService.dataManager &&  signatureHelperService.dataManager.campaignIsUsed){
                           signatureHelperService.dataManager.campaignIsUsed = false;
                       }
                       

                       if($state.params.signatureId){
                           $scope.data.signatureId = $state.params.signatureId;
                       }else{
                             alertService.defaultErrorMessage(Strings.errors.DATEN_NICHT_GELADEN);
                           return;
                       }
              
                        
                        /**
                         * load employees for preview
                         * @returns {unresolved}
                         */
                        function getEmployees() {

                            var deferred = $q.defer();
                            employeeService.get().then(function (data) {
                                    if(data && Array.isArray(data) && data.length > 0){
                                        $scope.data.employees = data;
                                        $scope.data.selectedEmployee = $scope.data.employees[0].id;  //select first employee on init
                                          $scope.rightbar.campaignImgLink = GlobalConfig.config.apiUrl +   "/im/" + $scope.data.selectedEmployee + "/ad";
                                        deferred.resolve();
                                    }else{
                                         deferred.reject("no employees could be loaded");
                                    }
                                }, function () {
                                    deferred.reject();
                                });

                            return deferred.promise;
                        }
                    
                      if($scope.data.signatureId === "create"){     //create new signature
                          getEmployees()
                                  .then(function(){
                                      
                                        return signatureHelperService.loadJsonFieldStructure().then(function(fields){
//                                            $scope.fields = fields;
//                                            signatureHelperService.dataManager.fields = $scope.fields;        //set fields
                                            
                                            //scope fields points to helper.datanamanger.fields
                                             $scope.fields = fields;
                                             signatureHelperService.dataManager.fields = fields;        //set fields
                                             $scope.fields =  signatureHelperService.dataManager.fields;
                                            

                                        });
                                  }).then(function(){
                                      return $q.all([
                                          signatureHelperService.getEmployeeAccountData($scope.data.selectedEmployee, $scope.fields),
                                          signatureHelperService.getCompanyAccountData($scope.fields)
                                      ]);
                                     
                                  }).catch(function(e){
                                      alertService.defaultErrorMessage(Strings.errors.DATEN_NICHT_GELADEN);
                                  });
                          
                      }else{    //load all data which is needed for an already existing signature
                          getEmployees()  //load employees so that we have an employee id to generate signature
                        .then(
                            function(){
                                
                                 return signatureHelperService.getRelevantDataForSignature($scope.data.selectedEmployee, $scope.data.signatureId);
                              
                            }
                        ) 
                        .then(function(data){
                            $scope.data.signatureTitle = data.signatureTitle;
                            $scope.data.tinymceModel = data.signatureTpl;
                            $scope.fields = data.fields;
                            
                        }) 
                        .then(                                  //generate preview when everything is loaded
                            function(){
                                return $timeout(
                                        function () {
                                            $scope.generatePreview();
                                             $scope.data.mceInitFinished = true;    //value to mark when init is finished. is used to detect changes to tinymce editor to show save button only when changes were made
                                            }, 1000);
                                }
                            )
                        .catch(function(e){
                            if(e !== "correctlyEnded"){
                                 alertService.defaultErrorMessage(Strings.errors.DATEN_NICHT_GELADEN);
                            }
                           
                        });
                          
                          
                      }
                        
                        
                        
                            
                           
                };

                $scope.initData();



                /**
                 * Show template gallery to choose a template
                 * @returns {undefined}
                 */
                $scope.openTemplateModal = function(){
                    var templateUrl = 'signature/designer/modal/templategallery/tpl_gallery_modal_main.html';
                   
                    
//                    object.additionalLabel = additionalInfo;    //im Modal soll immer stehen zu welcher Kategorie es gehört (unternehmen oder mitarbeiter)
                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: templateUrl,
                        controller: 'SigTemplatesModalCtrl',
                        size: "lg",
//                        resolve: {
//                            tagObject: object,
//                            additionalLabel: {value: additionalInfo}
//                        },
                        windowClass: "sigtemplatemodal"
                    });

                    modalInstance.result.then(function (tplCode) {
                        
                        
                        if(tplCode){
                            $scope.data.tinymceModel = tplCode;
                              $timeout($scope.generatePreview, 500);
                        }else{
                            alertService.defaultErrorMessage(Strings.errors.TECHNISCHER_FEHLER);
                        }
                       

                    }, function () {
                        //log something on close
                    });
                    
                };


                /**
                 * opens modal for changing specific value used in Signatures
                 * @param {type} object
                 * @returns {undefined}
                 */
                $scope.editValue = function (object, additionalInfo) {
                    var templateUrl = null;
                    switch(object.type){
                        case 'singlevalue' : templateUrl = 'signature/designer/modal/dataedit/singlevalue.html';break;
                        case 'image' : templateUrl = 'signature/designer/modal/dataedit/imagevalue.html';break;
                        case 'link' : templateUrl = 'signature/designer/modal/dataedit/linkvalue.html';break;
                    }
                    
//                    object.additionalLabel = additionalInfo;    //im Modal soll immer stehen zu welcher Kategorie es gehört (unternehmen oder mitarbeiter)
                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: templateUrl,
                        controller: 'SignatureDataModalCtrl',
                        size: "md",
                        resolve: {
                            tagObject: object,
                            additionalLabel: {value: additionalInfo}
                        },
                        windowClass: "signature_value_edit_modal"
                    });

                    modalInstance.result.then(function (resultObject) {
                        $scope.saveFieldValue(resultObject , additionalInfo);

                    }, function () {
                        //log something on close
                    });
                };

                /**
                 * Send field value to backend
                 * @returns {undefined}
                 */
                $scope.saveFieldValue = function(object, mode){
                    
                    if(mode === "Mitarbeiter"){
                         employeeService.setEmployeeInfoSingle($scope.data.selectedEmployee, object.tag, object.type, object.value).then(function(data){
                             if(data.success === true){
                                object.value = data.savedObject;             //to replace value in field structure we need the complete object inkl tag
                                var replaced = $scope.replaceFieldValue(object);    //replace field value in structure
                                
                               
                              // $scope.initData();
                                 
                                 
                                 
                                if (replaced !== true) {
                                    alert(Strings.errors.TECHNISCHER_FEHLER);
                                } else {
                                    
                                     //change data in userData so that the data is not overwritten when next preview is created
                                     signatureHelperService.dataManager.employeeData[object.tag] = object.value;    
                                     alertService.defaultSuccessMessage("Ihre Änderungen wurden erfolgreich übernommen.");
                                     $scope.generatePreview();
                                     
                                }
                                
                             }else{
                                 alertService.defaultErrorMessage(Strings.errors.DATEN_NICHT_GELADEN);
                                 //$scope.initData();
                             }
                             
                         });
                    }else if(mode === "Unternehmen"){
                        userService.setCompanyInfoSingle(null, object.tag,object.type, object.value).then(function(data){
                             if(data.success === true){
                                 object.value = data.savedObject;               //to replace value in field structure we need the complete object inkl tag
                                 var replaced = $scope.replaceFieldValue(object);
                                if (replaced !== true) {
                                    alert(Strings.errors.TECHNISCHER_FEHLER);
                                } else {
                                     alertService.defaultSuccessMessage("Ihre Änderungen wurden erfolgreich übernommen.");
                                     //change data in companydata so that the data is not overwritten when next preview is created
                                     signatureHelperService.dataManager.companyData[object.tag] = object.value;    
                                     $scope.generatePreview();
                                }
                             }else{
                                 alertService.defaultErrorMessage(Strings.errors.DATEN_NICHT_GELADEN);
                                 //$scope.initData();       //when init Data 
                             }
                             
                         });
                        
                    }
                };



                /**
                 * 
                 * @returns {undefined}
                 */
                $scope.getCampaignButtonClass = function(){
                    var isUsed = signatureHelperService.dataManager.campaignIsUsed;
                    if(isUsed === true){
                        return "btnblau";
                    }else{
                        return "btngrau";
                    }
                    
                };


                /**
                 * Get correct color for button in signature 
                 * @param {type} inneritem
                 * @returns {String}
                 */
                $scope.getPlaceholderButtonClass = function (inneritem) {
                    //url is used in image field and in url field so check for value itself (on single values) or on value.url
                   
                   
                   
                    //value is gesetzt und es ist kein Object | value ist gesetzt, ist Objekt und objekt url ist gesetzt & ist gesperrt & ist nicht als fehlend markiert und wert wird im editor aktuell verwendet
                    if ( ((inneritem.value && !(typeof inneritem.value === 'object')) ||  (inneritem.value &&  typeof inneritem.value === 'object' && inneritem.value.url))  /*&& inneritem.locked*/ && !inneritem.markedAsMissing && inneritem.markedAsUsed) {     
                        return "btnblau";
                    //(value is nicht gesetzt | value.url ist nicht gesetzt) & ist gesperrt & nicht als fehlend markiert
                    } else if (!inneritem.locked && inneritem.markedAsUsed) {
                        return "btngreen";
                    //ist als fehlend markiert & ist gesperrt
                    } else if (inneritem.markedAsMissing === true && inneritem.locked) {
                        return "btnrot";
                    }else{
                        return "btngrau";
                    }
                   
                   
                   
                   
                   
                    
                    //value is gesetzt und es ist kein Object | value ist gesetzt, ist Objekt und objekt url ist gesetzt & ist gesperrt & ist nicht als fehlend markiert
//                    if ( ((inneritem.value && !(typeof inneritem.value === 'object')) ||  (inneritem.value &&  typeof inneritem.value === 'object' && inneritem.value.url))  && inneritem.locked && !inneritem.markedAsMissing) {     
//                        return "btnblau";
//                    //(value is nicht gesetzt | value.url ist nicht gesetzt) & ist gesperrt & nicht als fehlend markiert
//                    } else if ((!inneritem.value ||  !inneritem.value.url) && inneritem.locked && !inneritem.markedAsMissing) {
//                        return "btngrau";
//                    //ist nicht gesperrt & ist nicht als fehlend markiert
//                    } else if (!inneritem.locked /*&& !inneritem.markedAsMissing*/) {
//                        return "btngreen";
//                    //ist als fehlend markiert & ist gesperrt
//                    } else if (inneritem.markedAsMissing === true && inneritem.locked) {
//                        return "btnrot";
//                    }

                };

                /**
                 * Ersetzt im Field Array 
                 * @param {type} object
                 * @param {type} additionalInfo
                 * @returns {undefined}
                 */
                $scope.replaceFieldValue = function (object) {
                    
                    var elementFound = false;
                    var fieldsToSearch = [
                        $scope.fields.company.groups,
                        $scope.fields.employee.groups
                    ];
                    for (var x = 0; x < fieldsToSearch.length; x++) {
                        var fieldToSearch = fieldsToSearch[x];   //search company and employee  fields
                        for (var i = 0; i < fieldToSearch.length; i++) {   //search in every group

                            for (var u = 0; u < fieldToSearch[i].entries.length; u++) {   //search every element in group
                                if (fieldToSearch[i].entries[u].tag === object.tag) {   //oject found
                                    elementFound = true;
                                    fieldToSearch[i].entries[u] = object;
                                    return elementFound;

                                }
                            }
                        }
                    }

                    return elementFound;        //element was not found
                };



                /**
                 * Save signature without assistant for rolling out.
                 * Used when for example only the name of the signature was changed because rolling out is not necessary then
                 * @returns {undefined}
                 */
                $scope.saveSignatureWithoutRollout = function(){
                    //generate preview so that all data is correct
                   $scope.generatePreview();
                    
                    //determine if have to create new or edit existing
                    var mode = "edit";
                    if($state.params.signatureId === "create"){ //save new signature
                        alertService.defaultErrorMessage(Strings.errors.DATEN_NICHT_GELADEN);
                        return;
                    }
                    
                    var signatureObject = {};
                    //get html snippet
                    signatureObject.signatureTpl = $scope.data.tinymceModel;
                    
                    //merge data
                    signatureObject.signatureData = signatureHelperService.prepareDataForBackend("signatureData", $scope.fields);
                    
                    //get title
                    signatureObject.title = $scope.data.signatureTitle;
                   
                    
                    //check if all data is available
                    if(!signatureObject.title){
                        alertService.defaultErrorMessage("Bitte geben Sie einen Titel für die Signatur ein.");
                    }else if(!signatureObject.signatureTpl){
                        alertService.defaultErrorMessage("Bitte füllen Sie die Signatur mit Inhalt, um sie zu speichern.");
                    }
                    else if(signatureObject.signatureTpl && signatureObject.signatureData && signatureObject.title ){
                        
                         
                            //check if the signature contains the campaign banner container. Saving a signature is only possible if it contains the banner container
                            //generate preview to know if the campaign banner container is included
                            signatureHelperService.generatePreviewComplete(signatureObject.signatureTpl, signatureHelperService.dataManager.fields, $scope.data.selectedEmployee);
                            if(!signatureHelperService.dataManager.campaignIsUsed){

                                alertService.defaultErrorMessage("Bitte fügen Sie den Kampagnen-Banner in Ihre Signatur ein. Diesen finden Sie auf der rechten Seite im Reiter \"Unternehmen\" an erster Position.");
                                return;
                            }
                        
                        
                            signatureObject.id = $state.params.signatureId;
                             signatureService.update(signatureObject).then(function(data){
                                if(data && data.success === true){
                                    alertService.defaultSuccessMessage("Die Signatur wurde erfolgreich gespeichert.");
                           
                                    $state.go("base.signaturedetails", {signatureId : $state.params.signatureId});
                                }else{
                                     alert(Strings.errors.DATEN_NICHT_GELADEN);
                                }
                            }).catch(function(){
                                alert(Strings.errors.TECHNISCHER_FEHLER);
                            });
                            
                      
                        
                        
                    }else{      //not all necessary data is provided
                         alert(Strings.errors.TECHNISCHER_FEHLER);
                    }
                    
                };
        
                    
            

                /**
                 * Create new signature or save changes on existing signature
                 * Does only save the signature if it contains the campaign banner container
                 * @returns {undefined}
                 */
                $scope.saveSignatureWithRollout = function(){
                    
                    
                    //generate preview so that all data is correct
                   $scope.generatePreview();
                    
                    //determine if have to create new or edit existing
                    var mode = null;
                    if($state.params.signatureId === "create"){ //save new signature
                        mode = "create";
                    }else if(typeof $state.params.signatureId === "string"){
                        mode = "edit";
                    }else{
                        alertService.defaultErrorMessage(Strings.errors.DATEN_NICHT_GELADEN);
                        return;
                    }
                    
                    var signatureObject = {};
                    //get html snippet
                    signatureObject.signatureTpl = $scope.data.tinymceModel;
                    
                    //merge data
                    signatureObject.signatureData = signatureHelperService.prepareDataForBackend("signatureData", $scope.fields);
                    
                    //get title
                    signatureObject.title = $scope.data.signatureTitle;
                   
                    
                    //check if all data is available
                    if(!signatureObject.title){
                        alertService.defaultErrorMessage("Bitte geben Sie einen Titel für die Signatur ein.");
                    }else if(!signatureObject.signatureTpl){
                        alertService.defaultErrorMessage("Bitte füllen Sie die Signatur mit Inhalt, um sie zu speichern.");
                    }
                    else if(signatureObject.signatureTpl && signatureObject.signatureData && signatureObject.title ){
                        
                         
                    //check if the signature contains the campaign banner container. Saving a signature is only possible if it contains the banner container
                    //generate preview to know if the campaign banner container is included
                    signatureHelperService.generatePreviewComplete(signatureObject.signatureTpl, signatureHelperService.dataManager.fields, $scope.data.selectedEmployee);
                    if(!signatureHelperService.dataManager.campaignIsUsed){
                        
                        alertService.defaultErrorMessage("Bitte fügen Sie den Kampagnen-Banner in Ihre Signatur ein. Diesen finden Sie auf der rechten Seite im Reiter \"Unternehmen\" an erster Position.");
                        return;
                    }
                        
                        
                        
                        
                        if(mode === "create"){
                            signatureService.create(signatureObject).then(function(data){
                                if(data && data.success === true){
                                    
                                                       $state.go("base.signaturerollout", {signatureId : data.signatureId, mode : "create", signatureTitle : signatureObject.title});
                 
                                }else{
                                    alertService.defaultErrorMessage(Strings.errors.DATEN_NICHT_GELADEN);
                                }
                            }).catch(function(){
                                alert(Strings.errors.TECHNISCHER_FEHLER);
                            });
                        }else if(mode === "edit"){
                            signatureObject.id = $state.params.signatureId;
                             signatureService.update(signatureObject).then(function(data){
                                if(data && data.success === true){
                                   
                                    $state.go("base.signaturerollout", {signatureId : $state.params.signatureId, mode : "update", signatureTitle : signatureObject.title});
                                }else{
                                     alert(Strings.errors.DATEN_NICHT_GELADEN);
                                }
                            }).catch(function(){
                                alert(Strings.errors.TECHNISCHER_FEHLER);
                            });
                            
                        }
                        
                        
                        
                    }else{      //not all necessary data is provided
                         alert(Strings.errors.TECHNISCHER_FEHLER);
                    }
                    
                };
        
                


            }]);
