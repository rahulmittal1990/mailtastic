'use strict';
// angular.module('mailtasticApp.modal',[]);

angular.module('mailtasticApp.groupSigModal', []).controller("GroupSignatureModalCtrl", 
[   '$scope', 
    '$uibModal', 
    '$log', 
    'groupsService', 
    function ($scope, $uibModal, $log, groupsService) {

    $scope.animationsEnabled = true;
    $scope.open = function (signatureId, step) {
     
        var dataObject = {
            signatureId: signatureId,
            step: step
        };


        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'signature/details/addtogroupmodal/group_signature_modal.html',
            controller: 'GroupSignatureModalCtrlInstanceCtrl',
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

.controller('GroupSignatureModalCtrlInstanceCtrl', 
['$scope', 
    '$modalInstance',
    'dataObject', 
    'groupsService', 
    'browseService', 
    'campaignService', 
    '$log', 
    '$uibModal',
    'alertService', 
    function ($scope, $modalInstance, dataObject, groupsService, browseService, campaignService, $log, $uibModal,alertService) {


            /**
             * Available campaigns for campaign chooser dropdown
             */
            $scope.campaigns = [];
            $scope.data = {
                selectedGroups : [],        //selected groups from list
                groups : []                 //all groups
            };
            $scope.modaloptions = {
                heading: "Neue Abteilung erstellen",
                signatureId: null,
                currentStep: "choose",
                groupId: null
            };
            
            
            /**
            * Used because user can select active campaign when creating new group
            */
            $scope.campaigns = [];
           /**
            * used for title etc when new group is created
            */
            $scope.groupdata = {
                title: '',
                activeSignature : "",
                activeCampaign: "empty"
            };
//            $scope.members = [];

             /**
             * Acitve Gruppe in der Kampagne
             */
            $scope.selectedCampaign = {
                selected: {}
            };

          


            /**
             * Initialize data which is needed
             * @returns {undefined}
             */
            $scope.init = function () {
                $scope.modaloptions.currentStep = dataObject.step;
                
                //if signature id is not provided is should not be possible to create group or select one
                if(!dataObject.signatureId){    
                    alertService.defaultErrorMessage(Strings.errors.DATEN_NICHT_GELADEN);
                    $scope.ok();
                }else{
                    $scope.groupdata.activeSignature = dataObject.signatureId;
                }
                
            };
            $scope.init();

           
           
            /**
             * Load all groups and filter out groups in which the selected signature is already active
             * @returns {undefined}
             */
            $scope.loadGroups = function(){
                if($scope.groupdata.activeSignature && $scope.modaloptions.currentStep === "existing"){
                    groupsService.get().then(function(data){
                        $scope.data.groups = [];
                        for(var i = 0 ; i < data.length ; i++){
                            if(data[i].activeSignature !== $scope.groupdata.activeSignature){
                                $scope.data.groups.push(data[i]);
                            }
                        }
                        
                    });
                }
                
            };
            $scope.loadGroups();



//            $scope.loadMembers = function () {
//                // if(!groupId){
//                // groupId = -1;
//                // }
//                $scope.loadingPromise = groupsService.getPotentialMembers($scope.modaloptions.groupId).then(function (data) {
//
//                    $scope.members = data;
//
//                });
//
//            };
//            $scope.loadMembers();

            $scope.loadCampaigns = function () {

                $scope.loadingPromise = campaignService.get().then(function (data) {
                    $scope.campaigns = data;
                    // Falls die Gruppen ID mit übergeben wird dann werden die Daten der Gruppe geladen zum Bearbeiten
//                    if ($scope.modaloptions.groupId) {		//-1 damit es in der db im backend keine probleme gibt weil ansonsten nach undefined gesuht wird
//                        $scope.modaloptions.heading = "Abteilung bearbeiten";
//                        $scope.loadingPromise = groupsService.getOne($scope.modaloptions.groupId).then(function (data) {
//                            $scope.groupdata = data[0];
//                            if(!data[0].activeCampaign){
//                                $scope.groupdata.activeCampaign = "empty";
//                            }else{
//                                     $scope.groupdata.activeCampaign = data[0].activeCampaign.toString();   //select frisst string
//                        
//                            }
//                            //get name from active campaign
//                            angular.forEach($scope.campaigns, function (value, key) {
//                                if (value.id == $scope.groupdata.activeCampaign) {
//                                    $scope.grou = $scope.campaigns[key];
//                                }
//                            });
//                            $scope.modaloptions.mode = "update";
//                        });
//                    }else
                        
                    if($scope.modaloptions.campaignId){       //neue gruppe erstellen : Kampagne muss schon vorselektiert sein
                        angular.forEach($scope.campaigns, function (value, key) {
                                if (value.id == $scope.modaloptions.campaignId) {
                                    $scope.selectedCampaign.selected = $scope.campaigns[key];
                                }
                            });
                        $scope.groupdata.activeCampaign = $scope.modaloptions.campaignId.toString();
                    }
                });
            };
            $scope.loadCampaigns();

            /**
             * Create new group and assign selected signature
             */
            $scope.createGroup = function () {
                
                //if no campaign selected then set activeCampaign = null
                if (!$scope.groupdata.activeCampaign || $scope.groupdata.activeCampaign === "empty") {  //empty is the value of "choose campaign" option
                   $scope.groupdata.activeCampaign = null;
                }
                
                if(!$scope.groupdata.activeSignature){
                    alertService.defaultErrorMessage(Strings.errors.TECHNISCHER_FEHLER);
                }
                else{
                    $scope.loadingPromise = groupsService.add($scope.groupdata).then(function (data) {
                    if(data.success === true){
                        alertService.defaultSuccessMessage("Die Abteilung " + $scope.groupdata.title + " wurde erfolgreich erstellt und die Signatur für diese Gruppe gesetzt.");
                       
                    }else{
                       alertService.defaultErrorMessage("Die Abteilung " + $scope.groupdata.title + " konnte nicht erstellt werden.");
                    }
                    browseService.reload();
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
             * Signatur für die ausgewählten Gruppen setzen
             * @returns {undefined}
             */
            $scope.setSignatureForGroups = function(){
                if(!$scope.groupdata.activeSignature){
                       alertService.defaultErrorMessage(Strings.errors.TECHNISCHER_FEHLER);
                       $scope.cancel();
                       
                }else if($scope.data.selectedGroups.length === 0){
                    alertService.defaultErrorMessage("Bitte wählen Sie mindestens eine Abteilung aus.");
                }else{
                    var groupIds = [];
                    for(var  i = 0 ;  i < $scope.data.selectedGroups.length ; i++){
                        groupIds.push($scope.data.selectedGroups[i].id);
                    }
                   groupsService.setSignature(groupIds,$scope.groupdata.activeSignature).then(function(data){
                        if(data.success === true){
                            alertService.defaultSuccessMessage("Die Signatur wurde den ausgewählten Abteilungen zugewiesen.");
                        }else{
                            alertService.defaultErrorMessage(Strings.errors.TECHNISCHER_FEHLER);
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