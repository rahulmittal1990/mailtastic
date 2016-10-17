/*global define*/
'use strict';

angular.module('mailtasticApp.services').service('alertService', 
[
    '$state',
    function ($state) {

         this.addemployee = function(data, callbacksuccess, callbackabort){
             var empPrice = 0;
             if(data.billing_interval === "monthly"){
                 data.billing_interval = "1 Monat";
                 empPrice = 3;
             }else if(data.billing_interval === "yearly"){
                 data.billing_interval = "12 Monate";
                 empPrice = 2.49;
             }
             
             if(data.customPrice){
                  empPrice = data.customPrice / 100;
             }
             
             var priceToShow = data.amount*empPrice;
             priceToShow = (Math.round(priceToShow * 100)/100).toFixed(2);
             
             
            bootbox.dialog({
                //title: "Mitarbeiter hinzufügen",
                title : "",
                message: '<div class="row">  ' +
                    '<div class="col-md-12"> ' +
                    '<div class="innerheadline">Möchten Sie den Mitarbeiter "' + data.firstname + " " + data.lastname  + '" jetzt kostenpflichtig zu Mailtastic hinzufügen?</div>' +
                    '<div class="employeeprice">('+ priceToShow +'€/Monat, bis zum Ende der vereinbarten Vertragslaufzeit)</div>'+
                    '<div class="checkbox">'+
                    '<label><input id="createempmodalcheckbox" onclick="enablebuybutton()" type="checkbox" value="true" required="true">Ja, ich möchte "' + data.firstname + " " + data.lastname  + '"  kostenpflichtig hinzufügen und habe die <a target="_blank" href="https://www.mailtastic.de/agb"><span class="text-underline">AGB</span></a> gelesen und akzeptiert.</label>'+
                    '</div>'+
                    ' </div>  </div>',
                buttons: {
                   
                    abort: {
                        label: "Abbrechen",
                        className: "ownbtn btngrau",
                        callback: callbackabort
                    }, success: {
                        label: "Hinzufügen",
                        className: "ownbtn btnblau employeebuybutton disabled",
                        callback: callbacksuccess
                    }
                }
            }
        );
            
        };
        
        
        /**
         * User booked succesffully
         * @param {type} callbacksuccess
         * @returns {undefined}
         */
        this.subscriptionCompleted = function(callbacksuccess){
          
            
             bootbox.dialog({
                //title: "Mitarbeiter hinzufügen",
                title : "",
                message: '<div class="row">  ' +
                    '<div class="col-md-12 import"> ' +
                    '<div style="font-family:roboto_bold;font-size : 18px;color:#363f48;">Herzlichen Glückwunsch - <br> Ihr Abo wurde erfolgreich aktiviert!</div>' +
                    '<div style="font-family:roboto_regular;font-size : 14px;color:#828282;margin-top:15px;">Alle Informationen rund um Ihr Abo erreichen Sie jederzeit<br>unter dem Menüpunkt "Konto".</div>' +
                    '<div class="schrift_blau" style="font-family:roboto_regular;font-size : 14px;margin-top:15px;">Lassen Sie uns wissen, wenn Sie Hilfe brauchen!<br>Wir sind jederzeit für Sie da. Ihr Mailtastic-Team.</div>' +
                        '</div>'+
                    '</div>  </div>',
                buttons: {
                   
                   success: {
                        label: "Zur Übersicht",
                        className: "ownbtn btnblau ",
                        callback: callbacksuccess,
                    }
                }
            }
        );
        };
        
          this.importEmployeeFree = function(data, callbacksuccess, callbackabort){
            var bereitsVorhanden = "";
            if(data.alreadyExistant > 0){
                bereitsVorhanden  =   '<div class="">- '+ data.alreadyExistant + ' Mitarbeiter sind bereits vorhanden und werden nicht erneut importiert: </div>' +
                    '<div class="">('+ data.emailsAsString + ')</div>';
            }
            var buttonLabel = "";
            var hinzufuegentext = "";
            if(data.validAmount <= 0){
                 buttonLabel = "Schließen";
               hinzufuegentext = '<div class="">Bitte verwenden Sie eine andere Datei zum Importieren.</div>';
                document.getElementById('employeeimport').value = null; //reset file input
            }else{
                 buttonLabel = "Hinzufügen";
                hinzufuegentext=  '<div class="">Möchten Sie ' + data.validAmount + ' Mitarbeiter jetzt zu Mailtastic hinzufügen?</div>';
            }
            
             bootbox.dialog({
                //title: "Mitarbeiter hinzufügen",
                title : "",
                message: '<div class="row">  ' +
                    '<div class="col-md-12 import"> ' +
                    '<div class="innerheadline">Prüfung abgeschlossen</div>' +
                    '<div class="">Dokument: <span class="schrift_blau">' + data.filename +'</span></div>' +
                    '<div class="">- Die Datei enthält insgesamt '+ data.totalAmount + ' Mitarbeiter</div>' +
                    bereitsVorhanden+
                    '<div class="innerheadline down">Importierbare Mitarbeiter: ' + data.validAmount + ' </div>'+
                    hinzufuegentext+
                     ' </div>  </div>',
                buttons: {
                   
                    abort: {
                        label: "Abbrechen",
                        className: "ownbtn btngrau",
                        callback: callbackabort
                    }, success: {
                        label: buttonLabel,
                        className: "ownbtn btnblau employeebuybutton",
                        callback: callbacksuccess
                    }
                }
            }
        );
        };
        
        
        /**
         * is shown when user wants to import versa commerce users for each auto mail template into mailtastic
         * @param {type} data
         * @param {type} callbacksuccess
         * @param {type} callbackabort
         * @returns {undefined}
         */
       this.importVersaCommerce = function(data, callbacksuccess, callbackabort){
                
                 var empPrice = 0;
             if(data.billing_interval === "monthly"){
                 data.billing_interval = "1 Monat";
                 empPrice = 3;
             }else if(data.billing_interval === "yearly"){
                 data.billing_interval = "12 Monate";
                 empPrice = 2.49;
             }
                
                
             if(data.customPrice){
                  empPrice = data.customPrice / 100;
             }
                
                
                var bereitsVorhanden = "";
                var amountToBuy = data.validAmount - data.freeAmount;
                if(data.alreadyExistant > 0){
                    bereitsVorhanden  =   '<div class="">- '+ data.alreadyExistant + ' Mitarbeiter sind bereits vorhanden und werden nicht erneut importiert: </div>' +
                        '<div class="">('+ data.emailsAsString + ')</div>';
                }

                   var hinzufuegentext = "";
                   var buttonLabel = "";
                if(data.validAmount <= 0){
                   hinzufuegentext = '<div class="">Bitte verwenden Sie eine andere Datei zum Importieren.</div>';
                   buttonLabel = "Schließen";
                }else{
                    
                    var priceToShow = amountToBuy*empPrice;
                    priceToShow = (Math.round(priceToShow * 100)/100).toFixed(2);
                    
                    buttonLabel = "Hinzufügen";
                    hinzufuegentext=   '<div class="">Möchten Sie ' + amountToBuy + ' Mitarbeiter-Lizenzen jetzt kostenpflichtig zu Mailtastic hinzufügen?</div>' +
                        '<div class="">('+ priceToShow +'€/Monat, bis zum Ende der vereinbarten Vertragslaufzeit)</div>'+
                        '<div class="checkbox">'+
                        '<label><input id="versamodalcheckbox" onclick="enablebuybutton()" type="checkbox" value="true" required="true">Ja, ich möchte ' + amountToBuy +' Mitarbeiter-Lizenzen  kostenpflichtig hinzufügen und habe die <a target="_blank" href="https://www.mailtastic.de/agb"><span class="text-underline">AGB</span></a> gelesen und akzeptiert.</label>';
                }


                 bootbox.dialog({
                    //title: "Mitarbeiter hinzufügen",
                    title : "",
                    message: '<div class="row">  ' +
                        '<div class="col-md-12 import"> ' +
                        '<div class="innerheadline">Verca Commerce Integration</div>' +
                        '<div class="">- Es werden insgesamt '+ data.totalAmount + ' Mitarbeiter-Lizenzen hinzugefügt</div>' +
                        '<div class="innerheadline down">Benötigte Lizenzen: ' + data.validAmount + ' </div>'+
                        '<div class="">Noch frei im Rahmen Ihrer Basislizenz: ' + data.freeAmount + ' </div>'+
                        hinzufuegentext+
                        '</div>'+
                        '</div>  </div>',
                    buttons: {

                        abort: {
                            label: "Abbrechen",
                            className: "ownbtn btngrau",
                            callback: callbackabort
                        }, success: {
                            label: buttonLabel,
                            className: "ownbtn btnblau employeebuybutton disabled",
                            callback: callbacksuccess,
                        }
                    }
                }
            );
        };
        
        
        
        
        
                /**
         * is shown when user wants to import versa commerce users for each auto mail template into mailtastic
         * @param {type} data
         * @param {type} callbacksuccess
         * @param {type} callbackabort
         * @returns {undefined}
         */
       this.importGoogleSyncUsers = function(data, callbacksuccess, callbackabort){
                
                 var empPrice = 0;
             if(data.billing_interval === "monthly"){
                 data.billing_interval = "1 Monat";
                 empPrice = 3;
             }else if(data.billing_interval === "yearly"){
                 data.billing_interval = "12 Monate";
                 empPrice = 2.49;
             }
                

                if(data.customPrice){
                     empPrice = data.customPrice / 100;
                }
                
                
                var bereitsVorhanden = "";
                var amountToBuy = data.validAmount - data.freeAmount;
                if(data.alreadyExistant > 0){
                    bereitsVorhanden  =   '<div class="">- '+ data.alreadyExistant + ' Mitarbeiter sind bereits vorhanden und werden nicht erneut importiert: </div>' +
                        '<div class="">('+ data.emailsAsString + ')</div>';
                }

                var hinzufuegentext = "";
                var buttonLabel = "";
                
                
                 var priceToShow = amountToBuy*empPrice;
                    priceToShow = (Math.round(priceToShow * 100)/100).toFixed(2);
                
                buttonLabel = "Hinzufügen";
                hinzufuegentext=   '<div class="">Möchten Sie ' + amountToBuy + ' Mitarbeiter-Lizenzen jetzt kostenpflichtig zu Mailtastic hinzufügen?</div>' +
                    '<div class="">('+ priceToShow +'€/Monat, bis zum Ende der vereinbarten Vertragslaufzeit)</div>'+
                    '<div class="checkbox">'+
                    '<label><input id="googlemodalcheckbox" onclick="enablebuybutton()" type="checkbox" value="true" required="true">Ja, ich möchte ' + amountToBuy +' Mitarbeiter-Lizenzen  kostenpflichtig hinzufügen und habe die <a target="_blank" href="https://www.mailtastic.de/agb"><span class="text-underline">AGB</span></a> gelesen und akzeptiert.</label>';



                 bootbox.dialog({
                    //title: "Mitarbeiter hinzufügen",
                    title : "",
                    message: '<div class="row">  ' +
                        '<div class="col-md-12 import"> ' +
                        '<div class="innerheadline">Google Apps for Work Integration</div>' +
                        '<div class="">- Es werden insgesamt '+ data.totalAmount + ' Mitarbeiter-Lizenzen hinzugefügt</div>' +
                        '<div class="innerheadline down">Benötigte Lizenzen: ' + data.validAmount + ' </div>'+
                        '<div class="">Noch frei im Rahmen Ihrer Basislizenz: ' + data.freeAmount + ' </div>'+
                        hinzufuegentext+
                        '</div>'+
                        '</div>  </div>',
                    buttons: {

                        abort: {
                            label: "Abbrechen",
                            className: "ownbtn btngrau",
                            callback: callbackabort
                        }, success: {
                            label: buttonLabel,
                            className: "ownbtn btnblau employeebuybutton disabled",
                            callback: callbacksuccess,
                        }
                    }
                }
            );
        };
        
        
        
        
        
        
        /**
         * show when user wants to add many users with not enough free amount
         * @param {type} data
         * @param {type} callbacksuccess
         * @param {type} callbackabort
         * @returns {undefined}
         */
        
            this.importEmployeeBuy = function(data, callbacksuccess, callbackabort){
                
                 var empPrice = 0;
             if(data.billing_interval === "monthly"){
                 data.billing_interval = "1 Monat";
                 empPrice = 3;
             }else if(data.billing_interval === "yearly"){
                 data.billing_interval = "12 Monate";
                 empPrice = 2.49;
             }
                
                
             if(data.customPrice){
                  empPrice = data.customPrice / 100;
             }
                
                
                var bereitsVorhanden = "";
                var amountToBuy = data.validAmount - data.freeAmount;
                if(data.alreadyExistant > 0){
                    bereitsVorhanden  =   '<div class="">- '+ data.alreadyExistant + ' Mitarbeiter sind bereits vorhanden und werden nicht erneut importiert: </div>' +
                        '<div class="">('+ data.emailsAsString + ')</div>';
                }

                   var hinzufuegentext = "";
                   var buttonLabel = "";
                if(data.validAmount <= 0){
                   hinzufuegentext = '<div class="">Bitte verwenden Sie eine andere Datei zum Importieren.</div>';
                   buttonLabel = "Schließen";
                }else{
                    buttonLabel = "Hinzufügen";
                    
                     var priceToShow = amountToBuy*empPrice;
                    priceToShow = (Math.round(priceToShow * 100)/100).toFixed(2);
                    
                    hinzufuegentext=   '<div class="">Möchten Sie ' + amountToBuy + ' Mitarbeiter jetzt kostenpflichtig zu Mailtastic hinzufügen?</div>' +
                        '<div class="">('+ priceToShow +'€/Monat, bis zum Ende der vereinbarten Vertragslaufzeit)</div>'+
                        '<div class="checkbox">'+
                        '<label><input id="importmodalcheckbox" onclick="enablebuybutton()" type="checkbox" value="true" required="true">Ja, ich möchte ' + amountToBuy +' Mitarbeiter  kostenpflichtig hinzufügen und habe die <a target="_blank" href="https://www.mailtastic.de/agb"><span class="text-underline">AGB</span></a> gelesen und akzeptiert.</label>';
                }


                 bootbox.dialog({
                    //title: "Mitarbeiter hinzufügen",
                    title : "",
                    message: '<div class="row">  ' +
                        '<div class="col-md-12 import"> ' +
                        '<div class="innerheadline">Prüfung abgeschlossen</div>' +
                        '<div class="">Dokument: <span class="schrift_blau">' + data.filename +'</span></div>' +
                        '<div class="">- Die Datei enthält insgesamt '+ data.totalAmount + ' Mitarbeiter</div>' +
                        bereitsVorhanden+
                        '<div class="innerheadline down">Importierbare Mitarbeiter: ' + data.validAmount + ' </div>'+
                        '<div class="">Noch frei im Rahmen Ihrer Basislizenz: ' + data.freeAmount + ' </div>'+
                        hinzufuegentext+
                        '</div>'+
                        '</div>  </div>',
                    buttons: {

                        abort: {
                            label: "Abbrechen",
                            className: "ownbtn btngrau",
                            callback: callbackabort
                        }, success: {
                            label: buttonLabel,
                            className: "ownbtn btnblau employeebuybutton disabled",
                            callback: callbacksuccess,
                        }
                    }
                }
            );
        };
        
        
        this.otherImportPos = function(){
             bootbox.dialog({
                //title: "Mitarbeiter hinzufügen",
                title : "",
                message: 
                        '<div class="othermethod">'+
                        '<h4 class="importsupportheadline">Andere Quellen</h4>'+
                        '<div class="importsupportdesc">In Kürze können Sie Mitarbeiter automatisch aus verschiedenen Quellen wir z.B. Active Directory importieren. Bis es soweit ist, importiere ich Ihre Mitarbeiter selbstverständlich gerne manuell für Sie. <br><br>Bitte sprechen Sie mich an:</div>'+
                            '<div class="flex-center-all supportarea">'+
                                '<img src="../../../img/profile/Avatar_Andi.png">'+
                                '<div class="importsupportcontact">'+
                                    '<div class="name">Andreas Schröder</div>'+
                                   ' <div class="desc">Leiter Entwicklung</div>'+
                                    '<div class="tel"><span class="glyphicon glyphicon-earphone" aria-hidden="true"></span> '+ Strings.supportdata.supporttelnr + '</div>' +
                               ' </div>'+
                            '</div>'+
                        '</div>',
                buttons: {
                   
                  success: {
                        label: "Schließen",
                        className: "ownbtn btnblau employeebuybutton",
                    }
                }
            }
        );
            
        };
        
        
        
        //infobox snippets für den assistenten Gruppe
        var groupCreatedSnippet =       '<div class="infobox  infobox-success" >'+
                                        '<span class="symbol glyphicon glyphicon-check"></span>'+
                                        '<div>'+
                                        '<div class="text">Die Abteilung <strong>$$$GROUPTITLE$$$</strong> wurde erfolgreich erstellt.</div>'+
                                        '</div>'+
                                        '</div>';
       var groupNoEmpsSnippet =         '<div class="infobox  infobox-error" >'+
                                        '<span class="symbol glyphicon glyphicon-alert"></span>'+
                                        '<div>'+
                                        '<div class="text"><strong>Ihre neue Abteilung ist leer. Fügen Sie jetzt Mitarbeiter zur Abteilung hinzu.</strong></div>'+
                                        '</div>'+
                                        '</div>';
         
        
         var groupCampaignAdded =       '<div class="infobox  infobox-success" >'+
                                        '<span class="symbol glyphicon glyphicon-check"></span>'+
                                        '<div>'+
                                        '<div class="text">Die Kampagne <strong>$$$CAMPAIGNTITLE$$$</strong> wurde der Abteilung <strong>$$$GROUPTITLE$$$</strong> zugewiesen.</div>'+
                                        '</div>'+
                                        '</div>';
        
        var groupNoCmpSnippet =         '<div class="infobox  infobox-error" >'+
                                            '<span class="symbol glyphicon glyphicon-alert"></span>'+
                                            '<div>'+
                                                '<div class="text"> <strong>Aktuell wird keine Kampagne in den E-Mails der eingeladenen Mitarbeiter angezeigt.</strong> '+
                                                    '<div class="additionaltext">Weisen Sie der Abteilung <strong>$$$GROUPTITLE$$$</strong> eine Kampagne zu, um festzulegen'+  
                                                        'welcher Kampagnen-Banner in den E-Mails der Mitglieder angezeigt werden soll.'+
                                                    '</div>' +
                                                '</div>'+
                                            '</div>'+
                                        '</div>';
                                
        var groupNoSigSnippet =         
                                        '<div class="infobox  infobox-error" >'+
                                            '<span class="symbol glyphicon glyphicon-alert"></span>'+
                                            '<div>'+
                                                '<div class="text"> <strong>Aktuell wird keine Signatur in den E-Mails der eingeladenen Mitarbeiter angezeigt.</strong> '+
                                                    '<div class="additionaltext">Weisen Sie der Abteilung <strong>$$$GROUPTITLE$$$</strong> eine Signatur zu, um festzulegen'+  
                                                        'welche Signatur in den E-Mails der Mitglieder angezeigt werden soll.'+
                                                    '</div>'+
                                                '</div>'+
                                            '</div>'+
                                       '</div>';
                              
                              
         var groupEmpsAddedSnippet =        '<div class="infobox  infobox-success" >'+
                                        '<span class="symbol glyphicon glyphicon-check"></span>'+
                                        '<div>'+
                                        '<div class="text"><strong>$$$AMOUNTOFEMPS$$$ Mitarbeiter wurde$$$MOREEMPS$$$  erfolgreich zur Abteilung $$$GROUPTITLE$$$ hinzugefügt</strong> '+
                                        '</div>'+
                                        '</div>'+
                                        '</div>';
                                
                                
                                
          //infobox snippets für den assistenten Kampagne
        var campaignCreatedSnippet =       '<div class="infobox  infobox-success" >'+
                                        '<span class="symbol glyphicon glyphicon-check"></span>'+
                                        '<div>'+
                                        '<div class="text">Die Kampagne <strong>$$$CAMPAIGNTITLE$$$</strong> wurde erfolgreich erstellt.</div>'+
                                        '</div>'+
                                        '</div>';
           
          var campaignGroupAdded =       '<div class="infobox  infobox-success" >'+
                                        '<span class="symbol glyphicon glyphicon-check"></span>'+
                                        '<div>'+
                                        '<div class="text">   Die Kampagne <strong>$$$CAMPAIGNTITLE$$$</strong> wurde $$$AMOUNTOFGROUPS$$$ Abteilungen ($$$AMOUNTOFMEMBERS$$$ Mitarbeitern) zugewiesen: <strong>$$$GROUPTITLESADDED$$$</strong></div>'+
                                        '</div>'+
                                        '</div>';
        
         var campaignNoGroupSnippet =   '<div class="infobox  infobox-error" >'+
                                        '<span class="symbol glyphicon glyphicon-alert"></span>'+
                                        '<div>'+
                                        '<div class="text"> <strong>Diese Kampagne ist noch nicht aktiv! Weisen Sie die Kampagne jetzt einer Abteilung zu.</strong> '+
                                        '<div class="additionaltext">Damit der Kampagnen-Banner in den E-Mails Ihrer Mitarbeiter angezeigt wird, müssen Sie die Kampagne den Abteilungen zuweisen, in denen sich die entsprechenden Mitarbeiter befinden.'+
                                        '</div></div>'+
                                        '</div>'+
                                        '</div>';  
                                
           var campaignNoEmspInGroupSnippet =   '<div class="infobox  infobox-error" >'+
                                        '<span class="symbol glyphicon glyphicon-alert"></span>'+
                                        '<div>'+
                                        '<div class="text"> <strong>Die zugewiesenen Abteilungen sind leer!</strong> '+
                                        '<div class="additionaltext"> Derzeit wird der Kampagnen-Banner noch bei keinem Mitarbeiter angezeigt. Fügen Sie jetzt Mitarbeiter zu den entsprechenden Abteilungen hinzu: <strong>$$$GROUPTITLESADDED$$$</strong>'+
                                        '</div></div>'+
                                        '</div>'+
                                        '</div>';     
                                
                                
                                
              var employeeGroupAdded =       '<div class="infobox  infobox-success" >'+
                                        '<span class="symbol glyphicon glyphicon-check"></span>'+
                                        '<div>'+
                                        '<div class="text">   Die Kampagne <strong>$$$CAMPAIGNTITLE$$$</strong> wurde $$$AMOUNTOFGROUPS$$$ Abteilungen ($$$AMOUNTOFMEMBERS$$$ Mitarbeitern) zugewiesen: <strong>$$$GROUPTITLESADDED$$$</strong></div>'+
                                        '</div>'+
                                        '</div>';
           
             var signatureSet =       '<div class="infobox  infobox-success" >'+
                                        '<span class="symbol glyphicon glyphicon-check"></span>'+
                                        '<div>'+
                                        '<div class="text">   Die Signatur <strong>$$$SIGNATURETITLE$$$</strong> wurde erfolgreich zugewiesen.</div>'+
                                        '</div>'+
                                        '</div>';
                                
            
             
               var assistantMembersNotYetInvited =     
                                                    '<div  class="infobox infobox-error" >'+
                                                    '<span class="symbol glyphicon glyphicon-alert"></span>'+
                                                    '<div class="contentarea">'+
                                                    '<div class="text"><strong>Benachrichtigen Sie Ihre Mitarbeiter</strong></div>'+
                                                    '<div class="additionaltext">Damit die zugewiesene Mailtastic-Signatur, bzw. der Kampagnen-Banner bei Ihren Mitarbeitern angezeigt wird, müssen diese Mailtastic in Ihren E-Mail-Client integrieren, bzw aktualisieren. Möchten Sie die betroffenen Mitarbeitern jetzt benachrichtigen?</div>'+
                                                    '</div>'+
                                                    '</div>';
           
                                
                //wird angezeigt wenn der Gruppe erstellen Prozess vorzeitig beendet wird.
        this.assistantAbortEmployeee = function(data, abort, back){
            var alerthtml = '<div style="margin-bottom : 15px;" class="innerheadline">Wollen Sie den Prozess wirklich vorzeitig beenden?</div>';
            
            if(data.groupCreated){
                alerthtml += groupCreatedSnippet;
            }
            
            
            alerthtml +=groupEmpsAddedSnippet;
            alerthtml = alerthtml.replaceAll("$$$AMOUNTOFEMPS$$$", data.employee.amountOfImported);
             if(data.employee.amountOfImported > 1){
                    alerthtml = alerthtml.replaceAll("$$$MOREEMPS$$$", "n");
             }else{
                     alerthtml = alerthtml.replaceAll("$$$MOREEMPS$$$", "");
             }
            
            if(data.signature.signatureAssigned){
                alerthtml += signatureSet;
                 
            }else{
                alerthtml += groupNoSigSnippet;
            }
            
//            if(data.campaign.groupSet){
//                alerthtml += campaignGroupAdded;
//     
//            }
            
            //is campaign added?
            if(!data.group.activeCampaign){
                 alerthtml +=groupNoCmpSnippet;
            }else{
                
                 alerthtml +=groupCampaignAdded;
            }
            
            
            //users were not yet invited
             if( !data.rolloutDone){
                 alerthtml += assistantMembersNotYetInvited;
            }
            
            
            
            //replace grouptitle
             alerthtml = alerthtml.replaceAll("$$$GROUPTITLE$$$", data.group.title);
             //replace signature title
              alerthtml = alerthtml.replaceAll("$$$SIGNATURETITLE$$$", data.signature.signatureAssignedTitle);
              //replace campaigntitle
              alerthtml = alerthtml.replaceAll("$$$CAMPAIGNTITLE$$$", data.group.campaignTitle);
             
            
             bootbox.dialog({
                //title: "Mitarbeiter hinzufügen",
                title : "",
                message: alerthtml,
                buttons: {
                   
                   abort: {
                        label: "Prozess vorzeitig beenden",
                        className: "ownbtn btngrau",
                        callback: abort
                    }, success: {
                        label: "Zurück",
                        className: "ownbtn btnblau",
                        callback: back
                    }
                }
            }
        );
        };                        
                                
        /**
         * Shows tiny modal with contact information in integration page
         * @returns {undefined}
         */          
        this.integrationHelpModal = function(contactName){
              var alerthtml = 
                      '<div style="margin-bottom : 15px;" class="innerheadline">Sie haben Fragen?</div>'+
                      '<div class="line"></div>' +
                      '<div class="text">Ihr Ansprechpartner in Ihrem Unternehmen: </div>' +
                      '<div style="font-family: roboto_bold;" class="text">$$$COMPANYCONTACT$$$</div>' +
                      '<br>' +
                      '<div class="text">Bei technischen Fragen steht Ihnen das Mailtastic-Team gerne jederzeit kostenlos zur Verfügung:</div>' +
                      '<div  class="flex-center-left martop15">' +
                      '<img style="width : 70px;height : 75px;" src="img/profile/Avatar_Peer.png" />'+
                      '<div style="margin-left : 15px;" class="schrift_blau">'+
                      '<div style="font-size: 18px; font-weight: bold;">Peer Wierzbitzki</div>'+
                      '<div><span style="font-size : 12px;" class="glyphicon glyphicon-earphone" aria-hidden="true"></span> 06182 955 70 02</div'+
                      '</div>'+
                      '</div>';
               alerthtml = alerthtml.replaceAll("$$$COMPANYCONTACT$$$",contactName);
               
               
                bootbox.dialog({
                //title: "Mitarbeiter hinzufügen",
                title : "",
                message: alerthtml,
                
                }
        );
              
       };
                                
                                
                                
        //is shown when campaign creation process in assistant is aborted to show the fulfilled steps and the steps that remain not done yet
        this.assistantAbortCampaign = function(data, abort, back){
            var alerthtml = '<div style="margin-bottom : 15px;" class="innerheadline">Wollen Sie den Prozess wirklich vorzeitig beenden?</div>';
            
            if(data.campaign.title){
                alerthtml += campaignCreatedSnippet;
            }
            
            if(data.campaign.groupSet){
                alerthtml += campaignGroupAdded;
                 //replace grouptitle
                alerthtml = alerthtml.replaceAll("$$$AMOUNTOFGROUPS$$$", data.campaign.amountOfGroupsSet);
                 alerthtml = alerthtml.replaceAll("$$$AMOUNTOFMEMBERS$$$", data.campaign.amountOfMembersGroupsSet);
                
               
               
            }else{
                 alerthtml += campaignNoGroupSnippet;
            }
            
            if(data.campaign.groupSet && data.campaign.amountOfMembersGroupsSet===0){         //sollte niemals auftreten weil sonst prozess beendet
                alerthtml += campaignNoEmspInGroupSnippet;
                
            }
            
            
             
            //users were not yet invited
             if( data.employee.amountOfImported > 0 && !data.rolloutDone){
                 alerthtml += assistantMembersNotYetInvited;
            }
            
            
            //replace grouptitle
             alerthtml = alerthtml.replaceAll("$$$CAMPAIGNTITLE$$$", data.campaign.title);
              alerthtml = alerthtml.replaceAll("$$$GROUPTITLESADDED$$$", data.campaign.groupTitlesAdded);
            
             bootbox.dialog({
                //title: "Mitarbeiter hinzufügen",
                title : "",
                message: alerthtml,
                buttons: {
                   
                   abort: {
                        label: "Prozess vorzeitig beenden",
                        className: "ownbtn btngrau",
                        callback: abort
                    }, success: {
                        label: "Zurück",
                        className: "ownbtn btnblau",
                        callback: back
                    }
                }
            }
        );
        };
        
        
        
        
        
                //wird angezeigt wenn der Gruppe erstellen Prozess vorzeitig beendet wird.
        this.assistantAbortGroup = function(data, abort, back){
            var alerthtml = '<div style="margin-bottom : 15px;" class="innerheadline">Wollen Sie den Prozess wirklich vorzeitig beenden?</div>';
            
            if(data.group.title){
                alerthtml += groupCreatedSnippet;
            }
            
            if(data.group.amountOfEmployeesAdded > 0){
                alerthtml += groupEmpsAddedSnippet;
                 //replace grouptitle
                alerthtml = alerthtml.replaceAll("$$$AMOUNTOFEMPS$$$", data.group.amountOfEmployeesAdded);
                if(data.group.amountOfEmployeesAdded > 1){
                    alerthtml = alerthtml.replaceAll("$$$MOREEMPS$$$", "n");
                }else{
                     alerthtml = alerthtml.replaceAll("$$$MOREEMPS$$$", "");
                }
                
            }else{
                 alerthtml += groupNoEmpsSnippet;
            }
            
            
              
            if(data.signature.signatureAssigned){
                  alerthtml += signatureSet;
                  alerthtml = alerthtml.replaceAll("$$$SIGNATURETITLE$$$", data.signature.signatureAssignedTitle);
                
            }else{
                  alerthtml += groupNoSigSnippet;
                  alerthtml = alerthtml.replaceAll("$$$SIGNATURETITLE$$$", data.signature.signatureAssignedTitle);
                
            }
            
            
            if(data.group.campaignAdded === true){         
                alerthtml += groupCampaignAdded;
                
            }else{
                 alerthtml += groupNoCmpSnippet;
            }
            
            
           
            
            
            if((data.employee.idsAdded &&  data.employee.idsAdded.length > 0) && !data.rolloutDone){
                 alerthtml += assistantMembersNotYetInvited;
            }
            
            
             //replace grouptitle
             alerthtml = alerthtml.replaceAll("$$$GROUPTITLE$$$", data.group.title);
             alerthtml = alerthtml.replaceAll("$$$CAMPAIGNTITLE$$$", data.campaign.title);
            
             bootbox.dialog({
                //title: "Mitarbeiter hinzufügen",
                title : "",
                message: alerthtml,
                buttons: {
                   
                   abort: {
                        label: "Prozess vorzeitig beenden",
                        className: "ownbtn btngrau",
                        callback: abort
                    }, success: {
                        label: "Zurück",
                        className: "ownbtn btnblau",
                        callback: back
                    }
                }
            }
        );
        };
        
        
        
        
                
        
        
        
                //wird angezeigt wenn der Signatur ausrollen Prozess vorzeitig beendet wird.
        this.assistantAbortSignatureRollout = function(data, abort, back){
            
              var signaturewascreated =   '<div class="infobox  infobox-success" >'+
                                        '<span class="symbol glyphicon glyphicon-check"></span>'+
                                        '<div>'+
                                        '<div class="text"> <strong>Die Signatur $$$SIGTITLE$$$ wurde erfolgreich erstellt.</strong> '+
                                        '</div>'+
                                        '</div>'+
                                        '</div>';     
                                
            
                var signaturewasupdated =     '<div class="infobox  infobox-success" >'+
                                              '<span class="symbol glyphicon glyphicon-check"></span>'+
                                              '<div>'+
                                              '<div class="text"> <strong>Die Signatur $$$SIGTITLE$$$ wurde erfolgreich gespeichert.</strong> '+
                                              '</div>'+
                                              '</div>'+
                                              '</div>';     
               
            
            
              var signatureGroupAssigned = '<div class="infobox infobox-success" >'+
                                                '<span class="symbol glyphicon glyphicon-check"></span>'+
                                                '<div>'+
                                                '<div class="text">Die Signatur <strong>$$$SIGTITLE$$$</strong> wurde $$$AMOUNTOFGROUPS$$$ Abteilungen ($$$AMOUNTOFEMPS$$$) Mitarbeiter) zugewiesen:'+
                                                '<div><strong>$$$GROUPTITLESADDED$$$</strong></div>'+
                                                '</div>'+
                                                '</div>'+
                                                '</div>';
            
          
             
            
            
            
            var signatureNoGroupAssigned =      '<div class="infobox infobox-error" >' +
                                                '<span class="symbol glyphicon glyphicon-alert"></span>' +
                                                '<div class="contentarea">'+
                                                '<div class="text"><strong>Diese Signatur ist noch nicht aktiv. Weisen Sie die Signatur jetzt einer Abteilung zu.</strong></div>'+
                                                '<div class="additionaltext">Damit die Signatur in den E-Mails Ihrer Mitarbeiter angzeigt wird, müssen Sie die Signatur den Abteilungen zuweisen, in denen sich die entsprechenden Mitarbeiter befinden.</div>'+
                                                '</div>'+
                                                '</div>';
            
            
            
            
            var signatureNoMemberInGroup =      '<div  class="infobox infobox-error" >'+
                                                '<span class="symbol glyphicon glyphicon-alert"></span>'+
                                                '<div class="contentarea">'+
                                                '<div class="text"><strong>Die zugewiesenen Abteilungen sind leer!</strong></div>'+
                                                '<div class="additionaltext">Derzeit wird die Signatur noch bei keinem Mitarbeiter angezeigt. Fügen Sie jetzt Mitarbeiter zu den entsprechenden Abteilungen hinzu.</div>'+
                                                '</div>'+
                                                '</div>';
            
            
             
             var signatureMembersNotInformed =     
                                                    '<div  class="infobox infobox-error" >'+
                                                    '<span class="symbol glyphicon glyphicon-alert"></span>'+
                                                    '<div class="contentarea">'+
                                                    '<div class="text"><strong>Nicht alle Mitarbeiter verfügen über die aktuellste Signatur!</strong></div>'+
                                                    '<div class="additionaltext">Damit der bearbeitete Stand der Signatur bei Ihren Mitarbeitern angezeigt wird, müssen diese Mailtastic in Ihren E-Mail-Client integrieren. Möchten Sie die betroffenen Mitarbeiter jetzt informieren und Ihnen eine kurze Integrationsanleitung zusenden?</div>'+
                                                    '</div>'+
                                                    '</div>';
                                            
             var activeInGroupsInEditMode =  
                                            '<div class="infobox infobox-info"  >'+
                                            '<span class="symbol glyphicon glyphicon-info-sign"></span>'+
                                            '<div>'+
                                            '<div class="text">Die Signatur <strong>$$$SIGTITLE$$$</strong> ist <strong>$$$ACTIVEINGROUPS$$$</strong> Abteilungen (<strong>$$$MEMBERSOFASSIGNEDGROUP$$$</strong> Mitarbeiter) zugewiesen</div>'+
                                            '</div>'+
                                            '</div>';
                                    
                                    
             var employeeWasAddedToGroup = 
                                            '<div ng-show="resultData.employee.amountOfAddedEmployees && resultData.employee.amountOfAddedEmployees > 0" class="infobox infobox-success">'+
                                            '<span class="symbol glyphicon glyphicon-check"></span>'+
                                            '<div>'+
                                            '<div class="text"><strong>$$$AMOUNTOFADDEDEMPLOYEES$$$ Mitarbeiter wurde(n) erfolgreich zur Abteilung $$$GROUPTITLE$$$ hinzugefügt</strong></div>'+
                                            '</div>'+
                                            '</div>';
            
            
            var alerthtml = '<div style="margin-bottom : 15px;" class="innerheadline">Wollen Sie den Prozess wirklich vorzeitig beenden?</div>';
            
            
            
            
            var membersIncluded = false;
            var groupAssigned = false;
            
            //in upodate mode the numbers are stored in differend variables. Thats not very nice - fix in future TODO
            if(data.signature.signatureCreatedOrUpdated === "created"){
                alerthtml += signaturewascreated;
                
                
                 //signature assigned to group?
                if(data.group.amountOfGroupsSet && data.group.amountOfGroupsSet > 0){
                    alerthtml += signatureGroupAssigned;
                    groupAssigned = true;
                    
                    
                     //members in assigned groups?
                     //group with members was added
                    if(data.group.amountOfMembersGroupsSet && data.group.amountOfMembersGroupsSet > 0 ){

                         membersIncluded = true;
                    }else if(data.employee.amountOfAddedEmployees > 0){
                         membersIncluded = true;
                          alerthtml +=employeeWasAddedToGroup;
                         
                    }else{
                         alerthtml += signatureNoMemberInGroup;
                    }
                    
                   
                    
                }else{
                     alerthtml += signatureNoGroupAssigned;
                }
                
               
                 
                
            }else if(data.signature.signatureCreatedOrUpdated === "updated"){   //in upodate mode the numbers are stored in differend variables. Thats not very nice - fix in future TODO
                 alerthtml += signaturewasupdated;
                  
                
                //signature assigned to groups?
                if(data.signature.activeInGroups.length === 0){
                    alerthtml += signatureNoGroupAssigned;
                 
                }else{
                    groupAssigned = true;
                   //calc members of group
                    var amountOfEmps = 0;
                    for(var i = 0; i < data.signature.activeInGroups.length ; i++){
                        amountOfEmps += data.signature.activeInGroups[i].amountOfMembers;
                    }
                    if(amountOfEmps > 0){   //members in group
                        membersIncluded = true;
                        alerthtml += activeInGroupsInEditMode;
                        alerthtml = alerthtml.replaceAll("$$$MEMBERSOFASSIGNEDGROUP$$$", amountOfEmps);
                        alerthtml = alerthtml.replaceAll("$$$ACTIVEINGROUPS$$$",data.signature.activeInGroups.length);
                    }else{//no members in group
                        alerthtml += signatureNoGroupAssigned;
                    }
                }
            }
           
             
            
             
             //are there new members and signature was not rolled out
             if(data.signature.rolledout === false){
                 alerthtml += signatureMembersNotInformed;
            };
             
             
              //replace sigtitletitle
             alerthtml = alerthtml.replaceAll("$$$SIGTITLE$$$", data.signature.title);
             alerthtml = alerthtml.replaceAll("$$$AMOUNTOFGROUPS$$$", data.group.amountOfGroupsSet);
             alerthtml = alerthtml.replaceAll("$$$AMOUNTOFEMPS$$$", data.group.amountOfMembersGroupsSet);
             alerthtml = alerthtml.replaceAll("$$$GROUPTITLESADDED$$$", data.group.groupTitlesAdded);
             alerthtml = alerthtml.replaceAll("$$$AMOUNTOFADDEDEMPLOYEES$$$", data.employee.amountOfAddedEmployees);
             alerthtml = alerthtml.replaceAll("$$$GROUPTITLE$$$", data.employee.groupTitleToWhichTheEmpsWereAdded);
            
             
           
             
            
             bootbox.dialog({
                //title: "Mitarbeiter hinzufügen",
                title : "",
                message: alerthtml,
                buttons: {
                   
                   abort: {
                        label: "Prozess vorzeitig beenden",
                        className: "ownbtn btngrau",
                        callback: abort
                    }, success: {
                        label: "Zurück",
                        className: "ownbtn btnblau",
                        callback: back
                    }
                }
            }
        );
        };
        
        
          /**
             * Eine Standard Erfolgsmeldung mit roter info box und einem Text
             * @param {type} text to show
             * @returns {undefined}
             */
         this.defaultConfirmPrompt = function(text){
             return new Promise(function(resolve, reject){
                  bootbox.confirm({
                    //title: "Mitarbeiter hinzufügen",
                    title : "",
                    message: 
                            '<div class="othermethod">'+
                            '<h3 class="modal-title">Sind sie sicher?</h3>'+
                            '<div style="margin-top:20px;" class="infobox full-width-imp  infobox-info" >'+
                            '<span class="symbol glyphicon glyphicon-question-sign"></span>'+
                            '<div>'+
                            '<div class="text">' + text+ '</div>'+
                            '</div>'+
                            '</div>',
                   callback : function(result){
                       if(result === true){
                           resolve();
                       }else{
                           reject();
                       }
                       
                   }
                });
                 
                 
             });
               
             
        };
        
        
        
         /**
             * Eine Standard Erfolgsmeldung mit roter info box und einem Text
             * @param {type} text to show
             * @returns {undefined}
             */
         this.defaultSuccessMessage = function(text){
             
             
             bootbox.dialog({
                //title: "Mitarbeiter hinzufügen",
                title : "",
                message: 
                        '<div class="othermethod">'+
                        '<h3 class="modal-title">Fertig</h3>'+
                        '<div style="margin-top:20px;" class="infobox full-width-imp  infobox-success" >'+
                        '<span class="symbol glyphicon glyphicon-check"></span>'+
                        '<div>'+
                        '<div class="text">' + text+ '</div>'+
                        '</div>'+
                        '</div>',
                buttons: {
                   
                  success: {
                        label: "Schließen",
                        className: "ownbtn btnblau employeebuybutton",
                    }
                }
            }
        );
            
        };
            /**
             * Eine Standard Fehlermeldung mit roter info box und einem Text
             * @param {type} text to show
             * @returns {undefined}
             */
         this.defaultErrorMessage = function(text){
             bootbox.dialog({
                //title: "Mitarbeiter hinzufügen",
                title : "",
                message: 
                        '<div class="othermethod">'+
                        '<h3 class="modal-title">Das hat leider nicht geklappt...</h3>'+
                        '<div style="margin-top:20px;" class="infobox full-width-imp  infobox-error" >'+
                        '<span style="min-width : 25px;" class="symbol glyphicon glyphicon-alert"></span>'+
                        '<div>'+
                        '<div class="text">' + text+ '</div>'+
                        '</div>'+
                        '</div>',
                buttons: {
                   
                success: {
                      label: "Schließen",
                      className: "ownbtn btnblau"
                  }
                }
            }
        );
            
        };
        
        
        
        /**
         * Dialog which is shown when user wants to rollout a signature in signature detail view and has no active subscription or force flag
         * @param {type} signatureTpl signatureHtml to show in dialog
         * @returns {undefined}
         */
        this.rolloutDeniedNoSubscription = function(signatureTpl, success){
            var alerthtml = '<div style="margin-bottom : 15px;" class="innerheadline">Bitte buchen Sie einen Mailtastic-Tarif.</div>';
            var alertBox =  '<div class="infobox infobox-error full-width-imp" >' +
                           ' <span class="symbol glyphicon glyphicon-info-sign"></span>' +
                           ' <div class="contentarea">' +
                            '    <div class="text"><strong>Um die einheitliche Signatur auf Ihre Mitarbeiter auszurollen, benötigen Sie einen aktiven Mailtastic-Tarif.</strong></div>' +
                            '    <div class="sigpreview previewfield martop20 marbot20">' +
                            signatureTpl +
                            '    </div>' +
                            '    <div class="additionaltext">Möchten Sie jetzt einen Mailtastic-Tarif aktivieren um Ihre neue Signatur uneingeschränkt nutzen zu können?</div>'+
                           ' </div>'+
                       ' </div>';
               
               
                bootbox.dialog({
                //title: "Mitarbeiter hinzufügen",
                title : "",
                message:  alerthtml+ alertBox,
                buttons: {
                   
                success: {
                      label: "Maitlastic Tarif jetzt buchen",
                      className: "ownbtn btnblau",
                      callback: success
                  },
                  abort: {
                        label: "Später ausrollen",
                        className: "ownbtn btngrau",
                    },
                }
            }
        );
            
            
        }
        
        
        
        
         /**
         * Shows modal with information before the admin 
         * enters the installation manuals
         * @returns {undefined}
         */          
        this.integrationAdditionalInfoForAdminModal = function(callback){
              var alerthtml = 
                      '<div style="margin-bottom : 15px;line-height : 1.5;" class="innerheadline">Wichtiger Hinweis:</div>'+
                      '<div class="line"></div>' +
                      '<div class="roboto_bold schrift_blau">Mailtastic muss einmalig in die E-Mail-Signaturen Ihrer Mitarbeiter integriert werden.</div>' +
                      '<br>' +
                       '<div >Dies kann jeder Mitarbeiter i.d.R. schnell und selbstständigt vornehmen. Wir verschicken an jeden Mitarbeiter eine kurze Anleitung.</div>' +
                    '<br>' +
                      '<div>Einmal integriert, werden neue Mailtastic-Signaturen bzw. Kampagnen-Banner bei Ihren Mitarbeitern entweder automatisch aktualisiert, oder die Mitarbeiter erhalten eine E-Mail mit Handlungsanweisungen.</div>' +
                      '<br>' + 
                      '<div class="roboto_bold martop15  flex">'+
                        '<span  style="font-size : 12px;margin-right : 10px;margin-top : 3px;" class="glyphicon glyphicon-alert schrift_rot" aria-hidden="true"></span>' +
                        '<div><span class="schrift_rot">ACHTUNG:<br> Verwaltet Ihr Unternehmen die E-Mail-Signaturen bereits zentral?</span>Kontaktieren Sie uns. Wir helfen Ihnen gerne weiter:</div>'+
                      '</div>' +
                      '<div  class="flex-center-left martop25" style="margin-bottom : 7px;">' +
                      '<img style="width : 70px;height : 75px;" src="img/profile/Avatar_Andi.png" />'+
                      '<div style="margin-left : 15px;" class="schrift_blau">'+
                      '<div style="font-size: 18px; font-weight: bold;">Andreas Schröder</div>'+
                      '<div><span style="font-size : 12px;" class="glyphicon glyphicon-earphone" aria-hidden="true"></span> 06182 955 70 00</div>'+
                      '<div><span style="font-size : 12px;" class="glyphicon glyphicon-envelope" aria-hidden="true"></span> <a href="mailto:support@mailtastic.de" class="schrift_blau_imp link">support@mailtastic.de</a></div'+
                      '</div>'+
                      '</div>';
            
               
               
                bootbox.dialog({
                //title: "Mitarbeiter hinzufügen",
                title : "",
                message: alerthtml,
                buttons: {
                   
                success: {
                      label: "<span class='roboto_medium'>Zur Anleitung</span> <span class='roboto_light'>(Diese erhalten auch Ihre Mitarbeiter)</span>",
                      className: "ownbtn btnblau",
                      callback: callback
                  },
//                  abort: {
//                        label: "Später ausrollen",
//                        className: "ownbtn btngrau",
//                    },
                }
                
                }
        );
              
       };
                      
        

    }
]);



//
////Beim Mitarbeiter löschen wird button auf basis von checkbox enabled. Da kein Angular wrapper für bootbox verwendet wird
//function enabledeletebutton(){
//   var hasClass = $(".employeedeletebutton").hasClass("disabled");
//   if(hasClass === true){
//         $(".employeedeletebutton").removeClass("disabled");
//   }else{
//       $(".employeedeletebutton").addClass("disabled");
//   }
//}