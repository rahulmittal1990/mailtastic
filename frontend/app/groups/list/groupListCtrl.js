angular.module('mailtasticApp.groups')
        .controller('GroupListCtrl', 
[
    '$scope', 
    '$filter', 
    'groupsService', 
    'campaignService', 
    'StorageFactory', 
    'signatureHelperService',
    function ($scope, $filter, groupsService, campaignService, StorageFactory, signatureHelperService) {
            $scope.Math = window.Math;

            /**
             * DROPDOWN STUFF
             */

            $scope.initData = function () {

              $scope.data.selectedGroups = [];

                $scope.rightSideContent.showEmployee = false;
                $scope.rightSideContent.showGroup = true;
                 //seitenleiste wird angezeigt
              $scope.customstyle.maincontentstyle = {
               
            };


            };

            $scope.filterText = "";

           
            
            $scope.initGroupList = function (item) {
                // if(!item.name){
                // item.name = item.email;
                // }
                return item;

            };

//            $scope.showGroups = $scope.data.groups;



            // $scope.employeeData = {
            // amountOfEmployees  : $scope.data.campaigns.length,
            // activeCmapaigns : 2,
            // inactiveCmapaigns : 3
            // };

            var orderBy = $filter('orderBy');
            var currentSortMode = "title";
            var sortDir = false;
            $scope.sortList = function (mode) {
                sortDir = !sortDir;
                $scope.data.groups = orderBy($scope.data.groups, mode, sortDir);
            };



            /**
             * Get signature status of group consisting of all status of the members in the group
             * @returns {undefined}
             */
            $scope.getSignatureStatus = function(item){
                
                if(!item.activeSignature){
                    return "nosignature";
                }else  if(!item.members || item.members.length === 0){
                    return "nomembers";
                }
                else{
                    
                    for(var i = 0; i < item.members.length; i++){
                      var status = signatureHelperService.getHasUserLatestSignature(item.members[i],"group", item.members[i].currentSignature);   
                      if(status !== "latest"){
                          return "outdated";
                      }
                    }
                    
                    return "latest";
                    
                }
                
                
            };
            
            
            
            
             /**
             * Get campaign status of group consisting of all status of the members in the group
             * 
             * @returns {undefined}
             */
            $scope.getCampaignStatus = function(item){
                
                if(!item.campaignTitle){
                    return "nocampaign";
                }else  if(!item.members || item.members.length === 0){
                    return "nomembers";
                }
                else{
                    var ret = true;
                    for(var i = 0; i < item.members.length; i++){
                      if(!item.members[i].views || item.members[i].views === 0)
                      {
                          ret = false;
                      }
                    }
                    
                    return ret;
                    
                }
                
                
            };
            
            
            
            

           
            $scope.initData();




            var updateSelected = function (action, item) {
                //check if item is already selected
                var ret = jQuery.grep($scope.data.selectedGroups, function (n, i) {
                    return (n.id === item.id);
                });


                if (action === 'add' && ret.length === 0) { //falls objekt noch nicht selected dann selektiere
                    $scope.data.selectedGroups.push(item);
                    $scope.recalcAvatars();
                }
                if (action === 'remove' && ret.length > 0) {    //falls selected dann deselektiere

                    //objekt aus dem array entfernen
                    for (var i = 0; i < $scope.data.selectedGroups.length; i++) {
                        var obj = $scope.data.selectedGroups[i];

                        if (obj.id === item.id) {
                            $scope.data.selectedGroups.splice(i, 1);
                            break;
                        }
                    }

                }
                if ($scope.data.selectedGroups.length === 1) {
                    //die Kampagne muss gesetzt werden
                     $scope.selectedCampaign.selected = {
                                        title:  $scope.data.selectedGroups[0].campaignTitle,
                                        id: $scope.data.selectedGroups[0].campaignId,
                                        color: $scope.data.selectedGroups[0].campaignColor
                                    };
                } else if ($scope.data.selectedGroups.length > 1) {
                        $scope.selectedCampaign.selected = {
                                    };
                }
                
                     //save whole data object in localstorage
                StorageFactory.saveEmployeeGroupData($scope);
            };

            $scope.updateSelection = function ($event, item) {
                var checkbox = $event.target;
                var action = (checkbox.checked ? 'add' : 'remove');
                updateSelected(action, item);
            };


            $scope.getSelectedClass = function (entity) {



                return $scope.isSelected(entity) ? 'selected' : '';
            };

            $scope.isSelected = function (item) {


                var ret = jQuery.grep($scope.data.selectedGroups, function (n, i) {
                    return (n.id === item.id);
                });

                return (ret.length !== 0);
            };

            //something extra I couldn't resist adding :)
            $scope.isSelectedAll = function () {
                return $scope.data.selectedGroups.length === $scope.data.groups.length;
            };
            $scope.selectAll = function ($event) {
                var checkbox = $event.target;
                var action = (checkbox.checked ? 'add' : 'remove');
                for (var i = 0; i < $scope.data.groups.length; i++) {
                    var entity = $scope.data.groups[i];
                    updateSelected(action, entity);
                }
            };
            
            
             $scope.rowClicked = function(item){
                 
                 
                 
                  var id = item.id;
                var mode = "add";
                for (var i = 0; i < $scope.data.selectedGroups.length; i++) {
                    if (id === $scope.data.selectedGroups[i].id) {
                        mode = "remove";
                        break;
                    }

                }
                if(mode === "add"){
                      $scope.data.selectedGroups = [];
                              $scope.data.selectedGroups.push(item);
                    $scope.recalcAvatars();
                     StorageFactory.saveEmployeeGroupData($scope);
                      $scope.selectedCampaign.selected = {
                                        title:  $scope.data.selectedGroups[0].campaignTitle,
                                        id: $scope.data.selectedGroups[0].campaignId,
                                        color: $scope.data.selectedGroups[0].campaignColor
                                    };
                }else{
                     updateSelected(mode, item);
                    
                }
                 
                 
//                 
//                var id = item.id;
//                var mode = "add";
//                for(var i = 0; i < $scope.data.selectedGroups.length ; i++){
//                    if(id === $scope.data.selectedGroups[i].id){
//                        mode = "remove";
//                        break;
//                    }
//                    
//                }
//                
//                  updateSelected(mode, item);
            };

        }])
        .filter('propsFilter', function () {
            return function (items, props) {
                var out = [];

                if (angular.isArray(items)) {
                    items.forEach(function (item) {
                        var itemMatches = false;

                        var keys = Object.keys(props);
                        for (var i = 0; i < keys.length; i++) {
                            var prop = keys[i];
                            var text = props[prop].toLowerCase();
                            if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                                itemMatches = true;
                                break;
                            }
                        }

                        if (itemMatches) {
                            out.push(item);
                        }
                    });
                } else {
                    // Let the output be the input untouched
                    out = items;
                }

                return out;
            };
        });






