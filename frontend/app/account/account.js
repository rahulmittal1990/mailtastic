'use strict';

angular.module('mailtasticApp.account', ['ui.bootstrap'])



        .controller('AccountCtrl', ['$scope', '$filter', 'userService', 'paymentService', '$window', '$q', 'alertService',function ($scope, $filter, userService, paymentService, $window, $q,alertService) {

                $scope.userdata = {
                    firstname: "",
                    lastname: "",
                    companyName: "",
                    email: "",
                    password: "",
                    newpassword: "",
                    newpasswordrep: "",
                };
                $scope.basketheadline = "Aktives Abo";

                $scope.basketData = {
                    basicprice: 15,
                    cumulatedAddUsersPrice: 0,
                    priceWithoutMwst: 0,
                    discount: 0,
                    mwst: 0,
                    total: 0
                };
                $scope.switchstep = function (mode) {
                    $scope.config.currentstep = mode;
                };

                $scope.config = {
                    currentstep: "userdata",
                    hideMonthlyInterval: false
                };

                $scope.pricedata = {
                    perUser: 3.00,
                    amountOfUsers: 0,
                    amountOfIncluded: 5,
                    discountfaktor: 0.17

                };
                
                $scope.isCustomPrice = false;

                $scope.isaacAccountData = {
                    email: ""
                };

                $scope.resetPassword = function () {
                    if (!$scope.userdata.email) {
                        alert(Strings.errors.DATEN_NICHT_GELADEN);
                    } else {
                        userService.resetPassword($scope.userdata.email).then(function (response) {
                            if (response.success === true) {
                                alert(Strings.passreset.PASS_MAIL_SENT);
                                $scope.cancel();
                            } else if (response.code === 3) {
                                alert(Strings.passreset.NO_ACCOUNT);
                            }
                            else {
                                alert(Strings.errors.TECHNISCHER_FEHLER);
                            }

                        });
                    }
                };

                $scope.plandata = {
                };

                $scope.invoices = [];

                $scope.invoicedata = {
                    gender: "male", // "male" oder "female"

                };

                $scope.paymentdata = {
                    payment_method: ""
                };

                $scope.subscriptiondata = {

                };


                //für den Warenkorb in der Übersicht
                $scope.calcPrice = function (customPricePerUser) {


//                    userService.getAmountOfUsers().then(function (amount) {
                        var amount = $scope.subscriptiondata.additions[0].quantity;
                        
                        
                        var mwst = 0;
                        if($scope.invoicedata.country === "DE"){
                            mwst = 0.19;
                        }
                        
                          $scope.pricedata.totalUsers = amount; 
                        if (!amount) {
                            alert(Strings.errors.DATEN_NICHT_GELADEN);
                        } else {
                                //gesamt anzahl an nutzern
                            if (amount <= $scope.pricedata.amountOfIncluded) {    //berechne anzahl an nutzern über free kontingent
                                $scope.pricedata.amountOfUsers = 0;
                            } else {
                                $scope.pricedata.amountOfUsers = amount - $scope.pricedata.amountOfIncluded;
                            }
                            
                            
                            if(customPricePerUser){ //there is a custom price for this user
                
                                $scope.pricedata.perUser  = customPricePerUser / 100;
               
                            }
           
                            
                            
                            
                            if ($scope.subscriptiondata.billing_interval === "yearly") {
                                $scope.basketData.basicprice = $scope.pricedata.perUser * 5 * 12;
                                $scope.basketData.cumulatedAddUsersPrice = $scope.pricedata.amountOfUsers * $scope.pricedata.perUser * 12;
                                $scope.basketData.priceWithoutMwst = $scope.basketData.basicprice + $scope.basketData.cumulatedAddUsersPrice;
                                if(customPricePerUser){
                                    $scope.basketData.discount =  0;    //when custom price then there is no discount
                                }else{
                                    $scope.basketData.discount = $scope.basketData.priceWithoutMwst * $scope.pricedata.discountfaktor;
                                }
                                $scope.basketData.mwst = ($scope.basketData.priceWithoutMwst - $scope.basketData.discount) * mwst;
                                $scope.basketData.total = $scope.basketData.priceWithoutMwst + $scope.basketData.mwst - $scope.basketData.discount;
                            } else if ($scope.subscriptiondata.billing_interval === "monthly") {
                                $scope.basketData.basicprice = $scope.pricedata.perUser * 5;
                                $scope.basketData.cumulatedAddUsersPrice = $scope.pricedata.amountOfUsers * $scope.pricedata.perUser;
                                $scope.basketData.priceWithoutMwst = $scope.basketData.basicprice + $scope.basketData.cumulatedAddUsersPrice;
                                $scope.basketData.discount = 0;
                                $scope.basketData.mwst = $scope.basketData.priceWithoutMwst * mwst;
                                $scope.basketData.total = $scope.basketData.priceWithoutMwst + $scope.basketData.mwst;

                            }
                        }
//                    });

                };

                $scope.placeOrderInvoice = function () {


                    //set email of user
                    paymentService.subscribeInvoice($scope.invoicedata).then(function (data) {

                        if (data === true) {
                            alert("Ihr Abonnement war erfolgreich. Sie erhalten in Kürze eine Bestätgigung per Mail. Herzliche Dank und viel Spaß.");
                            $scope.initData();
                        } else {
                            alert(Strings.errors.TECHNISCHER_FEHLER);
                            alert(JSON.stringify(data));
                        }
                    });

                };

                $scope.cancelPlan = function () {
                    //alert("Order canceled");
                    //$scope.subscriptiondata = {};
                    //$scope.paymentdata = {};
                    //$scope.plandata = {};
                    //$scope.invoicedata = {};
                    alert("Bitte richtigen Sie ihre unterschrieben Kündigung an: NETSTAG GmbH - Accounts - Rheinallee 88 - 55120 Mainz.");
                };

                $scope.initData = function () {

                    paymentService.clear(); //evt vorhandene Daten entfernen

                    //Vorhandene Anzahl an Usern laden damit die Preisberechnung durchgeführt werden kann
                    userService.getAmountOfUsers().then(function (amount) {
                        if (!amount) {
                            alert(Strings.errors.DATEN_NICHT_GELADEN);
                        } else {
                            if (amount <= $scope.pricedata.amountOfIncluded) {
                                $scope.pricedata.amountOfUsers = 0;
                            } else {
                                $scope.pricedata.amountOfUsers = amount - $scope.pricedata.amountOfIncluded;
                            }
                            
                              $scope.pricedata.currentAmountOfUsers = amount;
                        }
                    });

                    userService.getAccountData().then(function (data) {
                        if (!data || data.success === false) {
                            //TODO
                            alert(Strings.errors.DATEN_NICHT_GELADEN);
                        } else {
                            $scope.userdata.firstname = data.firstname;
                            $scope.userdata.lastname = data.lastname;
                            $scope.userdata.companyName = data.companyName;
                            $scope.userdata.email = data.email;
                            $scope.userdata.password = "";
                            $scope.userdata.newpassword = "";
                            $scope.userdata.newpasswordrep = "";
                            $scope.userdata.hasForce = data.forceAllow;;
                            
                        }

                    });


                    paymentService.getCustomerSubscriptionData().then(function (data) {
                        if (!data || !data.subscription || !data.billing_data || !data.payment_data || !data.plan) {
                            //alert("Tarifdaten konnten nicht geladen werden.");
                        } else {
                            $scope.subscriptiondata = data.subscription;
                            if ($scope.subscriptiondata.billing_interval === "yearly") {
                                $scope.config.hideMonthlyInterval = true;
                            }
                            
                            
                            //determine price per user
                            var price;
                            if(data.plan && data.plan.additions && data.plan.additions.length !== 0){
                              
                                var additionObject = data.plan.additions[0];
                                if(additionObject.price && additionObject.price.length === 3){  //check which interval price is set
                                    if(additionObject.price[0].cents){  //price is monthly -  do not divide
                                        price = additionObject.price[0].cents;
                                    }else if(additionObject.price[1].cents){
                                        price = additionObject.price[1].cents / 4; //price is quarterly -  device through 4
                                    }else if(additionObject.price[2].cents){
                                        price = additionObject.price[2].cents / 12;//price is yearly -  device through 12
                                    }

                                }
                               
                            }
                            if(price){ //if price could not be calculated take default price
                                $scope.pricedata.perUser = price / 100;
                                    $scope.isCustomPrice = true;
                            }else{
                                price = $scope.pricedata.perUser;
                            }

                            $scope.paymentdata = data.payment_data;
                            $scope.invoicedata = data.billing_data;
                            $scope.plandata = data.plan;



                            $scope.calcPrice(price); //für warenkorb
                        }


                    });

                    paymentService.getIsaacAccountData().then(function (data) {
                        if (!data || !data.email) {

                        } else {
                            $scope.isaacAccountData = data;
                        }
                    });

                    paymentService.getInvoices().then(function (data) {
                        if (!data || !data.bills || !data.bills[0]) {
                            //TODO print no invoices or hide area
                            // alert("Keine Rechnungen");
                        } else {
                            $scope.invoices = data.bills[0];
                        }
                    });
                    
                    

                    //calculate min height
                    $scope.config.minheight = $window.innerHeight - 60 - 90 - 30;
                };

                $scope.downloadInvoice = function (url) {
                    
                    //replace http with https
                    if(!url.contains('https') && url.contains('http')){
                        url = url.replace('http', 'https');
                    }
                    
                    if (!url) {
                            alertService.defaultErrorMessage("Beim Download Ihrer Rechnung ist ein Fehler aufgetreten. Bitte wenden Sie sich an support@mailtastic.de bzw. telefonisch an "+ Strings.supportdata.supporttelnr);
                    } else {
                        paymentService.downloadInvoice(url);
                    }
                };



                //ändert das Zahlungsinterval
                $scope.changePaymentInterval = function () {
                    
                    if($scope.subscriptiondata.billing_interval === "monthly"){
                        alert("Ihr Abonnement hat sich nicht geändert.");
                        return;
                    }
                    paymentService.updatePaymentInterval($scope.subscriptiondata).then(function (data) {
                        if (data === true) {
                            alert(Strings.payment.success.CHANGE_BILLING_INFO_SUCCESS);
                            $scope.initData();
                        } else {


                            alert(Strings.payment.errors.CHANGE_BILLING_INFO_FAILED);

                        }
                    }, function (err) {
                        alert(Strings.payment.errors.CHANGE_BILLING_INFO_FAILED);
                    });
                };

                $scope.emailchanged = false;        //email wurde angepasst vom nutzer
                $scope.emailChanged = function () {
                    $scope.emailchanged = true;

                };
                //für das Ändern der E-Mail Adresse für Isssac10
                $scope.changeIsaacAccountData = function () {
                    var defer = $q.defer();




                    return defer.promise;

                };
                //ändern die rechnungsadresse
                $scope.changeInvoiceInfo = function () {
                    if($scope.invoicedata){
                        $scope.invoicedata.title = "";
                    }
                    
                    paymentService.updateBillingData($scope.invoicedata).then(function (data) {
                        if (data === true) {
                            if ($scope.emailchanged === true) {  //Nur wenn emal bearbeitet wurde werden die account daten bei isaac10 aktualisiert
                                paymentService.updateIsaacAccountData($scope.isaacAccountData).then(function (data) {
                                    if (data === true) {
                                        alert(Strings.payment.success.CHANGE_PAYMENT_INTERVAL);
                                    } else {
                                        alert(Strings.payment.errors.CHANGE_PAYMENT_INTERVAL);
                                    }
                                    $scope.initData();
                                    $scope.emailchanged = false;        //email wurde angepasst zurücksetzen
                                });




                            } else {
                                alert(Strings.payment.success.CHANGE_PAYMENT_INTERVAL);
                            }
                        } else {

                        }
                      
                    }, function (err) {
                        alert(Strings.payment.errors.CHANGE_PAYMENT_INTERVAL);
                        $scope.initData();
                    });


                };


                /**
                 * Mailtastic Daten wie Unternehmensname und Passwort - NICHT RECHNUNGSDATEN
                 * @returns {undefined}
                 */
                $scope.updateAccountData = function () {
                    if ($scope.userdata.newpassword !== $scope.userdata.newpasswordrep) {
                        alert("Ihr neues Passwort stimmt nicht überein. Bitte geben Sie 2x das gleiche Passwort ein.");
                    } else if ($scope.userdata.newpassword && $scope.userdata.newpassword.length < 6) {
                        alert("Das neue Passwort muss mindestens 6 Zeichen lang sein.");

                    } else {
                        userService.setAccountData($scope.userdata).then(function (data) {
                            if (data.success === true) {
                               
                                alertService.defaultSuccessMessage("Ihre Daten wurden erfolgreich geändert.");
                            } else if (data.code === 3) {
                                alert("Ihr eingegebenes Passwort war nicht korrekt. Falls Sie Ihr Passwort vergessen haben, können Sie es jederzeit zurücksetzen.");
                            } else {
                                alert(Strings.errors.TECHNISCHER_FEHLER);
                            }

                            $scope.initData();
                        });
                    }
                };




                $scope.testAction = function () {
                    paymentService.subscribeInvoice($scope.invoicedata).then(function (data) {

                        if (data === true) {
                            alert("SUPER");
                        } else {
                            alert(JSON.stringify(data));
                        }
                    });
                };

                $scope.initData();

            }]);

String.prototype.contains = function(it) { return this.indexOf(it) != -1; };