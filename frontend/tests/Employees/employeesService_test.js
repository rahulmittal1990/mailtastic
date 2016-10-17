'use strict';

describe('mailtasticApp.employees module', function() {

    var employeeSvc, httpBackend;
    var $controller;
    beforeEach(module('mailtasticApp.employees'));
    beforeEach(module('mailtasticApp.services'));
    beforeEach(module('mailtasticApp.factories'));
    beforeEach(module('LocalStorageModule'));
  
    beforeEach(inject(function(employeeService, requestService, $rootScope, StorageFactory, localStorageService, $httpBackend) {
        employeeSvc = employeeService;
        httpBackend = $httpBackend;
    }));

    describe('employees services', function() {


        it("should getOne employee....", function() {

            //expect a get request to "internalapi/quotes"
            var data = employeeSvc.getOne(1).then(function(result) {
                expect(result).toEqual({
                    "success": false,
                    "message": "No token provided."
                });

            });
            httpBackend.expectGET("http://localhost:3333/employees/1");
            httpBackend.whenGET("http://localhost:3333/employees/1").respond({
                "success": false,
                "message": "No token provided."
            });

            httpBackend.flush();
            
        });

        it("should get employees ....", function() {
            var employees = [{
                    GroupName: 'club',
                    id: '1'
                }, {
                    GroupName: 'native',
                    id: '2'
                }, {
                    GroupName: 'climb',
                    id: '3'
                }]
                //expect a get request to "internalapi/quotes"
            var data = employeeSvc.get().then(function(result) {
                expect(result).toEqual(employees);

            });
            httpBackend.expectGET("http://localhost:3333/employees");
            httpBackend.whenGET("http://localhost:3333/employees").respond(employees);

            httpBackend.flush();
           
        });

        

        it("should update employee....", function() {
            //expect a get request to "internalapi/quotes"
            var employee = [{
                GroupName: 'club',
                id: '1'
            }, {
                GroupName: 'native',
                id: '2'
            }, {
                GroupName: 'climb',
                id: '3'
            }]
            var data = employeeSvc.update(employee).then(function(result) {
                expect(result).toEqual(employee);

            });
            httpBackend.expectPUT("http://localhost:3333/employees");
            httpBackend.whenPUT("http://localhost:3333/employees").respond(employee);

            httpBackend.flush();
            
        });
        it("should Add employee....", function() {
            //expect a get request to "internalapi/quotes"
            var employee = [{
                GroupName: 'club',
                id: '1'
            }, {
                GroupName: 'native',
                id: '2'
            }, {
                GroupName: 'climb',
                id: '3'
            }]
            var data = employeeSvc.add(employee).then(function(result) {
                expect(result).toEqual(employee);

            });
            httpBackend.expectPOST("http://localhost:3333/employees");
            httpBackend.whenPOST("http://localhost:3333/employees").respond(employee);

            httpBackend.flush();
          
        });
        it("should AddMany employee....", function() {
            //expect a get request to "internalapi/quotes"
            var employee = [{
                GroupName: 'club',
                id: '1'
            }, {
                GroupName: 'native',
                id: '2'
            }, {
                GroupName: 'climb',
                id: '3'
            }]
            var data = employeeSvc.addMany(employee).then(function(result) {
                expect(result).toEqual(employee);

            });
            httpBackend.expectPOST("http://localhost:3333/employees/many");
            httpBackend.whenPOST("http://localhost:3333/employees/many").respond(employee);

            httpBackend.flush();
            
        });

       
        it("should Delete employee....", function() {
            //expect a get request to "internalapi/quotes"
            var employee = [{
                GroupName: 'club',
                id: '1'
            }, {
                GroupName: 'native',
                id: '2'
            }, {
                GroupName: 'climb',
                id: '3'
            }]
            var data = employeeSvc.delete(1).then(function(result) {
                expect(result).toEqual(employee);

            });
            httpBackend.expectDELETE("http://localhost:3333/employees/1");
            httpBackend.whenDELETE("http://localhost:3333/employees/1").respond(employee);

            httpBackend.flush();
           
        });

        it("should moveToGroup....", function() {
            //expect a get request to "internalapi/quotes"
            var employee = [{
                GroupName: 'club',
                id: '1'
            }, {
                GroupName: 'native',
                id: '2'
            }, {
                GroupName: 'climb',
                id: '3'
            }]
            var data = employeeSvc.moveToGroup(1).then(function(result) {
                expect(result).toEqual(employee);

            });
            httpBackend.expectPUT("http://localhost:3333/employees/modify/group");
            httpBackend.whenPUT("http://localhost:3333/employees/modify/group").respond(employee);

            httpBackend.flush();
           
        });
        it("should activateEmployee....", function() {
            //expect a get request to "internalapi/quotes"
            var employee = [{
                GroupName: 'club',
                id: '1'
            }, {
                GroupName: 'native',
                id: '2'
            }, {
                GroupName: 'climb',
                id: '3'
            }]
            var data = employeeSvc.activateEmployee(employee).then(function(result) {
                expect(result).toEqual(employee);

            });
            httpBackend.expectPOST("http://localhost:3333/account/activate/employee");
            httpBackend.whenPOST("http://localhost:3333/account/activate/employee").respond(employee);

            httpBackend.flush();
            
        });

        it("should deleteMany....", function() {
            //expect a get request to "internalapi/quotes"
            var employee = [{
                GroupName: 'club',
                id: '1'
            }, {
                GroupName: 'native',
                id: '2'
            }, {
                GroupName: 'climb',
                id: '3'
            }]
            var data = employeeSvc.deleteMany(1).then(function(result) {
                expect(result).toEqual(employee);

            });
            httpBackend.expectPOST("http://localhost:3333/employees/del/many");
            httpBackend.whenPOST("http://localhost:3333/employees/del/many").respond(employee);

            httpBackend.flush();
            // httpBackend.expectGET("http://localhost:3333/employees/1");
        });
        it("should sendFeedback....", function() {
            //expect a get request to "internalapi/quotes"
            var employee = [{
                GroupName: 'club',
                id: '1'
            }, {
                GroupName: 'native',
                id: '2'
            }, {
                GroupName: 'climb',
                id: '3'
            }]
            var data = employeeSvc.sendFeedback().then(function(result) {
                expect(result).toEqual(employee);

            });
            httpBackend.expectPOST("http://localhost:3333/employees/feedback/webapp");
            httpBackend.whenPOST("http://localhost:3333/employees/feedback/webapp").respond(employee);

            httpBackend.flush();
            // httpBackend.expectGET("http://localhost:3333/employees/1");
        });

        it("should sendInvitations....", function() {
            //expect a get request to "internalapi/quotes"
            var employee = [{
                GroupName: 'club',
                id: '1'
            }, {
                GroupName: 'native',
                id: '2'
            }, {
                GroupName: 'climb',
                id: '3'
            }]
            var data = employeeSvc.sendInvitations(1).then(function(result) {
                expect(result).toEqual(employee);

            });
            httpBackend.expectPOST("http://localhost:3333/employees/invitation/send");
            httpBackend.whenPOST("http://localhost:3333/employees/invitation/send").respond(employee);

            httpBackend.flush();
            // httpBackend.expectGET("http://localhost:3333/employees/1");
        });
        it("should resendInvitation....", function() {
            //expect a get request to "internalapi/quotes"
            var employee = [{
                GroupName: 'club',
                id: '1'
            }, {
                GroupName: 'native',
                id: '2'
            }, {
                GroupName: 'climb',
                id: '3'
            }]
            var data = employeeSvc.resendInvitation(1).then(function(result) {
                expect(result).toEqual(employee);

            });
            httpBackend.expectPOST("http://localhost:3333/employees/invitation/resend");
            httpBackend.whenPOST("http://localhost:3333/employees/invitation/resend").respond(employee);

            httpBackend.flush();
            // httpBackend.expectGET("http://localhost:3333/employees/1");
        });
        it("should sendInvitationTestmail....", function() {
            //expect a get request to "internalapi/quotes"
            var employee = [{
                GroupName: 'club',
                id: '1'
            }, {
                GroupName: 'native',
                id: '2'
            }, {
                GroupName: 'climb',
                id: '3'
            }]
            var data = employeeSvc.sendInvitationTestmail(1).then(function(result) {
                expect(result).toEqual(employee);

            });
            httpBackend.expectPOST("http://localhost:3333/employees/invitation/sendinvitationtestmail");
            httpBackend.whenPOST("http://localhost:3333/employees/invitation/sendinvitationtestmail").respond(employee);

            httpBackend.flush();
            // httpBackend.expectGET("http://localhost:3333/employees/1");
        });
        it("should setEmployeeInfo....", function() {
            //expect a get request to "internalapi/quotes"
            var employee = [{
                GroupName: 'club',
                id: '1'
            }, {
                GroupName: 'native',
                id: '2'
            }, {
                GroupName: 'climb',
                id: '3'
            }]
            var data = employeeSvc.setEmployeeInfo(1).then(function(result) {
                expect(result).toEqual(employee);

            });
            httpBackend.expectPOST("http://localhost:3333/employees/userinfo");
            httpBackend.whenPOST("http://localhost:3333/employees/userinfo").respond(employee);

            httpBackend.flush();
            // httpBackend.expectGET("http://localhost:3333/employees/1");
        });
        it("should setEmployeeInfoSingle....", function() {
            //expect a get request to "internalapi/quotes"
            var employee = [{
                GroupName: 'club',
                id: '1'
            }, {
                GroupName: 'native',
                id: '2'
            }, {
                GroupName: 'climb',
                id: '3'
            }]
            var data = employeeSvc.setEmployeeInfoSingle(1).then(function(result) {
                expect(result).toEqual(employee);

            });
            httpBackend.expectPOST("http://localhost:3333/employees/userinfo/single");
            httpBackend.whenPOST("http://localhost:3333/employees/userinfo/single").respond(employee);

            httpBackend.flush();
            // httpBackend.expectGET("http://localhost:3333/employees/1");
        });
        it("should sendothermailclientnotification....", function() {
            //expect a get request to "internalapi/quotes"
            var employee = [{
                GroupName: 'club',
                id: '1'
            }, {
                GroupName: 'native',
                id: '2'
            }, {
                GroupName: 'climb',
                id: '3'
            }]
            var data = employeeSvc.sendothermailclientnotification(1).then(function(result) {
                expect(result).toEqual(employee);

            });
            httpBackend.expectPOST("http://localhost:3333/employees/mailclients/other");
            httpBackend.whenPOST("http://localhost:3333/employees/mailclients/other").respond(employee);

            httpBackend.flush();
            // httpBackend.expectGET("http://localhost:3333/employees/1");
        });
        it("should getIntegrationData....", function() {
            //expect a get request to "internalapi/quotes"
            var employee = [{
                GroupName: 'club',
                id: '1'
            }, {
                GroupName: 'native',
                id: '2'
            }, {
                GroupName: 'climb',
                id: '3'
            }]
            var data = employeeSvc.getIntegrationData(1, 1).then(function(result) {
                expect(result).toEqual(employee);

            });
            httpBackend.expectGET("http://localhost:3333/account/employee/integrationdata/1/1");
            httpBackend.whenGET("http://localhost:3333/account/employee/integrationdata/1/1").respond(employee);

            httpBackend.flush();
            // httpBackend.expectGET("http://localhost:3333/employees/1");
        });
        it("should complementUserInfoData....", function() {
            //expect a get request to "internalapi/quotes"
            var employee = [{
                GroupName: 'club',
                id: '1'
            }, {
                GroupName: 'native',
                id: '2'
            }, {
                GroupName: 'climb',
                id: '3'
            }]
            var data = employeeSvc.complementUserInfoData(1, 1).then(function(result) {
                expect(result).toEqual(employee);

            });
            httpBackend.expectPOST("http://localhost:3333/account/employee/complementdata/1/1");
            httpBackend.whenPOST("http://localhost:3333/account/employee/complementdata/1/1").respond(employee);

            httpBackend.flush();
            // httpBackend.expectGET("http://localhost:3333/employees/1");
        });

    });


    /*controllers testing*/
    describe('employees controller', function() {

        /*it("should ....", function () {
      var scope={};
     
     var controller = $controller('EmployeeStructureCtrl', { $scope: scope });

     scope.GroupList = [{GroupName:'club', id:'1'},  {GroupName:'native', id:'2'}, {GroupName:'climb', id:'3'}]
     scope.GroupList.splice(GroupList.length, 1);
     deleteGroup(id);
     expect(2).toEqual(GroupList.length);
   httpBackend.flush();
  });*/

    });


});