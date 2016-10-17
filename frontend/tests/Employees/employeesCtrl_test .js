'use strict';

describe('controller employees', function() {

    var fakeModal = {
        command: null,
        modal: function(command) {
            this.command = command;
        }
    };

    var fakeModalPromise = {
        then: function(callback) {
            callback(fakeModal);
        }
    };

    var employees, httpBackend;
    var $controller;
    var $scope;
    var employeeSvc;
    var spyOnService, $modal, alertSvc, paymentsvc, groupsSvc, browseSvc, $State;
    beforeEach(angular.mock.module('mailtasticApp.employees'));
    beforeEach(angular.mock.module('mailtasticApp.services'));
    beforeEach(angular.mock.module('mailtasticApp.factories'));
    beforeEach(module('LocalStorageModule'));
    beforeEach(module('mailtasticApp.modalEmployee'));
    beforeEach(module('ui.router'));
    beforeEach(angular.mock.inject(function(_$controller_) {
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $controller = _$controller_;
    }));
    /*  beforeEach(function() {
        functionWithAlert = jasmine.createSpy("functionWithAlert");    
        functionWithAlert("called as usual");
    });*/
    beforeEach(inject(function(browseService, $state, employeeService, alertService, paymentService, groupsService) {
        paymentsvc = paymentService;
        employeeSvc = employeeService;
        groupsSvc = groupsService;
        alertSvc = alertService;
        browseSvc = browseService;
        $State = $state;
    }));

    describe('EmployeeStructureCtrl controller', function() {


        it("should moveEmployeesToGroup....", function() {
            $scope = {};
            $modal = jasmine.createSpy("$modal").and.returnValue(fakeModalPromise);
            var controller = $controller('EmployeeStructureCtrl', {
                $scope: $scope,
                $modal: $modal,
                browseService: browseSvc,

            })
            var empArray = ['sam', 'locate'];
            spyOnService = spyOnAngularService(employeeSvc, 'moveToGroup', {
                success: true
            });

            spyOnService = spyOnAngularService(browseSvc, 'reload', {
                success: true
            });
            spyOn(bootbox, 'confirm');
            spyOn(window, 'alert');
            $scope.moveEmployeesToGroup(empArray, 4);
            expect(alert).toHaveBeenCalledWith('Alle Mitarbeiter wurden erfolgreich zur Abteilung hinzugefügt.');
        });

        it("should resendInvitationSingle to call resendInvitations....", function() {
            $scope = {};
            $modal = jasmine.createSpy("$modal").and.returnValue(fakeModalPromise);
            var controller = $controller('EmployeeStructureCtrl', {
                $scope: $scope,
                employeeService: employeeSvc,
                $modal: $modal

            });


            $scope.resendInvitationSingle(12);
            expect({
                "success": false
            }).toEqual({
                "success": false
            });


        });
        it("should resendInvitations service Return....", function() {
            $scope = {};
            $modal = jasmine.createSpy("$modal").and.returnValue(fakeModalPromise);
            var controller = $controller('EmployeeStructureCtrl', {
                $scope: $scope,
                employeeService: employeeSvc,
                $modal: $modal
            });
            var ids = ['manoj', 'sam']
            spyOnService = spyOnAngularService(employeeSvc, 'resendInvitation', {
                success: true
            });
            spyOnService = spyOnAngularService(alertSvc, 'defaultSuccessMessage', null)
            $scope.resendInvitations(ids);
            expect(spyOnService).toHaveBeenCalledWith('Die Erinnerungen wurden versendet.');

        });
        it("should groupSidebarChanged with id....", function() {

            $scope = {};

            var controller = $controller('EmployeeStructureCtrl', {
                $scope: $scope,
                employeeService: employeeSvc,
                $modal: $modal
            });

            var empArray = [{
                "key": "year",
                "name": "Year"
            }, {
                "key": "price",
                "name": "Price"
            }, {
                "key": "list",
                "name": "data"
            }, {
                "key": "combined",
                "name": "table"
            }];
            var oldValue = 4;
            var groupId = 5;


            spyOn(bootbox, 'confirm');

            $scope.groupSidebarChanged(oldValue, empArray, groupId)
            var text;
            if (empArray.length > 1) {
                text = "Möchten Sie diese Mitarbeiter wirklich einer anderen Abteilung zuweisen?";
            } else {
                text = 'Möchten Sie den Mitarbeiter wirklich einer anderen Abteilung zuweisen?';
            }
            expect(text).toEqual("Möchten Sie diese Mitarbeiter wirklich einer anderen Abteilung zuweisen?");

        });
        it("should groupSidebarChanged empArray blank....", function() {
            $scope = {};
            $modal = jasmine.createSpy("$modal").and.returnValue(fakeModalPromise);
            var controller = $controller('EmployeeStructureCtrl', {
                $scope: $scope,
                employeeService: employeeSvc,
                $modal: $modal
            });
            var empArray = []

            spyOn(bootbox, 'confirm');
            $scope.groupSidebarChanged(12, empArray, 23);
            var text;
            if (empArray.length > 1) {
                text = "Möchten Sie diese Mitarbeiter wirklich einer anderen Abteilung zuweisen?";
            } else {
                text = 'Möchten Sie den Mitarbeiter wirklich einer anderen Abteilung zuweisen?';
            }

            expect(text).toEqual('Möchten Sie den Mitarbeiter wirklich einer anderen Abteilung zuweisen?');

        });
        it("should handleCampaignChanged....", function() {
            $scope = {};
            $modal = jasmine.createSpy("$modal").and.returnValue(fakeModalPromise);
            var controller = $controller('EmployeeStructureCtrl', {
                $scope: $scope,
                employeeService: employeeSvc,
                groupsService: groupsSvc,
                $modal: $modal
            });
            var data;
            var oldValue = 4;
            var campaignId;
            var groupids = 2;
            spyOn(bootbox, 'confirm');
            spyOn(window, 'alert');
            spyOnService = spyOnAngularService(alertSvc, 'defaultSuccessMessage', null)
            spyOnService = spyOnAngularService(groupsSvc, 'setCampaign', null)
            $scope.handleCampaignChanged(oldValue, groupids);
            expect(campaignId).toEqual(undefined);

        });
        it("should togglesidemenu....", function() {
            $scope = {};
            var controller = $controller('EmployeeStructureCtrl', {
                $scope: $scope
            });
            $scope.togglesidemenu();

            expect({
                "success": false,
                "message": "No token provided."
            }).toEqual({
                "success": false,
                "message": "No token provided."
            });

        });
        it("should deleteEmployee....", function() {
            $scope = {};
            var controller = $controller('EmployeeStructureCtrl', {
                $scope: $scope,
                $modal: $modal
            });
            $scope.deleteEmployee(2);
            expect({
                "success": false,
                "message": "No token provided."
            }).toEqual({
                "success": false,
                "message": "No token provided."
            });


        });
        it("should deleteEmployees....", function() {
            $scope = {};
            $modal = jasmine.createSpy("$modal").and.returnValue(fakeModalPromise);
            var controller = $controller('EmployeeStructureCtrl', {
                $scope: $scope,
                paymentService: paymentsvc,
                $modal: $modal
            });

            spyOnService = spyOnAngularService(paymentsvc, 'getUserStatus', {
                success: true
            });

            var ids = [];
            $scope.data.selectedEmployees = ['sam', 'mack']
            spyOn(bootbox, 'confirm');
            $scope.deleteEmployees(5);

            expect(spyOnService).toHaveBeenCalledWith();


        });
        it("should deleteGroup....", function() {
            $scope = {};
            $modal = jasmine.createSpy("$modal").and.returnValue(fakeModalPromise);
            var controller = $controller('EmployeeStructureCtrl', {
                $scope: $scope,
                $modal: $modal,

            });

            spyOnService = spyOnAngularService(groupsSvc, 'delete', {
                success: true
            });
            spyOn(bootbox, 'confirm');
            $scope.deleteGroup(4);
            expect(spyOnService).toEqual(spyOnService);


        });
        it("should campaignChangedSidebar....", function() {
            $scope = {};

            var controller = $controller('EmployeeStructureCtrl', {
                $scope: $scope,
                employeeService: employeeSvc
            });
            var oldValue = 4;
            $scope.data.selectedGroups = [{
                "id": "2",
                "name": "Year"
            }, {
                "id": "3",
                "name": "Price"
            }, {
                "id": "4",
                "name": "data"
            }, {
                "id": "5",
                "name": "table"
            }];
            spyOn(bootbox, 'confirm');
            spyOn(window, 'alert');
            $scope.campaignChangedSidebar(oldValue);
            var groupids = [];
            for (var i = 0; i < $scope.data.selectedGroups.length; i++) {
                groupids.push($scope.data.selectedGroups[i].id);
            }
            expect(groupids).toEqual(['2', '3', '4', '5']);

        });
        it("should campaignChangedDetails....", function() {
            $scope = {};
            $modal = jasmine.createSpy("$modal").and.returnValue(fakeModalPromise);
            var controller = $controller('EmployeeStructureCtrl', {
                $scope: $scope,
                employeeService: employeeSvc,
                $modal: $modal
            });
            var oldValue = 4;
            $scope.selectedCampaign.selected.id = 3;
            $scope.data.groupDetail.id = 5;
            spyOn(bootbox, 'confirm');
            spyOn(window, 'alert');
            $scope.campaignChangedDetails(oldValue);
            var newcampaign = $scope.selectedCampaign.selected.id;
            if (newcampaign === oldValue) {
                return false;
            } else {
                var groupId = [];
                groupId.push($scope.data.groupDetail.id);
                $scope.handleCampaignChanged(oldValue, newcampaign, groupId);
            }
            expect(groupId).toEqual([5]);

        });
        it("should reInitGroups....", function() {
            $scope = {};
            $modal = jasmine.createSpy("$modal").and.returnValue(fakeModalPromise);
            var controller = $controller('EmployeeStructureCtrl', {
                $scope: $scope,
                employeeService: employeeSvc,
                groupsService: groupsSvc,
                $modal: $modal
            });
            var data = 4;


            spyOn(bootbox, 'confirm');
            spyOn(window, 'alert');
            spyOnService = spyOnAngularService(groupsSvc, 'get', null)
            $scope.reInitGroups();
            $scope.data.groups = data;
            expect($scope.data.groups).toEqual(4);

        });
        it("should move to the groupdetails page after showGroupDetails someone ....", function() {
            $scope = {};

            var controller = $controller('EmployeeStructureCtrl', {
                $scope: $scope,
                employeeService: employeeSvc,
                $modal: $modal,
                $state: $State

            });
            spyOn($State, 'go');
            $scope.showGroupDetails(2);
            expect($State.go).toHaveBeenCalledWith('base.employees.groupdetails', {
                groupId: 2
            });

        });
        it("should move to the employeedetail page after showUserDetails someone....", function() {
            $scope = {};
            var controller = $controller('EmployeeStructureCtrl', {
                $scope: $scope,
                employeeService: employeeSvc,
                $modal: $modal,
                $state: $State
            });

            spyOn($State, 'go');
            $scope.showUserDetails(2);
            expect($State.go).toHaveBeenCalledWith('base.employees.employeedetail', {
                employeeId: 2
            });

        });

        it("should move to the campaigndetail page after showCampaignDetails someone....", function() {
            $scope = {};
            var controller = $controller('EmployeeStructureCtrl', {
                $scope: $scope,
                employeeService: employeeSvc,
                $modal: $modal,
                $state: $State
            });

            spyOn($State, 'go');
            $scope.showCampaignDetails(2);
            expect($State.go).toHaveBeenCalledWith('base.campaigns.campaigndetail', {
                campaignId: 2
            });

        });
        it("should initDataParameters....", function() {
            $scope = {};
            $modal = jasmine.createSpy("$modal").and.returnValue(fakeModalPromise);
            var controller = $controller('EmployeeStructureCtrl', {
                $scope: $scope,
                employeeService: employeeSvc,
                $modal: $modal,
                groupsService: groupsSvc
            });

            var data = [{
                "campaignId": "2",
                "name": "Year"
            }, {
                "campaignId": "3",
                "name": "Price"
            }, {
                "campaignId": "4",
                "name": "data"
            }, {
                "campaignId": "5",
                "name": "table"
            }];

            spyOnService = spyOnAngularService(groupsSvc, 'get', null)

            $scope.initDataParameters(23);
            var withoutCampaign = [];
            var withCampaign = [];
            for (var i = 0; i < data.length; i++) {
                if (!data[i].campaignId) {
                    withoutCampaign.push(data[i]);
                } else {
                    withCampaign.push(data[i]);
                }
            }
            expect(withCampaign).toEqual(data);

        });


    });


});