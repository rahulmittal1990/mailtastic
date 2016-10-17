/*global define*/
angular.module('mailtasticApp.services').service('groupsService', [
    '$rootScope',
    'requestService',
    'intercomService',
    'googlesyncservice',
    // 'imageService',
    // 'userService',
    // 'apiService',
    function ($rootScope, requestService,intercomService, googlesyncservice) {
        // Get all campaigns for a user

        this.get = function () {
            return requestService.send({
                method: 'get',
                url: '/groups',
                authorization: true,
                success: function (campaigns, promise) {
                    promise.resolve(campaigns);

                }
            });

        };

        this.getOne = function (id) {
            return requestService.send({
                method: 'get',
                url: '/groups/' + id,
                authorization: true,
                success: function (campaigns, promise) {
                    promise.resolve(campaigns);

                }
            });

        };
        
        
        this.search = function (query) {
            return requestService.send({
                method: 'get',
                url: '/groups/search/withq?search=' + query,
                authorization: true,
                success: function (campaigns, promise) {
                    promise.resolve(campaigns);

                }
            });

        };

           this.addSyncGroup = function (group) {
            return requestService.send({
                method: 'post',
                url: '/groups/syncGroup',
                data: group,
                authorization: true,
                success: function (ret, promise) {
                    promise.resolve(ret);
                }
            });

        };



        /**
         * Set active campaign for one or many groups
         * @param {type} groups
         * @param {type} campaignId
         * @returns {unresolved}
         */
        this.setCampaign = function (groups, campaignId) {
            return requestService.send({
                method: 'put',
                url: '/groups/modify/campaign',
                data: {
                    campaignId : campaignId,
                    groups : groups     //array
                },
                authorization: true,
                success: function (ret, promise) {
                    
                    
                      if(ret.success === true){
                            //tell intercom that signature was set
                            if(groups.length === 1){
                                 Intercom('trackEvent', 'Assigned campaign to one group');
                            }else if(groups.length > 1){
                                 Intercom('trackEvent', 'Assigned campaign to many groups');
                            }
                        
                        }
                    
                    promise.resolve(ret);
                }
            });

        };
        
        
        
        /**
         * Set active signature for one or many groups
         * @param {type} groups
         * @param {type} signatureId
         * @returns {unresolved}
         */
        this.setSignature = function (groups, signatureId) {
            return requestService.send({
                method: 'put',
                url: '/groups/modify/signature',
                data: {
                    signatureId : signatureId,
                    groups : groups     //array
                },
                authorization: true,
                success: function (ret, promise) {
                    
                       if(ret.success === true){
                            //tell intercom that signature was set
                            if(groups.length === 1){
                                 Intercom('trackEvent', 'Assigned signature to one group');
                            }else if(groups.length > 1){
                                 Intercom('trackEvent', 'Assigned signature to many groups');
                            }
                        
                            
                            //update google users
                            googlesyncservice.updateGoogleSignatureForGroups(groups);
                        
                        }
                    
                    promise.resolve(ret);
                }
            });
        };

        

        /**
         * Beim bearbeiten von Gruppen oder beim erstellen von Gruppen können gleich Mitglieder abgefragt werden
         */
        this.getPotentialMembers = function (id, search) {
            return requestService.send({
                method: 'get',
                url: '/groups/potmembers/' + id + "?search=" + search ,
                authorization: true,
                success: function (campaigns, promise) {
                    promise.resolve(campaigns);

                }
            });

        };
        
        
         this.getMembers = function (id) {
            return requestService.send({
                method: 'get',
                url: '/groups/members/' + id,
                authorization: true,
                success: function (campaigns, promise) {
                    promise.resolve(campaigns);

                }
            });

        };


        this.update = function (group) {
            return requestService.send({
                method: 'put',
                url: '/groups',
                data: group,
                authorization: true,
                success: function (campaigns, promise) {
                    
                    if(campaigns.success === true){
                        //tell intercom that group was created
                         Intercom('trackEvent', 'Group modified');
                    }
                    
                    promise.resolve(campaigns);

                }
            });

        };



        this.add = function (group) {
            return requestService.send({
                method: 'post',
                url: '/groups',
                data: group,
                authorization: true,
                success: function (ret, promise) {
                    if(ret.success === true){
                        //tell intercom that group was created
                        intercomService.groupCreated();
                    }
                    promise.resolve(ret);
                }
            });

        };

        this.delete = function (id) {
            return requestService.send({
                method: 'delete',
                url: '/groups/' + id,
                authorization: true,
                success: function (ret, promise) {
                    promise.resolve(ret);
                }
            });

        };
           this.deleteMany = function (ids) {
            return requestService.send({
                method: 'post',
                url: '/groups/del/many',
                data: {
                    groupids : ids
                },
                authorization: true,
            });
        };
        
        this.getStatstics = function () {
            return requestService.send({
                method: 'get',
                url: '/groups/data/statistics',
                authorization: true,
                success: function (ret, promise) {
                    promise.resolve(ret);
                }
            });

           
        };
    }
]);
