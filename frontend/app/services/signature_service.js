/*global define*/
/**
 * 
 * @param {type} param1
 * @param {type} param2Service for sending signature requests like CRUD Operation to backend
 */
angular.module('mailtasticApp.services').service('signatureService', [
//    '$rootScope',
    'requestService',
    'intercomService',
    // 'imageService',
    // 'userService',
    // 'apiService',
    function (requestService,intercomService) {
        // Get all campaigns for a user

        this.getAll = function () {
            return requestService.send({
                method: 'get',
                url: '/signatures',
                authorization: true,
                success: function (signatures, promise) {
                    promise.resolve(signatures);
                }
            });

        };


        this.getOne = function (id) {
            return requestService.send({
                method: 'get',
                url: '/signatures/single/' + id,
                authorization: true,
                success: function (signature, promise) {
                    promise.resolve(signature);

                }
            });

        };

        this.update = function (signature) {
            return requestService.send({
                method: 'put',
                url: '/signatures',
                data: signature,
                authorization: true,
                success: function (signature, promise) {
                    if(signature.success === true){
                            //tell intercom that signature was set
                              Intercom('trackEvent', 'Signature modified');
                           
                        }
                    
                    
                    promise.resolve(signature);

                }
            });

        };


        /**
         * create new Signature
         * @param {type} signature
         * @returns {unresolved}
         */
        this.create = function (signature) {
            return requestService.send({
                method: 'post',
                url: '/signatures',
                data: signature,
                authorization: true,
                success: function (ret, promise) {
                    
                    
                    promise.resolve(ret);
                    
                     if(ret.success === true){
                        //tell intercom that group was created
                        intercomService.signatureCreated();
                    }
                }
            });

        };
        
      
        /**
         * Delete list of Signatures. Can also be only 1 signature in list
         * @param {type} ids
         * @returns {unresolved}
         */
        this.delete = function (ids) {
            return requestService.send({
                method: 'post',
                url: '/signatures/delete',
                data: {
                    sigIds : ids
                },
                authorization: true
            });
        };
        
        
        /**
         * Get all groups in which the Signature is active
         * @param {type} id
         * @returns {unresolved}
         */
        this.getGroupsUsedIn = function (id) {
            return requestService.send({
                method: 'get',
                url: '/signatures/usedin/groups',
                authorization: true,
                success: function (signature, promise) {
                    promise.resolve(signature);

                }
            });

        };
        
        
        /**
         * Send invitation with integration manual to Employee
         * @param {type} id
         * @returns {unresolved}
         */
        this.rolloutEmployee = function (empId) {
            return requestService.send({
                method: 'post',
                url: '/signatures/rollout/employee',
                authorization: true,
                data: {
                    empId : empId
                },
                success: function (signature, promise) {
                    
                    
                    promise.resolve(signature);
                    
                      if(signature.success === true){
                        //tell intercom that group was created
                        intercomService.signatureRolledOut();
                    }
                }
            });

        };
        
        
         /**
         * Roll out Signature to all groups to which it is assigned to
         * @param {type} id
         * @returns {unresolved}
         */
        this.rolloutSignature = function (sigId) {
            return requestService.send({
                method: 'post',
                url: '/signatures/rollout/signature',
                authorization: true,
                data: {
                    sigId : sigId
                },
                success: function (signature, promise) {
                    
                   
                    
                    promise.resolve(signature);
                      if(signature.success === true){
                        //tell intercom that group was created
                        intercomService.signatureRolledOut();
                    }
                }
            });

        };
        
          /**
         * Rollout Mailtastic to group
         * @param {type} id
         * @returns {unresolved}
         */
        this.rolloutGroup= function (groupId) {
            return requestService.send({
                method: 'post',
                url: '/signatures/rollout/group',
                authorization: true,
                data: {
                    groupId : groupId
                },
                success: function (signature, promise) {
                     
                    
                    promise.resolve(signature);
                    
                     if(signature.success === true){
                        //tell intercom that group was created
                        intercomService.signatureRolledOut();
                    }
                }
            });

        };
        
        
          /**
         * Get json fields structure from backend (structure for signature designer ... employee and company fields etc)
         * @param {type} id
         * @returns {unresolved}
         */
        this.getJsonInfoFields= function () {
            return requestService.send({
                method: 'get',
                url: '/signatures/infoFieldStructure',
                authorization: true,
                success: function (signature, promise) {
                    promise.resolve(signature);
                }
            });

        };
     
    }
]);
