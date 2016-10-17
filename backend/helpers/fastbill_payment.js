
var request = require('request');
var $q = require('q');
var moment = require('moment');
var config = require('../config/config.js');

/* 
 * Class to handle connection with fastbill automatic
 */
var Fastbill = function() {
    var apiToken = config.fastBillApiToken;
    var yearlyPlanId =  config.yearlyPlanId;
    var yearlyAdditionId =  config.yearlyAdditionId;
    var monthlyPlanId =  config.monthlyPlanId;
    var monthlyAdditionId =  config.monthlyAdditionId;
    var fastBillUrl = "https://automatic.fastbill.com/api/1.0/api.php";
    var ownObject = this;
    
    /**
     * Make request to Fastbill APi
     */
    function requestFastbill(requestData){
        var deferred = $q.defer();
        
        var adminEmail = "a.schroeder@netstag.com";
        var auth = 'Basic ' + new Buffer(adminEmail + ':' + apiToken).toString('base64');
     
        //var auth = 'Basic ' + adminEmail + ':' + apiToken;
        
         var requestOptions = {
                url: fastBillUrl,
                method: 'POST',
                auth: {
                    user: adminEmail,
                    password: apiToken
                },
                json : true,
                body : requestData,
        };
                     
        request(requestOptions, function (error, response, body) {
            if (body.RESPONSE.ERRORS || response.statusCode !== 200) {
                console.error(error);
                console.error(response);
                deferred.reject("fastbill response had errors :" + JSON.stringify(body.RESPONSE.ERRORS));

            }else{
              //console.log("Isaac Response: " + body) // Show the HTML for the Google homepage. 

              //parse responseu
              //body = JSON.parse(body);
              deferred.resolve(body.RESPONSE);
            };
        });
        
        
        return deferred.promise;
    };
    
   
    /**
     * *  Some fastbill api nodes do not provide filtering by ext uid
     *  so this function returns fastbill CUSTOMER_ID with given admin id from mailtastic
     */
    function getCustomerIdFromExtUid(extUid){
         var deferred = $q.defer();
         var requestData = {
                "SERVICE":"customer.get",
                "FILTER": {
                     "CUSTOMER_EXT_UID"  : extUid
                }
        };
         
         requestFastbill(requestData)
                 .then(function(data){
                     if(!data || !data.CUSTOMERS.length === 0){
                         deferred.reject("could not get own customer data");
                     }else{
                         deferred.resolve(data.CUSTOMERS[0].CUSTOMER_ID);
                     }
                 }).catch(function(e){
                      deferred.reject("could not getfastbill id from adminid");
                 })
         
         return deferred.promise;
    }
    
    
     
    /**
     * Change subscription of customer from monthly to yearly
     */
    this.changeToYearlySubscription = function(adminId){
         var deferred = $q.defer();
        
         this.getSubscriptionData(adminId)
                .then(function(data){
                    if(!data.ARTICLE_NUMBER || !data.ADDONS || data.ADDONS.length === 0 || !data.SUBSCRIPTION_ID){
                        return $q.reject("NO ARTICLE IN SUBSCRIPTION FOUND adminid : " + adminId);
                    }else{
                        
                        var subscriptionId = data.SUBSCRIPTION_ID;
                        var articleNumber = data.ARTICLE_NUMBER;
                        if(articleNumber !== monthlyPlanId){
                             return $q.reject("Is already in yearly subscription");
                        }
                        var addonNumber = data.ADDONS[0].ARTICLE_NUMBER;
                        var amountOfAddons = data.ADDONS[0].QUANTITY;
                        amountOfAddons = amountOfAddons < 5 ? 5 : amountOfAddons;   //has to have at least 5 employees
                        if(addonNumber !== monthlyAdditionId){
                            return $q.reject("Is already in yearly subscription ADDON");
                        }
                        
                        //build new subscription object
                            var requestData = {
                                "SERVICE":"subscription.changearticle",
                                "DATA":{
                                    "SUBSCRIPTION_ID" : subscriptionId,
                                    "ARTICLE_NUMBER" : yearlyPlanId,
                                    "ADDONS" : [
                                        {
                                            "ARTICLE_NUMBER" : yearlyAdditionId,
                                            "QUANTITY" : amountOfAddons,
                                            "VAT_PERCENT" : data.ADDONS[0].VAT_PERCENT
                                        }
                                    ]
                                }
                            };
                        return $q.resolve(requestData);
                    }
                    
                })
                .then(function(newSubData){
                    //make request
                      requestFastbill(newSubData)
                        .then(function(data){
                            if(data.STATUS === "success"){
                                deferred.resolve();
                            }else{
                                deferred.reject();
                                
                            }
                            
                        });


                }).catch(function(e){
                        deferred.reject(e);
                });
        return deferred.promise;
    };
    
    
     /**
     * Get product Data for single product
     * @param {type} product number
     * @returns {$q@call;defer.promise}
     */
    this.getProductData = function(productId){
        var deferred = $q.defer();
        var requestData = {
                "SERVICE":"article.get",
                "FILTER": {
                     "ARTICLE_NUMBER"  : productId
                }
        };
         
        requestFastbill(requestData)
                .then(function(data){
                    if(!data || !data.ARTICLES || data.ARTICLES.length === 0){
                        deferred.reject("ARTICLE NOT FOUND id: " + productId);
                    }else{
                        deferred.resolve(data.ARTICLES[0]);
                    }
                    
                })
                
        return deferred.promise;
    };
    
    
    
    
    /**
     * Get customer Data
     * @param {type} maitlastic User id of admin fastbill id of customer
     * @returns {$q@call;defer.promise}
     */
    this.getCustomerData = function(mailtasticAdminId){
        var deferred = $q.defer();
        var requestData = {
                "SERVICE":"customer.get",
                "FILTER": {
                     "CUSTOMER_EXT_UID"  : mailtasticAdminId
                }
        };
         
         requestFastbill(requestData).then(function(data){
            if(data.CUSTOMERS.length === 0){
                deferred.reject("fastbill: no subscription was found");
            }else{
                
               deferred.resolve(data.CUSTOMERS[0]); //return first subscription in list because user should only have one subscription
            }
            
        });
        
        
        return deferred.promise;
    };
    
    
    
    
    
    /**
     * Get customer Data
     * @param {type} adminId id of the admin in mailtastic
     * @returns {$q@call;defer.promise}
     */
    this.getSubscriptionData = function(adminId){
         var deferred = $q.defer();
        var requestData = {
               "SERVICE":"subscription.get",
               "FILTER": 
                   {
                       "CUSTOMER_EXT_UID" : adminId    //extern ID is own id from mailtastic
                   }
               
        };
         
        requestFastbill(requestData).then(function(data){
            if(data.SUBSCRIPTIONS.length === 0){
                deferred.reject("fastbill: no subscription was found");
            }else{
                
               deferred.resolve(data.SUBSCRIPTIONS[0]); //return first subscription in list because user should only have one subscription
            }
            
        });
        return deferred.promise;
    };
    
    
    /**
     * Register a new customer
     * @param {type} data 
     * @returns {undefined}
     */
    this.createCustomer = function(data){
        var deferred = $q.defer();
        var requestData = {
            "SERVICE":"customer.create",
            "DATA": data
        };
        
        //all customers are business customers
        requestData.DATA.CUSTOMER_TYPE = "business";
        
        requestFastbill(requestData).then(function(data){
            if(data.CUSTOMER_ID && data.STATUS === "success"){
                deferred.resolve(data);
            }else{
                 deferred.reject("Fastbill customer creation failed: " + JSON.stringify(requestData)); //return first subscription in list because user should only have one subscription
            }
            
        });
        
         return deferred.promise;
    };
    
    
     /**
     * Creater a new subscription
     * @param {type} customerId 
     * @param {type} billingInterval  does user want yearly or monthly subscription
     * @returns {undefined}
     */
    this.createSubscription = function(customerId, billingInterval, amountOfEmployees, vatPercent){
        var deferred = $q.defer();
        
        
        if(billingInterval !== "yearly" && billingInterval !== "monthly"){
            return $q.reject("invalid billing interval");
        }
        
        var articleNumber  = billingInterval === "yearly"   ?     yearlyPlanId        :   monthlyPlanId;
        var additionNumber = billingInterval === "yearly"   ?     yearlyAdditionId    :   monthlyAdditionId;
        
        
       
        
        var requestData = {
            "SERVICE":"subscription.create",
            "DATA":{
            	"ARTICLE_NUMBER" : articleNumber,
		"CUSTOMER_ID": customerId,
                "ADDONS" : [
                    {
                        "ARTICLE_NUMBER" : additionNumber,
                        "QUANTITY" : amountOfEmployees,
                        "VAT_PERCENT" : vatPercent
                    }
                ]
            }
        };
        
        //all customers are business customers
        requestData.DATA.CUSTOMER_TYPE = "business";
        
        requestFastbill(requestData).then(function(data){
            if(data.SUBSCRIPTION_ID && data.STATUS === "success"){
                deferred.resolve(data);
            }else{
                 deferred.reject("fastbill subscription creation failed :" + JSON.stringify(requestData)); //return first subscription in list because user should only have one subscription
            }
            
        });
        
         return deferred.promise;
    };
    
    
    /**
     * Update amount of addons in subsription
     * is used for syncing the amount of emloyees in mailtastic with the amount of employees in payment provider
     */
    this.updateAmountOfAddonsForSubscription = function(subscriptionId, productId, addonId, amountOfAddons){
        var requestData = {
            "SERVICE":"subscription.changearticle",
            "DATA" : {
                    SUBSCRIPTION_ID : subscriptionId,
                    ARTICLE_NUMBER : productId,
                    ADDONS : [
                        {
                            ARTICLE_NUMBER : addonId,
                            QUANTITY : amountOfAddons
                        }
                    ]
            }
         
            
        };
        
         requestFastbill(requestData).then(function(data){
            if(data.SUBSCRIPTION_ID && data.STATUS === "success"){
                deferred.resolve(data);
            }else{
                 deferred.reject("fastbill subscription creation failed :" + JSON.stringify(requestData)); //return first subscription in list because user should only have one subscription
            }
            
        });
        
        
    }
    
    
    
    
    /**
     * Get all invoices for customer
     * @param {type} adminId id of the admin in mailtastic
     * @returns {$q@call;defer.promise}
     */
    this.getInvoices = function(adminId){
        var deferred = $q.defer();
        
        
        //get customer id which is used in fastbill
        getCustomerIdFromExtUid(adminId)
        .then(
        function(customerId){
            return $q.resolve(customerId);
        },
        function(){
            deferred.reject();  //no customer found so user does not have an active subscription
        }
        )
        .then(function(customerId){
            var requestData = {
               "SERVICE":"invoice.get",
               "FILTER": 
                   {
                       "CUSTOMER_ID" : customerId    //extern ID is own id from mailtastic
                   }
            };
         
            requestFastbill(requestData).then(function(data){
                if(!data.INVOICES || !Array.isArray(data.INVOICES) || data.INVOICES.length === 0){
                  return $q.reject("fastbill: no subscription was found");
                }else{
                    deferred.resolve(data.INVOICES); //return first subscription in list because user should only have one subscription
                }

            }).catch(function(e){
             deferred.reject("fastbill: no subscription was found" + e);
             });
        }).catch(function(e){
             deferred.reject("fastbill: no subscription was found" + e);
        });
        
        return deferred.promise;
    };
 
    
     /**
    
     * @param {type} adminId
     * @param {type} customerData
     * @returns {$q@call;defer.promise} * Update customer info like email adress and oganization
     * Does not affect mailtastic account
     * @param {type} adminId id of the admin in mailtastic
     * @returns {$q@call;defer.promise}
     */
    this.updateCustomerData = function(adminId, customerData){
        var deferred = $q.defer();
        
        
        //get customer id which is used in fastbill
        getCustomerIdFromExtUid(adminId)
        .then(
        function(customerId){
            return $q.resolve(customerId);
        },
        function(){
            deferred.reject();  //no customer found so user does not have an active subscription
        }
        )
        .then(function(customerId){
            var requestData = {
               "SERVICE":"customer.update",
               "SUPPRESS_MAIL" : "1",
               "DATA": 
                   {
                        "CUSTOMER_ID" : customerId ,  
                        "ORGANIZATION" : customerData.ORGANZIATION,   
                        "ADDRESS" : customerData.ADDRESS ,   
                        "ZIPCODE" : customerData.ZIPCODE , 
                        "SALUTATION" : customerData.SALUTATION ,  
                        "FIRST_NAME" : customerData.FIRST_NAME ,   
                        "TITLE_ACADEMIC" : customerData.TITLE_ACADEMIC ,   
                        "EMAIL" : customerData.EMAIL ,  
                        "VAT_ID" : customerData.VAT_ID ,   
                        "CITY" : customerData.CITY ,   
                        "COUNTRY_CODE" : customerData.COUNTRY_CODE ,   
                        "LAST_NAME" : customerData.LAST_NAME ,   
                       
                   }
            };
            
            requestFastbill(requestData).then(function(data){
                if(data.STATUS !== "success" || !data.CUSTOMER_ID){
                    deferred.reject("fastbill: customerdata could not be changed");
                }else{
                    deferred.resolve(); //return first subscription in list because user should only have one subscription
                }

            }).catch();
        }).catch(function(e){
             deferred.reject("fastbill: customer data change failed" + e);
        });
        
        return deferred.promise;
    };
};


module.exports = Fastbill;