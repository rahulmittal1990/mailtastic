/*global define*/
    'use strict';

     angular.module('mailtasticApp.services').service('employeeHelperService', [
        'signatureService',
        'alertService',
        '$q',
        '$http',
        'employeeService',
        'userService',
        function (signatureService , alertService, $q, $http, employeeService,userService) {

          var ownServiceObject = this;      //to call own member function

            /**
             * merge employee info data with firstname and lastname field
             * needed because in the past firstname and lastname where a column in db but now all the data is stored in an json field
             * @param {type} id
             * @param {type} $scope
             * @returns {$q@call;defer.promise}i
             */
            this.prepareEmployeeData = function () {
                var deferred = $q.defer();
                
                
                    var ids = [];
                    if (!id) {    //mehrere markierte sollen gelöscht werden

                        for (var i = 0; i < $scope.data.selectedSigs.length; i++) {
                            ids.push($scope.data.selectedSigs[i].id);

                        }
                        if (ids.length === 0) {
                            alert("Bitte selektieren Sie mindestens einen Mitarbeiter.");
                             deferred.reject();
                        }
                    } else {      //einzelner soll gelöscht werden mit übergebener id
                        ids.push(id);
                    }

                    var text = ids.length > 1 ? 'Möchten Sie diese Signaturen wirklich löschen?' : 'Möchten Sie diese Signatur wirklich löschen?';
                    bootbox.confirm({
                                size: 'small',
                                message: text,
                                callback: function (result) {
                                    if (result === true) {
                                        //get all ids
                                        signatureService.delete(ids).then(function (res) {
                                            if (res.success !== true) {
                                                alertService.defaultErrorMessage(Strings.signature.list.errors.DELETION_FAILED);
                                                 deferred.reject();
                                            }else{
                                                alertService.defaultSuccessMessage(Strings.signature.list.success.DELETION_COMPLETED);
                                                deferred.resolve();
                                            }
                                        
                                        });

                                    }else{
                                        deferred.reject();
                                    }

                                }
                            });
                            
                return deferred.promise;
                            
                 };
                 
                 
                 




        }]);
