'use strict';

angular.module('mailtasticApp.employees')



        .controller('EmployeesListCtrl', 
[
    '$scope', 
    '$filter', 
    'employeeService', 
    'StorageFactory', 
    'signatureHelperService',
    function ($scope, $filter, employeeService, StorageFactory, signatureHelperService) {

                $scope.Math = window.Math;
              

                $scope.recalcAvatars = function () {
                    $(document).trigger("regenerateAvatars");
                };
                $scope.recalcAvatars();

                $scope.filterText = "";
                $scope.initData = function () {

                    $scope.rightSideContent.showEmployee = true;
                    $scope.rightSideContent.showGroup = false;
                    
                    
                    $scope.data.selectedEmployees = [];


                };


               

                /**
                 * 
                 * @returns {undefined}infinite scroll for employees list
                 */
                $scope.employeePagingFunction = function(){
                    $scope.employeeTotalDisplayed+=10;
                    $scope.recalcAvatars();
                    
                };

                /**
                 * Get signature status to show in list
                 * outdated, latest, no
                 * @returns {undefined}
                 */
                $scope.getSignatureStatus = function(item){
                    if(!item.currentSignature){
                        return "no";
                    }else{
                        return signatureHelperService.getHasUserLatestSignature(item, "employee", item.currentSignature);
                        
                    }
                    
                };


                //seitenleiste wird angezeigt
                $scope.customstyle.maincontentstyle = {
                };


                var orderBy = $filter('orderBy');
                var currentSortMode = "name";
                var sortDir = false;
                $scope.sortList = function (mode) {
                    sortDir = !sortDir;
                    $scope.data.employees = orderBy($scope.data.employees, mode, sortDir);
                };



                var updateSelected = function (action, item) {
                    //check if item is already selected
                    var ret = jQuery.grep($scope.data.selectedEmployees, function (n, i) {
                        return (n.id === item.id);
                    });


                    if (action === 'add' && ret.length === 0) { //falls objekt noch nicht selected dann selektiere
                        $scope.data.selectedEmployees.push(item);
                        $scope.recalcAvatars();
                    }
                    if (action === 'remove' && ret.length > 0) {    //falls selected dann deselektiere
                        //objekt aus dem array entfernen
                        for (var i = 0; i < $scope.data.selectedEmployees.length; i++) {
                            var obj = $scope.data.selectedEmployees[i];

                            if (obj.id === item.id) {
                                $scope.data.selectedEmployees.splice(i, 1);
                                break;
                            }
                        }
                    }


                    if ($scope.data.selectedEmployees.length === 1) {
                        $scope.selected.selectedGroupForEmp = $scope.data.selectedEmployees[0].currentGroup.toString();
                    } else if ($scope.data.selectedEmployees.length > 1) {
                        $scope.selected.selectedGroupForEmp = "selectGroupForEmp";
                    }



                    StorageFactory.saveEmployeeGroupData($scope);
                    //save whole data object in localstorage
//                window.localStorage.setItem("employeegroupdata", JSON.stringify($scope.data));

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


                    var ret = jQuery.grep($scope.data.selectedEmployees, function (n, i) {
                        return (n.id === item.id);
                    });

                    return (ret.length !== 0);
                };

                //something extra I couldn't resist adding :)
                $scope.isSelectedAll = function () {
                    return $scope.data.selectedEmployees.length === $scope.data.employees.length;
                };
                $scope.selectAll = function ($event) {
                    var checkbox = $event.target;
                    var action = (checkbox.checked ? 'add' : 'remove');
                    for (var i = 0; i < $scope.data.employees.length; i++) {
                        var entity = $scope.data.employees[i];
                        updateSelected(action, entity);
                    }
                };

                $scope.rowClicked = function (item) {
                    var id = item.id;
                    var mode = "add";
                    for (var i = 0; i < $scope.data.selectedEmployees.length; i++) {
                        if (id === $scope.data.selectedEmployees[i].id) {
                            mode = "remove";
                            break;
                        }

                    }
                    if (mode === "add") {
                        $scope.data.selectedEmployees = [];
                        $scope.data.selectedEmployees.push(item);
                        $scope.recalcAvatars();
                        StorageFactory.saveEmployeeGroupData($scope);
                        $scope.selected.selectedGroupForEmp = $scope.data.selectedEmployees[0].currentGroup.toString();
                    } else {
                        updateSelected(mode, item);

                    }


                };





                $scope.initData();
            }])
;

