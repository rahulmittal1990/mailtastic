/*global define*/
'use strict';

angular.module('mailtasticApp.services').service('paymentService', [
    'requestService',
    'userService',
    '$q',
    function (requestService, userService, $q) {
        var serviceObject = this;       //to call methods from inner methods
        
        this.data = {
            minAmountOfEmps : 5,
        };
        
        
        /**
         * Get customer data like adress and so on
         * @param {type} id
         * @returns {unresolved}
         */
        this.getCustomerData = function () {
            return requestService.send({
                method: 'get',
                url: '/payment/customerdata',
                authorization: true,
               
            });

        };
        
        
         /**
         * Get subscription data
         * @param {type} id
         * @returns {unresolved}
         */
        this.getSubscriptionData = function () {
            return requestService.send({
                method: 'get',
                url: '/payment/subscriptiondata',
                authorization: true,
               
            });

        };
        
         /**
         * Get customer data like adress and so on
         * @param {type} id
         * @returns {unresolved}
         */
        this.getInvoices = function () {
            return requestService.send({
                method: 'get',
                url: '/payment/invoices',
                authorization: true,
                
            });

        };
        
        
          /**
         * Book mailtastic -> create new customer and create new subscription
         * @param {type} id
         * @returns {unresolved}
         */
        this.bookMailtastic = function (data) {
            return requestService.send({
                method: 'post',
                url: '/payment/bookmailtastic',
                authorization: true,
                data : data,
               
            });

        };
        
        
         /**
         * Get customer data like adress and so on
         * @param {type} id
         * @returns {unresolved}
         */
        this.updateCustomerData = function (data) {
            return requestService.send({
                method: 'put',
                url: '/payment/customerdata/edit',
                data : data,
                authorization: true,
                success: function (data, promise) {
                    
                    promise.resolve(data);
                    
//                    if(data.success === true){
//                         promise.resolve();
//                    }else{
//                         promise.reject();
//                    }

                }
            });

        };
        
        /**
         * Check if user has a subscription and if so checks remaining free seats
         * 
         */
        this.getUserStatus = function () {
            //get userData from mailtastic backend
            var defer = $q.defer();
            var retObj = {
                success: false,
                hasSubscription: false, //has active
                amountOfFreeMembers: 0, //freie mitarbeiter
                forceAllow: false, //ist manuell freigeschaltet bei uns
                hasTestTime: false, //ist noch in der Testphase,
                billing_interval: ""
            };

          
                userService.getOverallStats().then(function (data) {
                    if (data.success !== true) {
                        retObj.success = false;
                        defer.resolve(retObj);
                    } else {
                        data = data.data[0];
                        retObj.success = true;

                        //check force allow
                        if(data.forceAllow == true){
                            retObj.forceAllow = true;
                        }else{
                             retObj.forceAllow = false;
                        }
                       
                        //check test period
                        //check is registration is not longer ago than 30 days
                        var creationDate = moment(data.createdAt);
                        var now = moment();

                        var diffDays = now.diff(creationDate, 'days');
                        if (diffDays < 14) {      //account jünger als 30 tage
                            retObj.hasTestTime = true;
                            retObj.daysLeft = 14 - diffDays;
                        } else {
                            retObj.hasTestTime = false;
                        }

                        //check has subscription
                        serviceObject.getSubscriptionData().then(function (subdata) {

                            if (!subdata || subdata.success !== true) {
                                retObj.hasSubscription = false;
                            } else if (subdata.data.STATUS !== "active") { //kein gültiges abo mehr
                                retObj.hasSubscription = false;
                            } else {   //abo ist laufend, abo fängt später an, abo ist gekündigt aber ende noch nicht erreicht
                                //hat ein abo
                                retObj.hasSubscription = true;
                                retObj.hasTestTime = false;
                                //billing interval
                                retObj.billing_interval = subdata.data.SUBSCRIPTION_INTERVAL === "1 year" ? "yearly" : "monthly";

                                //amount of free members
                                var employees = data.amountOfUsers;
                                var freeEmps = serviceObject.data.minAmountOfEmps - employees;
                                if (freeEmps > 0) {
                                    retObj.amountOfFreeMembers = freeEmps;
                                } else {
                                    retObj.amountOfFreeMembers = 0;
                                }

                            }

                            defer.resolve(retObj);

                        });
                    }

                });
          
            return defer.promise;
        };


        /**
         * 
         * @returns {unresolved}Sync amount of employees with payment subscription information
         * TODO : should only be called from backend
         */
        this.syncEmployees = function(){
            return requestService.send({
                method: 'post',
                url: '/payment/syncemployees',
                authorization: true,

            });

            
        };
        
        
        /**
         * calc price data for booking and account page
         * @param {type} $scope
         * @param {amountOfUsers} amount of additional users (every user more than 5)
         * @returns {undefined}
         */
        var discountFactorOnYearly = 0.17;
        this.calcPrice  = function($scope, amountOfUsers, countryCode){
             
            var mwst = 0;
            if(countryCode === "DE"){
                mwst = 0.19;
            }
            
//            if(amountOfUsers < 5){
//                amountOfUsers = 5;
//            }
            
            if($scope.subscriptiondata.billing_interval === "yearly"){
                $scope.basketData.basicprice = 15 * 12;
                $scope.basketData.cumulatedAddUsersPrice = amountOfUsers * $scope.pricedata.perUser * 12;
                $scope.basketData.priceWithoutMwst = $scope.basketData.basicprice + $scope.basketData.cumulatedAddUsersPrice;
                $scope.basketData.discount =  $scope.basketData.priceWithoutMwst * discountFactorOnYearly;
                $scope.basketData.mwst =  ($scope.basketData.priceWithoutMwst -  $scope.basketData.discount)  * mwst;
                $scope.basketData.total =  $scope.basketData.priceWithoutMwst +   $scope.basketData.mwst -  $scope.basketData.discount;
            }else if($scope.subscriptiondata.billing_interval === "monthly"){
                $scope.basketData.basicprice = 15;
                $scope.basketData.cumulatedAddUsersPrice = amountOfUsers * $scope.pricedata.perUser;
                $scope.basketData.priceWithoutMwst = $scope.basketData.basicprice + $scope.basketData.cumulatedAddUsersPrice;
                $scope.basketData.discount = 0;
                $scope.basketData.mwst = $scope.basketData.priceWithoutMwst * mwst;
                $scope.basketData.total =  $scope.basketData.priceWithoutMwst +  $scope.basketData.mwst;
                
            }
        };

        /**
         *change subscription from yearly to monthly
         * @param {type} $scope
         * @returns {undefined}
         */
       
        this.updateSubscriptionFromMonthlyToYearly  = function(){
             return requestService.send({
                method: 'post',
                url: '/payment/changetoyearly',
                authorization: true
            });
      };

        

    }
]);
