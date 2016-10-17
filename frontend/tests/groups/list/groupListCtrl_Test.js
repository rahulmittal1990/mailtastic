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

        describe('CampaignListController controller', function() {



            it("should updateSelection from  CampaignListCtrl....", function() {
                $scope = {};
                if ($scope.customstyle == undefined) {
                    $scope.customstyle = {}
                }
                if ($scope.rightSideContent == undefined) {
                    $scope.rightSideContent = {}
                }
                if ($scope.data == undefined) {
                    $scope.data = {}
                }

                if ($scope.data.selectedCampaigns == undefined) {
                    $scope.data.selectedCampaigns = [];
                }
                var controller = $controller('CampaignListCtrl', {
                    $scope: $scope
                });

                var item = [{
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
                var $event = {

                    target: 'text'
                }
                $scope.updateSelection($event, item);
                var checkbox = $event.target;
                expect(checkbox).toEqual("text");


            });
            it("should getSelectedClass entity from  CampaignListCtrl....", function() {
                $scope = {};
                if ($scope.customstyle == undefined) {
                    $scope.customstyle = {}
                }
                if ($scope.rightSideContent == undefined) {
                    $scope.rightSideContent = {}
                }
                if ($scope.data == undefined) {
                    $scope.data = {}
                }

                if ($scope.data.selectedCampaigns == undefined) {
                    $scope.data.selectedCampaigns = [];
                }

                var controller = $controller('CampaignListCtrl', {
                    $scope: $scope
                });

                var entity = "false";

                $scope.getSelectedClass(entity);
                expect($scope.isSelected(entity)).toEqual(false);


            });

            it("should isSelectedAll from  CampaignListCtrl....", function() {
                $scope = {};
                if ($scope.customstyle == undefined) {
                    $scope.customstyle = {}
                }
                if ($scope.rightSideContent == undefined) {
                    $scope.rightSideContent = {}
                }
                if ($scope.data == undefined) {
                    $scope.data = {}
                }

                if ($scope.data.selectedCampaigns == undefined) {
                    $scope.data.selectedCampaigns = [];
                }

                var controller = $controller('CampaignListCtrl', {
                    $scope: $scope
                });


                $scope.data.selectedCampaigns = [{
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

                $scope.data.campaigns = [{
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

                $scope.isSelectedAll();
                expect($scope.data.selectedCampaigns.length).toEqual($scope.data.campaigns.length);


            });

            it("should selectAll from  CampaignListCtrl....", function() {
                $scope = {};
                if ($scope.customstyle == undefined) {
                    $scope.customstyle = {}
                }
                if ($scope.rightSideContent == undefined) {
                    $scope.rightSideContent = {}
                }
                if ($scope.data == undefined) {
                    $scope.data = {}
                }

                if ($scope.data.selectedCampaigns == undefined) {
                    $scope.data.selectedCampaigns = [];
                }

                var controller = $controller('CampaignListCtrl', {
                    $scope: $scope
                });


                $scope.data.campaignsToShow = [{
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

                var $event = {

                    target: "true"
                }
                var action;
                var entity;
                var updateSelected;
                $scope.selectAll($event)
                var checkbox = $event.target;
                expect(checkbox).toEqual("true");


            });

            it("should rowClicked from  CampaignListCtrl....", function() {
                $scope = {};
                if ($scope.customstyle == undefined) {
                    $scope.customstyle = {}
                }
                if ($scope.rightSideContent == undefined) {
                    $scope.rightSideContent = {}
                }
                if ($scope.data == undefined) {
                    $scope.data = {}
                }

                if ($scope.data.selectedCampaigns == undefined) {
                    $scope.data.selectedCampaigns = [];
                }

                var controller = $controller('CampaignListCtrl', {
                    $scope: $scope
                });


                $scope.data.selectedCampaigns = [{
                    "id": "6",
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

                var item = {
                    id: 4
                }
                var mode;
                $scope.rowClicked(item)
                var id = item.id;
                expect(id).toEqual(4);
                var mode = "add";
                for (var i = 0; i < $scope.data.selectedCampaigns.length; i++) {
                    if (id === $scope.data.selectedCampaigns[i].id) {
                        mode = "remove";
                        break;
                    }

                }
                expect(mode).toEqual("remove");



            });

            it("should rowClicked mode was add than pushed item in selectedCampaigns from  CampaignListCtrl....", function() {
                $scope = {};
                if ($scope.customstyle == undefined) {
                    $scope.customstyle = {}
                }
                if ($scope.rightSideContent == undefined) {
                    $scope.rightSideContent = {}
                }
                if ($scope.data == undefined) {
                    $scope.data = {}
                }

                if ($scope.data.selectedCampaigns == undefined) {
                    $scope.data.selectedCampaigns = [];
                }

                var controller = $controller('CampaignListCtrl', {
                    $scope: $scope
                });


                $scope.data.selectedCampaigns = [];

                var item = {
                    id: 4
                }
                var mode = "add";
                $scope.rowClicked(item)
                if (mode === "add") {
                    $scope.data.selectedCampaigns = [];
                    $scope.data.selectedCampaigns.push(item);


                }
                expect($scope.data.selectedCampaigns[0].id).toEqual(4);



            });

            it("should initData switch mode from  CampaignListCtrl....", function() {
                $scope = {};
                if ($scope.customstyle == undefined) {
                    $scope.customstyle = {}
                }
                if ($scope.rightSideContent == undefined) {
                    $scope.rightSideContent = {}
                }
                if ($scope.data == undefined) {
                    $scope.data = {}
                }

                if ($scope.data.selectedCampaigns == undefined) {
                    $scope.data.selectedCampaigns = [];
                }

                var controller = $controller('CampaignListCtrl', {
                    $scope: $scope
                });


                $scope.data.campaigns = 1;
                $scope.data.activeCampaigns = 2;
                $scope.data.inactiveCampaigns = 3;
                $scope.initData(mode)
                var mode = ['all', 'active', 'inactive']

                for (var i = mode.length - 1; i >= 0; i--) {

                    switch (mode[i]) {
                        case 'all':
                            $scope.data.campaignsToShow = $scope.data.campaigns;
                            expect($scope.data.campaignsToShow).toEqual(1)
                            break;
                        case 'active':
                            $scope.data.campaignsToShow = $scope.data.activeCampaigns;
                            expect($scope.data.campaignsToShow).toEqual(2)
                            break;
                        case 'inactive':
                            $scope.data.campaignsToShow = $scope.data.inactiveCampaigns;
                            expect($scope.data.campaignsToShow).toEqual(3)
                            break;
                    }
                }


            });

            it("should'nt initData  switch mode from  CampaignListCtrl....", function() {
                $scope = {};
                if ($scope.customstyle == undefined) {
                    $scope.customstyle = {}
                }
                if ($scope.rightSideContent == undefined) {
                    $scope.rightSideContent = {}
                }
                if ($scope.data == undefined) {
                    $scope.data = {}
                }

                if ($scope.data.selectedCampaigns == undefined) {
                    $scope.data.selectedCampaigns = [];
                }

                var controller = $controller('CampaignListCtrl', {
                    $scope: $scope
                });

                $scope.data.campaigns = 1;
                $scope.data.activeCampaigns = 2;
                $scope.data.inactiveCampaigns = 3;
                $scope.initData(mode)
                var mode = ['messi', 'sam', 'neymar']

                for (var i = mode.length - 1; i >= 0; i--) {

                    switch (mode[i]) {
                        case 'all':
                            $scope.data.campaignsToShow = $scope.data.campaigns;
                            expect($scope.data.campaignsToShow).not.toEqual(1)
                            break;
                        case 'active':
                            $scope.data.campaignsToShow = $scope.data.activeCampaigns;
                            expect($scope.data.campaignsToShow).not.toEqual(2)
                            break;
                        case 'inactive':
                            $scope.data.campaignsToShow = $scope.data.inactiveCampaigns;
                            expect($scope.data.campaignsToShow).not.toEqual(3)
                            break;
                    }
                }


            });




        });


    });