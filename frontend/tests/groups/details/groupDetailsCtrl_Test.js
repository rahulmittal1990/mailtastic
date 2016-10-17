    'use strict';

    describe('mailtasticApps.Groups', function() {

        var employees, httpBackend;
        var $controller;
        var $scope;
        var browserSvc;
        var employeeSvc;
        var spyOnService, $modal, alertSvc, paymentsvc, groupsSvc, browseSvc, $State, userSvc, campaignSvc, sigService, signatureSvc;
        beforeEach(angular.mock.module('mailtasticApp.services'));
        beforeEach(angular.mock.module('mailtasticApp.groups'));
        beforeEach(angular.mock.module('mailtasticApp.factories'));
        beforeEach(module('LocalStorageModule'));
        beforeEach(module('ui.router'));
        beforeEach(angular.mock.inject(function(_$controller_) {

            $controller = _$controller_;
        }));
        beforeEach(inject(function(browseService, signatureService, campaignService, $state, userService, employeeService, alertService, paymentService, groupsService, browserService) {
            browserSvc = browserService;
            paymentsvc = paymentService;
            employeeSvc = employeeService;
            groupsSvc = groupsService;
            alertSvc = alertService;
            browseSvc = browseService;
            $State = $state;
            userSvc = userService;
            campaignSvc = campaignService;
            signatureSvc = signatureService;
        }));

        describe('groupDetailsController controller', function() {


            it("should window Math calculation....", function() {
                //$scope = {};
                //$scope.data = {
                //    campaigns: []
                //}
                //$scope.rightSideContent = {
                //    showEmployee: '',
                //    showGroup: ''
                //}
                //$scope.customstyle = {

                //    maincontentstyle: {}
                //}
                //$scope.data = {
                //    groups: []
                //}

                var controller = $controller('GroupDetailsCtrl', {
                    $scope: $scope,
                    browserService: browserSvc,
                    signatureHelperService: sigService
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


            it("should statoptions of currentStatToShow is total....", function() {
                $scope = {};
                $scope.data = {
                    campaigns: []
                }
                $scope.rightSideContent = {
                    showEmployee: '',
                    showGroup: ''
                }
                $scope.customstyle = {

                    maincontentstyle: {}
                }
                $scope.data = {
                    groups: []
                }

                var controller = $controller('GroupDetailsCtrl', {
                    $scope: $scope,
                    browserService: browserSvc,
                    signatureHelperService: sigService
                });

                expect($scope.statoptions.currentStatToShow).toEqual("total");
                expect($scope.statoptions.value).toEqual("");



            });

            it("should signatureData of selectedEmployee will initialize....", function() {
                $scope = {};
                $scope.data = {
                    campaigns: []
                }
                $scope.rightSideContent = {
                    showEmployee: '',
                    showGroup: ''
                }
                $scope.customstyle = {

                    maincontentstyle: {}
                }
                $scope.data = {
                    groups: []
                }

                var controller = $controller('GroupDetailsCtrl', {
                    $scope: $scope,
                    browserService: browserSvc,
                    signatureHelperService: sigService
                });

                expect($scope.signatureData.selectedEmployee).toEqual("");




            });

            it("should get How Many Members Not Active....", function() {
                $scope = {};
                $scope.data = {
                    campaigns: []
                }
                $scope.rightSideContent = {
                    showEmployee: '',
                    showGroup: ''
                }
                $scope.customstyle = {

                    maincontentstyle: {}
                }
                $scope.data = {
                    groups: []
                }

                var controller = $controller('GroupDetailsCtrl', {
                    $scope: $scope,
                    browserService: browserSvc,
                    signatureHelperService: sigService
                });

                $scope.groupMembers = [{
                    "views": '0'
                }]
                $scope.getHowManyMembersNotActive();
                expect($scope.getHowManyMembersNotActive()).toEqual(0);




            });

            it("should resend Invitation For All Which Are NotActive....", function() {
                $scope = {};
                $scope.data = {
                    campaigns: []
                }
                $scope.rightSideContent = {
                    showEmployee: '',
                    showGroup: ''
                }
                $scope.customstyle = {

                    maincontentstyle: {}
                }
                $scope.data = {
                    groups: []
                }

                var controller = $controller('GroupDetailsCtrl', {
                    $scope: $scope,
                    browserService: browserSvc,
                    signatureHelperService: sigService
                });
                spyOnService = (sigService, 'rolloutGroup', true)
                $scope.resendInvitationForAllWhichAreNotActive();
                expect($scope.getHowManyMembersNotActive()).toEqual(0);




            });



            it("should signature Was Rolled Out AtLeast Once and return true....", function() {
                $scope = {};
                $scope.data = {
                    campaigns: []
                }
                $scope.rightSideContent = {
                    showEmployee: '',
                    showGroup: ''
                }
                $scope.customstyle = {

                    maincontentstyle: {}
                }
                $scope.data = {
                    groups: []
                }

                var controller = $controller('GroupDetailsCtrl', {
                    $scope: $scope,
                    browserService: browserSvc,
                    signatureHelperService: sigService
                });
                $scope.groupMembers = [{
                    "lastRolloutOSignatureItself": 'true'
                }]
                $scope.signatureWasRolledOutAtLeastOnce();
                expect($scope.signatureWasRolledOutAtLeastOnce()).toEqual(true);




            });


            it("should signature Was Rolled Out AtLeast Once if not return false....", function() {
                $scope = {};
                $scope.data = {
                    campaigns: []
                }
                $scope.rightSideContent = {
                    showEmployee: '',
                    showGroup: ''
                }
                $scope.customstyle = {

                    maincontentstyle: {}
                }
                $scope.data = {
                    groups: []
                }

                var controller = $controller('GroupDetailsCtrl', {
                    $scope: $scope,
                    browserService: browserSvc,
                    signatureHelperService: sigService
                });
                $scope.groupMembers = [{
                    "not": 'true'
                }]
                $scope.signatureWasRolledOutAtLeastOnce();
                expect($scope.signatureWasRolledOutAtLeastOnce()).toEqual(false);




            });


            it("determine Member Signature Status....", function() {
                $scope = {};
                $scope.data = {
                    campaigns: []
                }
                $scope.rightSideContent = {
                    showEmployee: '',
                    showGroup: ''
                }
                $scope.customstyle = {

                    maincontentstyle: {}
                }

                $scope.data = {
                    groupDetail: {
                        activeSignature: ''
                    },
                    groups: [{
                        "data": 'base'
                    }]
                }


                var controller = $controller('GroupDetailsCtrl', {
                    $scope: $scope,
                    browserService: browserSvc,
                    signatureHelperService: sigService
                });
                $scope.data = {
                    groups: [{
                        "sample": 'data'
                    }]
                }
                spyOn($scope, 'getGroupData')
                $scope.groupMembers = [{
                    "sigStatus": ''
                }]


                $scope.determineMemberSignatureStatus();
                expect($scope.groupMembers[0].sigStatus).toEqual("nosignature");




            });


            it("should get Group Data ....", function() {
                $scope = {};
                $scope.data = {
                    campaigns: []
                }
                $scope.rightSideContent = {
                    showEmployee: '',
                    showGroup: ''
                }
                $scope.customstyle = {

                    maincontentstyle: {}
                }
                $scope.data = {
                    groups: []
                }

                var controller = $controller('GroupDetailsCtrl', {
                    $scope: $scope,
                    browserService: browserSvc,
                    signatureHelperService: sigService
                });

                $scope.getGroupData();
                expect($scope.groupId).toEqual(-1);




            });

            it("should initData initialize from zero....", function() {
                $scope = {};
                $scope.data = {
                    campaigns: []
                }
                $scope.rightSideContent = {
                    showEmployee: '',
                    showGroup: ''
                }
                $scope.customstyle = {

                    maincontentstyle: {}
                }
                $scope.data = {
                    groups: []
                }

                var controller = $controller('GroupDetailsCtrl', {
                    $scope: $scope,
                    browserService: browserSvc,
                    signatureHelperService: sigService
                });

                $scope.initData();
                expect($scope.first).toEqual(0);




            });


            it("should generate Preview of signature....", function() {
                $scope = {};
                $scope.data = {
                    campaigns: []
                }
                $scope.rightSideContent = {
                    showEmployee: '',
                    showGroup: ''
                }
                $scope.customstyle = {

                    maincontentstyle: {}
                }
                $scope.data = {
                    groups: []
                }

                var controller = $controller('GroupDetailsCtrl', {
                    $scope: $scope,
                    browserService: browserSvc,
                    signatureHelperService: sigService
                });

                $scope.generatePreview();
                expect($scope.signatureData.selectedEmployee).toEqual("");



            });


            it("should show alert if no signatures Preview....", function() {
                $scope = {};
                $scope.data = {
                    campaigns: []
                }
                $scope.rightSideContent = {
                    showEmployee: '',
                    showGroup: ''
                }
                $scope.customstyle = {

                    maincontentstyle: {}
                }
                $scope.data = {
                    groups: []
                }

                var controller = $controller('GroupDetailsCtrl', {
                    $scope: $scope,
                    browserService: browserSvc,
                    signatureHelperService: sigService
                });
                spyOnService = spyOnAngularService(alertSvc, 'defaultErrorMessage', true);
                $scope.generatePreview();
                expect(spyOnService).toHaveBeenCalledWith('Die Daten konnten nicht geladen werden. Sollten weiterhin Probleme auftreten wenden Sie sich bitte den Support. Herzlichen Dank für Ihr Verständnis.');



            });

            it("should roll Out Signature if data not found show error....", function() {
                $scope = {};
                $scope.data = {
                    campaigns: []
                }
                $scope.rightSideContent = {
                    showEmployee: '',
                    showGroup: ''
                }
                $scope.customstyle = {

                    maincontentstyle: {}
                }
                $scope.data = {
                    groups: []
                }

                var controller = $controller('GroupDetailsCtrl', {
                    $scope: $scope,
                    browserService: browserSvc,
                    signatureHelperService: sigService
                });
                var data;
                var spyOnService1 = spyOnAngularService(signatureSvc, 'rolloutGroup', data = {
                    success: false
                });
                spyOnService = spyOnAngularService(alertSvc, 'defaultErrorMessage', true);
                $scope.rollOutSignature();
                expect(spyOnService).toHaveBeenCalledWith('Die Daten konnten nicht geladen werden. Sollten weiterhin Probleme auftreten wenden Sie sich bitte den Support. Herzlichen Dank für Ihr Verständnis.');



            });


            it("should update Selected Signature...", function() {
                $scope = {};
                $scope.data = {
                    campaigns: []
                }
                $scope.rightSideContent = {
                    showEmployee: '',
                    showGroup: ''
                }
                $scope.customstyle = {

                    maincontentstyle: {}
                }
                $scope.data = {
                    groups: []
                }

                var controller = $controller('GroupDetailsCtrl', {
                    $scope: $scope,
                    browserService: browserSvc,
                    signatureHelperService: sigService
                });

                spyOn(bootbox, 'confirm')

                $scope.updateSelectedSignature();
                expect($scope.signatureData.selectedEmployee).toEqual("");



            });


            it("should enlarge Pie Graph of series 100...", function() {
                $scope = {};
                $scope.data = {
                    campaigns: []
                }
                $scope.rightSideContent = {
                    showEmployee: '',
                    showGroup: ''
                }
                $scope.customstyle = {

                    maincontentstyle: {}
                }
                $scope.data = {
                    groups: []
                }

                var controller = $controller('GroupDetailsCtrl', {
                    $scope: $scope,
                    browserService: browserSvc,
                    signatureHelperService: sigService
                });



                $scope.enlargePieGraph();
                expect($scope.pieGraph.data.series[0]).toEqual(100);



            });

            it("should group Type Changed except firefox...", function() {
                $scope = {};
                $scope.data = {
                    campaigns: []
                }
                $scope.rightSideContent = {
                    showEmployee: '',
                    showGroup: ''
                }
                $scope.customstyle = {

                    maincontentstyle: {}
                }
                $scope.data = {
                    groups: []
                }

                var controller = $controller('GroupDetailsCtrl', {
                    $scope: $scope,
                    browserService: browserSvc,
                    signatureHelperService: sigService
                });

                $scope.groupTypeChanged();
                expect($scope.first).toEqual(1);



            });


            it("should search of filterText initialize by..", function() {
                $scope = {};
                $scope.data = {
                    campaigns: []
                }
                $scope.rightSideContent = {
                    showEmployee: '',
                    showGroup: ''
                }
                $scope.customstyle = {

                    maincontentstyle: {}
                }
                $scope.data = {
                    groups: []
                }

                var controller = $controller('GroupDetailsCtrl', {
                    $scope: $scope,
                    browserService: browserSvc,
                    signatureHelperService: sigService
                });


                expect($scope.search.filterText).toEqual("");



            });


            it("should search Pot Users..", function() {
                $scope = {};
                $scope.data = {
                    campaigns: []
                }
                $scope.rightSideContent = {
                    showEmployee: '',
                    showGroup: ''
                }
                $scope.customstyle = {

                    maincontentstyle: {}
                }
                $scope.data = {
                    groups: [],
                    groupDetail: {
                        id: ''
                    }
                }

                var controller = $controller('GroupDetailsCtrl', {
                    $scope: $scope,
                    browserService: browserSvc,
                    signatureHelperService: sigService
                });
                var data;

                spyOnService = (groupsSvc, 'getPotentialMembers', data = {
                    false: ''
                })
                $scope.searchPotUsers();

                expect($scope.groupMembers.length).toEqual(0);



            });

            it("should sort is null..", function() {
                $scope = {};
                $scope.data = {
                    campaigns: []
                }
                $scope.rightSideContent = {
                    showEmployee: '',
                    showGroup: ''
                }
                $scope.customstyle = {

                    maincontentstyle: {}
                }
                $scope.data = {
                    groups: [],
                    groupDetail: {
                        id: ''
                    }
                }

                var controller = $controller('GroupDetailsCtrl', {
                    $scope: $scope,
                    browserService: browserSvc,
                    signatureHelperService: sigService
                });
                var data;



                expect($scope.sort).toEqual(null);



            });


            it("should sort  List Users..", function() {
                $scope = {};
                $scope.data = {
                    campaigns: []
                }
                $scope.rightSideContent = {
                    showEmployee: '',
                    showGroup: ''
                }
                $scope.customstyle = {

                    maincontentstyle: {}
                }
                $scope.data = {
                    groups: [],
                    groupDetail: {
                        id: ''
                    }
                }

                var controller = $controller('GroupDetailsCtrl', {
                    $scope: $scope,
                    browserService: browserSvc,
                    signatureHelperService: sigService
                });
                var mode = "data";

                $scope.sortList(mode);

                expect($scope.groupMembers).toEqual([]);



            });


            it("should update selected selection..", function() {
                $scope = {};
                $scope.data = {
                    campaigns: []
                }
                $scope.rightSideContent = {
                    showEmployee: '',
                    showGroup: ''
                }
                $scope.customstyle = {

                    maincontentstyle: {}
                }
                $scope.data = {
                    groups: [],
                    groupDetail: {
                        id: ''
                    }
                }

                var controller = $controller('GroupDetailsCtrl', {
                    $scope: $scope,
                    browserService: browserSvc,
                    signatureHelperService: sigService
                });
                var item = "data";
                var $event =    {

                    target: {
                        checked: "add"
                    }
                }
                var checkbox;

                var checkbox = $event.target;
                var action = (checkbox.checked ? 'add' : 'remove');

                expect(checkbox.checked).toEqual("add");



            });



             it("should is Selected All checked employees data length..", function() {
                $scope = {};
                $scope.data = {
                    campaigns: []
                }
                $scope.rightSideContent = {
                    showEmployee: '',
                    showGroup: ''
                }
                $scope.customstyle = {

                    maincontentstyle: {}
                }
                $scope.data = {
                    groups: [],
                    groupDetail: {
                        id: ''
                    },
                    selectedEmployees:[]
                }

                var controller = $controller('GroupDetailsCtrl', {
                    $scope: $scope,
                    browserService: browserSvc,
                    signatureHelperService: sigService
                });
                var item = "data";
               $scope.isSelectedAll();
                  
                expect($scope.data.selectedEmployees.length).toEqual(0);



            });


             it("should is Selected All checked employees data length..", function() {
                $scope = {};
                $scope.data = {
                    campaigns: []
                }
                $scope.rightSideContent = {
                    showEmployee: '',
                    showGroup: ''
                }
                $scope.customstyle = {

                    maincontentstyle: {}
                }
                $scope.data = {
                    groups: [],
                    groupDetail: {
                        id: ''
                    },
                    selectedEmployees:[]
                }

                var controller = $controller('GroupDetailsCtrl', {
                    $scope: $scope,
                    browserService: browserSvc,
                    signatureHelperService: sigService
                });
                var item = "data";
               $scope.isSelectedAll();
                  
                expect($scope.data.selectedEmployees.length).toEqual(0);



            });



              it("should change Stat Source..", function() {
                $scope = {};
                $scope.data = {
                    campaigns: []
                }
                $scope.rightSideContent = {
                    showEmployee: '',
                    showGroup: ''
                }
                $scope.customstyle = {

                    maincontentstyle: {}
                }
                $scope.data = {
                    groups: [],
                    groupDetail: {
                        id: ''
                    },
                    selectedEmployees:[]
                }

                var controller = $controller('GroupDetailsCtrl', {
                    $scope: $scope,
                    browserService: browserSvc,
                    signatureHelperService: sigService
                });
               var mode = "add"
               $scope.changeStatSource(mode);
                  
                expect($scope.pieGraph.currentShown).toEqual("add");
                 expect( $scope.pieGraph.currentSliceToDraw).toEqual(0);



            });


               it("should toggleButton initialize with false..", function() {
                $scope = {};
                $scope.data = {
                    campaigns: []
                }
                $scope.rightSideContent = {
                    showEmployee: '',
                    showGroup: ''
                }
                $scope.customstyle = {

                    maincontentstyle: {}
                }
                $scope.data = {
                    groups: [],
                    groupDetail: {
                        id: ''
                    },
                    selectedEmployees:[]
                }

                var controller = $controller('GroupDetailsCtrl', {
                    $scope: $scope,
                    browserService: browserSvc,
                    signatureHelperService: sigService
                });
               var mode = "add"
               $scope.changeStatSource(mode);
                  
                expect($scope.pieGraph.currentShown).toEqual("add");
                 expect( $scope.pieGraph.currentSliceToDraw).toEqual(0);



            });




             it("should add User To CurrentGroup..", function() {
                $scope = {};
                $scope.data = {
                    campaigns: []
                }
                $scope.rightSideContent = {
                    showEmployee: '',
                    showGroup: ''
                }
                $scope.customstyle = {

                    maincontentstyle: {}
                }
                $scope.data = {
                    groups: [],
                    groupDetail: {
                        id: ''
                    },
                    selectedEmployees:[]
                }

                var controller = $controller('GroupDetailsCtrl', {
                    $scope: $scope,
                    browserService: browserSvc,
                    signatureHelperService: sigService
                });
               var id = "6"
               $scope.addUserToCurrentGroup(id);
                  
                expect($scope.pieGraph.currentShown).toEqual("views");
                



            });










        });


    });