/*global define*/
angular.module('mailtasticApp.services').service('campaignService', [
    '$rootScope',
    'requestService',
    'intercomService',
    // 'imageService',
    // 'userService',
    // 'apiService',
    function ($rootScope, requestService, intercomService) {
        // Get all campaigns for a user

        this.get = function () {
            return requestService.send({
                method: 'get',
                url: '/campaigns',
                authorization: true,
                success: function (campaigns, promise) {
                    promise.resolve(campaigns);

                }
            });

        };

        this.getOne = function (id) {
            return requestService.send({
                method: 'get',
                url: '/campaigns/' + id,
                authorization: true,
                // success: function (campaigns, promise) {
                // promise.resolve(campaigns);
                // }
            });

        };

        this.add = function (campaign) {
            return requestService.send({
                method: 'post',
                url: '/campaigns',
                data: campaign,
                authorization: true,
                success: function (ret, promise) {
                    
                    if(ret.success === true){
                        //tell intercom that group was created
                        intercomService.campaignCreated();
                    }
                    
                    promise.resolve(ret);
                }
            });

        };

        this.update = function (campaign) {
            return requestService.send({
                method: 'put',
                url: '/campaigns',
                data: campaign,
                authorization: true,
                success: function (campaigns, promise) {
                    if(campaigns.success === true){
                        //tell intercom that group was created
                         Intercom('trackEvent', 'Campaign modified');
                    }
                    promise.resolve(campaigns);

                }
            });

        };
        
        
        

        this.delete = function (id) {
            return requestService.send({
                method: 'delete',
                url: '/campaigns/' + id,
                authorization: true,
                success: function (ret, promise) {
                    promise.resolve(ret);
                }
            });

        };
        
         this.deleteMany = function (ids) {
            return requestService.send({
                method: 'post',
                url: '/campaigns/del/many',
                authorization: true,
                data : {
                    campaignIds : ids
                },
                success: function (ret, promise) {
                    promise.resolve(ret);
                }
            });

        };

        this.edit = function (campaign) {
            if (!campaign.id) {

            } else {

            }

        };

        this.results = function (campaignId) {
            return requestService.send({
                method: 'get',
                url: '/campaigns/results/' + id,
                authorization: true,
                success: function (ret, promise) {
                    promise.resolve(ret);
                }
            });

        };
        //get statistics for all campaigns
        this.getStatistics = function(begin, end){
            return requestService.send({
                method: 'get',
                url: '/campaigns/data/statistics/?begin=' + begin + '&end=' + end,
                authorization: true,
                success: function (ret, promise) {
                    promise.resolve(ret);
                }
            });
            
        };
        //get statistic for only one campaign
        this.getStatisticsSingle = function(begin, end, campaignId){
            return requestService.send({
                method: 'get',
                url: '/campaigns/data/statistics/single/?begin=' + begin + '&end=' + end+ '&campaignId=' + campaignId,
                authorization: true,
                success: function (ret, promise) {
                    promise.resolve(ret);
                }
            });
            
        };
        
        //holt statistik um nach Gruppen aufteilen zu können
         this.getStatisticsByGroup = function(campaignId){
            return requestService.send({
                method: 'get',
                url: '/campaigns/data/statisticsbygroup/'+ campaignId,
                authorization: true,
                success: function (ret, promise) {
                    promise.resolve(ret);
                }
            });
            
        };

    }
]);
