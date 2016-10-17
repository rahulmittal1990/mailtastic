/*global define*/
angular.module('mailtasticApp.services').service('userService', [
    '$rootScope',
    'requestService',
    // 'imageService',
    // 'userService',
    // 'apiService',
    function ($rootScope, requestService) {
        // Get all campaigns for a user

        // login
        this.login = function (params) {
            return requestService.send({
                method: 'post',
                url: '/account/authenticate/login',
                data: params,
                authorization: false
            });
        };

        this.getHtmlSnippet = function (id) {
            return requestService.send({
                method: 'post',
                url: '/employees/snippet',
                authorization: true,
                success: function (ret, promise) {
                    promise.resolve(ret);
                }
            });

        };
        
        this.getOverallStats = function(){
             return requestService.send({
                method: 'get',
                url: '/users/stats/overall',
                authorization: true,
                success: function (ret, promise) {
                    promise.resolve(ret);
                }
            });
        };
        
        /**
         * Nutzt auch die overall stats und extrahiert die anzahl an mitarbeitern
         * @returns {unresolved}
         */
        this.getAmountOfUsers = function(){
            return requestService.send({
                method: 'get',
                url: '/users/stats/overall',
                authorization: true,
                success: function (ret, promise) {
                    if(ret.success===true && ret.data[0] && ret.data[0].amountOfUsers){
                        promise.resolve(ret.data[0].amountOfUsers);   
                    }else{
                        promise.resolve(null);
                    }
                    
                }
            });
            
        };
        
        this.checkToken = function(params){
             return requestService.send({
                method: 'post',
                url: '/account/authenticate/checktoken',
                authorization: false,
                data: params,
                success: function (ret, promise) {
                    promise.resolve(ret);
                }
            });
            
            
        };
        //method used in beta phase
           this.createBetaUser = function(userobject){
            return requestService.send({
                method: 'post',
                url: '/users/createuser/beta',
                data: userobject,
                authorization: true
            });
            
        };
        
        //activate new admin account
        this.activateAccount = function (params) {
            return requestService.send({
                method: 'post',
                url: '/account/activate/admin',
                data: params,
                authorization: false,
            });
        };
        
        //regular registration process
        this.createNewUser = function(userobject){
            return requestService.send({
                method: 'post',
                url: '/account/createuser',
                data: userobject,
                authorization: false
            });
            
        };
        
        
        //editing own account data
        this.getAccountData = function(){
            return requestService.send({
                method: 'get',
                url: '/users/accountdata',
                authorization: true
            });
            
        };
        
        
          //editing own account data
        this.setAccountData = function(data){
            return requestService.send({
                method: 'post',
                url: '/users/accountdata',
                data:data,
                authorization: true
            });
            
        };
        
           //editing own account data
        this.setCompanyInfo = function(data){
            return requestService.send({
                method: 'post',
                url: '/users/companyinfo',
                data:data,
                authorization: true,
                  success: function (ret, promise) {
                    if(ret.success === true){
                        //tell intercom that employee data was changed
                        Intercom('trackEvent', 'Changed company info data');
                    }
                    promise.resolve(ret);
                }
            });
            
        };
        
               //passwort lost
        this.resetPassword = function(email){
            return requestService.send({
                method: 'post',
                url: '/account/resetpassword',
                data:{
                    email : email
                },
                authorization: false
            });
            
        };
        
        
                 //passwort lost
        this.setNewPassword = function(data){
            return requestService.send({
                method: 'post',
                url: '/account/setnewpass',
                data:data,
                authorization: false
            });
            
        };
        
        /**
         * adds issaac10 user credentials to mailtastic database
         * @param {type} data
         * @returns {unresolved}
         */
        this.addPaymentCredentials = function(data){
            return requestService.send({
                method: 'post',
                url: '/users/paymentcreds',
                data:data,
                authorization: true
            });
            
        };
        
         /**
         * Set Data which is used for signature
         * @param {type} userId
         * @returns {unresolved}
         */
         this.setCompanyInfoSingle = function(userId, tag,type, value){
            return requestService.send({
                method: 'post',
                url: '/employees/companyinfo/single',
                 data: {
                    userid : userId,
                    tag : tag,
                    type : type,
                    value : value
                },
                authorization: true,
                 success: function (ret, promise) {
                    if(ret.success === true){
                        //tell intercom that employee data was changed
                        Intercom('trackEvent', 'Changed company info data');
                    }
                    promise.resolve(ret);
                }
                
            });
            
        };
         this.verifyPassword = function (password)
         {
             return requestService.send({
                 method: 'get',
                 url: '/users/verifyPwd/' + password,
                 authorization: true,
                 success: function (campaigns, promise) {
                     promise.resolve(campaigns);
                 }
             });
         }
        
        
        //mark initial introduction tour as seen
        this.setTourWasSeen = function(){
            return requestService.send({
                method: 'post',
                url: '/users/marktourasseen',
                authorization: true
            });

         };
            
       
       }

    

]);
