/*global define*/
'use strict';

angular.module('mailtasticApp.services').service('intercomService', [
    'StorageFactory',
    '$window',
    function ( StorageFactory,  $window) {
        var serviceObject = this;       //to call methods from inner methods
 
 
        this.userLoggedIntoAppCues = function(){
            var firstname = StorageFactory.get('userFirstName');
            var lastname = StorageFactory.get('userLastName');
            var email = StorageFactory.get('userEmail');
            var createdAt = StorageFactory.get('userCreatedAt');
            var userId = StorageFactory.get('userId');
         
           
            if(!firstname || !lastname || !email || !createdAt){
                return;
            }
            
            //if not email it is not possible to log into intercom
            if(!email){
                return;
            }
            
            //if firstname and lastname is missing then use email as name
            var name = "";
            if(!firstname && !lastname){
                name = email;
            }else{
                name = firstname + " " +lastname
            }
            
            //if createdAt is missing then use new timestamp
            var time = "";
            if(!createdAt){
                time = moment().format("X");
                
            }else{
                time = moment(createdAt).format("X");
            }
            
            //create unix timestamp
            createdAt = moment(createdAt).format("X");
            if(Appcues){
                 return Appcues.identify(userId, { // Unique identifier for current user
                    name: name, // Current user's name
                    email: email, // Current user's email
                    created_at: time, // Unix timestamp of user signup date

                });
            }
            
        };
 
         /**
         * Send information about the logged in user
         * @param {type} id
         * @returns {unresolved}
         */
        this.userLoggedIn = function () {
            var firstname = StorageFactory.get('userFirstName');
            var lastname = StorageFactory.get('userLastName');
            var email = StorageFactory.get('userEmail');
            var createdAt = StorageFactory.get('userCreatedAt');
            var userId = StorageFactory.get('userId');
            
         
           
            if(!firstname || !lastname || !email || !createdAt){
                return;
            }
            
            //if not email it is not possible to log into intercom
            if(!email){
                return;
            }
            
            //if firstname and lastname is missing then use email as name
            var name = "";
            if(!firstname && !lastname){
                name = email;
            }else{
                name = firstname + " " +lastname
            }
            
            //if createdAt is missing then use new timestamp
            var time = "";
            if(!createdAt){
                time = moment().format("X");
                
            }else{
                time = moment(createdAt).format("X");
            }
            
            //create unix timestamp
            createdAt = moment(createdAt).format("X");
            return $window.Intercom("boot", {
                app_id: 'l9hkw9ed',
                user_id: userId,
                name:  name, // Full name
                email: email, // Email address
                created_at: time // Signup date as a Unix timestamp
            });
            
            
        };
        
        
        /**
         * Shutdown intercom
         * @param {type} data
         * @returns {undefined}
         */
        this.shutDown = function () {
            $window.Intercom("shutdown");
        };
        
        
        /**
         * Update when e new view is shown
         * @param {type} data
         * @returns {undefined}
         */
        this.update = function () {
            $window.Intercom("update");
        };
        
        
        
         /**
         * Tell intercom that an employee is added
         * @param {type} data
         * @returns {undefined}
         */
        this.employeeAdded = function(){
            Intercom('trackEvent', 'Employee added');
        };
        
        this.employeeAddedMany = function(){
            Intercom('trackEvent', 'Employee added many');
        };
        
         /**
         * Tell intercom that an employee is removed
         * @param {type} data
         * @returns {undefined}
         */
        this.employeeRemoved = function(){
            Intercom('trackEvent', 'Employee removed');
        };
         this.employeeRemovedMany = function(){
            Intercom('trackEvent', 'Employee(s) removed');
        };
        
        
        
        this.signatureCreated = function(){
             Intercom('trackEvent', 'Signature created');
            
        };
        
        
         this.signatureRolledOut = function(){
             Intercom('trackEvent', 'Signature rolled out');
            
        };
        
        
         this.bookedMailtasticStarter = function(){
             Intercom('trackEvent', 'Booked Mailtastic Starter');
            
        };
        
        /**
         * Tell intercom that a campaign is created
         * @param {type} data
         * @returns {undefined}
         */
        this.campaignCreated = function(){
            Intercom('trackEvent', 'Campaign created');
        };
        
         /**
         * Tell intercom that a campaign is created
         * @param {type} data
         * @returns {undefined}
         */
        this.groupCreated = function(){
            Intercom('trackEvent', 'Group created');
        };

    }
]);
