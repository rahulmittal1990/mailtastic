
var fs = require('fs');
var googleAuth = require('google-auth-library');


var self=new function()
{
    
    this.getAuthClient = function (callBack) {
        this.getCredentials(function (credentials) {
            var clientSecret = credentials.installed.client_secret;
            var clientId = credentials.installed.client_id;
            var redirectUrl = credentials.installed.redirect_uris[0];
            var auth = new googleAuth();
            var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);
            callBack(oauth2Client);
        })
    }
    this.getCredentials = function (callBack) {
        fs.readFile('client_secret.json', function processClientSecrets(err, content) {
            if (err) {
                console.log('Error loading client secret file: ' + err);
                return;
            }
            var credentials = JSON.parse(content);
            callBack(credentials);
       
        });
    }
}

exports.getAuthClient = self.getAuthClient;
exports.getCredentials = self.getCredentials;