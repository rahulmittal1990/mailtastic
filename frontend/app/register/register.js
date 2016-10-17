'use strict';

angular.module('mailtasticApp.register', [ 'ui.bootstrap'])


.controller('RegisterCtrl', 
    [
        '$scope', 
        '$filter', 
        'employeeService', 
        'browseService', 
        'userService', 
        '$injector', 
        '$rootScope', 
        '$timeout', 
        'StorageFactory', 
        '$state', 
        'alertService',
        '$interval',
        '$window',
        function($scope, $filter, employeeService,browseService,userService, $injector, $rootScope, $timeout, StorageFactory, $state, alertService, $interval, $window) {
	 $scope.registerdata = {
                companyName: '',
                email: '',
                policyChecked : false,
                step : 1,
                firstname : "",
                lastname : "",
                password : "",
                passwordrep : "",
                referer : ""
            };

        $scope.refererField = {
            hide : false
        };
        
        $scope.passwordsDoNotMatch = false;
         $scope.showAgbAccepMessage = false;
          $scope.emailNotValid = false;
        
        
     
        $scope.sliderimageToShow = 2;
        
        $scope.slider = {
            sliderimageToShow : 0,
            intervalTimer : null
        };
        
        $scope.tries = 0;

        /**
         * Change slider image and stop timer
         * @param {type} index
         * @returns {undefined}
         */
        $scope.changeSliderImage = function(index){
            $scope.slider.sliderimageToShow = index;
             $interval.cancel($scope.slider.intervalTimer);
            
        };
        
        
        
        $scope.resetFirstFormValidationMessages = function(){
              $scope.passwordsDoNotMatch = false;
         $scope.showAgbAccepMessage = false;
          $scope.emailNotValid = false;
            $scope.passwordNotValid = false;
            
        };

        /**
         * fire google adwords conversion
         */
       $scope.fireConversion = function() {
            $window.google_trackConversion({
                google_conversion_id : 873966782,
                google_conversion_language : "en",
                google_conversion_format : "3",
                google_conversion_color : "ffffff",
                google_conversion_label : "ievPCJGyj2oQvtneoAM",
                google_remarketing_only : false
        });
    };

        $scope.initData = function(){
            
            //start interval timer for slider
            $scope.slider.intervalTimer =    $interval(function() {
             
              $scope.slider.sliderimageToShow = ($scope.slider.sliderimageToShow +1) % 2;
             
              }, 4000);
            
              
                 $scope.tries = 0;
                 //user activation
		var referer = $state.params.ref;
 		
                if(referer){
                    $scope.registerdata.referer = referer;
                    $scope.refererField.hide = true;
                }
         
	};
        $scope.initData();


/**
 * 
 * @returns {undefined}go to second step
 */
        $scope.toSecondStep = function(){
            $scope.passwordsDoNotMatch = false;
         $scope.showAgbAccepMessage = false;
         $scope.emailNotValid = false;
         $scope.passwordNotValid = false;
           
           //email missing
            if(!$scope.registerdata.email){
                
                $scope.emailNotValid = true;
            }
            //password not long enough
            else if($scope.registerdata.password.length < 6){
                    
                     $scope.passwordNotValid = true;
            }
            
            //passwortds dont match
            else if($scope.registerdata.password !== $scope.registerdata.passwordrep){
                if($scope.tries >= 3){
                    alertService.defaultErrorMessage(Strings.registration.PASSWORD_REP_NOT_EQU + "<br><br><strong>Sollten Sie Hilfe bei der Registrierung benötigen, zögern Sie bitte nicht uns zu kontaktieren unter " +Strings.supportdata.supporttelnr +" oder unter "+ Strings.supportdata.supportemail +"</strong>");
                }else{
                      $scope.passwordsDoNotMatch = true;
                    $scope.tries++;
                }

                //agb not checked
            }else if(!$scope.registerdata.policyChecked){
                 $scope.showAgbAccepMessage = true;

            }
            else{
                    $scope.registerdata.step = 2;
                    
                }
        };

        
	 $scope.register = function (/*dropdown, errorNode*/) {
             
             
             
	 	
                if($scope.registerdata.password.length < 6){
                    alertService.defaultErrorMessage(Strings.registration.PASSWORD_TOO_SHORT);
                }
                else if($scope.registerdata.password !== $scope.registerdata.passwordrep){
                    if($scope.tries >= 3){
                        alertService.defaultErrorMessage(Strings.registration.PASSWORD_REP_NOT_EQU + "<br><br><strong>Sollten Sie Hilfe bei der Registrierung benötigen, zögern Sie bitte nicht uns zu kontaktieren unter " +Strings.supportdata.supporttelnr +" oder unter "+ Strings.supportdata.supportemail +"</strong>");
                    }else{
                        alertService.defaultErrorMessage(Strings.registration.PASSWORD_REP_NOT_EQU);
                        $scope.tries++;
                    }
                    
                       
                }else{//regiser new user
                     $scope.registerdata.passwordrep = "";
                   $rootScope.loadingPromise = userService.createNewUser( $scope.registerdata).then(function(data){
                       $scope.registerdata.passwordrep = $scope.registerdata.password = "";;
                        if(data.success === true){
                           // $scope.registerdata.step = 3; //DO NOT GO TO STEP 3 BECAUSE STEP 3 IS SHOWN IN DIFFERENT URL
                            
                            
                            
                            
                             //track registration event in facebook
                             try{
                                  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                                n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
                                n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
                                t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
                                document,'script','//connect.facebook.net/en_US/fbevents.js');

                                fbq('init', '259799124372238');
                                fbq('track', 'CompleteRegistration');
                                
                             }catch(e){
                                 console.log("FB register pixel failed");
                             }
                             
                             
                              //track google adwords conversion
                             try{
                                $scope.fireConversion();
                              }catch(e){
                                 console.log("Google ads conversion failed" + e);
                              }
                             
                             
                             
                            $state.go('registercomplete',{email : $scope.registerdata.email});
                               
                            
                            
                        }else if(data.code === 9){
                            alert(Strings.registration.ACCOUNT_ALREADY_CREATED);
                        }else{
                            alert(Strings.errors.TECHNISCHER_FEHLER);
                        }
                    });
                    
                }
                
	 	
            };
}])
.controller('RegisterCompleteCtrl', 
    [
    '$scope', 
    '$stateParams',
    function($scope, $stateParams) {

           $scope.registerdata ={
               step : 3,
               email : ""
               
           };

            $scope.initData = function(){
                 $scope.registerdata.email =   $stateParams.email;
                 

            };
            
            $scope.initData();


    }])
	
;

