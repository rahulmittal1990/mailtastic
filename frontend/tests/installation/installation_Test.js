'use strict';

describe('mailtasticApp.installation', function() {

    var employees, httpBackend;
    var $controller;
    var $scope;
    var employeeSvc, $Filter, $RootScope, $Timeout;
    var spyOnService, $modal, alertSvc, paymentsvc, groupsSvc, browseSvc, $State, userSvc, campaignSvc, $ModalInstance, sigService;

    beforeEach(angular.mock.module('mailtasticApp.services'));
    beforeEach(angular.mock.module('mailtasticApp.factories'));
    beforeEach(angular.mock.module('mailtasticApp.installation'));

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

    describe('InstallationController controller', function() {

        it("should outlookWin of showOutlookSnippetInstallCode is true....", function() {
            $scope = {};
            $scope.$watch = {};
            spyOn($scope, '$watch')
            var controller = $controller('InstallationCtrl', {
                $scope: $scope,
                signatureHelperService: sigService

            });

            expect($scope.outlookWin.showOutlookSnippetInstallCode).toEqual("true");



        });

         it("should outlookWin of showOutlookSnippetInstallCode is true....", function() {
            $scope = {};
            $scope.$watch = {};
            spyOn($scope, '$watch')
            var controller = $controller('InstallationCtrl', {
                $scope: $scope,
                signatureHelperService: sigService

            });

            expect($scope.outlookWin.showOutlookSnippetInstallCode).toEqual("true");



        });


        it("should manual outlookwin title is manuals Outlook (Win)....", function() {
            $scope = {};
            $scope.$watch = {};
            spyOn($scope, '$watch')
            var controller = $controller('InstallationCtrl', {
                $scope: $scope,
                signatureHelperService: sigService

            });

            expect( $scope.manual.outlookwin.title).toEqual("Outlook (Win)");



        });

        it("should setManual if  title is manuals....", function() {
            $scope = {};
            $scope.$watch = {};
            spyOn($scope, '$watch')
            var controller = $controller('InstallationCtrl', {
                $scope: $scope,
                signatureHelperService: sigService

            });
             
            var manual = "macmail";
            $scope.setManual(manual);

            expect($scope.currentManual.title).toEqual("Mac Mail");



        });

        it("should othermailclient of  client....", function() {
            $scope = {};
            $scope.$watch = {};
            spyOn($scope, '$watch')
            var controller = $controller('InstallationCtrl', {
                $scope: $scope,
                signatureHelperService: sigService

            });
             
            var manual = "macmail";

            expect($scope.othermailclient.clientname).toEqual("");



        });

        it("should sendothermailclientnotification of  client....", function() {
            $scope = {};
            $scope.$watch = {};
            spyOn($scope, '$watch')
            var controller = $controller('InstallationCtrl', {
                $scope: $scope,
                signatureHelperService: sigService

            });
             
            var manual = "macmail";
            spyOnService = spyOnAngularService(employeeSvc, 'sendothermailclientnotification', true);
            $scope.sendothermailclientnotification();
            expect($scope.othermailclient.clientname).toEqual("");



        });

        it("should getClass of  manual function return blank....", function() {
            $scope = {};
            $scope.$watch = {};
            spyOn($scope, '$watch')
            var controller = $controller('InstallationCtrl', {
                $scope: $scope,
                signatureHelperService: sigService

            });
             
            var manual = "Mac Mail";
            $scope.getClass(manual);
            expect($scope.getClass(manual)).toEqual("");



        });


        it("should initData of controller...", function() {
            $scope = {};
            $scope.$watch = {};
            spyOn($scope, '$watch')
            var controller = $controller('InstallationCtrl', {
                $scope: $scope,
                signatureHelperService: sigService

            });
             
            var manual = "Mac Mail";
            spyOnService = spyOnAngularService(userSvc, 'getHtmlSnippet', true);
            $scope.initData(manual);
            expect($scope.currentManual.showBanner).toEqual(false);
            expect($scope.currentManual.title).toEqual("Outlook (Win)");
            expect($scope.currentManual.video).toEqual('https://www.youtube.com/embed/bk6Xst6euQk');
            expect($scope.currentManual.showBanner).toEqual(false);
            expect($scope.currentManual.showSnippet).toEqual(false);
            expect($scope.currentManual.showOutlookSnippet).toEqual(true);




        });


        



       



    });




});