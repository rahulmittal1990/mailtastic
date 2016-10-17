'use strict';
angular.module('mailtasticApp.modal',[]);

angular.module('mailtasticApp.modalPassReset', [ 'ui.bootstrap']).controller('PassResetModalCtrl', ['$scope', '$uibModal', '$log', 'campaignService', function ($scope, $uibModal, $log, campaignService) {



  $scope.animationsEnabled = true;
  $scope.enteremailmodaltpl = "login/passwordlost/enteremailmodal.html";
  $scope.setpasswordmodaltpl = "login/passwordlost/setpasswordmodal.html";

  $scope.$on('passResetEvent', function(event, args) {
      $scope.open("setpassword", args); //password reset data muss mitübergeben werden
      
  });


  $scope.open = function (mode, passdata) {
     var dataObject = {
        mode : mode,
        passdata : passdata
    };
  
    var modalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'login/passwordlost/resetpassmodal.html',
      controller: 'PassResetInstanceCtrl',
      size: "md",
       resolve: {
       	 dataObject : dataObject
       }
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  $scope.toggleAnimation = function () {
    $scope.animationsEnabled = !$scope.animationsEnabled;
  };

}])

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service used above.

.controller('PassResetInstanceCtrl', ['$scope', '$modalInstance', 'dataObject','userService','$rootScope', function ($scope, $modalInstance, dataObject, userService, $rootScope) {

      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };
      
      $scope.modaloptions = {
          mode : "",
          heading : "Passwort vergessen"
          
      };
      
      $scope.passwordData = {
          password : "",
          passwordrep : "",
          activationCode : "",
          employeeId : ""
      };
      
      $scope.emaildata = {
            email : "",
            emailrep : ""
      };
      
      
      $scope.initData = function(){
          $scope.modaloptions.mode = dataObject.mode;
          if(dataObject.mode === "setpassword"){
               $scope.modaloptions.heading = "Neues Passwort vergeben";
              $scope.passwordData.activationCode = dataObject.activationCode;
               $scope.passwordData.employeeId = dataObject.employeeId;
          }
      };
      $scope.initData();
      
      
      $scope.resetPassword = function(){
          if($scope.emaildata.email !== $scope.emaildata.emailrep){
               alert(Strings.passreset.EMAIL_NOT_EQU);
              
          }else{
               $rootScope.loadingPromise = userService.resetPassword($scope.emaildata.email).then(function(response){
                  if(response.success === true){
                      alert(Strings.passreset.PASS_MAIL_SENT);
                      $scope.cancel();
                  }else if(response.code === 3){
                       alert(Strings.passreset.NO_ACCOUNT);
                  }
                  else{
                      alert(Strings.errors.TECHNISCHER_FEHLER);
                  }
                  
              });
              
          }
          
          
      };
      
      $scope.setNewPassword = function(){
          if($scope.passwordData.password !== $scope.passwordData.passwordrep){ //ungleich
              alert(Strings.registration.PASSWORD_REP_NOT_EQU);
          }else if($scope.passwordData.password.length < 6){        //zu kurz
               alert(Strings.registration.PASSWORD_TOO_SHORT);
          }else if(!$scope.passwordData.activationCode || !$scope.passwordData.employeeId){           //activation code nicht vorhanden
              alert(Strings.errors.TECHNISCHER_FEHLER);
          }
          else{
              $rootScope.loadingPromise = userService.setNewPassword($scope.passwordData).then(function(response){
                  if(response.success === true){
                       alert(Strings.passreset.PASS_SUC_RESET);
                        $scope.cancel();
                  }else if(response.code === 3){
                      alert(Strings.passreset.NO_ACCOUNT);
                  }
                  else{
                      alert(Strings.errors.TECHNISCHER_FEHLER);
                  }
                  
              });
          }
          
      };
}]);


function alert(content) {
    bootbox.alert(content);
}