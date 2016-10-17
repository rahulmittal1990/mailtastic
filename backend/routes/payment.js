var express = require('express');
var router = express.Router();
var url = require('url');
bodyParser = require('body-parser'), //parses information from POST
methodOverride = require('method-override'); //used to manipulate POST
var accountHelper = require('../helpers/accounthelper');
var helpers = require('../helpers/helperfunctions');
var $q = require('q');
var fastbillPayment = require('../helpers/fastbill_payment');

/**
 * 
 * @param {type} param1
 * @param {type} param2Get customer data from fastbill for admin user
 */
router.get('/customerdata', function (req, res, next) {
    if(!req.tokendata.id){
        res.json({
            success : false,
            code : 100
        });
    }else{
         var fastBillObject = new fastbillPayment();
        
        fastBillObject.getCustomerData(req.tokendata.id)
                .then(function(data){
                      res.json({
                        success : true,
                        data : data
                    });
                    
                })
                .catch(function(e){
                    console.error("Error in getting customer fastbill data: " + e);
                    res.json({
                        success : false,
                        code : 101
                    });
                    
                });
    }
    //

});

router.put('/customerdata/edit', function (req, res, next) {
    if(!req.tokendata.id 
            || 
            !req.body.EMAIL 
            || 
            !req.body.ORGANIZATION 
            ||  
            !req.body.ADDRESS 
            ||   
            !req.body.ZIPCODE 
            ||  
            !req.body.SALUTATION 
            ||   
            !req.body.FIRST_NAME 
            ||    
            !req.body.EMAIL 
            ||   
            !req.body.CITY 
            ||    
            !req.body.COUNTRY_CODE 
            ||    
            !req.body.LAST_NAME   
            ){
        res.json({
            success : false,
            code : 100
        });
    }else{
        var fastBillObject = new fastbillPayment();
        fastBillObject.updateCustomerData(req.tokendata.id, req.body)
                .then(function(data){ //get product data for subscription interval
                    res.json({
                        success : true,
                    }).end();
                })
                .catch(function(e){
                    console.error("Error in getting customer fastbill data: " + e);
                    res.json({
                        success : false,
                        code : 101
                    }).end();
                    
                });
    }
    //

});


/* GET users listing. */
router.get('/subscriptiondata', function (req, res, next) {
    if(!req.tokendata.id){
        res.json({
            success : false,
            code : 100
        });
    }else{
        var fastBillObject = new fastbillPayment();
        fastBillObject.getSubscriptionData(req.tokendata.id)
                .then(function(data){ //get product data for subscription interval
                    var deferred = $q.defer();
            
                    if(data.ARTICLE_NUMBER){
                         fastBillObject.getProductData(data.ARTICLE_NUMBER)
                                 .then(function(productData){
                                     data.SUBSCRIPTION_INTERVAL = productData.SUBSCRIPTION_INTERVAL;
                                     deferred.resolve(data);
                                  }).catch();
                    }else{
                         deferred.reject("PAYMENT : NO PRODUCT INFO FOUND");
                        
                    }
                   
                    return deferred.promise;
                })
        
                .then(function(data){
                      res.json({
                        success : true,
                        data : data
                    });
                    
                })
                .catch(function(e){
                    console.error("Error in getting customer fastbill data: " + e);
                    res.json({
                        success : false,
                        code : 101
                    });
                    
                });
    }
    //

});



router.post('/bookmailtastic', function (req, res, next) {
    if(!req.body.customerdata || !req.body.billing_interval 
              || 
            !req.body.customerdata.EMAIL 
            || 
            !req.body.customerdata.ORGANIZATION 
            ||  
            !req.body.customerdata.ADDRESS 
            ||   
            !req.body.customerdata.ZIPCODE 
            ||  
            !req.body.customerdata.SALUTATION 
            ||   
            !req.body.customerdata.FIRST_NAME 
            ||    
            !req.body.customerdata.EMAIL 
            ||   
            !req.body.customerdata.CITY 
            ||    
            !req.body.customerdata.COUNTRY_CODE 
            ||    
            !req.body.customerdata.LAST_NAME   
            ){
        res.json({
            success : false,
            code : 100
        });
    }else{
        //set external id for customer to identify afterwards
        req.body.customerdata.CUSTOMER_EXT_UID = req.tokendata.id;
        var fastBillObject = new fastbillPayment();
      
        User.findOne({where : {id : req.tokendata.id}})  //check referer / afiliate
                .then(function(data){
                    if(!data){  //no data found
                         res.json({
                            success : false,
                            code : 100
                        });
                        console.error("book mailtastic no user was found " + req.tokendata.id);
                       return $q.reject();   //we do not have afiliate
                    }else{
                        if(data.referer){
                             req.body.customerdata.AFFILIATE = data.referer;
                            return $q.resolve();    //we have a referer
                        }else{
                            return $q.resolve();   //we do not have afiliate
                        }
                    }
                    
                })
               
                .then(function(data){  //create new customer
                    
                    return  fastBillObject.createCustomer(req.body.customerdata);
                })
                
                 .then(function(customerCreationRetData){ //determine how many employees are needed
                    var def = $q.defer();   //outer promise
            
                    User.findAll(
                            { 
                                where : {
                                    $or : [
                                        {id : req.tokendata.id},
                                        {admin : req.tokendata.id}
                                    ]
                                }
                            } 
                                    ).then(function(data){
                                        if(!data){
                                             console.error("book mailtastic no employees were found " + req.tokendata.id);
                                            def.reject();   //we do not have afiliate
                                        }else{
                                            //customer has to book at least 5 members
                                            var amountOfUsers = data.length < 5 ? 5 : data.length;
                                           
                                            if(data.length)
                                           def.resolve( {
                                                amountOfMembers : amountOfUsers, 
                                                fastBillCustomerId : customerCreationRetData.CUSTOMER_ID
                                           });        //return amount of members which are in admin account
                                        }
                                        
                                    }).catch(function(e){
                                         console.error("book mailtastic no employees were found " + req.tokendata.id + "e: " + e);
                                          def.reject();   //we do not have afiliate
                                    });
                    
                    return def.promise;
                })
                
                .then(function(data){ //create subscription
                    
                     //determine vat percent
                     var vat = 19;
                     if(req.body.customerdata.COUNTRY_CODE !== "DE"){
                         vat = 0;
                     }
                    
                    return fastBillObject.createSubscription(data.fastBillCustomerId, req.body.billing_interval,  data.amountOfMembers, vat); 
             
                    
                })
                .then(function(data){
                     res.json({
                        success : true,
                        data : data
                    });
                    
                })
                .catch(function(e){
                    console.error("Error in getting customer fastbill data: " + e);
                    res.json({
                        success : false,
                        code : 101
                    });
                    
                });
    }
    //

});



/* GET users listing. */
router.post('/syncemployees', function (req, res, next) {
   
        var fastBillObject = new fastbillPayment();
      
                fastBillObject.getSubscriptionData(req.tokendata.id)    //get subscription data
               
                .then(function(subscriptionData){  //create new customer
                    //check if subscriptiondata is valid
                    if(subscriptionData.STATUS !== "active"){
                        return $q.reject("cannot sync employees no valid subscription for user : " + req.tokendata.id);
                    }else{
                          return $q.resolve(subscriptionData);
                    }
                    
                    
                })
                
                 .then(function(subscriptionData){ //determine how many employees are needed
                    var def = $q.defer();   //outer promise
            
                    User.findAll(
                            { 
                                where :{
                                     $or : [
                                        {id : req.tokendata.id},
                                        {admin : req.tokendata.id}
                                ]
                              }
                               
                            } 
                                    ).then(function(data){
                                        if(!data){
                                             console.error("sync employees mailtastic no employees were found " + req.tokendata.id);
                                            def.reject();   //we do not have afiliate
                                        }else{
                                            //customer has to book at least 5 members
                                            var amountOfUsers = data.length < 5 ? 5 : data.length;
                                           
                                            
                                           def.resolve( {
                                                subscriptionId : subscriptionData.SUBSCRIPTION_ID, 
                                                amountOfUsers : amountOfUsers,
                                                addonId : subscriptionData.ADDONS[0].ARTICLE_NUMBER,
                                                productId : subscriptionData.ARTICLE_NUMBER
                                           });        //return amount of members which are in admin account
                                        }
                                        
                                    }).catch(function(e){
                                         console.error("book mailtastic no employees were found " + req.tokendata.id + "e: " + e);
                                          def.reject();   //we do not have afiliate
                                    });
                    
                    return def.promise;
                })
                
                .then(function(data){ //change amount of addons in subscription
                   
                    return fastBillObject.updateAmountOfAddonsForSubscription(data.subscriptionId, data.productId, data.addonId,  data.amountOfUsers); 
                })
                .then(function(data){
                     res.json({
                        success : true,
                        data : data
                    });
                    
                })
                .catch(function(e){
                    console.error("Error in getting customer fastbill data: " + e);
                    res.json({
                        success : false,
                        code : 101
                    });
                    
                });
  
    //

});


/**
 * 
 * @param {type} param1
 * @param {type} param2Get customer data from fastbill for admin user
 */
router.get('/invoices', function (req, res, next) {
    if(!req.tokendata.id){
        res.json({
            success : false,
            code : 100
        });
    }else{
        var fastBillObject = new fastbillPayment();
        
        fastBillObject.getInvoices(req.tokendata.id)
                .then(function(data){
                      res.json({
                        success : true,
                        data : data
                    });
                    
                })
                .catch(function(e){
                    console.error("Error in getting customer fastbill data: " + e);
                    res.json({
                        success : false,
                        code : 101
                    });
                    
                });
    }
    //

});




/**
 * Change subscription of customer from monthly to yearly
 * @param {type} param1
 * @param {type} param2Get customer data from fastbill for admin user
 */
router.post('/changetoyearly', function (req, res, next) {
    if(!req.tokendata.id){
        res.json({
            success : false,
            code : 100
        });
    }else{
        var fastBillObject = new fastbillPayment();
        
        
        fastBillObject.changeToYearlySubscription(req.tokendata.id)
                .then(function(){
                     res.json({
                        success : true
                       
                    });
                    
                },
                function(e){
                    console.error("Change from yearly do monhtly failed: " + e);
                    res.json({
                        success : false
                       
                    });
            
                });
       
    }
    //

});

module.exports = router;
