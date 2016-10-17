angular.module('mailtasticApp.integration')

.controller('VersaCommerceCtrl', 
    [
        '$scope', 
        '$uibModal', 
        'employeeService',
        'alertService',
        '$injector',
        'paymentService',
        '$q',
        function ($scope, $uibModal, employeeService, alertService, $injector, paymentService, $q) {

        
        
        
        $scope.initData = function(){
            var storageFactory = $injector.get('StorageFactory');
            $scope.userId = storageFactory.get("userId");
            
            
            
        };
        
        /**
         * 
         * @returns {undefined}Create for each email template one user
         */
        $scope.createVersaCommerceUsers = function(){
            
            
                    alertService.defaultConfirmPrompt("Möchten Sie die Nutzer und Abteilungen für Versa Commerce jetzt erstellen?")
            
            
                    .then(paymentService.getUserStatus, function(){
                        
                        return $q.reject("VALIDBREAK");
                        
                    })
             
                    .then(function(data){
                        if (data.success === false) {     //fehler
                            alert(Strings.errors.DATEN_NICHT_GELADEN);
                        } else {
                           
                            if (data.forceAllow == true) { //manuell freigeschaltet
                                data.showBuyModal = false;
                                return $q.resolve(data);
                            } else if (data.hasTestTime === true) {    //noch im test
                                  data.showBuyModal = false;
                                return $q.resolve(data);
                            } else if (data.hasSubscription === true) {    //ist zahlkunde
                                if (data.amountOfFreeMembers > 8) {   //hat noch freie
                                      data.showBuyModal = false;
                                     return $q.resolve(data);
                                } else {      //hat keine freien mitarbeiter mehr
                                        data.showBuyModal = true;
                                      return $q.resolve(data);
                                }
                            } else {
                                //muss erst eine subscription abschließen
                                //alert("Sie müssen zuerst Ihre Zahlungsdaten angeben, um weitere Mitarbeiter hinzufügen zu können.");
                                var modalInstance = $uibModal.open({
                                    animation: true,
                                    templateUrl: "booking/accountexpiredmodal/modals/unallowed_action_modal.html",
                                    controller: 'AccountExpiredModalInstanceCtrl',
                                    size: "lg",
                                    windowClass : "expiredmodalcontainer"
                                });
                                
                            }
                        }
                
                
                    })
                    .then(function(data){
                        return new Promise(function(resolve, reject){
                            if(data.showBuyModal === true){    //show buy dialog
                             alertService.importVersaCommerce({
                                        totalAmount: 9, 
                                        validAmount : 9,
                                        freeAmount: data.amountOfFreeMembers, 
                                        alreadyExistant : 0,
                                        emailsAsString: "",
                                        billing_interval :data.billing_interval ,
                                        customPrice : data.customPrice
                                    }, function success(){
                                        if(!$("#versamodalcheckbox").prop("checked")){
//                                              deferred.reject("NO GROUP");
                                            return false;
                                        }else{
                                            document.getElementById('versamodalcheckbox').value = null; //reset file input
                                            employeeService.addVersaCommerceUsers().then(function(){
                                                    resolve();
                                
                                        });  
                                        }
                                    }, function error () {
                                       // alert("Abbruch");   
                                      
                                       document.getElementById('versamodalcheckbox').value = null; //reset file input
                                       
                                        });
                            }else{  //dont show buy dialog
                                employeeService.addVersaCommerceUsers().then(function(){

                                    resolve();

                                });  
                            };
                        });
                    })
                    .then(function(){
                        
                        alertService.defaultSuccessMessage("Die Nutzer wurden erfolgreich hinzugefügt und befinden Sich in Ihrer Mitarbeiter-Liste.");
                        paymentService.syncEmployees();
                    })
                    .catch(function(e){
                        
                        if(e === "VALIDBREAK"){
                            //user aborted himself
                            
                        }else{
                            alert(Strings.errors.DATEN_NICHT_GELADEN);
                            paymentService.syncEmployees();
                            document.getElementById('versamodalcheckbox').value = null; //reset file input
                        }
                       
                        
                        
                    });
        };
        
        
        $scope.initData();
        

}]);
