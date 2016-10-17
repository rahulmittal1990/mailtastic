/*global define*/
'use strict';

angular.module('mailtasticApp.services').service('paymentService', [
    '$location',
    '$window',
    '$state',
    '$stateParams',
    'userService',
    '$q',
    'alertService',
    function ($location, $window, $state, $stateParams, userService, $q, alertService) {


        var servicedata;
        if(GlobalConfig.config.env === "local" || GlobalConfig.config.env === "amazon"){
            //development
            servicedata = {
               isaacCustomerNumber: null,
               isaacCustomerToken: null,
   //            isaac10: new Isaac10("mailtastic"),
               isaac10 : null,
               additionIdMonthly: "uQF4-MZ9jN8q0C3lXlLJwg", //id of employee addition
               additionIdYearly: "M1anuJcZd8GDoKAtLqRw2Q",
               planIdMonthly: "enxP8TQEv2jIAAyl2u0yDA",
               planIdYearly: "evqVeNFPQ2o6lgFltSdG8Q",
               minEmps: 5,
               currentAmountOfEmployees: null
           };
            
        }else if(GlobalConfig.config.env === "production" ){
             //production
            servicedata = {
                isaacCustomerNumber: null,
                isaacCustomerToken: null,
    //            isaac10: new Isaac10("mailtastic"),
                isaac10 : null,
                additionIdMonthly: "g98Zqz1BBldRlTxndbuFkA", //id of employee addition
                additionIdYearly: "9xcph1Huv8N-52976l2LKQ",
                planIdMonthly: "SC87CYED6RocBtuqM9ol7A",
                planIdYearly: "XwcWmvC2r6O0V1gCgKgnbw",
                minEmps: 5,
                currentAmountOfEmployees: null
            };
        }

       
        
        

        var service = this;


        function prepareSubscAdditionData(amount, mode) {
            
            
            var additionId = "";
            if (mode === "monthly") {
                additionId = servicedata.additionIdMonthly;
            } else if (mode === "yearly") {
                additionId = servicedata.additionIdYearly;
            }
            
            //when user has custom prices take custom additionId
            if(servicedata.customAddition){
                additionId = servicedata.customAddition;
            }

            return {
                subscription: {
                    billing_interval : mode,
                    additions: [
                        {
                            nid: additionId,
                            quantity: amount
                        }
                    ]
                }
            };
        }

        /**
         * Prepare data like isaac10 ids 
         * @returns {$q@call;defer.promise}
         */
        this.prepare = function () {
            var deferred = $q.defer();
            
            if(!servicedata.isaac10){
                try{
//                    if(Isaaac10){


                 if(GlobalConfig.config.env === "local" || GlobalConfig.config.env === "amazon"){
                     servicedata.isaac10 = new Isaac10("mailtastic-playground");
                 }else if(GlobalConfig.config.env === "production"){
                     servicedata.isaac10 = new Isaac10("mailtastic");
                 }
  
                }catch(e){
                    deferred.resolve(false);
                }
                
                
            }
            
            if (servicedata.isaacCustomerNumber && servicedata.isaacCustomerToken) {
                deferred.resolve(true);
            } else {  //load customer token
                userService.getAccountData().then(function (data) {
                    if (!data) {
                         alertService.defaultErrorMessage(Strings.errors.DATEN_NICHT_GELADEN);
                        deferred.resolve(false);
                    } else if (!data.isaacCustomerNumber || !data.isaacCustomerToken) {

                        deferred.resolve(false);
                    } else {
                        servicedata.isaacCustomerNumber = data.isaacCustomerNumber;

                        servicedata.isaacCustomerToken = data.isaacCustomerToken;
                        servicedata.isaac10.authenticateCustomer(servicedata.isaacCustomerNumber, servicedata.isaacCustomerToken);
                        
                        servicedata.customPlan = data.isaacCustomPlan;
                        servicedata.customAddition = data.isaacCustomAddition;
                        
                        deferred.resolve(true);
                    }
                });

            }

            return deferred.promise;
        };


        /**
         * Get subscription data for customer
         * @returns {$q@call;defer.promise}
         */
        this.getCustomerSubscriptionData = function () {
            var defer = $q.defer();
            service.prepare().then(function (data) {  //check if customerdata is prepared
                if (data === true) {
                    servicedata.isaac10.getSubscriptions().then(function (data) {

                        if (!data || !data.subscriptions || !data.subscriptions.length === 0) {
                            defer.resolve(null);
                        } else {
                            //find active subsription
                            var validSubscriptionId = null;
                            for (var i = 0; i < data.subscriptions.length; i++) {
                                if (data.subscriptions[i].status === "ongoing" || data.subscriptions[i].status === "canceled") {
                                    validSubscriptionId = data.subscriptions[i].id;
                                    break;
                                }
                            }

                            if (validSubscriptionId === null) {   //no valid subscription found
                                defer.resolve(null);
                            } else {
                                servicedata.isaac10.editSubscription(validSubscriptionId).then(function (data) {   //get details
                                    defer.resolve(data);
                                }, function (err) {
                                    alert(Strings.errors.TECHNISCHER_FEHLER);
                                    defer.resolve(null);
                                }, function(){
                                     defer.resolve(false);
                                });
                            }


                        }
                    }, function(err){
                         defer.resolve(false);
                    });
                } else {
                
                     // alertService.defaultErrorMessage(Strings.errors.TECHNISCHER_FEHLER);
                            
                    defer.resolve(false);
                }
            });

            return defer.promise;

        };

        /**
         * Bekommt alle rechnungs urls, mit denen ein download link erzeugt werden kann
         * @returns {$q@call;defer.promise}
         */
        this.getInvoices = function () {
            var defer = $q.defer();
            service.prepare().then(function (data) {  //check if customerdata is prepared
                if (data === true) {
                    servicedata.isaac10.getBills(servicedata.isaacCustomerNumber).then(function (data) {

                        defer.resolve(data);
                    });
                } else {
                    //TODO Error Message?
                    defer.resolve(false);
                }
            });

            return defer.promise;
        };


        //reset des status objekts
        this.clear = function () {
                    if(GlobalConfig.config.env === "local" || GlobalConfig.config.env === "amazon"){
            //development
            servicedata = {
               isaacCustomerNumber: null,
               isaacCustomerToken: null,
               isaac10: new Isaac10("mailtastic-playground"),
               additionIdMonthly: "uQF4-MZ9jN8q0C3lXlLJwg", //id of employee addition
               additionIdYearly: "M1anuJcZd8GDoKAtLqRw2Q",
               planIdMonthly: "enxP8TQEv2jIAAyl2u0yDA",
               planIdYearly: "evqVeNFPQ2o6lgFltSdG8Q",
               minEmps: 5,
               currentAmountOfEmployees: null
           };
            
        }else if(GlobalConfig.config.env === "production" ){
             //production
            servicedata = {
                isaacCustomerNumber: null,
                isaacCustomerToken: null,
                isaac10: new Isaac10("mailtastic"),
                additionIdMonthly: "g98Zqz1BBldRlTxndbuFkA", //id of employee addition
                additionIdYearly: "9xcph1Huv8N-52976l2LKQ",
                planIdMonthly: "SC87CYED6RocBtuqM9ol7A",
                planIdYearly: "XwcWmvC2r6O0V1gCgKgnbw",
                minEmps: 5,
                currentAmountOfEmployees: null
            };
        }
          

        };



        /**
         * erzeugt einen tatsächlichen Download Link der für 1 stunde gültig ist
         * und stößt download an
         * @param {type} url
         * @returns {undefined}
         */
        this.downloadInvoice = function (url) {
            service.prepare().then(function (data) {
                if (data !== true) {
                    alertService.defaultErrorMessage(Strings.errors.DATEN_NICHT_GELADEN);
                } else {
                    servicedata.isaac10.downloadBill(url);
                }
            });
        };


        //synchronisiert das Abo mit den aktuellen Mitarbeitern
        this.syncEmployees = function () {
            var defer = $q.defer();

            //checken ob ein sync überhaupt notwendig ist
            service.getUserStatus().then(function (statusdata) {
                if (statusdata.success === false) {       //status holen fehlgeschlagen

                } else {
                    if (statusdata.forceAllow === true || statusdata.hasTestTime === true) {    //kein sync notwendig da trial oder manuell freigeschaltet
                        defer.resolve(true);
                    } else if (statusdata.hasSubscription === false) {
                     
                        defer.resolve(false);
                    } else {      //hat ein abonnement
                        sync();
                    }
                }
            }).catch(function(){
                   alertService.defaultErrorMessage(Strings.payment.errors.SYNC_SUBSCRIPTION_MISSING);
                
            });



            function sync() {
                servicedata.isaac10.getSubscriptions().then(function (data) {  //get sucscription id
                    if (!data || !data.subscriptions || !data.subscriptions.length === 0 || !data.subscriptions[0].id) {
                        defer.resolve(false);
                    } else {

                        //find active subsription
                        var validSubscriptionId = null;
                        for (var i = 0; i < data.subscriptions.length; i++) {
                            if (data.subscriptions[i].status === "ongoing" || data.subscriptions[i].status === "canceled") {
                                validSubscriptionId = data.subscriptions[i].id;
                                break;
                            }
                        }

                        if (validSubscriptionId === null) {   //no valid subscription found
                            defer.resolve(false);
                        } else {

                            servicedata.isaac10.editSubscription(validSubscriptionId).then(function (detaildata) { //get details eg amount of additions
                                if (!detaildata.subscription.additions || detaildata.subscription.additions.length === 0 || !detaildata.subscription.additions[0].quantity) {
                                    defer.resolve(false);
                                } else {
                                    var curAmountInIsaac10 = detaildata.subscription.additions[0].quantity;

                                    //get amount of emps in system
                                    userService.getAmountOfUsers().then(function (systemamount) {
                                        if (!systemamount) {
                                           alertService.defaultErrorMessage(Strings.errors.DATEN_NICHT_GELADEN);
                                            return;
                                        } else {
                                            var newAmount;
                                            if (systemamount <= servicedata.minEmps) {    //falls aktuelle anzahl kleiner als mindestabnahmemenge dann setze die mindest abnahmemenge
                                                newAmount = servicedata.minEmps;
                                            } else {
                                                newAmount = systemamount;               //ansonsten nimm die anzahl an tatsächlichen mitarbeitern
                                            }
                                            if (newAmount !== curAmountInIsaac10) {       //wenn im system eine andere anzahl als in isaac10 

                                                //check if monthly or yearly


                                                var params = prepareSubscAdditionData(newAmount, detaildata.subscription.billing_interval);
                                                servicedata.isaac10.updateSubscription(validSubscriptionId, params).then(function (data) {   //update subscription with new amount of additions
                                                    if (!data || data.success !== true) {
                                                        defer.resolve(false);
                                                    } else {
                                                        defer.resolve(true);
                                                    }
                                                });
                                            } else {  //nichts zu tun
                                                defer.resolve(true);
                                            }
                                        }
                                    });
                                }
                            });
                        }


                    }
                });
            }
            ;

            return defer.promise;
        };


        //für das laden der EMail adresse zum Account
        this.getIsaacAccountData = function () {
            //get userData from mailtastic backend
            var defer = $q.defer();


            service.prepare().then(function (ret) {  //check if customerdata is prepared
                servicedata.isaac10.getAccount().then(function (data) {
                    if (!data.account || !data.account.account_data) {
                        defer.resolve(null);
                    } else {
                        defer.resolve(data.account.account_data);
                    }

                }, function (err) {
                    defer.resolve(null);
                });
            });
            return defer.promise;
        };

        //für das ändern der Email adresee aktuell nur
        this.updateIsaacAccountData = function (data) {
            //get userData from mailtastic backend
            var defer = $q.defer();


            service.prepare().then(function (ret) {  //check if customerdata is prepared
                servicedata.isaac10.updateAccountData({
                    "account_data": data
                }).then(function (data) {
                    if (!data.success || data.success === false) {
                        defer.resolve(false);
                    } else {
                        defer.resolve(true);
                    }

                }, function (err) {
                    defer.resolve(false);
                });
            });
            return defer.promise;

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
                hasSubscription: false, //hat ein abo
                amountOfFreeMembers: 0, //freie mitarbeiter
                forceAllow: false, //ist manuell freigeschaltet bei uns
                hasTestTime: false, //ist noch in der Testphase,
                billing_interval: "",
                customPrice : ""
            };

            service.prepare().then(function (ret) {  //check if customerdata is prepared
                //ret === true -> user hat einen Account

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
                        service.getCustomerSubscriptionData().then(function (subdata) {

                            if (!subdata) {
                                retObj.hasSubscription = false;
                            } else if (subdata.subscription.status === "expired") { //kein gültiges abo mehr
                                retObj.hasSubscription = false;
                            } else {   //abo ist laufend, abo fängt später an, abo ist gekündigt aber ende noch nicht erreicht
                                //hat ein abo
                                retObj.hasSubscription = true;
                                retObj.hasTestTime = false;
                                //billing interval
                                retObj.billing_interval = subdata.subscription.billing_interval;

                                //amount of free members
                                var employees = data.amountOfUsers;
                                
                                
                                //get amount of employees the customer is currently paying for
                                var currentlyBooked = (subdata.subscription.additions && subdata.subscription.additions && subdata.subscription.additions[0].quantity) ? subdata.subscription.additions[0].quantity : 0;
                                currentlyBooked === 0 ? servicedata.minEmps : currentlyBooked;    //if amount is 0 than the min
                                
                                var freeEmps = currentlyBooked - employees;
                                
                                if (freeEmps > 0) {
                                    retObj.amountOfFreeMembers = freeEmps;
                                } else {
                                    retObj.amountOfFreeMembers = 0;
                                }

                            }
                            if(data.isaacCustomPlan && data.isaacCustomAddition){
                                return $q.reject();
                            }else{
                                return $q.resolve();
                            }

                          

                        }).then(function noCustomPrice(){
                            
                              defer.resolve(retObj);
                        }, function customPrice(){
                            service.getPriceData(data.isaacCustomPlan, data.isaacCustomAddition).then(function(price){
                                
                                 retObj.customPrice = price;
                                 defer.resolve(retObj);
                            });
                            
                             
                        }).catch(function(e){
                             alertService.defaultErrorMessage(Strings.errors.DATEN_NICHT_GELADEN);
                            
                        });
                            
                        
                    }

                });
            });
            return defer.promise;
        };


        //ändern die vertragslaufzeit
        //nur möglich bon monatlich auf jährlich
        this.updatePaymentInterval = function (billingdata) {
            var defer = $q.defer();
            service.prepare().then(function (ret) {

                if (!billingdata.billing_interval) {
                    //daten nicht vorhanden
                    defer.resolve(false);
                } else if (billingdata.billing_interval === "monthly") {
                    //auf monatlich kann man nicht zurück
                    defer.resolve(false);
                } else if (billingdata.billing_interval === "yearly") {
                    {
                        servicedata.isaac10.getSubscriptions().then(function (data) {
                            if (!data || !data.subscriptions || !data.subscriptions.length === 0) {
                                defer.resolve(false);
                            } else {
                                //get amount of users
                                userService.getAmountOfUsers().then(function (systemamount) {
                                    if (!systemamount) {
                                        defer.resolve(false);
                                    } else {
                                        if (systemamount <= servicedata.minEmps) {
                                            systemamount = servicedata.minEmps;
                                        }

                                         //find active subsription
                                        var validSubscriptionId = null;
                                        for (var i = 0; i < data.subscriptions.length; i++) {
                                            if (data.subscriptions[i].status === "ongoing" || data.subscriptions[i].status === "canceled") {
                                                validSubscriptionId = data.subscriptions[i].id;
                                                break;
                                            }
                                        }

                                        if (validSubscriptionId === null) {   //no valid subscription found
                                            defer.resolve(null);
                                        } else {
                                                                                   

                                        servicedata.isaac10.upgradeDowngradeSubscription(validSubscriptionId,
                                                {
                                                    "subscription": {
                                                        "plan_nid": servicedata.planIdYearly,
                                                        "billing_interval": "yearly",
                                                        "additions": [
                                                            {"nid": servicedata.additionIdYearly, "quantity": systemamount}
                                                        ]
                                                    }
                                                }).then(function (data) {
                                            if (data.success && data.success.subscription_id) {
                                                //buchung bestätigen
                                                servicedata.isaac10.thankYouAfterUpgradeDowngrade(data.success.subscription_id).then(function (data) {
                                                    if (data.plan) {
                                                        defer.resolve(true);
                                                    } else {
                                                        defer.resolve(false);
                                                    }
                                                });

                                            } else {
                                                defer.resolve(false);
                                            }
                                        }, function (err) {
                                            defer.resolve(false);
                                        });
                                            
                                        }
 
                                    }
                                }, function (err) {
                                    defer.resolve(false);
                                });
                            }
                        }, function (err) {
                            defer.resolve(false);
                        });
                    }
                }

            });


            return defer.promise;
        };




        //ändert die zahlungsweise
        this.updatePaymentData = function () {
//              var defer = $q.defer();
//            this.prepare().then(function (ret) {  
//             servicedata.isaac10.updatePaymentData({ "payment_data": {
//                    "payment_method": "invoice"
//                }
//                  });
//            });
        };


        //aktualisiert die Rechnungsadresse
        this.updateBillingData = function (data) {
            var defer = $q.defer();
            service.prepare().then(function (ret) {
                servicedata.isaac10.updateBillingData({
                    "billing_data": data}).then(function (data) {
                    if (data.success === true) {
                        defer.resolve(true);
                    } else {
                        defer.resolve(false);
                    }
                }, function (err) {
                    defer.resolve(false);
                });
            });
            return defer.promise;
        };

        //bucht den Tarif mit Rechnung
        this.subscribeInvoice = function (data, amount) {
            var defer = $q.defer();
            service.prepare().then(function (ret) {  //check if customerdata is prepared

                //check how many users
//                userService.getAmountOfUsers().then(function (amount) {
//                    if (!amount) {    //anzahl kann nicht geladen werden
//                       
//                        alertService.defaultErrorMessage(Strings.errors.DATEN_NICHT_GELADEN);
//                    } else {

                        //falls weniger mirabeiter als ohnehin dabei sind wird anzahl auf mindestetanzahl gesetzt
                        if (amount <= servicedata.minEmps) {
                            amount = servicedata.minEmps;
                        }


                        //if user has custom plan
                        if(data.customPlanData && data.customPlanData.plan && data.customPlanData.addition){
                              data.plan_nid = data.customPlanData.plan;
                                data.additions =
                                        [{"nid": data.customPlanData.addition, "quantity": amount}];     //Setzt die Anzahl an Additions
                        }else{  //standard plan
                             //choose plan based on billing interval
                            if (data.billing_interval === "monthly") {
                                data.plan_nid = servicedata.planIdMonthly;
                                data.additions =
                                        [{"nid": servicedata.additionIdMonthly, "quantity": amount}];     //Setzt die Anzahl an Additions
                            } else if (data.billing_interval === "yearly") {
                                data.additions =
                                        [{"nid": servicedata.additionIdYearly, "quantity": amount}];     //Setzt die Anzahl an Additions
                                data.plan_nid = servicedata.planIdYearly;
                            }
                            
                        }

                       
                        
                        
                        
                        data.payment_method = "invoice";

                        if (ret === true) {  //Es gab bereits in der Vergangenheit eine subscription
                            //checken wie viele mitarbeiter er mindestens benötigt

                            //was customer -> update subscription
                            servicedata.isaac10.addSubscription({id: null, subscription: data}).then(function (data) {
                                if (!data || !data.success || !data.success.subscription_id) {
                                    defer.resolve(false);
                                } else if (data.success && data.success.subscription_id) {

                                    servicedata.isaac10.thankYouAfterAdd(data.success.subscription_id.toString()).then(function (ret) {
                                        if (!ret.plan) {   //fehlerhaft
                                            alertService.defaultErrorMessage("Ihre Registrierung konnte leider nicht abgeschlossen werden. Bitte bitte wenden Sie sich an den Support unter " + Strings.supportdata.supporttelnr + " oder unter " + Strings.supportdata.supportemail);
                                        } else {
                                            //Die evt bereits vorhandenen Billingdaten mit den eingegebenen überschreiben
                                            servicedata.isaac10.updateBillingData({billing_data: data}).then(function () {

                                            });        //falls schon von vorher Rechnungsinfos da waren werden diese nun überschrieben
                                        }
                                    });
                                }
                            });
                        } else {//create new customer - es gab noch nie eine subscription


                            data.password = Math.floor(Math.random() * 900000) + 100000;
                            data.password = "" + data.password + "";
                            data.double_opt_in = false;

                            servicedata.isaac10.register({register: data}).then(function (ret) {
                                if (!ret || !ret.success || !ret.success.customer_number || !ret.success.subscription_id) {
                                    defer.resolve(false);
                                } else if (ret.success) {      //update user data in mailtastic backend
                                    var params = {
                                        isaacCustomerNumber: ret.success.customer_number,
                                        isaacCustomerToken: ret.success.customer_token,
                                        
                                    };
                                    
                                    //check if custom plan data for custom prices
                                    if(data.customPlanData && data.customPlanData.plan && data.customPlanData.addition){
                                        params.isaacCustomPlan = data.customPlanData.plan;
                                        params.isaacCustomAddition = data.customPlanData.addition;
                                        
                                        //set custom plan and addition
                                        servicedata.customAddition = data.customPlanData.addition;
                                        servicedata.customPlan = data.customPlanData.plan;

                                    }
                                    
                                    userService.addPaymentCredentials(params).then(function (data) {
                                        //complete registration

                                        if (data.success === true) {

                                            //set credentials in service
                                            servicedata.isaacCustomerNumber = ret.success.customer_number;
                                            servicedata.isaacCustomerToken = ret.success.customer_token;
                                            
                                            
                                           
                                            

                                            //authentcate Customer
                                            servicedata.isaac10.authenticateCustomer(servicedata.isaacCustomerNumber, servicedata.isaacCustomerToken);

                                            //complete registration
                                            servicedata.isaac10.thankYouAfterRegister(ret.success.subscription_id, {double_opt_in: false}).then(function (data) {
                                                defer.resolve(true);

                                            }, function (err) {
                                                alertService.defaultErrorMessage("Ihre Registrierung konnte nicht leider nicht abgeschlossen werden. Bitte bitte wenden Sie sich an den Support unter " + Strings.supportdata.supporttelnr + " oder unter " + Strings.supportdata.supportemail);
                                                defer.resolve(false);
                                            });
                                        } else {
                                            defer.resolve(false);
                                        }
                                    });
                                } else {
                                     alertService.defaultErrorMessage("Ihre Registrierung konnte nicht leider nicht abgeschlossen werden. Bitte bitte wenden Sie sich an den Support unter " + Strings.supportdata.supporttelnr + " oder unter " + Strings.supportdata.supportemail);
                            
                                }
                            }, function (err) {
                                 alertService.defaultErrorMessage("Ihre Registrierung konnte nicht leider nicht abgeschlossen werden. Bitte bitte wenden Sie sich an den Support unter " + Strings.supportdata.supporttelnr + " oder unter " + Strings.supportdata.supportemail);
                            
                                //alert(JSON.stringify(err));
                            });
                        }
//                    }
//                });
            });
            return defer.promise;
        };
        
        
        /**
         * get monthly price for employee in cents
         * @returns {undefined}
         */
        this.getPriceData = function(planId, additionId){
            if(!planId || !additionId){
                return $q.reject("missing parameters : plan : " + planId + " : addition : " + additionId);
            }
            
            var deferred = $q.defer();
            service.prepare()
//                    .then(function(data){
//                        if(data === true){
//                            return $q.resolve();
//                        }else{
//                            return $q.reject();
//                        }
//                    })
                    .then(
                       function(){
                           var deferredInner = $q.defer(); 
                           servicedata.isaac10.getPlan(planId).then(function(data){
                               deferredInner.resolve(data);
                               
                           },function(){
                               deferredInner.reject("Custom Plan data not found");
                           });
                           
                           return deferredInner.promise;
                       }
                    
                    
                    )
                    .then(function(data){
                          
                            var price;
                            data = data.plan;
                                if(data && data.additions && data.additions.length !== 0){
                                    for(var i = 0 ; i < data.additions.length ; i++){
                                        if(data.additions[i].nid === additionId){   //addition we are searching for
                                            var additionObject = data.additions[i];
                                            if(additionObject.price && additionObject.price.length === 3){  //check which interval price is set
                                                if(additionObject.price[0].cents){  //price is monthly -  do not divide
                                                    price = additionObject.price[0].cents;
                                                }else if(additionObject.price[1].cents){
                                                    price = additionObject.price[1].cents / 4; //price is quarterly -  device through 4
                                                }else if(additionObject.price[2].cents){
                                                    price = additionObject.price[2].cents / 12;//price is yearly -  device through 12
                                                }
                                                break;
                                            }
                                        }
                                    }
                                }
                            if(price){
                               deferred.resolve(price);
                            }else{
                               deferred.reject("price not found");
                            }
                        })
                    
                   
                    .catch(function(e){
                        deferred.reject(e);
                        
                    });
            
            return deferred.promise;
        };

    }
]);
