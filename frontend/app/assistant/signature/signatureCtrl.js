'use strict';

angular.module('mailtasticApp.assistant')
        .controller('SignatureAssistantCtrl', 
[
    '$scope', 
    'alertService',
    'assistantconfigService',
    '$state', 
    'listHelperService',
    'signatureService',
    'groupsService',
   function ($scope, alertService,assistantconfigService,$state, listHelperService, signatureService,groupsService) {
               

                   
                $scope.data = {
                    selectedSignatures: [],
                    signatures : []
                };
                
                $scope.list = listHelperService;
                
                
                
                
                
                
                
                                //is needed because initData is called once when state is initialized
                $scope.$watch('config.currenttoshow', function (newValue, oldValue) {
//                if (newValue !== oldValue) {
//                    $log.log('Changed!');
//                }

                   
                    if (newValue === "signature_selectexisting" ) {
                            //breadcrumps
//                            $scope.config.breadcrumps = ["Signatur zuweisen"];
                            $scope.initData();
                            
                            
                    } 
                });
                
                
                
                
                
                
               
                $scope.initData = function () {
                    $scope.config = assistantconfigService;
                    
                
                    signatureService.getAll().then(function (signatures) {

                        if(signatures.success === true){
                            listHelperService.selected = [];
                            $scope.data.signatures = signatures.data;
                            
                            listHelperService.selectionType = "single";
                            $scope.data.selectedSignatures =  listHelperService.selected;
                            listHelperService.all = $scope.data.signatures;
                            
                        }else{
                            alertService.defaultErrorMessage(Strings.errors.DATEN_NICHT_GELADEN);
                        }
                    });

                };
                
                  $scope.navigateBack = function(){
                   // if($scope.config.currenttoshow  === "campaign_createnew" || $scope.config.currenttoshow  === "campaign_selectexisting"){
                        if($scope.config.entryPoint === "employee_createnew"  ||  $scope.config.entryPoint === "employee_import"){
                            $scope.config.currenttoshow  = "employee_results";
                        }
                        else if($scope.config.entryPoint === "campaign_createnew" ){
                             $state.go("base.campaigns.campaignlist");
                        }
                    //}
                    
                };



                $scope.abort = function(){
                    alertService.assistantAbortCampaign($scope.config.resultdata, function(){
                         $state.go("base.campaigns.campaigndetail", { campaignId: $scope.config.resultdata.campaign.id});
                    },function(){});
                };

                //determine next step after creating campaign
                $scope.nextStep = function(data){
                      if($scope.config.entryPoint === "employee_createnew" || $scope.config.entryPoint === "employee_import"){      //employee erstellen
                                    $scope.config.resultdata.campaignCreated = true;
                                    $scope.config.campaignId = data.id;
                                    groupsService.setCampaign([$scope.config.groupId], $scope.config.campaignId).then(function(result){
                                        
                                        $scope.config.breadcrumpsdone.push("Kampagne zugewiesen");
                                       
                                        if(result.success === true){
                                            $scope.config.currenttoshow = "employee_results";
                                        }else{
                                            //TODO
                                            alert("Kampagne zu Gruppe setzen fehlgeschlagen");
                                        }
                                    });
                                }else if($scope.config.entryPoint === "campaign_createnew"){        //kampagne erstellen
                                     $scope.config.breadcrumpsdone.push("Kampagne erstellt");
                                     $scope.showResults(data);
                                 
                                }else if($scope.config.entryPoint === "group_createnew"){       //gruppe erstellen
                                    
                                    groupsService.setCampaign([$scope.config.resultdata.group.id], data.id).then(function(result){
                                        $scope.config.resultdata.campaign = $scope.campaigndata;
                                        $scope.config.resultdata.group.campaignAdded = true;
                                        $scope.config.breadcrumpsdone.push("Kampagne zugewiesen");
                                        if(result.success === true){
                                            $scope.config.currenttoshow = "group_results";
                                        }else{
                                            //TODO
                                            alert(Strings.errors.TECHNISCHER_FEHLER);
                                        }
                                    });
                                 
                                }
                };

               
                /**
                 * Assign selected Signatures to group
                 * @returns {undefined}
                 */
                $scope.setSignatureFromList = function(){
                    if(!$scope.data.selectedSignatures || !$scope.data.selectedSignatures[0]){
                        alert("Bitte eine Signatur selektieren");
                    }else{
                         groupsService.setSignature([$scope.config.groupId], $scope.data.selectedSignatures[0].id).then(function(result){
                                        if(result.success === true){
                                            
                                            $scope.config.resultdata.signature.signatureAssigned = true; //damit result neu lädt
                                            $scope.config.resultdata.signature.signatureAssignedTitle = $scope.data.selectedSignatures[0].title; //show title of assigned signature
                                            $scope.config.breadcrumpsdone.push("Signatur zugewiesen");
                             
                                            if($scope.config.entryPoint === "employee_createnew" || $scope.config.entryPoint === "employee_import"){
                                                $scope.config.currenttoshow = "employee_results";
                                            }else if($scope.config.entryPoint === "group_createnew" ){
                                                $scope.config.currenttoshow = "group_results";
                                            }
                                        }else{
                                            //TODO
                                            alert("Kampagne zu Gruppe setzen fehlgeschlagen");
                                        }
                                    });
                    }
                    
                   
                };

                $scope.initData();
            }]);

