'use strict';
// angular.module('mailtasticApp.modal',[]);
angular.module('mailtasticApp.employeeEditUserInfoModal', []).controller('EmployeeUserInfoEditModalCtrl', 
[
    '$scope', 
    '$uibModal', 
    '$log', 
    'signatureHelperService',
    function ($scope, $uibModal, $log,  signatureHelperService) {

    //$scope.items = ['item1', 'item2', 'item3'];

    $scope.animationsEnabled = true;

    $scope.open = function (employeeId) {

        var dataObject = {
            employeeId: employeeId,
           
        };

        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'employees/details/employeeDataEditModal/employeeUserInfoEdit_modal.html',
            controller: 'EmployeeUserInfoEditModalInstanceCtrl',
            resolve: {
                dataObject: dataObject
              
            },
            windowClass : "employeeModal"
        });

        modalInstance.result.then(function (selectedItem) {
            //$scope.selected = selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.toggleAnimation = function () {
        $scope.animationsEnabled = !$scope.animationsEnabled;
    };

}])

        .controller('EmployeeUserInfoEditModalInstanceCtrl', 
[
    '$scope', 
    '$modalInstance', 
    'dataObject', 
    'employeeService', 
    'alertService',
    '$uibModal', 
    'signatureHelperService',
    '$q',
    'browseService',
    function ($scope, $modalInstance, dataObject, employeeService,  alertService,$uibModal, signatureHelperService, $q, browseService) {



            $scope.modaloptions = {
                heading: "Neuen Mitarbeiter hinzufügen",
                saveButtonText : "Hinzufügen",
                mode: "create",
                currentStep: "choose",
                cameFromChoose : false,
                groupId : null
            };

            $scope.employeedata = {
                email: '',
                firstname: '',
                lastname: '',
                currentGroup : ""

            };
            
            $scope.data = {
                employees : [],
                selectedEmployees : [],
                userInfoFormFields : []
            };

            $scope.groups = [];

            $scope.showPreview = false;
   

            /**
             * init modal data
             * @returns {undefined}
             */
            $scope.init = function(){
                
              if(dataObject){
                    if(!dataObject.employeeId){
                       alertService.defaultErrorMessage(Strings.errors.DATEN_NICHT_GELADEN);
                    }else{
                                $scope.employeedata.id =dataObject.employeeId;
                                signatureHelperService.loadJsonFieldStructure()   //step 1 : load json field structure to know which fields are existing and which type each field is because image fields are displayed different then link fields for example
                             
                                        .then(function(fields){
                                            signatureHelperService.dataManager.fields = fields;
                                                return $q.resolve();
                                            
                                        })
                                        .then(
                                            function(){//step 2 : load employee data to know the fields
                                                return signatureHelperService.getEmployeeAccountData( $scope.employeedata.id , signatureHelperService.dataManager.fields)
                                                         .then(function(){  
                                                                return $q.resolve();
                                                                }
                                                         );
                                            }
                                         )
                                        .then(
                                            function(){           //step3 prepare the user info fields form
                                                if(!signatureHelperService.dataManager || !signatureHelperService.dataManager.signatureData || !signatureHelperService.dataManager.employeeData || !signatureHelperService.dataManager.fields ){
                                                    return $q.reject("prepare user fields in employee userinfo edit modal: not all data was loaded");

                                                }else{
                                                    try{
                                                        var fieldsToSearch = [
                                                           //fieldStructure.company.groups,     //not necesarry to search in company values because its not possible for employee to edit these fields
                                                           signatureHelperService.dataManager.fields.employee.groups
                                                       ];
                                                        var tagArrayToRet = [];

                                                        for (var x = 0; x < fieldsToSearch.length; x++) {
                                                            var fieldToSearch = fieldsToSearch[x];   //search  fields
                                                            for (var i = 0; i < fieldToSearch.length; i++) {   //search in every group
                                                                for (var u = 0; u < fieldToSearch[i].entries.length; u++) {   //search every element
                                                                   tagArrayToRet.push(fieldToSearch[i].entries[u]);         //build simple array for generating fields afterwords
                                                                }
                                                            }
                                                        }
                                                    }catch(e){
                                                        return $q.reject("getUserFieldsToComplete: exception on iterating over fields");

                                                    }
                                                    $scope.data.userInfoFormFields = tagArrayToRet;

                                                    return $q.resolve();
                                                }
                                            }
                                        )
                                        .catch(function(e){

                                            alertService.defaultErrorMessage(Strings.errors.DATEN_NICHT_GELADEN);

                                        });
                        
                    }
                    
              } 
            };
            $scope.init();
            
            
              /**
                * Save userInfo Data to backend
                * @returns {undefined}
                */
            $scope.saveEmployeeInfoData = function(){
               
              
                    var newEmployeeData = signatureHelperService.prepareDataForBackend("employee", signatureHelperService.dataManager.fields);  //prepare userInfo data to store in backend
                    if(!newEmployeeData){
                        alertService.defaultErrorMessage(Strings.errors.TECHNISCHER_FEHLER);
                    }else{
                        employeeService.setEmployeeInfo($scope.employeedata.id, newEmployeeData).then(function(retdata){
                            if(retdata.success !== true){
                                alertService.defaultErrorMessage(Strings.errors.TECHNISCHER_FEHLER);
                            }else{
                               alertService.defaultSuccessMessage("Ihre Änderungen wurden gespeichert.");
                                 $scope.cancel();     //close modal
                               browseService.reload();      //reload whole page
                             
                            
                            }

                        });
                    }
              
                
                
                
            };
            
            
           
            $scope.loadingPromise = null;

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
            
        }]);
    
    
    function alert(content) {
    bootbox.alert(content);
}