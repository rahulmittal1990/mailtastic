/*global define*/
'use strict';
angular.module('mailtasticApp.factories', []);
angular.module('mailtasticApp.factories').factory('StorageFactory', [
    'localStorageService',
    function (localStorageService) {

        return {
            // localstorage prefix for glade entertainment app
            prefix: 'webapp',
            keys: ['tokenType', 'accessToken', 'email', 'refreshToken', 'logged_in', 'dbname', 'userId', 'permission'],
            // keys could be a string to get a single value, but also can be an array of keys to get multiple
            get: function (keys) {
                if (typeof keys === 'string') {
                    return localStorageService.get(this.prefix + '.' + keys);
                }
                var i = 0,
                        results = {};

                for (i; i < keys.length; i = i + 1) {
                    results[keys[i]] = localStorageService.get(this.prefix + '.' + keys[i]);
                }

                return results;
            },
            // keys could be a string (to set single value), but also can be an object with key: value pairs to set multiple
            add: function (keys, value) {
                if (typeof keys === 'string') {
                    localStorageService.add(this.prefix + '.' + keys, value);
                    return value;
                }
                var i;

                for (i in keys) {
                    if (keys.hasOwnProperty(i)) {
                        if (!localStorageService.add) {
                            localStorageService.set(this.prefix + '.' + i, keys[i]);
                        } else {
                            localStorageService.add(this.prefix + '.' + i, keys[i]);
                        }
                    }
                }
                return keys;
            },
            // keys could be a string (to delete single value), but also can be an array of keys to delete multiple
            remove: function (keys) {
                if (typeof keys === 'string') {
                    return localStorageService.remove(this.prefix + '.' + keys);
                }
                var i = 0;

                for (i; i < keys.length; i = i + 1) {
                    localStorageService.remove(this.prefix + '.' + keys[i]);
                }

                return;
            },
            saveEmployeeGroupData: function (scope) {

                //ids der employees holen
                var selectedEmployeesArray = [];
                if(scope.data.selectedEmployees != null){
                     for (var i = 0; i < scope.data.selectedEmployees.length; i++) {
                    selectedEmployeesArray.push(scope.data.selectedEmployees[i].id);
                }
                }
              

                //ids der gruppen holen
                var selectedGroupArray = [];
                if(scope.data.selectedGroups != null){
                     for (var i = 0; i < scope.data.selectedGroups.length; i++) {
                    selectedGroupArray.push(scope.data.selectedGroups[i].id);
                }
                }
               


                //objekt für den speicher bauen
                var completeData = {};
                completeData.selectedEmployees = selectedEmployeesArray;
                completeData.selectedGroups = selectedGroupArray;

                //TODO other data

                window.localStorage.setItem("employeeGroupData", JSON.stringify(completeData));


            },
            loadEmployeeGroupData: function (scope) {
                var savedData = window.localStorage.getItem("employeeGroupData");
                if (savedData == null || savedData == "") {
                    return;
                } else {
                    try {
                        var object = JSON.parse(savedData);
                    } catch (e) {

                        return;
                    }


                    scope.data.selectedEmployees = [];
                    //selected employees rekonstruieren Nur objekte die noch vorhanden sind werden übernommen
                    if (object.selectedEmployees !== null && Array.isArray(object.selectedEmployees)) {

                        for (var i = 0; i < object.selectedEmployees.length; i++) {

                            var tempobject = jQuery.grep(scope.data.employees, function (n, u) {
                                return (n.id === object.selectedEmployees[i]);
                            });
                            if (tempobject.length === 1) {
                                scope.data.selectedEmployees.push(tempobject[0]);
                            }
                        }

                        if (scope.data.selectedEmployees.length === 1) {
                            scope.selected.selectedGroupForEmp = scope.data.selectedEmployees[0].currentGroup.toString();
                        } else if (scope.data.selectedEmployees.length > 1) {
                            scope.selected.selectedGroupForEmp = "selectGroupForEmp";
                        }

                    }


                     scope.data.selectedGroups = [];
                    //selected groups rekonstruieren. Nur objekte die noch vorhanden sind werden übernommen
                    if (object.selectedGroups !== null && Array.isArray(object.selectedGroups)) {

                        for (var i = 0; i < object.selectedGroups.length; i++) {    //aussortieren von gruppen die gelöscht wurden

                            var tempobject = jQuery.grep(scope.data.groups, function (n, u) {
                                return (n.id === object.selectedGroups[i]);
                            });
                            if (tempobject.length === 1) {
                                scope.data.selectedGroups.push(tempobject[0]);
                            }
                        }

                        //setzen der Kampagnen in den Selectboxen
                        if (scope.data.selectedGroups.length === 1) {
                            //die Kampagne muss gesetzt werden
                            scope.selectedCampaign.selected = {
                                title: scope.data.selectedGroups[0].campaignTitle,
                                id: scope.data.selectedGroups[0].campaignId,
                                color: scope.data.selectedGroups[0].campaignColor
                            };
                        } else if (scope.data.selectedGroups.length > 1) {
                            scope.selectedCampaign.selected = {
                                title: "Kampagne wählen..."
                             
                            };
                        }

                    }



                }
            },
            saveCampaignData: function (scope) {

                //ids der kampagnen holen
                var selectedCampaignsArray = [];
                for (var i = 0; i < scope.data.selectedCampaigns.length; i++) {
                    selectedCampaignsArray.push(scope.data.selectedCampaigns[i].id);
                }


                //objekt für den speicher bauen
                var completeData = {};
                completeData.selectedCampaigns = selectedCampaignsArray;
              

                //TODO other data

                window.localStorage.setItem("campaignData", JSON.stringify(completeData));


            },
                loadCampaignData: function (scope) {
                var savedData = window.localStorage.getItem("campaignData");
                if (savedData == null || savedData == "") {
                    return;
                } else {
                    try {
                        var object = JSON.parse(savedData);
                    } catch (e) {

                        return;
                    }


                    scope.data.selectedCampaigns = [];
                    //selected employees rekonstruieren Nur objekte die noch vorhanden sind werden übernommen
                    if (object.selectedCampaigns !== null && Array.isArray(object.selectedCampaigns)) {

                        for (var i = 0; i < object.selectedCampaigns.length; i++) {

                            var tempobject = jQuery.grep(scope.data.campaigns, function (n, u) {
                                return (n.id === object.selectedCampaigns[i]);
                            });
                            if (tempobject.length === 1) {
                                scope.data.selectedCampaigns.push(tempobject[0]);
                            }
                        }
                    }
                 }
            },
            
            /**
             * entfernt selektierte Elemente aus der Liste zB. Mitarbeiter, Gruppe, Kampagne
             * @param {type} type Gibt an welche Liste geleert werden soll: "all, group, employee, campaign"
             * @returns {undefined}
             */
            clearSelectedListData : function(type){
                if(!type){
                    return;
                }else{
                    switch(type){
                        case  "all"     : 
                            window.localStorage.setItem("campaignData", JSON.stringify([]));   
                            window.localStorage.setItem("employeeGroupData", JSON.stringify([]));
                            ;break;
                        case  "group" :  
                            var completeData = window.localStorage.getItem("employeeGroupData");
                             try{
                                  var completeData = JSON.parse(completeData);
                                  // completeData.selectedEmployees = selectedEmployeesArray;
                                  completeData.selectedGroups = []; //nur die Gruppen rücksetzen
                                  window.localStorage.setItem("employeeGroupData", JSON.stringify(completeData));
                             }catch(ex){
                                 return;
                             }
                            break;
                        case  "employee" : 
                            var completeData = window.localStorage.getItem("employeeGroupData");
                             try{
                                  var completeData = JSON.parse(completeData);
                                  completeData.selectedEmployees = [];
                                  window.localStorage.setItem("employeeGroupData", JSON.stringify(completeData));
                             }catch(ex){
                                 return;
                             }
                            break;
                        case  "campaign" :window.localStorage.setItem("campaignData", JSON.stringify([])); break;
                    }
                }
            }
            
        };
    }
]);
