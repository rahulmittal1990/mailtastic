'use strict';
angular.module('mailtasticApp.employees')



        .controller('EmployeeDetailsCtrl', ['$stateParams', '$scope', 'employeeService', '$state', 'browseService','signatureHelperService','$q','alertService','$sce','signatureService',
        function ($stateParams, $scope, employeeService, $state, browseService, signatureHelperService, $q,  alertService, $sce, signatureService) {

                $scope.Math = window.Math;

                //alert( $stateParams['employeeId']);
                $scope.employeeDetailData = {};


                $scope.rightSideContent.showEmployee = false;
                $scope.rightSideContent.showGroup = false;


                //in diesem screen wird rechts keine seitenleiste gezeigt
                $scope.customstyle.maincontentstyle = {
                    'margin-right': 0
                };
                
                //model for SignatureData
                $scope.signatureData = {
                    preview : "",
                    sigStatus : ""
                };

                $scope.initData = function () {


//                  var deferred = $q.defer();
                    //check if employee is in selected list


                    
                    //check if employee was already loaded
//                    var found = false; //wenn später noch bei -1 wurde nichts gefunden
//                    for (var i = 0; i < $scope.data.selectedEmployees.length; i++) {
//                        if ($scope.data.selectedEmployees[i].id === employeeToGet) {
//                            found = true;
//                            $scope.employeeDetailData = $scope.data.selectedEmployees[i];
//                            $scope.selected.selectedGroupForEmp = $scope.employeeDetailData.currentGroup.toString();
//                            break;
//                        }
//
//                    }
//                    if (found === false) {
//                        for (var i = 0; i < $scope.data.employees.length; i++) {
//                            if ($scope.data.employees[i].id === employeeToGet) {
//                                found = true;
//                                $scope.employeeDetailData = $scope.data.employees[i];
//                                $scope.selected.selectedGroupForEmp = $scope.employeeDetailData.currentGroup.toString();
//                                break;
//                            }
//
//                        }
//
//                    }


                    
                    //check if employee id was provided
                    var employeeToGet = $stateParams['employeeId'];
                    if (!employeeToGet) {
                        employeeToGet = $scope.employeeId;
                    } else {
                        $scope.employeeId = $stateParams['employeeId'];
                    }


                    if (employeeToGet) {
                        //TODO
                        //daten für group laden 
                        
                        
                        
                        //load data for employee
                        employeeService.getOne(employeeToGet).then(function (data) {
                            
                            data = data[0];     //because array is returned
                            if (data && data.email && data.id) {
                                $scope.employeeDetailData = data;
                                $scope.selected.selectedGroupForEmp = $scope.employeeDetailData.currentGroup.toString();
                                $scope.recalcAvatars();
                                return $q.resolve(true);
                               
                            } else {
                                alert(Strings.errors.DATEN_NICHT_GELADEN);
                                $state.go("base.employees.employeelist", {}, {reload: true});
                                return $q.reject("employee could not be loaded");
                            }

                        })
                        .then(function(){
                            //if there is an active Signature generate HTML Preview
                            if($scope.employeeDetailData.signatureTitle){
                                 return signatureHelperService.getRelevantDataForSignature(employeeToGet, $scope.employeeDetailData.signatureId, "rolledOut");
                            }else{
                                //end init Data
                                return $q.reject();  
                            }
                        }).then(
                            function resolve(){
                                var htmlSignature = signatureHelperService.generatePreviewComplete(employeeToGet);
                                $scope.signatureData.preview =  $sce.trustAsHtml(htmlSignature);
                                
                                $scope.signatureData.sigStatus =  signatureHelperService.getHasUserLatestSignature($scope.employeeDetailData, "employee");
                                
                                
                            },
                            function reject(){
                                //do nothing only end init Data
                                
                            }).catch(function(e){    //something went wrong
                                alertService.defaultErrorMessage(Strings.errors.DATEN_NICHT_GELADEN);
                                
                            });
                        
                        ;


                    }
                    
                   $scope.recalcAvatars();

//                  return deferred.promise;
                };



                $scope.initData();

                /**
                 * A dedicated function because there is no button attached to the select box and if the user cancels the old value has to be shown on select box
                 */
                $scope.groupChanged = function (oldValue) {

                    var newgroup = $scope.selected.selectedGroupForEmp;

                    bootbox.confirm({
                        size: 'small',
                        message: 'Möchten Sie die Abteilung wirklich ändern?',
                        callback: function (result) {
                            if (result === true) {
                                var user = [];
                                user.push($scope.employeeDetailData.id);
                                employeeService.moveToGroup(user, newgroup).then(function (data) {
                                    if (data.success === true) {
                                        alert("Die Abteilung wurde erfolgreich geändert.");
                                        browseService.reload();
//                                    $scope.reInitData($scope.employeeDetailData.id);      //only data in detail view should be reloaded
                                    } else {
                                        browseService.reload();
                                        alert("Die Abteilung konnte nicht geändert werden. Bitte wenden Sie sich an den Support falls weiterhin Probleme auftreten sollten.");
//                                    $scope.reInitData($scope.employeeDetailData.id);     //only data in detail view should be reloaded
                                    }
                                });
                            } else {
                                $scope.$apply(function () {
                                    $scope.selected.selectedGroupForEmp = oldValue;

                                });
                            }
                        }
                    });


                };
                
                
                /**
                 * Rollout Signature for single employee
                 * Only him gets the latest signature
                 * Mostly used when data for employee has changed for example
                 * @returns {undefined}
                 */
                $scope.rolloutSignature = function(){
                    if(!$scope.employeeDetailData.id){
                        alertService.defaultErrorMessage(Strings.errors.DATEN_NICHT_GELADEN);
                        $scope.initData();
                    }else{
                        signatureService.rolloutEmployee($scope.employeeDetailData.id).then(function(data){
                            if(data.success !== true){
                                alertService.defaultErrorMessage(Strings.errors.DATEN_NICHT_GELADEN);
                            }else{
                                alertService.defaultSuccessMessage("Erinnerungen wurden versendet.");
                            }
                               //reload all data
                               $scope.initData();
                        });
                    }
                };



            }])


        .filter('status', function () {
            return function (campaigns, mode) {
                if (mode === "all") {
                    return campaigns;
                }
                var ret = [];
                angular.forEach(campaigns, function (value, key) {

                    if (value.status === mode) {
                        ret.push(value);
                    }
                });

                return ret;

            };
        });

