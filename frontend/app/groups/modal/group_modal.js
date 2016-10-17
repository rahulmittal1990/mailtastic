'use strict';
// angular.module('mailtasticApp.modal',[]);
angular.module('mailtasticApp.modalGroup', ['ui.bootstrap']).controller('GroupModalCtrl', ['$scope', '$uibModal', '$log', 'groupsService', function ($scope, $uibModal, $log, groupsService) {

/**
 * Modal is used for
 * -> updating existing group
 * -> add campaign to new group
 * -> add campaign to existing groups from list
 * 
 */

    $scope.animationsEnabled = true;



    $scope.open = function (groupId, campaignId, step) {
        

        var dataObject = {
            campaignId: campaignId,
            groupId: groupId,
            step: step
        };


        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'groups/modal/group_modal.html',
            controller: 'GroupModalInstanceCtrl',
            size: null, //"sm",
             windowClass : "employeeModal",
            resolve: {
                dataObject: dataObject	//wird genutzt wenn gruppe bearbeitet wird
            }
        });

        modalInstance.result.then(function () {
            //$scope.selected = selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.toggleAnimation = function () {
        $scope.animationsEnabled = !$scope.animationsEnabled;
    };

}])

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service used above.

        .controller('GroupModalInstanceCtrl', ['$scope', '$modalInstance', 'dataObject', 'groupsService', 'browseService', 'campaignService', '$log', '$uibModal','alertService', function ($scope, $modalInstance, dataObject, groupsService, browseService, campaignService, $log, $uibModal,alertService) {

            $scope.toggleObjSelection = function ($event, id, isMember, index) {
                $event.stopPropagation();

                $scope.changeMember(id, !isMember, index);
                // console.log('checkbox clicked');
            };


            $scope.membersToRemove = [];
            $scope.membersToAdd = [];



            /**
             * Verfügbare Kampagnen für das Dropdown
             */
            $scope.campaigns = [];
            $scope.data = {
                selectedGroups : [],
                groups : []
            };
            $scope.modaloptions = {
                heading: "Neue Abteilung hinzufügen",
                mode: "create",
                campaignId: null,
                currentStep: "choose",
                groupId: null
            };



            $scope.init = function () {
                $scope.modaloptions.groupId = dataObject.groupId;
                $scope.modaloptions.campaignId = dataObject.campaignId;
                $scope.modaloptions.currentStep = dataObject.step;


            };
            $scope.init();

            $scope.loadingPromise = null;

            /**
             * Acitve Gruppe in der Kampagne
             */
            $scope.selectedCampaign = {
                selected: {}
            };

            $scope.groupdata = {
                title: '',
                activeCampaign: "empty"

            };
            $scope.members = [];



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
            $scope.loadGroups();

            $scope.loadMembers = function () {
                // if(!groupId){
                // groupId = -1;
                // }
                $scope.loadingPromise = groupsService.getPotentialMembers($scope.modaloptions.groupId).then(function (data) {

                    $scope.members = data;

                });

            };
            $scope.loadMembers();

            $scope.loadCampaigns = function () {

                $scope.loadingPromise = campaignService.get().then(function (data) {
                    $scope.campaigns = data;
                    // Falls die Gruppen ID mit übergeben wird dann werden die Daten der Gruppe geladen zum Bearbeiten
                    if ($scope.modaloptions.groupId) {		//-1 damit es in der db im backend keine probleme gibt weil ansonsten nach undefined gesuht wird
                        $scope.modaloptions.heading = "Abteilung bearbeiten";
                        $scope.loadingPromise = groupsService.getOne($scope.modaloptions.groupId).then(function (data) {
                            $scope.groupdata = data[0];
                            if(!data[0].activeCampaign){
                                $scope.groupdata.activeCampaign = "empty";
                            }else{
                                     $scope.groupdata.activeCampaign = data[0].activeCampaign.toString();   //select frisst string
                        
                            }
                            //get name from active campaign
//                            angular.forEach($scope.campaigns, function (value, key) {
//                                if (value.id == $scope.groupdata.activeCampaign) {
//                                    $scope.grou = $scope.campaigns[key];
//                                }
//                            });
                            $scope.modaloptions.mode = "update";
                        });
                    }else if($scope.modaloptions.campaignId){       //neue gruppe erstellen : Kampagne muss schon vorselektiert sein
//                        angular.forEach($scope.campaigns, function (value, key) {
//                                if (value.id == $scope.modaloptions.campaignId) {
//                                    $scope.selectedCampaign.selected = $scope.campaigns[key];
//                                }
//                            });

                        $scope.groupdata.activeCampaign = $scope.modaloptions.campaignId.toString();
                    }
                });
            };
            $scope.loadCampaigns();
            $scope.createGroup = function () {
                if ($scope.groupdata.activeCampaign === "empty") {
                  $scope.groupdata.activeCampaign = null;
                }
                // var members = [];
                // angular.forEach($scope.members, function(value, key) {
                // if(value.isMember === 1 ){
                // members.push(value.id);
                // }
                // });
                $scope.groupdata.membersToRemove = $scope.membersToRemove;
                $scope.groupdata.membersToAdd = $scope.membersToAdd;
                if ($scope.modaloptions.mode === "create") {
                    $scope.loadingPromise = groupsService.add($scope.groupdata).then(function (data) {
                        browseService.reload();

                        //nachdem die Gruppe erstellt wurde wird immer gefragt ob direkt noch mitglieder hinzugefügt werden sollen deshalb wird der employee modal geöffnet
//                        var dataObject = {
//                            employeeId: null,
//                            groupId: data.groupId,
//                            step: "choose"
//                        };
                        alertService.defaultSuccessMessage("Die Abteilung " + $scope.groupdata.title + " wurde erfolgreich erstellt.");
                        $modalInstance.close();
//                        var modalInstanceEmp = $uibModal.open({
//                            animation: $scope.animationsEnabled,
//                            templateUrl: 'employees/modal/employee_modal.html',
//                            controller: 'EmployeeModalInstanceCtrl',
//                            size: "",
//                            resolve: {
//                                dataObject: dataObject
//
//                            }
//                        });
//                        modalInstanceEmp.result.then(function (selectedItem) {
//                            //$scope.selected = selectedItem;
//
//                        }, function () {
//                            $log.info('Modal dismissed at: ' + new Date());
//                        });

                        
                    });
                } else if ($scope.modaloptions.mode === "update") {
                    $scope.loadingPromise = groupsService.update($scope.groupdata).then(function () {
                        browseService.reload();
                              alertService.defaultSuccessMessage("Ihre Änderungen wurden erfolgreich gespeichert.");
                      
                        $modalInstance.close();
                    });
                }
            };


            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
            
            
            
            
            
            /**
             * 
             * @returns {Boolean}List stuff
             */
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
                    $scope.recalcAvatars();
                }
                if (action === 'remove' && ret.length > 0) {    //falls selected dann deselektiere

                    //objekt aus dem array entfernen
                    for (var i = 0; i < $scope.data.selectedGroups.length; i++) {
                        var obj = $scope.data.selectedGroups[i];

                        if (obj.id === item.id) {
                            $scope.data.selectedGroups.splice(i, 1);
                            break;
                        }
                    }

                }
                if ($scope.data.selectedGroups.length === 1) {
                    //die Kampagne muss gesetzt werden
                     $scope.selectedCampaign.selected = {
                                        title:  $scope.data.selectedGroups[0].campaignTitle,
                                        id: $scope.data.selectedGroups[0].campaignId,
                                        color: $scope.data.selectedGroups[0].campaignColor
                                    };
                } else if ($scope.data.selectedGroups.length > 1) {
                        $scope.selectedCampaign.selected = {
                                    };
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
            
            
            
             /**
             * Kampagne für die ausgewählten Gruppen setzen
             * @returns {undefined}
             */
            $scope.setCampaignForGroups = function(){
                if(!$scope.modaloptions.campaignId){
                       alert(Strings.errors.TECHNISCHER_FEHLER);
                        $scope.cancel();
                       
                }else if($scope.data.selectedGroups.length === 0){
                    alert("Bitte wählen Sie zumindest eine Abteilung aus.");
                }else{
                    
                    var groupIds = [];
                    for(var  i = 0 ;  i < $scope.data.selectedGroups.length ; i++){
                        groupIds.push($scope.data.selectedGroups[i].id);
                    }
                   groupsService.setCampaign(groupIds,$scope.modaloptions.campaignId).then(function(data){
                        if(data.success === true){
                            alertService.defaultSuccessMessage("Die Kampagne wurde den ausgewählten Abteilungen zugewiesen.");
                         
                        }else{
                            alert(Strings.errors.TECHNISCHER_FEHLER);
                        }
                        browseService.reload();
                        $scope.cancel();
                    });
                    
                }
              
                
            };
        }]);



function alert(content) {
    bootbox.alert(content);
}