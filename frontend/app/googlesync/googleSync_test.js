'use strict';

describe('mailtasticApp.installation module', function () {

    beforeEach(function () {
        module(function ($provide) {
            $provide.factory('$modal', function () {});
            $provide.factory('StorageFactory', function () {});
        });
        module('mailtasticApp.factories');
    });


    beforeEach(function () {
        module(function ($provide) {

            //$provide.service('$window', function () {
            //    this.alert = jasmine.createSpy('alert');
            //});

            //$provide.service('requestService', function () {
            //    this.send = jasmine.createSpy('send');
            // });

            //$provide.service('groupsService', function () {

            //});

            //$provide.service('googlesyncservice', ['$q', function ($q) {
            //    //this.get = jasmine.createSpy('get');

            //    function get() {
            //        if (passPromise) {
            //            return $q.when();
            //        } else {
            //            return $q.reject();
            //        }
            //    }
            //    return {
            //        save: save
            //    };


            //}]);

            //$provide.service('employeeService', function () {

            //});

            //$provide.service('userService', function () {

            //});

            //$provide.service('paymentService', function () {

            //});

            //$provide.service('authService', function () {

            //});
            $provide.service('$state', function () {

            });

            $provide.service('$state', function () {

            });

            $provide.service('$stateParams', function () {

            });

            $provide.service('$uibModal', function () {

            });
        });
        module('mailtasticApp.services');
    });


    beforeEach(function () {
        module(function ($provide) {
            $provide.service('localStorageService', function () {

            });
        });

        module('LocalStorageModule');
    });

    beforeEach(module('mailtasticApp.installation'));
    var mocklocalStorageService, rootScope, scope, mockemployeeService, mockgroupsService, mockrequestService, httpController, fetchedData,
       mockgooglesyncservice, $httpBackend, timeout, mockuserService, mockpaymentService, mockauthService, mockStorageFactory;

    beforeEach(inject(function ($controller, $rootScope, $state, $stateParams, $uibModal, localStorageService, employeeService, groupsService, requestService, $window, StorageFactory, authService, paymentService,
            userService, googlesyncservice, _$httpBackend_, $timeout) {
            $httpBackend = _$httpBackend_;
            rootScope = $rootScope;
            mocklocalStorageService = localStorageService;
            mockemployeeService = employeeService;
            mockgroupsService = groupsService;
            mockrequestService = requestService;
            mockuserService = userService;
            mockgooglesyncservice = googlesyncservice;
            mockpaymentService = paymentService;
            mockauthService = authService;
            scope = $rootScope.$new();
            spyOn(mockgooglesyncservice, 'get').and.callThrough();
            httpController = $controller('GoogleSyncCtrl', {
                $scope: scope,
                mockgooglesyncservice: googlesyncservice
            });

            fetchedData = mockgooglesyncservice.get();
        
    }));

    it('get values of varaiables...................', function () {

       // spyOn(mockgooglesyncservice, "get").and.returnValue(745);

        expect(mockgooglesyncservice.get).toHaveBeenCalled();

    });



    //it('get function called...................', function () {
   
    //   // spyOn(mockgooglesyncservice, "get").and.returnValue(745);

    //    expect(mockgooglesyncservice.get).toHaveBeenCalled();

    //});


    //it('get retrun of function...................', function () {

    //    // spyOn(mockgooglesyncservice, "get").and.returnValue(745);

    //    expect(fetchedData).toEqual(1001);


    //});

    //it('check value of variables...................', function () {

    //    expect(scope.object.currentPage).toEqual('newgooglesync');
    //    scope.startSyncProcess();
    //    expect(scope.object.currentPage).toEqual('googlesync');

    //});

});