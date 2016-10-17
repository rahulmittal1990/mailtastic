'use strict';

describe('mailtasticApp.integration', function() {

    var employees, httpBackend;
    var $controller;
    var $scope;
    var employeeSvc, $Filter, $RootScope, $Timeout;
    var spyOnService, $modal, alertSvc, paymentsvc, groupsSvc, browseSvc, $State, userSvc, campaignSvc, $ModalInstance, sigService;

    beforeEach(angular.mock.module('mailtasticApp.services'));
    beforeEach(angular.mock.module('mailtasticApp.factories'));
    beforeEach(angular.mock.module('mailtasticApp.integration'));

    beforeEach(module('LocalStorageModule'));
    beforeEach(module('ui.router'));
    beforeEach(angular.mock.inject(function(_$controller_) {
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $controller = _$controller_;


    }));
    beforeEach(inject(function($filter, $rootScope, userService, employeeService, $stateParams, alertService, $q, $sce, $location) {

        employeeSvc = employeeService;
        alertSvc = alertService;
        /* sigService = signatureHelperService;*/
        userSvc = userService;
        $Filter = $filter;
        $scope = $rootScope.$new();

    }));

    describe('IntegrationController controller', function() {

        it("should workflow of step data have explaination....", function() {
            $scope = {};
            $scope.$watch = {};
            spyOn($scope, '$watch')
            var controller = $controller('IntegrationCtrl', {
                $scope: $scope,
                signatureHelperService: sigService

            });


            expect($scope.workflow.step).toEqual("explanation");
            expect($scope.workflow.step3headline).toEqual("Daten ergänzt");



        });

        it("should outlookWin showOutlookSnippetInstallCode is true....", function() {
            $scope = {};
            $scope.$watch = {};
             spyOn($scope, '$watch')
            var controller = $controller('IntegrationCtrl', {
                $scope: $scope,
                signatureHelperService: sigService

            });


            expect($scope.outlookWin.showOutlookSnippetInstallCode).toEqual("true");



        });

        it("should signatureData preview in integration....", function() {
            $scope = {};
            $scope.$watch = {};
            spyOn($scope, '$watch')

            var controller = $controller('IntegrationCtrl', {
                $scope: $scope,
                signatureHelperService: sigService

            });


            expect($scope.signatureData.preview).toEqual("");



        });

        it("should formData tagsToComplete is array....", function() {
            $scope = {};
            $scope.$watch = {};
            spyOn($scope, '$watch')
            var controller = $controller('IntegrationCtrl', {
                $scope: $scope,
                signatureHelperService: sigService

            });


            expect($scope.formData.tagsToComplete).toEqual([]);



        });

        it("should admindata have firstname lastname email....", function() {
            $scope = {};
            $scope.$watch = {};
            spyOn($scope, '$watch')
            var controller = $controller('IntegrationCtrl', {
                $scope: $scope,
                signatureHelperService: sigService

            });
            expect($scope.admindata.firstname).toEqual("");
            expect($scope.admindata.lastname).toEqual("");
            expect($scope.admindata.email).toEqual("");



        });

        it("should setManual have firstname lastname email....", function() {
            $scope = {};
            $scope.$watch = {};
            spyOn($scope, '$watch')
            var controller = $controller('IntegrationCtrl', {
                $scope: $scope,
                signatureHelperService: sigService

            });
            var manual = "gmail";

            $scope.setManual(manual)
            expect($scope.currentManual.title).toEqual("Gmail");
            expect($scope.currentManual.video).toEqual('https://www.youtube.com/embed/5uBsfHA5LBo"');
            expect($scope.currentManual.showBanner).toEqual(true);
            expect($scope.currentManual.showSnippet).toEqual(false);


        });

        it("should sendothermailclientnotification to be true....", function() {
            $scope = {};
             $scope.$watch = {};
            spyOn($scope, '$watch')

            var controller = $controller('IntegrationCtrl', {
                $scope: $scope,
                signatureHelperService: sigService,
                employeeService: employeeSvc

            });
            /*spyOn($scope, '$watch')*/
            spyOnService = spyOnAngularService(employeeSvc, 'sendothermailclientnotification', true);
            $scope.sendothermailclientnotification()
            expect(spyOnService).toHaveBeenCalledWith(null, '');


        });

        it("should getClass if manual have mac mail....", function() {
            $scope = {};
             $scope.$watch = {};
            spyOn($scope, '$watch')

            var controller = $controller('IntegrationCtrl', {
                $scope: $scope,
                signatureHelperService: sigService

            });
            /*spyOn($scope, '$watch')*/
            var manual = "Mac Mail";

            $scope.getClass(manual)
            expect($scope.getClass(manual)).toEqual("");


        });




    });




});