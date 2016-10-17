
/*global define*/
angular.module('mailtasticApp.services').service('authService', [
   '$http', '$q', 'localStorageService','requestService',
    function ($http, $q, localStorageService, requestService) {
        // Get all campaigns for a user

        var authServiceFactory = {};

        var _authentication = {
            isAuth: false,
            userName: "",

            useRefreshTokens: false,
            code: ""
        };

        /* store the token into localstorage */
        var _setAuthToken = function (token) {
            _authentication.token = token;
            localStorageService.set("AuthToken", token);
        };

        /* retrieve token from local storage*/
        var _getSavedToken = function () {
            var authToken = localStorageService.get("AuthToken");
            return authToken;
        };

        var _getAuthUrl = function () {

            return requestService.send({
                method: 'get',
                url: '/googleapi/authurl',
                authorization: true,
                success: function (data,promise) {

                    promise.resolve(data);

                }
            });
            //this.get = function () {
              

            //};
            //return $http.get("http://localhost:3333/api");
        };

        var _getToken = function (code) {
            return requestService.send({
                method: 'get',
                url: "/googleapi/token?code=" + code,
                authorization: true,
                success: function (data, promise) {

                    promise.resolve(data);

                }
            });
        
        }




        authServiceFactory.refreshToken = false;
        authServiceFactory.authentication = _authentication;
        authServiceFactory.setAuthToken = _setAuthToken;
        authServiceFactory.getSavedToken = _getSavedToken;
        authServiceFactory.getToken = _getToken;
        authServiceFactory.getAuthUrl = _getAuthUrl;
//        authServiceFactory.getListOfUsers = _getListOfUsers;
//        authServiceFactory.updateSignature = _updateSignature;
        return authServiceFactory;

    }
]);
