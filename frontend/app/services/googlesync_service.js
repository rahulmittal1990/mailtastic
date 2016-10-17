/*global define*/
angular.module('mailtasticApp.services').service('googlesyncservice', [
    '$rootScope',
    'requestService',
    'authService',
    // 'imageService',
    // 'userService',
    // 'apiService',
    function ($rootScope, requestService, authService) {
        // Get all campaigns for a user

        this.get = function () {
            return requestService.send({
                method: 'get',
                url: '/googleSync',
                authorization: true,
                success: function (campaigns, promise) {
                  
                    promise.resolve(campaigns);

                }
            }); 

        };
        
        this.add = function (companyInfo) {
            return requestService.send({
                method: 'post',
                url: '/googleSync',
                data: companyInfo,
                authorization: true,
                success: function (ret, promise) {
                    promise.resolve(ret);
                }
            });

        };

        this.update = function (companyInfo) {
            return requestService.send({
                method: 'put',
                url: '/googleSync',
                data: companyInfo,
                authorization: true,
                success: function (campaigns, promise) {
                    promise.resolve(campaigns);

                }
            });

        };


        this.deleteInfo = function (syncInfoId) {
            return requestService.send({
                method: 'delete',
                url: '/googleSync/' + syncInfoId,
                authorization: true,
                success: function (ret, promise) {
                    promise.resolve(ret);
                }
            });

        };
        
        
                this.getListOfUsers = function () {
            var token = authService.getSavedToken();
            var obj = {
                googleToken: token
            };
            //return $http.post("/api/listusers", obj);
            return requestService.send({
                method: 'post',
                url: "/googleSync/listusers",
                data: obj,
                authorization: true,
                success: function (data, promise) {

                    promise.resolve(data);

                }
            });
        };



        //update signature for a list of given users via google api
        this.updateSignature = function (obj) {
            var token = authService.getSavedToken();
            var data = {
                users: obj,
                googleToken: token
            };
             return requestService.send({
                method: 'put',
                url: "/googleSync/updatesignature",
                data: data,
                authorization: true,
                success: function (data, promise) {

                    promise.resolve(data);

                }
            });
            
        };
        
        /**
         * Update signature for a list of given groups via google api
         * @param {type} groups list of groupIds
         * @returns {unresolved}
         */
        this.updateGoogleSignatureForGroups = function (groups) {
            var data = {
                groups: groups,
            };
             return requestService.send({
                method: 'post',
                url: "/googleSync/updatesignature/groups",
                data: data,
                authorization: true,
                success: function (data, promise) {

                    promise.resolve(data);

                }
            });
            
        };
        
        

     

    }
]);
