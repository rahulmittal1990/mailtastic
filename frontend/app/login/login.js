'use strict';

angular.module('mailtasticApp.login', [ 'ui.bootstrap'])


.controller('loginCtrl', 
    [
        '$scope', 
        'browseService', 
        'userService', 
        '$injector', 
        '$rootScope', 
        '$timeout', 
        '$state',
        '$uibModal',
        'alertService', 
        'intercomService',
        'paymentService',
        '$q',
        function($scope, browseService,userService, $injector, $rootScope, $timeout,  $state, $uibModal, alertService, intercomService,paymentService, $q) {
	 $scope.auth = {
                //login: '',
                password: '',
                //platform: 'web',
                //firstName: '',
                //lastName: '',
                email: '',
                policyChecked : false
                //language: $window.navigator.language.substr(0, 2),
                //repeatPassword: ''
            };
            
        
        //wird bei Passwort vergessen benutzt
        $scope.passData = {};

	 $scope.login = function (/*dropdown, errorNode*/) {
	 	paymentService.clear(); //evt vorhandene Daten entfernen
	 	if(!$scope.auth.password || !$scope.auth.email ){
	 		
	 		
	 		return;
	 	}
	 	
	 	
	 	
                //$scope.loading.login = true;
                userService.login($scope.auth).then(function (response) {
                	
                	if(response.success === false){
                            
                            if(response.code === 7){
                               
                		alert(Strings.login.ACTIVATION_NEEDED);
                            }else{
                                alert(Strings.login.LOGIN_WRONG);
                		
                            }
                		
                	}else{
                            loggedIn(response).then(function(){
                                 $timeout(function () {
                                    //$scope.loading.login = false;
                                    browseService.navigate('/dashboard');
                                     }, 300);
                            }


                            , function(){

                                 alert(Strings.TECHNISCHER_FEHLER);


                            });
                        }
                   
                }, function (response) {
                    //$scope.loading.login = false;
                    //handleErrors(response, errorNode);
                    alert(Strings.TECHNISCHER_FEHLER);
                
                });
            };
	
	
	 function loggedIn(auth/*, dropdown*/) {
             
             return new Promise(function(resolve, reject){
                 $rootScope.loggedIn = true;
                 var storageFactory = $injector.get('StorageFactory');
                 var authObj = {};
                 storageFactory.add({
                    'logged_in': true,
                    //'tokenType': auth.tokenType,
                    'accessToken': auth.token,
                    //'refreshToken': auth.refreshToken,
                    'userId': auth.id,
                    
                    'userFirstName' : auth.firstname,
                    'userLastName' : auth.lastname,
                    'userCreatedAt' : auth.createdAt,
                    'userEmail' : auth.email
                   
                    
                });
                 
//                 return $q.all([
                     intercomService.userLoggedIn();
//                     intercomService.userLoggedIntoAppCues();
//                 ]);

                resolve();
                 
                      //tell intercom that user logged in
                
                 
                 
             });
             
           }


  $scope.initData = function(){
                paymentService.clear(); //evt vorhandene Daten entfernen
      
      
                $rootScope.trialarea.showexpired = false;
                $rootScope.trialarea.showtimeleft = false;
      
                 //user activation
		var requestData = {
			activationCode : $state.params.ac,
 			employeeId     : $state.params.eid
		};
                
                
                 //pass reset
                var passData = {
                        activationCode : $state.params.pc,
                        employeeId     : $state.params.aid
                };
		
		if(requestData.activationCode && requestData.employeeId){
                    userService.activateAccount(requestData).then(function(data){
                                    if(data.success === true){
                                           $scope.auth.email = data.userdata.email;
                                           alertService.defaultSuccessMessage(Strings.registration.ACCOUNT_SUCCESSFULL_CREATED);
                                          
                                    }else{
                                            alert(Strings.errors.TECHNISCHER_FEHLER);
                                    }
                            });
			
		}else if(passData.activationCode && passData.employeeId){
                    $scope.passData = passData;
                    
                    //passreset modal
                     //beim passwort zurücksetzen muss der modal zum passreset geöffnet werden
                       var dataObject = {
                            mode : "setpassword",
                            activationCode : passData.activationCode,
                            employeeId     : passData.employeeId     
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
                         
                        }, function () {
                          $log.info('Modal dismissed at: ' + new Date());
                        });
                }
	};
        $scope.initData();
       


//wird nicht mehr verwendet und wird als state change event abgefragt
//	$scope.checkIfLoggedIn = function(){
//            
//            
//          var accessToken =  StorageFactory.get('accessToken');
//          var userId =  StorageFactory.get('userId');
//          if(accessToken != null && accessToken != ""  && userId != null && userId != "" ){
//              var params = {
//                  accessToken : accessToken,
//                  userId :userId
//              };
//              userService.checkToken(params).then(function(data){
//                  if(data.success === true){
//                      $state.go("base.dashboard", {}, {reload: true});
//                  }
//              });
//          }
//        };
        
//        $scope.checkIfLoggedIn();
	
}])

;

