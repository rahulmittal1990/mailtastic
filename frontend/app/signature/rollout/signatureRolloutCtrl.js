/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


angular.module('mailtasticApp.signature')



        .controller('SignatureRolloutCtrl',
                [
                    '$scope',
                    'alertService',
                    '$state',
                    '$uibModal',
                    '$q',
                    'employeeService',
                    'signatureService',
                    'signatureHelperService',
                    'paymentService',
                    'groupsService',
                    'listHelperService',
                    'employeeImportService',
                    '$sce',
                    function ($scope, alertService, $state, $uibModal, $q, employeeService, signatureService, signatureHelperService, paymentService, groupsService, listHelperService, employeeImportService, $sce) {


                        $scope.workflow = {
                            currentStep: "",
                            breadcrumps: [],
                            breadcrumpsdone: [],
                        };


                        $scope.signatureData = {
                            sigHtml: "",
                            id: ""

                        };

                        $scope.groupData = {
                            title: "",
                            activeSignature: "",
                            allGroups: [],
                            selectedGroups: [],
                            filteredGroups: []

                        };

                        $scope.employeeData = {
                            allEmployees: [],
                            filteredEmployees: [],
                            selectedEmployees: [],
                            currentGroup: "empty",
                            firstname: "",
                            lastname: "",
                            email: ""

                        };

                        /**
                         * Here all the results of the current workflow are stored
                         */
                        $scope.resultData = {
                            group: {
                                groupsAssigned: 0
                            },
                            employee: {
                                amountOfAddedEmployees: 0,
                            },
                            signature: {
                                rolledout: false
                            }

                        };

                        $scope.listHandler = {};



//        /**
//         * Show detailpage of signature. Used when Rollout process after signature generation is finished
//         * @returns {$q@call;defer.promise}
//         */
//        $scope.goToSignature = function(){
//            $state.go("base.signaturedetails", {signatureId: item.id});
//            goToSignature  
//        };
//        


                        /**
                         * get all employees because maybe the user will need to select them when adding to a group
                         * @returns {$q@call;defer.promise}
                         */
                        $scope.getEmployees = function () {
                            var deferred = $q.defer();

                            employeeService.get().then(function (data) {
                                $scope.employeeData.allEmployees = data;
                                deferred.resolve();
                            }, function () {
                                deferred.reject();
                            });
                            return deferred.promise;
                        };


                        /**
                         * get groups and filter by these groups which the signature is already assigned to
                         * @returns {undefined}
                         */
                        $scope.getGroups = function () {

                            var deferred = $q.defer();

                            groupsService.get().then(function (data) {
                                $scope.groupData.allGroups = data;
                                $scope.groupData.filteredGroups = [];
                                for (var i = 0; i < data.length; i++) {
                                    if (data[i].activeSignature !== $scope.signatureData.id) {
                                        $scope.groupData.filteredGroups.push(data[i]);
                                    }
                                }

                                deferred.resolve();
                            }, function () {
                                deferred.reject();
                            });

                            return deferred.promise;
                        };

                        /**
                         *  1. Check state params
                         2. get user payment subscrioption status
                         3. Set current view to show
                         4. generate Signature Html from dummy
                         * @returns {undefined}
                         */
                        $scope.initData = function () {

                            //set selection type for employee and group selection
                            listHelperService.selectionType = "multi";


                            //show employee dummy images when list is shown
                            $scope.$watch('workflow.currentStep', function (newValue, oldValue) {
                                if (newValue === "employee_selectexisting") {
                                    $scope.recalcAvatars();
                                }
                            });




                            if (!$state.params || !$state.params.signatureId) {
                                alertService.defaultErrorMessage(Strings.errors.DATEN_NICHT_GELADEN);
                                return;
                            }
                            //new signature created or updated an existing signature
                            if ($state.params.mode === "create") {
                                $scope.workflow.outerheadline = "Signatur erstellen";
                                $scope.resultData.signature.signatureCreatedOrUpdated = "created";
                                $scope.workflow.breadcrumpsdone = ["Signatur erstellt"];
                            } else if ($state.params.mode === "update") {
                                $scope.workflow.breadcrumpsdone = ["Signatur bearbeitet"];
                                $scope.workflow.outerheadline = "Signatur bearbeiten";
                                $scope.workflow.breadcrumps = ["Signatur ausrollen"];
                                $scope.resultData.signature.signatureCreatedOrUpdated = "updated";

                            } else {
                                alertService.defaultErrorMessage(Strings.errors.DATEN_NICHT_GELADEN);
                                return;
                            }


                            //save signatureId in scope
                            $scope.signatureData.id = $state.params.signatureId;
                            $scope.signatureData.title = $state.params.signatureTitle;




                            /**
                             * load all data for signature 
                             */
                            signatureHelperService.getRelevantDataForSignature("dummy", $scope.signatureData.id).then(
                                    function resolve() {
                                        var sigHtml = signatureHelperService.generatePreviewComplete("dummy");
                                        if (sigHtml) {
                                            $scope.signatureData.sigHtml = $sce.trustAsHtml(sigHtml); ;
                                            $scope.resultData.signature.activeInGroups = signatureHelperService.dataManager.activeGroups; //save groups in which the signature is active


                                            return $q.resolve();
                                        } else {
                                            throw "nosightml";
                                        }
                                    },
                                    function reject() {
                                        throw "nosightml";

                                    }
                            )



                                    //check if user has an active account (paid)
                                    .then(paymentService.getUserStatus)

                                    //check results from payment status request and load more data if user is valid
                                    .then(function (data) {
                                        if (data.success !== true) {
                                            throw "nodata";
                                            //return $q.reject("error");
                                            //}else if(data.success === true && data.hasSubscription === false){
                                        } else if (data.success === true && (data.hasSubscription === true || data.forceAllow === true || data.hasTestTime === true )) {
                                            //load all groups and select those in which are not the signature is already assigned

                                            /**
                                             * load all employees and groups to show in list when selecting existing
                                             */
//                          return $q.all([
                                            $scope.getGroups();
                                            $scope.getEmployees();
//                          ]);

                                            return $q.resolve();
                                        } else if (data.success === true && data.hasSubscription === false) {

                                            return $q.reject();
                                            //}else if(data.success === true && data.hasSubscription === true){
                                        }
                                    }).then(//check data and set correct view to show
                                    function resolve() { //has paid account so check which view is the current to show
                                        //check if signature was created or updated
                                        if ($scope.resultData.signature.signatureCreatedOrUpdated === "created") {
                                            $scope.workflow.currentStep = "group_nogroup";      //when creating a signature it is not active in any group
                                            $scope.workflow.breadcrumps = ["Abteilung zuweisen"];
                                        } else if ($scope.resultData.signature.signatureCreatedOrUpdated === "updated") {
                                            //maybe it is active in several groups
                                            if ($scope.resultData.signature.activeInGroups.length === 0 || $scope.countMembersOfAssignedgroups() === 0) {    //is updated but not active in any group -> show user a message that he has to assign a group with employees first
                                                $scope.workflow.currentStep = "nomembersassigned";

                                            } else {
                                                $scope.workflow.currentStep = "signature_results";
                                            }
                                            $scope.workflow.breadcrumps = ["Signatur ausrollen"];
                                        }
                                        return $q.resolve();

                                    },
                                    function reject(data) {  //has no paid account
                                        $scope.workflow.currentStep = "noaccount";
                                        $scope.workflow.breadcrumps = ["Mailtastic aktivieren"];
                                        return $q.resolve();

                                    }
                            )



                                    .catch(function (e) { //something went wrong
//                if(e === "nodata"){
                                        alertService.defaultErrorMessage(Strings.errors.DATEN_NICHT_GELADEN);
//                }
                                    });
                        };




                        /**
                         * sendet eine testmail an den Admin
                         * @returns {undefined}
                         */
                        $scope.sendExampleMail = function () {
                            employeeService.sendInvitationTestmail().then(function (data) {
                                if (data.success === true) {
                                    alert("Wir haben Ihnen eine Beispiel-Einladungs-E-Mail gesendet.");
                                } else {
                                    alert(Strings.errors.DATEN_NICHT_GELADEN);
                                }
                            }, function (error) {
                                alert(Strings.errors.DATEN_NICHT_GELADEN);
                            });

                        };


                        /**
                         * count employees in the groups to which the signature was assigned to
                         * @returns {undefined}
                         */
                        $scope.countMembersOfAssignedgroups = function () {
                            if (!$scope.resultData.signature.activeInGroups) {
                                return 0;
                            } else {

                                var amountOfAssignedEmployees = 0;
                                for (var i = 0; i < $scope.resultData.signature.activeInGroups.length; i++) {
                                    amountOfAssignedEmployees += $scope.resultData.signature.activeInGroups[i].amountOfMembers;

                                }

                                return amountOfAssignedEmployees;
                            }


                        };

                        //open view create new group and assign signature or select groups to assign signature
                        $scope.addGroup = function (mode) {
                            if (mode === "new") {
                                $scope.workflow.currentStep = "group_createnew";
                            } else if (mode === "existing") {
                                $scope.workflow.currentStep = "group_selectexisting";
                                //set objects to manage in listservice
                                listHelperService.all = $scope.groupData.filteredGroups;
                                listHelperService.selected = $scope.groupData.selectedGroups;
                                $scope.listHandler = listHelperService;
                            }
                        };


                        /**
                         * Create new group in backend and assign signature
                         * @returns {undefined}
                         */
                        $scope.createGroup = function () {

                            $scope.loadingPromise = groupsService.add({title: $scope.groupData.title, activeSignature: $scope.signatureData.id}).then(function (data) {
                                if (data.success === true) {
                                    $scope.resultData.group.groupsAssigned = 1;  //how many groups were assigned?
                                    $scope.employeeData.currentGroup = data.groupId; //when creating an employee use this groupId
                                    $scope.workflow.breadcrumpsdone.push("Abteilung(en) zugewiesen");       //add to breadcrumps
                                    $scope.workflow.breadcrumps = ["Mitarbeiter hinzufügen"];       //add to breadcrumps
                                    $scope.resultData.group.groupSet = true;                                //assigned a group  
                                    $scope.resultData.group.multipleGroups = false;     //only one group
                                    $scope.resultData.group.groupsSet = [{title: $scope.groupData.title, activeSignature: $scope.signatureData.id, id: data.groupId}];      //list of groups to which the signature was assigned to
                                    $scope.resultData.group.amountOfGroupsSet = 1;              //obsolete
                                    $scope.resultData.group.amountOfMembersGroupsSet = 0;       //because it was e new group there cant be any members in it
                                    $scope.resultData.group.groupTitlesAdded = $scope.groupData.title;      //the title of the group that was created. Used for infos on result page
                                    $scope.workflow.currentStep = "employee_results";   //set next step

                                } else {
                                    alert(Strings.errors.TECHNISCHER_FEHLER);
                                }
                            });
//                }
                        };








                        /**
                         * Take selected groups from list and set the active signature 
                         * @returns {undefined}
                         */

                        $scope.setSignatureForGroupFromList = function () {
                            if (!$scope.groupData.selectedGroups || !$scope.groupData.selectedGroups[0]) {
                                alert("Bitte eine Gruppe selektieren");
                            }
                            else
                            {

                                //prepare groupIds
                                var groupIds = [];
                                var amountOfMembers = 0;        // wird für den Result Screen in der Kampagne benötigt
                                var groupTitlesAsString = "";       //neeeded for campaign result page
                                for (var i = 0; i < $scope.groupData.selectedGroups.length; i++) {
                                    groupIds.push($scope.groupData.selectedGroups[i].id);
                                    amountOfMembers += $scope.groupData.selectedGroups[i].amountOfMembers;
                                    groupTitlesAsString += $scope.groupData.selectedGroups[i].title;
                                    if (i !== $scope.groupData.selectedGroups.length - 1) {
                                        groupTitlesAsString += $scope.groupData.selectedGroups[i].title += ", ";
                                    }

                                }

                                groupsService.setSignature(groupIds, $scope.signatureData.id).then(function (result) {
                                    if (result.success === true) {

                                        $scope.workflow.breadcrumpsdone.push("Abteilung zugewiesen");
                                        $scope.resultData.group.groupSet = true;
                                        $scope.resultData.group.multipleGroups = true;
                                        $scope.resultData.group.groupsSet = $scope.groupData.selectedGroups;
                                        $scope.resultData.group.amountOfGroupsSet = groupIds.length;
                                        if (groupIds.length === 1) {  //if there was only one group assigned, put it into group selection as preselction on adding more members
                                            $scope.employeeData.currentGroup = groupIds[0];
                                        }
                                        $scope.resultData.group.amountOfMembersGroupsSet = amountOfMembers;
                                        $scope.resultData.group.groupTitlesAdded = groupTitlesAsString;

                                        if ($scope.resultData.group.amountOfMembersGroupsSet > 0) {
                                            $scope.workflow.currentStep = "signature_results";
                                            $scope.workflow.breadcrumps = ["Signatur ausrollen"];       //add to breadcrumps
                                        } else {
                                            $scope.workflow.currentStep = "employee_results";
                                            $scope.workflow.breadcrumps = ["Mitarbeiter hinzufügen"];       //add to breadcrumps
                                        }


                                    } else {
                                        //TODO
                                        alertService.defaultErrorMessage(Strings.errors.DATEN_NICHT_GELADEN);
                                    }
                                });
                            }


                        };






                        //show screen to create new employee or assign existing one or import an user
                        $scope.addEmployee = function (mode) {

                            if (mode === "new") {
                                //reset data but currentGroup
                                $scope.employeeData.email = "";
                                $scope.employeeData.firstname = "";
                                $scope.employeeData.lastname = "";

                                $scope.workflow.currentStep = "employee_createnew";
                            } else if (mode === "existing") {
                                $scope.employeeData.selectedEmployees = [];     //only employees which are not in groups to which the signature was assigned to
                                $scope.employeeData.filteredEmployees = [];     //only employees which are not in groups to which the signature was assigned to
                                //filter all employees which are not in the selected groups because they shoul not be selectable
                                for (var i = 0; i < $scope.employeeData.allEmployees.length; i++) {
                                    var ret = jQuery.grep($scope.resultData.group.groupsSet, function (n, t) {    //all groups to which the signature was assigned
                                        return (n.id === $scope.employeeData.allEmployees[i].currentGroup);   //is employee already in the assigned groups
                                    });
                                    if (ret.length === 0) {   //found more than 0
                                        $scope.employeeData.filteredEmployees.push($scope.employeeData.allEmployees[i]);  //if not than push him to filtered emps
                                    }
                                }


                                $scope.workflow.currentStep = "employee_selectexisting";
                                //set objects to manage in listservice
                                listHelperService.all = $scope.employeeData.filteredEmployees;
                                listHelperService.selected = $scope.employeeData.selectedEmployees;
                                $scope.listHandler = listHelperService;

                            } else if (mode === "import") {
                                $scope.workflow.currentStep = "employee_import";

                            }

                        };







                        /**
                         * add selected employees to group
                         * @returns {undefined}
                         */

                        $scope.setEmployeesFromList = function () {
                            if (!$scope.employeeData.selectedEmployees || !$scope.employeeData.selectedEmployees[0]) {
                                alertService.defaultErrorMessage("Bitte wählen Sie mindestens einen Mitarbeiter aus.");
                            } else if (!$scope.employeeData.currentGroup || $scope.employeeData.currentGroup === "empty") {
                                alertService.defaultErrorMessage("Bitte wählen Sie die Gruppe aus, denen die Mitarbeiter hinzugefügt werden sollen.");
                            }
                            else {

                                var empIds = [];
                                for (var i = 0; i < $scope.employeeData.selectedEmployees.length; i++) {
                                    empIds.push($scope.employeeData.selectedEmployees[i].id);
                                }
                                var group = null;
                                group = $scope.employeeData.currentGroup;

                                employeeService.moveToGroup(empIds, group).then(function (result) {
                                    if (result.success === true) {


                                        $scope.resultData.employee.amountOfAddedEmployees += empIds.length;

//                                        $scope.config.resultdata.campaign.newEmpsIncluded = true;    //es wurde ein mitarbeiter zur Abteilung hinzugefügt, Abteilungsname


                                        //load groups
                                        groupsService.get().then(function (data) {
                                            $scope.groupData.allGroups = data;
                                            return $q.resolve();
                                        })
                                                .then(function () {
                                                    return $scope.getEmployees();

                                                })
                                                .then(function () {
                                                    //get name of Group in which the emp was added to
                                                    var groupTitle = "";
                                                    for (var i = 0; i < $scope.groupData.allGroups.length; i++) {
                                                        if ($scope.groupData.allGroups[i].id == group) {
                                                            groupTitle = $scope.groupData.allGroups[i].title;
                                                            break;
                                                            ;
                                                        }
                                                    }
                                                    $scope.resultData.employee.groupTitleToWhichTheEmpsWereAdded = groupTitle;
                                                    $scope.workflow.currentStep = "signature_results";

                                                    $scope.workflow.breadcrumpsdone.push("Mitarbeiter hinzugefügt");
                                                    $scope.workflow.breadcrumps = ["Signatur ausrollen"];



                                                });
                                    }
                                    else {
                                        //TODO
                                        alertService.defaultErrorMessage(Strings.errors.TECHNISCHER_FEHLER);
                                    }

                                });


                            }


                        };



                        /**
                         * create new employee
                         * @returns {undefined}
                         */
                        $scope.createEmployee = function () {

                            if ($scope.employeeData.currentGroup === "empty") {
                                alert("Bitte wählen Sie die Abteilung aus, der der neue Mitarbeiter hinzugefügt werden soll.");
                                return;
                            }

                            //check if there is already an employee with given email adress
                            for (var i = 0; i < $scope.employeeData.allEmployees.length; i++) {
                                if ($scope.employeeData.allEmployees[i].email === $scope.employeeData.email) {
                                    alertService.defaultErrorMessage("Es existiert bereits ein Mitarbeiter mit der angegebenen E-Mail-Adresse. Bitte überprüfen Sie Ihre Eingaben.");
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
                                            alertService.addemployee({amount: 1, firstname: $scope.employeeData.firstname, lastname: $scope.employeeData.lastname, billing_interval: data.billing_interval, customPrice : data.customPrice}, creation, function () {
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
                                            windowClass: "expiredmodalcontainer"
                                        });

                                    }
                                }
                            });

                            function creation(force) {

                                if (!$("#createempmodalcheckbox").prop("checked") && (force !== true)) {
                                    return false;
                                }


                                if ($scope.employeeData.currentGroup === "empty") {
                                    $scope.employeeData.currentGroup = null;
                                }
                                var group = $scope.employeeData.currentGroup;

                                $scope.loadingPromise = employeeService.add($scope.employeeData).then(function (data) {
                                    if (data.success === false && data.code === 1) {
                                        alertService.defaultErrorMessage("Es existiert bereits ein Mitarbeiter mit der angegebenen E-Mail-Adresse. Bitte überprüfen Sie Ihre Eingaben. Ihr Abonnement hat sich nicht geändert.");
                                    } else if (data.success === false) {
                                        alert(Strings.errors.TECHNISCHER_FEHLER);
                                    }
                                    else {


                                        $scope.resultData.employee.amountOfAddedEmployees += 1;
                                        //load groups
                                        groupsService.get().then(function (data) {
                                            $scope.groupData.allGroups = data;
                                            return $q.resolve();
                                        })
                                                .then(function () {
                                                    return $scope.getEmployees();

                                                })
                                                .then(function () {
                                                    //get name of Group in which the emp was added to
                                                    var groupTitle = "";
                                                    for (var i = 0; i < $scope.groupData.allGroups.length; i++) {
                                                        if ($scope.groupData.allGroups[i].id == group) {
                                                            groupTitle = $scope.groupData.allGroups[i].title;
                                                            break;
                                                            ;
                                                        }
                                                    }
                                                    $scope.resultData.employee.groupTitleToWhichTheEmpsWereAdded = groupTitle;
                                                    $scope.workflow.currentStep = "signature_results";
                                                    $scope.workflow.breadcrumpsdone.push("Mitarbeiter hinzugefügt");
                                                    $scope.workflow.breadcrumps = ["Signatur ausrollen"];
                                                });



                                        paymentService.syncEmployees().then(function (data) {
                                            if (data === true) {
                                                //                                        alert("Ihre Gebührt hat sich nun um 3 Euro monatlich erhöhrt.");
                                            } else {
                                                //                                        alert("Ihre Gebührt hat sich nicht erhöht, da Ihre Anzahl an Mitarbeitern noch in Ihrem kostenlosen Kontingent liegt.");
                                            }

                                        });
                                    }
                                });
                            }
                        };






                        /**
                         * abort workflow and show current workflow status
                         * @returns {undefined}
                         */
                        $scope.abort = function () {

                            //prepare resultdata for abortion modal dialog. Data is seperated in controller for better seperation but needs to be merged to determina the current workflow status for the abortion dialog
                            $scope.resultData.signature.title = $scope.signatureData.title;
                            $scope.resultData.signature.id = $scope.signatureData.id;

                            alertService.assistantAbortSignatureRollout($scope.resultData, function () {
                                $state.go("base.signaturelist");

                            }, function () {

                            });


                        };



                        /**
                         * When creating employee or select exising or import existing and pressing back it has to be determined if it has to show employee_results view or signature_Results view
                         * @returns {undefined}
                         */
                        $scope.backFromAddingEmployees = function () {

                            if ($scope.resultData.employee.groupTitleToWhichTheEmpsWereAdded) {   //already added employees so go back to signature_results
                                $scope.workflow.currentStep = "signature_results";
                            } else if ($scope.countMembersOfAssignedgroups() > 0) { //not added employees but there are already members in the groups so no need to return to missing employee page
                                $scope.workflow.currentStep = "signature_results";  //should never get here because when there are already members the user is not asked to add any more members
                            } else {
                                $scope.workflow.currentStep = "employee_results";
                            }
                        };


                        /**
                         * Send integration manual or invitation to mailtastic to all needed 
                         * @returns {undefined}
                         */
                        $scope.rolloutSignature = function () {
                            signatureService.rolloutSignature($scope.signatureData.id)
                                    .then(function (data) {
                                        if (data.success === true) {
                                            $scope.resultData.signature.rolledout = true;
                                            //how many invitation were sent
                                            $scope.resultData.signature.amountOfInvitationsSent = data.amountOfInvitationsSent;
                                            $scope.resultData.signature.amountWithEasySync = data.amountWithEasySync;
                                             $scope.resultData.signature.amountWithGoogleSync = data.amountWithGoogleSync;


                                            $scope.workflow.breadcrumpsdone.push("Signatur ausgerollt");
                                            $scope.workflow.breadcrumps = ["Fertig!"];

                                        } else {

                                            alertService.defaultErrorMessage(Strings.errors.DATEN_NICHT_GELADEN);
                                        }
                                    });
                        };





                        //IMPORT STUFF



                        /**
                         * next steps after import of employees was done
                         * @returns {undefined}
                         */
                        $scope.processAfterImport = function () {

                            $scope.resultData.employee.amountOfAddedEmployees += $scope.config.resultdata.employee.amountOfImported;


                            var group = null;
                            if ($scope.employeeData.currentGroup !== "empty") {
                                group = $scope.employeeData.currentGroup;
                            }
                            //get name of Group in which the emp was added to
                            var groupTitle = "";
                            for (var i = 0; i < $scope.groupData.allGroups.length; i++) {
                                if ($scope.groupData.allGroups[i].id == group) {
                                    groupTitle = $scope.groupData.allGroups[i].title;
                                    break;
                                    ;
                                }
                            }
                            $scope.resultData.employee.groupTitleToWhichTheEmpsWereAdded = groupTitle;
                            $scope.workflow.currentStep = "signature_results";




                            //set breadcrumps
                            $scope.workflow.breadcrumpsdone.push("Mitarbeiter hinzugefügt");
                            $scope.workflow.breadcrumps = ["Signatur ausrollen"];


                        };

                        $scope.fileChanged = function (files) {



                            employeeImportService.fileChanged(files)
                                    .then(function () {
                                        return employeeImportService.checkImportData($scope.config.loadingPromise);

                                    })
                                    .then(function () {
                                        return employeeImportService.importUsers($scope.employeeData.currentGroup, $scope.config, $scope.loadingPromise);
                                    }).then(function () {
                                $scope.processAfterImport();
                            })
                                    .catch(function (e) { //remove value from file input so that user can directly choose a file with same name
                                        document.getElementById('employeeimport').value = null;

                                    });



                        };


                        /**
                         * TODO NOGO copied code from assistant
                         */
                        $scope.config = {
                            resultdata: {
                                employee: {
                                    idsAdded: []
                                }
                            }
                        };
                        $scope.importUsers = function () {



                            employeeImportService.importUsers($scope.employeeData.currentGroup, $scope.config, $scope.loadingPromise)
                                    .then(function (data) {
                                        $scope.processAfterImport();
                                    }).catch(function (e) {
                                document.getElementById('employeeimport').value = null;
                            });

                        };



                    }]);

