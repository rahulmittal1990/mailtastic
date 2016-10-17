'use strict';
var common = require("./common");
/* what access we will have after we receive the access_token, user will be asked to provide access for following scopes */
var SCOPES = ['https://apps-apis.google.com/a/feeds/emailsettings/2.0/', 'https://www.googleapis.com/auth/admin.directory.user'];

var self = new function () {
    var self = this;

    /* it generates google auth url and sends back to client. client opens it in a popup window
     * google redirects to the login window / scope window
    */
    this.getAuthUrl = function (req, res, next) {
        common.getAuthClient(function (oAuthClient) {
            var authUrl = oAuthClient.generateAuthUrl({
                access_type: 'offline',
                prompt : "consent",
                scope: SCOPES
            });
            res.send(authUrl);
        });
    }

    /* internall call to google Auth client, request access_token for given response code 
     * response code comes after user allow the access. it will be attached in the callback url  eg: authComplete.html?code=abcd29999999999999999
     */
    this.requestToken = function (code, callBack) {
        /* call common and create instance of auth client*/
        common.getAuthClient(function (oAuthClient) {

            /* call to google server to provide the access_token*/
            oAuthClient.getToken(code, function (err, token) {
                if (err) {
                    res.send(err).status(500);
                }
                else {
                    /* set access_token to credentials property , this oAuthClient object needs access_token to do further actions */
                    oAuthClient.credentials = token;
                    callBack(oAuthClient, token);
                }
            });
        });
    }
    
     /* 
     * get fresh google access token with refresh token to request google
     */
    this.getRefreshedToken = function(){
        
        
        
    };
    
    this.getToken = function (req, res, next) {
        self.requestToken(req.query.code, function (oAuthClient, token) {
            /* sends access_tokent to client. client will store it into localstorage so user will not be required to login again and again */
            res.json(token);
        });
    }

}

exports.getAuthUrl = self.getAuthUrl;
exports.getToken = self.getToken;