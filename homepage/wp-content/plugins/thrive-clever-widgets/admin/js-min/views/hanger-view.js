/*! Thrive Clever Widgets 2016-04-13
* http://www.thrivethemes.com 
* Copyright (c) 2016 * Thrive Themes */
var tcw_app=tcw_app||{};!function(){"use strict";tcw_app.HangerView=Backbone.View.extend({render:function(){var a=_.template(jQuery("#hanger-template").html())(this.model.toJSON()),b=this;this.$el.html(a),this.$tabLabelsContainer=this.$el.find(".tcw_tabs"),this.$tabContentsContainer=this.$el.find(".tcw_tabs_content_wrapper"),_.each(this.model.get("tabs").models,function(a){var c=b.renderTabLabels(a),d=b.renderTabContent(a);a.on("change:isActive",_.bind(b.activateTab,b,c,d)),a.on("change",_.bind(function(){"hide_widget_options"===this.model.get("identifier")?jQuery("#exclusions-count").html("("+this.model.countCheckedOptions()+")"):jQuery("#inclusions-count").html("("+this.model.countCheckedOptions()+")")},b,a))}),this.model.get("tabs").at(0).set("isActive",!0)},renderTabLabels:function(a){var b=new tcw_app.TabLabelView({model:a});return this.$tabLabelsContainer.append(b.el),b.render(),b},renderTabContent:function(a){var b=new tcw_app.TabContentView({model:a});return this.$tabContentsContainer.append(b.el),b.render(),b},activateTab:function(a,b,c,d){this.$tabLabelsContainer.find("li").removeClass(a.activeClass),this.$tabContentsContainer.find(".tcw_tabs_content").hide(),a.$el.addClass(a.activeClass),b.$el.show(),c.attributes.isActive=!1}})}(jQuery);