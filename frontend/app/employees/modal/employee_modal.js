'use strict';
// angular.module('mailtasticApp.modal',[]);
angular.module('mailtasticApp.modalEmployee', [, 'ui.bootstrap']).controller('EmployeeModalCtrl', ['$scope', '$uibModal', '$log', 'groupsService', function ($scope, $uibModal, $log, groupsService) {

    //$scope.items = ['item1', 'item2', 'item3'];

    $scope.animationsEnabled = true;

    $scope.open = function (employeeIdToEdit, groupId, step) {

        var dataObject = {
            employeeId: employeeIdToEdit,
            groupId :groupId,
            step :step
        };

        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'employees/modal/employee_modal.html',
            controller: 'EmployeeModalInstanceCtrl',
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

        .controller('EmployeeModalInstanceCtrl', ['$scope', '$modalInstance', 'dataObject', 'employeeService', 'browseService', 'groupsService','XLSXReaderService','paymentService','alertService','$uibModal', function ($scope, $modalInstance, dataObject, employeeService, browseService, groupsService,XLSXReaderService, paymentService,alertService,$uibModal) {



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
                selectedEmployees : []
            };

            $scope.groups = [];

            $scope.showPreview = false;
   
  
    
        $scope.importdata = {
                    json: [],
                    amountOfEmployees: null,
                    filename: ""
                };
                $scope.fileChanged = function (files) {
                    $scope.sheets = [];
                    $scope.excelFile = files[0];

                    $scope.importdata.filename = $scope.excelFile.name;

                    //check if .xlsx
                    var re = /(?:\.([^.]+))?$/;
                    if (re.exec($scope.importdata.filename)[1] !== "xlsx") {
                        alert(Strings.employeeimport.EXCEL_WRONG_FORMAT);
                        return;
                    }
                    ;

                    XLSXReaderService.readFile($scope.excelFile, $scope.showPreview).then(function (xlsxData) {
                        if (!xlsxData.json) {
                            alert(Strings.employeeimport.EXCEL_INVALID);
                        } else if (!Array.isArray(xlsxData.json) || xlsxData.json.length === 0) {
                            alert(Strings.employeeimport.EXCEL_NO_ENTRY);
                        } else {
                            $scope.importdata.json = xlsxData.json;
                            $scope.checkImportData();
                        }
                    });
                };

                //checks excel file
                $scope.checkImportData = function () {
                    var emailre = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    var validEntrys = [];
                    var invalidEntrys = [];     //wird im moment nicht benutzt da abgebrochen wird wenn es invalide daten gibt
                    var alreadyInSystemEntrys = [];

                     $scope.loadingPromise = employeeService.get().then(function (employeesList) {        //liste von mitarbeitern laden damit geschaut werden kann welche schon vorhanden sind
                        for (var i = 0; i < $scope.importdata.json.length; i++) {

                            if (!$scope.importdata.json[i].Email) {           //ist email vorhanden
                                alert(Strings.employeeimport.EXCEL_EMAIL_MISSINS);
                                $scope.importdata.json = null;
                                return;
                            } else if (emailre.test($scope.importdata.json[i].Email) === false) {  //ist email eine gültige adresse
                                alert(Strings.employeeimport.EXCEL_EMAIL_MALFORMED + "<br>" + $scope.importdata.json[i].Email);
                                $scope.importdata.json = null;
                                return;
                            } else {  //check ob bereits in Mitarbeitern vorhanden
                                var ret = jQuery.grep(employeesList, function (n, u) {
                                    return (n.email === $scope.importdata.json[i].Email);
                                });
                                if (ret.length > 0) { //bereits in mitarbeitern enthalten
                                    alreadyInSystemEntrys.push($scope.importdata.json[i].Email);
                                } else {
                                    validEntrys.push($scope.importdata.json[i].Email);
                                }
                            }

                            //falls nach- oder vornahme fehlen wird leerer String statt null benutzt
                            if (!$scope.importdata.json[i].Vorname) {
                                $scope.importdata.json[i].Vorname = "";
                            }
                            if (!$scope.importdata.json[i].Nachname) {
                                $scope.importdata.json[i].Nachname = "";
                            }
                        }
                        $scope.importdata.validEntrys = validEntrys;
                        $scope.importdata.alreadyInSystemEntrys = alreadyInSystemEntrys;
                        
                        $scope.importUsers();
                    });


                };



/**
 * sendet eine testmail an den Admin
 * @returns {undefined}
 */
                $scope.sendExampleMail = function(){
                   employeeService.sendInvitationTestmail().then(function(data){
                       if(data.success === true){
                            alertService.defaultSuccessMessage("Wir haben Ihnen eine Beispiel-Einladungs-E-Mail gesendet.");
                       }else{
                            alertService.defaultErrorMessage(Strings.errors.DATEN_NICHT_GELADEN);
                       }
                   },function(error){
                       alertService.defaultErrorMessage(Strings.errors.DATEN_NICHT_GELADEN);
                   });
                    
                };

                $scope.importUsers = function () {
                    if ($scope.employeedata.currentGroup === "empty") {
                        alertService.defaultErrorMessage("Bitte wählen Sie die Abteilung aus, der die neuen Mitarbeiter hinzugefügt werden sollen.");
                        return;
                    }
                    //checken wie viele mitarbeiter noch frei sind
                    //check if employee can be added and show modal
                      $scope.loadingPromise =paymentService.getUserStatus().then(function (data) {
                        if (data.success === false) {     //fehler
                            alert(Strings.errors.DATEN_NICHT_GELADEN);
                        } else {
                             var emailsAsString = "";
                                    for(var i = 0 ; i < $scope.importdata.alreadyInSystemEntrys.length ; i++){
                                        emailsAsString+= $scope.importdata.alreadyInSystemEntrys[i];
                                        if(i !== $scope.importdata.alreadyInSystemEntrys.length-1){
                                            emailsAsString+=", ";
                                        }
                                        
                                    }
                            if (data.forceAllow == true) { //manuell freigeschaltet
                                //continue
                                //alert("HAS FORCE");
                                  alertService.importEmployeeFree({
                                        filename : $scope.importdata.filename,
                                        totalAmount: $scope.importdata.json.length, 
                                        validAmount : $scope.importdata.validEntrys.length,
                                        freeAmount: data.amountOfFreeMembers, 
                                        alreadyExistant : $scope.importdata.alreadyInSystemEntrys.length,
                                        emailsAsString: emailsAsString,
                                        
                                    }, importNowForce, function () {
                                       // alert("Abbruch");
                                    });
                            } else if (data.hasTestTime === true) {    //noch im test
                                //einfach weiter machen
                                //alert("HAS TESTTIME");
                                alertService.importEmployeeFree({
                                        filename : $scope.importdata.filename,
                                        totalAmount: $scope.importdata.json.length, 
                                        validAmount : $scope.importdata.validEntrys.length,
                                        freeAmount: data.amountOfFreeMembers, 
                                        alreadyExistant : $scope.importdata.alreadyInSystemEntrys.length,
                                        emailsAsString: emailsAsString
                                    }, importNowForce, function () {
                                       // alert("Abbruch");
                                    });
                            } else if (data.hasSubscription === true) {    //ist zahlkunde
                                if (data.amountOfFreeMembers >= $scope.importdata.validEntrys.length) {   //hat noch freie
                                  //  alert("HAS FREE MEMBERS");
                                   alertService.importEmployeeFree({
                                        filename : $scope.importdata.filename,
                                        totalAmount: $scope.importdata.json.length, 
                                        validAmount : $scope.importdata.validEntrys.length,
                                        freeAmount: data.amountOfFreeMembers, 
                                        alreadyExistant : $scope.importdata.alreadyInSystemEntrys.length,
                                        emailsAsString: emailsAsString,
                                      
                                    }, importNowForce, function () {
                                       // alert("Abbruch");
                                    });
                                } else {      //hat keine freien mitarbeiter mehr
                                    //alert("HAS NO FREE MEMBERS");
                                   
                                    alertService.importEmployeeBuy({
                                        filename : $scope.importdata.filename,
                                        totalAmount: $scope.importdata.json.length, 
                                        validAmount : $scope.importdata.validEntrys.length,
                                        freeAmount: data.amountOfFreeMembers, 
                                        alreadyExistant : $scope.importdata.alreadyInSystemEntrys.length,
                                        emailsAsString: emailsAsString,
                                           billing_interval :data.billing_interval 
                                    }, importnow, function () {
                                       // alert("Abbruch");
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

                    function importNowForce(){
                        importnow(true);
                    }
                    function importnow(force){
                        
                        if(!$("#importmodalcheckbox").prop("checked") && (force !== true)){
                            return false;
                        }
                       
                        
                    if ($scope.importdata.json.length < 1) {        //keine Mitarbeiter drin
                        alert(Strings.employeeimport.EXCEL_NO_ENTRY);
                    }else if($scope.importdata.validEntrys.length < 1){
                       // alert("Keine Mitarbeiter zum importieren vorhanden.");      //keine Mitarbeiter sie importierbar wären
                    }
                    else {
                        var group = null;
                        if($scope.employeedata.currentGroup === "empty"){
                          group =  null;
                        }else{
                            group = $scope.employeedata.currentGroup;
                        }
                            employeeService.addMany($scope.importdata.json, group).then(function (data) {

                            if (data.success === true) {
                                
                                 //collect user ids: 
                                 var userIds = data.idsAdded;
                            
                            employeeService.sendInvitations(userIds)
                                    .then(function(data){
                                        if(data.success === true){
                                         
                                          var amountOfImported = $scope.importdata.json.length;
                                            if(data.adresses){
                                                amountOfImported = $scope.importdata.json.length - data.adresses.length;
                                            }
                                            //alert(Strings.employeeimport.EXCEL_IMPORT_SUCCESSFUL);
                                            alert("<strong>" + amountOfImported + " Mitarbeiter wurde(n) erfolgreich importiert.</strong><br>Diese haben eine Einladung zu Mailtastic, sowie die Anleitung zum selbstständigen Einbinden des Kampagnen-Banners erhalten.");
                         
                                        }else{
                                            alertService.defaultErrorMessage(Strings.errors.DATEN_NICHT_GELADEN);
                                        }
                                        
                                        //alert("<h3>Fertig</h3><br>Der Mitarbeiter wurde erfolgreich hinzugefügt und hat eine Einladung zu Mailtastic, sowie die Anleitung zum selbstständigen Einbinden des Kampagnen-Banners erhalten.");
                                        paymentService.syncEmployees().then(function (data) {
                                        });
                                        //file input null setzen
                                        document.getElementById('employeeimport').value = null;
                                        //json zurück setzen damit wieder frisch datei ausgewählt werden kann
                                        $scope.importdata.json = [];   
                                        browseService.reload();
                                        $scope.cancel();
                                    }).catch(function(e){
                                          alertService.defaultErrorMessage(Strings.errors.DATEN_NICHT_GELADEN);
                                    });
                                
                                
                                
                                
                                
                               
                            } else if (data.code === 76) { //all adresses were already existent

                                alert(Strings.employeeimport.EXCEL_ALL_EMAIL_EXISTENT);

                            } else {  //simply error
                                alert(Strings.employeeimport.EXCEL_IMPORT_UNSUCCESSFUL);

                            }
                        });
                    
                    }
                }
           
                };

            $scope.init = function(){
                
              if(dataObject){
                    if(dataObject.groupId){
                        $scope.modaloptions.groupId = dataObject.groupId;
                        $scope.employeedata.currentGroup = dataObject.groupId;
                    }
                    if(dataObject.step){
                         $scope.modaloptions.currentStep =dataObject.step; 
                    }
                    
                    
                    //update or create news
                    if(!dataObject.employeeId){
                        $scope.modaloptions.mode = "create";
                    }else{
                         $scope.modaloptions.mode = "update";
                    }
              } 
            };
            $scope.init();
            
            /**
             * Aktuelle Gruppe des Mitarbeiters im Select
             */
            $scope.selectedGroup = {
                selected: {}
            };
            $scope.loadingPromise = null;

            /**
             * Werden gebraucht wenn ein neuer erstellt wird muss die gruppe ausgwählt werden
             */
            $scope.loadGroups = function () {

                    $scope.loadingPromise = groupsService.get().then(function (data) {
                    $scope.groups = data;
                    
                    // Falls die Gruppen ID mit übergeben wird dann werden die Daten der Gruppe geladen zum Bearbeiten
                    if (dataObject && dataObject.employeeId) {
                        var employeeId = dataObject.employeeId;
                        $scope.modaloptions.heading = "Mitarbeiter bearbeiten";
                        $scope.modaloptions.saveButtonText = "Änderungen speichern";
                        $scope.loadingPromise = employeeService.getOne(employeeId).then(function (data) {
                            data = data[0];
                            $scope.employeedata = data;
                             $scope.employeedata.currentGroup = data.currentGroup.toString();
                          
                            $scope.modaloptions.mode = "update";
                        });
                    }else if($scope.modaloptions.groupId){
                        
                        $scope.employeedata.currentGroup = $scope.modaloptions.groupId;
                        
                    }
                });
            };
            
            
            $scope.showOtherImportPos = function(){
                alertService.otherImportPos();

            };
            
            /**
             * Wird benutzt wenn der nutzer bereits vorhandenen Employees zur Gruppe hinzufügen möchte
             * 
             * @returns {undefined}
             */
            $scope.loadEmployees = function(){

                  if($scope.modaloptions.groupId){
                        employeeService.get().then(function(data){
                            $scope.data.employees = [];
                            for(var i = 0 ; i < data.length ; i++){
                                if(data[i].currentGroup !== $scope.modaloptions.groupId){
                                    $scope.data.employees.push(data[i]);
                                    
                                }
                            }
                            $scope.recalcAvatars();

                        });
                
                     };
                };
            
            $scope.loadGroups();
            $scope.loadEmployees();
            $scope.modaldata = {selectedEmployees  : []};

            $scope.createEmployee = function () {
                
                if ($scope.modaloptions.mode === "create") { //mitarbeiter erstellen
                    //check if employee can be added and show modal
                    paymentService.getUserStatus().then(function (data) {
                        if (data.success === false) {     //fehler
                            alert(Strings.errors.DATEN_NICHT_GELADEN);
                        } else {
                            if (data.forceAllow == true) { //manuell freigeschaltet
                               creation(true);
                            } else if (data.hasTestTime === true) {    //noch im test
                                creation(true);
                            } else if (data.hasSubscription === true) {    //ist zahlkunde
                                if (data.amountOfFreeMembers > 0) {   //hat noch freie
                                    creation(true);
                                } else {      //hat keine freien mitarbeiter mehr
                                    alertService.addemployee({amount: 1, firstname: $scope.employeedata.firstname, lastname: $scope.employeedata.lastname, billing_interval :data.billing_interval, customPrice : data.customPrice }, creation, function () {
                                       // alert("Abbruch");
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
                    
                } else if ($scope.modaloptions.mode === "update") { //mitarbeiter bearbeiten
                    
                    if($scope.employeedata.currentGroup === "empty" || !$scope.employeedata.currentGroup){
                        alertService.defaultErrorMessage("Bitte wählen Sie eine Abteilung aus.");
                        
                    }else{
                        
                         $scope.loadingPromise = employeeService.update($scope.employeedata).then(function () {
                            browseService.reload();
                            $modalInstance.close();
                         });
                    }
                   
                }
                
                
                //create employee
                function creation(force){
                     if(!$("#createempmodalcheckbox").prop("checked") && (force !== true)){
                            return false;
                     }
                      if ($scope.employeedata.currentGroup === "empty") {
                            $scope.employeedata.currentGroup = null;
                      }
                     $scope.loadingPromise = employeeService.add($scope.employeedata).then(function (data) {
                        if(data.success === false && data.code===1){
                            alert("Es existiert bereits ein Mitarbeiter mit der angegebenen E-Mail-Adresse. Bitte überprüfen Sie Ihre Eingaben.");
                        }else /*if(data.success === true)*/{
                            
                            //alertService.defaultSuccessMessage("Der Mitarbeiter wurde erfolgreich hinzugefügt und hat eine Einladung zu Mailtastic, sowie die Anleitung zum selbstständigen Einbinden des Kampagnen-Banners erhalten.");
                            //get user is to send invitation
                            var userIds = [data.id];
                            
                            employeeService.sendInvitations(userIds)
                                    .then(function(data){
                                        if(data.success === true){
                                            alertService.defaultSuccessMessage("Der Mitarbeiter wurde erfolgreich hinzugefügt und hat eine Einladung zu Mailtastic, sowie die Anleitung zum selbstständigen Einbinden des Kampagnen-Banners erhalten.");
                    
                                        }else{
                                            alertService.defaultErrorMessage(Strings.errors.DATEN_NICHT_GELADEN);
                                        }
                                        
                                        //alert("<h3>Fertig</h3><br>Der Mitarbeiter wurde erfolgreich hinzugefügt und hat eine Einladung zu Mailtastic, sowie die Anleitung zum selbstständigen Einbinden des Kampagnen-Banners erhalten.");
                                        paymentService.syncEmployees().then(function (data) {
                                        });
                                        browseService.reload();
                                        $modalInstance.close();
                                        
                                    }).catch(function(e){
                                          alertService.defaultErrorMessage(Strings.errors.DATEN_NICHT_GELADEN);
                                    });
                            
                           
                        }
                      }).catch(function(e){
                                          alertService.defaultErrorMessage(Strings.errors.DATEN_NICHT_GELADEN);
                      });  
                }
            };
            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
            
            
                        
            /**
             * die ausgewählten nutzer zur gruppe hinzufügen beim modal Vorhandenen Hinzufügen
             * @returns {undefined}
             */
            $scope.addUsersToGroup = function(){
                if(!$scope.modaloptions.groupId){
                       alert(Strings.errors.TECHNISCHER_FEHLER);
                        $scope.cancel();
                       
                }else if($scope.modaldata.selectedEmployees.length === 0){
                    alert("Bitte wählen Sie zumindest einen Mitarbeiter aus.");
                }else{
                    
                    var empIds = [];
                    for(var  i = 0 ;  i < $scope.modaldata.selectedEmployees.length ; i++){
                        empIds.push($scope.modaldata.selectedEmployees[i].id);
                    }
                    employeeService.moveToGroup(empIds,$scope.modaloptions.groupId).then(function(data){
                        if(data.success === true){
                             alert("Die Mitarbeiter wurden erfolgreich der Abteilung hinzugefügt.");
                             
                        }else{
                            alert(Strings.errors.TECHNISCHER_FEHLER);
                        }
                        browseService.reload();
                        $scope.cancel();
                    });
                }
                
            };
            
            
            
            /**
             * List selection sachen
             * @param {type} action
             * @param {type} item
             * @returns {undefined}
             */
            
            
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
            
            //list select for adding existing employee
               var updateSelected = function (action, item) {
                //check if item is already selected
                var ret = jQuery.grep($scope.modaldata.selectedEmployees, function (n, i) {
                    return (n.id === item.id);
                });


                if (action === 'add' && ret.length === 0) { //falls objekt noch nicht selected dann selektiere
                    $scope.modaldata.selectedEmployees.push(item);
                    $scope.recalcAvatars();
                }
                if (action === 'remove' && ret.length > 0) {    //falls selected dann deselektiere
                    //objekt aus dem array entfernen
                    for (var i = 0; i < $scope.modaldata.selectedEmployees.length; i++) {
                        var obj = $scope.modaldata.selectedEmployees[i];

                        if (obj.id === item.id) {
                            $scope.modaldata.selectedEmployees.splice(i, 1);
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


                var ret = jQuery.grep($scope.modaldata.selectedEmployees, function (n, i) {
                    return (n.id === item.id);
                });

                return (ret.length !== 0);
            };

          
            $scope.rowClicked = function (item) {
                var id = item.id;
                var mode = "add";
                for (var i = 0; i < $scope.modaldata.selectedEmployees.length; i++) {
                    if (id === $scope.modaldata.selectedEmployees[i].id) {
                        mode = "remove";
                        break;
                    }

                }
                 updateSelected(mode, item);
              
               
            };
            


        }]).controller('EmployeeDeleteModalInstanceCtrl', ['$scope', '$modalInstance', 'empsToDelete', 'employeeService', 'browseService','paymentService', function ($scope, $modalInstance, empsToDelete, employeeService, browseService, paymentService) {



            $scope.modaloptions = {
                currentStep: "first",
                empsToDelete : empsToDelete
            };

            $scope.finish = function(){
//                               alert("Ab Ihrer nächsten Abrechnung verringert sich Ihre Gebühr um 3.00 Euro Netto, insofern dieser Mitarbeiter nicht ohnehin in Ihrem Tarif enthalten war.");
                                     $modalInstance.close(true);
            };


            $scope.cancel = function(){
                 $modalInstance.close(false);
            };
            $scope.deleteUsers = function(){
                
                if(empsToDelete.length === 0){
                    alert("Bitte mindestens einen Mitarbeiter auswählen");
                    return;
                }

                employeeService.deleteMany(empsToDelete).then(function (res) {
                                if (res.success === true) {
                                    paymentService.syncEmployees().then(function(){
                                 
                                       
                                        
                                    });
                                    
                                     $scope.setStep("third");
                                } else {
                                     $modalInstance.cancel();
                                }
                });
            };
            

          

            $scope.setStep = function(step){
                 $scope.modaloptions.currentStep = step;
            };
    

        }]);;
    
    
    function alert(content) {
    bootbox.alert(content);
}