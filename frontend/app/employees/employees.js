'use strict';
angular.module('mailtasticApp.employees', ['ui.bootstrap']);
angular.module('mailtasticApp.employees')



      
      /**
       * Parent Controller for all Employee and Group Ctrl.
       * This is because at the beginning groups and employees where in only one view combined
       * @param {type} $scope
       * @param {type} groupsService
       * @param {type} employeeService
       * @param {type} browseService
       * @param {type} $state
       * @param {type} campaignService
       * @param {type} StorageFactory
       * @param {type} paymentService
       * @param {type} $uibModal
       * @returns {undefined}
       */
        .controller('EmployeeStructureCtrl', ['$scope', 'groupsService', 'employeeService', 'browseService', '$state', 'campaignService', 'StorageFactory', 'paymentService', '$uibModal','alertService', function ($scope, groupsService, employeeService, browseService, $state, campaignService, StorageFactory, paymentService, $uibModal,alertService) {

                $scope.sidemenutoggled = false;
                $scope.togglesidemenu = function () {
                    var windowwith = $(window).width();
                    if (windowwith < 991) {
                        $scope.sidemenutoggled = !$scope.sidemenutoggled;

                    }

                };

                $scope.isLeftNaviElementActive = function (statename) {



                };

                $scope.customstyle = {
                    maincontentstyle: ""
                };

                $scope.deleteEmployee = function (id) {

                    $scope.deleteEmployees(id);
                };


                
                  $scope.getClassGroup = function(tet){
                    
//                    alert("CHECK GROUP");
                };
                $scope.isLeftNaviElementActive = function(tet){
                    
//                    alert("CHECK STRUCTURE");
                };


                //einzelne gruppe löschen
                $scope.deleteGroup = function (id) {
                    //get name of default group
                    var defaultTitle = "Standard Gruppe";
                    for (var i = 0; i < $scope.data.groups.length; i++) {
                        if ($scope.data.groups[i].isDefault == 1) {
                            defaultTitle = $scope.data.groups[i].title;
                        }
                    }

                    bootbox.confirm({
                        size: 'small',
                        message: "Möchten Sie diese Abteilung wirklich löschen?<br><br> <span class=\"schrift_rot text-bold\">ACHTUNG: Alle zugewiesenen Mitarbeiter werden der Abteilung \"" + defaultTitle + "\" zugewiesen.</span>",
                        buttons: {
                        'cancel': {
                            label: 'Abbrechen',
                            className: 'btn-default'
                        },
                        'confirm': {
                            label: 'Löschen',
                            className: 'btn-danger pull-right'
                        }
                    },
                        callback: function (result) {
                            if (result === true) {
                                groupsService.delete(id).then(function (res) {
                                    if (res.success === true) {
                                        //remove employee from selected list TODO wird hier nicht benötigt?
                                        for (var i = 0; i < $scope.data.selectedEmployees.length; i++) {
                                            if ($scope.data.selectedEmployees[i].id === id) {
                                                $scope.data.selectedEmployees.splice(i, 1);
                                            }
                                        }
                                        $state.go("base.employees.grouplist", {}, {reload: true});
                                    } else {
                                        alert("Abteilung konnte leider nicht gelöscht werden.");
                                    }
                                });
                            }
                        }
                    });
                };

                //mehrere Gruppen  löschen
                $scope.deleteGroups = function () {

                    //get name of default group
                    var defaultTitle = "Standard Gruppe";
                    for (var i = 0; i < $scope.data.groups.length; i++) {
                        if ($scope.data.groups[i].isDefault == 1) {
                            defaultTitle = $scope.data.groups[i].title;
                        }
                    }

                    bootbox.confirm({
                        size: 'small',
                        message: "Möchten Sie diese Abteilungen wirklich löschen? <br><br> <span class=\"schrift_rot text-bold\">ACHTUNG: Alle zugewiesenen Mitarbeiter werden der Abteilung \"" + defaultTitle + "\" zugewiesen.</span>",
                        buttons: {
                        'cancel': {
                            label: 'Abbrechen',
                            className: 'btn-default'
                        },
                        'confirm': {
                            label: 'Löschen',
                            className: 'btn-danger pull-right'
                        }
                    },
                        callback: function (result) {
                            if (result === true) {

                                //get all ids
                                var ids = [];
                                for (var i = 0; i < $scope.data.selectedGroups.length; i++) {
                                    ids.push($scope.data.selectedGroups[i].id);

                                }


                                groupsService.deleteMany(ids).then(function (res) {
                                    if (res.success === true) {
                                        //remove employee from selected list
                                        browseService.reload();
                                    } else {
                                        alert("Die Abteilungen konnten leider nicht gelöscht werden. Bitte versuchen Sie es erneut.");
                                    }
                                });
                            }
                        }
                    });
                };


                $scope.moveEmployeesToGroup = function (empArray, groupId) {

                    var ids = [];
                    for (var i = 0; i < empArray.length; i++) {
                        ids.push(empArray[i].id);
                    }
                    employeeService.moveToGroup(ids, groupId).then(function (data) {
                        if (data.success === true) {

                            if (ids.length > 1) {
                                alert("Alle Mitarbeiter wurden erfolgreich zur Abteilung hinzugefügt.");
                            } else {
                                alert("Abteilung wurde erfolgreich geändert.");
                            }

                            browseService.reload();
//                        $scope.initData();
                        } else {
                            alert("Abteilung konnte nicht geändert werden. Bitte wenden Sie sich an den Support falls weiterhin Probleme auftreten sollten.");
                            browseService.reload();
//                        $scope.initData();
                        }

                    });

                };




                $scope.resendInvitationSingle = function (id) {
                    if (!id) {
                        alert(Strings.errors.TECHNISCHER_FEHLER);
                    } else {
                        var ids = [];
                        ids.push({id: id});    //resend multiple does expect employee objects
                        $scope.resendInvitations(ids);
                    }
                };


                /**
                 * 
                 * @param {type} ids
                 * @returns {undefined}
                 */
                $scope.resendInvitations = function (ids) {
                    if (!ids || !Array.isArray(ids) || ids.length === 0) {
                        alert(Strings.errors.TECHNISCHER_FEHLER);
                    } else {
                        var empIdsToSend = [];
                        for (var i = 0; i < ids.length; i++) {
                            empIdsToSend.push(ids[i].id);
                        }
                        employeeService.resendInvitation(empIdsToSend).then(function (data) {

                            if (data.success === true) {
                                if (empIdsToSend.length > 1) {
                                    alertService.defaultSuccessMessage("Die Erinnerungen wurden versendet.");
                                } else {
                                    alertService.defaultSuccessMessage("Die Erinnerung wurde versendet.");
                                }

                            } else {
                                alert(Strings.errors.TECHNISCHER_FEHLER);
                            }

                        });
                    }
                };

                /*
                 * Wenn in der rechten sidebar die gruppe geändert wird
                 * @param {type} oldValue
                 * @param {type} empArray
                 * @param {type} groupId
                 * @returns {undefined}
                 */
                $scope.groupSidebarChanged = function (oldValue, empArray, groupId) {
                    var text;
                    if (empArray.length > 1) {
                        text = "Möchten Sie diese Mitarbeiter wirklich einer anderen Abteilung zuweisen?";
                    } else {
                        text = 'Möchten Sie den Mitarbeiter wirklich einer anderen Abteilung zuweisen?';
                    }
                    bootbox.confirm({
                        size: 'small',
                        message: text,
                        callback: function (result) {
                            if (result === true) {
                                //create ids


                                $scope.moveEmployeesToGroup(empArray, groupId);
                            } else {    //der vorherige Wert muss wieder gesetzt werden

                                $scope.$apply(function () {
                                    $scope.selected.selectedGroupForEmp = oldValue;

                                });




//                            $scope.$apply(function () {
//                                var found = false;
//                                for (var i = 0; i < $scope.data.campaigns.length; i++) {
//                                    if ($scope.data.campaigns[i].id == oldValue) {
////                                        $scope.$apply(function(){
//                                        $scope.selectedCampaign.selected = $scope.data.campaigns[i];
//                                        found = true;
//                                        break;
////                                        });
//                                    }
//
//                                }
//                                if (found === false) {    //wenn gruppe keine Kampagne hatte dann wird wieder leer selected
//                                    $scope.selectedCampaign.selected = {};
//                                }
//                            });
                            }
                        }
                    });



                };



                $scope.deleteEmployees = function (id) {
                    var ids = [];
                    if (!id) {    //mehrere markierte sollen gelöscht werden

                        for (var i = 0; i < $scope.data.selectedEmployees.length; i++) {
                            ids.push($scope.data.selectedEmployees[i].id);

                        }
                        if (ids.length === 0) {
                            alert("Bitte selektieren Sie mindestens einen Mitarbeiter.");
                            return;
                        }
                    } else {      //einzelner soll gelöscht werden mit übergebener id
                        ids.push(id);
                    }
//check ids


                    //wenn nutzer keine Subscription hat
                    paymentService.getUserStatus().then(function (data) {
                        if (data.hasSubscription === true) {
                            var modalInstance = $uibModal.open({
                                animation: true,
                                templateUrl: 'employees/modal/employee_delete_modal.html',
                                controller: 'EmployeeDeleteModalInstanceCtrl',
                                size: "md",
                                windowClass: 'employeeDeleteModal',
                                resolve: {
                                    empsToDelete: function () {
                                        return ids;
                                    }
                                }
                            });

                            modalInstance.result.then(function (wantsDeletion) {

                                browseService.reload();
                            }, function () {
                                alert("Mitarbeiter wurden nicht gelöscht");
                                browseService.reload();
                                //            
                            });

                        } else {
                            bootbox.confirm({
                                size: 'small',
                                message: 'Möchten Sie diese Mitarbeiter wirklich löschen?',
                                callback: function (result) {
                                    if (result === true) {
                                        //get all ids
                                        employeeService.deleteMany(ids).then(function (res) {
                                            if (res.success === true) {
                                             
                                            } else {
                                                alert("Mitarbeiter konnten leider nicht gelöscht werden.");
                                            }
                                             browseService.reload();
                                        });

                                    }

                                }
                            });
                        }

                    });
                };

//            $scope.deleteEmployees = function () {
//
//                bootbox.confirm({
//                    size: 'small',
//                    message: 'Möchten Sie diese Mitarbeiter wirklich löschen?',
//                    callback: function (result) {
//                        if (result === true) {
//                            //get all ids
//                            var ids = [];
//                            for (var i = 0; i < $scope.data.selectedEmployees.length; i++) {
//                                ids.push($scope.data.selectedEmployees[i].id);
//
//                            }
//
//                            employeeService.deleteMany(ids).then(function (res) {
//                                if (res.success === true) {
//                                    paymentService.removeEmployees(ids.length).then(function(){
//                                                alert("Ab Ihrer nächsten Abrechnung verringert sich Ihre Gebühr um 3.00 Euro Netto, insofern dieser Mitarbeiter nicht ohnehin in Ihrem Tarif enthalten war.");
//                                
//                                        
//                                    });
//                                    
//                                    browseService.reload();
//                                    
//                                    
//                                } else {
//                                    alert("Mitarbeiter konnten leider nicht gelöscht werden.");
//                                }
//                            });
//
//
//                        }
//                    }
//
//
//                });



//                };





                $scope.handleCampaignChanged = function (oldValue, campaignId, groupids) {
                    bootbox.confirm({
                        size: 'small',
                        message: 'Möchten Sie die Kampagne wirklich ändern?',
                        callback: function (result) {
                            if (result === true) {
                                //create ids


                                groupsService.setCampaign(groupids, campaignId).then(function (data) {
                                    if (data.success === true) {
                                        alert("Kampagne wurde erfolgreich zugewiesen.");
                                        $scope.reInitGroups();      //only data in detail view should be reloaded
                                        browseService.reload();
                                    } else {
                                        alert("Kampagne konnte nicht geändert werden. Bitte wenden Sie sich an den Support falls weiterhin Probleme auftreten sollten.");
                                        $scope.reInitGroups();     //only data in detail view should be reloaded
                                        browseService.reload();
                                    }
                                });
                            } else {    //der vorherige Wert muss wieder gesetzt werden
                                $scope.$apply(function () {
                                    var found = false;
                                    for (var i = 0; i < $scope.data.campaigns.length; i++) {
                                        if ($scope.data.campaigns[i].id == oldValue) {
//                                        $scope.$apply(function(){
                                            $scope.selectedCampaign.selected = $scope.data.campaigns[i];
                                            found = true;
                                            break;
//                                        });
                                        }

                                    }
                                    if (found === false) {    //wenn gruppe keine Kampagne hatte dann wird wieder leer selected
                                        $scope.selectedCampaign.selected = {};
                                    }
                                });
                            }
                        }
                    });

                };

                /**
                 * Wenn für die gruppe die Kampagne getauscht wird in der rechten sidebar
                 */
                $scope.campaignChangedSidebar = function (oldValue) {

                    var groupids = [];
                    for (var i = 0; i < $scope.data.selectedGroups.length; i++) {
                        groupids.push($scope.data.selectedGroups[i].id);
                    }
                    if (groupids.length === 0) {
                        return;
                    }

                    var newcampaign = $scope.selectedCampaign.selected.id;
                    if (newcampaign === oldValue) {
                        return false;
                    } else {
                        $scope.handleCampaignChanged(oldValue, newcampaign, groupids);
                    }
                };
                /**
                 * Wenn für die gruppe die Kampagne getauscht wird in der rechten sidebar
                 */
                $scope.campaignChangedDetails = function (oldValue) {

                    var newcampaign = $scope.selectedCampaign.selected.id;
                    if (newcampaign === oldValue) {
                        return false;
                    } else {
                        var groupId = [];
                        groupId.push($scope.data.groupDetail.id);
                        $scope.handleCampaignChanged(oldValue, newcampaign, groupId);
                    }
                };

                $scope.reInitGroups = function () {
                    groupsService.get().then(function (data) {


                        $scope.data.groups = data;


                        for (var i = 0; i < $scope.data.selectedGroups.length; i++) {

                            //die selektierten objekte werden ausgetauscht mit den aktualisierten
                            var ret = jQuery.grep($scope.data.groups, function (n, u) {
                                return (n.id === $scope.data.selectedGroups[i].id);
                            });
                            if (ret.length === 0) {
                                $scope.data.selectedGroups.splice(i, 1);     //objekt entfernen denn es wurde offenbar gelöscht
                            } else {
                                //selected group aktualisieren
                                $scope.data.selectedGroups[i] = ret[0];

                                $scope.selectedCampaign.selected = {
                                    title: ret[0].campaignTitle,
                                    id: ret[0].campaignId,
                                    color: ret[0].campaignColor,
                                    url: ret[0].campaignUrl,
                                    image: ret[0].campaignImage
                                };


                                //das aktuelle object auf der detailseite aktualisieren
                                if ($scope.data.groupDetail && $scope.data.groupDetail.id === ret[0].id) {
                                    $scope.data.groupDetail = ret[0];
                                }

                            }
                        }


                    });
                };


                $scope.showGroupDetails = function (id) {
                    $state.go('base.employees.groupdetails', {groupId: id});

                };



                $scope.showUserDetails = function (id) {
                    $state.go('base.employees.employeedetail', {employeeId: id});

                };

                $scope.showCampaignDetails = function (id) {
                    $state.go('base.campaigns.campaigndetail', {campaignId: id});

                };



                $scope.initDataParameters = function () {


                    StorageFactory.loadEmployeeGroupData($scope);

                };

                  $scope.employeeTotalDisplayed = 10;     //amount of rows to display till infinite scroll 

                $scope.initData = function () {


                    $scope.employeeTotalDisplayed = 10;     //reset infinite scroll

                    groupsService.get().then(function (data) {

                        //sort data on base of date and put without campaign to last

                        //sort on active campaign or not
                        var withoutCampaign = [];
                        var withCampaign = [];
                        for (var i = 0; i < data.length; i++) {
                            if (!data[i].campaignId) {
                                withoutCampaign.push(data[i]);
                            } else {
                                withCampaign.push(data[i]);
                            }
                        }




                        $scope.data.groups = withCampaign;
                        $scope.data.groups = $scope.data.groups.concat(withoutCampaign);


                        campaignService.get().then(function (data) {
                            $scope.data.campaigns = data;
                            employeeService.get().then(function (data) {
                                $scope.data.employees = data;


//                    data = data[0];     //because array it returned
//                    if (data && data.email && data.id) {

                                //in das selected employees array einfügen
                                for (var i = 0; i < $scope.data.selectedEmployees.length; i++) {

                                    //die selektierten objekte werden ausgetauscht mit den aktualisierten
                                    var ret = jQuery.grep($scope.data.employees, function (n, u) {
                                        return (n.id === $scope.data.selectedEmployees[i].id);
                                    });
                                    if (ret.length === 0) {
                                        $scope.data.selectedEmployees.splice(i, 1);     //objekt entfernen denn es wurde offenbar gelöscht
                                    } else {
                                        $scope.data.selectedEmployees[i] = ret[0];
                                        $scope.selected.selectedGroupForEmp = $scope.data.selectedEmployees[i].currentGroup.toString();
                                        //das aktuelle object aktualisieren
                                        $scope.employeeDetailData = ret[0];
                                    }
                                }
                                $scope.recalcAvatars();
                                $scope.initDataParameters();


//                    } else {
//                        alert(Strings.errors.DATEN_NICHT_GELADEN);
////                                  deferred.resolve(false);
//                    }
                            });

                        });
                    });







                };


                $scope.data = {
                    groups: [],
                    employees: [],
                    campaigns: [],
                    selectedEmployees: [],
                    selectedGroups: [],
                    groupDetail: {}
//                employeeDetail : {}

                };


                $scope.selectedCampaign = {
                    selected: {}
                };

                $scope.selected = {
                    selectedGroupForEmp: ""
                };


                $scope.rightSideContent = {
                    showEmployee: false,
                    showGroup: false

                };

//            setTimeout(function(){
//              var windowheight =  $(window).height();
//              $("#sidebar-wrapper").css("max-height" ,  windowheight + "px");
//            }, 1000);


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
        })
                
      
        
        ;

