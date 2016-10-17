'use strict';

angular.module('mailtasticApp.campaigns', ['ui.bootstrap'])
        .controller('CampaignsCtrl', ['$scope', '$filter', 'campaignService', 'StorageFactory', 'groupsService', 'browseService', '$state', function ($scope, $filter, campaignService, StorageFactory, groupsService, browseService, $state) {
            $scope.Math = window.Math; //for calc rate

            /**
             * DROPDOWN STUFF
             */

            $scope.filterText = "";
            $scope.customstyle = {
                maincontentstyle: ""
            };

// $scope.showGroupDetails = function (id) {
//                $state.go('base.employees.groupdetails', {groupId: id});
//
//            };
            $scope.deleteGroup = function (id) {
                bootbox.confirm({
                    size: 'small', 
                    message: 'Möchten Sie diese Abteilung wirklich löschen?',
                    callback: function (result) {
                        if (result === true) {
                            groupsService.delete(id).then(function (res) {
                                if (res.success === true) {
                                    //remove employee from selected list TODO wird hier nicht benötigt?
//                                    for (var i = 0; i < $scope.data.selectedEmployees.length; i++) {
//                                        if ($scope.data.selectedEmployees[i].id === id) {
//                                            $scope.data.selectedEmployees.splice(i, 1);
//                                        }
//                                    }
                                    browseService.reload();
                                } else {
                                    alert("Abteilung konnte leider nicht gelöscht werden.");
                                }
                            });
                        }
                    }
                });
            };

            $scope.deleteGroups = function () {
                bootbox.confirm({
                    size: 'small',
                    message: 'Möchten Sie diese Abteilungen wirklich löschen? Alle zugewiesenen Mitarbeiter werden der Standard Abteilung zugewiesen.',
                    callback: function (result) {
                        if (result === true) {

                            //get all ids
                            var ids = [];
                            for (var i = 0; i < $scope.data.selectedGroups.length; i++) {
                                ids.push($scope.data.selectedGroups[i].id);

                            }


                            groupsService.deleteMany(ids).then(function (res) {
                                if (res.success === true) {
                                    //remove employee from selected list
                                    browseService.reload();
                                } else {
                                    alert("Die Abteilungen konnten leider nicht gelöscht werden. Bitte versuchen Sie es erneut.");
                                }
                            });
                        }
                    }
                });
            };

            $scope.data = {
                campaignsToShow: [], //werden in der liste angezeigt
                campaigns: [], //alle vorhandenen
                activeCampaigns: [],
                inactiveCampaigns: [],
                selectedCampaigns: [],
                selectedGroups: [],
                groups: [],
                selectedGroupForCampaign: "All"
            };


            /**
             * remove assignment of campaign from group
             * @returns {undefined}
             */
            $scope.removeCampaignOfGroups = function () {

                bootbox.confirm({
                    size: 'small',
                    message: 'Möchten Sie Zuordnung der Kampagne zu diesen Abteilungen wirklich entfernen?',
                    callback: function (result) {
                        if (result === true) {
                            var groupArray = [];
                            for (var i = 0; i < $scope.data.selectedGroups.length; i++) {
                                groupArray.push($scope.data.selectedGroups[i].id);
                            }
                            if (groupArray.length > 0) {
                                groupsService.setCampaign(groupArray, null).then(function (data) {
                                    if (data.success === true) {
                                        alert(Strings.infos.CAMPAIGN_GROUPS_REMOVED);
                                        browseService.reload();
                                    } else {
                                        //TODO
                                        alert(Strings.errors.TECHNISCHER_FEHLER);

                                    }
                                });
                            }
                        }
                    }
                });








            };
            $scope.removeCampaignOfGroup = function (groupId) {

                bootbox.confirm({
                    size: 'small',
                    message: 'Möchten Sie Zuordnung der Kampagne zu dieser Abteilungen wirklich entfernen?',
                    callback: function (result) {
                        if (result === true) {
                            var groupArray = [];
                            groupArray.push(groupId);
                            groupsService.setCampaign(groupArray, null).then(function (data) {
                                if (data.success === true) {
                                    alert(Strings.infos.CAMPAIGN_GROUP_REMOVED);
                                    browseService.reload();
                                } else {
                                    //TODO
                                    alert(Strings.errors.TECHNISCHER_FEHLER);

                                }
                            });
                        }
                    }
                });
            };

            //gibt die ersten x elemente im array. nützlich bei repeat
            $scope.getTimes = function (values, n) {

                return values.slice(0, n);


            };


            $scope.sidemenutoggled = false;
            $scope.togglesidemenu = function () {
                var windowwith = $(window).width();
                if (windowwith < 991) {
                    $scope.sidemenutoggled = !$scope.sidemenutoggled;

                }

            };
            $scope.showGroupDetails = function (id) {
                $state.go('base.employees.groupdetails', {groupId: id});

            };


            $scope.showCampaignDetails = function (id) {
                $state.go('base.campaigns.campaigndetail', {campaignId: id});

            };

            $scope.addCampaignToGroup = function (groupId, campaignId) {


                if (groupId === "All") {
                    alert("Bitte wählen Sie zuerst eine Abteilung aus.");
                    return;
                }

                if (campaignId === null) {
                    alert(Strings.errors.TECHNISCHER_FEHLER);
                    return;
                }



                bootbox.confirm({
                    size: 'small',
                    message: 'Möchten Sie der Abteilung wirklich die Kampagne zuweisen?',
                    callback: function (result) {
                        if (result === true) {

                            var groupsarray = [];
                            groupsarray.push(groupId);
                            groupsService.setCampaign(groupsarray, campaignId).then(function (data) {
                                if (data.success === true) {
                                    alert(Strings.infos.CAMPAIGN_GROUP_ADDED);
                                    browseService.reload();
                                } else {
                                    //TODO
                                    alert(Strings.errors.TECHNISCHER_FEHLER);
                                    browseService.reload();
                                }
                            });
                        }
                    }
                });
            };

            /**
             * Wenn für die gruppe die Kampagne getauscht wird in der rechten sidebar
             */
            $scope.campaignChangedSidebar = function (oldValue) {

                var groupids = [];
                for (var i = 0; i < $scope.data.selectedGroups.length; i++) {
                    groupids.push($scope.data.selectedGroups[i].id);
                }
                if (groupids.length === 0) {
                    return;
                }

                var newcampaign = $scope.selectedCampaign.selected.id;
                if (newcampaign === oldValue) {
                    return false;
                } else {
                    $scope.handleCampaignChanged(oldValue, newcampaign, groupids);
                }
            };

            $scope.handleCampaignChanged = function (oldValue, campaignId, groupids) {
                bootbox.confirm({
                    size: 'small',
                    message: 'Möchten Sie die Kampagne wirklich ändern?',
                    callback: function (result) {
                        if (result === true) {
                            //create ids


                            groupsService.setCampaign(groupids, campaignId).then(function (data) {
                                if (data.success === true) {
                                    alert("Kampagne wurde erfolgreich zugewiesen.");
                                    $scope.reInitGroups();      //only data in detail view should be reloaded
                                } else {
                                    alert("Kampagne konnte nicht geändert werden. Bitte wenden Sie sich an den Support falls weiterhin Probleme auftreten sollten.");
                                    $scope.reInitGroups();     //only data in detail view should be reloaded
                                }
                            });
                        } else {    //der vorherige Wert muss wieder gesetzt werden
                            $scope.$apply(function () {
                                var found = false;
                                for (var i = 0; i < $scope.data.campaigns.length; i++) {
                                    if ($scope.data.campaigns[i].id == oldValue) {
//                                        $scope.$apply(function(){
                                        $scope.selectedCampaign.selected = $scope.data.campaigns[i];
                                        found = true;
                                        break;
//                                        });
                                    }

                                }
                                if (found === false) {    //wenn gruppe keine Kampagne hatte dann wird wieder leer selected
                                    $scope.selectedCampaign.selected = {};
                                }
                            });
                        }
                    }
                });

            };

            $scope.reInitGroups = function () {
//                groupsService.get().then(function (data) {
//
//
//                    $scope.data.groups = data;
//
//
//                    for (var i = 0; i < $scope.data.selectedGroups.length; i++) {
//
//                        //die selektierten objekte werden ausgetauscht mit den aktualisierten
//                        var ret = jQuery.grep($scope.data.groups, function (n, u) {
//                            return (n.id === $scope.data.selectedGroups[i].id);
//                        });
//                        if (ret.length === 0) {
//                            $scope.data.selectedGroups.splice(i, 1);     //objekt entfernen denn es wurde offenbar gelöscht
//                        } else {
//                            //selected group aktualisieren
//                            $scope.data.selectedGroups[i] = ret[0];
//
//                            $scope.selectedCampaign.selected = {
//                                title: ret[0].campaignTitle,
//                                id: ret[0].campaignId,
//                                color: ret[0].campaignColor,
//                                url: ret[0].campaignUrl,
//                                image: ret[0].campaignImage
//                            };
//
//
//                            //das aktuelle object auf der detailseite aktualisieren
//                            $scope.data.groupDetail = ret[0];
//                        }
//                    }
//
//
//                });

                $scope.data.selectedGroups = [];
                StorageFactory.saveEmployeeGroupData($scope);
                browseService.reload();
            };


            /**
             * Für den select der die Gruppen anzeigt denen noch die aktuell betrachtete kampagne zugewiesen werden 
             * @param {type} activeGroups
             * @returns {Array}
             */
            $scope.unusedGroups = function (activeGroups) {
                var unusedGroups = [];
                if (activeGroups == null) {
                    return unusedGroups;
                }

                for (var i = 0; i < $scope.data.groups.length; i++) {


                    var ret = jQuery.grep(activeGroups, function (n, u) {
                        return (n.id === $scope.data.groups[i].id);
                    });

                    if (ret.length === 0) {
                        unusedGroups.push($scope.data.groups[i]);
                    }

                }

                return unusedGroups;


            };


            $scope.initData = function () {
                campaignService.get().then(function (campaigns) {



                    //sort data on base of date and put without campaign to last

//                    //sort on active campaign or not
//                    var withoutCampaign = [];
//                    var withCampaign = [];
//                    for(var i = 0; i < data.length ; i++){
//                        if(!data[i].campaignId){
//                            withoutCampaign.push(data[i]);
//                        }else{
//                            withCampaign.push(data[i]);
//                        }
//                    }



                    $scope.data.activeCampaigns = [];
                    $scope.data.inactiveCampaigns = [];
                    for (var i = 0; i < campaigns.length; i++) {
                        if (campaigns[i].activegroups.length === 0) {
                            $scope.data.inactiveCampaigns.push(campaigns[i]);
                        } else {
                            $scope.data.activeCampaigns.push(campaigns[i]);
                        }
                    }
                    $scope.data.campaigns = $scope.data.activeCampaigns;
                    $scope.data.campaigns = $scope.data.campaigns.concat($scope.data.inactiveCampaigns);
                    $scope.data.campaignsToShow = $scope.data.campaigns;

                    //groups are loaded to determine which groups can be assigned to currently selected campaign
                    groupsService.get().then(function (data) {
                        $scope.data.groups = data;
                        StorageFactory.loadCampaignData($scope);
                    });



                    //test if selected campaigns are still available
//                        for(var i = 0 ; i < $scope.data.selectedCampaigns.length ; i++){
//                            var ret = jQuery.grep($scope.data.allCampaigns, function( n, u ) {
//                                return ( n.id === $scope.data.selectedCampaigns[i].id );
//                              });
//                            if()
//                        }          
                });

            };

            $scope.sortCampaigns = function (data) {

            };

//            $scope.showCampaigns = $scope.data.campaigns;


            $scope.campaigndata = {
                amountOfCampaigns: $scope.data.campaigns.length,
                activeCmapaigns: 2,
                inactiveCmapaigns: 3
            };

            var orderBy = $filter('orderBy');
            var currentSortMode = "title";
            var sortDir = false;
            $scope.sortList = function (mode) {
                sortDir = !sortDir;
                $scope.data.campaignsToShow = orderBy($scope.data.campaignsToShow, mode, sortDir);
            };
//            $scope.filterList = function (mode) {
//                $scope.showCampaigns = $filter('status')($scope.data.showCampaigns, mode);
//            };

            $scope.deleteCampaign = function (id) {
                bootbox.confirm({
                    size: 'small',
                    message: 'Möchten Sie diese Kampagne wirklich löschen?',
                    callback: function (result) {
                        if (result === true) {
                            campaignService.delete(id).then(function (res) {
                                if (res.message === true) {
                                    browseService.reload();
                                }
                            });
                        }
                    }
                });
            };

            $scope.deleteCampaigns = function (id) {
                bootbox.confirm({
                    size: 'small',
                    message: 'Möchten Sie diese Kampagnen wirklich löschen?',
                    callback: function (result) {
                        if (result === true) {
                            var campIds = [];
                            for (var i = 0; i < $scope.data.selectedCampaigns.length; i++) {
                                campIds.push($scope.data.selectedCampaigns[i].id);
                            }

                            campaignService.deleteMany(campIds).then(function (res) {
                                if (res.message === true) {
                                    browseService.reload();
                                }
                            });
                        }
                    }
                });
            };



            $scope.rightSideContent = {
                showGroup: false,
                showCampaign: true

            };
            $scope.selectedCampaign = {
                selected: {}
            };

            $scope.initData();

        }])


        .controller('CampaignListCtrl', ['$scope', '$stateParams', 'StorageFactory', function ($scope, $stateParams, StorageFactory) {

            //in diesem screen wird rechts keine seitenleiste gezeigt
            $scope.customstyle.maincontentstyle = {};

            $scope.rightSideContent.showGroup = false;
            $scope.rightSideContent.showCampaign = true;



            var updateSelected = function (action, item) {
                //check if item is already selected
                var ret = jQuery.grep($scope.data.selectedCampaigns, function (n, i) {
                    return (n.id === item.id);
                });


                if (action === 'add' && ret.length === 0) { //falls objekt noch nicht selected dann selektiere
//                $scope.data.selectedCampaigns = [];
//                    $scope.data.selectedCampaigns.splice(0, $scope.data.selectedCampaigns.length)
                    $scope.data.selectedCampaigns.push(item);

                }
                if (action === 'remove' && ret.length > 0) {    //falls selected dann deselektiere
                    // $scope.data.selectedCampaigns = [];
//                    $scope.data.selectedCampaigns.splice(0, $scope.data.selectedCampaigns.length)

                    //objekt aus dem array entfernen
                    for (var i = 0; i < $scope.data.selectedCampaigns.length; i++) {
                        var obj = $scope.data.selectedCampaigns[i];

                        if (obj.id === item.id) {
                            $scope.data.selectedCampaigns.splice(i, 1);
                            break;
                        }
                    }

                }


//             if( $scope.data.selectedCampaigns.length === 1){
//                 $scope.selected.selectedGroupForEmp = $scope.data.selectedCampaigns[0].groupId.toString();
//             }else  if( $scope.data.selectedCampaigns.length > 1){
//                 $scope.selected.selectedGroupForEmp = "selectGroupForEmp";
//             }
                StorageFactory.saveCampaignData($scope);
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


                var ret = jQuery.grep($scope.data.selectedCampaigns, function (n, i) {
                    return (n.id === item.id);
                });

                return (ret.length !== 0);
            };

           
            $scope.isSelectedAll = function () {
                return $scope.data.selectedCampaigns.length === $scope.data.campaigns.length;
            };
            $scope.selectAll = function ($event) {
                var checkbox = $event.target;
                var action = (checkbox.checked ? 'add' : 'remove');
                for (var i = 0; i < $scope.data.campaignsToShow.length; i++) {
                    var entity = $scope.data.campaignsToShow[i];
                    updateSelected(action, entity);
                }
            };
            $scope.rowClicked = function (item) {
                var id = item.id;
                var mode = "add";
                for (var i = 0; i < $scope.data.selectedCampaigns.length; i++) {
                    if (id === $scope.data.selectedCampaigns[i].id) {
                        mode = "remove";
                        break;
                    }

                }
                if (mode === "add") {
                    $scope.data.selectedCampaigns = [];
                    $scope.data.selectedCampaigns.push(item);


                } else {
                    updateSelected(mode, item);

                }
                updateSelected(mode, item);
            };



            $scope.initData = function () {
                var mode = $stateParams['mode'];
                switch (mode) {
                    case 'all' :
                        $scope.data.campaignsToShow = $scope.data.campaigns;
                        break;
                    case 'active' :
                        $scope.data.campaignsToShow = $scope.data.activeCampaigns;
                        break;
                    case 'inactive' :
                        $scope.data.campaignsToShow = $scope.data.inactiveCampaigns;
                        break;
//                  default : $scope.data.campaigns = $scope.data.allCampaigns; break;  //falls alles nicht passt dann einfach alle anzeigen
                }

            };

            $scope.initData();

        }])

        .controller('CampaignDetailsCtrl', ['$scope', '$stateParams', 'campaignService', '$q', 'groupsService', '$state', 'StorageFactory', 'browserService', '$timeout', function ($scope, $stateParams, campaignService, $q, groupsService, $state, StorageFactory, browserService, $timeout) {

            $scope.rightSideContent.showGroup = false;
            $scope.rightSideContent.showCampaign = false;

            $scope.campaignGroups = [];


            $scope.checkIfGroupIsAttached = function (id) {
                var array = jQuery.grep($scope.campaignDetailData.activegroups, function (n, i) {
                    return (n.id === id);
                });
                if (array.length === 0) {
                    return false;
                } else {
                    return true;
                }

            };

            //in diesem screen wird rechts keine seitenleiste gezeigt
            $scope.customstyle.maincontentstyle = {
                'margin-right': 0
            };

            $scope.search = {
                filterText: ""
            };


            //wenn  jemand in der liste sucht sollen auch user angezeigt werden die noch nicht in der Gruppe sind
            $scope.searchPotGroups = function () {

                groupsService.search($scope.search.filterText).then(function (data) {

                    $scope.campaignGroups = data;


                });

            };


            function initCampaign() {

                var deferred = $q.defer();

                var campaignId = $stateParams['campaignId'];
                if (!campaignId) {
//                    deferred.resolve(false);
                    $state.go("base.campaigns.campaignlist", {}, {reload: true});
//                    alert("Beim Laden der Daten ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut");
                } else {
                    //check if object is already loaded



                    var found = false;
                    for (var i = 0; i < $scope.data.selectedCampaigns.length; i++) {//look at selected campaigns

                        if ($scope.data.selectedCampaigns[i].id === campaignId) {
                            //found
                            $scope.campaignDetailData = $scope.data.selectedCampaigns[i];
                            $scope.campaignGroups = $scope.campaignDetailData.activegroups;
                            found = true;
                            deferred.resolve(true);
                            break;
                        }
                    }
                    if (found === false) {//look at all campaigns
                        for (var i = 0; i < $scope.data.campaigns.length; i++) {
                            if ($scope.data.campaigns[i].id === campaignId) {
                                //found
                                $scope.campaignDetailData = $scope.data.campaigns[i];
                                $scope.campaignGroups = $scope.campaignDetailData.activegroups;
                                found = true;
                                deferred.resolve(true);
                                break;
                            }

                        }
                    }

                    if (found === false) {      //get data froms server
                        campaignService.getOne(campaignId).then(function (data) {

                            if (!data || data.success === false) {
                                //TODO

//                               alert(Strings.errors.DATEN_NICHT_GELADEN);
                                $state.go("base.campaigns.campaignlist", {}, {reload: true});
//                               deferred.resolve(false);

                            } else {
                                $scope.campaignDetailData = data;
                                $scope.campaignGroups = $scope.campaignDetailData.activegroups;
                                found = true;  //dont need this
                                deferred.resolve(true);
                            }

                        });
                    }

                }
                return deferred.promise;
            }

            $scope.initData = function () {

                //wenn firefox genutzt wird dann muss die width vom line graph dynamisch gesetzt werden TODO
                var browser = browserService();
                if (browser === "firefox") {
                    $timeout(function () {
                        var width = $(".linepanelbody").width();
                        $scope.lineGraph.options.width = width + "px";
                    }, 1000);
                }

                initCampaign().then(function (success) {

                    if (success === true) {
                        var campaignId = $stateParams['campaignId'];
                        //Get Statistic for last 30 days
                        var begindate = moment().subtract(30, 'days');
                        var enddate = moment();

                        var beginDateAsString = begindate.format("YYYY-MM-DD");
                        var endDateAsString = enddate.format("YYYY-MM-DD");



                        campaignService.getStatisticsSingle(beginDateAsString, endDateAsString, campaignId).then(function (data) {
                            $scope.calcGraphData(data, begindate, enddate);             //daten berechnen
                            $scope.lineGraph.dataToShow.series = $scope.lineGraph.viewData;    //viewData als Start setzen
                            $scope.selectboxvalues.values = $scope.lineGraph.viewData;       //für das select in dem einzelne Kampagnen ausgewählt werden können




                        });

                        setTimeout(function () {  //DATE RANGE INIT
                            var end = moment().format("DD.MM.YYYY");
                            var begin = moment().subtract(30, 'days').format("DD.MM.YYYY");

                            $('#dash-daterange-picker').daterangepicker({
                                startDate: begindate,
                                endDate: enddate,
                                opens: "left",
                                "locale": {
                                    "format": "DD.MM.YYYY",
                                    "separator": " - ",
                                    "applyLabel": "Übernehmen",
                                    "cancelLabel": "Abbrechen",
                                    "fromLabel": "Von",
                                    "toLabel": "Bis",
                                    "customRangeLabel": "Custom",
                                    "daysOfWeek": [
                                        "So",
                                        "Mo",
                                        "Di",
                                        "Mi",
                                        "Do",
                                        "Fr",
                                        "Sa"
                                    ],
                                    "monthNames": [
                                        "Januar",
                                        "Februar",
                                        "März",
                                        "April",
                                        "Mai",
                                        "Juni",
                                        "Juli",
                                        "August",
                                        "September",
                                        "Oktober",
                                        "November",
                                        "Dezember"
                                    ],
                                    "firstDay": 1
                                },
                            });
                            $('#dash-daterange-picker').on('apply.daterangepicker', $scope.dateRangeChanged);
                        }, 500);


                    }

                });


//                  
//                   campaignService.getOneStatistic(campaignId).then(function(data){
//                         
//                         $scope.initLineGraph(data)
//                         
//                   });


//                   campaignService.getGroupStatistic(campaignId).then(function(data){
//                         
//                         $scope.initPieGraph(data)
//                         
//                   });
//                  

            };







            $scope.Math = window.Math;
            $scope.campaignList = {
                data: {}
            };



            //$scope.data.campaigns = [];

            $scope.lineGraph = {
                options: {
                    fullWidth: true,
                    showPoint: true,
                    chartPadding: {
                        top: 15,
                        right: 35,
                        bottom: 1,
                        left: 10,
                    },
                    height: '270px',
                    lineSmooth: Chartist.Interpolation.simple({
                        divisor: 2
                    }),
                    axisX: {
                        showGrid: true,
                        // The offset of the labels to the chart area
                        offset: 30,
//                      type : Chartist.AutoScaleAxis,
//                        high: 100,
                        // If low is specified then the axis will display values explicitly down to this value and the computed minimum from the data is ignored
//                        low: 0,
                        // This option will be used when finding the right scale division settings. The amount of ticks on the scale will be determined so that as many ticks as possible will be displayed, while not violating this minimum required space (in pixel).
                        scaleMinSpace: 20,
                        // Can be set to true or false. If set to true, the scale will be generated with whole numbers only.
                        onlyInteger: true,
                        // The reference value can be used to make sure that this value will always be on the chart. This is especially useful on bipolar charts where the bipolar center always needs to be part of the chart.
//                        referenceValue: 5,
                        labelInterpolationFnc: function skipLabels(value, index) {
                            return index % $scope.interpolationValue === 0 ? value : null;
                        }
                    },
                    axisY: {
                        showGrid: true,
                        onlyInteger: true
                    }

                },
                clickData: [],
                dates : [],
                viewData: [],
                rateData: [],
                totalClicks: 0,
                totalViews: 0,
                dataToShow: {
                    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                    series: [
                        [0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0]
                    ]
                },
                currentLineToDraw: 0,
                events: {
                    draw: function (context) {       //im draw event handler werden die farben gesetzt
                        if (context.type === "line") {

                            //determine color
                            var color = "";

                            if ($scope.lineGraph.dataToShow.series.length > $scope.lineGraph.currentLineToDraw) {
                                color = $scope.lineGraph.dataToShow.series[$scope.lineGraph.currentLineToDraw].color;
                                $scope.lineGraph.currentLineToDraw += 1;
                            }
                            context.element.attr({
                                //Now we set the style attribute on our bar to override the default color of the bar. By using a HSL colour we can easily set the hue of the colour dynamically while keeping the same saturation and lightness. From the context we can also get the current value of the bar. We use that value to calculate a hue between 0 and 100 degree. This will make our bars appear green when close to the maximum and red when close to zero.
                                style: 'stroke:' + color
                            });


                        } else if (context.type === "point") {
                            context.element.attr({
                                //Now we set the style attribute on our bar to override the default color of the bar. By using a HSL colour we can easily set the hue of the colour dynamically while keeping the same saturation and lightness. From the context we can also get the current value of the bar. We use that value to calculate a hue between 0 and 100 degree. This will make our bars appear green when close to the maximum and red when close to zero.
                                style: 'stroke:' + context.series.color
                            });


                        }
                    }

                }
            };

            //damit die labels auf der x Achse ausgedünnt werden
            $scope.interpolationValue = 1;


//            $scope.reload = function(){
//                $scope.dateRangeChanged( $('#dash-daterange-picker'), null);
//            };


            $scope.dateRangeChanged = function (ev, picker) {
//                alert($('#dash-daterange-picker').val());

                campaignService.getStatisticsSingle(picker.startDate.format("YYYY-MM-DD"), picker.endDate.format("YYYY-MM-DD"), $scope.campaignDetailData.id).then(function (data) {
                    $scope.calcGraphData(data, picker.startDate, picker.endDate);             //daten berechnen
                    $scope.lineGraph.dataToShow.series = $scope.lineGraph.viewData;    //viewData als Start setzen
                    $scope.selectboxvalues.values = $scope.lineGraph.viewData;       //für das select in dem einzelne Kampagnen ausgewählt werden können
                });
                
                
                Intercom('trackEvent', 'Changed date range of line graph in campaigndetails');

            };




            $scope.accumulatedValues = {
                allViews: 0,
                allClicks: 0
            };

            var minLabels = 8;
            $scope.calcGraphData = function (data, begin, end) {
                $scope.lineGraph.currentLineToDraw = 0;             //graph fängt wieder bei 0 an zu zeichnen
                var amountOfDays = end.diff(begin, 'days');
                amountOfDays+=1;
                $scope.lineGraph.totalClicks = 0;
                $scope.lineGraph.totalViews = 0;
                //create labels
                var amountOfLabels = 10;
                //check if display is XS than take only 5 labels
                var width = $(window).width();
                if (width < 600) {
                    amountOfLabels = 5;
                }
                var labelArray = [];

                if (amountOfDays < 11) {  //wenn weniger als 11 labels müssen diese nicht ausgedünnt werden
                    $scope.interpolationValue = 1;
                } else {
                    //modulo wird gebraucht um zu wissen das jeweils wie vielte label gezeigt werden soll
                    var modulo = Math.round(amountOfDays / amountOfLabels);
                    $scope.interpolationValue = modulo;
                }

                //label erzeugen    
                var tempend = end;
                var dateArray = [];
                for (var i = amountOfDays - 1; i >= 0; i--) {    //gehe ab start datum jewils einen tag nach oben bis zum end datum und erstelle jeweils pro tag ein label
                    var newLabel = moment(end).subtract(i, 'days').format("DD.MMM");
                    labelArray.push(newLabel);
                    dateArray.push(moment(end).subtract(i, 'days').format("DD.MM.YYYY"));
                }
                 if(labelArray.length > 1){
                       $scope.lineGraph.dataToShow.labels = labelArray;
                       $scope.lineGraph.dates = dateArray;
                }else{
                     $scope.lineGraph.dataToShow.labels = [];
                }
              

                //create data for series
                var resultSeriesArray = createSeriesDataForGraph(labelArray, data.views, "views");
                $scope.lineGraph.viewData = resultSeriesArray;                 //Die Daten enthalten die Series für die Views daher werden sie beim Graph gespeichert


                var resultSeriesArray = createSeriesDataForGraph(labelArray, data.clicks, "clicks");
                $scope.lineGraph.clickData = resultSeriesArray;


                $scope.lineGraph.rateData = calcRateDataForGraph();        //aus views und clicks wird die rate berechnet


                //falls es in diesem Zeitraum daten hätte geben können aber keine da sind muss 0 angezeigt werden

                if (end.isAfter(moment($scope.campaignDetailData.createdAt))) {
                    //es hätte daten geben können
                    //create zero array
                    var zeroarray = [];
                    for (var i = 0; i < amountOfDays; i++) {
                        zeroarray.push(0);
                    }
                    if ($scope.lineGraph.viewData.length === 0) {
                        $scope.lineGraph.viewData.push({
                            title: $scope.campaignDetailData.title,
                            name : $scope.campaignDetailData.title,
                            id: $scope.campaignDetailData.id,
                            color: $scope.campaignDetailData.color,
                            meta : {
                                color: $scope.campaignDetailData.color
                            },
                            data: zeroarray
                        });
                    }
                    if ($scope.lineGraph.clickData.length === 0) {
                        $scope.lineGraph.clickData.push({
                            title: $scope.campaignDetailData.title,
                            name : $scope.campaignDetailData.title,
                            id: $scope.campaignDetailData.id,
                            color: $scope.campaignDetailData.color,
                            meta : {
                                color: $scope.campaignDetailData.color
                            },
                            data: zeroarray
                        });
                    }
                    if ($scope.lineGraph.rateData.length === 0) {
                        $scope.lineGraph.rateData.push({
                            title: $scope.campaignDetailData.title,
                            name: $scope.campaignDetailData.title,
                            id: $scope.campaignDetailData.id,
                            color: $scope.campaignDetailData.color,
                            meta : {
                                color: $scope.campaignDetailData.color
                            },
                            data: zeroarray
                        });
                    }
                }



                       
                //daten sortieren, damit tooltips die passenden Daten anzeigen können
                
                $scope.lineGraph.rateData.sort(function(a, b){return a.id-b.id});
                $scope.lineGraph.clickData.sort(function(a, b){return a.id-b.id});
                $scope.lineGraph.viewData.sort(function(a, b){return a.id-b.id});

                    //meta daten für die Tooltips
                    addMetaDataToPoints();
            };



                        /**
             * 
             * @returns {undefined}Für die tooltips wird jeder punkt um meta daten ergänzt
             */
            function addMetaDataToPoints(){
                 //set meta data for each point for tooltip
                //jeder punkt wird durch punkt wert und meta daten ersetzt
               var finalViewDatapoints = [];
                        var finalClickDatapoints = [];
                        var finalRateDatapoints = [];
                for(var i = 0; i <  $scope.lineGraph.viewData.length ; i++){
//                    var currentSeriesView = $scope.lineGraph.viewData[i];
//                    var currentSeriesClick = $scope.lineGraph.clickData[i];
//                    var currentSeriesRate = $scope.lineGraph.rateData[i];
//                    
//                    currentSeriesView.data = [];
//                    currentSeriesClick.data = [];
//                    currentSeriesRate.data = [];


                      
                    for(var u = 0; u < $scope.lineGraph.viewData[i].data.length ;u++){
                        
                        //views
                        finalViewDatapoints.push({
                            value : $scope.lineGraph.viewData[i].data[u],
                            meta : {
                                impressions : $scope.lineGraph.viewData[i].data[u],
                                clicks : $scope.lineGraph.clickData[i].data[u],
                                label : $scope.lineGraph.dates[u]
                            }
                        });
                        
                        
                        //clicks
                        finalClickDatapoints.push({
                            value : $scope.lineGraph.clickData[i].data[u],
                            meta : {
                                impressions : $scope.lineGraph.viewData[i].data[u],
                                clicks : $scope.lineGraph.clickData[i].data[u],
                                label : $scope.lineGraph.dates[u]
                            }
                        });
                        
                        
                        //rate
                        finalRateDatapoints.push({
                            value : $scope.lineGraph.rateData[i].data[u],
                            meta : {
                                impressions : $scope.lineGraph.viewData[i].data[u],
                                clicks : $scope.lineGraph.clickData[i].data[u],
                                label : $scope.lineGraph.dates[u]
                            }
                        });
                        
                    }
                    $scope.lineGraph.viewData[i].data = finalViewDatapoints;
                    $scope.lineGraph.clickData[i].data = finalClickDatapoints;
                    $scope.lineGraph.rateData[i].data = finalRateDatapoints;
                    
                    
                    finalViewDatapoints = [];
                    finalClickDatapoints = [];
                    finalRateDatapoints = [];
                    
                    
                    
                    
                }
                
                
            }


            /*
             * Berechnet aus den View und Clickdaten die Rate daten
             */
            function calcRateDataForGraph() {
                var clicks = $scope.lineGraph.clickData;
                var resultRateArray = [];           //ergebnis array mit vielen series
                var currentRateSeries = {};         //einzelne series im array
                for (var i = 0; i < clicks.length; i++) {     //wire gehen durch alle clicks und suchen die dazu vorhanden view daten
                    currentRateSeries = {
                        data: [],
                        title: "",
                        name : "",
                        color: "",
                        meta : {
                            color : ""
                        },
                        id: null
                    };
                    var clickserie = clicks[i];
                    var id = clickserie.id;
                    var correspondingElement = $.grep($scope.lineGraph.viewData, function (e) {
                        return e.id === id;
                    });        //view daten mit der selben ID suchen
                    if (!correspondingElement) {          //falls es keine Gibt wird einfach weiter gemacht. Sollte eigentlich nie auftreten da wennes clicks gibt auch views vorhanden sein müssen
                        continue;   //TODO sollte es nicht geben
                        console.log("MSG : 19934");
                    } else {
                        for (var u = 0; u < clicks[i].data.length; u++) {
                            //calc rate on that day
                            var amountOfViews = correspondingElement[0].data[u];
                            var amountOfClicks = clicks[i].data[u];


                            if (amountOfClicks === 0 || amountOfViews === 0) {
                                var rate = 0;
                            } else {
                                var rate = amountOfClicks / amountOfViews * 100;
                            }

                            currentRateSeries.data.push(rate);
                        }
                        currentRateSeries.title = correspondingElement[0].title;
                         currentRateSeries.name = correspondingElement[0].title;
                        currentRateSeries.id = correspondingElement[0].id;
                        currentRateSeries.color = correspondingElement[0].color; 
                        currentRateSeries.meta.color = correspondingElement[0].color; 
                        //TODO die farbe wird noch mal genommen die auch bei den views war
                        resultRateArray.push(currentRateSeries);
                    }
                }

                return resultRateArray;
            }
            ;


            function createSeriesDataForGraph(labelArray, data, mode) {
                //find occurence from data for specific label
                var currentCampaignId = -1;
                var allSeries = [];
                var currentSeries = {
                    data: [],
                    title: "",
                    name : "",
                    color: "",
                    meta : {
                        color : ""
                    }

                };
                ;
                angular.forEach(data, function (value, key) {
                    if (currentCampaignId !== value.campaignId) {  //wenn sich die aktuelle campaign id geändert hat wird eine neue series angefangen
                        allSeries.push(currentSeries);
                        currentCampaignId = value.campaignId;  //aktuelle id setzen
                        currentSeries = [];              //aktuelle serie beginnt neu
                        currentSeries.push(value);               //neue serie bekommt den aktuellen wert


                    } else {
                        currentSeries.push(value);              //aktuelle serie bekommt den aktuellen wert

                    }
                    //rechts oben im linegraph werden die gesamtklicks und gesamtviews angezeigt
                    if (mode === "views") {
                        $scope.lineGraph.totalViews += value.anzahl;
                    } else if (mode === "clicks") {
                        $scope.lineGraph.totalClicks += value.anzahl;
                    }
                });
                //push last series
                allSeries.push(currentSeries);
                //beim ersten durchgang wurde eine leer serie geniert.
                //diese wird nun entfernt
                allSeries.splice(0, 1);

                //einträge werden bereits beim holen aus der datenbank chronologisch sortiert

                var resultSeriesArray = [];
                var tempSeries = {
                    data: [],
                    title: "",
                    name : "",
                    color: "",
                    meta : {
                        color : ""
                    }
                };
                //nun werden einträge gefilert entsprechend dem label 
                angular.forEach(allSeries, function (allSeriesArrayValue, allSeriesArrayKey) {
                    angular.forEach(labelArray, function (labelvalue, labelkey) {
                        var value = determineSerieValue(labelvalue, allSeriesArrayValue);
                        tempSeries.data.push(value);
                    });
                    tempSeries.title = allSeriesArrayValue[0].title;    //TODO test if array length greater than 0
                     tempSeries.name = allSeriesArrayValue[0].title;
                    tempSeries.id = allSeriesArrayValue[0].campaignId;
                    tempSeries.color = allSeriesArrayValue[0].color;    //TODO test if array length greater than 0
                     tempSeries.meta.color = allSeriesArrayValue[0].color;    //TODO test if array length greater than 0
                    
                    resultSeriesArray.push(tempSeries);
                    tempSeries = {
                        data: [],
                        title: "",
                        name : "",
                        color: "",
                        meta : {
                          color : ""   
                        }
                    };
                });

                return resultSeriesArray;
            }


            //sucht zu einem label den passenden Eintrag oder gibt 0 zurück falls nichts gefunden wurde
            function determineSerieValue(label, array) {
                var ret = 0;
                angular.forEach(array, function (value, key) {
                    var val = moment(value.day).format("DD.MMM")
                    if (val === label) {
                        ret = value.anzahl;

                    }
                });
                return ret;
            }
            ;


            function getTimediffInDays(firstdate, secondate) {
                firstdate = new Date(firstdate);
                seconddate = new Date(secondate);
                var timeDiff = Math.abs(firstdate.getTime() - secondate.getTime());
                return  Math.ceil(timeDiff / (1000 * 3600 * 24));
            }
            ;

            //werte für die selectbox um einzelne kampagnen im Graph zu selektieren
            $scope.selectboxvalues = {
                selected: "All",
                values: []
            };




            $scope.groupButtonSelection = {
                views: true,
                clicks: false,
                rate: false
            };
            $scope.changeGraphMode = function (mode) {

                $scope.groupButtonSelection = {
                    views: false,
                    clicks: false,
                    rate: false
                };
                $scope.lineGraph.currentLineToDraw = 0;
                switch (mode) {

                    case  "clicks" :
                        $scope.groupButtonSelection.clicks = true;
                        $scope.lineGraph.dataToShow.series = $scope.lineGraph.clickData;
//                        $scope.selectboxvalues.values = $scope.lineGraph.clickData;        //werte in der selectbox setzen
                        break;
                    case  "views"  :
                        $scope.groupButtonSelection.views = true;
                        $scope.lineGraph.dataToShow.series = $scope.lineGraph.viewData;
//                        $scope.selectboxvalues.values = $scope.lineGraph.viewData;        //werte in der selectbox setzen
                        break;
                    case  "rate"   :
                        $scope.groupButtonSelection.rate = true;
                        $scope.lineGraph.dataToShow.series = $scope.lineGraph.rateData;  //TODO
//                        $scope.selectboxvalues.values = $scope.lineGraph.rateData;        //werte in der selectbox setzen
                        break;
                }
                $scope.selectboxvalues.selected = "All";      //In der selectbox wird nach dem Wechsel immer ALLE angezeigt
                
                 Intercom('trackEvent', 'Changed mode (clicks, views) of line graph in campaigndetails');
                
            };



            //Wenn jemand die Kampagne auswählt im Selectbox in Line Graph
            $scope.campaignSelectChanged = function () {
                var id = $scope.selectboxvalues.selected;
                $scope.lineGraph.currentLineToDraw = 0;           //lines werden von anfang an wieder gedrawd
                //search element in Graphdata
                if ($scope.groupButtonSelection.views === true) {
                    if (id === "All") {
                        $scope.lineGraph.dataToShow.series = $scope.lineGraph.viewData;
                    } else {
                        var series = $scope.lineGraph.viewData;
                        for (var i = 0; i < series.length; i++) {
                            if (series[i].id == id) {
                                $scope.lineGraph.dataToShow.series = [];
                                $scope.lineGraph.dataToShow.series.push(series[i]);
                                return;

                            }
                        }
                    }
                } else if ($scope.groupButtonSelection.clicks === true) {
                    if (id === "All") {
                        $scope.lineGraph.dataToShow.series = $scope.lineGraph.clickData;
                    } else {
                        var series = $scope.lineGraph.clickData;
                        for (var i = 0; i < series.length; i++) {
                            if (series[i].id == id) {
                                $scope.lineGraph.dataToShow.series = [];
                                $scope.lineGraph.dataToShow.series.push(series[i]);
                                return;

                            }
                        }
                    }
                } else if ($scope.groupButtonSelection.rate === true) {
                    if (id === "All") {
                        $scope.lineGraph.dataToShow.series = $scope.lineGraph.rateData;
                    } else {
                        var series = $scope.lineGraph.rateData;
                        for (var i = 0; i < series.length; i++) {
                            if (series[i].id == id) {
                                $scope.lineGraph.dataToShow.series = [];
                                $scope.lineGraph.dataToShow.series.push(series[i]);
                                return;

                            }
                        }
                    }
                }
           
            };





            $scope.initData();




            //row selection
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
                        title: $scope.data.selectedGroups[0].campaignTitle,
                        id: $scope.data.selectedGroups[0].campaignId,
                        color: $scope.data.selectedGroups[0].campaignColor
                    };
                } else if ($scope.data.selectedGroups.length > 1) {
                    $scope.selectedCampaign.selected = {
                    };
                }

                //save whole data object in localstorage
//                StorageFactory.saveEmployeeGroupData($scope);
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
                return $scope.data.selectedGroups.length === $scope.campaignGroups.length;
            };
            $scope.selectAll = function ($event) {
                var checkbox = $event.target;
                var action = (checkbox.checked ? 'add' : 'remove');
                for (var i = 0; i < $scope.campaignGroups.length; i++) {
                    var entity = $scope.campaignGroups[i];
                    updateSelected(action, entity);
                }
            };


            $scope.rowClicked = function (item) {
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
//                    $scope.recalcAvatars();
//                     StorageFactory.saveEmployeeGroupData($scope);
                      $scope.selectedCampaign.selected = {
                                        title:  $scope.data.selectedGroups[0].campaignTitle,
                                        id: $scope.data.selectedGroups[0].campaignId,
                                        color: $scope.data.selectedGroups[0].campaignColor
                                    };
                }else{
                     updateSelected(mode, item);
                    
                }
                 
            };


        }])

        .filter('status', function () {
            return function (campaigns, mode) {
                if (mode === "all") {
                    return campaigns;
                }
                var ret = [];
                angular.forEach(campaigns, function (value, key) {

                    if (value.status === mode) {
                        ret.push(value);
                    }
                });

                return ret;

            };
        })
        ;

