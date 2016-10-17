(function(){this.Isaac10=function(){function t(e,r){null==r&&(r="production"),this.env=r,this.apiToken={notLoaded:!0},this.submitHost=this._submitHost(e,r),this.betterpayment=new t.BetterpaymentIntegration(this)}return t.DEVELOPMENT_HOST="localhost.dev:3000",t.STAGING_HOST="liquid-staging.de:8001",t.PRODUCTION_HOST="isaac10.com:443",t.TEST_HOST="localhost.dev:31337",t.prototype.login=function(e,r){return new t.Authenticate(this).run(null,{email:e,password:r}).success(function(t){return function(e){return t.authenticateCustomer(e.success.customer_number,e.success.customer_token)}}(this))},t.prototype.authenticateCustomer=function(t,e){this.customerNumber=t,this.customerApiToken=e},t.prototype.authenticateMerchant=function(t){this.merchantApiToken=t},t.prototype.hasAuthenticatedCustomer=function(){return Boolean(this.customerNumber&&this.customerApiToken)},t.prototype.hasAuthenticatedMerchant=function(){return Boolean(this.merchantApiToken)},t.prototype.getPlan=function(e){return new t.GetPlan(this).run(e,null)},t.prototype.checkCouponCode=function(e,r){return new t.CheckCouponCode(this).run(e,r)},t.prototype.register=function(e){return new t.PostRegister(this).run(null,e)},t.prototype.thankYouAfterRegister=function(e,r){return new t.ThankYouAfterRegister(this).run(e,r)},t.prototype.getAccount=function(){return new t.GetAccount(this).run(null,null)},t.prototype.updateAccountData=function(e){return new t.UpdateAccountData(this).run(null,e)},t.prototype.updatePassword=function(e){return new t.UpdatePassword(this).run(null,e)},t.prototype.updateBillingData=function(e){return new t.UpdateBillingData(this).run(null,e)},t.prototype.updatePaymentData=function(e){return new t.UpdatePaymentData(this).run(null,e)},t.prototype.getBills=function(){return new t.GetBills(this).run(null,null)},t.prototype.downloadBill=function(e){return new t.DownloadBill(this).run(e)},t.prototype.getSubscriptions=function(){return new t.GetSubscriptions(this).run(null,null)},t.prototype.getSubscribe=function(e){return new t.GetSubscribe(this).run(null,e)},t.prototype.addSubscription=function(e){return new t.PostSubscribe(this).run(null,e)},t.prototype.thankYouAfterAdd=function(e){return new t.ThankYouAfterAdd(this).run(e,null)},t.prototype.editSubscription=function(e){return new t.GetEditSubscription(this).run(e,null)},t.prototype.updateSubscription=function(e,r){return new t.UpdateSubscription(this).run(e,r)},t.prototype.cancelSubscription=function(e){return new t.CancelSubscription(this).run(e,null)},t.prototype.uncancelSubscription=function(e){return new t.UncancelSubscription(this).run(e,null)},t.prototype.getUpgradeDowngradeSubscription=function(e,r){return new t.GetUpgradeDowngradeSubscription(this).run([e,r],null)},t.prototype.upgradeDowngradeSubscription=function(e,r){return new t.UpgradeDowngradeSubscription(this).run(e,r)},t.prototype.thankYouAfterUpgradeDowngrade=function(e){return new t.ThankYouAfterUpgradeDowngrade(this).run(e,null)},t.prototype.getProducts=function(){return new t.GetProducts(this).run(null,null)},t.prototype.getCustomers=function(){return new t.GetCustomers(this).run(null,null)},t.prototype.getCustomerCustomData=function(e){return new t.GetCustomerCustomData(this).run(e,null)},t.prototype.setCustomerCustomData=function(e,r){return new t.UpdateCustomerCustomData(this).run(e,r)},t.prototype.getClearance=function(){return new t.GetClearance(this).run(null,null)},t.prototype.clearBill=function(e){return new t.ClearBill(this).run(e,null)},t.prototype.createBillItem=function(e){return new t.CreateBillItem(this).run(null,e)},t.prototype.authorizationHeaderForCustomer=function(){return{Authorization:'Token token="'+this.customerApiToken+'"'}},t.prototype.authorizationHeaderForMerchant=function(){return{Authorization:'Token token="'+this.merchantApiToken+'"'}},t.prototype.withApiToken=function(){var t;return t=$.Deferred(),this.apiToken.notLoaded?$.getJSON(this.submitHost+"/api/v1/api_token").then(function(e){return function(r){return e.apiToken=r.api_token,t.resolve()}}(this)):t.resolve(),t},t.prototype.buildUrlFor=function(t){return""+this.submitHost+t},t.prototype.displayCreditCardIFrame=function(t,e,r){return $(t).replaceWith(this.getCreditCardIFrame(e,r)),this.initializeCreditCardIFrame()},t.prototype.getCreditCardIFrame=function(e,r){return new t.GetCreditCardIFrame(this).run(e,r)},t.prototype.initializeCreditCardIFrame=function(){return new t.InitializeCreditCardIFrame(this).run()},t.prototype.submitCreditCardIFrame=function(){return new t.SubmitCreditCardIFrame(this).run()},t.prototype.processPaypal=function(e,r){return new t.ProcessPaypal(this).run(e,r)},t.prototype._submitHost=function(e,r){var n,o;switch(r){case"production":n=t.PRODUCTION_HOST,o="https";break;case"staging":n=t.STAGING_HOST,o="http";break;case"test":n=t.TEST_HOST,o="http";break;default:n=t.DEVELOPMENT_HOST,o="http"}return o+"://"+e+"."+n},t}()}).call(this),function(){Isaac10.BetterpaymentIntegration=function(){function t(t){this.isaac10Instance=t,this.iframeEventListenerRegistered=!1,this.iframePromise=null,this.iframeResponse=null}return t.DEVELOPMENT_URL="https://testapi.betterpayment.de",t.STAGING_URL="https://testapi.betterpayment.de",t.PRODUCTION_URL="https://testapi.betterpayment.de",t.TEST_URL="https://testapi.betterpayment.de",t.IFRAME_DOM_ID="betterpayment-credit-card-iframe",t.prototype.iframeDomId=function(){return Isaac10.BetterpaymentIntegration.IFRAME_DOM_ID},t.prototype.baseUrl=function(){switch(this.isaac10Instance.env){case"production":return Isaac10.BetterpaymentIntegration.PRODUCTION_URL;case"staging":return Isaac10.BetterpaymentIntegration.STAGING_URL;case"test":return Isaac10.BetterpaymentIntegration.TEST_URL;default:return Isaac10.BetterpaymentIntegration.DEVELOPMENT_URL}},t.prototype.buildInitializeIFrameUrl=function(){return this.baseUrl()+"/register_card"},t}()}.call(this),function(){Isaac10.PaymentData=function(){function t(){}return t["for"]=function(t,e,r){switch(t.payment_method){case"cc_betterpayment":return new Isaac10.PaymentData.Betterpayment(t,e,r);case"cc_paymill":case"elv_paymill":return new Isaac10.PaymentData.Paymill(t,e,r);default:return new Isaac10.PaymentData.Internal(t,e,r)}},t}()}.call(this),function(){Isaac10.PaymentData.Betterpayment=function(){function t(t,e,r){this.data=t,this.isaac10Instance=e,this.previewMode=r}return t.prototype.process=function(){var t;return t=$.Deferred(),this.isaac10Instance.submitCreditCardIFrame().then(function(e){return function(r){return e.parsedResponse=e._parseQueryString(r),"ok"===e.parsedResponse.result?(e.processSuccess=!0,t.resolve()):(e.processSuccess=!1,t.reject())}}(this))},t.prototype.processParams=function(t){return"ok"===this.parsedResponse.result?(t.transaction_id=this.parsedResponse.transaction_id,t.card_last4=this.parsedResponse.last_four,t.card_expire_month=this.parsedResponse.expiry_month,t.card_expire_year=this.parsedResponse.expiry_year):(t.betterpayment_error_code=this.parsedResponse.code,t.betterpayment_error_message=this.parsedResponse.message),t},t.prototype._parseQueryString=function(t){var e,r,n,o,a,i,s,u;for(e={},i=t.split("&"),r=0,a=i.length;a>r;r++)o=i[r],s=o.split("="),n=s[0],u=s[1],e[n]=decodeURIComponent(u).replace(/\+/g," ");return e},t}()}.call(this),function(){Isaac10.PaymentData.Internal=function(){function t(t,e,r){this.data=t,this.isaac10Instance=e,this.previewMode=r}return t.prototype.process=function(){return $.Deferred().resolve()},t.prototype.processParams=function(t){return t},t.prototype.processSuccess=!0,t}()}.call(this),function(){Isaac10.PaymentData.Paymill=function(){function t(t,e,r){this.data=t,this.isaac10Instance=e,this.previewMode=r}return t.prototype.process=function(){var t;return t=$.Deferred(),this.isaac10Instance.withApiToken().then(function(e){return function(){var r;return null==e.isaac10Instance.apiToken.paymill_test_public_token||null==e.isaac10Instance.apiToken.paymill_production_public_token?(e.processSuccess=!1,e.errorMessage="Interner Fehler: Paymill-Anbindung fehlerhaft konfiguriert",t.reject()):(r=e.isaac10Instance.apiToken.sandbox_mode||e.previewMode?e.isaac10Instance.apiToken.paymill_test_public_token:e.isaac10Instance.apiToken.paymill_production_public_token,e.paymillIntegration=new Isaac10.PaymillIntegration(r),e.paymillIntegration.submit({cardholder:e.data.card_holdername,number:e.data.card_number,cvc:e.data.card_cvc,exp_month:e.data.card_expire_month,exp_year:e.data.card_expire_year,amount_int:"100",currency:"EUR"}).then(function(){return e.processSuccess=!0,t.resolve()},function(){return e.processSuccess=!1,e.errorMessage=e.paymillIntegration.errorMessage,t.reject()}))}}(this)),t},t.prototype.processParams=function(t){return delete t.card_number,delete t.card_cvc,t.paymill_token=this.paymillIntegration.resultToken,t.card_type=this.paymillIntegration.resultType,t.card_last4=this.paymillIntegration.resultLast4,t},t}()}.call(this),function(){Isaac10.PaymillIntegration=function(){function t(t){this.paymillPublicToken=t}return t.prototype.submit=function(t){var e;return e=$.Deferred(),this._setupPaymill().then(function(r){return function(){return t.amount_int="100",t.currency="EUR",window.paymill.createToken(t,function(t,n){return t?(r.errorMessage=r._translate(t.apierror),e.reject()):(r.resultToken=n.token,r.resultType=n.brand,r.resultLast4=n.last4Digits,e.resolve())})}}(this)),e},t.prototype._setupPaymill=function(){return window.paymill?$.Deferred().resolve():(window.PAYMILL_PUBLIC_KEY=this.paymillPublicToken,$.getScript("https://bridge.paymill.com"))},t.prototype._translate=function(t){return{internal_server_error:"Verbindung zum Zahlungsdienstleister konnte nicht hergestellt werden.",invalid_public_key:"Verbindung zum Zahlungsdienstleister konnte nicht hergestellt werden.",invalid_payment_data:"Verbindung zum Zahlungsdienstleister konnte nicht hergestellt werden.",unknown_error:"Verbindung zum Zahlungsdienstleister konnte nicht hergestellt werden.","3ds_canceled":"Passworteingabe des 3DS-Verfahrens wurde abgebrochen.",field_invalid_card_number:"Die Kreditkartennummer ist ung\xfcltig.",field_invalid_card_exp_year:"Das Ablaufdatum ist ung\xfcltig.",field_invalid_card_exp_month:"Das Ablaufdatum ist ung\xfcltig.",field_invalid_card_exp:"Die Karte ist abgelaufen.",field_invalid_card_cvc:"Die Pr\xfcfnummer ist ung\xfcltig.",field_invalid_card_holder:"Die Angabe des Karteninhabers ist ung\xfcltig.",field_invalid_amount_int:"Verbindung zum Zahlungsdienstleister konnte nicht hergestellt werden.",field_invalid_currency:"Verbindung zum Zahlungsdienstleister konnte nicht hergestellt werden.",field_invalid_account_number:"Die Kontonummer ist ung\xfcltig.",field_invalid_account_holder:"Die Angabe des Konteninhabers ist ung\xfcltig.",field_invalid_bank_code:"Die Bankleitzahl ist ung\xfcltig."}[t]},t}()}.call(this),function(){Isaac10.Service=function(){function t(t){this.isaac10Instance=t}return t.prototype.withAuthorizeHeader=!1,t.prototype.withApiToken=!1,t.prototype.run=function(t,e){return this.withApiToken?this.isaac10Instance.withApiToken().then(function(r){return function(){return r.ajaxCall(t,e)}}(this)):this.ajaxCall(t,e)},t.prototype.headers=function(){switch(this.withAuthorizeHeader){case"customer":return this.isaac10Instance.authorizationHeaderForCustomer();case"merchant":return this.isaac10Instance.authorizationHeaderForMerchant();default:return null}},t}()}.call(this),function(){var t=function(t,r){function n(){this.constructor=t}for(var o in r)e.call(r,o)&&(t[o]=r[o]);return n.prototype=r.prototype,t.prototype=new n,t.__super__=r.prototype,t},e={}.hasOwnProperty;Isaac10.DeleteService=function(e){function r(){return r.__super__.constructor.apply(this,arguments)}return t(r,e),r.prototype.ajaxCall=function(t,e){return $.ajax({url:this.url(t),method:"DELETE",data:this.data(e),cache:!1,dataType:"json",headers:this.headers()})},r.prototype.data=function(t){return{}},r}(Isaac10.Service)}.call(this),function(){var t=function(t,r){function n(){this.constructor=t}for(var o in r)e.call(r,o)&&(t[o]=r[o]);return n.prototype=r.prototype,t.prototype=new n,t.__super__=r.prototype,t},e={}.hasOwnProperty;Isaac10.GetService=function(e){function r(){return r.__super__.constructor.apply(this,arguments)}return t(r,e),r.prototype.ajaxCall=function(t,e){return $.ajax({url:this.url(t),data:this.data(e),cache:!1,dataType:"json",headers:this.headers()})},r.prototype.data=function(t){return t},r}(Isaac10.Service)}.call(this),function(){var t=function(t,r){function n(){this.constructor=t}for(var o in r)e.call(r,o)&&(t[o]=r[o]);return n.prototype=r.prototype,t.prototype=new n,t.__super__=r.prototype,t},e={}.hasOwnProperty;Isaac10.PostService=function(e){function r(){return r.__super__.constructor.apply(this,arguments)}return t(r,e),r.prototype.ajaxCall=function(t,e){return $.ajax({type:"POST",url:this.url(t),contentType:"application/json; charset=utf-8",data:JSON.stringify(e),processData:!1,dataType:"json",headers:this.headers()})},r}(Isaac10.Service)}.call(this),function(){var t=function(t,r){function n(){this.constructor=t}for(var o in r)e.call(r,o)&&(t[o]=r[o]);return n.prototype=r.prototype,t.prototype=new n,t.__super__=r.prototype,t},e={}.hasOwnProperty;Isaac10.UpdateService=function(e){function r(){return r.__super__.constructor.apply(this,arguments)}return t(r,e),r.prototype.ajaxCall=function(t,e){return $.ajax({type:"PATCH",url:this.url(t),contentType:"application/json; charset=utf-8",data:JSON.stringify(e),processData:!1,dataType:"json",headers:this.headers()})},r}(Isaac10.Service)}.call(this),function(){var t=function(t,r){function n(){this.constructor=t}for(var o in r)e.call(r,o)&&(t[o]=r[o]);return n.prototype=r.prototype,t.prototype=new n,t.__super__=r.prototype,t},e={}.hasOwnProperty;Isaac10.Authenticate=function(e){function r(){return r.__super__.constructor.apply(this,arguments)}return t(r,e),r.prototype.withAuthorizeHeader=!1,r.prototype.withApiToken=!1,r.prototype.url=function(){return this.isaac10Instance.submitHost+"/api/v1/authenticate"},r}(Isaac10.PostService)}.call(this),function(){var t=function(t,r){function n(){this.constructor=t}for(var o in r)e.call(r,o)&&(t[o]=r[o]);return n.prototype=r.prototype,t.prototype=new n,t.__super__=r.prototype,t},e={}.hasOwnProperty;Isaac10.CancelSubscription=function(e){function r(){return r.__super__.constructor.apply(this,arguments)}return t(r,e),r.prototype.withAuthorizeHeader="customer",r.prototype.withApiToken=!1,r.prototype.url=function(t){return this.isaac10Instance.submitHost+"/api/v1/customer/"+this.isaac10Instance.customerNumber+("/subscriptions/"+t)},r}(Isaac10.DeleteService)}.call(this),function(){var t=function(t,r){function n(){this.constructor=t}for(var o in r)e.call(r,o)&&(t[o]=r[o]);return n.prototype=r.prototype,t.prototype=new n,t.__super__=r.prototype,t},e={}.hasOwnProperty;Isaac10.CheckCouponCode=function(e){function r(){return r.__super__.constructor.apply(this,arguments)}return t(r,e),r.prototype.withAuthorizeHeader=!1,r.prototype.withApiToken=!0,r.prototype.url=function(t){return this.isaac10Instance.submitHost+"/api/v1/coupons/"+t},r.prototype.data=function(t){return t},r}(Isaac10.GetService)}.call(this),function(){var t=function(t,r){function n(){this.constructor=t}for(var o in r)e.call(r,o)&&(t[o]=r[o]);return n.prototype=r.prototype,t.prototype=new n,t.__super__=r.prototype,t},e={}.hasOwnProperty;Isaac10.ClearBill=function(e){function r(){return r.__super__.constructor.apply(this,arguments)}return t(r,e),r.prototype.withAuthorizeHeader="merchant",r.prototype.withApiToken=!1,r.prototype.url=function(t){return this.isaac10Instance.submitHost+"/api/v1/clearance/"+t},r}(Isaac10.UpdateService)}.call(this),function(){var t=function(t,r){function n(){this.constructor=t}for(var o in r)e.call(r,o)&&(t[o]=r[o]);return n.prototype=r.prototype,t.prototype=new n,t.__super__=r.prototype,t},e={}.hasOwnProperty;Isaac10.CreateBillItem=function(e){function r(){return r.__super__.constructor.apply(this,arguments)}return t(r,e),r.prototype.withAuthorizeHeader="merchant",r.prototype.url=function(){return this.isaac10Instance.submitHost+"/api/v1/bill_items"},r}(Isaac10.PostService)}.call(this),function(){var t=function(t,r){function n(){this.constructor=t}for(var o in r)e.call(r,o)&&(t[o]=r[o]);return n.prototype=r.prototype,t.prototype=new n,t.__super__=r.prototype,t},e={}.hasOwnProperty;Isaac10.DownloadBill=function(e){function r(){return r.__super__.constructor.apply(this,arguments)}return t(r,e),r.prototype.run=function(t){return $.ajax({async:!1,url:t,cache:!1,dataType:"json",headers:this.isaac10Instance.authorizationHeaderForCustomer(),success:function(t){return window.open(t.url)}})},r}(Isaac10.GetService)}.call(this),function(){var t=function(t,r){function n(){this.constructor=t}for(var o in r)e.call(r,o)&&(t[o]=r[o]);return n.prototype=r.prototype,t.prototype=new n,t.__super__=r.prototype,t},e={}.hasOwnProperty;Isaac10.GetAccount=function(e){function r(){return r.__super__.constructor.apply(this,arguments)}return t(r,e),r.prototype.withAuthorizeHeader="customer",r.prototype.withApiToken=!1,r.prototype.url=function(){return this.isaac10Instance.submitHost+"/api/v1/customer/"+this.isaac10Instance.customerNumber+"/account"},r}(Isaac10.GetService)}.call(this),function(){var t=function(t,r){function n(){this.constructor=t}for(var o in r)e.call(r,o)&&(t[o]=r[o]);return n.prototype=r.prototype,t.prototype=new n,t.__super__=r.prototype,t},e={}.hasOwnProperty;Isaac10.GetBills=function(e){function r(){return r.__super__.constructor.apply(this,arguments)}return t(r,e),r.prototype.withAuthorizeHeader="customer",r.prototype.withApiToken=!1,r.prototype.url=function(){return this.isaac10Instance.submitHost+"/api/v1/customer/"+this.isaac10Instance.customerNumber+"/bills"},r}(Isaac10.GetService)}.call(this),function(){var t=function(t,r){function n(){this.constructor=t}for(var o in r)e.call(r,o)&&(t[o]=r[o]);return n.prototype=r.prototype,t.prototype=new n,t.__super__=r.prototype,t},e={}.hasOwnProperty;Isaac10.GetClearance=function(e){function r(){return r.__super__.constructor.apply(this,arguments)}return t(r,e),r.prototype.withAuthorizeHeader="merchant",r.prototype.withApiToken=!1,r.prototype.url=function(){return this.isaac10Instance.submitHost+"/api/v1/clearance"},r}(Isaac10.GetService)}.call(this),function(){Isaac10.GetCreditCardIFrame=function(){function t(t){this.isaac10Instance=t}return t.prototype.run=function(t,e){return'<iframe name="'+this.isaac10Instance.betterpayment.iframeDomId()+'"\nid="'+this.isaac10Instance.betterpayment.iframeDomId()+'"\nsrc="about:blank"\nwidth="'+t+'"\nheight="'+e+'" />'},t}()}.call(this),function(){var t=function(t,r){function n(){this.constructor=t}for(var o in r)e.call(r,o)&&(t[o]=r[o]);return n.prototype=r.prototype,t.prototype=new n,t.__super__=r.prototype,t},e={}.hasOwnProperty;Isaac10.GetCustomerCustomData=function(e){function r(){return r.__super__.constructor.apply(this,arguments)}return t(r,e),r.prototype.withAuthorizeHeader="merchant",r.prototype.withApiToken=!1,r.prototype.url=function(t){return this.isaac10Instance.submitHost+"/api/v1/customers/"+t+"/custom_data"},r}(Isaac10.GetService)}.call(this),function(){var t=function(t,r){function n(){this.constructor=t}for(var o in r)e.call(r,o)&&(t[o]=r[o]);return n.prototype=r.prototype,t.prototype=new n,t.__super__=r.prototype,t},e={}.hasOwnProperty;Isaac10.GetCustomers=function(e){function r(){return r.__super__.constructor.apply(this,arguments)}return t(r,e),r.prototype.withAuthorizeHeader="merchant",r.prototype.withApiToken=!1,r.prototype.url=function(){return this.isaac10Instance.submitHost+"/api/v1/customers"},r}(Isaac10.GetService)}.call(this),function(){var t=function(t,r){function n(){this.constructor=t}for(var o in r)e.call(r,o)&&(t[o]=r[o]);return n.prototype=r.prototype,t.prototype=new n,t.__super__=r.prototype,t},e={}.hasOwnProperty;Isaac10.GetEditSubscription=function(e){function r(){return r.__super__.constructor.apply(this,arguments)}return t(r,e),r.prototype.withAuthorizeHeader="customer",r.prototype.withApiToken=!1,r.prototype.url=function(t){return this.isaac10Instance.submitHost+"/api/v1/customer/"+this.isaac10Instance.customerNumber+("/subscriptions/"+t+"/edit")},r}(Isaac10.GetService)}.call(this),function(){var t=function(t,r){function n(){this.constructor=t}for(var o in r)e.call(r,o)&&(t[o]=r[o]);return n.prototype=r.prototype,t.prototype=new n,t.__super__=r.prototype,t},e={}.hasOwnProperty;Isaac10.GetPlan=function(e){function r(){return r.__super__.constructor.apply(this,arguments)}return t(r,e),r.prototype.withAuthorizeHeader=!1,r.prototype.withApiToken=!0,r.prototype.url=function(t){return this.isaac10Instance.submitHost+"/api/v1/register/"+t},r}(Isaac10.GetService)}.call(this),function(){var t=function(t,r){function n(){this.constructor=t}for(var o in r)e.call(r,o)&&(t[o]=r[o]);return n.prototype=r.prototype,t.prototype=new n,t.__super__=r.prototype,t},e={}.hasOwnProperty;Isaac10.GetProducts=function(e){function r(){return r.__super__.constructor.apply(this,arguments)}return t(r,e),r.prototype.withAuthorizeHeader=!1,r.prototype.withApiToken=!1,r.prototype.url=function(){return this.isaac10Instance.submitHost+"/api/v1/products"},r}(Isaac10.GetService)}.call(this),function(){var t=function(t,r){function n(){this.constructor=t}for(var o in r)e.call(r,o)&&(t[o]=r[o]);return n.prototype=r.prototype,t.prototype=new n,t.__super__=r.prototype,t},e={}.hasOwnProperty;Isaac10.GetSubscribe=function(e){function r(){return r.__super__.constructor.apply(this,arguments)}return t(r,e),r.prototype.withAuthorizeHeader="customer",r.prototype.withApiToken=!0,r.prototype.url=function(){return this.isaac10Instance.submitHost+"/api/v1/customer/"+this.isaac10Instance.customerNumber+"/subscriptions/new"},r.prototype.data=function(t){return{plan:t}},r}(Isaac10.GetService)}.call(this),function(){var t=function(t,r){function n(){this.constructor=t}for(var o in r)e.call(r,o)&&(t[o]=r[o]);return n.prototype=r.prototype,t.prototype=new n,t.__super__=r.prototype,t},e={}.hasOwnProperty;Isaac10.GetSubscriptions=function(e){function r(){return r.__super__.constructor.apply(this,arguments)}return t(r,e),r.prototype.withAuthorizeHeader="customer",r.prototype.withApiToken=!1,r.prototype.url=function(){return this.isaac10Instance.submitHost+"/api/v1/customer/"+this.isaac10Instance.customerNumber+"/subscriptions"},r}(Isaac10.GetService)}.call(this),function(){var t=function(t,r){function n(){this.constructor=t}for(var o in r)e.call(r,o)&&(t[o]=r[o]);return n.prototype=r.prototype,t.prototype=new n,t.__super__=r.prototype,t},e={}.hasOwnProperty;Isaac10.GetUpgradeDowngradeSubscription=function(e){function r(){return r.__super__.constructor.apply(this,arguments)}return t(r,e),r.prototype.withAuthorizeHeader="customer",r.prototype.withApiToken=!0,r.prototype.url=function(t){var e,r;return r=t[0],e=t[1],this.isaac10Instance.submitHost+"/api/v1/customer/"+this.isaac10Instance.customerNumber+("/subscriptions/"+r)+("/upgrade_downgrade/"+e)},r}(Isaac10.GetService)}.call(this),function(){Isaac10.InitializeCreditCardIFrame=function(){function t(t){this.isaac10Instance=t,this.betterpayment=this.isaac10Instance.betterpayment}return t.prototype.run=function(){return this.betterpayment.iframeResponse=!1,this.isaac10Instance.withApiToken().then(function(t){return function(){var e;return e=$("<form method='post'\nstyle='display:none;'\ntarget='"+t._domId()+"'\naction='"+t._url()+"' />"),e.append("<input type='hidden' name='api_key' value='"+t._apiKey()+"' />"),e.append("<input type='hidden' name='hide_submit' value='1' />"),$("body").append(e),e.submit()}}(this))},t.prototype._domId=function(){return this.isaac10Instance.betterpayment.iframeDomId()},t.prototype._url=function(){return this.isaac10Instance.betterpayment.buildInitializeIFrameUrl()},t.prototype._apiKey=function(){return this.isaac10Instance.apiToken.betterpayment_api_key},t}()}.call(this),function(){var t=function(t,r){function n(){this.constructor=t}for(var o in r)e.call(r,o)&&(t[o]=r[o]);return n.prototype=r.prototype,t.prototype=new n,t.__super__=r.prototype,t},e={}.hasOwnProperty;Isaac10.PostRegister=function(e){function r(){return r.__super__.constructor.apply(this,arguments)}return t(r,e),r.prototype.url=function(){return this.isaac10Instance.submitHost+"/api/v1/register"},r.prototype.ajaxCall=function(t,e){var n,o;return o=$.Deferred(),n=Isaac10.PaymentData["for"](e.register,this.isaac10Instance,!1),n.process().then(function(a){return function(){return n.processParams(e.register),r.__super__.ajaxCall.call(a,t,e).then(function(t){return o.resolve(t)},function(t){return o.reject(t)})}}(this),function(a){return function(){return n.processParams(e.register),r.__super__.ajaxCall.call(a,t,e).then(function(t){throw new Error("Internal Error: isaac10 returned success, but the external\npayment provider does not.")},function(t){var e,r;return r=t.responseJSON,n.processSuccess||(r.errors||(r.errors={}),(e=r.errors).paymentDataBase||(e.paymentDataBase=[]),r.errors.paymentDataBase.push(n.errorMessage)),o.reject(t)})}}(this)),o},r}(Isaac10.PostService)}.call(this),function(){var t=function(t,r){function n(){this.constructor=t}for(var o in r)e.call(r,o)&&(t[o]=r[o]);return n.prototype=r.prototype,t.prototype=new n,t.__super__=r.prototype,t},e={}.hasOwnProperty;Isaac10.PostSubscribe=function(e){function r(){return r.__super__.constructor.apply(this,arguments)}return t(r,e),r.prototype.withAuthorizeHeader="customer",r.prototype.withApiToken=!1,r.prototype.url=function(){return this.isaac10Instance.submitHost+"/api/v1/customer/"+this.isaac10Instance.customerNumber+"/subscriptions"},r.prototype.ajaxCall=function(t,e){var n,o;return o=$.Deferred(),n=Isaac10.PaymentData["for"](e.subscription,this.isaac10Instance,!1),n.process().then(function(a){return function(){return n.processParams(e.subscription),r.__super__.ajaxCall.call(a,t,e).then(function(t){return o.resolve(t)},function(t){return o.reject(t)})}}(this),function(a){return function(){return n.processParams(e.subscription),r.__super__.ajaxCall.call(a,t,e).then(function(t){throw"Internal Error: isaac10 returned success, but the external\npayment provider does not."},function(t){var e,r;return r=t.responseJSON,n.processSuccess||(r.errors||(r.errors={}),(e=r.errors).paymentDataBase||(e.paymentDataBase=[]),r.errors.paymentDataBase.push(n.errorMessage)),o.reject(t)})}}(this)),o},r}(Isaac10.PostService)}.call(this),function(){Isaac10.ProcessPaypal=function(){function t(t){this.isaac10Instance=t}return t.prototype.run=function(t,e){return this._createHiddenPaypalTrigger(),this.isaac10Instance.withApiToken().then(function(r){return function(){return window.paypalCheckoutReady=function(){return paypal.checkout.setup(r.isaac10Instance.apiToken.paypal_id,{environment:r.isaac10Instance.apiToken.paypal_environment,button:"hidden-paypal-trigger",locale:"de_DE",click:function(n){return n.preventDefault(),paypal.checkout.initXO(),$.support.cors=!0,r._callPaypal(paypal,t,e)}})},"undefined"!=typeof paypal&&null!==paypal?(window.paypalCheckoutReady(),r._triggerClick()):$.getScript("//www.paypalobjects.com/api/checkout.js").then(function(){return window.paypalCheckoutReady(),r._triggerClick()})}}(this))},t.prototype._callPaypal=function(t,e,r){return $.ajax({url:this._setExpressCheckoutUrl(e,r),type:"GET",async:!0,crossDomain:!0,headers:this.isaac10Instance.authorizationHeaderForCustomer(),success:function(e){return e.indexOf("paypal.com")>-1?t.checkout.startFlow(e):(window.location=e,t.checkout.closeFlow())},error:function(e,r,n){return console.log("Error in AJAX post: "+e.statusText),t.checkout.closeFlow()}})},t.prototype._setExpressCheckoutUrl=function(t,e){return this.isaac10Instance.buildUrlFor("/api/v1/paypal/set_express_checkout/"+this.isaac10Instance.customerNumber+"?success_url="+encodeURIComponent(t)+"&failure_url="+encodeURIComponent(e))},t.prototype._createHiddenPaypalTrigger=function(){var t;return $("body button#hidden-paypal-trigger").length?void 0:(t=$('<button id="hidden-paypal-trigger">'),t.hide(),$("body").append(t))},t.prototype._triggerClick=function(){return $("button#hidden-paypal-trigger").click()},t}()}.call(this),function(){Isaac10.SubmitCreditCardIFrame=function(){function t(t){this.isaac10Instance=t,this.betterpayment=this.isaac10Instance.betterpayment}return t.prototype.run=function(){return this.betterpayment.iframeResponse?this._return_cached_response():this._submit_to_betterpayment_and_return()},t.prototype._return_cached_response=function(){var t;return t=$.Deferred(),t.resolve(this.betterpayment.iframeResponse),t},t.prototype._submit_to_betterpayment_and_return=function(){return this.isaac10Instance.withApiToken().then(function(t){return function(){var e;return t._registerEventListener(),t.betterpayment.iframePromise=$.Deferred(),e=t.betterpayment.baseUrl(),document.getElementById(t.betterpayment.iframeDomId()).contentWindow.postMessage("submit",e),t.betterpayment.iframePromise}}(this))},t.prototype._registerEventListener=function(){var t;if(!this.betterpayment.iframeEventListenerRegistered)return t=function(t){return function(e){return e.origin===t.betterpayment.baseUrl()?(t.betterpayment.iframeResponse=e.data,t.betterpayment.iframePromise.resolve(e.data)):void 0}}(this),window.addEventListener("message",t,!1),this.betterpayment.iframeEventListenerRegistered=!0},t}()}.call(this),function(){var t=function(t,r){function n(){this.constructor=t}for(var o in r)e.call(r,o)&&(t[o]=r[o]);return n.prototype=r.prototype,t.prototype=new n,t.__super__=r.prototype,t},e={}.hasOwnProperty;Isaac10.ThankYouAfterAdd=function(e){function r(){return r.__super__.constructor.apply(this,arguments)}return t(r,e),r.prototype.withAuthorizeHeader="customer",r.prototype.withApiToken=!1,r.prototype.url=function(t){return this.isaac10Instance.submitHost+"/api/v1/"+("customer/"+this.isaac10Instance.customerNumber+"/")+("thank_you/"+t+"/add")},r}(Isaac10.GetService)}.call(this),function(){var t=function(t,r){function n(){this.constructor=t}for(var o in r)e.call(r,o)&&(t[o]=r[o]);return n.prototype=r.prototype,t.prototype=new n,t.__super__=r.prototype,t},e={}.hasOwnProperty;Isaac10.ThankYouAfterRegister=function(e){function r(){return r.__super__.constructor.apply(this,arguments)}return t(r,e),r.prototype.withAuthorizeHeader="customer",r.prototype.withApiToken=!1,r.prototype.url=function(t){return this.isaac10Instance.submitHost+"/api/v1/"+("customer/"+this.isaac10Instance.customerNumber+"/")+("thank_you/"+t+"/register")},r}(Isaac10.GetService)}.call(this),function(){var t=function(t,r){function n(){this.constructor=t}for(var o in r)e.call(r,o)&&(t[o]=r[o]);return n.prototype=r.prototype,t.prototype=new n,t.__super__=r.prototype,t},e={}.hasOwnProperty;Isaac10.ThankYouAfterUpgradeDowngrade=function(e){function r(){return r.__super__.constructor.apply(this,arguments)}return t(r,e),r.prototype.withAuthorizeHeader="customer",r.prototype.withApiToken=!1,r.prototype.url=function(t){return this.isaac10Instance.submitHost+"/api/v1/"+("customer/"+this.isaac10Instance.customerNumber+"/")+("thank_you/"+t+"/upgrade_downgrade")},r}(Isaac10.GetService)}.call(this),function(){var t=function(t,r){function n(){this.constructor=t}for(var o in r)e.call(r,o)&&(t[o]=r[o]);return n.prototype=r.prototype,t.prototype=new n,t.__super__=r.prototype,t},e={}.hasOwnProperty;Isaac10.UncancelSubscription=function(e){function r(){return r.__super__.constructor.apply(this,arguments)}return t(r,e),r.prototype.withAuthorizeHeader="customer",r.prototype.withApiToken=!1,r.prototype.url=function(t){return this.isaac10Instance.submitHost+"/api/v1/customer/"+this.isaac10Instance.customerNumber+("/subscriptions/"+t+"/revert")},r}(Isaac10.DeleteService)}.call(this),function(){var t=function(t,r){function n(){this.constructor=t}for(var o in r)e.call(r,o)&&(t[o]=r[o]);return n.prototype=r.prototype,t.prototype=new n,t.__super__=r.prototype,t},e={}.hasOwnProperty;Isaac10.UpdateAccountData=function(e){function r(){return r.__super__.constructor.apply(this,arguments)}return t(r,e),r.prototype.withAuthorizeHeader="customer",r.prototype.url=function(){return this.isaac10Instance.submitHost+"/api/v1/customer/"+this.isaac10Instance.customerNumber+"/account/account_data"},r}(Isaac10.UpdateService)}.call(this),function(){var t=function(t,r){function n(){this.constructor=t}for(var o in r)e.call(r,o)&&(t[o]=r[o]);return n.prototype=r.prototype,t.prototype=new n,t.__super__=r.prototype,t},e={}.hasOwnProperty;Isaac10.UpdateBillingData=function(e){function r(){return r.__super__.constructor.apply(this,arguments)}return t(r,e),r.prototype.withAuthorizeHeader="customer",r.prototype.url=function(){return this.isaac10Instance.submitHost+"/api/v1/customer/"+this.isaac10Instance.customerNumber+"/account/billing_data";
},r}(Isaac10.UpdateService)}.call(this),function(){var t=function(t,r){function n(){this.constructor=t}for(var o in r)e.call(r,o)&&(t[o]=r[o]);return n.prototype=r.prototype,t.prototype=new n,t.__super__=r.prototype,t},e={}.hasOwnProperty;Isaac10.UpdateCustomerCustomData=function(e){function r(){return r.__super__.constructor.apply(this,arguments)}return t(r,e),r.prototype.withAuthorizeHeader="merchant",r.prototype.withApiToken=!1,r.prototype.url=function(t){return this.isaac10Instance.submitHost+"/api/v1/customers/"+t+"/custom_data"},r}(Isaac10.UpdateService)}.call(this),function(){var t=function(t,r){function n(){this.constructor=t}for(var o in r)e.call(r,o)&&(t[o]=r[o]);return n.prototype=r.prototype,t.prototype=new n,t.__super__=r.prototype,t},e={}.hasOwnProperty;Isaac10.UpdatePassword=function(e){function r(){return r.__super__.constructor.apply(this,arguments)}return t(r,e),r.prototype.withAuthorizeHeader="customer",r.prototype.url=function(){return this.isaac10Instance.submitHost+"/api/v1/customer/"+this.isaac10Instance.customerNumber+"/account/password"},r}(Isaac10.UpdateService)}.call(this),function(){var t=function(t,r){function n(){this.constructor=t}for(var o in r)e.call(r,o)&&(t[o]=r[o]);return n.prototype=r.prototype,t.prototype=new n,t.__super__=r.prototype,t},e={}.hasOwnProperty;Isaac10.UpdatePaymentData=function(e){function r(){return r.__super__.constructor.apply(this,arguments)}return t(r,e),r.prototype.withAuthorizeHeader="customer",r.prototype.url=function(){return this.isaac10Instance.submitHost+"/api/v1/customer/"+this.isaac10Instance.customerNumber+"/account/payment_data"},r.prototype.ajaxCall=function(t,e){var n,o;return o=$.Deferred(),n=Isaac10.PaymentData["for"](e.payment_data,this.isaac10Instance,!1),n.process().then(function(a){return function(){return n.processParams(e.payment_data),r.__super__.ajaxCall.call(a,t,e).then(function(t){return o.resolve(t)},function(t){return o.reject(t)})}}(this),function(a){return function(){return n.processParams(e.payment_data),r.__super__.ajaxCall.call(a,t,e).then(function(t){throw"Internal Error: isaac10 returned success, but the external\npayment provider does not."},function(t){var e,r;return r=t.responseJSON,n.processSuccess||(r.errors||(r.errors={}),(e=r.errors).paymentDataBase||(e.paymentDataBase=[]),r.errors.paymentDataBase.push(n.errorMessage)),o.reject(t)})}}(this)),o},r}(Isaac10.UpdateService)}.call(this),function(){var t=function(t,r){function n(){this.constructor=t}for(var o in r)e.call(r,o)&&(t[o]=r[o]);return n.prototype=r.prototype,t.prototype=new n,t.__super__=r.prototype,t},e={}.hasOwnProperty;Isaac10.UpdateSubscription=function(e){function r(){return r.__super__.constructor.apply(this,arguments)}return t(r,e),r.prototype.withAuthorizeHeader="customer",r.prototype.url=function(t){return this.isaac10Instance.submitHost+"/api/v1/customer/"+this.isaac10Instance.customerNumber+("/subscriptions/"+t)},r}(Isaac10.UpdateService)}.call(this),function(){var t=function(t,r){function n(){this.constructor=t}for(var o in r)e.call(r,o)&&(t[o]=r[o]);return n.prototype=r.prototype,t.prototype=new n,t.__super__=r.prototype,t},e={}.hasOwnProperty;Isaac10.UpgradeDowngradeSubscription=function(e){function r(){return r.__super__.constructor.apply(this,arguments)}return t(r,e),r.prototype.withAuthorizeHeader="customer",r.prototype.withApiToken=!1,r.prototype.url=function(t){return this.isaac10Instance.submitHost+"/api/v1/customer/"+this.isaac10Instance.customerNumber+("/subscriptions/"+t+"/upgrade_downgrade")},r.prototype.ajaxCall=function(t,e){var n,o;return o=$.Deferred(),n=Isaac10.PaymentData["for"](e.subscription,this.isaac10Instance,!1),n.process().then(function(a){return function(){return n.processParams(e.subscription),r.__super__.ajaxCall.call(a,t,e).then(function(t){return o.resolve(t)},function(t){return o.reject(t)})}}(this),function(a){return function(){return n.processParams(e.subscription),r.__super__.ajaxCall.call(a,t,e).then(function(t){throw"Internal Error: isaac10 returned success, but the external\npayment provider does not."},function(t){var e,r;return r=t.responseJSON,n.processSuccess||(r.errors||(r.errors={}),(e=r.errors).paymentDataBase||(e.paymentDataBase=[]),r.errors.paymentDataBase.push(n.errorMessage)),o.reject(t)})}}(this)),o},r}(Isaac10.PostService)}.call(this);
