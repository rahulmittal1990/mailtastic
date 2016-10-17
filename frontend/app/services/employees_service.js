/*global define*/
angular.module('mailtasticApp.services').service('employeeService', [
    '$rootScope',
    'requestService',
    'intercomService',
    'googlesyncservice',
    // 'imageService',
    // 'userService',
    // 'apiService',
    function ($rootScope, requestService, intercomService, googlesyncservice) {
        // Get all campaigns for a user

        this.get = function () {
            return requestService.send({
                method: 'get',
                url: '/employees',
                authorization: true,
                success: function (campaigns, promise) {
                  
                    promise.resolve(campaigns);

                }
            });

        };
        
         this.getGoogleSyncUsersID = function (adminID,syncAdminEmail) {

            return requestService.send({
                method: 'get',
                url: '/employees/getGoogleSyncUsersID/' + adminID + '/' + syncAdminEmail,
                authorization: true,
                success: function (campaigns, promise) {
                    promise.resolve(campaigns);

                }
            });

        }



        this.getOne = function (id) {
            return requestService.send({
                method: 'get',
                url: '/employees/' + id,
                authorization: true,
                success: function (campaigns, promise) {
                    promise.resolve(campaigns);

                }
            });

        };

        this.update = function (employee) {
            return requestService.send({
                method: 'put',
                url: '/employees',
                data: employee,
                authorization: true,
                success: function (campaigns, promise) {
                    promise.resolve(campaigns);

                }
            });

        };

        this.updateSyncUsersType = function (ids,isAutoSync) {
            return requestService.send({
                method: 'put',
                url: '/employees/modify/syncType',
                data: {
                    employees: ids,
                    isAutoSync: isAutoSync
                },
                authorization: true,
                success: function (campaigns, promise) {
                    promise.resolve(campaigns);

                }
            });

        };


        this.updateSyncActivation = function (ids, isSyncActivated) {
            return requestService.send({
                method: 'put',
                url: '/employees/modify/syncActivate',
                data: {
                    employees: ids,
                    isSyncActivated: isSyncActivated
                },
                authorization: true,
                success: function (campaigns, promise) {
                    promise.resolve(campaigns);

                }
            });

        };



        this.add = function (employee) {
            return requestService.send({
                method: 'post',
                url: '/employees',
                data: employee,
                authorization: true,
                success: function (ret, promise) {
                    if(ret.success === true){
                        //tell intercom that employee was added
                        intercomService.employeeAdded();
                    }
                    
                    promise.resolve(ret);
                }
            });

        };
        
        this.addMany = function (data, group) {
            return requestService.send({
                method: 'post',
                url: '/employees/many',
                data: {
                 empsasjson : data ,
                 group : group
                },
                authorization: true,
                success: function (ret, promise) {
                    if(ret.success === true){
                        //tell intercom that employee was added
                        intercomService.employeeAddedMany();
                    }
                    promise.resolve(ret);
                }
            });

        };
        
        
        /**
         * Create one user for each versa commerce email template
         * @param {type} data
         * @param {type} group
         * @returns {unresolved}
         */
        this.addVersaCommerceUsers = function () {
            return requestService.send({
                method: 'post',
                url: '/employees/versacommerce/createmailtplusers',
                authorization: true,
                success: function (ret, promise) {
                    if(ret.success === true){
                        //tell intercom that employee was added
                           Intercom('trackEvent', 'Versa commerce users created');
                           promise.resolve(ret);
                    }else{
                        promise.reject(ret.code);
                    }
                    
                    
                   
                }
            });

        };
        
        
         /**
         * Add users which will be synced with gmail apps wor work
         * @param {type} data
         * @param {type} group
         * @returns {unresolved}
         */
        this.setUserManagedByGoogle = function (userObject) {
            return requestService.send({
                method: 'post',
                url: '/employees/managedByGoogle',
                data: {
                    employeeObject: userObject,
                },
                authorization: true,
                success: function (ret, promise) {
                    if(ret.success === true){
                          promise.resolve(ret);
                    }else{
                          promise.reject(ret);
                    }
                  
                }
            });

        };
        


        /**
         * Add users which will be synced with gmail apps wor work
         * @param {type} data
         * @param {type} group
         * @returns {unresolved}
         */
        this.addGoogleSyncedUsers = function (data, group) {
            return requestService.send({
                method: 'post',
                url: '/employees/manySyncUsers',
                data: {
                    empsasjson: data,
                    group: group
                },
                authorization: true,
                success: function (ret, promise) {
                    promise.resolve(ret);
                }
            });

        };

        this.delete = function (id) {
            return requestService.send({
                method: 'delete',
                url: '/employees/' + id,
                authorization: true,
                success: function (ret, promise) {
                     if(ret.success === true){
                        //tell intercom that employee was added
                        intercomService.employeeRemoved();
                    }
                    
                    promise.resolve(ret);
                }
            });

        };
        
      

        //moves all given employees to group
        this.moveToGroup = function (ids, groupId) {
            return requestService.send({
                method: 'put',
                url: '/employees/modify/group',
                data: {
                    employees: ids,
                    groupId: groupId
                },
                authorization: true,
                success: function (ret, promise) {
                    
                     if(ret.success === true){
                        //tell intercom that group was created
                        if(ids.length > 1){
                             Intercom('trackEvent', 'Many Employees moved to other group');
                        }
                        
                         if(ids.length === 1){
                             Intercom('trackEvent', 'One Employee moved to other group');
                        }
                        
                         //update google users
                         var groupIds = [];
                         groupIds.push(groupId);
                         googlesyncservice.updateGoogleSignatureForGroups(groupIds);
                        
                    }
                    
                    promise.resolve(ret);
                }
            });

        };


        //moves all given employees to group
        this.moveToDefaultGroup = function (ids, groupId) {
            return requestService.send({
                method: 'put',
                url: '/employees/modify/defaultGroup',
                data: {
                    employees: ids,
                    groupId: groupId
                },
                authorization: true,
                success: function (ret, promise) {
                    promise.resolve(ret);
                    
                     //update google users
                    var groupIds = [];
                    groupIds.push(groupId);
                    googlesyncservice.updateGoogleSignatureForGroups(groupIds);
                }
            });

        };



//        this.moveTonewGroup = function (ids, groupId) {
//            return requestService.send({
//                method: 'put',
//                url: '/employees/modify/newGroup',
//                data: {
//                    employees: ids,
//                    groupId: groupId
//                },
//                authorization: true,
//                success: function (ret, promise) {
//                    promise.resolve(ret);
//                    
//                    
//                       //update google users
//                    var groupIds = [];
//                    groupIds.push(groupId);
//                    googlesyncservice.updateGoogleSignatureForGroups(groupIds);
//                }
//            });
//
//        };


        this.activateEmployee = function (params) {
            return requestService.send({
                method: 'post',
                url: '/account/activate/employee',
                data: params,
                authorization: false,
            });
        };

        this.deleteMany = function (ids) {
            return requestService.send({
                method: 'post',
                url: '/employees/del/many',
                data: {
                    empids : ids
                },
                authorization: true,
                success: function (ret, promise) {
                    if(ret.success === true){
                        //tell intercom that employee was added
                        intercomService.employeeRemovedMany();
                    }
                    promise.resolve(ret);
                }
                
                
            });
        };
        
        
         this.sendFeedback = function (text) {
            return requestService.send({
                method: 'post',
                url: '/employees/feedback/webapp',
                data: {
                    text : text
                },
                authorization: true
            });
        };
        
        
        
        this.sendInvitations = function(userIds){
            return requestService.send({
                method: 'post',
                url: '/employees/invitation/send',
                data: {
                    userIds : userIds
                },
                authorization: true
            });
            
        };
        
        this.resendInvitation = function(userId){
            return requestService.send({
                method: 'post',
                url: '/employees/invitation/resend',
                data: {
                    userIds : userId
                },
                authorization: true,
                
                 success: function (ret, promise) {
                    if(ret.success === true){
                        //tell intercom that employee data was changed
                        Intercom('trackEvent', 'Resent invitation');
                    }
                    promise.resolve(ret);
                }
            });
            
        };
        
         this.sendInvitationTestmail = function(userId){
            return requestService.send({
                method: 'post',
                url: '/employees/invitation/sendinvitationtestmail',
                authorization: true,
                
                 success: function (ret, promise) {
                    if(ret.success === true){
                        //tell intercom that employee data was changed
                        Intercom('trackEvent', 'Invitation testmail sent to admin');
                    }
                    promise.resolve(ret);
                }
            });
            
        };
        
        /**
         * Set Data which is used for signature
         * @param {type} userId
         * @returns {unresolved}
         */
         this.setEmployeeInfo = function(userId, data){
            return requestService.send({
                method: 'post',
                url: '/employees/userinfo',
                 data: {
                    userid : userId,
                    data : data
                },
                authorization: true,
                success: function (ret, promise) {
                    if(ret.success === true){
                        //tell intercom that employee data was changed
                        Intercom('trackEvent', 'Changed user info data');
                    }
                    promise.resolve(ret);
                }
            });
            
        };
        
        /**
         * Set Data which is used for signature
         * @param {type} userId
         * @returns {unresolved}
         */
         this.setEmployeeInfoSingle = function(userId, tag,type, value){
            return requestService.send({
                method: 'post',
                url: '/employees/userinfo/single',
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
                        Intercom('trackEvent', 'Changed user info data');
                    }
                    promise.resolve(ret);
                }
            });
            
        };
        
        
        
        this.sendothermailclientnotification = function(userId, client){
            return requestService.send({
                method: 'post',
                url: '/employees/mailclients/other',
                data: {
                    userId : userId,
                    client : client
                },
                authorization: true
            });
            
        };
        
        
        
        /**
         * Check empid and activation code 
         * return all necesarry data to show integration page
         * @param {type} empId
         * @param {type} activationCode
         * @returns {undefined}
         */
        this.getIntegrationData = function(empId, activationCode){
            
            return requestService.send({
                method: 'get',
                url: '/account/employee/integrationdata/' +empId + '/' + activationCode ,
                authorization: false
            });
            
        };
        
        
        
         /**
         * Check empid and activation code 
         * return all necesarry data to show integration page
         * @param {type} empId
         * @param {type} activationCode
         * @returns {undefined}
         */
        this.complementUserInfoData = function(empId, activationCode, data){
            
            return requestService.send({
                method: 'post',
                url: '/account/employee/complementdata/' +empId + '/' + activationCode ,
                data: {
                    fields : data
                },
                authorization: true,
               
            });
            
        };

        this.updateuserSync = function (ids) {
            return requestService.send({
                method: 'post',
                url: '/employees/updateuserSync',
                data: {
                    empids: ids
                },
                authorization: true,
            });
        };



        
        
     
    }
]);
