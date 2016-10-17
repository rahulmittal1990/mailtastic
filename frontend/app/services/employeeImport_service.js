/*global define*/
    'use strict';

     angular.module('mailtasticApp.services').service('employeeImportService', [
        'signatureService',
        'alertService',
        '$q',
        '$http',
        'employeeService',
        'userService',
        'XLSXReaderService',
        'paymentService',
        '$uibModal',
        function (signatureService , alertService, $q, $http, employeeService,userService,XLSXReaderService,paymentService,$uibModal) {

          var ownServiceObject = this;      //to call own member function

                this.importdata = {
                    json: [],
                    amountOfEmployees: null,
                    filename: ""
                };
                
                
                this.fileChanged = function (files) {
                    var deferred = $q.defer();
                    
                    
                    ownServiceObject.sheets = [];
                    ownServiceObject.excelFile = files[0];

                    ownServiceObject.importdata.filename = ownServiceObject.excelFile.name;

                    //check if .xlsx
                    var re = /(?:\.([^.]+))?$/;
                    if (re.exec(ownServiceObject.importdata.filename)[1] !== "xlsx") {
                        alert(Strings.employeeimport.EXCEL_WRONG_FORMAT);
                        deferred.reject();
                    }
                    ;

                    XLSXReaderService.readFile(ownServiceObject.excelFile, null).then(function (xlsxData) {
                        if (!xlsxData.json) {
                            alert(Strings.employeeimport.EXCEL_INVALID);
                            deferred.reject();
                        } else if (!Array.isArray(xlsxData.json) || xlsxData.json.length === 0) {
                            alert(Strings.employeeimport.EXCEL_NO_ENTRY);
                            deferred.reject();
                        } else {
                            ownServiceObject.importdata.json = xlsxData.json;
                           
                            deferred.resolve();
                        }
                    });
                    
                    
                     return deferred.promise;
                };

                //checks excel file
                this.checkImportData = function (loadingPromise) {
                    
                    
                     var deferred = $q.defer();
                    
                    
                    var emailre = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    var validEntrys = [];
                    var invalidEntrys = [];     //wird im moment nicht benutzt da abgebrochen wird wenn es invalide daten gibt
                    var alreadyInSystemEntrys = [];

                     loadingPromise = employeeService.get().then(function (employeesList) {        //liste von mitarbeitern laden damit geschaut werden kann welche schon vorhanden sind
                        for (var i = 0; i < ownServiceObject.importdata.json.length; i++) {

                            if (!ownServiceObject.importdata.json[i].Email) {           //ist email vorhanden
                                alert(Strings.employeeimport.EXCEL_EMAIL_MISSINS);
                                ownServiceObject.importdata.json = null;
                                deferred.reject();
                            } else if (emailre.test(ownServiceObject.importdata.json[i].Email) === false) {  //ist email eine gültige adresse
                                alert(Strings.employeeimport.EXCEL_EMAIL_MALFORMED + "<br>" + ownServiceObject.importdata.json[i].Email);
                                ownServiceObject.importdata.json = null;
                                deferred.reject();
                            } else {  //check ob bereits in Mitarbeitern vorhanden
                                var ret = jQuery.grep(employeesList, function (n, u) {
                                    return (n.email === ownServiceObject.importdata.json[i].Email);
                                });
                                if (ret.length > 0) { //bereits in mitarbeitern enthalten
                                    alreadyInSystemEntrys.push(ownServiceObject.importdata.json[i].Email);
                                } else {
                                    validEntrys.push(ownServiceObject.importdata.json[i].Email);
                                }
                            }

                            //falls nach- oder vornahme fehlen wird leerer String statt null benutzt
                            if (!ownServiceObject.importdata.json[i].Vorname) {
                                ownServiceObject.importdata.json[i].Vorname = "";
                            }
                            if (!ownServiceObject.importdata.json[i].Nachname) {
                                ownServiceObject.importdata.json[i].Nachname = "";
                            }
                        }
                        ownServiceObject.importdata.validEntrys = validEntrys;
                        ownServiceObject.importdata.alreadyInSystemEntrys = alreadyInSystemEntrys;
                        
                         deferred.resolve();
                        
                        //ownServiceObject.importUsers(currentGroup,config, loadingPromise);
                    });
                    
                     return deferred.promise;


                };

                this.importUsers = function (currentGroup,config, loadingPromise) {
                    
                    var deferred = $q.defer();
                    
                    if (currentGroup === "empty") {
                        alertService.defaultErrorMessage("Bitte wählen Sie die Abteilung aus, der die neuen Mitarbeiter hinzugefügt werden sollen.");
                        deferred.reject("NO GROUP");
                        return;
                    }
                    //checken wie viele mitarbeiter noch frei sind
                    //check if employee can be added and show modal
                     loadingPromise =paymentService.getUserStatus().then(function (data) {
                        if (data.success === false) {     //fehler
                            alert(Strings.errors.DATEN_NICHT_GELADEN);
                        } else {
                             var emailsAsString = "";
                                    for(var i = 0 ; i < ownServiceObject.importdata.alreadyInSystemEntrys.length ; i++){
                                        emailsAsString+= ownServiceObject.importdata.alreadyInSystemEntrys[i];
                                        if(i !== ownServiceObject.importdata.alreadyInSystemEntrys.length-1){
                                            emailsAsString+=", ";
                                        }
                                        
                                    }
                            if (data.forceAllow == true || data.hasTestTime === true || data.hasSubscription === true && data.amountOfFreeMembers >= ownServiceObject.importdata.validEntrys.length) { //manuell freigeschaltet
                                //continue
                                //alert("HAS FORCE");
                                  alertService.importEmployeeFree({
                                        filename : ownServiceObject.importdata.filename,
                                        totalAmount: ownServiceObject.importdata.json.length, 
                                        validAmount : ownServiceObject.importdata.validEntrys.length,
                                        freeAmount: data.amountOfFreeMembers, 
                                        alreadyExistant : ownServiceObject.importdata.alreadyInSystemEntrys.length,
                                        emailsAsString: emailsAsString,
                                        
                                    }, importNowForce, function () {
                                         document.getElementById('employeeimport').value = null; //reset file input
                                       // alert("Abbruch");
                                    });
                            }  else if (data.hasSubscription === true && data.amountOfFreeMembers < ownServiceObject.importdata.validEntrys.length) {    //ist zahlkunde
                                
                                    alertService.importEmployeeBuy({
                                        filename : ownServiceObject.importdata.filename,
                                        totalAmount: ownServiceObject.importdata.json.length, 
                                        validAmount : ownServiceObject.importdata.validEntrys.length,
                                        freeAmount: data.amountOfFreeMembers, 
                                        alreadyExistant : ownServiceObject.importdata.alreadyInSystemEntrys.length,
                                        emailsAsString: emailsAsString,
                                        billing_interval :data.billing_interval ,
                                        customPrice : data.customPrice
                                    }, importnow, function () {
                                       // alert("Abbruch");       
                                        document.getElementById('employeeimport').value = null; //reset file input
                                    });
                                
                            } else {
                                //muss erst eine subscription abschließen
                                //alert("Sie müssen zuerst Ihre Zahlungsdaten angeben, um weitere Mitarbeiter hinzufügen zu können.");
                                 document.getElementById('employeeimport').value = null; //reset file input
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
                            deferred.reject("NO GROUP");
                            return false;
                        }
                       
                        
                    if (ownServiceObject.importdata.json.length < 1) {        //keine Mitarbeiter drin
                        alert(Strings.employeeimport.EXCEL_NO_ENTRY);
                    }else if(ownServiceObject.importdata.validEntrys.length < 1){
                       // alert("Keine Mitarbeiter zum importieren vorhanden.");      //keine Mitarbeiter sie importierbar wären
                    }
                    else {
                        var group = null;
                        if(currentGroup !== "empty"){
                          group =  currentGroup;
                        }
                            employeeService.addMany(ownServiceObject.importdata.json, group).then(function (data) {
                            if (data.success === true && data.adresses && false) {  //some addresses were already existent   
                             
                             
                             
                                //add employees to the array where all the newly added employee ids are stored to send invitation mail afterwards
                                for(var i = 0 ; i < data.idsAdded.length ; i++){
                                    config.resultdata.employee.idsAdded.push(data.idsAdded[i]);
                                }
                              
                             
                             
                             
                                var adressString = "";
                                var counter = 0;
                                var more = 0;
                                var amountOfImported = ownServiceObject.importdata.json.length - data.adresses.length;
                                config.resultdata.employee.amountOfImported = amountOfImported;        //anzeigen wie viele Mitarbeiter hinzugefügt wurden
                                 
                                if (data.adresses.length < 11) {
                                    counter = data.adresses.length;
                                } else {
                                    counter = 10;
                                    more = data.adresses.length - 10;
                                }

                                for (var i = 0; i < counter; i++) {
                                    adressString += data.adresses[i];
                                    adressString += "<br>";
                                }
                                if (more > 0) {
                                    adressString += "Und " + more + " weitere.";
                                }
                                 alert("<strong>Import Teilweise erfolgt.<br>Es wurden " + amountOfImported + " importiert. </strong><br>Folgende E-Mail Adressen waren bereits im System vorhanden:<br> " + adressString);
                                //alert("<strong>" + amountOfImported + " Mitarbeiter wurde(n) erfolgreich importiert.</strong><br>Diese haben eine Einladung zu Mailtastic, sowie die Anleitung zum selbstständigen Einbinden des Kampagnen-Banners erhalten.<br><br><div class=\"schrift_grau\"><strong>" + data.adresses.length + " Nutzer sind bereits vorhanden und wurden nicht erneut eingeladen:</strong><br></div>" + adressString);



                              
                                 paymentService.syncEmployees().then(function (data) {
                                    if (data === true) {
//                                        alert("Ihre Gebührt hat sich nun um 3 Euro monatlich erhöhrt.");
                                    } else {
//                                        alert("Ihre Gebührt hat sich nicht erhöht, da Ihre Anzahl an Mitarbeitern noch in Ihrem kostenlosen Kontingent liegt.");
                                    }
                              
                                });
                                  

                                   //File input null setzen
                                    //file input null setzen
                                document.getElementById('employeeimport').value = null;
                                 //json zurück setzen damit wieder frisch datei ausgewählt werden kann
                                    ownServiceObject.importdata.json = [];  
                                deferred.resolve();


                            }
                            else if (data.success === true) {
                                
                          
                               
                              //add employees to the array where all the newly added employee ids are stored to send invitation mail afterwards
                              for(var i = 0 ; i < data.idsAdded.length ; i++){
                                    config.resultdata.employee.idsAdded.push(data.idsAdded[i]);
                               }
                                
                                
                                
                                //alert(Strings.employeeimport.EXCEL_IMPORT_SUCCESSFUL);
                                alert("<strong>" + data.idsAdded.length + " Mitarbeiter wurde(n) erfolgreich importiert.</strong>");
                                config.resultdata.employee.amountOfImported = ownServiceObject.importdata.validEntrys.length;
                               
                                
                                //file input null setzen
                                document.getElementById('employeeimport').value = null;
                                 //json zurück setzen damit wieder frisch datei ausgewählt werden kann
                                    ownServiceObject.importdata.json = [];
                                    
                                     paymentService.syncEmployees().then(function (data) {
                                    if (data === true) {
//                                        alert("Ihre Gebührt hat sich nun um 3 Euro monatlich erhöhrt.");
                                    } else {
//                                        alert("Ihre Gebührt hat sich nicht erhöht, da Ihre Anzahl an Mitarbeitern noch in Ihrem kostenlosen Kontingent liegt.");
                                    }
                                    //callback();
                                });
                               
                                   //File input null setzen
                                    //file input null setzen
                                document.getElementById('employeeimport').value = null;
                                 //json zurück setzen damit wieder frisch datei ausgewählt werden kann
                                    ownServiceObject.importdata.json = [];  
                                  
                                    
                                 deferred.resolve();
                            } else if (data.code === 76) { //all adresses were already existent

                                alert(Strings.employeeimport.EXCEL_ALL_EMAIL_EXISTENT);

                            } else {  //simply error
                                alert(Strings.employeeimport.EXCEL_IMPORT_UNSUCCESSFUL);

                            }
                        });
                    
                    }
                }
           
           
           
           return  deferred.promise;
           
                };
  }]);
