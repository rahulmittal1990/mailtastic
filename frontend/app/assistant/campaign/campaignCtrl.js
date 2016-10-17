'use strict';

angular.module('mailtasticApp.assistant')
        .controller('CmpAssistantCtrl', 
[
    '$scope', 
    'alertService', 
    'campaignService',
    'groupsService',
    'assistantconfigService',
    '$state', 
    'signatureService',
    '$q',
    'employeeService',
    function ($scope,  alertService, campaignService,groupsService,assistantconfigService,$state,signatureService,$q,employeeService) {
                $scope.showFormAlert = function () {
                   
                };

                  $scope.campaigndata = {
                    title : '',
                    url : '',
                    image : '',
                    color : '#009fe3'
                    };

                   
                $scope.data = {
                    selectedCampaigns: [],
                    campaignsToShow : []
                };
                
                $scope.checkfile = function(files){
                    if(files && files.length === 0){
                        alert("Bitte stellen Sie sicher, dass die Dateigröße unter 1MB liegt und es sich um eine Bilddatei handelt.");
                    }
                };
                
                 //wird immer aufgerufen wenn sich der screen ändert. Wird gebraucht weil controller nicht neu initialisiert wird
                $scope.$watch('config.currenttoshow', function (newValue, oldValue) {
//                if (newValue !== oldValue) {
//                    $log.log('Changed!');
//                }
                    if (newValue === "campaign_createnew") {
                        //reset data
                        $scope.campaigndata.title = "";
                         $scope.campaigndata.image = "";
                         $scope.campaigndata.url = "";
                         $scope.campaigndata.color = '#009fe3';
//                        if ($scope.config.groupCreated === true) {
//                            $scope.loadGroups().then(function () {
//                                $scope.employeedata.currentGroup = $scope.config.groupId.toString();
//                            });
//                            
//
//                        }
                    } else if (newValue === "campaign_results") {
//                       
                        $scope.showResults();
                    }
                });
                
                
                //prepare data for resultpage
                $scope.showResults = function(data){
                    
                    //kampagne gerade erstellt  
                    if(data && data.id){
                        $scope.config.resultdata.campaign = $scope.campaigndata;
                        $scope.config.resultdata.campaign.id = data.id;
                    }else{
                        
                    }
                    
                    
                   //ob die Abetilung für Kampgne schon gesetzt wurde oder nicht
                    if(!$scope.config.resultdata.campaign.groupSet){    
                        $scope.config.breadcrumps=["Abteilung zuweisen"];
                    }else if($scope.config.resultdata.campaign.groupSet && $scope.config.resultdata.campaign.amountOfMembersGroupsSet===0){
                         $scope.config.breadcrumps=["Mitarbeiter hinzufügen"];
                    }
                    else{
                           $scope.config.breadcrumps=["Fertig"];
                    }
                   $scope.config.currenttoshow = "campaign_results";
                    
                };



                //öffnet den screen um eine Gruppe auszuwählen der die neu erstelle Kampagne hinzugefügt werden soll
                $scope.addGroup = function(mode){
                    if(mode === "new"){
                        $scope.config.currenttoshow = "group_createnew";
                    }else if(mode === "existing"){
                        $scope.config.currenttoshow = "group_selectexisting";
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

                $scope.sumUpActiveEmps = function (items) {
                    var amount = 0;
                    for (var i = 0; i < items.length; i++) {
                        amount += items[i].amountOfMembers;
                    }
                    return amount;
                };

                $scope.initData = function () {
                    $scope.config = assistantconfigService;
                    
                    //breadcrumps
                    if($scope.config.currenttoshow === "campaign_createnew"){
                        $scope.config.breadcrumps = ["Kampagne hinzufügen"];
                    }else if($scope.config.currenttoshow === "campaign_selectexisting"){
                        $scope.config.breadcrumps = ["Kampagne auswählen"];
                    }
                    
                    
                    
                    
                    campaignService.get().then(function (campaigns) {

                        $scope.data.activeCampaigns = [];
                        $scope.data.inactiveCampaigns = [];
                        for (var i = 0; i < campaigns.length; i++) {
                            if (campaigns[i].activegroups.length === 0) {
                                $scope.data.inactiveCampaigns.push(campaigns[i]);
                            } else {
                                $scope.data.activeCampaigns.push(campaigns[i]);
                            }
                        }
                        $scope.data.campaigns = $scope.data.activeCampaigns;
                        $scope.data.campaigns = $scope.data.campaigns.concat($scope.data.inactiveCampaigns);
                        $scope.data.campaignsToShow = $scope.data.campaigns;
                    });

                };
                
                  $scope.navigateBack = function(){
                    if($scope.config.currenttoshow  === "campaign_createnew" || $scope.config.currenttoshow  === "campaign_selectexisting"){
                        if($scope.config.entryPoint === "employee_createnew"  ||  $scope.config.entryPoint === "employee_import"){
                            $scope.config.currenttoshow  = "employee_results";
                        }
                        else if($scope.config.entryPoint === "campaign_createnew" ){
                             $state.go("base.campaigns.campaignlist");
                        }
                    }
                    
                };



                 /**
                 * Send invitation mail to all new added employees
                 * In this special case we send the invitation mail directly to the employee and not over the group rollout feature
                 * this is because in the campaign assistant workflow employees can be added to more than one group
                 * TODO in other assistants this should be done the same way
                 * @returns {undefined}
                 */
                $scope.inviteMembers = function(){
                    
                    
                    $scope.config.inviteMembers();
                    
//                    if(!$scope.config.resultdata.employee.idsAdded || !Array.isArray($scope.config.resultdata.employee.idsAdded) || $scope.config.resultdata.employee.idsAdded.length === 0){
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
//                    
//                    //check if groupId is set when creating new group
//                    var groupId = $scope.config.groupId || $scope.config.resultdata.group.id;
//                    
//                    
//                    if(!groupId){
//                        if(!$scope.config.resultdata.campaign.groupsSet || $scope.config.resultdata.campaign.groupsSet.length === 0){
//                              alertService.defaultErrorMessage(Strings.errors.DATEN_NICHT_GELADEN);
//                              return;
//                        }else{
//                            //get groupIds to rollout when there were groups selected from list
//                            groupId = [];
//                            for(var i = 0 ; i < $scope.config.resultdata.campaign.groupsSet.length; i++){
//                                groupId.push($scope.config.resultdata.campaign.groupsSet[i]);
//                                
//                            }
//                        }
//                    }else{
//                        groupId = [groupId];
//                    }
//                    
//                    
//                    //if here group id is still null or empty array there was an error
//                    if(!groupId || groupId.length === 0){
//                        
//                          alertService.defaultErrorMessage(Strings.errors.DATEN_NICHT_GELADEN);
//                          return;
//                    }
//                    
//                    var promises = [];
//                    angular.forEach( groupId, function(value){
//                        promises.push(signatureService.rolloutGroup(value));
//                    });
//                    
//                    
//                    //rollout for all groups where employees were added to
//                    $q.all(promises).then(function(data){
//                         if(data.success ===  true){
//                            $scope.config.resultdata.rolloutDone = true;
//                            $scope.config.resultdata.amountOfRolledOut =data.amountOfInvitationsSent;
//
//                            $scope.config.breadcrumpsdone.push("Mitarbeiter informiert");
//                            $scope.config.breadcrumps = ["Fertig"];
//                                          
//                        }else{
//                            alertService.defaultErrorMessage(Strings.errors.DATEN_NICHT_GELADEN);
//
//                        }
//                        
//                        
//                    });
//                    
//                 
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
                                            alert("Kampagne zu Abteilung setzen fehlgeschlagen");
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

                $scope.createCampaign = function () {
                        $scope.loadingPromise = campaignService.add($scope.campaigndata).then(function (data) {
                            if (data.success === true) {
                                
                                $scope.nextStep(data);
                            } else {
                                alert(Strings.errors.TECHNISCHER_FEHLER);
                            }


                        });
                    
                };
                
                /**
                 * Nimmt die selektierte Kampagne aus der Liste und fügt Sie der Gruppe hinzu
                 * @returns {undefined}
                 */
            
                $scope.setCampaignFromList = function(){
                    if(!$scope.data.selectedCampaigns || !$scope.data.selectedCampaigns[0]){
                        alert("Bitte eine Kampagne selektieren");
                    }else{
                         groupsService.setCampaign([$scope.config.groupId], $scope.data.selectedCampaigns[0].id).then(function(result){
                                        if(result.success === true){
                                            if($scope.config.entryPoint === "employee_createnew" || $scope.config.entryPoint === "employee_import"){
                                                $scope.config.resultdata.campaignCreated = true; //damit result neu lädt
                                                $scope.config.breadcrumpsdone.push("Kampagne zugewiesen");
                                                $scope.config.currenttoshow = "employee_results";
                                            }else if($scope.config.entryPoint === "group_createnew"){       //gruppe erstellen
                                                $scope.config.resultdata.campaign = $scope.data.selectedCampaigns[0];
                                                $scope.config.resultdata.group.campaignAdded = true;
                                                $scope.config.breadcrumpsdone.push("Kampagne zugewiesen");
                                                $scope.config.currenttoshow = "group_results";
                                            }
                                        }else{
                                            //TODO
                                            alert("Kampagne zu Abteilung setzen fehlgeschlagen");
                                        }
                                    });
                    }
                    
                   
                };



                //liste selektieren
                var updateSelected = function (action, item) {
                    //check if item is already selected
                    var ret = jQuery.grep($scope.data.selectedCampaigns, function (n, i) {
                        return (n.id === item.id);
                    });


                    if (action === 'add' && ret.length === 0) { //falls objekt noch nicht selected dann selektiere
                        $scope.data.selectedCampaigns = [];
                        $scope.data.selectedCampaigns.push(item);

                    }
                    if (action === 'remove' && ret.length > 0) {    //falls selected dann deselektiere


                        $scope.data.selectedCampaigns = [];


                    }

                };

                $scope.updateSelection = function ($event, item) {
                    var checkbox = $event.target;
                    var action = (checkbox.checked ? 'add' : 'remove');
                    updateSelected(action, item);
                };




                $scope.isSelected = function (item) {


                    var ret = jQuery.grep($scope.data.selectedCampaigns, function (n, i) {
                        return (n.id === item.id);
                    });

                    return (ret.length !== 0);
                };



                $scope.rowClicked = function (item) {



                    var id = item.id;
                    var mode = "add";
                    for (var i = 0; i < $scope.data.selectedCampaigns.length; i++) {
                        if (id === $scope.data.selectedCampaigns[i].id) {
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

