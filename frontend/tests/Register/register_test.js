'use strict';

describe('mailtasticApp.register', function() {

    var employees, httpBackend;
    var $controller;
    var $scope;
    var employeeSvc,$Filter,$RootScope,$Timeout;
    var spyOnService, $modal, alertSvc, paymentsvc, groupsSvc,browseSvc,$State,userSvc,campaignSvc, $ModalInstance;
    beforeEach(angular.mock.module('mailtasticApp.modal'));
    beforeEach(angular.mock.module('mailtasticApp.services'));
    beforeEach(angular.mock.module('mailtasticApp.factories'));
    beforeEach(angular.mock.module('mailtasticApp.register'));
    beforeEach(module('LocalStorageModule'));
   
    beforeEach(module('ui.router'));
    beforeEach(angular.mock.inject(function(_$controller_) {
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $controller = _$controller_;
    }));
    beforeEach(inject(function($filter, employeeService, browseService, userService, $injector, $rootScope, $timeout, StorageFactory, $state, alertService) {
           
            employeeSvc = employeeService;
            alertSvc = alertService;
            browseSvc = browseService;
            $State = $state;
            userSvc = userService;
            $Filter = $filter;
            $RootScope = $rootScope;
            $Timeout = $timeout;
           /* $ModalInstance = $modalInstance;*/
           
    }));
   
    describe('RegisterController controller', function() {

        it("should registerdata details....", function() {
            $scope = {};
           
            var controller = $controller('RegisterCtrl', {
                $scope: $scope
                
            });

            expect($scope.registerdata.companyName).toEqual('');
            expect($scope.registerdata.email).toEqual('');
            expect($scope.registerdata.policyChecked).toEqual(false);
            expect($scope.registerdata.step).toEqual(1);
            expect($scope.registerdata.firstname).toEqual('');
            expect($scope.registerdata.lastname).toEqual('');
            expect($scope.registerdata.password).toEqual('');
            expect($scope.registerdata.passwordrep).toEqual('');
            expect($scope.registerdata.referer).toEqual('');


           

        });

        it("should refererField hide is false....", function() {
            $scope = {};
           
            var controller = $controller('RegisterCtrl', {
                $scope: $scope
                
            });



            expect($scope.refererField.hide).toEqual(false);
           

           

        });

        it("should tries is equal to zero...", function() {
            $scope = {};
           
            var controller = $controller('RegisterCtrl', {
                $scope: $scope
                
            });



            expect($scope.tries).toEqual(0);
           

           

        });

        it("should initData function initiates tries is equal to zero...", function() {
            $scope = {};
           
            var controller = $controller('RegisterCtrl', {
                $scope: $scope
                
            });

            $scope.initData()

            expect($scope.tries).toEqual(0);
           

        });

        it("should registerdata referer...", function() {
            $scope = {};
           
            var controller = $controller('RegisterCtrl', {
                $scope: $scope
                
            });
          
            $State.params.ref = 4;
            $scope.initData()

            expect($scope.registerdata.referer).toEqual(4);
           

           

        });


         it("should register user have greater than 6 digit password...", function() {
            $scope = {};
           
            var controller = $controller('RegisterCtrl', {
                $scope: $scope
                
            });
          
            $State.params.ref = 4;
            spyOn(alertSvc, 'defaultSuccessMessage');
            $scope.registerdata = {
                password : ["claim","password","pas","reci","clone","len","messi","sam"]
            }
            $scope.register()

            expect((alertSvc, 'defaultSuccessMessage')).not.toBeNull();
           

           

        });
        

    });


   


});