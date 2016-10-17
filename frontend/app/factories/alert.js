/*global define*/
//IS
define([
    'app'
], function (app) {

    'use strict';

    var ALERTTMPL = '<div class="alert alert-dismissible" style="display:none;" ng-class="cssClass" role="alert">' +
                        '<button type="button" class="close" ng-if="dismissable" aria-label="Close" ng-click="remove()">' +
                            '<span aria-hidden="true">&times;</span>' +
                        '</button>' +
                        '<strong>{{title}}</strong>' +
                        '<p>{{content}}</p>' +
                    '</div>';

    app.factory('$alert', [
        '$rootScope',
        '$document',
        '$timeout',
        '$compile',
        function ($rootScope, $document, $timeout, $compile) {
            function createAlert(options) {
                options = angular.extend({
                    scope: null,
                    title: ''
                }, options || {});

                var self = {};
                self.scope = (options.scope || $rootScope).$new();
                self.element = angular.element(ALERTTMPL);

                angular.element(options.element || document.body).prepend(self.element[0]);
                $compile(self.element)(self.scope);

                self.show = function() {
                    if (self.isShown || self.removed) return;
                    self.element.fadeIn(function () {
                        $timeout(function () {
                            self.isShown = true;
                            self.scope.isShown = true;
                            if (options.autoHide) {
                                $timeout(function () {
                                    self.element.fadeOut(function () {
                                        self.remove();
                                    });
                                }, options.timeout || 5000);
                            }
                        });
                    });
                };

                self.hide = function(callback) {
                    callback = callback || angular.noop;
                    if (!self.isShown) return callback();
                    self.element.fadeOut(function () {
                        self.isShown = false;
                        self.scope.isShown = false;
                        return callback();
                    });
                };

                self.remove = function() {
                    if (self.removed) return;

                    self.hide(function() {
                        self.element.remove();
                        self.scope.$destroy();
                    });

                    self.removed = true;
                };

                angular.extend(self.scope, {
                    title: options.title,
                    content: options.content,
                    cssClass: options.cssClass,
                    remove: self.remove,
                    hide: self.hide,
                    dismissable: options.dismissable
                });

                return self;
            }

            var $alert = {
                create: createAlert
            };

            return $alert;
        }]
    );
});