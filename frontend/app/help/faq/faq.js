'use strict';

angular.module('mailtasticApp.faq', ['ui.bootstrap'])



.controller('FaqCtrl', ['$scope', '$filter', 'userService', function($scope, $filter,userService) {


        $scope.manual = {
            "outlookwin" : {
                 "title" : "outlookwin",
                "video" : 'https://www.youtube.com/embed/bk6Xst6euQk' , 
                "steps" :  [
                    "Outlook Windows schritt 1 fsahflsd asdfjlh fsdfsdfadfhsdljsdh fslhdfsldfs lhfs dhlsafdö lhs dlhfs h",
                    "Outlook Windows schritt 2 fsahflsd asdfjlh sdhfs hs adfhsdljsdh fslhdfsldfs lhfs dhlsafdö lhs dlhfs h"
                ],
                "showBanner" : true,
                "showSnippet" : false
            },
            "outlookmac" : {
                 "title" : "outlookmac",
                "video" : 'https://www.youtube.com/embed/bk6Xst6euQk' , 
                "steps" :  [
                    "Outlook Mac schritt 1 fsahflsd asdfjlh sdhfs hs adfhsdljsdh fslhdfsldfs lhfs dhlsafdö lhs dlhfs h",
                    "Outlook Mac schritt 1 fsahflsd asdfjlh sdhfs hs adfhsdljsdh fslhdfsldfs lhfs dhlsafdö lhs dlhfs h"
                ],
                "showBanner" : false,
                "showSnippet" : true
            },
            "gmail"     : {
                "title" : "gmail",
                "video" : 'https://www.youtube.com/embed/5uBsfHA5LBo"' , 
                "steps" : [
                    "Gmail schritt 1 fsahflsd asdfjlh sdhfs hs adfhsdljsdh fslhdfsldfs lhfs dhlsafdö lhs dlhfs h",
                    "Gmail schritt 1 fsa"
                ],
                "showBanner" : true,
                "showSnippet" : false
            },
            "thunderbird"     : {
                "title" : "thunderbird",
                "video" : 'https://www.youtube.com/embed/5uBsfHA5LBo"' , 
                "steps" : [
                    "Thunderbird schritt 1 fsahflsd asdfjlh sdhfs hs adfhsdljsdh fslhdfsldfs lhfs dhlsafdö lhs dlhfs h",
                    "Thunderbird schritt 1 fsa"
                ],
                "showBanner" : false,
                "showSnippet" : true
            },
             "macmail"     : {
                "title" : "macmail",
                "video" : 'https://www.youtube.com/embed/5uBsfHA5LBo"' , 
                "steps" : [
                    "Macmail schritt 1 fsahflsd asdfjlh sdhfs hs adfhsdljsdh fslhdfsldfs lhfs dhlsafdö lhs dlhfs h",
                    "Macmail schritt 1 fsa"
                ],
                "showBanner" : true,
                "showSnippet" : false
            },
             "other"     : {
                "title" : "other",
                "video" : 'https://www.youtube.com/embed/5uBsfHA5LBo"' , 
                "steps" : [
                    "Wenn Sie keinen der aufgeführten E-Mail Clients verwenden setzen Sie sich bitte mit uns in Verbindung damit wir Ihnen schnellstmöglich mailtastic für Ihren Client zur Verfügung stellen können.",
                ],
                "showBanner" : false,
                "showSnippet" : false
            }
        };
        
        $scope.currentManualTitle =
        
        $scope.setManual = function(manual){
            $scope.currentManual =  $scope.manual[manual];
            
        };
        
        $scope.getClass = function(manual){
            if( $scope.currentManual.title === manual){
                return 'active';
            }else{
                return '';
            }
            
        };

        $scope.currentManual = [];


	$scope.htmlSnippet = "";
	$scope.userId = "";
	
	$scope.initData = function(){
             $scope.currentManual =  $scope.manual["gmail"];
            
            
		userService.getHtmlSnippet().then(function(data){
			if(data.success === true){
				$scope.htmlSnippet = data.snippet;
				$scope.userId = data.userId;
			}else{
				$scope.htmlSnippet = "Datei konnte nicht geladen werden";
			}
		});
	};
//	$scope.initData();
	$scope.imageClicked = function(event){
	 	
	 	event.preventDefault();
	 	var element = document.getElementById("image_installation_link");
	 	selectElement(element);
	 	//element.select();
	 	//alert("TEST");
	};
        
        $scope.textClicked = function(){
            
            
        }
	
}]);
//        .filter('trusted', ['$sce', function ($sce) {
//    return function(url) {
//        return $sce.trustAsResourceUrl(url);
//    };
//}])
//    .directive('selectOnClick', function () {
//    return {
////        restrict: 'A',
//        link: function (scope, element) {
//            var focusedElement;
//            element.on('click', function () {
////                if (focusedElement != this) {
//                    this.select();
//                    focusedElement = this;
////                }
//            });
//            element.on('blur', function () {
//                focusedElement = null;
//            });
//        }
//    };
//})


//
//.controller('ActivationCtrl', function($scope, $filter,employeeService, $state) {
//	
//	
//        
//        
//         $scope.manual = {
//            "outlookwin" : {
//                 "title" : "outlookwin",
//                "video" : 'https://www.youtube.com/embed/bk6Xst6euQk' , 
//                "steps" :  [
//                    "Outlook Windows schritt 1 fsahflsd asdfjlh fsdfsdfadfhsdljsdh fslhdfsldfs lhfs dhlsafdö lhs dlhfs h",
//                    "Outlook Windows schritt 2 fsahflsd asdfjlh sdhfs hs adfhsdljsdh fslhdfsldfs lhfs dhlsafdö lhs dlhfs h"
//                ],
//                "showBanner" : true,
//                "showSnippet" : false
//            },
//            "outlookmac" : {
//                 "title" : "outlookmac",
//                "video" : 'https://www.youtube.com/embed/bk6Xst6euQk' , 
//                "steps" :  [
//                    "Outlook Mac schritt 1 fsahflsd asdfjlh sdhfs hs adfhsdljsdh fslhdfsldfs lhfs dhlsafdö lhs dlhfs h",
//                    "Outlook Mac schritt 1 fsahflsd asdfjlh sdhfs hs adfhsdljsdh fslhdfsldfs lhfs dhlsafdö lhs dlhfs h"
//                ],
//                "showBanner" : false,
//                "showSnippet" : true
//            },
//            "gmail"     : {
//                "title" : "gmail",
//                "video" : 'https://www.youtube.com/embed/5uBsfHA5LBo"' , 
//                "steps" : [
//                    "Gmail schritt 1 fsahflsd asdfjlh sdhfs hs adfhsdljsdh fslhdfsldfs lhfs dhlsafdö lhs dlhfs h",
//                    "Gmail schritt 1 fsa"
//                ],
//                "showBanner" : true,
//                "showSnippet" : false
//            },
//            "thunderbird"     : {
//                "title" : "thunderbird",
//                "video" : 'https://www.youtube.com/embed/5uBsfHA5LBo"' , 
//                "steps" : [
//                    "Thunderbird schritt 1 fsahflsd asdfjlh sdhfs hs adfhsdljsdh fslhdfsldfs lhfs dhlsafdö lhs dlhfs h",
//                    "Thunderbird schritt 1 fsa"
//                ],
//                "showBanner" : false,
//                "showSnippet" : true
//            },
//             "macmail"     : {
//                "title" : "macmail",
//                "video" : 'https://www.youtube.com/embed/5uBsfHA5LBo"' , 
//                "steps" : [
//                    "Macmail schritt 1 fsahflsd asdfjlh sdhfs hs adfhsdljsdh fslhdfsldfs lhfs dhlsafdö lhs dlhfs h",
//                    "Macmail schritt 1 fsa"
//                ],
//                "showBanner" : true,
//                "showSnippet" : false
//            },
//             "other"     : {
//                "title" : "other",
//                "video" : 'https://www.youtube.com/embed/5uBsfHA5LBo"' , 
//                "steps" : [
//                    "Wenn Sie keinen der aufgeführten E-Mail Clients verwenden setzen Sie sich bitte mit uns in Verbindung damit wir Ihnen schnellstmöglich mailtastic für Ihren Client zur Verfügung stellen können.",
//                ],
//                "showBanner" : false,
//                "showSnippet" : false
//            }
//        };
//        
//        $scope.currentManualTitle =
//        
//        $scope.setManual = function(manual){
//            $scope.currentManual =  $scope.manual[manual];
//            
//        };
//        
//        $scope.getClass = function(manual){
//            if( $scope.currentManual.title === manual){
//                return 'active';
//            }else{
//                return '';
//            }
//            
//        };
//
//        $scope.currentManual = [];
//
//
//	$scope.htmlSnippet = "";
//	$scope.userId = "";
//	
//	
//	$scope.imageClicked = function(event){
//	 	
//	 	event.preventDefault();
//	 	var element = document.getElementById("image_installation_link");
//	 	selectElement(element);
//	 	//element.select();
//	 	//alert("TEST");
//	};
//        
//        $scope.initData = function(){
//		var requestData = {
//			activationCode : $state.params.ac,
// 			employeeId     : $state.params.eid
//		};
//		
//		$scope.currentManual =  $scope.manual["gmail"];
//		if(!requestData.activationCode || !requestData.employeeId){
//		
//			alert(Strings.TECHNISCHER_FEHLER);
//		}else{
//			employeeService.activateEmployee(requestData).then(function(data){
//				if(data.success === true){
//                                       $scope.htmlSnippet = data.snippet;
//                                        $scope.userId = requestData.employeeId;
//				}else{
//                                    alert(Strings.error.ACCOUNT_ACTIVATION_ERROR_EMPLOYEE);
//                                }
//			});
//		}
//	};
//        $scope.initData();
//})
//
//
//;


//;
//
//
//function selectElement(element) {
//    if (window.getSelection) {
//        var sel = window.getSelection();
//        sel.removeAllRanges();
//        var range = document.createRange();
//        range.selectNodeContents(element);
//        sel.addRange(range);
//    } else if (document.selection) {
//        var textRange = document.body.createTextRange();
//        textRange.moveToElementText(element);
//        textRange.select();
//    }
//}
