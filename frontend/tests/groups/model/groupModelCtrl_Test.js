    'use strict';

    describe('mailtasticApp.campaigns', function() {



        var employees, httpBackend;
        var $controller;
        var $scope;
        var browserSvc;
        var employeeSvc;
        var spyOnService, $modal, alertSvc, paymentsvc, groupsSvc, browseSvc, $State, userSvc, campaignSvc;
        beforeEach(angular.mock.module('mailtasticApp.campaigns'));
        beforeEach(angular.mock.module('mailtasticApp.services'));
        beforeEach(angular.mock.module('mailtasticApp.factories'));
        beforeEach(module('LocalStorageModule'));

        beforeEach(module('ui.router'));
        beforeEach(angular.mock.inject(function(_$controller_) {
            // The injector unwraps the underscores (_) from around the parameter names when matching
            $controller = _$controller_;
        }));
        beforeEach(inject(function(browseService, campaignService, $state, userService, employeeService, alertService, paymentService, groupsService, browserService) {
            browserSvc = browserService;
            paymentsvc = paymentService;
            employeeSvc = employeeService;
            groupsSvc = groupsService;
            alertSvc = alertService;
            browseSvc = browseService;
            $State = $state;
            userSvc = userService;
            campaignSvc = campaignService;
        }));

        describe('compaignsController controller', function() {

            it("should customstyle from controller....", function() {
                $scope = {};
                var controller = $controller('CampaignsCtrl', {
                    $scope: $scope
                });

                expect($scope.customstyle.maincontentstyle).toEqual("");

            });
            it("should deleteGroup from groups....", function() {
                $scope = {};
                var controller = $controller('CampaignsCtrl', {
                    $scope: $scope
                });
                var res = {
                    success: true
                }
                spyOn(bootbox, 'confirm');
                spyOnService = spyOnAngularService(groupsSvc, 'delete', res.success === true);
                spyOnService = spyOnAngularService(browseSvc, 'reload', true);
                $scope.deleteGroup(4);

                expect(spyOnService).not.toBeNull();

            });

            it("should deleteGroups from groups....", function() {
                $scope = {};
                var controller = $controller('CampaignsCtrl', {
                    $scope: $scope
                });
                spyOn(bootbox, 'confirm');
                spyOnService = spyOnAngularService(groupsSvc, 'deleteMany', true);
                $scope.deleteGroups(4);

                expect(spyOnService).not.toBeNull();

            });
            it("should selectedGroupForCampaign....", function() {
                $scope = {};
                var controller = $controller('CampaignsCtrl', {
                    $scope: $scope
                });


                expect($scope.data.selectedGroupForCampaign).toEqual("All");

            });
            it("should removeCampaignOfGroups from groups....", function() {
                $scope = {};
                var controller = $controller('CampaignsCtrl', {
                    $scope: $scope
                });
                spyOn(bootbox, 'confirm');
                spyOnService = spyOnAngularService(groupsSvc, 'deleteMany', true);
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
                $scope.removeCampaignOfGroups();
                var groupArray = [];
                for (var i = 0; i < $scope.data.selectedGroups.length; i++) {
                    groupArray.push($scope.data.selectedGroups[i].id);
                }

                expect(groupArray).toEqual(['2', '3', '4', '5']);

            });
            it("should removeCampaignOfGroup from group....", function() {
                $scope = {};
                var controller = $controller('CampaignsCtrl', {
                    $scope: $scope
                });
                spyOn(bootbox, 'confirm');
                spyOnService = spyOnAngularService(groupsSvc, 'setCampaign', true);
                var groupId = [{
                    "id": "2",
                    "name": "Year"
                }];
                $scope.removeCampaignOfGroup(groupId);

                var groupArray = [];
                groupArray.push(groupId);
                expect(groupArray[0]).toEqual([{
                    "id": "2",
                    "name": "Year"
                }]);

            });

            it("should getTimes....", function() {
                $scope = {};
                var controller = $controller('CampaignsCtrl', {
                    $scope: $scope
                });
                var values = ["Banana", "Orange", "Lemon", "Apple", "Mango"];
                var n = 3;
                $scope.getTimes(values, n);
                return values.slice(0, n);

                expect(values).toEqual(Banana, Orange, Lemon);

            });

            it("should move to the groupdetails page after showGroupDetails someone ....", function() {
                $scope = {};

                var controller = $controller('CampaignsCtrl', {
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

            it("should move to the campaigndetail page after showCampaignDetails someone ....", function() {
                $scope = {};

                var controller = $controller('CampaignsCtrl', {
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

            it("should addCampaignToGroup groupId....", function() {
                $scope = {};
                var controller = $controller('CampaignsCtrl', {
                    $scope: $scope
                });
                spyOn(window, 'alert');
                spyOn(bootbox, 'confirm');
                spyOnService = spyOnAngularService(groupsSvc, 'setCampaign', true);
                var groupId = "All"
                var campaignId = "as"
                $scope.addCampaignToGroup(groupId, campaignId);
                expect(alert).toHaveBeenCalledWith("Bitte wählen Sie zuerst eine Abteilung aus.");



            });

            it("should addCampaignToGroup with bootbox....", function() {
                $scope = {};
                var controller = $controller('CampaignsCtrl', {
                    $scope: $scope
                });
                var groupId = "All"

                var result;
                spyOn(window, 'alert');
                spyOn(bootbox, 'confirm');
                spyOnService = spyOnAngularService(groupsSvc, 'setCampaign', true);
                var campaignId = "null"
                $scope.addCampaignToGroup(groupId, campaignId);
                var groupsarray = [];
                groupsarray.push(groupId);
                expect(groupsarray[0]).toEqual("All")


            });

            it("should campaignChangedSidebar....", function() {
                $scope = {};

                var controller = $controller('CampaignsCtrl', {
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

            it("should handleCampaignChanged....", function() {
                $scope = {};

                var controller = $controller('CampaignsCtrl', {
                    $scope: $scope,
                    employeeService: employeeSvc
                });
                var oldValue = 4;
                var campaignId = 1;
                var groupids = 3;

                spyOn(bootbox, 'confirm');
                spyOn(window, 'alert');
                spyOnService = spyOnAngularService(groupsSvc, 'setCampaign', true);
                $scope.handleCampaignChanged(oldValue);

                expect(spyOnService).toEqual(spyOnService);

            });

            it("should unusedGroups from  activeGroups....", function() {
                $scope = {};

                var controller = $controller('CampaignsCtrl', {
                    $scope: $scope,
                    employeeService: employeeSvc
                });
                var unusedGroups = [];
                var n;
                var u;
                $scope.data.groups = [{
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
                var activeGroups = "null";
                $scope.unusedGroups(activeGroups, $scope.data.groups);
                expect(unusedGroups[0]).toEqual($scope.data.groups.id);

            });

            it("should initData from  campaignService....", function() {
                $scope = {};

                var controller = $controller('CampaignsCtrl', {
                    $scope: $scope,
                    employeeService: employeeSvc,
                    campaignService: campaignSvc

                });

                var campaigns;
                $scope.data.activeCampaigns = [];
                $scope.data.inactiveCampaigns = [];
                $scope.campaigns = [{
                    "activegroups": "",
                    "name": "Year"
                }, {
                    "activegroups": "3",
                    "name": "Price"
                }, {
                    "activegroups": "4",
                    "name": "data"
                }, {
                    "activegroups": "5",
                    "name": "table"
                }];
                spyOnService = spyOnAngularService(campaignSvc, 'get', $scope.campaigns);
                $scope.initData($scope.campaigns);
                expect($scope.data.inactiveCampaigns[0]).toEqual($scope.campaigns[0]);
                expect($scope.data.activeCampaigns[2]).toEqual($scope.campaigns[3]);


            });

            it("should deleteCampaign from  campaignService....", function() {
                $scope = {};
                var result;
                var res = {
                    message: true
                }
                var controller = $controller('CampaignsCtrl', {
                    $scope: $scope,
                    employeeService: employeeSvc,
                    campaignService: campaignSvc,
                    browseService: browseSvc

                });
                spyOn(bootbox, 'confirm', result === true);
                spyOnService = spyOnAngularService(campaignSvc, 'delete', res.message === true);
                spyOnService = spyOnAngularService(browseSvc, 'reload', true);
                $scope.deleteCampaign(4);
                expect(res.message).toEqual(true);


            });

            it("should deleteCampaigns from  campaignService....", function() {
                $scope = {};
                var result;
                var res = {
                    message: true
                }
                var controller = $controller('CampaignsCtrl', {
                    $scope: $scope,
                    employeeService: employeeSvc,
                    campaignService: campaignSvc,
                    browseService: browseSvc

                });
                spyOn(bootbox, 'confirm', result === true);
                spyOnService = spyOnAngularService(campaignSvc, 'delete', res.message === true);
                spyOnService = spyOnAngularService(browseSvc, 'reload', true);
                $scope.deleteCampaigns(4);
                expect(res.message).toEqual(true);


            });



        });


    });