/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


angular.module('mailtasticApp.groups')


        .controller('GroupDetailsCtrl',
                ['$scope',
                    'campaignService',
                    'groupsService',
                    '$stateParams',
                    '$q',
                    'StorageFactory',
                    '$state',
                    '$filter',
                    'browseService',
                    'employeeService',
                    '$timeout',
                    'browserService',
                    'signatureService',
                    'alertService',
                    'signatureHelperService',
                    '$sce',
                    function ($scope, campaignService, groupsService, $stateParams, $q, StorageFactory, $state, $filter, browseService, employeeService, $timeout, browserService, signatureService, alertService, signatureHelperService, $sce) {
                        $scope.Math = window.Math;

                        $scope.groupMembers = [];
                        $scope.data.campaigns = [];
                        $scope.groupId = -1;
                        $scope.statoptions = {
                            currentStatToShow: "total",
                            value: ""

                        };


                        $scope.usersWithOutdatedSignature = [];

                        $scope.signatureData = {
                            selectedEmployee: "",
                            selectedSignature: "",
                            signatureTitle : "",
                            showDummyData : "",
                            groupMembersDummy : [
                                
                                {
                                     firstname : "Max",
                                     lastname : "Mustermann",
                                     email : "max@mustermann.de"
                                    
                                }
                            ]
                        };

                        $scope.filterText = ""; //to filter employeeslist

                        $scope.rightSideContent.showEmployee = false;
                        $scope.rightSideContent.showGroup = false;

                        //seitenleiste wird angezeigt
                        $scope.customstyle.maincontentstyle = {
                            'margin-right': 0
                        };



                        /**
                         * Get amount of members who are not activated for banner.
                         * Needed to show in Group Details a button to remind all members
                         * @returns {Boolean}
                         */
                        $scope.getHowManyMembersNotActive = function () {
                            var counter = 0;
                            for (var i = 0; i < $scope.groupMembers.length; i++) {
                                var item = $scope.groupMembers[i];
                                if (item.views === 0 || !item.views) {
                                    counter++;

                                }
                            }

                            return counter;
                        };


                        /**
                         * Check which employees of group are not active and resend invitation for them
                         * @returns {undefined}
                         */
                        $scope.resendInvitationForAllWhichAreNotActive = function () {
                            
                         
                            
                                var groupId = $stateParams['groupId'] || $scope.groupId;
                    
                                if(!groupId){

                                     alertService.defaultErrorMessage(Strings.errors.DATEN_NICHT_GELADEN);
                                     return;
                               }

                               signatureService.rolloutGroup(groupId).then(
                                   function(data){
                                               if(data.success ===  true){
                                                     alertService.defaultSuccessMessage("Die Erinnerungen wurden versendet.");

                                               }else{
                                                    alertService.defaultErrorMessage(Strings.errors.DATEN_NICHT_GELADEN);

                                               }

                               });

                        };
                        
                        
                        
                        
                        /**
                         * Determines if the signature was rolled out once.
                         * If it was never rolled out there cant be a message because otherwise the user may be confused
                         * @returns {undefined}
                         */
                        $scope.signatureWasRolledOutAtLeastOnce = function(){
                            if($scope.groupMembers.length > 0 && $scope.groupMembers[0].lastRolloutOSignatureItself){
                                 return true;
                                
                            }else{
                                return false;
                            }
                           
                            
                        };
                        
                        /**
                         * Check if there are members that have not the currently rolled out signature
                         * @returns {undefined}
                         */
                        $scope.determineMemberSignatureStatus = function(){
                            //as long as data is not loaded return nothing
                            
                            var membersWhichHaveNotTheLatestSig = [];
                            if(!$scope.data.groupDetail || !$scope.data.groupDetail.activeSignature){
                                for (var i = 0; i < $scope.groupMembers.length; i++) {
                                     $scope.groupMembers[i].sigStatus = "nosignature";
                                    
                                }
                            }else{
                                for (var i = 0; i < $scope.groupMembers.length; i++) {
                                    var item = $scope.groupMembers[i];
                                    var sigStatus = signatureHelperService.getHasUserLatestSignature(item , "group", $scope.data.groupDetail.activeSignature);
                                    if(sigStatus === "outdated" || sigStatus === "rolledout" || sigStatus === "error"){
                                        membersWhichHaveNotTheLatestSig.push(item);
                                        $scope.groupMembers[i].sigStatus = "outdated";
                                    }else{
                                        $scope.groupMembers[i].sigStatus = "latest";
                                    }
                                
                                }
                            
                                
                            }
                            $scope.usersWithOutdatedSignature = membersWhichHaveNotTheLatestSig;
                            
                        };
                        

                        $scope.getGroupData = function () {
                            var deferred = $q.defer();
                            //check if employee is in selected list

                            var groupToLookat = $stateParams['groupId'];
                            if (!groupToLookat) {
                                groupToLookat = $scope.groupId;
                            } else {
                                $scope.groupId = $stateParams['groupId'];
                            }
                            var index = -1;
                            for (var i = 0; i < $scope.data.groups.length; i++) {
                                if ($scope.data.groups[i].id === groupToLookat) {
                                    index = i;
                                    break;
                                }

                            }

                            if (index === -1) {
                                //TODO
                                //daten für group laden 
                                groupsService.getOne(groupToLookat).then(function (data) {
                                    data = data[0];
                                    if (data && data.title && data.id) {
                                        $scope.signatureData.selectedSignature = data.activeSignature;
                                        $scope.data.groupDetail = data;
                                        $scope.selectedCampaign.selected = {
                                            title: $scope.data.groupDetail.campaignTitle,
                                            id: $scope.data.groupDetail.campaignId,
                                            color: $scope.data.groupDetail.campaignColor,
                                            url: $scope.data.groupDetail.campaignUrl,
                                            image: $scope.data.groupDetail.campaignImage
                                        };
                                        deferred.resolve(true);
                                    }
                                    else {
//                               alert(Strings.errors.DATEN_NICHT_GELADEN);
                                        $state.go("base.employees.grouplist", {}, {reload: true});
//                               deferred.resolve(false);
                                    }
                                });


                            } else {
                                $scope.data.groupDetail = $scope.data.groups[index];
                                $scope.selectedCampaign.selected = {
                                    title: $scope.data.groupDetail.campaignTitle,
                                    id: $scope.data.groupDetail.campaignId,
                                    color: $scope.data.groupDetail.campaignColor,
                                    url: $scope.data.groupDetail.campaignUrl,
                                    image: $scope.data.groupDetail.campaignImage
                                };
                                deferred.resolve(true);

                            }

                            return deferred.promise;
                        };


                        $scope.first = 0;
                        $scope.initData = function () {
                            $scope.first = 0;
                            //evt bereits selektiertre Mitarbeiter deselektieren

                            //StorageFactory.saveEmployeeGroupData($scope);  //änderungen an den selektierten Objekten speichern

                            $scope.data.selectedGroups = [];
                            StorageFactory.saveEmployeeGroupData($scope);


                            campaignService.get().then(function (data) {
                                $scope.data.campaigns = data;
                            });

                            //erst nachdemdie gruppe geladen wurde dürfen die member nachgeladen werden
                            $scope.getGroupData().then(function (data) {
                                
                                if (data === true) {
                                    //get groupmembers
                                    groupsService.getMembers($scope.data.groupDetail.id).then(function (data) {
                                        $scope.groupMembers = data;
                                         $scope.signatureData.showDummyData = false;      //when no members show dummy data and show own selectbox

                                        //if there are group members so set the selected employee for generating signature preview
                                        if ($scope.groupMembers.length > 0) {
                                            $scope.signatureData.selectedEmployee = data[0].id;
                                            //avatare anzeigen
                                            $scope.recalcAvatars();
                                          
                                            if($scope.data.groupDetail.activeSignature){    //only resolve if there is also an active signature
                                                 return $q.resolve();
                                            }else{
                                                  //check if every member of the group has the current signature 
                                                    $scope.determineMemberSignatureStatus();
                                                  return $q.reject("regularfinished"); 
                                            }
                                                  //return promise so that loading signature is only 

                                        }else if($scope.data.groupDetail.activeSignature){      //active signature but no group members so load dummy data from John Doe
                                            
                                            //set scope data so in the select box there is max mustermann (John Doe) selected
                                            $scope.signatureData.showDummyData = true;   //when no members show dummy data and show own selectbox
                                           
                                              return $q.resolve("dummy");   //tells the next function to use dummy data for employee
                                           
//                                            //set dummy data in signatureHelper to generate signature preview with dummy data
//                                            signatureHelperService.setDummyData().then(
//                                                function resolve(){
//                                                   $scope.signatureData.preview = signatureHelperService.generatePreviewComplete("fshkodfhsd-sdfsdfsd-sf-dfd");
//                                                },
//                                                function reject(){
//                                                    //something in the process with dummy data from john doe / max mustermann went wrong so show error message
//                                                    alertService.defaultErrorMessage(Strings.errors.DATEN_NICHT_GELADEN);
//                                                    return $q.reject("regularfinished"); 
//                                                }
//                                            );
                                           
                                        }else{      //neither active signature nor 
                                             //check if every member of the group has the current signature 
                                                    $scope.determineMemberSignatureStatus();
                                              return $q.reject("regularfinished"); 
                                        }
                                    })



                                    .then(function (dummyUserId) {
                                        if(dummyUserId && dummyUserId === "dummy"){
                                            return  signatureHelperService.getRelevantDataForSignature(dummyUserId, $scope.signatureData.selectedSignature, "rolledOut");
                                        }else{
                                            return  signatureHelperService.getRelevantDataForSignature($scope.signatureData.selectedEmployee, $scope.signatureData.selectedSignature, "rolledOut");
                                        }
                                     })

                                    .then(function (data) {
                                        $scope.signatureData.signatureTitle = data.signatureTitle;
                                        $scope.signatureData.signatureTpl = data.signatureTpl;  //show rolled out signature. When not availble take signature to edit because it was never rolled out
                                        $scope.signatureData.signatureStructureData = data.signatureData;
                                        $scope.signatureData.activeInGroups = data.activeGroups;
                                        $scope.signatureData.companyData = data.companyData;
                                        $scope.signatureData.employeeData = data.employeeData;
                                        $scope.signatureData.fields = data.fields;
                                        
                                        
                                      //check if every member of the group has the current signature 
                                                    $scope.determineMemberSignatureStatus();
                                        

                                    }
                                    )
                                    .then(//generate preview when everything is loaded
                                            function () {
                                                return $timeout(
                                                        function () {
                                                            $scope.generatePreview();
                                                        }, 1000);
                                            }
                                    )
                                    .catch(function (e) {
                                        if (e !== "regularfinished") {
                                            alertService.defaultErrorMessage(Strings.errors.DATEN_NICHT_GELADEN);
                                        }

                                    });



                                    //get all signatures from user so that can select another one 
                                    signatureService.getAll().then(function (data) {
                                        if (data.success === true) {
                                            $scope.signatureData.signatures = data.data;
                                        } else {
                                            alertService.defaultErrorMessage(Strings.errors.DATEN_NICHT_GELADEN);

                                        }
                                    });


                                    //piegraph data
                                    campaignService.getStatisticsByGroup($scope.data.groupDetail.activeCampaign).then(function (data) {
                                        $scope.calcPieData(data);

                                        $scope.enlargePieGraph();
                                        //Daten im Graph setzen
                                        $timeout(function () {
                                            $scope.pieGraph.data = $scope.pieGraph.viewData;
                                        }, 200);



                                    });
                                }else{  //error on loading data
                                      alertService.defaultErrorMessage(Strings.errors.DATEN_NICHT_GELADEN);
                                }
                            });

                        };
                        $scope.initData();
                        $scope.recalcAvatars();



                        /**
                         * Get Data and merge with signature editor and mark missing data flag (with red buttons)
                         * @returns {undefined}
                         */
                        $scope.generatePreview = function () {

                            //merge all data sources with field structure
//                    signatureHelperService.mergeDbDataWithStructure("company", $scope.signatureData.companyData, $scope.signatureData.fields);
//                    signatureHelperService.mergeDbDataWithStructure("employee", $scope.signatureData.employeeData, $scope.signatureData.fields);
//                    signatureHelperService.mergeDbDataWithStructure("signatureData", $scope.signatureData.signatureStructureData, $scope.signatureData.fields);
//                   
//                   //get html content with placeholders
//                    var content = $scope.signatureData.signatureTpl;                                     //get template
//                    
//                      //remove all marks for missing used value because it will be determined in the next step
//                    signatureHelperService.clearMarkedAsMissing($scope.signatureData.fields);   //DONT NEEED THIS HERE
//                    
//                    //get all field object in easily accesible array
//                    var fieldData = signatureHelperService.getFieldStructureAsFlatArray($scope.signatureData.fields);

                            //replace every placeholder with its value or generated html
                            
                           
                            if($scope.signatureData.selectedEmployee){
                                
                                var resultHtml = signatureHelperService.generatePreviewComplete($scope.signatureData.selectedEmployee);
                            }else if($scope.signatureData.showDummyData){
                                var resultHtml = signatureHelperService.generatePreviewComplete("dummy");
                            }else{
                                     alertService.defaultErrorMessage(Strings.errors.DATEN_NICHT_GELADEN);
                            }
                            





                            //put final contant in preview area
                            $scope.data.preview = $sce.trustAsHtml(resultHtml);



                        };


                        /**
                         * Rollout the signature to every member which has not currently the latest signature. 
                         * This can happen for example when a new user was added to group
                         * @returns {undefined}
                         */
                        $scope.rollOutSignature = function(){
                            
                            signatureService.rolloutGroup($scope.groupId).then(function(data){
                                if(data.success !== true){
                                    alertService.defaultErrorMessage(Strings.errors.DATEN_NICHT_GELADEN);
                                }else{
                                    alertService.defaultSuccessMessage("Die Erinnerung(en) wurden versendet.");
                                }
                                $scope.initData();
                                
                            });
                            
                            
                        };


                        /**
                         * fetch new employee data and generate signature preview
                         * @returns {undefined}
                         */
                        $scope.updateSelectedUser = function () {

                            signatureHelperService.getEmployeeAccountData($scope.signatureData.selectedEmployee, $scope.signatureData.fields).then(
                                    function () {

                                        $scope.generatePreview();
                                    },
                                    function (e) {

                                        $scope.initData();
                                    });

                        };




                        /**
                         * fetch new employee data and generate signature preview
                         * @returns {undefined}
                         */
                        $scope.updateSelectedSignature = function (oldValue) {



                            var text = "Möchten Sie dieser Gruppe wirklich eine anderen Signatur zuweisen?";
                            //ask if user really wants to change signature
                            bootbox.confirm({
                                size: 'small',
                                message: text,
                                callback: function (result) {
                                    if (result === true) {
                                        //change active signature of group
                                        groupsService.setSignature([$scope.data.groupDetail.id], $scope.signatureData.selectedSignature)

                                                .then(function (data) {
                                                    if (data.success === true) {
                                                        return $q.resolve();


                                                    } else {
                                                        return $q.reject();

                                                    }
                                                })
                                                .catch(function (e) {    //if something went wrong
                                                    $scope.initData();
                                                    alertService.defaultErrorMessage(Strings.errors.DATEN_NICHT_GELADEN);

                                                })
                                                .then(//get data of new signature
                                                    function(){
                                                    
                                                        browseService.reload();
                                                    }
                                                
                                                );
                                                
//                                                signatureHelperService.getSignatureData($scope.signatureData.selectedSignature, $scope.signatureData.fields).then(
//                                                function () {
//                                                    //generate preview if data was received
//                                                    $scope.generatePreview();
//                                                }
//                                                )
//                                                )
                                                
                                                
                                                



                                    } else {    //der vorherige Wert muss wieder gesetzt werden

                                        $scope.$apply(function () {
                                            $scope.signatureData.selectedSignature = oldValue;

                                        });
                                    }
                                }
                            });






                        };




                        /**
                         * Pie Graph ist not rendered correctly in chome and other browsers (not in firefox)
                         * so calc new size and enlarge it
                         * Is used after init data and must be called each time the user selects other graph data (clicks, impressions etc)
                         * @returns {undefined}
                         */
                        $scope.enlargePieGraph = function () {
                            //manuelles vergrößern des pie charts wenn es sich nicht um firefox handelt
                            var browser = browserService();
                            if (browser !== "firefox") {
                                $timeout(function () {
                                    var height = $(".piechart-col").height();
                                    $scope.pieGraph.options.height = height + "px";
                                    $scope.pieGraph.data = $scope.pieGraph.viewData;
                                }, 200);
                            }


                        }

                        $scope.groupTypeChanged = function () {
                            if ($scope.first === 0) {
                                if ($scope.statoptions.currentStatToShow == "piegraph") {
                                    //manuelles vergrößern des pie charts wenn es sich nicht um firefox handelt
                                    var browser = browserService();
                                    if (browser !== "firefox") {
                                        $timeout(function () {
                                            var height = $(".piechart-col").height();
                                            $scope.pieGraph.options.height = height + "px";
                                            $scope.pieGraph.data = $scope.pieGraph.viewData;
                                        }, 200);
                                    }
                                }
                            }
                            $scope.first = 1;






                        };


                        $scope.search = {
                            filterText: ""
                        };


                        //wenn  jemand in der liste sucht sollen auch user angezeigt werden die noch nicht in der Gruppe sind
                        $scope.searchPotUsers = function () {

                            groupsService.getPotentialMembers($scope.data.groupDetail.id, $scope.search.filterText).then(function (data) {

                                $scope.groupMembers = data;
                                $scope.recalcAvatars();

                            });

                        };


                        var orderBy = $filter('orderBy');
                        var sortDir = false;
                        $scope.sort = null;
                        $scope.sortList = function (mode) {
                            //$scope.sort = mode;
                            sortDir = !sortDir;
                            $scope.groupMembers = orderBy($scope.groupMembers, mode, sortDir);
                        };


                        //employeelist in group details
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

                            //save whole data object in localstorage
//                window.localStorage.setItem("employeegroupdata", JSON.stringify($scope.data));
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
                            var ret = jQuery.grep($scope.data.selectedEmployees, function (n, i) {
                                return (n.id === item.id);
                            });
                            return (ret.length !== 0);
                        };

                        //something extra I couldn't resist adding :)
                        $scope.isSelectedAll = function () {
                            return $scope.data.selectedEmployees.length === $scope.groupMembers.length;
                        };


                        $scope.selectAllOuter = function () {
                            var action = ($scope.data.selectedEmployees.length === $scope.groupMembers.length ? 'remove' : 'add');
                            for (var i = 0; i < $scope.groupMembers.length; i++) {
                                var entity = $scope.groupMembers[i];
                                updateSelected(action, entity);
                            }
                        };

                        $scope.selectAll = function ($event) {
                            var checkbox = $event.target;
                            var action = (checkbox.checked ? 'add' : 'remove');
                            for (var i = 0; i < $scope.groupMembers.length; i++) {
                                var entity = $scope.groupMembers[i];
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








//                var id = item.id;
//                var mode = "add";
//                for(var i = 0; i < $scope.data.selectedEmployees.length ; i++){
//                    if(id === $scope.data.selectedEmployees[i].id){
//                        mode = "remove";
//                        break;
//                    }
//                    
//                }
//                
//                  updateSelected(mode, item);
                        };




                        //piedata
                        $scope.pieGraph = {
                            data: {
//                labels: ['Sales', 'Marketing', 'DADASD'],
                                series: [100]
                            },
                            options: {
                                donut: true,
                                showLabel: false,
                                donutWidth: 30
//                 plugins: [
//                    Chartist.plugins.ctSliceDonutMargin({
//                      sliceMargin: 3
//                    })
//                  ]
                            },
                            viewData: {
                                series: []
                            },
                            clickData: {
                                series: []
                            }
                            ,
                            rateData: {
                                series: []
                            },
                            accumulatedViews: 0,
                            accumulatedClicks: 0,
                            accumulatedRate: 0,
                            progressClicks: {},
                            progressViews: {},
                            progressRate: [],
                            currentShown: 'views',
                            currentSliceToDraw: 0,
                            events: {
                                draw: function (context) {       //im draw event handler werden die farben gesetzt
                                    if (context.type === "slice") {

                                        //determine color
                                        var color = "";
                                        if ($scope.pieGraph.currentShown === "views") {
                                            if ($scope.pieGraph.progressViews.length > $scope.pieGraph.currentSliceToDraw) {
                                                color = $scope.pieGraph.progressViews[$scope.pieGraph.currentSliceToDraw].color;
                                                $scope.pieGraph.currentSliceToDraw += 1;
                                            }


                                        } else if ($scope.pieGraph.currentShown === "clicks") {
                                            if ($scope.pieGraph.progressClicks.length > $scope.pieGraph.currentSliceToDraw) {
                                                color = $scope.pieGraph.progressClicks[$scope.pieGraph.currentSliceToDraw].color;
                                                $scope.pieGraph.currentSliceToDraw += 1;
                                            }

                                        } else if ($scope.pieGraph.currentShown === "rate") {
                                            if ($scope.pieGraph.progressRate.length > $scope.pieGraph.currentSliceToDraw) {
                                                color = $scope.pieGraph.progressRate[$scope.pieGraph.currentSliceToDraw].color;
                                                $scope.pieGraph.currentSliceToDraw += 1;
                                            }

                                        }
                                        context.element.attr({
                                            //Now we set the style attribute on our bar to override the default color of the bar. By using a HSL colour we can easily set the hue of the colour dynamically while keeping the same saturation and lightness. From the context we can also get the current value of the bar. We use that value to calculate a hue between 0 and 100 degree. This will make our bars appear green when close to the maximum and red when close to zero.
                                            style: 'stroke:' + color + ";stroke-width: 30px;"
                                        });

//                          context.element.attr({
//                             //Now we set the style attribute on our bar to override the default color of the bar. By using a HSL colour we can easily set the hue of the colour dynamically while keeping the same saturation and lightness. From the context we can also get the current value of the bar. We use that value to calculate a hue between 0 and 100 degree. This will make our bars appear green when close to the maximum and red when close to zero.
//                            style: 'stroke-width: 30px'
//                          });


                                    }
                                }

                            }
                        };



                        $scope.changeStatSource = function (mode) {
                            $scope.pieGraph.currentShown = mode;
                            $scope.pieGraph.currentSliceToDraw = 0;
                            switch (mode) {
                                case 'views' :
                                    $scope.pieGraph.data = $scope.pieGraph.viewData;
                                    break;
                                case 'clicks' :
                                    $scope.pieGraph.data = $scope.pieGraph.clickData;
                                    break;
                                case 'rate' :
                                    $scope.pieGraph.data = $scope.pieGraph.rateData;
                                    break;
                            }

                           // $scope.enlargePieGraph();
                        };

                        $scope.calcPieData = function (data) {
                            $scope.pieGraph.accumulatedClicks = 0;
                            $scope.pieGraph.accumulatedViews = 0;
                            $scope.pieGraph.accumulatedRate = 0;


                            //daten für die views und die rate berechnen
                            $scope.pieGraph.viewData.series = [];
                            $scope.pieGraph.rateData.series = [];

                            colorcounter = 0;
                            var aktuelleKampagneVorhanden = false;
                            angular.forEach(data.views, function (value, key) {
                                $scope.pieGraph.accumulatedViews += value.anzahl;
                                $scope.pieGraph.viewData.series.push(value.anzahl);
                                var tempcolor = Colors.getNext().rgb;
                                value.color = tempcolor;

                                //calculate rate
                                //get clicks for this group
                                var groupname = value.title;
                                var id = value.groupId;

                                //schauen ob die aktuell betrachtete gruppe einen Anteil an der Kampagne hat. Falls nein muss diese mit 0 hinzugefügt werden
                                if (id === $scope.data.groupDetail.id) {
                                    aktuelleKampagneVorhanden = true;
                                }
                                var result = $.grep(data.clicks, function (e) {
                                    return e.groupId == id;
                                });
                                var rate = 0;
                                if (result.length === 1) {
                                    rate = (result[0].anzahl / value.anzahl) * 100;
                                    //push one value to graph data
                                    $scope.pieGraph.rateData.series.push(rate);
                                    $scope.pieGraph.accumulatedRate += rate;
                                    //push one value to progress bar data
                                    $scope.pieGraph.progressRate.push({
                                        title: value.title,
                                        anzahl: rate,
                                        color: tempcolor,
                                        amountOfMembers: value.amountOfMembers
                                    });
                                }


                            });



                            $scope.pieGraph.progressRate.sort(function (a, b) {
                                return b - a;
                            });

                            //Daten für die Progressbars
                            $scope.pieGraph.progressViews = data.views;
                            $scope.pieGraph.progressViews.sort(function (a, b) {
                                return b.anzahl - a.anzahl;
                            });
                            $scope.pieGraph.viewData.series.sort(function (a, b) {
                                return b - a;
                            });


                            //daten für die clicks berechnen
                            $scope.pieGraph.clickData.series = [];
                            colorcounter = 0;
                            angular.forEach(data.clicks, function (value, key) {
                                $scope.pieGraph.accumulatedClicks += value.anzahl;
                                $scope.pieGraph.clickData.series.push(value.anzahl);
                                value.color = Colors.getNext().rgb;
                            });
                            $scope.pieGraph.clickData.series.sort(function (a, b) { //die punkte müssen sortiert/ werden sonst wird die falsche farbe geszogen
                                return b - a;
                            });

                            //Daten für die Progressbars
                            $scope.pieGraph.progressClicks = data.clicks;
                            $scope.pieGraph.progressClicks.sort(function (a, b) {
                                return b.anzahl - a.anzahl;
                            });

                            //prüfen ob die aktuelle Gruppe in den Progressbars mit vor kommt, falls nein muss diese mit 0 hinzugefügt werden
                            if (aktuelleKampagneVorhanden === false && $scope.pieGraph.progressViews.length != 0) {
                                var objectToInsert = {
                                    title: $scope.data.groupDetail.title,
                                    anzahl: 0,
                                    amountOfMembers: $scope.data.groupDetail.amountOfMembers,
                                    groupId: $scope.data.groupDetail.id
                                };
                                $scope.pieGraph.progressClicks.push(objectToInsert);
                                $scope.pieGraph.progressViews.push(objectToInsert);
                                $scope.pieGraph.progressRate.push(objectToInsert);
                            }



                        };


                        $scope.toggleButton = {
                            value: false
                        };

                        $scope.addUserToCurrentGroup = function (id) {
                            if (!id) {
                                alert("Leider ist ein Problem aufgetreten. Bitte wenden SIe");
                            } else {
                                var users = [];
                                users.push(id);
                                employeeService.moveToGroup(users, $scope.data.groupDetail.id).then(function (data) {

                                    if (data.success === true) {
                                        alert("Der Mitarbeiter wurde erfolgreich der in diese Abteilung verschoben");
                                        browseService.reload();
                                    }

                                });
                            }
                        };


                    }]);
