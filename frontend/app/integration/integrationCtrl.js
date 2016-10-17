'use strict';

var manuals = {
            "outlookwin" : {
                "title" : "Outlook (Win)",
                "video" : 'https://www.youtube.com/embed/bk6Xst6euQk' , 
                "showBanner" : false,
                "showSnippet" : false,
                "showOutlookSnippet" : true
            },
            "outlookmac" : {
                 "title" : "Outlook (Mac)",
                "video" : 'https://www.youtube.com/embed/bk6Xst6euQk' , 
                "showBanner" : true,
                "showSnippet" : false
            },
            "gmail"     : {
                "title" : "Gmail",
                "video" : 'https://www.youtube.com/embed/5uBsfHA5LBo"' , 
              
                "showBanner" : true,
                "showSnippet" : false
            },
            "thunderbird"     : {
                "title" : "Thunderbird",
                "video" : 'https://www.youtube.com/embed/5uBsfHA5LBo"' , 
               
                "showBanner" : false,
                "showSnippet" : true
            },
             "macmail"     : {
                "title" : "Apple Mail",
                "video" : 'https://www.youtube.com/embed/5uBsfHA5LBo"' , 
               
                "showBanner" : true,
                "showSnippet" : false
            },
              "macmailold"     : {
                "title" : "Mac Mail (alt)",
                "video" : 'https://www.youtube.com/embed/5uBsfHA5LBo"' , 
               
                "showBanner" : false,
                "showSnippet" : true
            },
            
             "other"     : {
                "title" : "Andere",
                "video" : 'https://www.youtube.com/embed/5uBsfHA5LBo"' , 
               
                "showBanner" : false,
                "showSnippet" : false
            },
            
             "webtools"     : {
                "title" : "Web-Tools",
                "video" : '' , 
                "showBanner" : false,
                "showSnippet" : true
            },
            
             "windows_easyintegrate"     : {
                "title" : "Outlook (Windows - EasyIntegrate)",
                "video" : '' , 
                "showBanner" : false,
                "showSnippet" : true
            }
            
            
            
        };
        
        var rawSnippetTpl = '<a href="https://www.app.mailtastic.de/api/li/$$$USERID$$$"><img moz-do-not-send="true" src="http://www.app.mailtastic.de/api/im/$$$USERID$$$/ad" alt="Bitte aktivieren Sie externe Inhalte, um diese E-Mail vollständig sehen zu können." /></a>';
  
angular.module('mailtasticApp.integration', ['ui.bootstrap'])


.controller('IntegrationCtrl', 
    ['$scope', 
        
        'employeeService',
        '$stateParams', 
        'alertService',
        '$q',
       '$sce',
        '$location',
        '$state',
        function($scope, employeeService, $stateParams, alertService, $q, $sce,$location, $state) {
   
   
   
   
        $scope.datacompletiononly = false;  //set to true when it is not the initial integration process but only the date completion process when something has changed
   
   
        $scope.workflow = {
               step : "explanation",
               step3headline : "Daten ergänzt"
        };
        
                
             
        //wird bei outlook die automatische oder die manuelle Integration angezeigt werden
        $scope.outlookWin = {
           showOutlookSnippetInstallCode : "true"
        };
        $scope.manual = manuals;
        
        $scope.currentManualTitle ="";
        $scope.mode = "admin";
        
        

        $scope.currentManual = [];


        //installation snippet data from old installation page
	$scope.htmlSnippet = "";
        $scope.outlooklink1 = "";
        $scope.outlooklink2 = "";
        $scope.outlookInstallationCode = "";
	$scope.userId = "";
	$scope.htmlSnippetRaw = "";
        $scope.dataEditUrl = "";
        $scope.pureSnippet = "";
         
        $scope.userData = {};
         
         $scope.signatureData = {
             preview : ""
         };
         
         $scope.formData = {
             tagsToComplete : []
         };
         
          $scope.admindata = {
              firstname : "",
              lastname : "",
              email : ""
          };
         
         
         
         $scope.setManual = function(manual){
            $scope.currentManual =  $scope.manual[manual];
            //navbar schließen
             var toggle = $(".navbar-toggle").is(":visible");
            if (toggle) {
                $(".navbar-collapse").collapse('hide');
            }
        };
        
        $scope.othermailclient = {
            clientname : ""
        };
        
        $scope.sendothermailclientnotification = function(){
            employeeService.sendothermailclientnotification(null, $scope.othermailclient.clientname).then(function(data){
                if(data.success === true){
                    alert("Herzichen Dank für Ihre Nachricht. Wir werden umgehend eine Lösung für Ihren E-Mail-Client zur Verfügung stellen.");
                    $scope.othermailclient.clientname = "" ;
                }else{
                    alert(Strings.errors.TECHNISCHER_FEHLER);
                }
            });
        };
        
        $scope.getClass = function(manual){
            if(manual === "Mac Mail" && $scope.currentManual.title === "Mac Mail (alt)"){
                return 'active';
            }
            
            if( $scope.currentManual.title === manual){
                return 'active';
            }else{
                return '';
            }
            
        };
         
         
         /**
          * Returns true if the integration screen is shown inside the webapp.
          * This is needed to hide the info area with the edit link
          * @returns {undefined}
          */
         $scope.isShownInsideWebApp = function(){
             
          return  $location.absUrl().contains("installation");
         };
         
         /**
          * Generate all needed snippets like for thunderbird, webApps etc
          * @returns {undefined}
          */
         $scope.generateSnippets = function(data){
             var mode = data.sigOrCampaign;
             $scope.sigOrCampaign = data.sigOrCampaign;
               //userid
              $scope.userId = $stateParams.eid;
              $scope.admindata = data.admindata;
              $scope.userData = data.userdata;
              $scope.outlookInstallationCode = $stateParams.eid;
              
              
              
             
            if(mode === "failure"){
                    $scope.htmlSnippetRaw = "Daten konnte nicht geladen werden";
                    $scope.htmlSnippet = "Daten konnte nicht geladen werden";
                    $scope.outlooklink1 = "Daten konnte nicht geladen werden";
                    $scope.outlooklink2 = "Daten konnte nicht geladen werden";
                    $scope.outlookInstallationCode = "Daten konnte nicht geladen werden";
                    $scope.signatureData.preview =  "Daten konnten nicht geladen werden";
                    
                    alert(Strings.errors.ACCOUNT_ACTIVATION_ERROR_EMPLOYEE);
            }else if(mode === "signature" || mode === "campaign")      
            {
                    //create different snippets
                    //thunderbird snippet with moz do not send
                    
                  
                    $scope.thunderbirdSnippet = data.snippet.replace("width=\"700\" height=\"210\"", "").replace("m=o&", "").replace("?track=n", "");
                    
                    //cleaned snippet
                    var snippetWoDimensionsAndThunderbird = data.snippet.replace("width=\"700\" height=\"210\"", "").replace("moz-do-not-send=\"true\"", "").replace("m=o&", "");
                 
                    $scope.signatureData.preview =  $sce.trustAsHtml(snippetWoDimensionsAndThunderbird);
                    $scope.htmlSnippetRaw =  snippetWoDimensionsAndThunderbird;
                   
                   
                   
                   
                   if(mode === "signature")       //user has a signature assigned
                   {
                        //check fields to complete
                        if(!Array.isArray(data.fieldsToComplete)){
                        //something went wrong. should never land here
                        }else if(data.fieldsToComplete.length === 0){
                            //change headline of step 3 because does not have to complete data manually
                            $scope.workflow.step3headline = "Daten komplett";
                         }else{
                            $scope.formData.tagsToComplete = data.fieldsToComplete;
                        }
                       
                   }
                
          
             }else{
                  throw new Error("received data invalid was weather campaign nor failure nor signature");
             }
         };
         
         /**
          * Save additionaldata and reload data. If there is no missing data so go to step 3 integration and create signature so that the user can copy it
          * @returns {undefined}
          */
         $scope.saveDataAndGenerateSignature = function(){
             
             //send whole formdata to backend
             employeeService.complementUserInfoData($stateParams.eid,$stateParams.ac, $scope.formData.tagsToComplete)
                     .then(function(data){
                        if(data.success === true){
                            
                            
                            if($state.current.name === "employeedatacompletion"){   //data dompletion for aut sync users. Not necessary to show the integration page after this
                                 //all values are provided
                                $scope.workflow.step = "finished";
                            }else{
                                
                                 //all values are provided
                                $scope.workflow.step = "integration";
                                
                                 //load completed user data
                                employeeService.getIntegrationData($stateParams.eid,$stateParams.ac)
                                        .then(function(data){
                                            if(data.success === true){
                                                  $scope.generateSnippets(data.data);
                                            }else{
                                                  alertService.defaultErrorMessage(Strings.errors.TECHNISCHER_FEHLER);
                                            }
                                        });
                            }
                            
                        }else{
                             alertService.defaultErrorMessage(Strings.errors.DATEN_NICHT_GELADEN);
                        }
                     
                         
                     }).catch(function(e){
                           alertService.defaultErrorMessage(Strings.errors.TECHNISCHER_FEHLER);
                     });

         };
         /**
          * show other step
          * @param {type} step
          * @returns {undefined}
          */
         $scope.goToStep = function(step){
             $scope.workflow.step  = step;
             
         };
         
         
         
         /**
          * Open tiny help modal to show contact information when user wants help
          * @returns {undefined}
          */
         $scope.openHelpModal = function(){
             var adminFullname = "";
             if(!$scope.admindata.firstname){
                adminFullname = !$scope.admindata.email;
             }else{
                 adminFullname = $scope.admindata.firstname + " " + $scope.admindata.lastname;
             }
            alertService.integrationHelpModal(adminFullname);
             
         };
         
         //marks if in this session the employee was marked as activated already to not activate him every time the user switches the view
         $scope.activateEmployeeDone = false;
         
	
         
        
        
        /**
         * Signature generation without need the user to be logged in
         * @returns {undefined}
         */
           $scope.initData = function(){
               
               if($state.current.name !== "employeedatacompletion"){    //when only editing own user data then it works with every browser
                   
                    //installation does not work with safari
                    var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
                    // Internet Explorer 6-11
                     var isIE = /*@cc_on!@*/false || !!document.documentMode;
                     // Edge 20+
                     var isEdge = !isIE && !!window.StyleMedia;

                    if(isSafari === true ){
                        alertService.defaultErrorMessage("Leider funktioniert die reibungslose Installation nicht mit dem Safari Browser. Bitte kopieren Sie den Link aus der Adresszeile und verwenden Sie für die einmalige Installation Chrome oder Firefox in aktueller Version. Herzlichen Dank!");
                    }

                    if(isEdge === true){
                        alertService.defaultErrorMessage("Leider funktioniert die reibungslose Installation aktuell nicht mit dem EDGE Browser. Bitte kopieren Sie den Link aus der Adresszeile und verwenden Sie für die einmalige Installation Chrome oder Firefox  in aktueller Version. Herzlichen Dank!");

                    }

               }
               
               //manual select event listener can only be assigned when manual select is visible (integration view) so register listener when integration page is shown
               $scope.$watch('workflow.step', function(newValue, oldValue) {
                    if(newValue === "integration"){
                        //unregister all listeners
                        
                        $('#manualselect').selectpicker('render');

                        $('#manualselect').off('changed.bs.select');       //remove event handler so that we dont have too much handlers registered
                        
                        $('#manualselect').on('changed.bs.select', function (e) {
                           try{
                                $scope.$apply(function(){
                                    $scope.currentManual =  $scope.manual[e.target.value];
                                });
                               
                           }catch(e){
                               alertService.defaultErrorMessage(Strings.errors.TECHNISCHER_FEHLER);
                           }
                        });
                        
                        
                        
                    }
               });
               
           
               
                if(!$stateParams.ac || !$stateParams.eid){
                    alertService.defaultErrorMessage(Strings.errors.TECHNISCHER_FEHLER);   
                    return;
                }
                
                
                
                //generate edit url so employee can edit his data later
                if(!$location.absUrl().contains("&edit=true")){
                    $scope.dataEditUrl = $location.absUrl() + "&edit=true";
                }
                 
		
                
                //activate employee to check if activation code and user id is valid
                employeeService.getIntegrationData($stateParams.eid,$stateParams.ac)
                       
                       .then(function(data){    //process data
                           if(data.success !== true){   //check success
                               return $q.reject();
                           }
                           data = data.data;    //fetch actual data
                           $scope.generateSnippets(data);
                           
                           
                           //if the page was called with edit flag than the user wants to change his data so skip explaination step 1 and goto step 2
                           //OR is is the page to show for auto sync users where only the edit page is shown
                           if($stateParams.edit === "true" || $state.current.name === "employeedatacompletion"){
                               $scope.workflow.step = "datacompletion";
                                $scope.datacompletiononly = true;  
                    
                            }
                            
                       })
                       
                       .catch(function(e){
                           alertService.defaultErrorMessage(Strings.errors.DATEN_NICHT_GELADEN);
                           
                       });      
                       
                       
                       
	};
        
        
        $scope.initData();
        
        
        
        
        
        /**
         * go from first step to next step
         * if there is data to complete by user go to step 2
         * if there is no data to complete by user goto step 3
         * @returns {undefined}
         */
        $scope.step2 = function(){
            if($scope.formData.tagsToComplete.length === 0){
                $scope.workflow.step = 'integration';
            }else{
                $scope.workflow.step = 'datacompletion';
            }
            
        };
        
        
   
var isSafari = navigator.appVersion.search('Safari') != -1 && navigator.appVersion.search('Chrome') == -1 && navigator.appVersion.search('CrMo') == -1 && navigator.appVersion.search('CriOS') == -1;
var isIe = (navigator.userAgent.toLowerCase().indexOf("msie") != -1 || navigator.userAgent.toLowerCase().indexOf("trident") != -1);

var ieClipboardDiv = $('#ie-clipboard-contenteditable');
var hiddenInput = $("#hidden-input");

var userInput = "";
var hiddenInputListener = function(text) {};

var focusHiddenArea = function() {
    // In order to ensure that the browser will fire clipboard events, we always need to have something selected
    hiddenInput.val(' ');
    hiddenInput.focus().select();
};

// Focuses an element to be ready for copy/paste (used exclusively for IE)
var focusIeClipboardDiv = function() {
    ieClipboardDiv.focus();
    var range = document.createRange();
    range.selectNodeContents((ieClipboardDiv.get(0)));
    var selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
};

// For IE, we can get/set Text or URL just as we normally would, but to get HTML, we need to let the browser perform the copy or paste
// in a contenteditable div.
var ieClipboardEvent = function(clipboardEvent) {
    var clipboardData = window.clipboardData;
    if ( clipboardEvent == 'copy') {
        
        //determine which snippet is to use
        var snippetToCopy = "";
        if($scope.currentManual.title === "Thunderbird"){
            snippetToCopy = $scope.thunderbirdSnippet.replaceAll("?track=n", "")
        }else if($scope.currentManual.title === "Outlook (Win)"){
             snippetToCopy = $scope.outlookInstallationCode;
        }
        else{
            snippetToCopy = $scope.htmlSnippetRaw.replaceAll("?track=n", "");
        }
        
        clipboardData.setData('Text', snippetToCopy);
        ieClipboardDiv.html(snippetToCopy);
        focusIeClipboardDiv();
        setTimeout(function() {
            focusHiddenArea();
            ieClipboardDiv.empty();
        }, 0);
    }
   
};

// For every broswer except IE, we can easily get and set data on the clipboard
var standardClipboardEvent = function(clipboardEvent, event) {
    var clipboardData = event.clipboardData;
    
    if (clipboardEvent == 'copy') {
        
        //determine which snippet is to use
        var snippetToCopy = "";
        if($scope.currentManual.title === "Thunderbird"){
            snippetToCopy = $scope.thunderbirdSnippet.replaceAll("?track=n", "")
        }else if($scope.currentManual.title === "Outlook (Win)"){
             snippetToCopy = $scope.outlookInstallationCode;
        }else{
            snippetToCopy = $scope.htmlSnippetRaw.replaceAll("?track=n", "");
        }
        
        clipboardData.setData('text/plain', snippetToCopy);  //remove non tracking parameter from tracking pixel and 
        clipboardData.setData('text/html', snippetToCopy);   //remove non tracking parameter from tracking pixel and 
    }

};



// We need the hidden input to constantly be selected in case there is a copy or paste event. It also recieves and dispatches input events
hiddenInput.on('input', function(e) {
    var value = hiddenInput.val();
    userInput += value;
    hiddenInputListener(userInput);

    // There is a bug (sometimes) with Safari and the input area can't be updated during
    // the input event, so we update the input area after the event is done being processed
    if (isSafari) {
        hiddenInput.focus();
        setTimeout(focusHiddenArea, 0);
    } else {
        focusHiddenArea();
    }
});
   
  
// Set clipboard event listeners on the document. 
['copy'].forEach(function(event) {
    document.addEventListener(event, function(e) {
        console.log(event);
        if (isIe) {
            ieClipboardEvent(event);
        } else {
            standardClipboardEvent(event, e);
            focusHiddenArea();
            e.preventDefault();
        }
    });
}); 
   
   

// Keep the hidden text area selected
$(document).mouseup(focusHiddenArea);



        /**
         * Mark the html in the signature window to copy it
         * it is needed that nothing is forgotten when selecting it by the user himself (for example the invisible tracking pixel)
         * @returns {undefined}
         */
        $scope.selectSignature = function(mode){
   
            var successful = document.execCommand('copy');  
             if(successful === true){
                   alertService.defaultSuccessMessage("Die Inhalte wurden in die Zwischenablage kopiert.");
            } 
            else {
                   alertService.defaultErrorMessage("Die Inhalte konnten nicht in die Zwischenablage kopiert werden. Bitte markieren und kopieren Sie die Inhalte selbst. Sollte es zu Schwierigkeiten kommen zögern Sie bitte nicht uns zu kontaktieren:<br>" + Strings.supportdata.supporttelnr+ "<br>" + Strings.supportdata.supportemail);
            }
        };
        
	$scope.imageClicked = function(event){
	 	
	 	event.preventDefault();
	 	var element = document.getElementById("image_installation_link");
	 	selectElement(element);
	 	//element.select();
	 	//alert("TEST");
	};
        
        $scope.textClicked = function(){
            
            
        };
	
}]).filter('trusted', ['$sce', function ($sce) {
    return function(url) {
        return $sce.trustAsResourceUrl(url);
    };
}])
/**
 * Filter only tag elements for given type
 * @param {type} type
 * @returns {Function}
 */
.filter('tagTypeFilter',  function () {
    return function(elements, type) {
        
        var ret = [];
        for(var i = 0 ; i < elements.length; i++){
            if(elements[i].type === type){
                ret.push(elements[i]);
            }
        }
        
        return ret;
    };
})

.directive('selectOnClick', function () {
    return {
//        restrict: 'A',
        link: function (scope, element) {
            var focusedElement;
            element.on('click', function () {
//                if (focusedElement != this) {
                    this.select();
                    focusedElement = this;
//                }
            });
            element.on('blur', function () {
                focusedElement = null;
            });
        }
    };
})
;
//
//
function selectElement(element) {
    if (window.getSelection) {
        var sel = window.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.selectNodeContents(element);
        sel.addRange(range);
    } else if (document.selection) {
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(element);
        textRange.select();
    }
}


