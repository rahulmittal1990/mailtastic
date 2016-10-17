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
                "title" : "Mac Mail",
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
            }
        };
   var rawSnippetTpl = '<a href="https://www.app.mailtastic.de/api/li/$$$USERID$$$"><img src="http://www.app.mailtastic.de/api/im/$$$USERID$$$/ad" alt="Bitte aktivieren Sie externe Inhalte, um diese E-Mail vollständig sehen zu können." /></a>';
    

angular.module('mailtasticApp.installation', ['ui.bootstrap'])



.controller('InstallationCtrl', ['$scope', '$filter', 'userService', 'employeeService','$stateParams', function($scope, $filter,userService,employeeService, $stateParams) {
   
        //wird bei outlook die automatische oder die manuelle Integration angezeigt werden
        $scope.outlookWin = {
           showOutlookSnippetInstallCode : "true"
        };
        $scope.manual = manuals;
        
        $scope.currentManualTitle ="";
        $scope.mode = "admin";
        
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
            employeeService.sendothermailclientnotification(null,$scope.othermailclient.clientname).then(function(data){
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

        $scope.currentManual = [];


	$scope.htmlSnippet = "";
        $scope.outlooklink1 = "";
        $scope.outlooklink2 = "";
        $scope.outlookInstallationCode = "";
	$scope.userId = "";
	$scope.htmlSnippetRaw = "";
        
         
	$scope.initData = function(){
            if($stateParams.client ==="macmailold"){
                 $scope.currentManual =  $scope.manual["macmailold"];
            }else{
                 $scope.currentManual =  $scope.manual["outlookwin"];
            }
            
            
            
            
		userService.getHtmlSnippet().then(function(data){
			if(data.success === true){
				$scope.htmlSnippet = data.snippet;
                                $scope.outlooklink1 = data.outlookLinks.first;
                                $scope.outlooklink2 = data.outlookLinks.second;
				$scope.userId = data.userId;
                                $scope.outlookInstallationCode = data.userId;
                                $scope.htmlSnippetRaw = rawSnippetTpl.replaceAll("$$$USERID$$$", data.userId);
                                
			}else{
				$scope.htmlSnippet = "Daten konnte nicht geladen werden";
                                $scope.htmlSnippetRaw = "Daten konnte nicht geladen werden";
                                $scope.outlooklink1 = "Daten konnte nicht geladen werden";
                                $scope.outlooklink2 = "Daten konnte nicht geladen werden";
                                $scope.outlookInstallationCode = "Daten konnte nicht geladen werden";
			}
		});
	};
	$scope.initData();
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



.controller('ActivationCtrl', ['$scope', '$filter', 'employeeService', '$state', function($scope, $filter,employeeService, $state) {
	  $scope.mode = "employee";
	//wenn jemand einen fremden mail client hat
         $scope.othermailclient = {
            clientname : ""
        };
        
         //wird bei outlook die automatische oder die manuelle Integration angezeigt werden
        $scope.outlookWin = {
           showOutlookSnippetInstallCode : "true"
        };
        
            $scope.manual = manuals;
        
        $scope.currentManualTitle ="";
        
        $scope.setManual = function(manual){
            $scope.currentManual =  $scope.manual[manual];
            
              //navbar schließen
             var toggle = $(".navbar-toggle").is(":visible");
            if (toggle) {
                $(".navbar-collapse").collapse('hide');
            }
            
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

        $scope.currentManual = [];


	$scope.htmlSnippet = "";
        $scope.outlooklink1 = "";
        $scope.outlooklink2 = "";
	$scope.userId = "";
        $scope.htmlSnippetRaw = "";
        
        $scope.othermailclient.clientname = "";
	
	
	$scope.imageClicked = function(event){
	 	
	 	event.preventDefault();
	 	var element = document.getElementById("image_installation_link");
	 	selectElement(element);
	 	//element.select();
	 	//alert("TEST");
	};
        
        
        $scope.sendothermailclientnotification = function(){
            employeeService.sendothermailclientnotification($state.params.eid,$scope.othermailclient.clientname).then(function(data){
                if(data.success === true){
                    alert("Herzichen Dank für Ihre Nachricht. Wir werden umgehend eine Lösung für Ihren E-Mail-Client zur Verfügung stellen.");
                      $scope.othermailclient.clientname = "" ;
                }else{
                    alert(Strings.errors.TECHNISCHER_FEHLER);
                }
            });
        };
        
        $scope.admindata = {
            firstname : "",
            lastname : ""
        };
        
        $scope.initData = function(){
		var requestData = {
			activationCode : $state.params.ac,
 			employeeId     : $state.params.eid
		};
		
		$scope.currentManual =  $scope.manual["outlookwin"];
		if(!requestData.activationCode || !requestData.employeeId){
		
			alert(Strings.TECHNISCHER_FEHLER);
		}else{
			employeeService.activateEmployee(requestData).then(function(data){
				if(data.success === true){
                                        $scope.htmlSnippet = data.snippet;
                                        $scope.outlooklink1 = data.outlookLinks.first;
                                        $scope.outlooklink2 = data.outlookLinks.second;
                                        $scope.outlookInstallationCode = requestData.employeeId;
                                        $scope.userId = requestData.employeeId;
                                        $scope.admindata = data.admindata;
                                        $scope.htmlSnippetRaw = rawSnippetTpl.replaceAll("$$$USERID$$$", requestData.employeeId);
               
                                      
				}else{
                                    $scope.htmlSnippetRaw = "Daten konnte nicht geladen werden";
                                    $scope.htmlSnippet = "Daten konnte nicht geladen werden";
                                    $scope.outlooklink1 = "Daten konnte nicht geladen werden";
                                    $scope.outlooklink2 = "Daten konnte nicht geladen werden";
                                    $scope.outlookInstallationCode = "Daten konnte nicht geladen werden";
                                    alert(Strings.errors.ACCOUNT_ACTIVATION_ERROR_EMPLOYEE);
                                }
			});
		}
	};
        $scope.initData();
}])


;


;


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
