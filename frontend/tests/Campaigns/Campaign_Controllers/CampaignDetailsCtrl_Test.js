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

        describe('CampaignDetailsController controller', function() {


            it("should checkIfGroupIsAttached from  CampaignDetailsController....", function() {
                $scope = {};
                if ($scope.rightSideContent == undefined) {
                    $scope.rightSideContent = {}
                }
                if ($scope.customstyle == undefined) {
                    $scope.customstyle = {}
                }
                if ($scope.lineGraph == undefined) {
                    $scope.lineGraph = {}
                }
                if ($scope.campaignDetailData == undefined) {
                    $scope.campaignDetailData = {}
                }
                
                spyOn($State, 'go');
                var controller = $controller('CampaignDetailsCtrl', {
                    $scope: $scope,
                    browserService: browserSvc
                });

                $scope.campaignDetailData.activegroups = {

                    id: 4
                };
                var id = 4;
                var array = []
                $scope.checkIfGroupIsAttached(id);

                expect(array.length).toEqual(0);


            });

            it("should searchPotGroups from  CampaignDetailsController....", function() {
                $scope = {};
                if ($scope.rightSideContent == undefined) {
                    $scope.rightSideContent = {}
                }
                if ($scope.customstyle == undefined) {
                    $scope.customstyle = {}
                }
                if ($scope.lineGraph == undefined) {
                    $scope.lineGraph = {}
                }
                if ($scope.campaignDetailData == undefined) {
                    $scope.campaignDetailData = {}
                }
                spyOn($State, 'go');
                var controller = $controller('CampaignDetailsCtrl', {
                    $scope: $scope,
                    browserService: browserSvc,
                    groupsService: groupsSvc
                });

                spyOnService = spyOnAngularService(groupsSvc, 'delete', true);
                $scope.searchPotGroups();
                expect($scope.campaignGroups.length).toEqual(0);


            });

            it("should initCampaign from  CampaignDetailsController....", function() {
                $scope = {};
                if ($scope.rightSideContent == undefined) {
                    $scope.rightSideContent = {}
                }
                if ($scope.customstyle == undefined) {
                    $scope.customstyle = {}
                }
                if ($scope.lineGraph == undefined) {
                    $scope.lineGraph = {}
                }
                if ($scope.campaignDetailData == undefined) {
                    $scope.campaignDetailData = {}
                }
                spyOn($State, 'go');
                var controller = $controller('CampaignDetailsCtrl', {
                    $scope: $scope,
                    browserService: browserSvc,
                    groupsService: groupsSvc
                });
                var initCampaign;

                spyOnService = spyOnAngularService(groupsSvc, 'delete', true);

                expect($State.go).toHaveBeenCalledWith("base.campaigns.campaignlist", {}, {
                    reload: true
                });


            });



            it("should initCampaign from  CampaignDetailsController....", function() {
                $scope = {};
                if ($scope.rightSideContent == undefined) {
                    $scope.rightSideContent = {}
                }
                if ($scope.customstyle == undefined) {
                    $scope.customstyle = {}
                }
                if ($scope.lineGraph == undefined) {
                    $scope.lineGraph = {}
                }
                if ($scope.campaignDetailData == undefined) {
                    $scope.campaignDetailData = {}
                }
                spyOn($State, 'go');
                var controller = $controller('CampaignDetailsCtrl', {
                    $scope: $scope,
                    browserService: browserSvc,
                    groupsService: groupsSvc
                });
                $scope.data = {
                    selectedCampaigns: [{
                        "id": 4,
                        "activegroups": "Year"
                    }, {
                        "id": 3,
                        "activegroups": "Price"
                    }, {
                        "id": 6,
                        "activegroups": "data"
                    }, {
                        "id": 5,
                        "activegroups": "table"
                    }]
                };
                var campaignId = 6;
                var deferred = {
                    resolve: ''
                }

                spyOnService = spyOnAngularService(groupsSvc, 'delete', true);
                for (var i = 0; i < $scope.data.selectedCampaigns.length; i++) {

                    if ($scope.data.selectedCampaigns[i].id === campaignId) {
                        $scope.campaignDetailData = $scope.data.selectedCampaigns[i];
                        $scope.campaignGroups = $scope.campaignDetailData.activegroups;
                        break;
                    }
                }

                $scope.initData()
                expect($scope.data.selectedCampaigns[2].id).toEqual(campaignId);
                expect($scope.campaignGroups).toEqual("data");


            });

            it("should scope.Math inhetiate values from window.Math from  CampaignDetailsController....", function() {
                $scope = {};
                if ($scope.rightSideContent == undefined) {
                    $scope.rightSideContent = {}
                }
                if ($scope.customstyle == undefined) {
                    $scope.customstyle = {}
                }
                if ($scope.lineGraph == undefined) {
                    $scope.lineGraph = {}
                }
                if ($scope.campaignDetailData == undefined) {
                    $scope.campaignDetailData = {}
                }
                spyOn($State, 'go');
                var controller = $controller('CampaignDetailsCtrl', {
                    $scope: $scope,
                    browserService: browserSvc,
                    groupsService: groupsSvc
                });
                expect($scope.Math.E).toEqual(2.718281828459045);
                expect($scope.Math.LN10).toEqual(2.302585092994046);
                expect($scope.Math.LN2).toEqual(0.6931471805599453);
                expect($scope.Math.LOG2E).toEqual(1.4426950408889634);
                expect($scope.Math.LOG10E).toEqual(0.4342944819032518);
                expect($scope.Math.PI).toEqual(3.141592653589793);
                expect($scope.Math.SQRT1_2).toEqual(0.7071067811865476);
                expect($scope.Math.SQRT2).toEqual(1.4142135623730951);


            });
            it("should calculate campaignlist from  CampaignDetailsController....", function() {
                $scope = {};
                if ($scope.rightSideContent == undefined) {
                    $scope.rightSideContent = {}
                }
                if ($scope.customstyle == undefined) {
                    $scope.customstyle = {}
                }
                if ($scope.lineGraph == undefined) {
                    $scope.lineGraph = {}
                }
                if ($scope.campaignDetailData == undefined) {
                    $scope.campaignDetailData = {}
                }
                spyOn($State, 'go');
                var controller = $controller('CampaignDetailsCtrl', {
                    $scope: $scope,
                    browserService: browserSvc,
                    groupsService: groupsSvc
                });
                expect($scope.campaignList.data.length).toEqual(undefined);


            });



            it("should lineGraph have click data from  CampaignDetailsController....", function() {
                $scope = {};
                if ($scope.rightSideContent == undefined) {
                    $scope.rightSideContent = {}
                }
                if ($scope.customstyle == undefined) {
                    $scope.customstyle = {}
                }
                if ($scope.lineGraph == undefined) {
                    $scope.lineGraph = {}
                }
                if ($scope.campaignDetailData == undefined) {
                    $scope.campaignDetailData = {}
                }
                spyOn($State, 'go');
                var controller = $controller('CampaignDetailsCtrl', {
                    $scope: $scope,
                    browserService: browserSvc,
                    groupsService: groupsSvc
                });
                expect($scope.lineGraph.clickData.length).toEqual(0);



            });

            it("should lineGraph have currentLineToDraw data from  CampaignDetailsController....", function() {
                $scope = {};
                if ($scope.rightSideContent == undefined) {
                    $scope.rightSideContent = {}
                }
                if ($scope.customstyle == undefined) {
                    $scope.customstyle = {}
                }
                if ($scope.lineGraph == undefined) {
                    $scope.lineGraph = {}
                }
                if ($scope.campaignDetailData == undefined) {
                    $scope.campaignDetailData = {}
                }
                spyOn($State, 'go');
                var controller = $controller('CampaignDetailsCtrl', {
                    $scope: $scope,
                    browserService: browserSvc,
                    groupsService: groupsSvc
                });
                expect($scope.lineGraph.currentLineToDraw).toEqual(0);



            });

            it("should lineGraph have dataToShow in labels from  CampaignDetailsController....", function() {
                $scope = {};
                if ($scope.rightSideContent == undefined) {
                    $scope.rightSideContent = {}
                }
                if ($scope.customstyle == undefined) {
                    $scope.customstyle = {}
                }
                if ($scope.lineGraph == undefined) {
                    $scope.lineGraph = {}
                }
                if ($scope.campaignDetailData == undefined) {
                    $scope.campaignDetailData = {}
                }
                spyOn($State, 'go');
                var controller = $controller('CampaignDetailsCtrl', {
                    $scope: $scope,
                    browserService: browserSvc,
                    groupsService: groupsSvc
                });
                expect($scope.lineGraph.dataToShow.labels[0]).toEqual("Monday");
                expect($scope.lineGraph.dataToShow.labels[1]).toEqual("Tuesday");
                expect($scope.lineGraph.dataToShow.labels[2]).toEqual("Wednesday");
                expect($scope.lineGraph.dataToShow.labels[3]).toEqual("Thursday");
                expect($scope.lineGraph.dataToShow.labels[4]).toEqual("Friday");

            });

            it("should lineGraph have dataToShow in series from  CampaignDetailsController....", function() {
                $scope = {};
                if ($scope.rightSideContent == undefined) {
                    $scope.rightSideContent = {}
                }
                if ($scope.customstyle == undefined) {
                    $scope.customstyle = {}
                }
                if ($scope.lineGraph == undefined) {
                    $scope.lineGraph = {}
                }
                if ($scope.campaignDetailData == undefined) {
                    $scope.campaignDetailData = {}
                }
                spyOn($State, 'go');
                var controller = $controller('CampaignDetailsCtrl', {
                    $scope: $scope,
                    browserService: browserSvc,
                    groupsService: groupsSvc
                });
                expect($scope.lineGraph.dataToShow.series[0]).toEqual([0, 0, 0, 0, 0]);
                expect($scope.lineGraph.dataToShow.series[1]).toEqual([0, 0, 0, 0, 0]);
                expect($scope.lineGraph.dataToShow.series[2]).toEqual([0, 0, 0, 0, 0]);


            });

            it("should lineGraph have events in draw name from  CampaignDetailsController....", function() {
                $scope = {};
                if ($scope.rightSideContent == undefined) {
                    $scope.rightSideContent = {}
                }
                if ($scope.customstyle == undefined) {
                    $scope.customstyle = {}
                }
                if ($scope.lineGraph == undefined) {
                    $scope.lineGraph = {}
                }
                if ($scope.campaignDetailData == undefined) {
                    $scope.campaignDetailData = {}
                }
                spyOn($State, 'go');
                var controller = $controller('CampaignDetailsCtrl', {
                    $scope: $scope,
                    browserService: browserSvc,
                    groupsService: groupsSvc
                });
                expect($scope.lineGraph.events.draw.name).toEqual("draw");

            });

            /* it("should dateRangeChanged CampaignDetailsController....", function() {
                $scope = {};
                if ($scope.rightSideContent == undefined){
                    $scope.rightSideContent = {}
                }
                 if ($scope.customstyle == undefined){
                    $scope.customstyle = {}
                }
                 if ($scope.lineGraph == undefined){
                     $scope.lineGraph = {}
                }
                if ($scope.campaignDetailData == undefined){
                     $scope.campaignDetailData = {}
                }
                spyOn($State, 'go');
                var controller = $controller('CampaignDetailsCtrl', {
                    $scope: $scope,
                    browserService:browserSvc,
                    groupsService:groupsSvc,
                    campaignService:campaignSvc
                });
                $scope.lineGraph.viewData = 4;
                var picker = {
                    startDate:'24/07/1994',
                    endDate:'24/07/2016'
                }
                var ev = 4;
                spyOnService = spyOnAngularService(campaignSvc, 'getStatisticsSingle',true);
                $scope.dateRangeChanged(ev,picker);
                expect($scope.lineGraph.dataToShow.series).toEqual(4);

            });*/


            it("should accumulatedValues from  CampaignDetailsController....", function() {
                $scope = {};
                if ($scope.rightSideContent == undefined) {
                    $scope.rightSideContent = {}
                }
                if ($scope.customstyle == undefined) {
                    $scope.customstyle = {}
                }
                if ($scope.lineGraph == undefined) {
                    $scope.lineGraph = {}
                }
                if ($scope.campaignDetailData == undefined) {
                    $scope.campaignDetailData = {}
                }
                spyOn($State, 'go');
                var controller = $controller('CampaignDetailsCtrl', {
                    $scope: $scope,
                    browserService: browserSvc,
                    groupsService: groupsSvc
                });
                expect($scope.accumulatedValues.allViews).toEqual(0);
                expect($scope.accumulatedValues.allClicks).toEqual(0);

            });

            /* it("should accumulatedValues from  CampaignDetailsController....", function() {
             $scope = {};
             if ($scope.rightSideContent == undefined){
                 $scope.rightSideContent = {}
             }
              if ($scope.customstyle == undefined){
                 $scope.customstyle = {}
             }
              if ($scope.lineGraph == undefined){
                  $scope.lineGraph = {}
             }
             if ($scope.campaignDetailData == undefined){
                  $scope.campaignDetailData = {}
             }
             spyOn($State, 'go');
             var controller = $controller('CampaignDetailsCtrl', {
                 $scope: $scope,
                 browserService:browserSvc,
                 groupsService:groupsSvc
             });
             var data = 4;
             var begin = new Date('1995-05-23'); 
             var end = new Date('1996-05-23'); 
             $scope.calcGraphData(data,begin,end);
             expect($scope.accumulatedValues.allViews).toEqual(0);
             expect($scope.accumulatedValues.allClicks).toEqual(0);

             });*/


            it("should groupButtonSelection views is true from  CampaignDetailsController....", function() {
                $scope = {};
                if ($scope.rightSideContent == undefined) {
                    $scope.rightSideContent = {}
                }
                if ($scope.customstyle == undefined) {
                    $scope.customstyle = {}
                }
                if ($scope.lineGraph == undefined) {
                    $scope.lineGraph = {}
                }
                if ($scope.campaignDetailData == undefined) {
                    $scope.campaignDetailData = {}
                }
                spyOn($State, 'go');
                var controller = $controller('CampaignDetailsCtrl', {
                    $scope: $scope,
                    browserService: browserSvc,
                    groupsService: groupsSvc
                });

                expect($scope.groupButtonSelection.views).toEqual(true);
            });

            it("should groupButtonSelection clicks is false from  CampaignDetailsController....", function() {
                $scope = {};
                if ($scope.rightSideContent == undefined) {
                    $scope.rightSideContent = {}
                }
                if ($scope.customstyle == undefined) {
                    $scope.customstyle = {}
                }
                if ($scope.lineGraph == undefined) {
                    $scope.lineGraph = {}
                }
                if ($scope.campaignDetailData == undefined) {
                    $scope.campaignDetailData = {}
                }
                spyOn($State, 'go');
                var controller = $controller('CampaignDetailsCtrl', {
                    $scope: $scope,
                    browserService: browserSvc,
                    groupsService: groupsSvc
                }); 
                expect($scope.groupButtonSelection.clicks).toEqual(false);
            });



            it("should groupButtonSelection rate is false from  CampaignDetailsController....", function() {
                $scope = {};
                if ($scope.rightSideContent == undefined) {
                    $scope.rightSideContent = {}
                }
                if ($scope.customstyle == undefined) {
                    $scope.customstyle = {}
                }
                if ($scope.lineGraph == undefined) {
                    $scope.lineGraph = {}
                }
                if ($scope.campaignDetailData == undefined) {
                    $scope.campaignDetailData = {}
                }
                spyOn($State, 'go');
                var controller = $controller('CampaignDetailsCtrl', {
                    $scope: $scope,
                    browserService: browserSvc,
                    groupsService: groupsSvc
                });

                expect($scope.groupButtonSelection.rate).toEqual(false);
            });


            it("should changeGraphMode for clicks mode is true CampaignDetailsController....", function() {
                $scope = {};
                if ($scope.rightSideContent == undefined) {
                    $scope.rightSideContent = {}
                }
                if ($scope.customstyle == undefined) {
                    $scope.customstyle = {}
                }
                if ($scope.lineGraph == undefined) {
                    $scope.lineGraph = {}
                }
                if ($scope.campaignDetailData == undefined) {
                    $scope.campaignDetailData = {}
                }
                spyOn($State, 'go');
                var controller = $controller('CampaignDetailsCtrl', {
                    $scope: $scope,
                    browserService: browserSvc,
                    groupsService: groupsSvc
                });

                var mode = "clicks"
                $scope.lineGraph = {
                    clickData: 'clickData',
                    dataToShow: {
                        series: 'series'
                    }
                }
                $scope.changeGraphMode(mode, $scope.lineGraph);

                expect($scope.groupButtonSelection.clicks).toEqual(true);

            });


            it("should lineGraph dataToShow series change to clickData from CampaignDetailsController....", function() {
                $scope = {};
                if ($scope.rightSideContent == undefined) {
                    $scope.rightSideContent = {}
                }
                if ($scope.customstyle == undefined) {
                    $scope.customstyle = {}
                }
                if ($scope.lineGraph == undefined) {
                    $scope.lineGraph = {}
                }
                if ($scope.campaignDetailData == undefined) {
                    $scope.campaignDetailData = {}
                }
                spyOn($State, 'go');
                var controller = $controller('CampaignDetailsCtrl', {
                    $scope: $scope,
                    browserService: browserSvc,
                    groupsService: groupsSvc
                });

                var mode = "clicks"
                $scope.lineGraph = {
                    clickData: 'clickData',
                    dataToShow: {
                        series: ''
                    }
                }
                $scope.changeGraphMode(mode, $scope.lineGraph);

                expect($scope.lineGraph.dataToShow.series).toEqual('clickData');
            });


            it("should changeGraphMode for views mode is true CampaignDetailsController....", function() {
                $scope = {};
                if ($scope.rightSideContent == undefined) {
                    $scope.rightSideContent = {}
                }
                if ($scope.customstyle == undefined) {
                    $scope.customstyle = {}
                }
                if ($scope.lineGraph == undefined) {
                    $scope.lineGraph = {}
                }
                if ($scope.campaignDetailData == undefined) {
                    $scope.campaignDetailData = {}
                }
                spyOn($State, 'go');
                var controller = $controller('CampaignDetailsCtrl', {
                    $scope: $scope,
                    browserService: browserSvc,
                    groupsService: groupsSvc
                });

                $scope.lineGraph = {
                    viewData: 'viewData',
                    dataToShow: {
                        series: 'series'
                    }
                }
                var mode = "views"
                $scope.changeGraphMode(mode, $scope.lineGraph);

                expect($scope.groupButtonSelection.views).toEqual(true);

            });

            it("should lineGraph dataToShow series change to viewData from  CampaignDetailsController....", function() {
                $scope = {};
                if ($scope.rightSideContent == undefined) {
                    $scope.rightSideContent = {}
                }
                if ($scope.customstyle == undefined) {
                    $scope.customstyle = {}
                }
                if ($scope.lineGraph == undefined) {
                    $scope.lineGraph = {}
                }
                if ($scope.campaignDetailData == undefined) {
                    $scope.campaignDetailData = {}
                }
                spyOn($State, 'go');
                var controller = $controller('CampaignDetailsCtrl', {
                    $scope: $scope,
                    browserService: browserSvc,
                    groupsService: groupsSvc
                });

                $scope.lineGraph = {
                    viewData: 'viewData',
                    dataToShow: {
                        series: 'series'
                    }
                }
                var mode = "views"
                $scope.changeGraphMode(mode, $scope.lineGraph);

                expect($scope.lineGraph.dataToShow.series).toEqual('viewData');
            });



            it("should changeGraphMode for rate mode is true CampaignDetailsController....", function() {
                $scope = {};
                if ($scope.rightSideContent == undefined) {
                    $scope.rightSideContent = {}
                }
                if ($scope.customstyle == undefined) {
                    $scope.customstyle = {}
                }
                if ($scope.lineGraph == undefined) {
                    $scope.lineGraph = {}
                }
                if ($scope.campaignDetailData == undefined) {
                    $scope.campaignDetailData = {}
                }
                spyOn($State, 'go');
                var controller = $controller('CampaignDetailsCtrl', {
                    $scope: $scope,
                    browserService: browserSvc,
                    groupsService: groupsSvc
                });

                $scope.lineGraph = {
                    rateData: 'rateData',
                    dataToShow: {
                        series: 'series'
                    }
                }
                var mode = "rate"
                $scope.changeGraphMode(mode, $scope.lineGraph);
                expect($scope.groupButtonSelection.rate).toEqual(true);

            });


            it("should lineGraph dataToShow series change to rateData from  CampaignDetailsController....", function() {
                $scope = {};
                if ($scope.rightSideContent == undefined) {
                    $scope.rightSideContent = {}
                }
                if ($scope.customstyle == undefined) {
                    $scope.customstyle = {}
                }
                if ($scope.lineGraph == undefined) {
                    $scope.lineGraph = {}
                }
                if ($scope.campaignDetailData == undefined) {
                    $scope.campaignDetailData = {}
                }
                spyOn($State, 'go');
                var controller = $controller('CampaignDetailsCtrl', {
                    $scope: $scope,
                    browserService: browserSvc,
                    groupsService: groupsSvc
                });

                $scope.lineGraph = {
                    rateData: 'rateData',
                    dataToShow: {
                        series: 'series'
                    }
                }
                var mode = "rate"
                $scope.changeGraphMode(mode, $scope.lineGraph);

                expect($scope.lineGraph.dataToShow.series).toEqual('rateData');
            });

            it("should change selected Campaigns for viewData from  CampaignDetailsController....", function() {
                $scope = {};
                if ($scope.rightSideContent == undefined) {
                    $scope.rightSideContent = {}
                }
                if ($scope.customstyle == undefined) {
                    $scope.customstyle = {}
                }
                if ($scope.lineGraph == undefined) {
                    $scope.lineGraph = {}
                }
                if ($scope.campaignDetailData == undefined) {
                    $scope.campaignDetailData = {}
                }
                spyOn($State, 'go');
                var controller = $controller('CampaignDetailsCtrl', {
                    $scope: $scope,
                    browserService: browserSvc,
                    groupsService: groupsSvc
                });

                $scope.lineGraph = {
                    viewData: 'viewData',
                    dataToShow: {
                        series: 'series'
                    }
                }
                $scope.campaignSelectChanged();

                expect($scope.lineGraph.dataToShow.series).toEqual('viewData');
            });

            it("should change selected Campaigns for clickData from  CampaignDetailsController....", function() {
                $scope = {};
                if ($scope.rightSideContent == undefined) {
                    $scope.rightSideContent = {}
                }
                if ($scope.customstyle == undefined) {
                    $scope.customstyle = {}
                }
                if ($scope.lineGraph == undefined) {
                    $scope.lineGraph = {}
                }
                if ($scope.campaignDetailData == undefined) {
                    $scope.campaignDetailData = {}
                }
                spyOn($State, 'go');
                var controller = $controller('CampaignDetailsCtrl', {
                    $scope: $scope,
                    browserService: browserSvc,
                    groupsService: groupsSvc
                });
                $scope.groupButtonSelection = {
                    clicks: true
                }
                $scope.lineGraph = {
                    clickData: 'clickData',
                    dataToShow: {
                        series: ''
                    }
                }
                $scope.campaignSelectChanged();

                expect($scope.lineGraph.dataToShow.series).toEqual('clickData');
            });

            it("should change selected Campaigns for rateData from  CampaignDetailsController....", function() {
                $scope = {};
                if ($scope.rightSideContent == undefined) {
                    $scope.rightSideContent = {}
                }
                if ($scope.customstyle == undefined) {
                    $scope.customstyle = {}
                }
                if ($scope.lineGraph == undefined) {
                    $scope.lineGraph = {}
                }
                if ($scope.campaignDetailData == undefined) {
                    $scope.campaignDetailData = {}
                }
                spyOn($State, 'go');
                var controller = $controller('CampaignDetailsCtrl', {
                    $scope: $scope,
                    browserService: browserSvc,
                    groupsService: groupsSvc
                });
                $scope.groupButtonSelection = {
                    rate: true
                }

                $scope.lineGraph = {
                    rateData: 'rateData',
                    dataToShow: {
                        series: ''
                    }
                }
                $scope.campaignSelectChanged();

                expect($scope.lineGraph.dataToShow.series).toEqual('rateData');
            });


            it("should updateSelection Campaigns from  CampaignDetailsController....", function() {
                $scope = {};
                if ($scope.rightSideContent == undefined) {
                    $scope.rightSideContent = {}
                }
                if ($scope.customstyle == undefined) {
                    $scope.customstyle = {}
                }
                if ($scope.lineGraph == undefined) {
                    $scope.lineGraph = {}
                }
                if ($scope.campaignDetailData == undefined) {
                    $scope.campaignDetailData = {}
                }
                spyOn($State, 'go');
                var controller = $controller('CampaignDetailsCtrl', {
                    $scope: $scope,
                    browserService: browserSvc,
                    groupsService: groupsSvc
                });
                $scope.groupButtonSelection = {
                    rate: true
                }

                var $event = {
                    target: 'target',
                }
                var item = 'item'
                var checkbox;
                $scope.data = {
                    selectedGroups: ["messi", "sam"]
                }

                $scope.selectedCampaign = {
                    selected: {}
                }
                $scope.updateSelection($event, item);
                expect(checkbox).toEqual(undefined);
            });

            it("should getSelectedClass from  CampaignDetailsController....", function() {
                $scope = {};
                if ($scope.rightSideContent == undefined) {
                    $scope.rightSideContent = {}
                }
                if ($scope.customstyle == undefined) {
                    $scope.customstyle = {}
                }
                if ($scope.lineGraph == undefined) {
                    $scope.lineGraph = {}
                }
                if ($scope.campaignDetailData == undefined) {
                    $scope.campaignDetailData = {}
                }
                spyOn($State, 'go');
                var controller = $controller('CampaignDetailsCtrl', {
                    $scope: $scope,
                    browserService: browserSvc,
                    groupsService: groupsSvc
                });
                $scope.groupButtonSelection = {
                    rate: true
                }

                var $event = {
                    target: 'target',
                }
                var item = 'item'
                var checkbox;
                $scope.data = {
                    selectedGroups: ["messi", "sam"]
                }
                var entity = 4;

                $scope.selectedCampaign = {
                    selected: {}
                }
                $scope.getSelectedClass(entity);
                expect($scope.isSelected(entity)).toEqual(true);
            });


            it("should updateSelection Campaigns from  CampaignDetailsController....", function() {
                $scope = {};
                if ($scope.rightSideContent == undefined) {
                    $scope.rightSideContent = {}
                }
                if ($scope.customstyle == undefined) {
                    $scope.customstyle = {}
                }
                if ($scope.lineGraph == undefined) {
                    $scope.lineGraph = {}
                }
                if ($scope.campaignDetailData == undefined) {
                    $scope.campaignDetailData = {}
                }
                spyOn($State, 'go');
                var controller = $controller('CampaignDetailsCtrl', {
                    $scope: $scope,
                    browserService: browserSvc,
                    groupsService: groupsSvc
                });
                $scope.groupButtonSelection = {
                    rate: true
                }

                var $event = {
                    target: 'target',
                }
                var item = 'item'
                var checkbox;
                $scope.data = {
                    selectedGroups: ["messi", "sam"]
                }
                var entity = 4;

                $scope.selectedCampaign = {
                    selected: {}
                }
                $scope.isSelectedAll();
                expect($scope.data.selectedGroups.length).toEqual(2);
            });

            it("should rowClicked has to be change mode to remove from  CampaignDetailsController....", function() {
                $scope = {};
                if ($scope.rightSideContent == undefined) {
                    $scope.rightSideContent = {}
                }
                if ($scope.customstyle == undefined) {
                    $scope.customstyle = {}
                }
                if ($scope.lineGraph == undefined) {
                    $scope.lineGraph = {}
                }
                if ($scope.campaignDetailData == undefined) {
                    $scope.campaignDetailData = {}
                }
                spyOn($State, 'go');
                var controller = $controller('CampaignDetailsCtrl', {
                    $scope: $scope,
                    browserService: browserSvc,
                    groupsService: groupsSvc
                });
                $scope.groupButtonSelection = {
                    rate: true
                }
                var item = {
                    campaignTitle: 'around',
                    campaignId: '8',
                    campaignColor: 'black'
                }
                $scope.selectedCampaign = {
                    selected: {}
                }
                var checkbox;
                var mode;
                var id;


                $scope.data = {
                    selectedGroups: []
                }
                $scope.rowClicked(item);
                expect($scope.selectedCampaign.selected.title).toEqual("around");

            });

            it("should rowClicked has to be change id from  CampaignDetailsController....", function() {
                $scope = {};
                if ($scope.rightSideContent == undefined) {
                    $scope.rightSideContent = {}
                }
                if ($scope.customstyle == undefined) {
                    $scope.customstyle = {}
                }
                if ($scope.lineGraph == undefined) {
                    $scope.lineGraph = {}
                }
                if ($scope.campaignDetailData == undefined) {
                    $scope.campaignDetailData = {}
                }
                spyOn($State, 'go');
                var controller = $controller('CampaignDetailsCtrl', {
                    $scope: $scope,
                    browserService: browserSvc,
                    groupsService: groupsSvc
                });
                $scope.groupButtonSelection = {
                    rate: true
                }
                var item = {
                    campaignTitle: 'around',
                    campaignId: '8',
                    campaignColor: 'black'
                }
                $scope.selectedCampaign = {
                    selected: {}
                }
                var checkbox;
                var mode;
                var id;


                $scope.data = {
                    selectedGroups: []
                }
                $scope.rowClicked(item);

                expect($scope.selectedCampaign.selected.id).toEqual("8");

            });

            it("should rowClicked has to be change color from  CampaignDetailsController....", function() {
                $scope = {};
                if ($scope.rightSideContent == undefined) {
                    $scope.rightSideContent = {}
                }
                if ($scope.customstyle == undefined) {
                    $scope.customstyle = {}
                }
                if ($scope.lineGraph == undefined) {
                    $scope.lineGraph = {}
                }
                if ($scope.campaignDetailData == undefined) {
                    $scope.campaignDetailData = {}
                }
                spyOn($State, 'go');
                var controller = $controller('CampaignDetailsCtrl', {
                    $scope: $scope,
                    browserService: browserSvc,
                    groupsService: groupsSvc
                });
                $scope.groupButtonSelection = {
                    rate: true
                }
                var item = {
                    campaignTitle: 'around',
                    campaignId: '8',
                    campaignColor: 'black'
                }
                $scope.selectedCampaign = {
                    selected: {}
                }
                var checkbox;
                var mode;
                var id;


                $scope.data = {
                    selectedGroups: []
                }
                $scope.rowClicked(item);

                expect($scope.selectedCampaign.selected.color).toEqual("black");
            });


        });


    });