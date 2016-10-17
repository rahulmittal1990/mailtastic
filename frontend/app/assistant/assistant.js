'use strict';

angular.module('mailtasticApp.assistant',[])



.controller('AssistantCtrl', ['$scope', '$filter', 'userService','paymentService','$state', '$stateParams','$window','assistantconfigService',function($scope, $filter,userService,paymentService,$state,$stateParams,$window,assistantconfigService) {

	
        $scope.config = {
          minheight : 0,
          listheight : 0
        };
       
        
       
        $scope.step = {
           
        };
        
        
       $scope.initData = function(){
           
           //clear all resultdata to have a fresh assistant enivironment
           assistantconfigService.reset();
           
            $scope.step =  assistantconfigService;
           
           if(!$stateParams['state']){
               $stateParams['state'] = "employee_createnew";
           }
            $scope.step.currenttoshow =   $stateParams['state'];
//            $scope.step.currenttoshow =   "employee_createnew";
            $scope.step.entryPoint = $stateParams['state'];
            
            switch($scope.step.entryPoint){
                case "employee_createnew" : $scope.step.headline  =  "Mitarbeiter hinzufügen"; break;
                case "employee_import"    : $scope.step.headline     =  "Mitarbeiter hinzufügen"; break;
                case "campaign_createnew" : $scope.step.headline     =  "Kampagne erstellen"; break;
                case "group_createnew"    : $scope.step.headline     =  "Abteilung erstellen"; break;
            }
        
            //calculate min height
            $scope.config.minheight = $window.innerHeight - 60 - 90 - 30;       //top nav and padding
            $scope.config.listheight = $scope.config.minheight - 260;
            if($scope.config.listheight < 200){
                $scope.config.listheight = 250;
            }
       };
        
        
        $scope.initData();
        
}]);

