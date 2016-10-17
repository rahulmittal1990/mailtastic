'use strict';

angular.module('mailtasticApp.booking',[])



.controller('BookingCtrl', ['$scope', '$filter', 'userService','paymentService','alertService','$state','intercomService','$stateParams',function($scope, $filter,userService,paymentService,alertService,$state, intercomService, $stateParams) {

	$scope.config = {
            currentstep : "product"
        };
     
        $scope.basketheadline = "Warenkorb";
        $scope.userdata = {
            firstname : "",
            lastname : "",
            companyName : "",
            email : "",
            password : "",
            newpassword : "",
            newpasswordrep : "",
        };
    
        $scope.pricedata = {
            perUser : 3.00,
            amountOfUsers : 0,
            amountOfIncluded : 5,
            discount : 0,
            totalUsers : 0,
           

        };
        
        $scope.adminMode = false;
    
    
    $scope.customPlanData = {
        plan : "",
        addition : ""
    };
       
       $scope.loadingPromise = "";
        $scope.invoices = [];
    
        $scope.invoicedata = {
          gender:          "male",  // "male" oder "female"
          country : "DE"
   
        };
    
        $scope.paymentdata = {
            payment_method : ""
        };
    
    
    /**
     * get price data for custom plan from isaac backend
     * @returns {undefined}
     */
    $scope.getPriceData = function(){
        paymentService.getPriceData($scope.customPlanData.plan , $scope.customPlanData.addition)
                .then(function(price){
                    $scope.calcPrice(price); //calc price on base of custom plan data
                }).catch(function(e){
                    alertService.defaultErrorMessage(Strings.errors.DATEN_NICHT_GELADEN);
                });
        
        
    };
    
    
    $scope.subscriptiondata = {
        billing_interval : "yearly",
        country : $scope.invoicedata.country

    };
        
        
            
    $scope.placeOrderInvoice = function(){
        
        
        if(!$scope.pricedata.totalUsers || $scope.pricedata.totalUsers < $scope.minAmountWhichIsBookable){
            alertService.defaultErrorMessage("Sie haben bereits mehr Mitarbeiter in Mailtastic integriert oder befinden sich unterhalb der Mindestgrenze von 5 Mitarbeitern. Bitte passen Sie die gewünschte Anzahl an Lizenzen an.");
            return;
        }
        
        //set email of user
        $scope.invoicedata.email = $scope.invoicedata.email || $scope.userdata.email;
        $scope.invoicedata.billing_interval = $scope.subscriptiondata.billing_interval;
         
         //check if user has custom plan and custom subscription
        if($scope.customPlanData.plan && $scope.customPlanData.addition){
             $scope.invoicedata.customPlanData = $scope.customPlanData;
             
        }
         
        $scope.loadingPromise = paymentService.subscribeInvoice($scope.invoicedata, $scope.pricedata.totalUsers).then(function(data){
            
          if(data === true){
              alertService.subscriptionCompleted(function(){
                  $state.go('base.dashboard');
              });
              
               //tell intercom that group was created
                intercomService.bookedMailtasticStarter();
            
          }else{
              alert(Strings.errors.TECHNISCHER_FEHLER);
               alert(JSON.stringify(data));
          }
        });
        
    };
    
    
    //userdaten holen damit der firmenname vorausgefüllt werden können
       userService.getAccountData().then(function(data){
            if(!data || data.success === false){
                //TODO
                alert(Strings.errors.DATEN_NICHT_GELADEN);
            }else{
                $scope.userdata.firstname = data.firstname;
                $scope.userdata.lastname = data.lastname;
                $scope.userdata.companyName = data.companyName;
                $scope.userdata.email = data.email;
                $scope.userdata.password = "";
                $scope.userdata.newpassword = "";
                $scope.userdata.newpasswordrep = "";
                
                $scope.invoicedata.company = data.companyName;
            }
            
        });
        
        $scope.minAmountWhichIsBookable = 0;
        
        $scope.basketData = {
            basicprice : 15,
            cumulatedAddUsersPrice : 0,
            priceWithoutMwst : 0,
            discount : 0,
            mwst : 0,
            total : 0,
            discountfaktor : 0.17
          
        };
        
        $scope.calcPrice = function(customPricePerUser){
            
//            //check if user has entered less than min amount
//            if($scope.pricedata.totalUsers < $scope.minAmountWhichIsBookable)
//            {
//                $scope.pricedata.totalUsers = $scope.minAmountWhichIsBookable;
//            }
            
            
            var mwst = 0;
            if($scope.invoicedata.country === "DE"){
                mwst = 0.19;
            }
            
            
            if(customPricePerUser){ //there is a custom price for this user
                
                $scope.pricedata.perUser  = customPricePerUser / 100;
                //$scope.basketData.basicprice = customPricePerUser * 5 * 12 / 100;
//                $scope.basketData.cumulatedAddUsersPrice = $scope.pricedata.amountOfUsers * customPricePerUser * 12 / 100;
//                $scope.basketData.priceWithoutMwst = $scope.basketData.basicprice + $scope.basketData.cumulatedAddUsersPrice;
//                $scope.basketData.discount =  0;
//                $scope.basketData.mwst =  ($scope.basketData.priceWithoutMwst -  $scope.basketData.discount)  * mwst;
//                $scope.basketData.total =  $scope.basketData.priceWithoutMwst +   $scope.basketData.mwst -  $scope.basketData.discount;
            }
           
           //get amount of users to caluclate the price with
           var amountOfUsersToCalc = $scope.pricedata.totalUsers >= 5 ? $scope.pricedata.totalUsers -5 : 5;
            $scope.pricedata.amountOfUsers = amountOfUsersToCalc;   //to show in basket calculation
           
           
            if($scope.subscriptiondata.billing_interval === "yearly"){
                $scope.basketData.basicprice = $scope.pricedata.perUser * 5 * 12;
                $scope.basketData.cumulatedAddUsersPrice = amountOfUsersToCalc * $scope.pricedata.perUser * 12;
                $scope.basketData.priceWithoutMwst = $scope.basketData.basicprice + $scope.basketData.cumulatedAddUsersPrice;
                if(customPricePerUser){
                    $scope.basketData.discount =  0;    //when custom price then there is no discount
                }else{
                    $scope.basketData.discount =  $scope.basketData.priceWithoutMwst * $scope.basketData.discountfaktor;
                }
                $scope.basketData.mwst =  ($scope.basketData.priceWithoutMwst -  $scope.basketData.discount)  * mwst;
                $scope.basketData.total =  $scope.basketData.priceWithoutMwst +   $scope.basketData.mwst -  $scope.basketData.discount;
            }else if($scope.subscriptiondata.billing_interval === "monthly"){
                $scope.basketData.basicprice =  $scope.pricedata.perUser * 5;
                $scope.basketData.cumulatedAddUsersPrice = amountOfUsersToCalc * $scope.pricedata.perUser;
                $scope.basketData.priceWithoutMwst = $scope.basketData.basicprice + $scope.basketData.cumulatedAddUsersPrice;
                $scope.basketData.discount = 0;
                $scope.basketData.mwst = $scope.basketData.priceWithoutMwst * mwst;
                $scope.basketData.total =  $scope.basketData.priceWithoutMwst +  $scope.basketData.mwst;
            }
              
                
            
        };
        
        
        $scope.initData = function(){
            if($stateParams.mode && $stateParams.mode === "admin"){
                $scope.adminMode  = true;
            }
            
            
            //Vorhandene Anzahl an Usern laden damit die Preisberechnung durchgeführt werden kann
        userService.getAmountOfUsers().then(function(amount){
            if(!amount){
                alert(Strings.errors.DATEN_NICHT_GELADEN);
            }else{
                    $scope.pricedata.totalUsers = amount >= 15 ? amount : 15;       //gesamt anzahl an nutzern
                    if(amount <= $scope.pricedata.amountOfIncluded){    //berechne anzahl an nutzern über free kontingent
                        $scope.pricedata.amountOfUsers = 0;
                    }else{
                        $scope.pricedata.amountOfUsers = amount - $scope.pricedata.amountOfIncluded;
                    }
                    
                    $scope.minAmountWhichIsBookable = amount >= 5  ?  amount : 5;
                    
                    
            $scope.calcPrice();
             //   $scope.pricedata.amountOfUsers = amount;
//                if(amount <= $scope.pricedata.amountOfIncluded){
//                    $scope.pricedata.amountOfUsers = 0;
//                }else{
//                    $scope.pricedata.amountOfUsers = amount - $scope.pricedata.amountOfIncluded;
//                }
            }
        });
        };
        
        $scope.changeStep = function(step){
            if($scope.config.currentstep === "product" && step=== "details" && (!$scope.pricedata.totalUsers || $scope.pricedata.totalUsers < $scope.minAmountWhichIsBookable)){
                 
            if(!$scope.pricedata.totalUsers || $scope.pricedata.totalUsers < $scope.minAmountWhichIsBookable){
                alertService.defaultErrorMessage("Sie haben bereits mehr Mitarbeiter in Mailtastic integriert oder befinden sich unterhalb der Mindestgrenze von 5 Mitarbeitern. Bitte passen Sie die gewünschte Anzahl an Lizenzen an.");
                return;
            }
            }
            $scope.config.currentstep = step;
        };
        
        $scope.initData();
        
}])
//    .filter('checkDuration','$scope', function($scope) {
//  return function(input) {
//  
//        if($scope.invoicedata === "monthly"){
//            return input * 12;
//        }else{
//            return input;
//        }
//    
//  };
//})
        .filter('checkDuration', function() {
  return function(input,$scope) {
  
        if($scope.subscriptiondata.billing_interval === "yearly"){
            return input * 12;
        }else{
            return input;
        }
    
  };           
});