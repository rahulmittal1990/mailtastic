'use strict';

describe('mailtasticApp.modal', function() {

    var employees, httpBackend;
    var $controller;
    var $scope;
    var employeeSvc;
    var spyOnService, $modal, alertSvc, paymentsvc, groupsSvc,browseSvc,$State,userSvc,campaignSvc, $ModalInstance;
    beforeEach(angular.mock.module('mailtasticApp.modal'));
    beforeEach(angular.mock.module('mailtasticApp.services'));
    beforeEach(angular.mock.module('mailtasticApp.factories'));
    beforeEach(module('LocalStorageModule'));
    beforeEach(module('mailtasticApp.modalEmployee'));
    beforeEach(module('ui.router'));
    beforeEach(angular.mock.inject(function(_$controller_) {
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $controller = _$controller_;
    }));
    beforeEach(inject(function(browseService,campaignService, $state, userService, employeeService, alertService, paymentService, groupsService,$uibModal) {
            paymentsvc = paymentService;
            employeeSvc = employeeService;
            groupsSvc = groupsService;
            alertSvc = alertService;
            browseSvc = browseService;
            $State = $state;
            userSvc = userService;
            campaignSvc = campaignService;
           /* $ModalInstance = $modalInstance;*/
           
    }));
   
    describe('TourModalController controller', function() {

        it("should array of data image length is seven ....", function() {
            $scope = {};
            spyOn(bootbox, 'confirm');
            var controller = $controller('TourModalCtrl', {
                $scope: $scope,
                $modalInstance: $ModalInstance
            });
        
            expect($scope.steps.length).toEqual(7);

           

        });
        

    });


    describe('TourModalController controller', function() {

        it("should currentStep is zero ....", function() {
            $scope = {};
            spyOn(bootbox, 'confirm');
            var controller = $controller('TourModalCtrl', {
                $scope: $scope,
                $modalInstance: $ModalInstance
            });
        
            expect($scope.currentStep).toEqual(0);

           

        });
        

    });


    describe('TourModalController controller', function() {

        it("should currentStep is one ....", function() {
            $scope = {};
            spyOn(bootbox, 'confirm');
            var controller = $controller('TourModalCtrl', {
                $scope: $scope,
                $modalInstance: $ModalInstance
            });
            
            $scope.next();
            expect($scope.currentStep).toEqual(1);

        });
        

    });

    describe('TourModalController controller', function() {

        it("should currentStep modulus of steps....", function() {
            $scope = {};
            spyOn(bootbox, 'confirm');
            var controller = $controller('TourModalCtrl', {
                $scope: $scope,
                $modalInstance: $ModalInstance
            });
            $scope.currentStep = 8;
            $scope.prev();
            expect($scope.currentStep).toEqual(1);

        });
        
    });


});