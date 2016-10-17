/*! Thrive Leads - The ultimate Lead Capture solution for wordpress - 2016-05-04
* https://thrivethemes.com 
* Copyright (c) 2016 * Thrive Themes */
var ThriveLeads=ThriveLeads||{};ThriveLeads.models=ThriveLeads.models||{},ThriveLeads.models.Assets=Backbone.Model.extend({idAttribute:"ID",defaults:function(){return{ID:"",post_content:"",post_subject:"",details_expanded:!1,active_test:null}},initialize:function(){var a=new ThriveLeads.collections.AssetFiles(this.get("files"));this.set("files",a)},url:function(){return ThriveLeads.ajaxurl("action=thrive_leads_backend_ajax&route=assets&ID="+this.get("ID"))},validate:function(a){var b={},c=!0;return a.post_title.length<=0&&(b.post_title=ThriveLeads["const"].translations.AssetGroupNameRequired,c=!1),c?void 0:b}}),ThriveLeads.collections.Assets=Backbone.Collection.extend({model:ThriveLeads.models.Assets}),ThriveLeads.models.AssetFile=Backbone.Model.extend({idAttribute:"ID",defaults:function(){return{parent_ID:"",name:"",link_anchor:"",link:""}},url:function(){return ThriveLeads.ajaxurl("action=thrive_leads_backend_ajax&route=filesAdd&parent_ID="+this.get("parent_ID")+"&ID="+this.get("ID"))},validate:function(a){var b={},c=!0;a.name.length<=0&&(b.name=ThriveLeads["const"].translations.AssetFileNameRequired,c=!1),a.link_anchor.length<=0&&(b.link_anchor=ThriveLeads["const"].translations.AssetFileAnchorRequired,c=!1),a.link.length<=0&&(b.link=ThriveLeads["const"].translations.AssetFileLinkRequired,c=!1);var d=/[-a-zA-Z0-9@:%_\+.~#?&\/\/=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)?/gi,e=new RegExp(d);return a.link.match(e)?c=!0:(b.link=ThriveLeads["const"].translations.AssetFileLinkRequired,c=!1),c?void 0:b}}),ThriveLeads.collections.AssetFiles=Backbone.Collection.extend({model:ThriveLeads.models.AssetFile}),ThriveLeads.models.AssetWizard=Backbone.Model.extend({idAttribute:"ID",defaults:function(){return{proprieties:{connections:0,template:0,files:0},connected_apis:{},email_data:{},structured_apis:{},ID:"",files:"",post_content:"",post_subject:"",details_expanded:!1}},url:function(){return ThriveLeads.ajaxurl("action=thrive_leads_backend_ajax&route=wizardAdd&ID="+this.get("ID"))}}),ThriveLeads.models.AssetWizardConnection=Backbone.Model.extend({idAttribute:"ID",defaults:function(){return{connection:"",active:"",connection_instance:""}}}),ThriveLeads.collections.AssetConnection=Backbone.Collection.extend({model:ThriveLeads.models.AssetWizardConnection});