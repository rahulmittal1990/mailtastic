'use strict';
angular.module('mailtasticApp.signature')



        .controller('SignatureDetailsCtrl', [
            '$scope',  
            '$q',
            'signatureService',
            'alertService',
            'employeeService',
            '$state',
            'userService',
            '$http',
            '$sce',
            '$timeout',
            'signatureHelperService',
            'groupsService',
            'paymentService',
            function ($scope, $q,signatureService, alertService, employeeService, $state, userService, $http ,$sce, $timeout, signatureHelperService, groupsService,paymentService) {


               
                $scope.data = {
                  employees : [],
                  selectedEmployee : "",    
                  signatureTpl : "",                //signature tpl
                  signatureStructureData : {},      //marks which fields are locked
                  companyData : {},                 //company data like adress etc,
                  preview : "",
                  signatureTitle : "",
                  signatureId : "",
                  activeInGroups : [],
                  selectedGroups : [],
                  filterText : ""
                };
                
                
                
                
                /**
                 * delete signature
                 * @returns {undefined}
                 */
                $scope.deleteSig = function(){
                    signatureHelperService.deleteSigs($scope.data.signatureId, $scope).then(
                        function resolve(){
                            //go to signature list
                            $state.go("base.signaturelist");
                        
                        },
                        function reject(){
                            
                            
                        });
                };
                
                /**
                 * Open Signature Designer
                 * @returns {unresolved}
                 */
                $scope.editSignature = function(){
                      $state.go('base.signaturedesigner', {signatureId: $scope.data.signatureId});
                };

          
                
                
                
//                 /**
//                    * Overwrites obj1's values with obj2's and adds obj2's if non existent in obj1
//                    * Used to combine employee and company data. Also used to make one object out of SignatureData (isLocked value)
//                    * @param obj1
//                    * @param obj2
//                    * @returns obj3 a new object based on obj1 and obj2
//                    */
//                   function merge_options(obj1,obj2){
//                       var obj3 = {};
//                       for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
//                       for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
//                       return obj3;
//                   };
//                
                
                 /**
                 * Get Data and merge with signature editor and mark missing data flag (with red buttons)
                 * @returns {undefined}
                 */
                $scope.generatePreview = function () {
                    
                    var resultHtml = signatureHelperService.generatePreviewComplete($scope.data.selectedEmployee);
                   $scope.data.preview = $sce.trustAsHtml(resultHtml);

                };
                
                
                
                
                
                /**
                 * load employee data to map with signature placeholders
                 * @returns {$q@call;defer.promise}
                 */
                $scope.getEmployeeAccountData = function(){
                    var deferred = $q.defer();
                    
                    //check if id is available
                   if(!$scope.data.selectedEmployee ){   //get selected ID from Preview field
                        return deferred.reject();
                   }
                    employeeService.getOne($scope.data.selectedEmployee).then(function(data){
                        if(!data || !data.length === 0){
                            deferred.reject();
                        }else if(!data[0].userInfo){   //no employee info is set in backend so we have to set initial employee info
                            var employeeId = $scope.data.selectedEmployee;       //get selected employee
                            if(!employeeId){
                                  deferred.reject("Mitarbeiter Daten konnten nicht vorbereitet werden.");   
                            }else{
                                
                                    var data = $scope.emptyEmployeeData;    //use empty employee data which is prepared when loading structure from json
                                    employeeService.setEmployeeInfo( employeeId, data).then(function (data) {
                                        if (data.success === true) {
                                            $scope.data.employeeData = $scope.emptyEmployeeData;
                                            deferred.resolve();
                                        } else {
                                             deferred.reject("EmployeeInfo speichern war nicht erfolgreich.");
                                        }
                                              
                                    });
                            }
                        }else{  //employee info is loaded so merge with field structure
                             $scope.data.employeeData =JSON.parse(data[0].userInfo);        //set employee data from data in backend
                            deferred.resolve();   
                        }
                        
                    });
                    return deferred.promise;
                    
                    
                };
                
                
//               /**
//                 * load company data use for generating preview of signature
//                 * @returns {$q@call;defer.promise}
//                 */
//                $scope.getCompanyAccountData = function(){
//                    
//                    var deferred = $q.defer();
//                    
//                     userService.getAccountData()
//                                .then(function (data) {
//                                    if (!data) {
//                                        alert(Strings.errors.DATEN_NICHT_GELADEN);
//                                    } else {
//                                      //company data must be there because it is created when opening the signature designer
//                                            try {
//                                               $scope.data.companyData = JSON.parse(data.companyInfo);
//                                               deferred.resolve();
//
//                                            } catch (e) {
//                                                deferred.reject();
//                                            }
//                                    }
//                                }).catch(function(data){
//                                     deferred.reject();
//                                    
//                                });
//                    
//                    return deferred.promise;
//                };
                
                

                $scope.initData = function(){
                    
                    //check if signatureID
                    if(!$state.params.signatureId){
                         alertService.defaultErrorMessage(Strings.errors.DATEN_NICHT_GELADEN);
                         return;
                    }
                    $scope.data.signatureId = $state.params.signatureId;
                    
                        /**
                         * load employees for preview
                         * @returns {unresolved}
                         */
                      /**
                         * load employees for preview
                         * @returns {unresolved}
                         */
                        function getEmployees() {

                        var deferred = $q.defer();

                          employeeService.get().then(function (data) {
                                  if(data && Array.isArray(data) && data.length > 0){
                                       $scope.data.employees = data;
                                      $scope.data.selectedEmployee = $scope.data.employees[0].id;  //select first employee on init
                                      deferred.resolve();
                                  }else{
                                       deferred.reject("no employees could be loaded");
                                  }


                              }, function () {
                                  deferred.reject();
                              });



                          return deferred.promise;
                    }
                  
                  
                  
                  /**
                   * fetch new employee data and generate preview
                   * @returns {undefined}
                   */
                  $scope.updateSelectedUser = function(){
                      
                      signatureHelperService.getEmployeeAccountData($scope.data.selectedEmployee, $scope.data.fields).then(
                      function(){
                          
                          $scope.generatePreview();
                      },
                      function(e){
                          
                          $scope.initData();
                      });
                      
                  };
                  
                  
                  
                  
                    getEmployees()  //load employees so that we have an employee id to generate signature
                        .then(
                            function(){

                                return signatureHelperService.getRelevantDataForSignature($scope.data.selectedEmployee, $scope.data.signatureId, "toEdit");
                            }
                        ) 
                        .then(function(data){
                            
                            //TODO maybe not all data is needed here 
                            $scope.data.signatureTitle = data.signatureTitle;
                            $scope.data.signatureTpl = data.signatureTpl;
                            $scope.data.signatureStructureData = data.signatureData;
                            $scope.data.activeInGroups = data.activeGroups;
                            $scope.data.companyData = data.companyData;
                            $scope.data.employeeData = data.employeeData;
                            $scope.data.fields = data.fields;
                            $scope.data.lastRollout = data.signatureLastRollout;
                            $scope.data.signatureUpdatedAt = data.signatureUpdatedAt;
                            $scope.data.companyInfoUpdatedAt = data.companyInfoUpdatedAt;
                            
                            
                            
                            //determine rollout status of signature
                            var lastRollOut             =   moment(new Date( $scope.data.lastRollout));
                            var lastCompanyInfoChange   =   moment(new Date( $scope.data.companyInfoUpdatedAt));
                            var lastSignatureChanged    =   moment(new Date( $scope.data.signatureUpdatedAt));
                            
                            //if there was never a rollout or the rollout was before last company data change or before last signature change
                            if(!$scope.data.lastRollout || lastRollOut.isBefore(lastCompanyInfoChange) || lastRollOut.isBefore(lastSignatureChanged)){
                                 $scope.data.rolloutStatus = "outdated";
                            }else{
                                 $scope.data.rolloutStatus = "latest";
                            }
                            
                            
                        }) 
                        .then(                                  //generate preview when everything is loaded
                            function(){
                                return $timeout(
                                        function () {
                                            $scope.generatePreview();
                                            }, 1000);
                                }
                            )
                        .catch(function(e){
                            alertService.defaultErrorMessage(Strings.errors.DATEN_NICHT_GELADEN);
                        });
                  
               
                  
                    
                };
                $scope.initData();



                /**
                 * Remove assignement of signature from group
                 */
            $scope.removeSignaturefromGroups = function (id) {

                var idsToRemove = [];
                var askingText = 'Möchten Sie Zuordnung der Signatur zu dieser Abteilung wirklich entfernen?';
                if(id){ //remove only one group
                    idsToRemove.push(id);
                }else{
                    for(var i = 0 ; i < $scope.data.activeInGroups.length ; i++){
                        
                        idsToRemove.push($scope.data.activeInGroups[i].id);
                    }
                    if($scope.data.activeInGroups.length > 0){  //if more than one group selected then change asking text
                         askingText = 'Möchten Sie Zuordnung der Signatur zu diesen Abteilungen wirklich entfernen?';
                    }
                      
                }

                

                bootbox.confirm({
                    size: 'small',
                    message: askingText,
                    callback: function (result) {
                        if (result === true) {
                                groupsService.setSignature(idsToRemove, null).then(function (data) {
                                    if (data.success === true) {
                                        alertService.defaultSuccessMessage("Die Zuordnung wurde erfolgreich entfernt.");
                                        $scope.initData();
                                    } else {
                                        //TODO
                                        alertService.defaultErrorMessage(Strings.errors.TECHNISCHER_FEHLER);

                                    }
                                }).catch(function(err){
                                      alertService.defaultErrorMessage(Strings.errors.TECHNISCHER_FEHLER);
                                });
                        }
                    }
                });

            };
            
            /**
             * Count amount of members of the groups in which the signature is assigned to. 
             * Needed because rollout has to check if there are members to rollout to
             * @returns {Number}
             */
            $scope.getAmountOfMembersInWhichSignatureIsActive = function(){
                var amount = 0;
                if( !$scope.data.activeInGroups || $scope.data.activeInGroups.length === 0){
                    amount = 0;
                }else{
                    for(var i = 0 ; i < $scope.data.activeInGroups.length ; i++){
                        amount+=$scope.data.activeInGroups[i].amountOfMembers;
                        
                    }
                    
                }
                
                return amount;
                
            };
            
              /**
             * Send integration manual or invitation to mailtastic to all members where it is needed needed 
             * @returns {undefined}
             */
            $scope.rolloutSignature = function(){
                if($scope.getAmountOfMembersInWhichSignatureIsActive() === 0){
                    alertService.defaultErrorMessage("Diese Signatur ist in keiner Abteilung aktiv, die Mitarbeiter enthält. Weisen Sie die Signatur mindestens einer Abteilung zu, die über Mitglieder verfügt, um sie ausrollen zu können.");
                }else{
                    
                    
                    
                    
                    //-------------
                    //check subscriptionstatus
                        paymentService.getUserStatus().then(function(data){
                    
                            
                        if (!data || !data.success || data.success === false) {     //fehler
                               alertService.defaultErrorMessage(Strings.errors.DATEN_NICHT_GELADEN);
                               return $q.reject(); //do not rollout signature
                        } else {
                            
                            if (data.forceAllow == true || data.hasSubscription === true || data.hasTestTime === true) { //manuell freigeschaltet
                                return $q.resolve(); //rollout signature
                            }else{
                                return $q.reject("nosubscription"); //do not rollout signature
                            }
                        }
                })  
                .then(
                    function(){
                          signatureService.rolloutSignature($scope.data.signatureId)
                        .then(function(data){
                            if(data.success === true){
                               $scope.initData();
                            }else{
                                
                                alertService.defaultErrorMessage(Strings.errors.DATEN_NICHT_GELADEN);
                            }
                        });

                    },
                    function(message){
                        if(message === "nosubscription"){
                            //show modal that this is not allowed wihtout subscription
                             alertService.rolloutDeniedNoSubscription($scope.data.preview, function(){
                                 
                                 //success function handler -> show booking page
                                 $state.go("base.booking");
                                 
                             });
          
                        }else{
                            
                             alertService.defaultErrorMessage(Strings.errors.DATEN_NICHT_GELADEN);
                            
                       }
                          
                    }
                        
                            
                ).catch(function(e){
                     alertService.defaultErrorMessage(Strings.errors.DATEN_NICHT_GELADEN);
                });
                    
                    //--------------
                     
                    
                }
                
              
            };
            
            
               
               /**
                * List functions
                */
               
               
            /**
             * LIst functions
             * @returns {Boolean}
             */
           $scope.isSelectedAll = function () {
                return $scope.data.selectedGroups.length === $scope.data.activeInGroups.length;
            };
            $scope.selectAll = function ($event) {
                var checkbox = $event.target;
                var action = (checkbox.checked ? 'add' : 'remove');
                for (var i = 0; i < $scope.data.activeInGroups.length; i++) {
                    var entity = $scope.data.activeInGroups[i];
                    updateSelected(action, entity);
                }
            };
            $scope.selectAllOuter = function(){
                var action = ($scope.data.selectedGroups.length === $scope.data.activeInGroups.length ?  'remove' : 'add');
                for (var i = 0; i < $scope.data.activeInGroups.length; i++) {
                    var entity = $scope.data.activeInGroups[i];
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
               


            }]);