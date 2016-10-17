'use strict';

describe('mailtasticApp.login', function() {

    var employees, httpBackend;
    var $controller;
    var $scope;
    var employeeSvc,$Filter,$RootScope,$Timeout;
    var spyOnService, $modal, alertSvc, paymentsvc, groupsSvc,browseSvc,$State,userSvc,campaignSvc, $ModalInstance;
    beforeEach(angular.mock.module('mailtasticApp.modal'));
    beforeEach(angular.mock.module('mailtasticApp.services'));
    beforeEach(angular.mock.module('mailtasticApp.factories'));
    beforeEach(angular.mock.module('mailtasticApp.login'));
    beforeEach(module('LocalStorageModule'));
   
    beforeEach(module('ui.router'));
    beforeEach(angular.mock.inject(function(_$controller_) {
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $controller = _$controller_;
    }));
    beforeEach(inject(function($filter, employeeService, browseService, userService, $injector, $rootScope, $timeout, StorageFactory, $state, alertService,paymentService) {
           
            employeeSvc = employeeService;
            alertSvc = alertService;
            browseSvc = browseService;
            $State = $state;
            userSvc = userService;
            $Filter = $filter;
            $RootScope = $rootScope;
            $Timeout = $timeout;
            paymentsvc = paymentService;    
           /* $ModalInstance = $modalInstance;*/
           
    }));
   
    describe('LoginController controller', function() {

        it("should auth data have password....", function() {
            $scope = {};
            
            $RootScope.trialarea = {
                showexpired:false   

            }  
            var controller = $controller('loginCtrl', {
                $scope: $scope
                
            });
            
            expect($scope.auth.password).toEqual('');
            expect($scope.auth.email).toEqual('');
            expect($scope.auth.policyChecked).toEqual(false);
           

           

        });

            it("should login user if email and password is varified details....", function() {
            $scope = {};
             $RootScope.trialarea = {
                showexpired:false   

            } 
           
            var controller = $controller('loginCtrl', {
                $scope: $scope
                
            });
            
            spyOnService = spyOnAngularService(userSvc, 'login', true);

            $scope.login()
            expect($scope.auth.password).toEqual('');
           

           

        });

        it("should initData on login controller....", function() {
            $scope = {};
           
            $RootScope.trialarea = {
                showexpired:false   

            }  
            var controller = $controller('loginCtrl', {
                $scope: $scope,
                paymentService:paymentsvc
                
            });
             spyOn(paymentsvc, 'clear');
            $scope.trialarea = {
                showexpired:false   

            }
            var isaac10;
             spyOnService = spyOnAngularService(paymentsvc, 'clear', isaac10 = {});
          
            spyOnService = spyOnAngularService(userSvc, 'login', true);
            
            $scope.initData()
            expect($scope.auth.password).toEqual('');
           

           

        });


        

    });


   


});