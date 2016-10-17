'use strict';

angular.module('mailtasticApp.createBeta', ['ui.bootstrap'])



        .controller('CreateBetaCtrl', ['$scope', 'userService', function ($scope,userService) {


            $scope.betaUserData = {
              companyName : "",
              email : "",
              firstname : "",
              lastname : "",
              password : "",
              key : ""
            };

           $scope.createBetaUser = function(){
               userService.createBetaUser( $scope.betaUserData).then(function(data){
                   if(data.success === true){
                       alert("Betanutzer wurde erfolgreich erstellt");
                         $scope.betaUserData = {
                            companyName : "",
                            email : "",
                            firstname : "",
                            lastname : "",
                            password : "",
                            key : ""
                        };
                       
                   }else{
                        alert(Strings.errors.TECHNISCHER_FEHLER);
                   }
               });
               
               
           };

        }]);