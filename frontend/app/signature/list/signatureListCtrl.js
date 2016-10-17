'use strict';
angular.module('mailtasticApp.signature')



    .controller('SignatureListCtrl', [
    '$scope',  
    '$q',
    'signatureService',
    'alertService',
    'signatureHelperService',
    'listHelperService',
    function ($scope, $q,signatureService, alertService, signatureHelperService,listHelperService) {


                $scope.rightbar = {
                    activeTab: "company"
                };
                $scope.data = {
                    signatures : [],
                    selectedSigs : [],
                    filterText : ""
                };
                
                $scope.config = {
                     listheight : 400
                };
                
                $scope.list = listHelperService;
               
               $scope.predicate = 'title';
            $scope.reverse = true;
            $scope.order = function(predicate) {
              $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
              $scope.predicate = predicate;
            };
               


                $scope.initData = function(){
                    
                    listHelperService.all = $scope.data.signatures;
                    listHelperService.selected = $scope.data.selectedSigs;
                    
                    signatureService.getAll().then(function(data){
                        if(!data || data.success === false){
                            alert(Strings.errors.DATEN_NICHT_GELADEN);
                        }else{
                            $scope.data.signatures = data.data;
                        }
                    });
                    
                };
                $scope.initData();


//                /**
//                 * Delete Signature
//                 * @param {type} id
//                 * @returns {undefined}
//                 */
//                $scope.deleteSig = function(id){
//                    var sigsToDel = [id];
//                    $scope.deleteSigs
//                };
                
                
                /**
                 * Delete array of signatures
                 * @param {type} id
                 * @returns {undefined}
                 */
                $scope.deleteSigs = function (id) {
                    
                    signatureHelperService.deleteSigs(id, $scope).then(
                            function resolve(){
                                 $scope.initData();
                                
                            }, function reject(){
                                
                                 $scope.initData();
                            }
                    );
                };
                
                
            
                

            /**
             * LIst functions
             * @returns {Boolean}
             */
           $scope.isSelectedAll = function () {
                return $scope.data.selectedSigs.length === $scope.data.signatures.length;
            };
            $scope.selectAll = function ($event) {
                var checkbox = $event.target;
                var action = (checkbox.checked ? 'add' : 'remove');
                for (var i = 0; i < $scope.data.signatures.length; i++) {
                    var entity = $scope.data.signatures[i];
                    updateSelected(action, entity);
                }
            };
            $scope.selectAllOuter = function(){
                var action = ($scope.data.selectedSigs.length === $scope.data.signatures.length ?  'remove' : 'add');
                for (var i = 0; i < $scope.data.signatures.length; i++) {
                    var entity = $scope.data.signatures[i];
                    updateSelected(action, entity);
                }
            };
        
            //liste selektieren
             var updateSelected = function (action, item) {
                //check if item is already selected
                var ret = jQuery.grep($scope.data.selectedSigs, function (n, i) {
                    return (n.id === item.id);
                });


                if (action === 'add' && ret.length === 0) { //falls objekt noch nicht selected dann selektiere
                    
                    $scope.data.selectedSigs.push(item);
                    
                }
                if (action === 'remove' && ret.length > 0) {    //falls selected dann deselektiere
                     //objekt aus dem array entfernen    WIRD NUR BEI MULTI SELECT GEBRAUCHT
                    for (var i = 0; i < $scope.data.selectedSigs.length; i++) {
                        var obj = $scope.data.selectedSigs[i];

                        if (obj.id === item.id) {
                            $scope.data.selectedSigs.splice(i, 1);
                            break;
                        }
                    }

                }

                
            };

            $scope.updateSelection = function ($event, item) {
                var checkbox = $event.target;
                var action = (checkbox.checked ? 'add' : 'remove');
                updateSelected(action, item);
            };


           

            $scope.isSelected = function (item) {


                var ret = jQuery.grep($scope.data.selectedSigs, function (n, i) {
                    return (n.id === item.id);
                });

                return (ret.length !== 0);
            };

           
            
             $scope.rowClicked = function(item){
                 
                 
                 
                  var id = item.id;
                var mode = "add";
                for (var i = 0; i < $scope.data.selectedSigs.length; i++) {
                    if (id === $scope.data.selectedSigs[i].id) {
                        mode = "remove";
                        break;
                    }

                }
                
                  updateSelected(mode, item);
              

            };
            
             $scope.getSelectedClass = function (entity) {



                return $scope.isSelected(entity) ? 'selected' : '';
            };


            }]);