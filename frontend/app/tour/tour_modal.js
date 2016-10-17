'use strict';
// angular.module('mailtasticApp.modal',[]);
angular.module('mailtasticApp.modal', [])

        .controller('TourModalCtrl',
                [
                    '$scope',
                    '$modalInstance',
                    'alertService',
                    function ($scope, $modalInstance,  alertService) {

                       

                        $scope.steps = [
                            
                            {
                                image : "tour/images/1.png"
                         
                            },
                             {
                                image : "tour/images/2.png"    
                            },
                             {
                                image : "tour/images/3.png"    
                            },
                             {
                                image : "tour/images/4.png"    
                            },
                             {
                                image : "tour/images/5.png"    
                            },
                             {
                                image : "tour/images/6.png"    
                            },
                             {
                                image : "tour/images/7.png"    
                            }
                            
                        ];

                        $scope.currentStep = 0;

                        $scope.next = function(){
                            
                              $scope.currentStep = ($scope.currentStep +1);
                              if($scope.currentStep === $scope.steps.length){
                                  $scope.ok();
                              }
                            
                        };
                        
                         $scope.prev = function(){
                            
                              $scope.currentStep = ($scope.currentStep -1) %  ($scope.steps.length -1);
                            
                        };

                       



                       

                        $scope.ok = function (retobject) {
                            $modalInstance.close(retobject);
                        };


                        $scope.cancel = function () {
                            $modalInstance.dismiss('cancel');
                        };


                    }]);
