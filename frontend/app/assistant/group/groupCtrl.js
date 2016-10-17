'use strict';

angular.module('mailtasticApp.assistant')
.controller('GroupAssistantCtrl', 
    [
        '$scope', 
        'groupsService',
       'alertService',
        'assistantconfigService',
        '$state',
        
        'employeeService',
        function($scope, groupsService,alertService,assistantconfigService,$state, employeeService) {
        $scope.showFormAlert = function(){
          
       };
   
	
        $scope.data = {
            selectedGroups : [],
            groups : []
        };
        
        $scope.config = {};
        
            $scope.groupdata = {
                title: '',
                activeCampaign: null

            };
            $scope.members = [];



       //wird immer aufgerufen wenn sich der screen ändert. Wird gebraucht weil controller nicht neu initialisiert wird
                $scope.$watch('config.currenttoshow', function (newValue, oldValue) {
//                if (newValue !== oldValue) {
//                    $log.log('Changed!');
//                }
                    if (newValue === "group_results" ) {
                        
                        if(!$scope.config.resultdata.group.amountOfEmployeesAdded || !$scope.config.resultdata.group.amountOfEmployeesAdded === 0){
                            $scope.config.breadcrumps = ["Mitarbeiter hinzufügen"];
                        }else if(!$scope.config.resultdata.group.campaignAdded || $scope.config.resultdata.group.campaignAdded === false){
                            $scope.config.breadcrumps = ["Kampagne / Signatur zuweisen"];
                        }else if(!$scope.config.resultdata.rolloutDone){
                            $scope.config.breadcrumps = ["Mitarbeiter benachrichtigen"];
                        }else{
                            $scope.config.breadcrumps = ["Fertig"];
                        }
                      
                    }
                });


            //alle gruppen laden für die liste an vorhanden gruppen wenn einer kampagne eine vorhande gruppe zugewiesen werden soll
            $scope.loadGroups = function(){
                if($scope.modaloptions.campaignId && $scope.modaloptions.currentStep === "existing"){
                    groupsService.get().then(function(data){
                        $scope.data.groups = [];
                        for(var i = 0 ; i < data.length ; i++){
                            if(data[i].activeCampaign !== $scope.modaloptions.campaignId){
                                $scope.data.groups.push(data[i]);
                            }
                        }
                        
                    });
                }
                
            };
            //$scope.loadGroups();



              /**
                 * Send invitation mail to all new added employees
                 * @returns {undefined}
                 */
                $scope.inviteMembers = function(){
                    
                    
                    $scope.config.inviteMembers();
//                    
//                    
//                    
//                      if(!$scope.config.resultdata.employee.idsAdded || !Array.isArray($scope.config.resultdata.employee.idsAdded) || $scope.config.resultdata.employee.idsAdded.length === 0){
//                         alertService.defaultErrorMessage(Strings.errors.DATEN_NICHT_GELADEN);
//                        
//                    }else{
//                        employeeService.sendInvitations($scope.config.resultdata.employee.idsAdded)
//                                .then(function(data){
//                                    if(data.success === true){
//                                        $scope.config.resultdata.rolloutDone = true;
//                                        $scope.config.resultdata.amountOfRolledOut = $scope.config.resultdata.employee.idsAdded.length;
//
//                                        $scope.config.breadcrumpsdone.push("Mitarbeiter informiert");
//                                        $scope.config.breadcrumps = ["Fertig"];
//                                    }else{
//                                          alertService.defaultErrorMessage(Strings.errors.DATEN_NICHT_GELADEN);
//                                    }
//                                });
//                        
//                    }
                    
                    
                    
                    
                    
                    
                    
//                    if(!$scope.config.resultdata.group.id){
//                        
//                          alertService.defaultErrorMessage(Strings.errors.DATEN_NICHT_GELADEN);
//                          return;
//                    }
//                    
//                    signatureService.rolloutGroup($scope.config.resultdata.group.id).then(
//                        function(data){
//                                    if(data.success ===  true){
//                                          $scope.config.resultdata.rolloutDone = true;
//                                          $scope.config.resultdata.amountOfRolledOut = data.amountOfInvitationsSent;
//                                          
//                                          $scope.config.breadcrumpsdone.push("Mitarbeiter informiert");
//                                          $scope.config.breadcrumps = ["Fertig"];
//                                          
//                                    }else{
//                                         alertService.defaultErrorMessage(Strings.errors.DATEN_NICHT_GELADEN);
//
//                                    }
//                        
//                    });
                    
//                    //get groupId to rollout  
//                   if(!$scope.config.resultdata.employee.idsAdded || $scope.config.resultdata.employee.idsAdded.length === 0){
//                       //nothing to do here
//
//                   }else{
//                        employeeService.sendInvitations($scope.config.resultdata.employee.idsAdded)
//                              .then(function(data){
//                                    if(data.success ===  true){
//                                          $scope.config.resultdata.rolloutDone = true;
//                                          $scope.config.resultdata.amountOfRolledOut = data.amountOfInvitationsSent;
//                                    }else{
//                                         alertService.defaultErrorMessage(Strings.errors.DATEN_NICHT_GELADEN);
//
//                                    }
//                                });
//                   }
                 
                };



             $scope.navigateBack = function(){
                    if($scope.config.currenttoshow  === "group_createnew" || $scope.config.currenttoshow  === "group_selectexisting"){
                        if($scope.config.entryPoint === "employee_createnew"  ||  $scope.config.entryPoint === "employee_import"){
                            $scope.config.currenttoshow  = $scope.config.entryPoint;
                        }else if($scope.config.entryPoint === "campaign_createnew"){
                             $scope.config.currenttoshow  = "campaign_results";
                             
                        }else if($scope.config.currenttoshow  === "group_createnew"){
                            $state.go('base.employees.grouplist');
                        }
                    }
                    
                };
                
                
                $scope.addEmployees = function(mode){
                    if(mode === "new"){
                        $scope.config.currenttoshow = "employee_createnew";
                    }else if(mode === "existing"){
                         $scope.config.currenttoshow = "employee_selectexisting";
                    }else if(mode === "import"){
                         $scope.config.currenttoshow = "employee_import";
                    }
                    
                };
                
                $scope.addCampaign = function(mode){
                      if(mode === "new"){
                        $scope.config.currenttoshow = "campaign_createnew";
                    }else if(mode === "existing"){
                         $scope.config.currenttoshow = "campaign_selectexisting";
                    }else if(mode === "import"){
                         $scope.config.currenttoshow = "campaign_import";
                    }
                    
                };

                $scope.abort = function(){
                    var data = {
                        
                    };
                    alertService.assistantAbortGroup($scope.config.resultdata, function(){
                         $state.go("base.employees.groupdetails", { groupId: $scope.config.resultdata.group.id});
                        
                    }, function(){/*closde modal*/});
                };


  
                //open screen to assign a signature to the group where the employees were added
                $scope.setSignature = function(mode){
                      $scope.config.currenttoshow = "signature_selectexisting";
                    
                };


            $scope.createGroup = function () {

                    $scope.loadingPromise = groupsService.add($scope.groupdata).then(function (data) {
                        if(data.success === true){
                            //gruppen ansicht darf nicht sichtbar sein
                            $scope.config.disableGroupArea = true;
                            
                            
                            //CHECKEN WIE ES WEITER GEHT
                            if($scope.config.entryPoint === "employee_createnew" || $scope.config.entryPoint === "employee_import"){
                                
                                //eigene results
                                $scope.config.resultdata.groupCreated = true;
                                $scope.config.resultdata.groupTitle = $scope.groupdata.title;
                                $scope.config.currenttoshow = $scope.config.entryPoint;
                                $scope.config.groupId = data.groupId;
                                
                               
                                
                                $scope.config.breadcrumpsdone.push("Abteilung erstellt");
                                 
                            }else if($scope.config.entryPoint === "campaign_createnew"){
                                    groupsService.setCampaign([data.groupId], $scope.config.resultdata.campaign.id).then(function(result){
                                        if(result.success === true){
                                            if($scope.config.entryPoint === "campaign_createnew" ){
                                                $scope.config.breadcrumpsdone.push("Abteilung zugewiesen");
                                                $scope.config.resultdata.campaign.groupSet = true;
                                                $scope.config.resultdata.campaign.amountOfGroupsSet = 1;
                                                $scope.config.resultdata.campaign.amountOfMembersGroupsSet = 0;
                                                //globale results
                                                $scope.config.resultdata.group.title = $scope.groupdata.title;
                                                $scope.config.resultdata.group.id = data.groupId;
                                                $scope.config.currenttoshow = "campaign_results";
                                                $scope.config.resultdata.campaign.groupTitlesAdded = $scope.config.resultdata.group.title;
                                                
                                                
                                            }
                                        }else{
                                            //TODO
                                            alert("Kampagne zu Abteilung setzen fehlgeschlagen");
                                        }
                                    });
                                
                            }else if($scope.config.entryPoint === "group_createnew"){
                                $scope.config.resultdata.group.title = $scope.groupdata.title;
                                $scope.config.resultdata.group.id = data.groupId;
                                $scope.config.resultdata.group.employeesAdded = false;
                                 $scope.config.resultdata.group.amountOfEmployeesAdded = 0;
                                $scope.config.resultdata.group.campaignAdded = false;
                                $scope.config.breadcrumpsdone.push("Abteilung erstellt");
                                $scope.config.currenttoshow = "group_results";
                                 
                                $scope.config.groupId = data.groupId;
                            }
                        }else{
                            alert(Strings.errors.TECHNISCHER_FEHLER);
                        }
                    });
//                }
            };
        
        $scope.initData = function(){
            
            $scope.config = assistantconfigService;
            
            
            //breadcrumps
            if($scope.config.currenttoshow === "group_createnew"){
                $scope.config.breadcrumps = ["Abteilung erstellen"];
            }else if($scope.config.currenttoshow === "group_selectexisting"){
                $scope.config.breadcrumps = ["Abteilung auswählen"];
            }
            
            groupsService.get().then(function(data){
                $scope.data.groups = data;
            });
        };
        
        
         /**
                 * Nimmt die selektierte Gruppe aus der Liste und fügt ihr die zuvor erstellte Kampagne hinzu
                 * @returns {undefined}
                 */
            
                $scope.setCampaignForGroupFromList = function(){
                    if(!$scope.data.selectedGroups || !$scope.data.selectedGroups[0]){
                        alert("Bitte eine Abteilung selektieren");
                    }else if(!$scope.config.resultdata.campaign || !$scope.config.resultdata.campaign.id){
                        alert(Strings.errors.DATEN_NICHT_GELADEN);
                    }
                    else
                    {
                        
                        //prepare groupIds
                        var groupIds = [];
                        var amountOfMembers = 0;        // wird für den Result Screen in der Kampagne benötigt
                        var groupTitlesAsString = "";       //neeeded for campaign result page
                        for(var i = 0 ; i < $scope.data.selectedGroups.length;i++){
                            groupIds.push($scope.data.selectedGroups[i].id); 
                            amountOfMembers += $scope.data.selectedGroups[i].amountOfMembers;
                            groupTitlesAsString+=$scope.data.selectedGroups[i].title;
                            if(i !== $scope.data.selectedGroups.length-1){
                                groupTitlesAsString+=$scope.data.selectedGroups[i].title += ", ";
                            }
                            
                        }
                        
                         groupsService.setCampaign(groupIds, $scope.config.resultdata.campaign.id).then(function(result){
                                        if(result.success === true){
                                            if($scope.config.entryPoint === "campaign_createnew" ){
                                                $scope.config.breadcrumpsdone.push("Abteilung zugewiesen");
                                                $scope.config.resultdata.campaign.groupSet = true;
                                                $scope.config.resultdata.campaign.multipleGroups = true;
                                                $scope.config.resultdata.campaign.groupsSet = $scope.data.selectedGroups;
                                                $scope.config.resultdata.campaign.amountOfGroupsSet = groupIds.length;
                                                $scope.config.resultdata.campaign.amountOfMembersGroupsSet = amountOfMembers;
                                                $scope.config.currenttoshow = "campaign_results";
                                                $scope.config.resultdata.campaign.groupTitlesAdded = groupTitlesAsString;
                                                
                                                
                                                
                                            }
                                        }else{
                                            //TODO
                                            alert("Kampagne zu Abteilung setzen fehlgeschlagen");
                                        }
                                    });
                    }
                    
                   
                };

        
        
        
           $scope.isSelectedAll = function () {
                return $scope.data.selectedGroups.length === $scope.data.groups.length;
            };
            $scope.selectAll = function ($event) {
                var checkbox = $event.target;
                var action = (checkbox.checked ? 'add' : 'remove');
                for (var i = 0; i < $scope.data.groups.length; i++) {
                    var entity = $scope.data.groups[i];
                    updateSelected(action, entity);
                }
            };
            $scope.selectAllOuter = function(){
                var action = ($scope.data.selectedGroups.length === $scope.data.groups.length ?  'remove' : 'add');
                for (var i = 0; i < $scope.data.groups.length; i++) {
                    var entity = $scope.data.groups[i];
                    updateSelected(action, entity);
                }
            };
        
            //liste selektieren
             var updateSelected = function (action, item) {
                //check if item is already selected
                var ret = jQuery.grep($scope.data.selectedGroups, function (n, i) {
                    return (n.id === item.id);
                });


                if (action === 'add' && ret.length === 0) { //falls objekt noch nicht selected dann selektiere
                    
                    $scope.data.selectedGroups.push(item);
                    
                }
                if (action === 'remove' && ret.length > 0) {    //falls selected dann deselektiere
                     //objekt aus dem array entfernen    WIRD NUR BEI MULTI SELECT GEBRAUCHT
                    for (var i = 0; i < $scope.data.selectedGroups.length; i++) {
                        var obj = $scope.data.selectedGroups[i];

                        if (obj.id === item.id) {
                            $scope.data.selectedGroups.splice(i, 1);
                            break;
                        }
                    }

                }

                
            };

            $scope.updateSelection = function ($event, item) {
                var checkbox = $event.target;
                var action = (checkbox.checked ? 'add' : 'remove');
                updateSelected(action, item);
            };


           

            $scope.isSelected = function (item) {


                var ret = jQuery.grep($scope.data.selectedGroups, function (n, i) {
                    return (n.id === item.id);
                });

                return (ret.length !== 0);
            };

           
            
             $scope.rowClicked = function(item){
                 
                 
                 
                  var id = item.id;
                var mode = "add";
                for (var i = 0; i < $scope.data.selectedGroups.length; i++) {
                    if (id === $scope.data.selectedGroups[i].id) {
                        mode = "remove";
                        break;
                    }

                }
                
                  updateSelected(mode, item);
              

            };
            
             $scope.getSelectedClass = function (entity) {



                return $scope.isSelected(entity) ? 'selected' : '';
            };
            
            $scope.initData();
}]);

