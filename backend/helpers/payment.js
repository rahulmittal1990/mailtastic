var request = require('request');
var q = require('q');
var moment = require('moment');
var config = require('../config/config.js');


var payment = {
    /**
     * Checks if user is in 4 weeks trial or is an active user iwth payment
     * @returns {undefined}
     */
    checkIfAccountActive : function(userId){
        var deferred = q.defer();
        //get AdminUser Data
        User.findOne({where: {id : userId}}).then(function(data){
            if(!data){
//                 console.error("Error Checking Account for payment no data: User not found" + userId);
                 deferred.resolve(false);
            }else if(data.isAdmin == false){       //when user is no admin load data for admin
                //get admin
                User.findOne({where: {id : data.admin}}).then(function(admindata){
                    if(!admindata){
                        console.error("Error Checking Account for payment no admin data: User not found" + userId);
                        deferred.resolve(true);        //TODO eigentlich muss hier false hin aber im error log war diese meldung und lieber bekommt rade einer zu biel
                    }else{
                        checkUserData(admindata).then(function(resultdata){
                            deferred.resolve(resultdata);
                        });
                        
                    }
                });
            }else{
                
                 checkUserData(data).then(function(data){
                     deferred.resolve(data);
                     
                 });
                
            }
        });
        return deferred.promise;
    },
    //TODO maybe dont need
    getCustomerData : function(id){
         var deferred = q.defer();
        
         User.findOne({where: {id : userId, isAdmin : true}}).then(function(data){
             if(!data){ //user in own db not found
                 console.error("Payment: Getting Admin Data failed : " + id);
                 deferred.resolve(null);
             }else{ //prepare request for isaac10
                  var isaac10Id = data.isaacCustomerNumber;
                    var customerToken = data.isaacCustomerToken;
                   var options = {
                        url: config.isaacUrl + '/api/v1/customer/'+ isaac10Id + '/subscriptions',
                        headers: {
                          'Authorization': 'Token token="'+ customerToken +'"'
                        }
                      };
                      //send request to isaac10
                    request(options, function (error, response, body) {
                        if (!error && response.statusCode === 200) {
                          //console.log("Isaac Response: " + body) // Show the HTML for the Google homepage. 
                          
                          //parse responseu
                          body = JSON.parse(body);
                          
                          if(!body.subscriptions){
                               deferred.resolve(false);
                          }else if(body.subscriptions.length === 0){
                               deferred.resolve(false);
                              
                          }else if(body.subscriptions[0].status !== "ongoing"){
                               deferred.resolve(false);
                          }else{
                               deferred.resolve(true);
                          }
                        }else{
                             deferred.resolve(false);
                            console.error(error);
                            console.error(response);
                        };
                    });
                 
             }
             
         });
         
         return deferred.promise;
        
    }
};

//payment.checkIfAccountActive();

//checkt die Daten des adminusers
function checkUserData(data){
 var deferred = q.defer();

                //check is registration is not longer ago than 30 days
                var creationDate = moment(data.createdAt);
                var now  = moment();
                
                var diffDays = now.diff(creationDate, 'days');
                if(diffDays < 14){      //account jünger als 30 tage
                      deferred.resolve(true);
                }else if(data.forceAllow === true){ //wurde manuell freigeschaltet
                     deferred.resolve(true);
                }else if(!data.isaacCustomerNumber || !data.isaacCustomerToken){        //kein isaac ids und token vorhanden
                     deferred.resolve(false);
                }
                else{   //check account status in isaac10
                    //check if user is active in isaac10
                    var isaac10Id = data.isaacCustomerNumber;
                    var customerToken = data.isaacCustomerToken;
                    //var isaac10Id = "100003";
                    //var customerToken = "otnupEhnopRBctUp0hkzoxWzFWjvzQdG";
                    //prepare request for isaac 10 with auth header
                    var options = {
                        url: config.isaacUrl+'/api/v1/customer/'+ isaac10Id + '/subscriptions',
                        headers: {
                          'Authorization': 'Token token="'+ customerToken +'"'
                        }
                      };
                      //send request to isaac10
                    request(options, function (error, response, body) {
                        if (!error && response.statusCode === 200) {
                           //console.log("Isaac Response: " + body) // Show the HTML for the Google homepage. 
                          
                          //parse responseu
                          body = JSON.parse(body);
                          
                          if(!body.subscriptions){
                               deferred.resolve(false);
                          }else if(body.subscriptions.length === 0){
                               deferred.resolve(false);
                              
                          }else if(body.subscriptions[0].status !== "ongoing"){
                               deferred.resolve(false);
                          }else{
                               deferred.resolve(true);
                          }
                        }else{
                             deferred.resolve(false);
                            console.error(error);
                            console.error(response);
                        };
                    });
                }
return deferred.promise;

}

module.exports = payment;