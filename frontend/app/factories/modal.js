/*global define*/
define([
    'app'
], function (app) {

    'use strict';

    var MODAL_TMPL = '<div class="modal fade" id="{{modalId}}" role="dialog">' +
                        '<div class="modal-dialog modal-lg">' +
                            '<div class="modal-content" ng-class="baseClass">' +
                                '<div class="modal-header" ng-if="header">' +
                                '</div>' +
                                '<div class="modal-body" ng-if="body">' +
                                '</div>' +
                                '<div class="modal-footer" ng-if="footer">' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>',
        TMPL_PARTS = ['header', 'body', 'footer'];

    app.factory('$modal', [
            '$rootScope',
            '$document',
            '$timeout',
            '$compile',
            '$http',
            '$templateCache',
            '$q',
            function ($rootScope, $document, $timeout, $compile, $http, $templateCache, $q) {

                function loadTemplate(template, type) {
                    var q = $q.defer();

                    if (type === 'template' || !type) {
                        q.resolve(template);
                    } else {
                        $http.get(template, {cache: $templateCache}).then(function(response) {
                            return q.resolve(response.data && response.data.trim());
                        }, q.reject);
                    }

                    return q.promise;
                }

                function createModal(options) {
                    var modalPromise = $q.defer(),
                        loadingTasks = [],
                        tmpElement;

                    options = angular.extend({
                        scope: null,
                        templateUrl: ''
                    }, options || {});

                    var self = {};
                    self.scope = (options.scope || $rootScope).$new();

                    // set options on scope
                    self.scope.baseClass = options.baseClass;
                    self.scope.modelId = options.modelId;

                    // loop through modal parts
                    TMPL_PARTS.forEach(function (part) {
                        // check if template string
                        if (options[part + 'Template']) {
                            self.scope[part] = 'template';
                            loadingTasks.push(loadTemplate(options[part + 'Template'], self.scope[part]));
                        } else if (options[part + 'TemplateUrl']) {
                            // check if templateUrl
                            self.scope[part] = 'templateUrl';
                            loadingTasks.push(loadTemplate(options[part + 'TemplateUrl'], self.scope[part]));
                        } else {
                            // no template --> return empty string
                            loadingTasks.push('');
                        }
                    });

                    // load all templates
                    $q.all(loadingTasks).then(function (templatePartStrings) {
                        $timeout(function () {
                            // create base modal
                            self.element = angular.element(MODAL_TMPL);
                            // fill parts
                            TMPL_PARTS.forEach(function (part, index) {
                                if (templatePartStrings[index]) {
                                    tmpElement = angular.element(templatePartStrings[index]);
                                    self.element.find('.modal-' + part).prepend(tmpElement);
                                }
                            });
                            // set controller
                            if (options.controller) {
                                self.element.attr('ng-controller', options.controller);
                            }
                            // compile modal
                            $compile(self.element)(self.scope);
                            // append modal to dom
                            angular.element(options.element || document.body).prepend(self.element[0]);

                            if (options.zIndex) {
                                self.element.css('z-index', options.zIndex);
                            }

                            // Add modal functions
                            self.show = function () {
                                var q = $q.defer();
                                self.element.modal('show');
                                self.element.on('shown.bs.modal', function () {
                                    $timeout(function () {
                                        self.isShown = true;
                                        q.resolve();
                                    });
                                });

                                return q.promise;
                            };

                            self.hide = function () {
                                var q = $q.defer();
                                self.element.modal('hide');
                                self.element.on('hidden.bs.modal', function () {
                                    $timeout(function () {
                                        self.isShown = false;
                                        q.resolve();
                                    });
                                });

                                return q.promise;
                            };

                            angular.extend(self.scope, {
                                hide: self.hide,
                                show: self.show,
                                dismissable: options.dismissable
                            });

                            return modalPromise.resolve(self);
                        });
                    });
                    return modalPromise.promise;
                }

                var $modal = {
                    create: createModal
                };

                return $modal;
            }]
    );
});
