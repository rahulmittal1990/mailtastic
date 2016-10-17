'use strict';

describe('mailtasticApp.booking', function() {

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
    var spyOnService, $modal, alertSvc, paymentsvc, groupsSvc, browseSvc, $State, userSvc;
    beforeEach(angular.mock.module('mailtasticApp.booking'));
    beforeEach(angular.mock.module('mailtasticApp.services'));
    beforeEach(angular.mock.module('mailtasticApp.factories'));
    beforeEach(module('LocalStorageModule'));

    beforeEach(module('ui.router'));
    beforeEach(angular.mock.inject(function(_$controller_) {
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $controller = _$controller_;
    }));
    beforeEach(inject(function(browseService, $state, userService, employeeService, alertService, paymentService, groupsService) {
        paymentsvc = paymentService;
        employeeSvc = employeeService;
        groupsSvc = groupsService;
        alertSvc = alertService;
        browseSvc = browseService;
        $State = $state;
        userSvc = userService;
    }));



    describe('BookingController controller', function() {

        it("should subscriptiondata....", function() {
            $scope = {};
            var controller = $controller('BookingCtrl', {
                $scope: $scope
            });

            $scope.invoicedata.country = "DE"
            expect($scope.subscriptiondata.billing_interval).toEqual("yearly");
            expect($scope.subscriptiondata.country).toEqual("DE");

        });


        it("should userService getAccountData....", function() {
            $scope = {};
            var data;
            var controller = $controller('BookingCtrl', {
                $scope: $scope,
                paymentService: paymentsvc,
                alertService: alertSvc,
                userService: userSvc

            });

            spyOn(window, 'alert');

            userSvc.getAccountData();
            spyOnService = spyOnAngularService(userSvc, 'getAccountData', true);
            spyOnService = spyOnAngularService(alertSvc, 'subscriptionCompleted', true);

            expect($scope.userdata.firstname).toEqual("");



        });
        it("should controller have basketData....", function() {
            $scope = {};
            var data;
            var controller = $controller('BookingCtrl', {
                $scope: $scope,
                paymentService: paymentsvc,
                alertService: alertSvc,
                userService: userSvc

            });

            spyOn(window, 'alert');


            spyOnService = spyOnAngularService(userSvc, 'getAccountData', true);
            spyOnService = spyOnAngularService(alertSvc, 'subscriptionCompleted', true);

            expect($scope.basketData.basicprice).toEqual(15);
            expect($scope.basketData.cumulatedAddUsersPrice).toEqual(0);
            expect($scope.basketData.priceWithoutMwst).toEqual(0);
            expect($scope.basketData.discount).toEqual(0);
            expect($scope.basketData.mwst).toEqual(0);

        });
        it("should calculate price invoicedata....", function() {
            $scope = {};

            var controller = $controller('BookingCtrl', {
                $scope: $scope,
                paymentService: paymentsvc,
                alertService: alertSvc,
                userService: userSvc

            });


            var mwst = $scope.invoicedata.country;
            $scope.calcPrice();
            expect(mwst).toEqual("DE");

        });
        it("should calculate price subscriptiondata billing_interval....", function() {
            $scope = {};

            var controller = $controller('BookingCtrl', {
                $scope: $scope,
                paymentService: paymentsvc,
                alertService: alertSvc,
                userService: userSvc

            });

            $scope.calcPrice();
            expect($scope.subscriptiondata.billing_interval).toEqual("yearly");

        });
        it("should calculate price basketData basicprice....", function() {
            $scope = {};

            var controller = $controller('BookingCtrl', {
                $scope: $scope,
                paymentService: paymentsvc,
                alertService: alertSvc,
                userService: userSvc

            });

            $scope.calcPrice();
            expect($scope.basketData.basicprice).toEqual(180);
            expect($scope.basketData.cumulatedAddUsersPrice).toEqual(180);
            expect($scope.basketData.priceWithoutMwst).toEqual(360);
            expect($scope.basketData.discount).toEqual(61.2);
            expect($scope.basketData.mwst).toEqual(56.772000000000006);
            expect($scope.basketData.total).toEqual(355.572);


        });
        it("should initData....", function() {
            $scope = {};
            var amount = 1000;
            var controller = $controller('BookingCtrl', {
                $scope: $scope,
                paymentService: paymentsvc,
                alertService: alertSvc,
                userService: userSvc

            });
            spyOnService = spyOnAngularService(userSvc, 'getAmountOfUsers', true);

            $scope.initData(amount);
            expect($scope.pricedata.totalUsers).toEqual(15);



        });
        it("should changeStep ....", function() {
            $scope = {};
            var step = 10;
            var controller = $controller('BookingCtrl', {
                $scope: $scope,
                paymentService: paymentsvc,
                alertService: alertSvc,
                userService: userSvc

            });
            spyOnService = spyOnAngularService(userSvc, 'getAmountOfUsers', true);

            $scope.changeStep(step);
            expect($scope.config.currentstep).toEqual(10);



        });

        it("should placeOrderInvoice....", function() {
            $scope = {};
            var data;
            var controller = $controller('BookingCtrl', {
                $scope: $scope,
                paymentService: paymentsvc,
                alertService: alertSvc
            });
            spyOn(bootbox, 'confirm');
            spyOn(window, 'alert');
            spyOnService = spyOnAngularService(alertSvc, 'subscriptionCompleted', true);
            spyOnService = spyOnAngularService(alertSvc, 'defaultErrorMessage', true);
            spyOnService = spyOnAngularService(paymentsvc, 'subscribeInvoice', true);
            $scope.placeOrderInvoice();

            expect(data).toEqual(undefined);

        });

    });

});