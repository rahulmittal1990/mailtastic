/*global define*/
/**
 * This service is used for the assistent to hold shared data and so on
 * @param {type} param1
 * @param {type} param2
 */
angular.module('mailtasticApp.services')
        .service( 'assistantconfigService'
      , 
[
    '$rootScope',
    'alertService',
    'employeeService',
 
    function ($rootScope, alertService, employeeService) {
       var config = {
           currentStep : "",
           entryPoint : "",
           breadcrumps : [],
           breadcrumpsdone : [],
           headline : "",
           
           resultdata : {
               campaign : {},
               group : {},
               employee :{},
               signature : {}
           }
       };

       config.reset = function(){
         
            this.currentStep = "";
             this.entryPoint = "";
             this.breadcrumps = [];
              this.breadcrumpsdone = [];
             this.headline = "";
             this.groupCreated = false;
             this.groupId = null;
            this.disableGroupArea = false;
            this.resultdata = {
                group : {},
                employee : {}, 
                campaign:{},
                signature : {}
            };
        };
        
        
        
        
        
        
        
         /**
                 * Send invitation mail to all new added employees
                 * @returns {undefined}
                 */
                config.inviteMembers = function(){
                    
                    
                    if(!config.resultdata.employee.idsAdded || !Array.isArray(config.resultdata.employee.idsAdded) || config.resultdata.employee.idsAdded.length === 0){
                         alertService.defaultErrorMessage(Strings.errors.DATEN_NICHT_GELADEN);
                        
                    }else{
                        employeeService.sendInvitations(config.resultdata.employee.idsAdded)
                                .then(function(data){
                                    if(data.success === true){
                                        config.resultdata.rolloutDone = true;
                                        config.resultdata.amountOfRolledOut = $scope.config.resultdata.employee.idsAdded.length;

                                        config.breadcrumpsdone.push("Mitarbeiter informiert");
                                        config.breadcrumps = ["Fertig"];
                                    }else{
                                          alertService.defaultErrorMessage(Strings.errors.DATEN_NICHT_GELADEN);
                                    }
                                });
                        
                    }
                };
                
        return config;

      
      
    }
]);
