'use strict';

angular.module('mailtasticApp.assistant')
        .controller('EmpAssistantCtrl', 
[
    '$scope', 
    'employeeService', 
    'paymentService', 
    'alertService', 
    'assistantconfigService', 
    'groupsService', 
    '$q', 
    'campaignService', 
    'XLSXReaderService',
    '$state' ,
    '$uibModal',
    'signatureService',
    'employeeImportService',
    function ($scope, employeeService, paymentService, alertService, assistantconfigService, groupsService, $q, campaignService, XLSXReaderService,$state,$uibModal, signatureService, employeeImportService) {
              

                $scope.data = {
                    selectedEmployees: [],
                    employees: [],
                    groups: [],
                };

                $scope.employeedata = {
                    email: '',
                    firstname: '',
                    lastname: '',
                    currentGroup: "empty"  //-1 kann als id niemals kommen
                };

                $scope.config = {
                };

                 


                $scope.abort = function(){
                    alertService.assistantAbortEmployeee($scope.config.resultdata, function(){
                        $state.go("base.employees.employeelist");
                        
                    }, function(){
                        
                    });
                    
                };

                $scope.showOtherImportPos = function(){
                    alertService.otherImportPos();

                };

                //is needed because initData is called once when state is initialized
                $scope.$watch('config.currenttoshow', function (newValue, oldValue) {
//                if (newValue !== oldValue) {
//                    $log.log('Changed!');
//                }

                   
                    if (newValue === "employee_createnew" || newValue === "employee_import" || newValue === "employee_selectexisting") {
                        
                        $scope.data.selectedEmployees = []; //immer wieder null setzen
                        
                        if(newValue === "employee_selectexisting"){
                            //filter employeees on base of group
                            $scope.loadEmployees().then(function (data) {
                                   
                                    var groupId = $scope.config.groupId || $scope.config.resultdata.group.id;
                                    var filteredEmps = [];
                                    for(var i = 0 ; i < $scope.data.employees.length ; i++){
                                        if($scope.data.employees[i].currentGroup != groupId){
                                            filteredEmps.push($scope.data.employees[i]);
                                        }
                                    }
                                    $scope.data.employees = filteredEmps;
                                    
                                });
                            
                        };
                        if(newValue === "employee_createnew"){
                            $scope.employeedata.email = "";
                            $scope.employeedata.firstname = "";
                            $scope.employeedata.lastname = "";
                             
                            
                        };
                        
                        
                        if($scope.config.entryPoint === "employee_createnew" ||  $scope.config.entryPoint === "employee_import"){      //im mitarbeiter hinzufügen prozess
                            if ( $scope.config.resultdata.groupCreated === true) {
                                $scope.loadGroups().then(function () {
                                    $scope.employeedata.currentGroup = $scope.config.groupId.toString();
                                    
                                });
                            }
                             
                        } else if($scope.config.entryPoint === "campaign_createnew"){          //im Kampagne erstellen prozess
                               
                                
                                //Neue Gruppe wurde erzeugt
                                if($scope.config.resultdata.group && $scope.config.resultdata.group.id){
                                    
                                     $scope.loadGroups().then(function(){
                                          //Neue gruppe wurde erzeugt, daher gruppen Wählen bereich ausblenden
                                          $scope.employeedata.currentGroup = $scope.config.resultdata.group.id.toString();
                                          $scope.config.disableGroupArea = true;
                                         
                                     }); //gruppen noch ma laden das immer aktuelle in der LIste
                                    
                                   
                                }
                              
                                //Gruppe wurden vorhanden ausgewählt
                                //nur die gruppen, die gewählt wurden dürfen auswählbar sein
                                if($scope.config.resultdata.campaign.multipleGroups === true){  
                                    $scope.data.groups = $scope.config.resultdata.campaign.groupsSet;
                                    $scope.config.disableGroupArea = false;          
                                    
                                    //es darf hier keine neue Grupper erzeugt werden weil sonst der Workflow unterbrochen ist
                                    $scope.disableNewGroupButton = true;          
                                }
                               
                                $scope.config.breadcrumps = ["Mitarbeiter hinzufügen"];;
                               
                        }else if($scope.config.entryPoint === "group_createnew"){          //im Kampagne erstellen prozess
                               
                                
                                //Neue Gruppe wurde erzeugt
                                if($scope.config.resultdata.group && $scope.config.resultdata.group.id){
                                    
                                     $scope.loadGroups().then(function(){
                                          //Neue gruppe wurde erzeugt, daher gruppen Wählen bereich ausblenden
                                          $scope.employeedata.currentGroup = $scope.config.resultdata.group.id.toString();
                                          $scope.config.disableGroupArea = true;
                                         
                                     }); //gruppen noch ma laden das immer aktuelle in der LIste
                                    
                                   
                                }
                              
                                $scope.config.breadcrumps = ["Mitarbeiter hinzufügen"];;
                               
                        }
                        
                        
                      
                    } else if (newValue === "employee_results") {
                        if ($scope.config.resultdata.campaignCreated === true) {
                            $scope.showResults();
                        }
                    }
                });


            /**
             * sendet eine testmail an den Admin
             * @returns {undefined}
             */
                $scope.sendExampleMail = function(){
                   employeeService.sendInvitationTestmail().then(function(data){
                       if(data.success === true){
                           alert("Wir haben Ihnen eine Beispiel-Einladungs-E-Mail gesendet.");
                       }else{
                            alert(Strings.errors.DATEN_NICHT_GELADEN);
                       }
                   },function(error){
                        alert(Strings.errors.DATEN_NICHT_GELADEN);
                   });
                    
                };

                /**
                 * Werden gebraucht wenn ein neuer erstellt wird muss die gruppe ausgwählt werden
                 */
                $scope.loadGroups = function () {
                    return $q(function (resolve, reject) {
                        $scope.config.loadingPromise = groupsService.get().then(function (data) {
                            $scope.data.groups = data;
                            resolve(true);
                        });
                    });
                };
                
                 /**
                 * Werden gebraucht wenn ein neuer erstellt wird muss die gruppe ausgwählt werden
                 */
                $scope.loadEmployees = function () {
                    return $q(function (resolve, reject) {
                          $scope.config.loadingPromise = employeeService.get().then(function (data) {
                            $scope.data.employees = data;
                            $scope.recalcAvatars();
                            resolve(true);
                        });
                    });
                };


                $scope.navigateBack = function(){
                    if($scope.config.currenttoshow  === "employee_createnew"  ||  $scope.config.currenttoshow === "employee_import" || $scope.config.currenttoshow === "employee_selectexisting"){
                        if($scope.config.entryPoint === "employee_createnew"  ||  $scope.config.entryPoint === "employee_import"){
                            $state.go("base.employees.employeelist");
                        }else if($scope.config.entryPoint === "campaign_createnew"){
                            $scope.config.currenttoshow  = "campaign_results";
                        }else if($scope.config.entryPoint === "group_createnew"){
                            $scope.config.currenttoshow  = "group_results";
                        }
                    }
                };

                $scope.createEmployee = function () {
//                if ($scope.employeedata.group) {
//                    $scope.employeedata.currentGroup = $scope.selectedGroup.selected.id;
//                }
                    if ($scope.employeedata.currentGroup === "empty") {
                        alert("Bitte wählen Sie die Abteilung aus, der der neue Mitarbeiter hinzugefügt werden soll.");
                        return;
                    }
                    
                    for(var i = 0 ; i < $scope.data.employees.length ; i++){
                        if($scope.data.employees[i].email === $scope.employeedata.email){
                            alert("Es existiert bereits ein Mitarbeiter mit der angegebenen E-Mail-Adresse. Bitte überprüfen Sie Ihre Eingaben. Ihr Abonnement hat sich nicht geändert.");
                       
                            return;
                        }
                    }
                    

                    //check if employee can be added and show modal
                    paymentService.getUserStatus().then(function (data) {
                        if (data.success === false) {     //fehler
                            alert(Strings.errors.DATEN_NICHT_GELADEN);
                        } else {
                           
                            if (data.forceAllow == true) { //manuell freigeschaltet
                                //continue
                                //alert("HAS FORCE");
                                creation(true);
                            } else if (data.hasTestTime === true) {    //noch im test
                                //einfach weiter machen
                                //alert("HAS TESTTIME");
                                creation(true);
                            } else if (data.hasSubscription === true) {    //ist zahlkunde
                                if (data.amountOfFreeMembers > 0) {   //hat noch freie
                                    //alert("HAS FREE MEMBERS");
                                    creation(true);
                                } else {      //hat keine freien mitarbeiter mehr
                                    //alert("HAS NO FREE MEMBERS");
                                    
                                    
                                           alertService.addemployee({amount: 1, firstname: $scope.employeedata.firstname, lastname: $scope.employeedata.lastname, billing_interval :data.billing_interval, customPrice : data.customPrice }, creation, function () {
                                           });
                                    
                                   
                                }
                            } else {
                                //muss erst eine subscription abschließen
                                //alert("Sie müssen zuerst Ihre Zahlungsdaten angeben, um weitere Mitarbeiter hinzufügen zu können.");
                                
                                  var modalInstance = $uibModal.open({
                                    animation: true,
                                    templateUrl: "booking/accountexpiredmodal/modals/unallowed_action_modal.html",
                                    controller: 'AccountExpiredModalInstanceCtrl',
                                    size: "lg",
                                    windowClass : "expiredmodalcontainer"
                                });
                                
                            }
                        }
                    });
                 
                    function creation(force) {
                        
                        if(!$("#createempmodalcheckbox").prop("checked") && (force !== true)){
                            return false;
                        }
                        
                        
                        if ($scope.employeedata.currentGroup === "empty") {
                            $scope.employeedata.currentGroup = null;
                        }
                       $scope.config.loadingPromise = employeeService.add($scope.employeedata).then(function (data) {
                            if (data.success === false && data.code === 1) {
                                alert("Es existiert bereits ein Mitarbeiter mit der angegebenen E-Mail-Adresse. Bitte überprüfen Sie Ihre Eingaben. Ihr Abonnement hat sich nicht geändert.");
                            } else if (data.success === false) {
                                alert(Strings.errors.TECHNISCHER_FEHLER);
                            }
                            else  {
                                
                                //add employees to the array where all the newly added employee ids are stored to send invitation mail afterwards
                                $scope.config.resultdata.employee.idsAdded.push(data.id);
                                
                                $scope.config.resultdata.employee.amountOfImported = 1;
                               
                               if($scope.config.entryPoint === "campaign_createnew"){
                                   if($scope.config.resultdata.campaign.amountOfMembersGroupsSet == null){
                                            $scope.config.resultdata.campaign.amountOfMembersGroupsSet = 0;
                                        }else if($scope.config.resultdata.campaign.amountOfMembersGroupsSet === 0){
                                            $scope.config.breadcrumpsdone.push("Mitarbeiter hinzugefügt"); //abgeschlossenes Breadcrump
                                        }
                                       $scope.config.resultdata.campaign.amountOfMembersGroupsSet += 1;
                                       
                                       $scope.config.resultdata.campaign.newEmpsIncluded = true;    //es wurde ein mitarbeiter zur Abteilung hinzugefügt, Abteilungsname
                                     $scope.config.resultdata.campaign.createdNew = true;
                                       //get name of Group in which the emp was added to
                                       var groupTitle = "";
                                       for(var i = 0 ;  i < $scope.data.groups.length ; i++){
                                           if($scope.data.groups[i].id == $scope.employeedata.currentGroup){
                                              groupTitle =  $scope.data.groups[i].title;
                                              break;;
                                           }
                                       }
                                         $scope.config.resultdata.campaign.newEmpsIncludedInGroupTitle = groupTitle;
                                        
                                         
                                       
                               }else if($scope.config.entryPoint === "group_createnew"){
                                   if($scope.config.resultdata.group.amountOfEmployeesAdded === 0){
                                       $scope.config.breadcrumpsdone.push("Mitarbeiter hinzugefügt");
                                   }
                                   $scope.config.resultdata.group.amountOfEmployeesAdded += 1;
                               }else{
                                     $scope.config.breadcrumpsdone.push("Mitarbeiter hinzugefügt");
                               }
                               
                               
                               paymentService.syncEmployees().then(function (data) {
                                    if (data === true) {
//                                        alert("Ihre Gebührt hat sich nun um 3 Euro monatlich erhöhrt.");
                                    } else {
//                                        alert("Ihre Gebührt hat sich nicht erhöht, da Ihre Anzahl an Mitarbeitern noch in Ihrem kostenlosen Kontingent liegt.");
                                    }
                                   
                                });
                                
                                 $scope.nextStep();
                            }
                        });
                    }
                };


                /**
                 * Send invitation mail to all new added employees
                 * @returns {undefined}
                 */
                $scope.inviteMembers = function(){
                    
                    
                    $scope.config.inviteMembers();
                    

                };


                //hier wird bestimmt wie es weiter geht
                $scope.nextStep = function () {
                    if ($scope.config.entryPoint === "employee_createnew" || $scope.config.entryPoint === "employee_import") {
                        //check if group has campaign
                        $scope.showResults();       //Ergebnisseite anzeigen
                    }
                    else if ($scope.config.entryPoint === "campaign_createnew" ) {
                        //check if group has campaign
                        $scope.config.currenttoshow = "campaign_results";       //Ergebnisseite anzeigen
                    } else if ($scope.config.entryPoint === "group_createnew" ) {
                        //check if group has campaign
                        $scope.config.currenttoshow = "group_results";       //Ergebnisseite anzeigen
                        $scope.config.resultdata.group.employeesAdded = true;
                    }

                };


                $scope.resultdata = {
                    campaign: null,
                    group: null


                };

                //holt die Daten für die Ergebnis seite
                $scope.showResults = function () {
                    $scope.config.currenttoshow = "employee_results";
                    //setzen welche Gruppe benutzt wurde damit beim kampagnen erstellen diese verwendet werden kann
                    $scope.config.groupId = $scope.employeedata.currentGroup;
                    //load current group data
                    groupsService.getOne($scope.employeedata.currentGroup).then(function (group) {
                        $scope.config.resultdata.group = group[0];
                        
                        //signature AND campaign is set
                        if($scope.config.resultdata.group.activeCampaign && $scope.config.resultdata.group.activeSignature){
                              $scope.config.breadcrumps = ["Mitarbeiter informieren"];
                               campaignService.getOne($scope.config.resultdata.group.activeCampaign).then(function (campaign) {
                                $scope.config.resultdata.campaign = campaign;
                                 $scope.config.resultdata.signature.signatureAssigned = true;
                                  $scope.config.resultdata.signature.signatureAssignedTitle = $scope.config.resultdata.group.signatureTitle;
                            });
                        }else if($scope.config.resultdata.group.activeCampaign || $scope.config.resultdata.group.activeSignature){  //signature OR campaign is set
                            if($scope.config.resultdata.group.activeCampaign){
                                campaignService.getOne($scope.config.resultdata.group.activeCampaign).then(function (campaign) {
                                    $scope.config.resultdata.campaign = campaign;
                                });
                            }
                            if($scope.config.resultdata.group.activeSignature){
                                $scope.config.resultdata.signature.signatureAssigned = true;
                                $scope.config.resultdata.signature.signatureAssignedTitle = $scope.config.resultdata.group.signatureTitle;
                                
                            }
                            $scope.config.breadcrumps = ["Kampagne / Signatur zuweisen"];
                        }else{
                            //WHAT TO DO???
                             $scope.config.breadcrumps = ["Kampagne / Signatur zuweisen"];
                        }
                        
                        
                        
//                        //falls es eine Kampagne gibt, deren Daten auchladen
//                        if ($scope.config.resultdata.group.activeCampaign) {
//                            $scope.config.breadcrumps = ["Mitarbeiter informieren"];
//                            campaignService.getOne($scope.config.resultdata.group.activeCampaign).then(function (campaign) {
//                                $scope.config.resultdata.campaign = campaign;
//                            });
//                        }else{
//                              $scope.config.breadcrumps = ["Kampagne / Signatur zuweisen"];
//                        }
//                        if($scope.config.resultdata.group.activeSignature){
//                            
//                            
//                        }
//                        else{
//                              $scope.config.breadcrumps = ["Kampagne / Signatur zuweisen"];
//                        }
                    });
                };

                $scope.initData = function () {
                    var defered = $q.defer();
                    //gruppen laden
                    $scope.loadGroups().then(function () {

                    });

                    //config laden
                    $scope.config = assistantconfigService;
                    
                    
                    //clear array were added ids are stored
                    $scope.config.resultdata.employee.idsAdded = [];
                    

                    if($scope.config.currenttoshow === "employee_createnew"){
                        $scope.config.breadcrumps.push("Mitarbeiter hinzufügen");
                    }else if($scope.config.currenttoshow === "employee_import"){
                        $scope.config.breadcrumps.push("Mitarbeiter importieren");
                    }
                    
                   
                    
                    employeeService.get().then(function (data) {
                        $scope.data.employees = data;
                        $scope.recalcAvatars();
                    });

                    return defered.promise;
                };


                //öfnet die Seite um eine neue Gruppe zu erstellen
                $scope.createGroup = function () {
                    $scope.config.currenttoshow = "group_createnew";
                    //assistantconfigService.currenttoshow = "group_createnew";
                };


                $scope.addAnotherEmployee = function (mode) {

                    //reset createdGroup
                    $scope.config.resultdata.groupCreated = false;

                    employeeService.get().then(function (data) {
                                $scope.data.employees = data;
                                $scope.recalcAvatars();
                    });

                    //reset employeedata
                    $scope.employeedata.email = "";
                    $scope.employeedata.firstname = "";
                    $scope.employeedata.lastname = "";
                    $scope.config.breadcrumpsdone = []; //reset breadcrumps
                    if (mode === "new") {
                        $scope.config.currenttoshow = "employee_createnew";
                         $scope.config.breadcrumps = ["Mitarbeiter hinzufügen"];
                    } else {
                        $scope.config.currenttoshow = "employee_import";
                         $scope.config.breadcrumps = ["Mitarbeiter importieren"];
                    }
                };


                //show screen to set a campaign for newly added users eg their group
                $scope.setCampaign = function (mode) {
                    $scope.config.currenttoshow = "campaign_createnew";
                    if (mode === "new") {
                        $scope.config.currenttoshow = "campaign_createnew";
                    } else if (mode === "existing") {
                        $scope.config.currenttoshow = "campaign_selectexisting";
                    }
                };
                
                
                
                //open screen to assign a signature to the group where the employees were added
                $scope.setSignature = function(mode){
                      $scope.config.currenttoshow = "signature_selectexisting";
                    
                };
                
//Importieren

//upload data
//                $scope.importdata = {
//                    json: [],
//                    amountOfEmployees: null,
//                    filename: ""
//                };
                $scope.fileChanged = function (files) {
                   if($scope.employeedata.currentGroup === "empty"){
                       alertService.defaultErrorMessage("Bitte wählen Sie die Abteilung aus, der die neuen Mitarbeiter hinzugefügt werden sollen.");
                       document.getElementById('employeeimport').value = null; //reset file input
                   }else{
                         employeeImportService.fileChanged(files)
                              .then(function(){
                                  return employeeImportService.checkImportData($scope.config.loadingPromise );
                                  
                              })
                              .then(function(){
                                  return employeeImportService.importUsers($scope.employeedata.currentGroup,$scope.config, $scope.loadingPromise);
                              }).then(function(){
                                  $scope.processAfterImport();
                              })
                            .catch(function(e){ //do nothing in catch block because all error messages are correctly shown by import service


                            });

                   }
//                    
                    
                };



                /**
                 * 
                 * @returns {undefined}
                 */
                $scope.processAfterImport = function(){
                     //im kampagne workflow
                     
                     
                     
                                    if($scope.config.entryPoint === "campaign_createnew"){
                                        if($scope.config.resultdata.campaign.amountOfMembersGroupsSet == null){
                                            $scope.config.resultdata.campaign.amountOfMembersGroupsSet = 0;
                                        }else if($scope.config.resultdata.campaign.amountOfMembersGroupsSet === 0){
                                            $scope.config.breadcrumpsdone.push("Mitarbeiter eingeladen"); //abgeschlossenes Breadcrump
                                        }
                                            $scope.config.resultdata.campaign.amountOfMembersGroupsSet += amountOfImported;
                                          $scope.config.resultdata.campaign.newEmpsIncluded = true;    //es wurde ein mitarbeiter zur Abteilung hinzugefügt, Abteilungsname
                                     
                                       //get name of Group in which the emp was added to
                                       var groupTitle = "";
                                       for(var i = 0 ;  i < $scope.data.groups.length ; i++){
                                           if($scope.data.groups[i].id == $scope.employeedata.currentGroup){
                                              groupTitle =  $scope.data.groups[i].title;
                                              break;;
                                           }
                                       }
                                         $scope.config.resultdata.campaign.newEmpsIncludedInGroupTitle = groupTitle;
                                    }else if($scope.config.entryPoint === "group_createnew"){
                                        if($scope.config.resultdata.group.amountOfEmployeesAdded === 0){
                                            $scope.config.breadcrumpsdone.push("Mitarbeiter eingeladen"); //abgeschlossenes Breadcrump
                                        }
                                        $scope.config.resultdata.group.amountOfEmployeesAdded += amountOfImported;
                                        
                                        
                                    }else{
                                           $scope.config.breadcrumpsdone.push("Mitarbeiter eingeladen"); //abgeschlossenes Breadcrump
                                    }
                                
                                $scope.nextStep();
                    
                };

                $scope.importUsers = function () {
                    
                    
                    employeeImportService.importUsers($scope.employeedata.currentGroup,$scope.config, $scope.loadingPromise)
                            .then(function(data){
                                $scope.processAfterImport();
                            }).catch(function(e){
                                 //do nothing in catch block because all error messages are correctly shown by import service
                            });
                    
                    
                    
                };



                /**
                 * Nimmt die selektierte Kampagne aus der Liste und fügt Sie der Gruppe hinzu
                 * @returns {undefined}
                 */
            
                $scope.setEmployeesFromList = function(){
                    if(!$scope.data.selectedEmployees || !$scope.data.selectedEmployees[0]){
                        alert("Bitte einen Mitarbeiter selektieren");
                    }else if($scope.employeedata.currentGroup === "empty"){
                        alertService.defaultErrorMessage("Bitte wählen Sie die Abteilung aus, denen die Mitarbeiter hinzugefügt werden sollen.");
                    }
                    else{
                        
                        var empIds = [];
                        for(var i = 0; i < $scope.data.selectedEmployees.length ; i++){
                            empIds.push($scope.data.selectedEmployees[i].id);
                        }
                        var group= null;
                        group = $scope.config.resultdata.group.id || $scope.employeedata.currentGroup;
                       
                        employeeService.moveToGroup(empIds, group).then(function(result){
                             if(result.success === true){
                                 
                                 
                                //store all the ids that were assigned to group to send invitation later
//                                if(!Array.isArray($scope.config.resultdata.group.employeeIdsAdded)){
//                                    $scope.config.resultdata.group.employeeIdsAdded = [];
//                                }
//                                $scope.config.resultdata.group.employeeIdsAdded.concat(empIds);
                                 
                                if($scope.config.entryPoint === "employee_createnew" || $scope.config.entryPoint === "employee_import"){

                                }else if($scope.config.entryPoint === "campaign_createnew"){
                                    
                                      if($scope.config.resultdata.campaign.amountOfMembersGroupsSet == null){
                                            $scope.config.resultdata.campaign.amountOfMembersGroupsSet = 0;
                                        }else if($scope.config.resultdata.campaign.amountOfMembersGroupsSet === 0){
                                            $scope.config.breadcrumpsdone.push("Mitarbeiter eingeladen"); //abgeschlossenes Breadcrump
                                        }
                                            $scope.config.resultdata.campaign.amountOfMembersGroupsSet += empIds.length;
                                         $scope.config.resultdata.campaign.newEmpsIncluded = true;    //es wurde ein mitarbeiter zur Abteilung hinzugefügt, Abteilungsname
                                     
                                       //get name of Group in which the emp was added to
                                       var groupTitle = "";
                                       for(var i = 0 ;  i < $scope.data.groups.length ; i++){
                                           if($scope.data.groups[i].id == $scope.employeedata.currentGroup){
                                              groupTitle =  $scope.data.groups[i].title;
                                              break;;
                                           }
                                       }
                                         $scope.config.resultdata.campaign.newEmpsIncludedInGroupTitle = groupTitle;
                                    $scope.config.currenttoshow = "campaign_results";
                                   
                                }else if($scope.config.entryPoint === "group_createnew"){
                                    if($scope.config.resultdata.group.amountOfEmployeesAdded === 0){
                                          $scope.config.breadcrumpsdone.push("Mitarbeiter hinzugefügt");
                                    }
                                  
                                    $scope.config.resultdata.group.amountOfEmployeesAdded += empIds.length;
                                    $scope.config.currenttoshow = "group_results";
                                }
                            }
                            else{
                                            //TODO
                                 alert("Kampagne zu Gruppe setzen fehlgeschlagen");
                            }
                            
                        });
                        
                       
                    }
                    
                   
                };

//LISTEN FUNKTIONEN----------------------------------

                $scope.isSelectedAll = function () {
                    return $scope.data.selectedEmployees.length === $scope.data.employees.length;
                };
                $scope.selectAll = function ($event) {
                    var checkbox = $event.target;
                    var action = (checkbox.checked ? 'add' : 'remove');
                    for (var i = 0; i < $scope.data.employees.length; i++) {
                        var entity = $scope.data.employees[i];
                        updateSelected(action, entity);
                    }
                };
                $scope.selectAllOuter = function () {
                    var action = ($scope.data.selectedEmployees.length === $scope.data.employees.length ? 'remove' : 'add');
                    for (var i = 0; i < $scope.data.employees.length; i++) {
                        var entity = $scope.data.employees[i];
                        updateSelected(action, entity);
                    }
                };

                $scope.recalcAvatars = function () {
                    $(document).trigger("regenerateAvatars");
                };
                //liste selektieren
                var updateSelected = function (action, item) {
                    //check if item is already selected
                    var ret = jQuery.grep($scope.data.selectedEmployees, function (n, i) {
                        return (n.id === item.id);
                    });


                    if (action === 'add' && ret.length === 0) { //falls objekt noch nicht selected dann selektiere

                        $scope.data.selectedEmployees.push(item);

                    }
                    if (action === 'remove' && ret.length > 0) {    //falls selected dann deselektiere
                        //objekt aus dem array entfernen    WIRD NUR BEI MULTI SELECT GEBRAUCHT
                        for (var i = 0; i < $scope.data.selectedEmployees.length; i++) {
                            var obj = $scope.data.selectedEmployees[i];

                            if (obj.id === item.id) {
                                $scope.data.selectedEmployees.splice(i, 1);
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


                    var ret = jQuery.grep($scope.data.selectedEmployees, function (n, i) {
                        return (n.id === item.id);
                    });

                    return (ret.length !== 0);
                };



                $scope.rowClicked = function (item) {



                    var id = item.id;
                    var mode = "add";
                    for (var i = 0; i < $scope.data.selectedEmployees.length; i++) {
                        if (id === $scope.data.selectedEmployees[i].id) {
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

