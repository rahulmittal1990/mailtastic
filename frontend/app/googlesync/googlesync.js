angular.module('mailtasticApp.integration')

        .controller('GoogleSyncCtrl', ['$scope', '$filter', '$uibModal', '$log', '$stateParams', 'googlesyncservice', 'employeeService',
            'browseService', 'authService', 'userService', 'groupsService', 'paymentService', '$window', 'alertService', '$q', 'listHelperService',
            function ($scope, $filter, $uibModal, $log, $stateParams, googlesyncservice, employeeService, browseService, authService,
                    userService, groupsService, paymentService, $window, alertService, $q, listHelperService) {

                //variables initlizes--------------------------------------------------------------------------------
                $scope.sampledata = "Sample Page";
                $scope.config = {
                    breadcrumpsdone: ''
                };

                $scope.pwdErrorMsg = ''
                $scope.allselectedUser = false;

                $scope.animationsEnabled = true;
                $scope.currentSyncType = "";        //automatic or manual
                $scope.currentStructurType = "";    //automatic groups or default group
                $scope.groupMemberList = [];

                $scope.step = {//workflow
                    startSync: ''
                };

                $scope.rowCheckItems = {
                    allselectedUser: false
                };

                $scope.object = {
                    isConditionchecked: false,
                    isActivecheck: '',
                    googleStructurechecked: '',
                    isGoogleConditionchecked: false,
                    currentPage: 'newgooglesync'

                };

                $scope.syncUpdateModel = {
                    selectedSetting: ''

                };


                $scope.companyInfo = {
                    syncInfoId: null,
                    admin: '',
                    syncAdminEmail: '',
                    isAutomaticSync: null,
                    isGoogleStructure: null,
                    accessTokenKey: '',
                    isDisconnected: false
                };


                $scope.editInfo = {
                    syncInfoId: null,
                    admin: '',
                    syncAdminEmail: '',
                    isAutomaticSync: null,
                    isGoogleStructure: null,
                    accessTokenKey: '',
                    isDisconnected: false
                }



                $scope.syncDisconnectModel = {
                    currentState: 'state1',
                    currentSyncDisconnectType: '',
                    adminPwd: ''

                };
                
                //to adress list helper service in HTML
                listHelperService.selectionType = "multi";
                $scope.list = listHelperService;
                 

                $scope.syncAdminObject = {
                    adminEmail: '',
                    name: ''

                };


                $scope.syncDisconnectTypes = [];
                $scope.adminPwd = '';

                //google auth
                $scope.authUrl = "";
                $scope.googleSyncTypes = [];
                $scope.googleStructureType = [];


                $scope.groupMembersGoogle = [];
                $scope.isSyncDeActivated = false;
                $scope.tempArrayForFilter = [];


                var modalInstance = '';
                $scope.newUsers = [];
                $scope.employeedata = [];


                $scope.syncInfoModel = {
                    totalUserCount: 0,
                    alreadyUserCount: 0,
                    alreadyUsersEmail: '',
                    syncableMemebersCount: 0,
                    isAccepted: false
                };
                $scope.selectedUsers = [];

                $scope.filterText = "";
                var orderBy = $filter('orderBy');

                var sortDir = false;


                  /**
                 * When user is already logged in to google the list is shown at the bottom
                 */
                $scope.availalableUsersList = {
                    toShow : [],
                    all : [],
                    selected : [] 
                    
                };



                //sort list
                $scope.columnName = '';
                $scope.reverse = true;
                $scope.sortBy = function(columnName){
                    $scope.reverse = ($scope.columnName === columnName) ? !$scope.reverse : false;
                    $scope.columnName = columnName;

                }


                //functioning--------------------------------------------------------------------------------

                $scope.startSyncDisconnect = function () {
                    $scope.syncDisconnectModel.currentState = 'state1';
                    $scope.addDisconnectTypes();
                    $scope.syncDisconnectModel.currentSyncDisconnectType = '';
                };


                $scope.addDisconnectTypes = function () {
                    $scope.syncDisconnectTypes = [];
                    var types = ["Mitarbeiter behalten", "Mitarbeiter entfernen"];
                    for (var i = 0; i < 2; i++) {
                        var item = {
                            disconnectType: types[i],
                            id: i + 1
                        };
                        $scope.syncDisconnectTypes.splice(1, 0, item);
                    }
                };

                $scope.getDisconnectType = function () {

                };


                /**
                 * react on different states of disconnect
                 * @returns {undefined}
                 */
                $scope.continueSyncDisconnect = function () {
                    if ($scope.syncDisconnectModel.currentState == 'state1') {
                        $scope.syncDisconnectModel.currentState = 'state2';
                        return;
                    }

                    if ($scope.syncDisconnectModel.currentState == 'state2') {
                        if ($scope.syncDisconnectModel.currentSyncDisconnectType == "") {

                        } else {
                            $scope.syncDisconnectModel.currentState = 'state3';
                            return;
                        }


                    }

                    if ($scope.syncDisconnectModel.currentState == 'state3') {
                        userService.verifyPassword($scope.syncDisconnectModel.adminPwd).then(function (response) {
                            if (response.success == true) {
                                $scope.companyInfo.isDisconnected = true;
                                googlesyncservice.deleteInfo($scope.companyInfo.syncInfoId).then(function (response) {
                                    var ids = [];
                                    for (var i = 0; i < $scope.groupMembersGoogle.length; i++) {
                                        ids.push($scope.groupMembersGoogle[i].id);
                                    }

                                    //if user wants to delete the google sync users
                                    if ($scope.syncDisconnectModel.currentSyncDisconnectType == "Mitarbeiter entfernen") {
                                        //DELETE
                                        employeeService.deleteMany(ids).then(function (response) {
                                            paymentService.syncEmployees().then(function (data) {
                                                $window.location.reload();
                                            });
                                        });
                                    } else {
                                        //user dont want to delete google users
                                        employeeService.updateSyncActivation(ids, false).then(function (response) {
                                            $window.location.reload();
                                        });
                                    }
                                })
                            } else {
                                $scope.pwdErrorMsg = '* Passwort ist falsch';
                            }
                        });
                    }
                }



                /**
                 * Get AUTH Url from backend
                 * @returns {undefined}
                 */
                $scope.getAuthUrl = function () {
                    authService.getAuthUrl().then(function (response) {
                        $scope.authUrl = response;
                        $scope.addSyncStructure();
                    });
                };



                /**
                 * Open browser window for the user to connect to the google account
                 * @returns {undefined}
                 */
                $scope.startSyncProcess = function () {
                    window.$windowScope = $scope;
                    $scope.object = {
                        isConditionchecked: true,
                        isActivecheck: true,
                        googleStructurechecked: '',
                        isGoogleConditionchecked: false,
                        currentPage: 'googlesync'

                    };
                    var oauthWindow = window.open($scope.authUrl, "Authenticate Account", "location=0,status=0,width=600,height=750");
                    //$scope.step.startSync = 'processStart';
                };

                //$scope.authExternalProvider = function (provider) {
                //    window.$windowScope = $scope;
                //    var oauthWindow = window.open($scope.authUrl, "Authenticate Account", "location=0,status=0,width=600,height=750");
                //};


                /**
                 * Google Auth was successfull -> Store token for later use
                 * @param {type} fragment
                 * @returns {undefined}
                 */
                $scope.authCompletedCB = function (fragment) {
                    $scope.$apply(function () {
                        /* google must send the response code then we can call to google provide access_token */
                        if (fragment.code != undefined) {
                            /* request token from server for the response code */
                            authService.getToken(fragment.code).then(function (response) {
                                /* once token is received lets set it to localStorage for later use*/
                                $scope.Token = JSON.stringify(response);
                                authService.setAuthToken(response);

                                $scope.step.startSync = 'processStart';
                                $scope.object.currentPage = "googlesync";
                                //authService.getListOfUsers().then(function (response) {
                                //    $scope.AllUsers = response;

                                //})
                                /* redirect to signature */
                                //  $location.path("/signature");
                            })
                        }

                    });
                };

                /**
                 * Prepate selectbox for syntype
                 * @returns {undefined}
                 */
                $scope.addGoogleSyncTypes = function () {
                    var types = ["Automatisch (empfohlen)", "Manuell"];
                    for (var i = 0; i < 2; i++) {
                        var item = {
                            syncType: types[i],
                            id: i + 1
                        };
                        $scope.googleSyncTypes.splice(1, 0, item);
                    }
                    $scope.currentSyncType = "Manuell";             //we only have manual sync at the time
                    $scope.getAuthUrl();

                };


                /**
                 * Prepare selectbox for sctructure (if groups should be created on base of google groups)
                 * @returns {undefined}
                 */
                $scope.addSyncStructure = function () {
                    //var structure = ["GoogleApp-Strukur übernehmen", "Neue Struktur erstellen"];
                    var structure = ["GoogleApp-Strukur übernehmen", "Neue Struktur erstellen"];

                    for (var i = 0; i < 2; i++) {
                        var item = {
                            structureType: structure[i],
                            id: i + 1
                        };
                        $scope.googleStructureType.splice(1, 0, item);
                    }
                    $scope.currentStructurType = "";
                    $scope.getCompanyInfo();
                };



                /**
                 * Init Data for handling of google sync like admin ids etc.
                 * Sort Sync List and list from google (map)
                 * @returns {undefined}
                 */
                $scope.getCompanyInfo = function () {
                    $scope.step.startSync = "";
                    
                    
                    googlesyncservice.get().then(function (data) {
                        if (data.length > 0) {
                            $scope.companyInfo.syncInfoId = data[0].syncInfoId;
                            $scope.companyInfo.admin = data[0].admin;
                            $scope.companyInfo.syncAdminEmail = data[0].syncAdminEmail;
                            $scope.companyInfo.isAutomaticSync = Boolean(data[0].isAutomaticSync);
                            $scope.companyInfo.isGoogleStructure = Boolean(data[0].isGoogleStructure);
                            $scope.companyInfo.isDisconnected = Boolean(data[0].isDisconnected);
                            $scope.companyInfo.accessTokenKey = data[0].accessTokenKey;
                            
                            //set auth token
                            authService.setAuthToken(JSON.parse($scope.companyInfo.accessTokenKey));

                            //get all users which are google users
                            employeeService.getGoogleSyncUsersID($scope.companyInfo.admin, $scope.companyInfo.syncAdminEmail)

                                    .then(function (data) {
                                       
                                          return $q.resolve(data);
                                       
                                    })
                                    .then(function (googleUsersInMailtastic) {   //get all users from google

                                        return new Promise(function (resolve, reject) {
                                            googlesyncservice.getListOfUsers()
                                                    .then(function (data) {
                                                        //check if user is no google apps for work admin user
                                                        if(data.success === false && data.code === 666){
                                                            alertService.defaultErrorMessage("Sie können sich nur mit Google Synchronisieren, wenn Sie Google Apps for Work nutzen und sich hier mit Ihrem Admin Account anmelden. Als G-Mail Nutzer sind sie nicht automatisch Google Apps for Work Admin.");
                                                            reject();
                                                        }else{
                                                            resolve({
                                                                googleUsersFromMailtastic: googleUsersInMailtastic,
                                                                googleUsersFromGoogle: data
                                                            });
                                                        }
                                                    }).catch(function (e) {
                                                        reject(e);
                                                    });
                                        });
                                    })
                                    .then(function (ret) {
                                         return new Promise(function (resolve, reject) {    //get all users in mailtastic
                                            employeeService.get()
                                                    .then(function (data) {
                                                        //check if user is no google apps for work admin user
                                                        if(data.success === false){
                                                            alertService.defaultErrorMessage("Sie können sich nur mit Google Synchronisieren, wenn Sie Google Apps for Work nutzen und sich hier mit Ihrem Admin Account anmelden. Als G-Mail Nutzer sind sie nicht automatisch Google Apps for Work Admin.");
                                                             reject();
                                                        }else{
                                                            resolve({
                                                                googleUsersFromMailtastic: ret.googleUsersFromMailtastic,
                                                                googleUsersFromGoogle: ret.googleUsersFromGoogle,
                                                                allEmployeesInMailtastic : data
                                                            });
                                                        }
                                                    }).catch(function (e) {
                                                        reject(e);
                                                    });
                                        });
                                        


                                    })
                                    .then(function (ret) {

                                        //sort all users
                                        $scope.groupMembersGoogle = ret.googleUsersFromMailtastic;


                                        //all users which came from google
                                        $scope.alluserList = ret.googleUsersFromGoogle;

                                        //debanjan
                                        $scope.groupMembersGoogle.forEach(function (item) {
                                            $scope.tempArrayForFilter.splice(1, 0, item);
                                        });
                                        $scope.cuntasyncdt = '';

                                        //count how many employees get synced
                                        $scope.countAsync();


                                        //get sync admin employee object from google list instead of own list
                                        var syncAdminUser = $scope.alluserList.filter(function (item) {
                                            return item.email == $scope.companyInfo.syncAdminEmail;
                                        });
                                        //set syncadmin email and firstname / lastname
                                        if (syncAdminUser.length > 0) {
                                            $scope.syncAdminObject.adminEmail = syncAdminUser[0].email;
                                            $scope.syncAdminObject.name = syncAdminUser[0].firstname + ' ' + syncAdminUser[0].lastname;

                                        }
                                        

                                        var userWhichAreNotYetImported = [];

                                        //get users which are not imported now
                                        for (var i = 0; i < $scope.alluserList.length; i++) {
                                            var result = $.grep($scope.groupMembersGoogle, function (e) {
                                                return e.email == $scope.alluserList[i].email;
                                            });
                                            if (result.length === 0) {
                                                $scope.alluserList[i].isNotYetImported = true;
                                                userWhichAreNotYetImported.push($scope.alluserList[i]);
                                            }
                                            ;
                                        }
                                        
                                        
                                       

                                        //check which users are in system but not already from google
                                        for (var i = 0; i < userWhichAreNotYetImported.length; i++) {
                                            var result = $.grep(ret.allEmployeesInMailtastic, function (e) {
                                                return e.email == userWhichAreNotYetImported[i].email;
                                            });
                                            if (result.length === 1) {
                                               userWhichAreNotYetImported[i].isNotYetManagedByGoogle = true;
                                               userWhichAreNotYetImported[i].isNotYetImported = false;
                                               userWhichAreNotYetImported[i].id = result[0].id;   //get user id to update
                                               userWhichAreNotYetImported[i].currentGroup = result[0].currentGroup;   //When user is moved to be managed by google the group is needed to roll out the signature
                                                
                                              
                                            }
                                            ;
                                        }
                                        //check which of the users are already existing in 
                                        

                                        //add all employees which are not imported yet
                                        $scope.groupMembersGoogle.push.apply($scope.groupMembersGoogle, userWhichAreNotYetImported);
                                        
                                        
                                        //show the users in the list
                                       //$scope.availalableUsersList.toShow.push.apply($scope.groupMembersGoogle, userWhichAreNotYetImported);
                                        //$scope.availalableUsersList.all.push.apply($scope.groupMembersGoogle, userWhichAreNotYetImported);
                                        
                                        //use service
//                                        listHelperService.all = $scope.availalableUsersList.toShow;
//                                        listHelperService.selected = $scope.availalableUsersList.selected;

                                      //check if warning message is shown on top of page
                                        $scope.checkIfOneUserIsNotSynced();


                                    })
                                    .catch(function (e) {
                                        alertService.defaultErrorMessage(Strings.errors.DATEN_NICHT_GELADEN);


                                    });


                        } else {    //nothin was stored before
                            $scope.companyInfo = {
                                syncInfoId: null,
                                admin: '',
                                adminEmail: '',
                                isAutomaticSync: false,
                                isGoogleStructure: true,
                                accessTokenKey: '',
                                isDisconnected: false
                            };

                        }
                    });
                };

                /**
                 * Check if conditions are checked (AGB from google and AGB from mailtastic)
                 * @returns {undefined}
                 */
                $scope.Activecheck = function () {
//            if ($scope.object.isActivecheck == true && $scope.object.isActivecheck != "") {
//                if ($scope.object.isConditionchecked != true) {
//                    alert('haben Sie gelesen und die AGB akzeptiert.?');
//                    $scope.object.isActivecheck = false;
//                }
//
//            }
//
//            if ($scope.object.googleStructurechecked == true && $scope.object.googleStructurechecked != "") {
//                if ($scope.object.isGoogleConditionchecked != true) {
//                    alert('haben Sie gelesen und die AGB akzeptiert.?');
//                    $scope.object.googleStructurechecked = false;
//                }
//            }

                };


                /**
                 * Get DATA from mailtastic admin
                 * @returns {undefined}
                 */
                $scope.getTokenData = function () {
                    userService.getAccountData().then(function (data) {
                        $scope.adminAccount = data;
                        $scope.addGoogleSyncTypes();
                    });
                };

                $scope.getTokenData();


                /**
                 * determine sync type
                 * @param {type} value
                 * @param {type} isEdit
                 * @returns {undefined}
                 */
                $scope.getSyncType = function (value, isEdit) {
                    if (isEdit == false) {
                        $scope.currentSyncType = value;
                        if (value == 'Automatisch (empfohlen)') {
                            $scope.companyInfo.isAutomaticSync = true;
                        } else {
                            $scope.companyInfo.isAutomaticSync = false;
                        }
                    } else {

                        $scope.editSyncType = value;
                        if (value == 'Automatisch (empfohlen)') {
                            $scope.isAutomaticSyncEdit = true;
                        } else {
                            $scope.isAutomaticSyncEdit = false;
                        }

                    }
                };


                /**
                 * Determine sync structure (groups from google or default group?)
                 * @param {type} value
                 * @param {type} isEdit
                 * @returns {undefined}
                 */
                $scope.getSyncStructure = function (value, isEdit) {

                    if (isEdit == false) {
                        $scope.currentStructurType = value;
                        if (value == 'GoogleApp-Strukur übernehmen') {

                            $scope.companyInfo.isGoogleStructure = true;
                        } else {
                            $scope.companyInfo.isGoogleStructure = false;
                        }
                    } else {

                        $scope.editStructurType = value;
                        if (value == 'Automatisch (empfohlen)') {
                            $scope.isGoogleStructureEdit = true;
                        } else {
                            $scope.isGoogleStructureEdit = false;
                        }
                    }
                };

                /**
                 * Open User List
                 * Some kind of INIT Function
                 * @returns {undefined}
                 */
                $scope.open = function () {
                    var dataObject = {};

//            if (/*($scope.object.isConditionchecked == true && $scope.object.isActivecheck == true) &&*/ ($scope.object.googleStructurechecked == true /* && $scope.object.isGoogleConditionchecked == true*/)) {

                    googlesyncservice.getListOfUsers().then(function (response) {
                        
                        
                         if( response.success === false && response.code === 666){
                                                            return alertService.defaultErrorMessage("Sie können sich nur mit Google Synchronisieren, wenn Sie Google Apps for Work nutzen und sich hier mit Ihrem Admin Account anmelden. Als G-Mail Nutzer sind sie nicht automatisch Google Apps for Work Admin.");
                         }
                        
                        
                        
                        $scope.alluserList = response;
                        $scope.syncInfoModel.totalUserCount = $scope.alluserList.length;

                        //get employee list from mailtastic
                        employeeService.get().then(function (data) {
                            $scope.employees = data;

                            //filter and map user lists from google and from mailtastic
                            if ($scope.alluserList.length > 0) {
                                for (var i = 0; i < $scope.alluserList.length; i++) {
                                    var alreadyUsers = $scope.employees.filter(function (item) {
                                        return item.email == $scope.alluserList[i].email;
                                    });

                                    if (alreadyUsers != null && alreadyUsers.length > 0) {
                                        if ((alreadyUsers[0].isFromGoogle == 0) || (alreadyUsers[0].isFromGoogle == 1 && alreadyUsers[0].isSyncActivated == 0)) {
                                            $scope.syncInfoModel.alreadyUserCount = $scope.syncInfoModel.alreadyUserCount + 1;
                                            if ($scope.syncInfoModel.alreadyUsersEmail == '') {
                                                $scope.syncInfoModel.alreadyUsersEmail = alreadyUsers[0].email
                                            } else {
                                                $scope.syncInfoModel.alreadyUsersEmail = $scope.syncInfoModel.alreadyUsersEmail + ' , ' + alreadyUsers[0].email;
                                            }
                                        }
                                    }
                                }
                            }

                            //calculaate amount of importable users
                            $scope.syncInfoModel.syncableMemebersCount = $scope.syncInfoModel.totalUserCount - $scope.syncInfoModel.alreadyUserCount;


                            //IF AUTOMATIC SYNC ENABLED
                            if (/*$scope.returnContent.isAllowed == true &&*/ $scope.companyInfo.isAutomaticSync == true) {

                                //check syncInfoId
                                if ($scope.companyInfo.syncInfoId == null) { //TODO WHY CHECK IF IT IS NULL
                                    //$scope.companyInfo.admin = 'b435e9c6-fde7-4673-94cb-edb01c88d18a';
                                    $scope.companyInfo.admin = '';

                                    //get admin user
                                    var syncAdminUser = $scope.alluserList.filter(function (item) {
                                        return item.isAdmin == true;
                                    });

                                    //set sync admin user email
                                    if (syncAdminUser.length > 0) {
                                        $scope.companyInfo.syncAdminEmail = syncAdminUser[0].email;
                                    }

                                    //if use google structure to create mailtastic groups
                                    if ($scope.companyInfo.isGoogleStructure == true) {

//                                            //create group object
//                                            $scope.group = {
//                                                title: '',
//                                                activeCampaign: null,
//                                                activeSignature: null,
//                                                owner: null,
//                                                isDefault: null,
//                                                createdAt: '',
//                                                updatedAt: ''
//                                            }

                                        //name of group is myGroup in scope
//                                            $scope.group.title = 'myGroup';

                                        //create sync group
//                                            groupsService.addSyncGroup($scope.group).then(function(data) {

                                        //get group ID
//                                                $scope.NewGroupID = data.groupId;

                                        //save new company info object
                                        googlesyncservice.add($scope.companyInfo).then(function (data) {

                                            //TODO CHECK IF SUCCESSFULL
                                            for (var i = 0; i < $scope.alluserList.length; i++) {

                                                //map employees to objects
                                                var empItem = {
                                                    id: '',
                                                    email: $scope.alluserList[i].email,
                                                    firstname: $scope.alluserList[i].firstname,
                                                    lastname: $scope.alluserList[i].lastname,
                                                    currentGroup: null,
                                                    isFromGoogle: true,
                                                    isAutoSync: true,
                                                    adminEmail: $scope.companyInfo.syncAdminEmail,
                                                    isSyncAdmin: false,
                                                    syncAdmin: null,
                                                    isSyncActivated: true,
                                                    group: ""
                                                };

                                                //get admin email object
                                                if ($scope.employees.length > 0) {
                                                    var alreadyExistsUser = $scope.employees.filter(function (item) {
                                                        return (item.email == $scope.alluserList[i].email && item.adminEmail == $scope.companyInfo.syncAdminEmail);
                                                    });
                                                }


                                                //filter users which already exist
                                                if (alreadyExistsUser != null && alreadyExistsUser.length > 0) {
                                                    if (alreadyExistsUser[0].isFromGoogle == 1 && alreadyExistsUser[0].isSyncActivated == 0) {
                                                        empItem.id = alreadyExistsUser[0].id;
                                                        $scope.employeedata.push(empItem);
                                                    }

                                                } else {
                                                    $scope.employeedata.push(empItem);
                                                }

                                            }


                                            //add the users to mailtastic which are new
                                            employeeService.addGoogleSyncedUsers($scope.employeedata).then(function (data) {
                                                $scope.data = data;

                                                //PUSH SIGNATURE TO GOOGLE USERS


                                                //sync employees because new emplolyees were added
                                                paymentService.syncEmployees().then(function (data) {
                                                    $window.location.reload();
                                                });
                                            });

                                        });
//                                            });
                                    } else {

                                        //DO NOT USE GROUPS FROM GOOGLE BUT ADD TO DEFAULT GROUP

                                        googlesyncservice.add($scope.companyInfo).then(function (data) {
                                            for (var i = 0; i < $scope.alluserList.length; i++) {
                                                var empItem = {
                                                    id: '',
                                                    email: $scope.alluserList[i].email,
                                                    firstname: $scope.alluserList[i].firstname,
                                                    lastname: $scope.alluserList[i].lastname,
                                                    currentGroup: null,
                                                    isFromGoogle: true,
                                                    isAutoSync: true,
                                                    adminEmail: $scope.companyInfo.syncAdminEmail,
                                                    isSyncAdmin: false,
                                                    syncAdmin: null,
                                                    isSyncActivated: true
                                                }

                                                //determine users to add to mailtastic
                                                if ($scope.employees.length > 0) {
                                                    var alreadyExistsUser = $scope.employees.filter(function (item) {
                                                        return (item.email == $scope.alluserList[i].email && item.adminEmail == $scope.companyInfo.syncAdminEmail);
                                                    });
                                                }

                                                if (alreadyExistsUser != null && alreadyExistsUser.length > 0) {
                                                    if (alreadyExistsUser[0].isFromGoogle == 1 && alreadyExistsUser[0].isSyncActivated == 0) {
                                                        empItem.id = alreadyExistsUser[0].id;
                                                        $scope.employeedata.push(empItem);
                                                    }

                                                } else {
                                                    $scope.employeedata.push(empItem);
                                                }
                                            }

                                            employeeService.addGoogleSyncedUsers($scope.employeedata).then(function (data) {


                                                //TODO PUSH SIGNATURE TO GOOGLE



                                                $scope.data = data;
                                                paymentService.syncEmployees().then(function (data) {
                                                    $window.location.reload();
                                                });
                                            });

                                        });

                                    }

                                } else {

                                    //save new companyinfo and reload page to restart sync process
                                    googlesyncservice.update($scope.companyInfo).then(function (data) {
                                        $window.location.reload();
                                    });
                                }

                            } else {        //IS MANUAL SYNC
                                $scope.object.currentPage = 'manualSync';


                                //PREPARE USER LISTS TO MARK ALREADY EXISTING USERS AND THOSE HOW ARE NOT EXISTING IN MAILTASTIC
                                if ($scope.alluserList.length > 0) {
                                    for (var i = 0; i < $scope.alluserList.length; i++) {
                                        var alreadyUsers = $scope.employees.filter(function (item) {
                                            return (item.email == $scope.alluserList[i].email);
                                        });


                                        if (alreadyUsers != null && alreadyUsers.length > 0) {
                                            if (alreadyUsers[0].isFromGoogle == 1  /*&& alreadyUsers[0].isSyncActivated == 0 If it is from google it is not importable   */) {

                                            }

                                        } else {
                                            var item = {
                                                id: '',
                                                firstname: $scope.alluserList[i].firstname,
                                                lastname: $scope.alluserList[i].lastname,
                                                email: $scope.alluserList[i].email,
                                                isSyncChecked: true,
                                                group: $scope.alluserList[i].group,
                                                isGooglesynced: true,
                                                isSyncActivated: true

                                            };

                                            $scope.newUsers.splice(1, 0, item);
                                        }
                                    }
                                }

                                $scope.rowCheckItems.allselectedUser = true;
                                $scope.isSelectedAllSyncUsers(true);
                                $scope.recalcAvatars();

                            }

                        });
                    });

//            } else {
//                alertService.defaultErrorMessage('Bitte bestätigen Sie zuerst die AGB');
//            }


                };



                /**
                 * Start to sync selected users manually
                 * If there are no users only store or update companyInfo object and move on
                 * @returns {undefined}
                 */
                $scope.syncManualUsers = function () {

                    $scope.object.currentPage = 'manualSync';
                    //check if agb checked etc

                    //collect all selected users to import later on
                    if ($scope.newUsers.length > 0) {
                        for (var i = 0; i < $scope.newUsers.length; i++) {
                            if ($scope.newUsers[i].isSyncChecked != undefined && $scope.newUsers[i].isSyncChecked == true) {
                                $scope.selectedUsers.push($scope.newUsers[i]);

                            }
                        }

                        $scope.syncInfoModel.syncableMemebersCount = $scope.selectedUsers.length;       //TODO CORRECT?
                    }


                    if ($scope.selectedUsers.length === 0) {
                        var syncAdminUser = $scope.alluserList.filter(function (item) {
                            return item.isAdmin == true;
                        });

                        $scope.companyInfo.admin = '';

                        if (syncAdminUser.length > 0) {
                            $scope.companyInfo.syncAdminEmail = syncAdminUser[0].email;
                        }
                        $scope.companyInfo.accessTokenKey = $scope.Token;


                        if ($scope.companyInfo.syncInfoId) {
                            return googlesyncservice.update($scope.companyInfo).then(function (data) {
                                $window.location.reload();
                            });
                        } else {
                            return googlesyncservice.add($scope.companyInfo).then(function (data) {
                                $window.location.reload();
                            });
                        }



                    }

                    //group object to create
//                $scope.group = {
//                    title: '',
//                    activeCampaign: null,
//                    activeSignature: null,
//                    owner: null,
//                    isDefault: null,
//                    createdAt: '',
//                    updatedAt: ''
//                };

                    //test if companyInfo id is set or not TODO SHOULD BE -1 instead of 0
                    //if sync id is already set reload page to show status page instead of first import page
                    if ($scope.companyInfo.syncInfoId == null) {
                        var syncAdminUser = $scope.alluserList.filter(function (item) {
                            return item.isAdmin == true;
                        });

                        $scope.companyInfo.admin = '';

                        if (syncAdminUser.length > 0) {
                            $scope.companyInfo.syncAdminEmail = syncAdminUser[0].email;
                        }
                        $scope.companyInfo.accessTokenKey = $scope.Token;

                        //start user import process
                        $scope.processGoogleUsersImport($scope.selectedUsers);
                    } else {    //company info is already existing

                        googlesyncservice.update($scope.companyInfo).then(function (data) {
                            $window.location.reload();
                        });
                    }
                };


                /**
                 * show buy dialoge if necessary and process user import
                 */
                $scope.processGoogleUsersImport = function (usersToImport) {
                    paymentService.getUserStatus()  //check user payment status
                            .then(function (data) {
                                if (data.success === false) {     //fehler
                                    alert(Strings.errors.DATEN_NICHT_GELADEN);
                                } else {

                                    if (data.forceAllow == true) { //manuell freigeschaltet
                                        data.showBuyModal = false;
                                        return $q.resolve(data);
                                    } else if (data.hasTestTime === true) {    //noch im test
                                        data.showBuyModal = false;
                                        return $q.resolve(data);
                                    } else if (data.hasSubscription === true) {    //ist zahlkunde
                                        if (data.amountOfFreeMembers >= usersToImport.length  /*$scope.syncInfoModel.syncableMemebersCount*/) {   //hat noch freie
                                            data.showBuyModal = false;
                                            return $q.resolve(data);
                                        } else {      //hat keine freien mitarbeiter mehr
                                            data.showBuyModal = true;
                                            return $q.resolve(data);
                                        }
                                    } else {
                                        //muss erst eine subscription abschließen
                                        //alert("Sie müssen zuerst Ihre Zahlungsdaten angeben, um weitere Mitarbeiter hinzufügen zu können.");
                                        var modalInstance = $uibModal.open({
                                            animation: true,
                                            templateUrl: "booking/accountexpiredmodal/modals/unallowed_action_modal.html",
                                            controller: 'AccountExpiredModalInstanceCtrl',
                                            size: "lg",
                                            windowClass: "expiredmodalcontainer"
                                        });

                                    }
                                }


                            })
                            .then(function (data) {
                                return new Promise(function (resolve, reject) {
                                    if (data.showBuyModal === true) {    //show buy dialog
                                        alertService.importGoogleSyncUsers({
                                            totalAmount: usersToImport.length  /*$scope.syncInfoModel.syncableMemebersCount*/,
                                            validAmount: usersToImport.length  /*$scope.syncInfoModel.syncableMemebersCount*/,
                                            freeAmount: data.amountOfFreeMembers,
                                            alreadyExistant: 0,
                                            emailsAsString: "",
                                            billing_interval: data.billing_interval,
                                            customPrice: data.customPrice
                                        }, function success() {
                                            if (!$("#googlemodalcheckbox").prop("checked")) {
                                                return false;
                                            } else {
                                                document.getElementById('googlemodalcheckbox').value = null; //reset file input
                                                doImport($scope.selectedUsers);
                                            }
                                        }, function error() {
                                            document.getElementById('googlemodalcheckbox').value = null; //reset file input

                                        });
                                    } else {  //dont show buy dialog
                                        doImport($scope.selectedUsers);

                                    }
                                    ;
                                });
                            })

                            .catch(function (e) {
                                alert(Strings.errors.DATEN_NICHT_GELADEN);
                                paymentService.syncEmployees();
                                document.getElementById('googlemodalcheckbox').value = null; //reset file input
                            });





                    function doImport() {
                        //use google structure?=
                        if ($scope.companyInfo.isGoogleStructure == true) {
                            $scope.importUsersWithGoogleStructure(usersToImport);   //do import

                        } else {
                            //DO NOT USE GROUP STRUCTURE FROM GOOGLE
                            $scope.importGoogleUsersOwnGroupStructure(usersToImport);   //do import
                        }

                    }
                };




                /**
                 * Multi selection actions on already connected list
                 * Import all selected
                 */
                $scope.importAllSelectedFromList = function(){
                    var listToImport = [];
                    
                     if($scope.companyInfo.syncInfoId != null  &&  $scope.step.startSync == ''){    //only on already connected list
                     
                        for(var i = 0 ; i < $scope.groupMembersGoogle.length ; i++){
                            if($scope.groupMembersGoogle[i].isSyncChecked == true && $scope.groupMembersGoogle[i].isNotYetImported == true){
                               listToImport.push($scope.groupMembersGoogle[i]);
                            }
                        }
                        
                        if(listToImport.length > 0){
                            $scope.processGoogleUsersImport(listToImport);
                        }else{
                            alertService.defaultErrorMessage("Wählen Sie mindestens einen Benutzer aus, der importiert werden kann.")
                        }
                    }
                };
                
                
                
                  /**
                 * Multi selection actions on already connected list
                 * deactivate all selected
                 */
                $scope.deactivateAllSelectedFromList = function(){
                    if ($scope.companyInfo.isAutomaticSync == false && $scope.companyInfo.syncInfoId != null  &&  $scope.step.startSync == '') { //only with manual sync
                         
                         
                         //collect selected users which are imported and not sync activated
                        var selectedUsersToDeactivate = [];
                      

                           for(var i = 0 ; i < $scope.groupMembersGoogle.length ; i++){
                               if($scope.groupMembersGoogle[i].isSyncChecked == true && $scope.groupMembersGoogle[i].isSyncActivated == true){
                                   
                                   //collect IDS to activate
                                   selectedUsersToDeactivate.push($scope.groupMembersGoogle[i].id);
                               }
                           }

                           if(selectedUsersToDeactivate.length === 0){    //if no users activatable return with message
                               return alertService.defaultErrorMessage("Wählen Sie mindestens einen Benutzer aus, der aktiviert werden kann.")
                           }else{
                               
                               //show modal
                                  $scope.countAsync();
                                  $scope.amountOfUsersToDeactivate = selectedUsersToDeactivate.length;
                                  $scope.selectedUsersToDeactivate = selectedUsersToDeactivate;
                                  
                                    var elementText1 = angular.element('#dgSyncDeActivationModelMany');
                                    elementText1.modal("show");

                              }
                    }
                };
                
                $scope.continueDeactivateAllSelectedFromList = function(){
                    //show modal
                                
                    
                               employeeService.updateSyncActivation($scope.selectedUsersToDeactivate, false).then(function (response) {
                                   if(response.success !== true){
                                    
                                       
                                       alertService.defaultErrorMessage(Strings.errors.DATEN_NICHT_GELADEN);
                                       
                                   }else{
                                        
                                        $scope.countAsync();
                                       var elementText1 = angular.element('#dgSyncDeActivationModelMany');
                                       elementText1.modal("hide");

                                       var elementText2 = angular.element('#dgdeActivationDoneModel');
                                       elementText2.modal("show");
                    
                                    }
                                  
                                        $scope.amountOfUsersToDeactivate = 0;
                                        $scope.selectedUsersToDeactivate = [];
                                       
                                   
                                   $scope.getCompanyInfo();
                                });
                }




                   
                  /**
                 * Multi selection actions on already connected list
                 * activate all selected
                 */
                $scope.activateAllSelectedFromList = function(){
                     if ($scope.companyInfo.isAutomaticSync == false && $scope.companyInfo.syncInfoId != null  &&  $scope.step.startSync == '') { //only with manual sync
                         
                         
                         //collect selected users which are imported and not sync activated
                        var selectedUsersToActivate = [];
                      

                           for(var i = 0 ; i < $scope.groupMembersGoogle.length ; i++){
                               if($scope.groupMembersGoogle[i].isSyncChecked == true && $scope.groupMembersGoogle[i].isSyncActivated == false){
                                   
                                   //collect IDS to activate
                                   selectedUsersToActivate.push($scope.groupMembersGoogle[i].id);
                               }
                           }

                           if(selectedUsersToActivate.length === 0){    //if no users activatable return with message
                               return alertService.defaultErrorMessage("Wählen Sie mindestens einen Benutzer aus, der aktiviert werden kann.")
                           }else{
                               
                               employeeService.updateSyncActivation(selectedUsersToActivate, true).then(function (response) {
                                  
                                    var elementText2 = angular.element('#dgActivationDoneModel');
                                    elementText2.modal("show");
                                            $scope.getCompanyInfo();
                                        });
                            }
                    }
                                //open should do all the initialization stuff
                                


//                                employeeService.getGoogleSyncUsersID($scope.companyInfo.admin, $scope.companyInfo.syncAdminEmail).then(function (data) {
//                                    
//                                    $scope.open();
//                                    
//                                    $scope.groupMembersGoogle = data;
//                                    $scope.countAsync();
//                                    var elementText2 = angular.element('#dgActivationDoneModel');
//                                    elementText2.modal("show");
//
//                                });


                                //$scope.checkIfOneUserIsNotSynced();
//                            });
                               
                               
//                           }
                     
                            

                      

//                    }

                };


                


                /**
                 * import the users into mailtastic
                 */
                $scope.importGoogleUsersOwnGroupStructure = function (usersToImport) {
                    $scope.employeedata = [];
                    googlesyncservice.add($scope.companyInfo).then(function (data) {
                        for (var i = 0; i < usersToImport.length; i++) {
                            var isSyncAdmin = usersToImport[i].email === $scope.companyInfo.syncAdminEmail;

                            var item = {
                                id: usersToImport[i].id,
                                email: usersToImport[i].email,
                                firstname: usersToImport[i].firstname,
                                lastname: usersToImport[i].lastname,
                                currentGroup: null,
                                isFromGoogle: true,
                                isAutoSync: false,
                                adminEmail: $scope.companyInfo.syncAdminEmail,
                                isSyncAdmin: isSyncAdmin,
                                syncAdmin: null,
                                isSyncActivated: true

                            }
                            $scope.employeedata.push(item);
                        }

                        //add google users 
                        employeeService.addGoogleSyncedUsers($scope.employeedata).then(function (data) {
                            $scope.data = data;
                            if (data.success === true) {
                                //sync amount of users and push signature to google employees
                                $q.all([
                                    googlesyncservice.updateSignature(data.empsAdded).catch(),
                                    paymentService.syncEmployees().catch()
                                ])
                                        .then(function () {
//                                            $window.location.reload();
                                    
                                              $scope.getCompanyInfo();
                                    
                                            alertService.defaultSuccessMessage(data.empsAdded.length + " Mitarbeiter wurden erfolgreich importiert und Mailtastic in deren Signatur integriert.");
                                        })
                                        .catch(function (e) {
                                            alertService.defaultSuccessMessage(Strings.errors.DATEN_NICHT_GELADEN);
                                        });
                            }
                        });

                    });

                };


                //use google organization unit as department and import
                $scope.importUsersWithGoogleStructure = function (usersToImport) {


                    //process google groups
                    var promiseList = [];
                    usersToImport.forEach(function (obj, i) {
                        promiseList.push(new Promise(function (resolve, reject) {

                            var tempGroup = {
                                title: '',
                                activeCampaign: null,
                                activeSignature: null,
                                owner: null,
                                isDefault: false,
                                createdAt: '',
                                updatedAt: ''
                            };


                            //get group title for every google employee
                            var parts = obj.group.split("/");
                            var result = parts[parts.length - 1]; // Or parts.pop();

                            tempGroup.title = result;
                            groupsService.addSyncGroup(tempGroup).then(function (data) {
                                var groupId = data.groupId;
                                obj.currentGroup = groupId;
                                resolve();
                            }).catch(function () {
                                reject("could not add sync group");
                            });
                        }));
                    });

                    //wait till all employee groups are correctly set
                    $q.all(promiseList)


                            .then(function () {
                                //save companyInfo
                                return googlesyncservice.add($scope.companyInfo)
                            })
                            .then(function (data) {
                                $scope.employeedata = [];
                                //create employee objects and save in backend
                                for (var i = 0; i < usersToImport.length; i++) {
                                    var item = {
                                        id: usersToImport[i].id,
                                        email: usersToImport[i].email,
                                        firstname: usersToImport[i].firstname,
                                        lastname: usersToImport[i].lastname,
                                        currentGroup: usersToImport[i].currentGroup,
                                        isFromGoogle: true,
                                        isAutoSync: false,
                                        adminEmail: $scope.companyInfo.syncAdminEmail,
                                        isSyncAdmin: false,
                                        syncAdmin: null,
                                        isSyncActivated: true,
                                        group: $scope.NewGroupID
                                    }
                                    $scope.employeedata.push(item);
                                }

                                return  employeeService.addGoogleSyncedUsers($scope.employeedata)

                            })
                            .then(function (data) {//end process = update signature and sync with payment service
                                if (data.success === true) {
                                    //sync amount of users and push signature to google employees
                                    $q.all([
                                        googlesyncservice.updateSignature(data.empsAdded).catch(),
                                        paymentService.syncEmployees().catch()
                                    ])
                                            .then(function () {
                                                //$window.location.reload();
                                                 $scope.getCompanyInfo();
                                        
                                                alertService.defaultSuccessMessage(data.empsAdded.length + " Mitarbeiter wurden erfolgreich importiert. Und mailtastic in deren Signatur integriert.");
                                            })
                                            .catch(function (e) {
                                                alertService.defaultSuccessMessage(Strings.errors.DATEN_NICHT_GELADEN);
                                            });
                                }
                            })
                            .catch(function (e) {
                                alertService.defaultErrorMessage(Strings.errors.DATEN_NICHT_GELADEN);
                            });

                }



                $scope.navigateBack = function () {
                    if ($scope.object.currentPage == "googlesync" && $scope.companyInfo.syncInfoId == null) {
                        $scope.object.currentPage = "newgooglesync";
                        $scope.object = {
                            isConditionchecked: false,
                            isActivecheck: '',
                            googleStructurechecked: '',
                            isGoogleConditionchecked: false,
                            currentPage: 'newgooglesync'

                        };
                    }
                };


              


                $scope.abort = function () {
                    $window.location.reload();
                };

                //LIST SELECTION ACTIONS
                $scope.selectAllUsers = function () {

                };

                $scope.isSelectedAllSyncUsers = function (isAutomaticSync) {
                    if (isAutomaticSync != undefined) {
                        if ($scope.companyInfo.isAutomaticSync == true) {

                            $scope.groupMembersGoogle.forEach(function (item) {

                                item.isSyncChecked = isAutomaticSync;
                            });
                        } else {


                            $scope.newUsers.forEach(function (item) {

                                item.isSyncChecked = isAutomaticSync;
                            });
                        }

                    }
                };

                $scope.isSelectedForAllUsers = function (isAutomaticSync) {
                    if (isAutomaticSync != undefined) {
                        // if ($scope.companyInfo.isAutomaticSync == true) {

                        $scope.groupMembersGoogle.forEach(function (item) {

                            item.isSyncChecked = isAutomaticSync;
                        });
                        // }

                    }
                };




//                $scope.filterUsersList = function (filterText) {
//                    $scope.groupMembersGoogle = $filter('filter')($scope.tempArrayForFilter, filterText, undefined);
//                };

                $scope.order = function (type) {

                    $scope.orderText = type;
                    sortDir = !sortDir;
                    $scope.groupMembersGoogle = orderBy($scope.groupMembersGoogle, $scope.orderText, sortDir);

                };

                $scope.userRowClicked = function (item) {

                };

                $scope.isMultiSelected = function(){
                    if($scope.companyInfo.syncInfoId != null  &&  $scope.step.startSync == ''){
                        var isCheckedCounter = 0;
                        for(var i = 0 ; i < $scope.groupMembersGoogle.length ; i++){
                            if($scope.groupMembersGoogle[i].isSyncChecked){
                                isCheckedCounter++;
                                if(isCheckedCounter > 1){
                                    return true;
                                }
                            }
                        }
                    }
                    
                    return false;
                };

                $scope.isRowSelected = function (item, isManual, index) {

                    if (item != undefined) {
                        $scope.rowCheckItems.allselectedUser = false;
                        if (isManual == true) {
                            $scope.newUsers[index].isSyncChecked = item.isSyncChecked;

                        } else {
                            $scope.groupMembersGoogle[index].isSyncChecked = item.isSyncChecked;
                        }
                    }
                };


                /**
                 * 
                 * @returns {undefined}
                 */
                $scope.countAsync = function () {
                    $scope.cuntasyncdt = 0;
                    for (var i = 0; i <= $scope.groupMembersGoogle.length - 1; i++) {
                        if ($scope.groupMembersGoogle[i].isSyncActivated == 1) {
                            $scope.cuntasyncdt++;
                        }
                    }
                };


                /**
                 * Change user from synced to unsynced and vice versa
                 * @param {type} index
                 * @param {type} value
                 * @returns {undefined}
                 */
                $scope.changeUserStatus = function (item, value) {
                    if ($scope.companyInfo.isAutomaticSync == false) {

                        $scope.selectedGroupMembers = item;

                        if (value == true) {
                            $scope.syncInfoModel = {
                                totalUserCount: 1,
                                alreadyUserCount: 0,
                                alreadyUsersEmail: $scope.selectedGroupMembers.email,
                                syncableMemebersCount: 1,
                                isAccepted: false
                            };

                            $scope.selectedGroupMembers.isSyncActivated = true;
                            employeeService.update($scope.selectedGroupMembers).then(function (data) {

//                                employeeService.getGoogleSyncUsersID($scope.companyInfo.admin, $scope.companyInfo.syncAdminEmail).then(function (data) {
                                    //$scope.groupMembersGoogle = data;
                                    $scope.countAsync();
                                    var elementText2 = angular.element('#dgActivationDoneModel');
                                    elementText2.modal("show");

//                                });



                                //push signature into google account
                                //update google users
                                var groups = [];
                                groups.push(item.currentGroup);
                                googlesyncservice.updateGoogleSignatureForGroups(groups);

                                $scope.getCompanyInfo();
//                                $scope.checkIfOneUserIsNotSynced();


                            });
                        }

                    }

                };


                /**
                 * Add single  user via button in list which is currentyl not in google to mailtastic
                 * @returns {undefined}
                 */
                $scope.importUser = function (item) {
                    
                    var usersToImport = [];
                    usersToImport.push(item);
                    $scope.processGoogleUsersImport(usersToImport);
                    
                };
                
                
                
                
                  /**
                 * Set a user which is already in maitlastic but not synced with google as a google synced user
                 * @returns {undefined}
                 */
                $scope.setUserManagedByGoogle = function (item) {
                    
                    employeeService.setUserManagedByGoogle(item)
                            .then(function(ret){
                                alertService.defaultSuccessMessage("Der Mitarbeiter wird jetzt über den Mailtastic-Google-Sync verwaltet.");
                                //update google users
                                var groups = [];
                                groups.push(item.currentGroup);
                                googlesyncservice.updateGoogleSignatureForGroups(groups);
                                $scope.getCompanyInfo();
                                
                            })
                            .catch(function(e){
                                
                                alertService.defaultErrorMessage(Strings.errors.DATEN_NICHT_GELADEN)
                            });
                    
                };
                


                /**
                 * 
                 * @returns {undefined}
                 */
                $scope.deActivateSelectedUser = function () {
                    $scope.cuntasyncdt = '';
                    $scope.selectedGroupMembers.isSyncActivated = false;
                    employeeService.update($scope.selectedGroupMembers).then(function (data) {

                        //check if warning message is shown
                        $scope.checkIfOneUserIsNotSynced();

//                        employeeService.getGoogleSyncUsersID($scope.companyInfo.admin, $scope.companyInfo.syncAdminEmail).then(function (data) {
//                            $scope.groupMembersGoogle = data;
                            $scope.getCompanyInfo();

//                            $scope.countAsync();
                            var elementText1 = angular.element('#dgSyncDeActivationModel');
                            elementText1.modal("hide");

                            var elementText2 = angular.element('#dgdeActivationDoneModel');
                            elementText2.modal("show");
//                        });

                    });
                };

                /**
                 * check if at least one user is not in synced status
                 * @returns {undefined}
                 */
                $scope.checkIfOneUserIsNotSynced = function () {



                    $scope.isSyncDeActivated = false;
                    //get users for which the sync is deactivated (checkbox in users list)
                    if ($scope.groupMembersGoogle.length > 0) {
                        var syncDeActivatedUsers = $scope.groupMembersGoogle.filter(function (item) {
                            return item.isSyncActivated == false || item.isNotYetImported == true;
                        });
                    }

                    //TODO SYNC DEACITVATEDUSERS MUST ALWAYS BE UNDEFINED
                    if (syncDeActivatedUsers != undefined) {
                        if (syncDeActivatedUsers.length > 0) {
                            $scope.isSyncDeActivated = true;
                        }
                    }


                };

                /**
                 * change from manual sync to automatic sync
                 * @param {type} val
                 * @param {type} isAuto
                 * @returns {undefined}
                 */
                $scope.changeSynchronizationType = function (val, isAuto) {

                    $scope.syncUpdateModel.selectedSetting = val;
                    if (isAuto == true) {
                        $scope.editSyncType = 'Automatisch (empfohlen)';
                        $scope.isAutomaticSyncEdit = true;
                    } else {
                        $scope.editSyncType = 'Manuell';
                        $scope.isAutomaticSyncEdit = false;
                    }

                };


                /**
                 * change from using goole structure for groups to default group and vice versa
                 * @param {type} val
                 * @param {type} isGoogleStruc
                 * @returns {undefined}
                 */
                $scope.changeSynchronizationStructure = function (val, isGoogleStruc) {

                    $scope.syncUpdateModel.selectedSetting = val;
                    if (isGoogleStruc == true) {
                        $scope.editStructurType = 'GoogleApp-Strukur übernehmen';
                        $scope.isGoogleStructureEdit = true;
                    } else {
                        $scope.editStructurType = 'Neue Struktur erstellen';
                        $scope.isGoogleStructureEdit = false;

                    }

                };


                /**
                 * Update sync type for mailtastic admin in mailtastic backend
                 * @returns {undefined}
                 */
                $scope.updateSyncType = function () {
                    $scope.updateContent = {
                        adminID: '',
                        isAutoSync: false
                    };
                    if ($scope.object.isActivecheck == true) {

                        $scope.companyInfo.isAutomaticSync = $scope.isAutomaticSyncEdit;

                        googlesyncservice.update($scope.companyInfo).then(function (data) {
                            $scope.updateContent.adminID = $scope.companyInfo.admin;
                            if ($scope.isAutomaticSyncEdit == true) {
                                $scope.updateContent.isAutoSync = true;
                            } else {
                                $scope.updateContent.isAutoSync = false;
                            }

                            var ids = [];
                            for (var i = 0; i < $scope.groupMembersGoogle.length; i++) {
                                ids.push($scope.groupMembersGoogle[i].id);
                            }

                            employeeService.updateSyncUsersType(ids, $scope.updateContent.isAutoSync).then(function (data) {
                                $window.location.reload();

                            });


                        });
                    } else {
                        alert("haben Sie gelesen und die AGB akzeptiert.?");

                    }

                };



                /**
                 * Update sync structure type for mailtastic admin in mailtastic backend
                 * Every employee which is added after this will treated as configured here
                 * @returns {undefined}
                 */
                $scope.updateSyncStructure = function () {
//                    if ($scope.object.isGoogleConditionchecked == true) {

                        //$scope.companyInfo.isGoogleStructure = $scope.isGoogleStructureEdit;
                        if($scope.editStructurType === "GoogleApp-Strukur übernehmen"){
                             $scope.companyInfo.isGoogleStructure = true;
                        }else if($scope.editStructurType === "Neue Struktur erstellen"){
                               $scope.companyInfo.isGoogleStructure = false;
                            
                        }
                        
                        googlesyncservice.update($scope.companyInfo).then(function (data) {
                            if(data.success === true){
                                $window.location.reload();
                            }else{
                                alertService.defaultErrorMessage(Strings.errors.DATEN_NICHT_GELADEN)
                            }

                        });

                };

            }
        ])
        /**
         * Payment modal TODO should be in called like other payment modals
         * @param {type} $scope
         * @param {type} $modalInstance
         * @param {type} dataObject
         * @param {type} $uibModal
         * @param {type} employeeService
         * @param {type} browseService
         * @param {type} alertService
         * @param {type} googlesyncservice
         * @param {type} authService
         * @param {type} paymentService
         * @returns {undefined}
         */
        .controller('SyncInfoModelInstanceCtrl', ['$scope', '$modalInstance', 'dataObject', '$uibModal', 'employeeService',
            'browseService', 'alertService', 'googlesyncservice', 'authService', 'paymentService',
            function ($scope, $modalInstance, dataObject, $uibModal, employeeService,
                    browseService, alertService, googlesyncservice, authService, paymentService) {


                $scope.syncInfoModel = {
                    totalUserCount: 0,
                    alreadyUserCount: 0,
                    alreadyUsersEmail: '',
                    syncableMemebersCount: 0,
                    isAccepted: false
                };

                $scope.syncInfoModel = dataObject;

                $scope.paymentStatus = {
                    freeUsersCount: 0,
                    amountOfFreeMembers: 0,
                    billing_interval: "",
                    daysLeft: 0,
                    forceAllow: false,
                    hasSubscription: false,
                    hasTestTime: false
                };

                $scope.returnContent = {
                    isAllowed: false
                };


                $scope.getUserStatus = function () {
                    $scope.syncInfoModel.isAccepted = false;
                    paymentService.getUserStatus().then(function (data) {
                        $scope.paymentStatus = data;
                    });
                };


                $scope.getUserStatus();

                $scope.syncGoogleUsers = function () {
                    if ($scope.syncInfoModel.isAccepted == true) {
                        $scope.returnContent.isAllowed = true;
                        $modalInstance.close($scope.returnContent);
                    } else {
                        alert("haben Sie gelesen und die AGB akzeptiert.?");
                    }

                };


                $scope.abortsyncInfoModel = function () {
                    $modalInstance.close();
                };
            }
        ]);