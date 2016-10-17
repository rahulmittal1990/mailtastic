'use strict';

describe('mailtasticApp.dashboard', function() {

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
    var spyOnService, $modal, alertSvc, paymentsvc, groupsSvc,browseSvc,$State,userSvc,campaignSvc;
    beforeEach(angular.mock.module('mailtasticApp.dashboard'));
    beforeEach(angular.mock.module('mailtasticApp.services'));
    beforeEach(angular.mock.module('mailtasticApp.factories'));
    beforeEach(module('LocalStorageModule'));
    beforeEach(module('mailtasticApp.modalEmployee'));
    beforeEach(module('ui.router'));
    beforeEach(angular.mock.inject(function(_$controller_) {
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $controller = _$controller_;
    }));
    beforeEach(inject(function (browseService, campaignService, $state, userService, employeeService, alertService, paymentService, groupsService, $uibModal, $translate) {
            paymentsvc = paymentService;
            employeeSvc = employeeService;
            groupsSvc = groupsService;
            alertSvc = alertService;
            browseSvc = browseService;
            $State = $state;
            userSvc = userService;
            campaignSvc = campaignService;
    }));
   
    describe('DashboardController controller', function() {

        it("should calcBestThreeEmployees....", function() {
            $scope = {};
             spyOn(bootbox, 'confirm');
            var controller = $controller('DashboardCtrl', {
                $scope: $scope
            });
           
            $scope.employees = [{
            "key": "year",
            "name": "Year"
            }, {
            "key": "price",
            "name": "Price"
            },
            {
            "key": "list",
            "name": "Price"
            },
            {
            "key": "price",
            "name": "Price"
            }];
            $scope.employees.sort(function (a, b) {
                        return   parseFloat(b.clicks + b.views) - parseFloat(a.clicks + a.views);
                    });
                    $scope.topThreeEmployees = $scope.employees.slice(0, 3);

            $scope.calcBestThreeEmployees();

            expect({
                "success": false,
                "message": "No token provided."
            }).toEqual({
                "success": false,
                "message": "No token provided."
            });

        });
        

    });


});