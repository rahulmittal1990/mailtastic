/*global define*/
'use strict';

angular.module('mailtasticApp.services').service('listHelperService', [
    '$location',
    '$window',
    '$state',
    '$stateParams',
    'userService',
    '$q',
    'signatureHelperService',
    function ($location, $window, $state, $stateParams, userService, $q, signatureHelperService) {
    
       /**
             * GroupList Things
             */
            
            
            var ownServiceObject = this;
            
            this.all = [];
            this.selected = [];
            
            this.selectionType = "multi";    //TODO implement configuration possibility to support single selection and multiselction. Currently only multiselection is supported
            
            
            
            //signature only stuff
            
        /**
             * Determines if Signature status is rolled out or not
             * @param {type} sigObject
             * @returns {unresolved}
             */
            this.isSignatureRolledOut = function(sigObject){
                var ret = signatureHelperService.isSignatureRolledOut(sigObject)
                return ret;
            };
            
            
           this.isSelectedAll = function () {
                return ownServiceObject.selected.length === ownServiceObject.all.length;
            };
            this.selectAll = function ($event) {
                var checkbox = $event.target;
                var action = (checkbox.checked ? 'add' : 'remove');
                for (var i = 0; i < ownServiceObject.all.length; i++) {
                    var entity = ownServiceObject.all[i];
                    ownServiceObject.updateSelected(action, entity);
                }
            };
            this.selectAllOuter = function(){
                var action = (ownServiceObject.selected.length === ownServiceObject.all.length ?  'remove' : 'add');
                for (var i = 0; i < ownServiceObject.all.length; i++) {
                    var entity = ownServiceObject.all[i];
                    ownServiceObject.updateSelected(action, entity);
                }
            };
        
            //liste selektieren
             this.updateSelected = function (action, item) {
                 
                 if(ownServiceObject.selectionType === "multi"){
                         
                        //check if item is already selected
                        var ret = jQuery.grep(ownServiceObject.selected, function (n, i) {
                            return (n.id === item.id);
                        });


                        if (action === 'add' && ret.length === 0) { //falls objekt noch nicht selected dann selektiere

                            ownServiceObject.selected.push(item);

                        }
                        if (action === 'remove' && ret.length > 0) {    //falls selected dann deselektiere
                             //objekt aus dem array entfernen    WIRD NUR BEI MULTI SELECT GEBRAUCHT
                            for (var i = 0; i < ownServiceObject.selected.length; i++) {
                                var obj = ownServiceObject.selected[i];

                                if (obj.id === item.id) {
                                    ownServiceObject.selected.splice(i, 1);
                                    break;
                                }
                            }

                        }
                 }else{
                     
                        if (action === 'add') { //falls objekt noch nicht selected dann selektiere
                               ownServiceObject.selected.length = 0;
                               ownServiceObject.selected.push(item);

                        }
                          if (action === 'remove') { //falls objekt noch nicht selected dann selektiere
                               ownServiceObject.selected.length = 0;
                               

                        }
                       
                     
                 }
                 
             

                
            };

            this.updateSelection = function ($event, item) {
                var checkbox = $event.target;
                var action = (checkbox.checked ? 'add' : 'remove');
                ownServiceObject.updateSelected(action, item);
            };


           

            this.isSelected = function (item) {


                var ret = jQuery.grep(ownServiceObject.selected, function (n, i) {
                    return (n.id === item.id);
                });

                return (ret.length !== 0);
            };

           
            
             this.rowClicked = function(item){
                 
                 
                 
                  var id = item.id;
                var mode = "add";
                for (var i = 0; i < ownServiceObject.selected.length; i++) {
                    if (id === ownServiceObject.selected[i].id) {
                        mode = "remove";
                        break;
                    }

                }
                
                  ownServiceObject.updateSelected(mode, item);
              

            };
            
             this.getSelectedClass = function (entity) {



                return ownServiceObject.isSelected(entity) ? 'selected' : '';
            };
    
    }
]);
