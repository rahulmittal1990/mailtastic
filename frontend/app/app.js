'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('mailtasticApp', [
    'ui.bootstrap',
    'angular-loading-bar',
    'ui.router',
    'uiSwitch',
    'ngFileUpload',
    'cgBusy',
    'ui.select',
    'ngSanitize',
    'angular-chartist',
    'color.picker',
    'LocalStorageModule',
    'mailtasticApp.factories',
    'mailtasticApp.services',
    'mailtasticApp.modal',
    'mailtasticApp.modalGroup',
    'mailtasticApp.modalExpired',
    'mailtasticApp.modalCampaign',
    'mailtasticApp.modalEmployee', //TODO in ein Module verschieben. Bei services hat es auch geklappt=?!
    'mailtasticApp.modalPassReset',
    'mailtasticApp.groupSigModal',
    'mailtasticApp.sigEditFieldModal',
    'mailtasticApp.sigTemplatesModal',
    'mailtasticApp.installation',
    'mailtasticApp.starthelp',
    'mailtasticApp.faq',
    'mailtasticApp.login',
    'mailtasticApp.dashboard',
    'mailtasticApp.campaigns',
    'mailtasticApp.employees',
    'mailtasticApp.groups',
    'mailtasticApp.account',
    'mailtasticApp.register',
    'mailtasticApp.assistant',
    'mailtasticApp.booking',
    'mailtasticApp.signature',
    'mailtasticApp.integration',
    'mailtasticApp.employeeEditUserInfoModal',
     'pascalprecht.translate'
]).
        config(['$stateProvider', '$locationProvider', '$httpProvider', 'uiSelectConfig', '$urlRouterProvider', function ($stateProvider, $locationProvider, $httpProvider, uiSelectConfig, $urlRouterProvider) {
                //initialize get if not there
                if (!$httpProvider.defaults.headers.get) {
                    $httpProvider.defaults.headers.get = {};
                }
                $httpProvider.interceptors.push('AuthInterceptor');
                //disable IE ajax request caching
                $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';


                $urlRouterProvider.otherwise('/login');
                $stateProvider

//                        .state('base', {
//                            abstract: true,
//                            // Note: abstract still needs a ui-view for its children to populate.
//                            // You can simply add it inline here.
//                            templateUrl: 'snippets/navigation.html',
//                            controller: 'NavigationCtrl'
//                        })
                        
                          .state('base', {
                            abstract: true,
                            // Note: abstract still needs a ui-view for its children to populate.
                            // You can simply add it inline here.
                            templateUrl: 'snippets/navigationsidebar.html',
                            controller: 'NavigationCtrl'
                        })
                        .state('base.account', {
                            url: '/account',
                            // Note: abstract still needs a ui-view for its children to populate.
                            // You can simply add it inline here.
                            templateUrl: 'account/main.html',
                            controller: 'AccountCtrl'
                        })


                        .state('betauser', {
                            url: '/createbetauser',
                            // Note: abstract still needs a ui-view for its children to populate.
                            // You can simply add it inline here.
                            templateUrl: 'createbeta/createbeta.html',
                            controller: 'CreateBetaCtrl'
                        })

                        .state('base.campaigns', {
                            url: '/campaigns',
                            templateUrl: 'campaigns/structure.html',
                            controller: 'CampaignsCtrl'
                        })



                        .state('base.campaigns.campaignlist', {
                            url: '/campaigns/list',
                            params: {
                                // here we define default value for foo
                                // we also set squash to false, to force injecting
                                // even the default value into url
                                mode: {
                                    value: null
                                },
                                hiddenParam: 'YES',
                            },
                            templateUrl: 'campaigns/list/campaignlist.html',
                            controller: 'CampaignListCtrl'
                        })


                        .state('base.campaigns.campaigndetail', {
                            url: '/campaigns/details/:campaignId',
                            templateUrl: 'campaigns/details/campaigndetails.html',
                            controller: 'CampaignDetailsCtrl',
                            params: {
                                // here we define default value for foo
                                // we also set squash to false, to force injecting
                                // even the default value into url
                                campaignId: {
                                    value: null,
//              squash: false,
                                },
                                // this parameter is now array
                                // we can pass more items, and expect them as []
//            bar : { 
//              array : false,
//            },
                                // this param is not part of url
                                // it could be passed with $state.go or ui-sref 
                                hiddenParam: 'YES',
                            }
                        })




                        .state('base.dashboard', {
                            url: '/dashboard',
                            templateUrl: 'dashboard/dashboard.html',
                            controller: 'DashboardCtrl'
                        })


                        /*
                         * Mitarbeiter und Gruppen
                         */
                        .state('base.employees', {
                            url: '/employees',
                            templateUrl: 'employees/structure.html',
                            controller: 'EmployeeStructureCtrl'
                        })

                        .state('base.employees.employeelist', {
                            url: '/employees/list',
                            templateUrl: 'employees/list/employeeslist.html',
                            controller: 'EmployeesListCtrl'
                        })


                        .state('base.employees.employeedetail', {
                            url: '/employee/details/:employeeId',
                            params: {
                                // here we define default value for foo
                                // we also set squash to false, to force injecting
                                // even the default value into url
                                employeeId: {
                                    value: null,
//              squash: false,
                                },
                                // this parameter is now array
                                // we can pass more items, and expect them as []
//            bar : { 
//              array : false,
//            },
                                // this param is not part of url
                                // it could be passed with $state.go or ui-sref 
                                hiddenParam: 'YES',
                            },
                            templateUrl: 'employees/details/employeedetails.html',
                            controller: 'EmployeeDetailsCtrl'
                        })

                        .state('base.employees.groupdetails', {
                            url: '/groups/details/:groupId',
                            params: {
                                // here we define default value for foo
                               
                                // even the default value into url
                                groupId: {
                                    value: null,
//              squash: false,
                                },
                                // this parameter is now array
                                // we can pass more items, and expect them as []
//            bar : { 
//              array : false,
//            },
                                // this param is not part of url
                                // it could be passed with $state.go or ui-sref 
                                hiddenParam: 'YES',
                            },
                            templateUrl: 'groups/details/groupdetails.html',
                            controller: 'GroupDetailsCtrl'
                        })

                        .state('base.employees.grouplist', {
                            url: '/groups/list',
                            templateUrl: 'groups/list/grouplist.html',
                            controller: 'GroupListCtrl'
                        })
                        .state('base.assistant', {
                            url: '/create/assistant/:state',
                            params: {
                                // here we define default value for state
                                state: {
                                    value: null
                                }
                                
                            },
                            templateUrl: 'assistant/main.html',
                            controller: 'AssistantCtrl'
                        })
                        .state('base.integration', {   //same es employeeactivation but admin has no activation id with it on this route
                            url: '/installation?ac&eid&edit',
                            templateUrl: 'integration/integration.html',
                            controller: 'IntegrationCtrl',
                        })
                        .state('activationadmin', {
                            url: '/activation/admin?ac&eid&edit',
                            templateUrl: 'login/login.html',
                            controller: 'loginCtrl',
                        })
//                        .state('activationemployee', {
//                            url: '/activation/employee?ac&eid',
//                            templateUrl: 'installation/installation.html',
//                            controller: 'ActivationCtrl',
//                        })
                        
                        .state('employeeactivation', {
                            url: '/activation/employee?ac&eid&edit',
                            templateUrl: 'integration/integration.html',
                            controller: 'IntegrationCtrl',
                        })
                        
                        .state('employeedatacompletion', {
                            url: '/datacompletion/employee?ac&eid&edit',
                            templateUrl: 'integration/integration.html',
                            controller: 'IntegrationCtrl',
                        })

                        
                        
                        .state('base.starthelp', {
                            url: '/starthelp',
                            templateUrl: 'help/start/start.html',
                            controller: 'StarthelpCtrl',
                        })
                        .state('base.faq', {
                            url: '/faq',
                            templateUrl: 'help/faq/faq.html',
                            controller: 'FaqCtrl',
                        })
                        .state('resetpass', {
                            url: '/passreset?pc&aid',
                            templateUrl: 'login/login.html',
                            controller: 'loginCtrl',
                        })
                        .state('register', {
                            url: '/register?ref',
                            templateUrl: 'register/register.html',
                            controller: 'RegisterCtrl',
                        })
                         .state('registercomplete', {
                            url: '/registercomplete',
                            templateUrl: 'register/register.html',
                            controller: 'RegisterCompleteCtrl',
                            params: {
                                // here we define default value for state
                                email: {
                                    value: null
                                }
                                
                            }
                        })
                        .state('base.booking', {
                            url: '/booking?mode',
                            templateUrl: 'booking/main.html',
                            controller: 'BookingCtrl',
                        })
                         .state('base.signaturedesigner', {
                            url: '/signature/designer/:signatureId',
                            templateUrl: 'signature/designer/main.html',
                            controller: 'SignatureDesignerCtrl',
                        }) 
                        .state('base.signaturelist', {
                            url: '/signature/list',
                            templateUrl: 'signature/list/signatureList.html',
                            controller: 'SignatureListCtrl',
                        })
                         .state('base.signaturedetails', {
                            url: '/signature/details/:signatureId',
                            templateUrl: 'signature/details/signatureDetails.html',
                            controller: 'SignatureDetailsCtrl',
                        })
                         .state('base.signaturerollout', {
                            url: '/signature/rollout/:signatureId/:mode/:signatureTitle',
                            templateUrl: 'signature/rollout/rollout_main.html',
                            controller: 'SignatureRolloutCtrl',
                              params: {
                                signatureId: {
                                    value: null
                                    
                                },
                                mode : {
                                    value : "create"
                                },
                                signatureTitle : {
                                    value : null
                                }
                            }
                        })
                        .state('login', {
                            url: '/login',
                            templateUrl: 'login/login.html',
                            controller: 'loginCtrl',
                            params: {
                                force: {
                                    value: false
                                }


                            },
                            hiddenParam: 'YES',
                            resolve: {
                                user: ['$q', 'StorageFactory', 'userService', function ($q, StorageFactory, userService) {
                                        var d = $q.defer();
                                        var accessToken = StorageFactory.get('accessToken');
                                        var userId = StorageFactory.get('userId');
                                        if (accessToken != null && accessToken != "" && userId != null && userId != "") {
                                            var params = {
                                                accessToken: accessToken,
                                                userId: userId
                                            };
                                            userService.checkToken(params).then(function (data) {
                                                if (data.success === true) {

//                            $state.go("base.dashboard", {}, {reload: false});
                                                    d.reject('loggedIn');       //the state change to login is rejected with the reson loggedIn. The error is caught somehwere alse and the state is switched to dashboard
                                                }
                                                else {
//                            $state.go('login', {force : true});
                                
                                                    d.resolve();
                                                }
                                            });
                                        }
                                        else {
//                     $state.go('login',{force : true});
                                            d.resolve();
                                        }
                                        return d.promise;
                                    }]
                            }

                        }).state('base.googlesync', {
                            url: '/googleappsync',
                            templateUrl: 'googlesync/main.html',
                            controller: 'GoogleSyncCtrl',
                        })
                                
                        .state('base.versacommerce', {
                            url: '/versacommerce',
                            templateUrl: 'versacommerce/main.html',
                            controller: 'VersaCommerceCtrl',
                        });
            }])

        .run(['$rootScope', 'StorageFactory', 'userService', '$state', '$location', '$window','paymentService','intercomService', function ($rootScope, StorageFactory, userService, $state, $location, $window,paymentService,intercomService) {
                
                
               
                
                
                
                      
                        
                //set const strings to root scope to use it in every scope
                $rootScope.strings = Strings;
                        
                        
                 /**
                 * creates dummy images for employees where the first letter of firstname and lastname of employee is shown
                 * @returns {undefined}
                 */
                $rootScope.recalcAvatars = function () {
                    $(document).trigger("regenerateAvatars");
                };

                $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
                    //here you can go to whatever state you want, and you also have a lot of information to save if needed
                    if (toState.name === "login") {
                        if (error === "loggedIn") {
                            
                            //user is logged in so track him with intercom
                            intercomService.userLoggedIn();
                            
                            $state.go("base.dashboard", {}, {reload: false});
                        }
                    }
                });
                $rootScope.$on('$stateChangeSuccess',
                        function (event, toState, toParams, fromState, fromParams) {

                            //inspectlet
//                            __insp.push(["virtualPage"]);
//                        mouseflow.newPageView();
                            $window.ga('send', 'pageview', {page: $location.url()});
                            
//                            //appcues for user tour
//                            if ($window.Appcues) {
//                                $window.Appcues.start();
//                            }
                            
                            
                                if(toState.name.contains("base")){  //all states without base do not require login status
                                  //check payment status for user and show banner on top if trial ended or something else
                                    //check if trial time left
                                  paymentService.getUserStatus().then(function(data){
                                      if(!data){

                                      }else if (data.forceAllow === true) { //manuell freigeschaltet
                                          $rootScope.trialarea.showtimeleft = false;
                                          $rootScope.trialarea.daysLeft = 0;
                                          $rootScope.trialarea.showexpired = false;

                                      }else if (data.hasSubscription === true) {    //ist zahlkunde
                                          $rootScope.trialarea.showtimeleft = false;
                                          $rootScope.trialarea.daysLeft = 0;
                                          $rootScope.trialarea.showexpired = false;

                                      } else if (data.hasTestTime === true) {    //noch im test
                                          //einfach weiter machen
                                          //alert("HAS TESTTIME");
                                          $rootScope.trialarea.showtimeleft = true;
                                          $rootScope.trialarea.showexpired = false;
                                          $rootScope.trialarea.daysLeft = data.daysLeft;
                                      }  else {
                                          $rootScope.trialarea.showexpired = true;

                                      }
                                  });
                            }
                          
                            
                            
                            

                            
                             intercomService.update();
                            
                            //clear selected elements of mail lists
                            if(toState.name === "base.employees.employeelist" && fromState.name !== "base.employees.employeelist"){
                                StorageFactory.clearSelectedListData("employee");
                            }else if(toState.name === "base.employees.grouplist" && fromState.name !== "base.employees.grouplist"){
                                
                                StorageFactory.clearSelectedListData("group");
                            }else if(toState.name === "base.campaigns.campaignlist" && fromState.name !== "base.campaigns.campaignlist"){
                                StorageFactory.clearSelectedListData("campaign");
                            }
                            
                            
                            //detach event listner on copy because otherwise a user cannot copy and paste things when he has visited the integrationpage
                            $(document).unbind( "copy" );
                            
                        });


                $rootScope.Math = window.Math;
                $rootScope.labels = {
                    views: "Impressions",
                    clicks: "Clicks",
                    rate: "Click Rate"
                };
                
                
                $rootScope.trialarea = {
                    showexpired : false,
                    showtimeleft : false,
                    daysleft : 0
                };
                
                
//                
//                //initialize intercom
//                $window.Intercom("boot", {
//                    app_id: "l9hkw9ed"
//                });
//                
                //send login if 
                intercomService.userLoggedIn();
//               

            }])
        .value('cgBusyDefaults', {
            message: 'Inhalte werden geladen',
            backdrop: false
        })

        .controller('NavigationCtrl', 
[
    '$scope', 
    '$location', 
    'StorageFactory', 
    '$state',
    '$rootScope',
    'userService',
    'alertService',
    'intercomService', 
    '$uibModal',
    'groupsService',
    '$translate',
    function ($scope, $location, StorageFactory, $state,$rootScope, userService, alertService, intercomService, $uibModal,  groupsService, $translate) {
                $scope.getClass = function (path) {
                    if ($location.path().substr(0, path.length) == path) {
                        return "active";
                    } else {
                        return "";
                    }
                    ;

                };

                $scope.data = {
                    groups : []
                    
                };
                
                
                 $scope.changeLanguage = function (langKey) {
                    $translate.use(langKey);
                };

//                //get groups to show in navigation 
//                $scope.getGroups = function(){
//                        groupsService.get()
//                                .then(function(data){
//                                  $scope.data.groups = data;  
//                                });
//                 };
//                 
//                 //open groupList and load groups to show
//                 $scope.openGrouplist = function(){
//                     $scope.getGroups();
//                     $state.go('base.employees.grouplist');
//                 };


                 $scope.initData = function(){
                   $scope.getGroups();
                     
                 };

                /**
                 * start tiny explanation tour manually
                 * @returns {undefined}
                 */
                $scope.startTour = function(){
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
                    
                };
                  

                $scope.getClassEmp = function () {
                    var innerpath = $location.path();

                    if (innerpath === "/employees/employees/list" || innerpath === "/employees/employee/details") {
                        return "active";
                    } else {
                        return "";
                    }
                };
                
                //integration link is generated per function and so ui-sref-active does not work.
                $scope.getClassIntegration = function () {
                    var innerpath = $location.path();

                    if (innerpath === "/installation") {
                        return "active";
                    } else {
                        return "";
                    }
                };
                

                $scope.getClassGroup = function () {
                    var innerpath = $location.path();

                    if (innerpath === "/employees/groups/list" || innerpath === "/employees/groups/details") {
                        return "active";
                    } else {
                        return "";
                    }
                };

                /*
                 * Wird verwendet um die Aktiv Klasse des "So Funktionierts Dropdown zu bestimmen". Wir beiIntallation, Start und Help Aktiv
                 */
                $scope.getClassHelp = function () {
//            var test = $location.path().substr(0, 12);
                    if ($location.path().substr(0, 14) == '/integration' || $location.path().substr(0, 7) == '/start' || $location.path().substr(0, 6) == '/help') {
                        return "active";
                    } else {
                        return "";
                    }
                };

                $scope.logout = function () {
                    StorageFactory.remove(['logged_in', 'accessToken', 'userId']);
                    $rootScope.trialarea.showexpired = false;
                    $rootScope.trialarea.showtimeleft = false;
                    
                    //tell intercom that user has logged out
                    intercomService.shutDown();
                    
                    $state.go("login", {}, {reload: false});


                };

                $scope.getShown = function () {
                    var path = $location.path().substr($location.path().lastIndexOf('/'));
                    if (path == "/login") {
                        return false;
                    } else {
                        return true;
                    }

                };

                $scope.getElementShown = function () {
                    var url = $location.path().split('/');
                    var last = url[ url.length - 1 ];
                    var secondLast = url[ url.length - 2 ];
                    if (secondLast === "activation" && last === "employee") {
                        return false;
                    } else {
                        return true;
                    }

                };

                $scope.getCurrentLink = function () {

                    return "";
                };


                //generate correct link for admin for his own integration page
                $scope.openOwnIntegrationPage = function(){
                    userService.getAccountData()
                            .then(function(data){
                                var activationCode = data.activationCode;
                                var id = data.id;
                                //build link
//                                $state.go('base.integration',{ac : activationCode, eid : id});
                                
                                alertService.integrationAdditionalInfoForAdminModal(function(){
                                     $state.go('base.integration',{ac : activationCode, eid : id});
                                });
                                
                            });
                    
                };


            }])

        .run(['$rootScope', '$http', function ($rootScope, $http) {
                $rootScope.userdata = {
                    companyName: 'netstag',
                    activeCampaigns: 2,
                    totalDisplays: 4,
                    employees: 8

                };
                $http.defaults.headers.common['Access-Control-Allow-Headers'] = '*';
                //$http.defaults.headers.common.Authorization = 'Basic YmVlcDpib29w';


            }])
        
        .directive("previewiniframe",[ function () {
            function link(scope, element) {
              var iframe = document.createElement('iframe');
              var element0 = element[0];
              element0.appendChild(iframe);
              var body = iframe.contentDocument.body;

              scope.$watch('content', function () {
                  setTimeout(function(){
                         body.innerHTML = scope.content;
                         scope.$apply();
                  }, 500);
               
              
              });
            }

            return {
              link: link,
              restrict: 'E',
              scope: {
                content: '='
              }
            };
        }])




    // Multi language support

    .config(['$translateProvider', function ($translateProvider) {
        $translateProvider.translations('en', en), {

            BUTTON_TEXT_EN: 'english',
            BUTTON_TEXT_DE: 'german'

        }
        $translateProvider.translations('de', de), {

            BUTTON_TEXT_EN: 'english',
            BUTTON_TEXT_DE: 'german'

        }
        $translateProvider.useStaticFilesLoader({
            prefix: 'locale/',
            suffix: '.json'
        });
        $translateProvider.preferredLanguage('de');
        $translateProvider.fallbackLanguage('en');
        $translateProvider.useSanitizeValueStrategy(null);

    }])
    //end
  
        .factory('AuthInterceptor', ['$q', '$injector','intercomService', function ($q, $injector,intercomService) {
                return {
                    request: function (config) {
                        // var LocalService = $injector.get('StorageFactory');
                        // var token;
                        // if (LocalService.get('accessToken')) {
                        // token = LocalService.get('accessToken');
                        // }
                        // if (token) {
                        // config.headers.Authorization = 'Bearer ' + token;
                        // }
                        return config;
                    },
                    response: function (response) {	//falls die antwort Vorbidden kommt dann direkt wieder zum login
                        if (response.status === 401 || response.status === 403) {
                            var LocalService = $injector.get('StorageFactory');
                            LocalService.remove('accessToken');
                            $injector.get('browseService').navigate('/login');
                            //tell intercom that user has logged out
                            intercomService.shutDown();
                        }
                        return $q.resolve(response);
                    },
                    responseError: function (response) {	//falls die antwort Vorbidden kommt dann direkt wieder zum login
                        if (response.status === 401 || response.status === 403) {
                            var LocalService = $injector.get('StorageFactory');
                            LocalService.remove('accessToken');
                            $injector.get('browseService').navigate('/login');
                            //tell intercom that user has logged out
                            intercomService.shutDown();
                        }
                        return $q.reject(response);
                    }
                };
            }])
        
        
       .filter('germannumber', function() {
        return function(input) {
          var out = input || '';
        
        
        if(toLocaleStringSupportsOptions()){
             out = out.toLocaleString('de-DE', {  maximumFractionDigits: 2  });
            //out = out.toFixed(2);
          return out;
            
        }else{
              
              
          out = (out).toFixed(2);    
         
            //out = out.toFixed(2);
          return out;
            
        }
        
        
        
        };
    });

  function toLocaleStringSupportsOptions() {
  return !!(typeof Intl == 'object' && Intl && typeof Intl.NumberFormat == 'function');
}



function alert(content) {
    bootbox.alert(content);
}




//obere navileiste muss zusammen fahren wenn ich auf einen link klicke
//function setNaviTriggerListener() {

    /**
     * Wenn navileiste komprimiert ist muss bei links und bei buttons beim click das ding wieder einfahren - LINKS
     */
//    $("a.closeonclick").click(function (event) {
        // check if window is small enough so dropdown is created
//        var toggle = $(".navbar-toggle").is(":visible");
//        if (toggle) {
//            $("#side-nav").collapse('hide');
//        }
//    });

//    /**
//     * Wenn navileiste komprimiert ist muss bei links und bei buttons beim click das ding wieder einfahren - Buttons
//     */
//    $(".navbar-right a.closeonclick").click(function (event) {
//        // check if window is small enough so dropdown is created
//        var toggle = $(".navbar-toggle").is(":visible");
//        if (toggle) {
//            $(".navbar-collapse").collapse('hide');
//        }
//    });

//}
//
//function waitForNavbar() {
//    setTimeout(function () {
//        var nabvar = $(".navbar-nav li a");
//        if (nabvar) {
//            setNaviTriggerListener();
//        } else {
//            waitForNavbar();
//        }
//    }
//    , 1000);
//
//}
//waitForNavbar();





//});


moment.locale("de");

