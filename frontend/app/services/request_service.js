'use strict';

	 angular.module('mailtasticApp.services',[]);		//services modul wird initial erstellt TODO auslagern


    angular.module('mailtasticApp.services').service('requestService', [
        '$q',
        '$rootScope',
        '$http',
//        '$alert',
         'StorageFactory',
        // 'browseService',
        function ($q, $rootScope, $http,StorageFactory) {
            var pendingRequests = 0,
                alert,
                // apiUrl = settings.host + '/' + settings.api,
                apiUrl = GlobalConfig.config.apiUrl ,
                badRequest = false,
                pendingRequestsAfterRefresh = [],
                tokenRequested = false,
                noConnection = false;

            function request(params, isConfigRequest) {
                var requestData,
                    errorText = "Error text dict",//,$rootScope.dict.errors.unknownError,
                    header = {},
                    version = '',
                    database = '',
                    authData = {},
                    promise = $q.defer();

                // increment pending request
                pendingRequests = pendingRequests + 1;
                // set loading true to see loading indicator in headerbar
                $rootScope.loading = true;

                if (params.authorization) {
                    authData = StorageFactory.get(['tokenType', 'accessToken']);
                    header.Authorization =   authData.accessToken;
                   // header =  {'X-Requested-By':'abc'};
                  
                }
               
                if (params.resetContentType) {
                    header['Content-Type'] = undefined;
                }
                if (params.store) {
                    header.Store = params.store;
                }

                // build up request object
                requestData = {
                    url: apiUrl,
                    method: params.method,
                    data: params.data || "",
                    headers : header
                };

				// build up request object
                //requestData.data.token = "afbslfhsbaflkshbakjdbhslkadfhkasldfjkasdfhglsf";

                // possibility to transform the request
                if (params.transformRequest) {
                    requestData.transformRequest = params.transformRequest;
                }

                if (!isConfigRequest) {
                    version = params.version ? '/' + params.version : '/v1';
                }

                if (params.timeout) {
                    requestData.timeout = params.timeout;
                }

                requestData.url = requestData.url /*+ version*/ + database + params.url;
				//$http.defaults.headers.common.Authorization = 'Basic YmVlcDpib29w';
                // send request
                //$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

//                $rootScope.loadingPromise =  $http(requestData).then(function (data) {
                       $http(requestData).then(function (data) {
                    // if success -> decrement pending requests
                    pendingRequests -= 1;
					
					//try to parse json
                    if (params.success) {
                    	var data;
                    	try{
                    		data = JSON.parse(data.data);
                    	}catch(e){
                    		data = data.data;
                    	}
                    	
                        params.success(data , promise);
                        
                        
                    } else {
                        // resolve request
                        promise.resolve(data.data);
                    }
                    // if this was the last pending request -> hide loading indicator
                    if (!pendingRequests) {
                        $rootScope.loading = false;
                    }
                }, function (data) {
                    // if success -> decrement pending requests
                    pendingRequests -= 1;
                    // if this was the last pending request -> hide loading indicator
                    if (!pendingRequests) {
                        $rootScope.loading = false;
                    }

                    if (data.status === 500 || data.status === 503 || data.status === 502) {
                        if (!noConnection && !badRequest) {
                            // if no connection to server -> show alert to refresh
                            noConnection = true;

//                            alert = $alert.create({
//                                title:  "Error text dict",//$rootScope.dict.errorTitle,
//                                content:  "Error text dict",//$rootScope.dict.errors.unknownError,
//                                cssClass: 'alert-danger',
//                                dismissable: true,
//                                autoHide: true
//                            });
//                            alert.show();
                        }
                    } else if (data.status === 403 && data.data && data.data.error === 'invalid_authorization') {
                        if ($rootScope.clearLogin) {
                            $rootScope.clearLogin();
                        } else {
                            StorageFactory.remove(StorageFactory.keys);
                            delete $rootScope.loggedIn;
                            delete $rootScope.user;
                            browseService.go('start');
                        }
                    } else {
                        // check if response is 400 -> and there is no badRequest Popup shown
                        if (data.status === 400 && !badRequest && !noConnection) {
                            badRequest = true;
                        }
                        if (params.error) {
                            return params.error(data, promise);
                        }
                    }
                    // request is failing anyway.
                    promise.reject(data);
                });

                return promise.promise;
            }

            function retry(req) {
                request(req.params).then(req.promise.resolve, function (res) {
                    req.promise.reject(res.data);
                });
            }


            function tryOrRefresh(params, q) {
                // try sending request
                request(params).then(q.resolve, function (res) {
                    // if response 401 -> unauthorized
                    if (res.status === 401) {
                        // push request to pendings
                        params.retryIndex = pendingRequests.length;
                        pendingRequestsAfterRefresh.push({promise: q, params: params});
                        // if first unauthorized request
                        if (!tokenRequested) {
                            // block other requests
                            tokenRequested = true;
                            // get storage data
                            var storageData = StorageFactory.get(['dbname', 'accessToken', 'refreshToken', 'expirationTime']);
                            // send refresh request only one time
                            request({
                                method: 'post',
                                url: '/authentication/refresh',
                                database: storageData.dbname,
                                data: {
                                    accessToken: storageData.accessToken,
                                    refreshToken: storageData.refreshToken
                                },
                                success: function (res, promise) {
                                    // refresh localstorage data
                                    StorageFactory.add({
                                        'tokenType': res.tokenType,
                                        'accessToken': res.accessToken,
                                        'refreshToken': res.refreshToken,
                                        'expirationTime': Date.now() + (res.expiresInMinutes * 60 * 1000) - ((res.expiresInMinutes - 1) * 1000 * 60),
                                        'dbname': res.db
                                    });
                                    return promise.resolve(res);
                                },
                                error: function (res, promise) {
                                    // failing refresh -> delete all important data and clear localstorage
                                    if ($rootScope.online && !noConnection) {
                                        if ($rootScope.clearLogin) {
                                            $rootScope.clearLogin();
                                        }
                                    }
                                    promise.reject(res);
                                }
                            }).then(function () {
                                // send all pending Requests
                                angular.forEach(pendingRequestsAfterRefresh, function (req) {
                                    retry(req);
                                });
                                // unlock refresh
                                tokenRequested = false;
                                pendingRequestsAfterRefresh.length = 0;
                            }, function () {
                                // unlock refresh, goto login
                                tokenRequested = false;
                                pendingRequestsAfterRefresh.length = 0;
                                // failing refresh -> delete all important data and clear localstorage
                                if ($rootScope.online && !noConnection) {
                                    if ($rootScope.clearLogin) {
                                        $rootScope.clearLogin();
                                    }
                                }
                            });
                        }
                    } else {
                        q.reject(res);
                    }
                });
            }

            this.send = function (params) {
                var q = $q.defer(),
                    configTask = [];

                // if no config -> load it
                // if (!apiService.config.version) {
// 
                    // // get config request flag to block request sending
                    // configTask.push(request({
                        // method: 'get',
                        // url: '/config',
                        // success: function (res, promise) {
                            // // store config in api service
                            // apiService.config = res;
                            // return promise.resolve(res);
                        // }
                    // }, true));
                // }

                // if new token already requested
                if (tokenRequested) {
                    params.retryIndex = pendingRequests.length;
                    pendingRequestsAfterRefresh.push({promise: q, params: params});
                } else { // ordinary request -> check if it should request new token
                    // send possible config request
                    $q.all(configTask).then(function () {
                        // send original Request
                        tryOrRefresh(params, q);
                    }, function (res) {
                        if ($rootScope.online && !noConnection) {
                            // config request fails -> go to login page and clear data
                            if ($rootScope.clearLogin) {
                                $rootScope.clearLogin();
                            } else {
                                StorageFactory.remove(StorageFactory.keys);
                                delete $rootScope.loggedIn;
                                delete $rootScope.user;
                                browseService.go('start');
                            }
                            q.reject(res.data);
                        }
                    });
                }
                return q.promise;
            };

            // validate date filters
            this.validateDate = function (pager, keys) {
                angular.forEach(pager.filter, function (value, key) {
                    if (!isNaN(Date.parse(value)) && (keys.indexOf(key) !== -1)) {
                        pager.filter[key] = Date.parse(value);
                    }
                });
            };

            // build filter uri
            this.buildFilterURI = function (pager, defaultLimit, dateKeys) {
                var filterString = '',
                    hasPager = pager !== undefined,
                    page;
                pager = pager || {};
                // if default limit -> set default limit
                if (defaultLimit && !pager.limit) {
                    pager.limit = 10;
                }

                // validate dates
                if (dateKeys && dateKeys.length) {
                    this.validateDate(pager, dateKeys);
                }
                // set up uri parts
                page = pager.page ? '?page=' + pager.page : '?page=1';

                var limit = pager.limit ? '&limit=' + pager.limit : '',
                    orderBy = pager.orderBy !== undefined ? '&orderBy=' + pager.orderBy : '',
                    orderDesc = pager.orderDesc !== undefined ? (pager.orderDesc ? '&orderDesc=true' : '&orderDesc=false') : '';

                // if there was pager -> build up filter uri
                if (hasPager) {
                    angular.forEach(pager.filter, function (value, key) {
                        if (value || value === false || value === 0) {
                            filterString = filterString + '&filter=' + key + '&value=' + value;
                        }
                    });
                    return page + limit + filterString + orderBy + orderDesc;
                }
                // return only page
                return page + limit;
            };

            // transform timestamps into dates
            this.setPagerDates = function (newPager, oldPager, datekeys) {
                if (oldPager.filter && newPager.filter) {
                    angular.forEach(datekeys, function (value) {
                        if (!isNaN(Date.parse(oldPager.filter[value])) && oldPager.filter[value] !== undefined && newPager.filter[value] !== undefined) {
                            newPager.filter[value] = new Date(newPager.filter[value]);
                        }
                    });
                }
                return newPager;
            };
        }
    ]);

