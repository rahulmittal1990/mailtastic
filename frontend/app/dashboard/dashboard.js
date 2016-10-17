'use strict';

angular.module('mailtasticApp.dashboard', [])



        .controller('DashboardCtrl', ['$scope', 'campaignService', 'employeeService', 'userService', '$state', 'paymentService', '$rootScope', '$uibModal',  function ($scope, campaignService, employeeService, userService, $state, paymentService, $rootScope, $uibModal) {
            $scope.Math = window.Math;
            $scope.employees = [];

            $scope.overAllStats = {
                amountOfCampaigns: 0,
                amountOfClicks: 0,
                amountOfViews: 0,
                amountOfUsers: 0,
                companyName: "",
                userName: "",
                userMail: "",
            };

            /**
             * Three best employees
             */
            $scope.calcBestThreeEmployees = function () {

                if (!$scope.employees) {
                    //TODO show something in best three area
                    return;
                } else {
                    $scope.employees.sort(function (a, b) {
                        return   parseFloat(b.clicks + b.views) - parseFloat(a.clicks + a.views);
                    });
                    $scope.topThreeEmployees = $scope.employees.slice(0, 3);
                }
            };
           
            $scope.showGroupDetails = function (id) {
                $state.go('base.employees.groupdetails', {groupId: id});

            };
            
             $scope.showUserDetails = function (id) {
                $state.go('base.employees.employeedetail', {employeeId: id});

            };
//            $scope.userdata = {
//                companyName: 'netstag',
//                activeCampaigns: 2,
//                totalDisplays: 4,
//                employees: 8
//
//            };

            $scope.topThreeEmployees = [];

            //make group and best employees col same height
//            setTimeout(function(){
//                var windowwidth = $(document).width();
//                if(windowwidth > 748){
//                     var topheight = $("#top3emp").height();
//                    var groupheight = $("#groupcomp").height();
//                    var newheight = 0;
//                    if(topheight > groupheight){
//                        newheight = topheight;
//                    }else{
//                        newheight = groupheight;
//                    }
//               $(".top3groupcomp").height(newheight + "px");
//                }
//                
//              
//            },500);

            $scope.feedback = {
                text: ""
            };
            $scope.sendFeedback = function (text) {
                employeeService.sendFeedback(text).then(function (data) {
                    if (data.success === true) {
                        alert("Herzlichen Dank für Ihr Feedback. Wir werden uns umgehend um Ihr Anliegen kümmern.");
                        $scope.feedback.text = "";
                    } else {
                        alert("Leider konnte Ihr Feedback nicht korrekt übermittelt werden. Gerne können Sie uns Ihr Anliegen auch jederzeit telefonisch mitteilen oder per E-Mail an feedback@mailtastic.de senden. Herzlichen Dank!");
                    }
                });
            };
            
            
                        $scope.initData = function () {

                employeeService.get().then(function (data) {
                    $scope.employees = data;
                    $scope.calcBestThreeEmployees();
                    $(document).trigger("regenerateAvatars");   //bilder für die mitarbeiter müssen generiert werden
                });

                userService.getOverallStats().then(function (data) {

                    if (data.success !== true) {
                        //TODO
                    } else {
                        if (data.data && Array.isArray(data.data) && data.data.length > 0) {
                            $scope.overAllStats.amountOfUsers = data.data[0].amountOfUsers;
                            $scope.overAllStats.companyName = data.data[0].companyName;
                            $scope.overAllStats.userName = data.data[0].userName;
                            $scope.overAllStats.userMail = data.data[0].userMail;
                            
                              //check if introduction tour was already seen
                            if(data.data[0].tourSeen != true){
                                //open tour modal
                                var templateUrl = 'tour/tour_modal_main.html';
                                var modalInstance = $uibModal.open({
                                    animation: true,
                                    templateUrl: templateUrl,
                                    controller: 'TourModalCtrl',
                                    size: "lg",
                                     backdrop: 'static',
                                    windowClass: "tourmodal"
                                });

                                modalInstance.result.then(function () {
                                    userService.setTourWasSeen().then();
                                }, function () {        //this function is called on close
                                  
                                    //set tour as seen in database
                                    userService.setTourWasSeen().then();
                                });

                            }
                        }
                    }
                });


                
                
                  paymentService.syncEmployees().then(function (data) {
                                    if (data === true) {
//                                        alert("Ihre Gebührt hat sich nun um 3 Euro monatlich erhöhrt.");
                                    } else {
//                                        alert("Ihre Gebührt hat sich nicht erhöht, da Ihre Anzahl an Mitarbeitern noch in Ihrem kostenlosen Kontingent liegt.");
                                    }
                              
                                });
            };
            $scope.initData();

        }])


        .controller('DashboardCtrl.groupStatstics', ['$scope', 'groupsService', 'browserService', '$timeout', function ($scope, groupsService,browserService,$timeout) {




            $scope.Math = window.Math;

            $scope.initData = function () {
                groupsService.getStatstics().then(function (data) {
                    $scope.calcPieData(data);
//                    $scope.pieGraph.data = $scope.pieGraph.viewData;
                    var browser = browserService();
                    if(browser !== "firefox"){      //wenn der browser nicht firefox ist werden die pie graphen zu klein dargestellt deshalb wird hier manuelle die
                         $timeout(function(){
                        var height = $(".piechart-col").height();
                        $scope.pieGraph.options.height = height+"px";
                         $scope.pieGraph.data = $scope.pieGraph.viewData;
                    }, 500);
                    }
                    
                    else{
                         $scope.pieGraph.data = $scope.pieGraph.viewData;       //auch im firefox müssen die daten gesetzt werden
                    }
                   
                    //angular macht den Bereich sichtbar und dann dauert es kurz bis die vollständigen ausmaße erreicht sind. Daher noch mal reload der daten anstoßen
//                    setTimeout(function(){  //timeout damit Die Seite vollständig aufgebaut ist bis der Pie gezeichnet wird
//                          //Daten im Graph setzen
////                          $scope.pieGraph.data = $scope.pieGraph.clickData;
//                           $scope.$apply(function(){    //set Timeout is out of angular apply
//                                         $scope.pieGraph.data = $scope.pieGraph.viewData;
//                 
//                               
//                           });
//                          
//                        
//                    }, 500);
                   

                });
                
                
                  //wenn firefox genutzt wird dann muss die width vom line graph dynamisch gesetzt werden TODO
//                    var browser = browserService();
//                    if(browser !== "firefox"){
//                         $timeout(function(){
//                        var height = $(".piechart-col").height()
//                        $scope.pieGraph.options.height = height+"px";
//                    }, 1000);
//                    }

            };
            $scope.initData();

            $scope.pieGraph = {
                data: {
//                labels: ['Sales', 'Marketing', 'DADASD'],
                    series: [100]
                },
                options: {
                    donut: true,
                    showLabel: false,
                    donutWidth: 40,
                    width: "100%",
                    height: "100%",
                    chartPadding: 0,
                    sliceMargin: 6,
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
                    draw: function (data) {       //im draw event handler werden die farben gesetzt
                        if (data.type === "slice") {
//                              data.endAngle =   data.endAngle-10;    
//                                 data.startAngle =   data.startAngle+10; 
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
//                            context.element.attr({
//                                //Now we set the style attribute on our bar to override the default color of the bar. By using a HSL colour we can easily set the hue of the colour dynamically while keeping the same saturation and lightness. From the context we can also get the current value of the bar. We use that value to calculate a hue between 0 and 100 degree. This will make our bars appear green when close to the maximum and red when close to zero.
//                                style: 'stroke:' + color + ";stroke-width: 40px;"
//                            });


                            var options = {
                                sliceMargin: 0
                            };

                            if (Math.abs(data.startAngle - data.endAngle) < options.sliceMargin)
                            {
                                return;
                            }

                            var start = Chartist.polarToCartesian(data.center.x, data.center.y, data.radius, data.startAngle + options.sliceMargin / 2),
                                    end = Chartist.polarToCartesian(data.center.x, data.center.y, data.radius, data.endAngle - options.sliceMargin / 2),
                                    arcSweep = data.endAngle - data.startAngle <= 180 ? '0' : '1',
                                    d = [
                                        // Start at the end point from the cartesian coordinates
                                        'M', end.x, end.y,
                                        // Draw arc
                                        'A', data.radius, data.radius, 0, arcSweep, 0, start.x, start.y
                                    ];

                            // Create the SVG path
                            var path = new Chartist.Svg('path', {
                                d: d.join(' ')
                            }, data.element._node.className.baseVal);

                            // Adding the pie series value to the path
//                            path.attr({
//                                'value': data.value
//                            }, Chartist.xmlNs.uri);
//                            
                            path.attr({
                                'value': data.value
                            });

                            // If this is a donut, we add the stroke-width as style attribute
                            path.attr({
                                'style': 'stroke-width: ' + data.element._node.style.strokeWidth + ';stroke:' + color
                            });
                            data.element.replace(path);
//  	        }







//                          context.element.attr({
//                             //Now we set the style attribute on our bar to override the default color of the bar. By using a HSL colour we can easily set the hue of the colour dynamically while keeping the same saturation and lightness. From the context we can also get the current value of the bar. We use that value to calculate a hue between 0 and 100 degree. This will make our bars appear green when close to the maximum and red when close to zero.
//                            style: 'stroke-width: 30px'
//                          });


                        }
                    }

                }
            };

            $scope.groupButtonSelectionPieGraph = {
                views: true,
                clicks: false,
                rate: false
            };

          

            //views und clicks über dem pie graph auswählen
            $scope.changeStatSource = function (mode) {
                
                Intercom('trackEvent', 'Changed source of pie graph in Dashboard');
                
                $scope.pieGraph.currentShown = mode;
                $scope.pieGraph.currentSliceToDraw = 0;

                $scope.groupButtonSelectionPieGraph.views = false;
                $scope.groupButtonSelectionPieGraph.clicks = false;
                $scope.groupButtonSelectionPieGraph.rate = false;

                switch (mode) {
                    case 'views' :
                        $scope.groupButtonSelectionPieGraph.views = true;
                        $scope.pieGraph.data = $scope.pieGraph.viewData;
                        break;
                    case 'clicks' :
                        $scope.groupButtonSelectionPieGraph.clicks = true;
                        $scope.pieGraph.data = $scope.pieGraph.clickData;
                        break;
                    case 'rate' :
                        $scope.groupButtonSelectionPieGraph.rate = true;
                        $scope.pieGraph.data = $scope.pieGraph.rateData;
                        break;
                }
            };

            $scope.calcPieData = function (data) {
                colorcounter = 0;
                $scope.pieGraph.accumulatedClicks = 0;
                $scope.pieGraph.accumulatedViews = 0;
                $scope.pieGraph.accumulatedRate = 0;


                //daten für die views und die rate berechnen
                $scope.pieGraph.viewData.series = [];
                $scope.pieGraph.rateData.series = [];

                angular.forEach(data.views, function (value, key) {
                    $scope.pieGraph.accumulatedViews += value.anzahl;
                    $scope.pieGraph.viewData.series.push(value.anzahl);
                    var tempcolor = Colors.getNext().rgb;
                    value.color = tempcolor;

                    //calculate rate
                    //get clicks for this group
                    var groupname = value.title;
                    var result = $.grep(data.clicks, function (e) {
                        return e.title == groupname;
                    });
                    var rate = 0;
                    if (result.length === 1) {
                        rate = (result[0].anzahl / value.anzahl) * 100;
                    }else{  //there are no corresponding click so add one to the clicks array
                         data.clicks.push({
                            title: value.title,
                            anzahl: 0,
                            color: tempcolor,
                            amountOfMembers: value.amountOfMembers
                    });
                       
                        
                        
                    }
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
                colorcounter = 0;
                $scope.pieGraph.clickData.series = [];
                if(data.clicks.length > 0){
                     angular.forEach(data.clicks, function (value, key) {
                        $scope.pieGraph.accumulatedClicks += value.anzahl;
                        $scope.pieGraph.clickData.series.push(value.anzahl);
                        value.color = Colors.getNext().rgb;
                    });
                }
//                else if( $scope.pieGraph.progressRate.length > 0){ //if there is a rate displayed -> display 0 clicks
////                    $scope.pieGraph.clickData.series = [];
//                        $scope.pieGraph.accumulatedClicks += 0;
//                        $scope.pieGraph.clickData.series.push(0);
//                       data.clicks.push({
//                            title: data.views[0].title,
//                            anzahl: 0,
//                            color: data.views[0].color,
//                            amountOfMembers: data.views[0].amountOfMembers
//                       });
//                      
////                        value.color = Colors.getNext().rgb;
//                }
               
                
                //when there were impressions but no clicks show as 0 clicks
                
                $scope.pieGraph.clickData.series.sort(function (a, b) { //die punkte müssen sortiert/ werden sonst wird die falsche farbe geszogen
                    return b - a;
                });

                //Daten für die Progressbars
                $scope.pieGraph.progressClicks = data.clicks;
                $scope.pieGraph.progressClicks.sort(function (a, b) {
                    return b.anzahl - a.anzahl;
                });
            };


            $scope.toggleButton = {
                value: false
            };

        }])

        .controller('DashboardCtrl.campaignStatistics', ['$scope', 'campaignService', '$timeout', 'browserService','$q','$translate', function ($scope, campaignService,$timeout,browserService, $q,$translate) {


            $scope.Math = window.Math;
            $scope.campaignList = {
                data: {}
            };
            $scope.campaigns = [];
              $scope.linegraphspinner = null;
            $scope.lineGraph = {
                options: {
                    
                    fullWidth: true,
                    showPoint: true,
                    showArea: false,
                    chartPadding: {
                        top: 15,
                        right: 35,
                        bottom:1,
                        left: 10
                    },
                    height: '270px',
                    width: '100%',
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
                    }
                    ,
                    axisY : {
                        // The offset of the labels to the chart area
//                        offset: 130,
                        showGrid: true,
                        onlyInteger: true
                    }

                }, 
//                plugins: [
//                    function(){
//                        setTimeout(function(){
//                           Chartist.plugins.tooltip()
//                        , 5000});
//                    }
//                    
//                    
//                    
//                    
//                    
//                  
//                ],
                
                clickData: [],
                dates : [],
                viewData: [],
                rateData: [],
                totalViews: 0,
                totalClicks: 0,
                dataToShow: {
                    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                    series: [
                                [0,0,0,0],
                                [0,0,0,0],
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



            $scope.activeCampaigns = [];

            $scope.changeLanguage = function (langKey) {
                $translate.use(langKey);
            };
            $scope.initData = function () {
                //get all campaigns for list
                campaignService.get().then(function (data) {
                    $scope.campaigns = data;


                    $scope.overAllStats.amountOfViews = 0;
                    $scope.overAllStats.amountOfClicks = 0;

                    //show only active campaigns in list  
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].activegroups.length !== 0) {
                            $scope.activeCampaigns.push(data[i]);
                            $scope.overAllStats.amountOfViews+=data[i].views;
                            $scope.overAllStats.amountOfClicks+=data[i].clicks;
                        }
                    }
                     $scope.overAllStats.amountOfCampaigns =  $scope.activeCampaigns.length;
                    
                    //wenn firefox genutzt wird dann muss die width vom line graph dynamisch gesetzt werden TODO
                    var browser = browserService();
                    if(browser === "firefox"){
                         $timeout(function(){
                        var width = $(".linepanelbody").width();
                        $scope.lineGraph.options.width = width+"px";
                    }, 1000);
                    }
                    
                   
                    

                    $scope.campaignSwitcher = $scope.campaigns[0];





                    //campaign statistics
                    //Get Statistic for last 30 days
                    var begindate = moment().subtract(30, 'days');
                    var enddate = moment();

                    var beginDateAsString = begindate.format("YYYY-MM-DD");
                    var endDateAsString = enddate.format("YYYY-MM-DD");

                    //show load spinner
                    $scope.linegraphspinner = $q.defer();
                    

                    campaignService.getStatistics(beginDateAsString, endDateAsString).then(function (data) {

                        $scope.calcGraphData(data, begindate, enddate);             //daten berechnen

//                    setTimeout(function(){
                        $scope.lineGraph.dataToShow.series = $scope.lineGraph.viewData;    //viewData als Start setzen
                        $scope.selectboxvalues.values = $scope.lineGraph.viewData;       //für das select in dem einzelne Kampagnen ausgewählt werden können
                        //meta daten in den punkten ergänzen für tooltips

                        //hide loadspinner
                         $scope.linegraphspinner.resolve();
//                    },1000);

                    });

                });

                var begindate = moment().subtract(30, 'days');
                var enddate = moment();

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

            };
            $scope.initData();


//            $scope.reload = function(){
//                $scope.dateRangeChanged( $('#dash-daterange-picker'), null);
//            };


            $scope.dateRangeChanged = function (ev, picker) {
                 Intercom('trackEvent', 'Changed date range of line graph in Dashboard');
                
                
//                alert($('#dash-daterange-picker').val());
                $scope.linegraphspinner = $q.defer();
                campaignService.getStatistics(picker.startDate.format("YYYY-MM-DD"), picker.endDate.format("YYYY-MM-DD")).then(function (data) {


//                    $scope.$apply(function(){
                    $scope.calcGraphData(data, picker.startDate, picker.endDate);             //daten berechnen
                    //$scope.lineGraph.dataToShow.series = $scope.lineGraph.viewData;    //viewData als Start setzen
                    $scope.campaignSelectChanged();
//                    $scope.selectboxvalues.values = $scope.lineGraph.viewData;       //für das select in dem einzelne Kampagnen ausgewählt werden können

                    $scope.linegraphspinner.resolve();
//                    });

                });

            };




            $scope.accumulatedValues = {
                allViews: 0,
                allClicks: 0
            };

            var minLabels = 8;
            $scope.calcGraphData = function (data, begin, end) {
                $scope.lineGraph.currentLineToDraw = 0;             //graph fängt wieder bei 0 an zu zeichnen
                $scope.lineGraph.totalViewsAll = 0;
                $scope.lineGraph.totalClicksAll = 0;

                var amountOfDays = end.diff(begin, 'days');
                
                amountOfDays+=1;

                //create labels
                var amountOfLabels = 10;
                var width = $(window).width();
                if (width < 600) {
                    amountOfLabels = 5;
                }
                var labelArray = [];


                if(amountOfDays < 11){  //wenn weniger als 11 labels müssen diese nicht ausgedünnt werden
                      $scope.interpolationValue = 1;
                }else{
                     //modulo wird gebraucht um zu wissen das jeweils wie vielte label gezeigt werden soll
                    var modulo = Math.round(amountOfDays / amountOfLabels);
                    $scope.interpolationValue = modulo;
                }
               

                //label erzeugen    
                var tempend = end;
                var dateArray = []; //for tooltips

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



                //bestimme alle kampagnen die im gewählten zeitraum existiert haben, damit welche für die es keine Daten gibt immer 0 angezeigt wird und diese nicht nur einfach nich auftauchen
 //                var range = moment().range(begin, end);
 //leeres datenarray für kampagnen die keine views und clicks hatten erzeugen
                        var arrayOfZeros = [];
                        for (var q = 0; q < $scope.lineGraph.dataToShow.labels.length; q++) {
                            arrayOfZeros.push(0);
                        }
                for (var i = 0; i < $scope.campaigns.length; i++) {
//                    var isso = moment($scope.campaigns[i].createdAt).isBetween(begin, end); 
//                    var isso = (end.isAfter(moment($scope.campaigns[i].createdAt))); // || moment($scope.campaigns[i].createdAt).isBetween(begin, end));
//                    var isso = moment($scope.campaigns[i].createdAt).isAfter(begin);
                    if (end.isAfter(moment($scope.campaigns[i].createdAt))) {

                       

                        //check if its available in views data
                        var found = false;
                        for (var u = 0; u < $scope.lineGraph.viewData.length; u++) {
                            if ($scope.lineGraph.viewData[u].id === $scope.campaigns[i].id) {
                                found = true;
                                break;
                            }
                        }
                        if (!found) {
                            $scope.lineGraph.viewData.push({
                                title: $scope.campaigns[i].title,
                                name : $scope.campaigns[i].title ,   //attribut in chartist heißt name für die tooltips daher doppelt
                                id: $scope.campaigns[i].id,
                                color: $scope.campaigns[i].color,
                                meta : {
                                    color : $scope.campaigns[i].color,  ////attribut in chartist heißt name für die tooltips daher doppelt
                                },
                                data: arrayOfZeros
                            });
                        }



                        found = false;
                        for (var u = 0; u < $scope.lineGraph.clickData.length; u++) {
                            if ($scope.lineGraph.clickData[u].id === $scope.campaigns[i].id) {
                                 found = true;
                                break;
                            }
                        }
                        if (!found) {
                            $scope.lineGraph.clickData.push({
                                title: $scope.campaigns[i].title,
                                 name : $scope.campaigns[i].title ,//attribut in chartist heißt name für die tooltips daher doppelt
                                id: $scope.campaigns[i].id,
                                color: $scope.campaigns[i].color,
                                 meta : {
                                    color : $scope.campaigns[i].color,  ////attribut in chartist heißt name für die tooltips daher doppelt
                                },
                                data: arrayOfZeros
                            });
                        }

                        found = false;
                        for (var u = 0; u < $scope.lineGraph.rateData.length; u++) {
                            if ($scope.lineGraph.rateData[u].id === $scope.campaigns[i].id) {
                                 found = true;
                                break;
                            }
                        }
                        if (!found) {
                            $scope.lineGraph.rateData.push({
                                title: $scope.campaigns[i].title,
                                 name : $scope.campaigns[i].title ,//attribut in chartist heißt name für die tooltips daher doppelt
                                id: $scope.campaigns[i].id,
                                color: $scope.campaigns[i].color,
                                 meta : {
                                    color : $scope.campaigns[i].color,  ////attribut in chartist heißt name für die tooltips daher doppelt
                                },
                                data: arrayOfZeros
                            });
                        }



                    }
                    ;
                }

                $scope.lineGraph.totalViews = $scope.lineGraph.totalViewsAll;
                $scope.lineGraph.totalClicks = $scope.lineGraph.totalClicksAll;
                
                
                
                //daten sortieren, damit tooltips die passenden Daten anzeigen können
                
                $scope.lineGraph.rateData.sort(function(a, b){return a.id-b.id});
                $scope.lineGraph.clickData.sort(function(a, b){return a.id-b.id});
                $scope.lineGraph.viewData.sort(function(a, b){return a.id-b.id});
                
                
                //meta daten für die tooltips in die punkte schreiben
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
                                    color : "",  ////attribut in chartist heißt name für die tooltips daher doppelt
                                },
                        id: null
                    };
                    var clickserie = clicks[i];
                    var id = clickserie.id;
                    var correspondingElement = $.grep($scope.lineGraph.viewData, function (e) {
                        return e.id === id;
                    });        //view daten mit der selben ID suchen
                    if (!correspondingElement || correspondingElement.length === 0) {          //falls es keine Gibt wird einfach weiter gemacht. Sollte eigentlich nie auftreten da wennes clicks gibt auch views vorhanden sein müssen
                        continue;   //TODO sollte es nicht geben
//                        console.log("MSG : 19934");
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
                        currentRateSeries.color = correspondingElement[0].color;       //TODO die farbe wird noch mal genommen die auch bei den views war
                         currentRateSeries.meta.color = correspondingElement[0].color;
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
                    name : "",
                    title: "",
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
                        $scope.lineGraph.totalViewsAll += value.anzahl;
                    } else if (mode === "clicks") {
                        $scope.lineGraph.totalClicksAll += value.anzahl;
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
                    color: "",
                    meta : {
                        color : ""
                    },
                    name : ""
                };
                //nun werden einträge gefilert entsprechend dem label
                angular.forEach(allSeries, function (allSeriesArrayValue, allSeriesArrayKey) {
                    angular.forEach(labelArray, function (labelvalue, labelkey) {
                        var value = determineSerieValue(labelvalue, allSeriesArrayValue);
                        tempSeries.data.push(value);
                    });
                    tempSeries.title = allSeriesArrayValue[0].title;    //TODO test if array length greater than 0
                    tempSeries.name =  tempSeries.title; 
                    tempSeries.id = allSeriesArrayValue[0].campaignId;
                    tempSeries.color = allSeriesArrayValue[0].color;    //TODO test if array length greater than 0
                    tempSeries.meta.color = allSeriesArrayValue[0].color;
                    resultSeriesArray.push(tempSeries);
                    tempSeries = {
                        data: [],
                        title: "",
                        color: "",
                        meta : {
                            color : ""
                        },
                        name : ""
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
                        $scope.groupButtonSelection.clicks  =    true;
//                        $scope.lineGraph.dataToShow.series  =    $scope.lineGraph.clickData;
                         $scope.campaignSelectChanged();
//                        $scope.selectboxvalues.values       =    $scope.lineGraph.clickData;        //werte in der selectbox setzen
                        break;
                    case  "views"  :
                        $scope.groupButtonSelection.views = true;
//                        $scope.lineGraph.dataToShow.series = $scope.lineGraph.viewData;
//                        $scope.selectboxvalues.values = $scope.lineGraph.viewData;        //werte in der selectbox setzen
//                        
                         $scope.campaignSelectChanged();
                        break;
                    case  "rate"   :
                        $scope.groupButtonSelection.rate = true;
//                        $scope.lineGraph.dataToShow.series = $scope.lineGraph.rateData;  //TODO
//                        $scope.selectboxvalues.values = $scope.lineGraph.rateData;        //werte in der selectbox setzen
//                        
                         $scope.campaignSelectChanged();
                        break;
                }
//                $scope.selectboxvalues.selected = "All";      //In der selectbox wird nach dem Wechsel immer ALLE angezeigt

                Intercom('trackEvent', 'Changed mode (clicks, views) of line graph in Dashboard');
            };



            //Wenn jemand die Kampagne auswählt im Selectbox in Line Graph
            $scope.campaignSelectChanged = function () {
                
               
                
                var id = $scope.selectboxvalues.selected;
                $scope.lineGraph.currentLineToDraw = 0;           //lines werden von anfang an wieder gedrawd
                //search element in Graphdata
                if ($scope.groupButtonSelection.views === true) {
                    if (id === "All") {
                        
                        

                         //anzeige daten setzen nachdem die meta informationen drin sind
                        $scope.lineGraph.dataToShow.series = $scope.lineGraph.viewData;

                        //gesamt clicks und gesamt views setzen
                        $scope.lineGraph.totalViews = $scope.lineGraph.totalViewsAll;
                        $scope.lineGraph.totalClicks = $scope.lineGraph.totalClicksAll;
                    } else {
                        var series = $scope.lineGraph.viewData;
                        for (var i = 0; i < series.length; i++) {
                            if (series[i].id == id) {
                                

                                //gesamt views fpr diese einzelne kampagne links oben anzeigen
                                var gesamtViews = 0;
                                for (var l = 0; l < series[i].data.length; l++) {
                                    gesamtViews += series[i].data[l].value;
                                }
                                $scope.lineGraph.totalViews = gesamtViews;
                                

                                 
                                 //anzeige daten setzen nachdem die meta informationen drin sind
                                 $scope.lineGraph.dataToShow.series = [];
                                $scope.lineGraph.dataToShow.series.push(series[i]);
                                return;

                            }
                        }
                    }
                } else if ($scope.groupButtonSelection.clicks === true) {
                    if (id === "All") {
                        

//                        
                         //anzeige daten setzen nachdem die meta informationen drin sind
                        $scope.lineGraph.dataToShow.series = $scope.lineGraph.clickData;
                        //gesamt clicks und gesamt views setzen
                        $scope.lineGraph.totalViews = $scope.lineGraph.totalViewsAll;
                        $scope.lineGraph.totalClicks = $scope.lineGraph.totalClicksAll;
                    } else {
                        var series = $scope.lineGraph.clickData;
                        for (var i = 0; i < series.length; i++) {
                            if (series[i].id == id) {
                              


                                //gesamt clicks fpr diese einzelne kampagne links oben anzeigen
                                var gesamtClicks = 0;
                                for (var l = 0; l < series[i].data.length; l++) {
                                    gesamtClicks += series[i].data[l].value;
                                }
                                $scope.lineGraph.totalClicks = gesamtClicks;
                                
                                
                                
                                

                                 
                                 
                                 //anzeige daten setzen nachdem die meta informationen drin sind
                                   $scope.lineGraph.dataToShow.series = [];
                                $scope.lineGraph.dataToShow.series.push(series[i]);
                                 
                                return;

                            }
                        }
                    }
                } else if ($scope.groupButtonSelection.rate === true) {
                    if (id === "All") {
                        
                        

                         
                        //anzeige daten setzen nachdem die meta informationen drin sind
                        $scope.lineGraph.dataToShow.series = $scope.lineGraph.rateData;
                        //gesamt clicks und gesamt views setzen
                        $scope.lineGraph.totalViews = $scope.lineGraph.totalViewsAll;
                        $scope.lineGraph.totalClicks = $scope.lineGraph.totalClicksAll;
                    } else {
                        
                        var series = $scope.lineGraph.viewData;
                        for (var i = 0; i < series.length; i++) {
                            if (series[i].id == id) {
                                //gesamt views fpr diese einzelne kampagne links oben anzeigen
                                var gesamtViews = 0;
                                for (var l = 0; l < series[i].data.length; l++) {
                                    gesamtViews += series[i].data[l].value;
                                }
                                $scope.lineGraph.totalViews = gesamtViews;  //daraus wird die rate errechnet im display oben links im graph
                            }
                        }
                        var series = $scope.lineGraph.clickData;
                        for (var i = 0; i < series.length; i++) {
                            if (series[i].id == id) {
                              
                                //gesamt clicks fpr diese einzelne kampagne links oben anzeigen
                                var gesamtClicks = 0;
                                for (var l = 0; l < series[i].data.length; l++) {
                                    gesamtClicks += series[i].data[l].value;
                                }
                                $scope.lineGraph.totalClicks = gesamtClicks;        //daraus wird die rate errechnet im display oben links im graph
                            }
                        }
                        
                        
                        var series = $scope.lineGraph.rateData;
                        for (var i = 0; i < series.length; i++) {
                            if (series[i].id == id) {

                                
                                //anzeige daten setzen nachdem die meta informationen drin sind
                                $scope.lineGraph.dataToShow.series = [];
                                $scope.lineGraph.dataToShow.series.push(series[i]);
                            }
                        }
                        
                    }
                }

            };
        }])

        .directive('fadeIn', ['$timeout', function ($timeout) {
            return {
                restrict: 'A',
                link: function ($scope, $element, attrs) {
                    $element.addClass("ng-hide-remove");
                    $element.on('load', function () {
                        $element.addClass("ng-hide-add");
                    });
                }
            };
        }])
        ;
        
        

