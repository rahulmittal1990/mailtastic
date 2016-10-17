/*! Thrive Leads - The ultimate Lead Capture solution for wordpress - 2016-05-04
* https://thrivethemes.com 
* Copyright (c) 2016 * Thrive Themes */
var ThriveLeads=ThriveLeads||{};jQuery(function(){ThriveLeads.objects.titleChanger=new ThriveLeads.models.PageTitle({default_title:document.title}),ThriveLeads.objects.titleChanger.on("title_change",function(a){document.title=a});var a=Backbone.Router.extend({routes:{dashboard:"dashboard","form-type/:id":"formTypeEdit","shortcode/:id":"shortcodeEdit","2step-lightbox/:id":"twoStepLightboxEdit","triggers/:form_type_id/:variation_key":"triggerEdit","test/:id(/:completed)":"viewTest","position/:form_type_id/:variation_key":"positionEdit"},dashboard:function(){TVE_Dash.hideLoader(),ThriveLeads.objects.DashboardView||(ThriveLeads.objects.DashboardView=new ThriveLeads.views.Dashboard(TVE_Page_Data)),ThriveLeads.objects.BreadcrumbsCollection.length>2&&ThriveLeads.objects.BreadcrumbsCollection.reset(ThriveLeads.objects.BreadcrumbsCollection.first(2)),ThriveLeads.objects.DashboardView.render();var a=new ThriveLeads.views.Breadcrumbs({collection:ThriveLeads.objects.BreadcrumbsCollection,el:"#tve-leads-breadcrumbs"});a.render()},shortcodeEdit:function(a){return a?(TVE_Dash.showLoader(),ThriveLeads.objects.FormTypeView&&ThriveLeads.objects.FormTypeView.undelegateEvents(),ThriveLeads.objects.TwoStepLightboxEditView&&ThriveLeads.objects.TwoStepLightboxEditView.undelegateEvents(),ThriveLeads.objects.Shortcode?(ThriveLeads.objects.ShortcodeEditView.FLAG_skipListener=!0,ThriveLeads.objects.Shortcode.set("ID",a),ThriveLeads.objects.ShortcodeEditView.clear()):(ThriveLeads.objects.Shortcode=new ThriveLeads.models.Shortcode({ID:a}),ThriveLeads.objects.ShortcodeEditView=new ThriveLeads.views.FormTypeEdit({model:ThriveLeads.objects.Shortcode})),void ThriveLeads.objects.Shortcode.fetch({error:_.partial(ThriveLeads.errorHandler,"#dashboard")}).always(function(b){var c=ThriveLeads.objects.BreadcrumbsCollection.at(ThriveLeads.objects.BreadcrumbsCollection.length-1);c.set({last:0}),ThriveLeads.objects.BreadcrumbsCollection.length>2&&ThriveLeads.objects.BreadcrumbsCollection.reset(ThriveLeads.objects.BreadcrumbsCollection.first(2)),ThriveLeads.objects.BreadcrumbsCollection.add({name:"Lead Shortcodes",url:"#shortcode/"+a}),_.isObject(b)&&b.redirect_to&&ThriveLeads.router.navigate(b.redirect_to,{trigger:!0})})):void ThriveLeads.router.navigate("#dashboard",{trigger:!0})},twoStepLightboxEdit:function(a){return a?(TVE_Dash.showLoader(),ThriveLeads.objects.FormTypeView&&ThriveLeads.objects.FormTypeView.undelegateEvents(),ThriveLeads.objects.ShortcodeEditView&&ThriveLeads.objects.ShortcodeEditView.undelegateEvents(),ThriveLeads.objects.TwoStepLightbox?(ThriveLeads.objects.TwoStepLightboxEditView.FLAG_skipListener=!0,ThriveLeads.objects.TwoStepLightbox.set("ID",a),ThriveLeads.objects.TwoStepLightboxEditView.clear()):(ThriveLeads.objects.TwoStepLightbox=new ThriveLeads.models.TwoStepLightbox({ID:a}),ThriveLeads.objects.TwoStepLightboxEditView=new ThriveLeads.views.FormTypeEdit({model:ThriveLeads.objects.TwoStepLightbox})),void ThriveLeads.objects.TwoStepLightbox.fetch({error:_.partial(ThriveLeads.errorHandler,"#dashboard")}).always(function(b){var c=ThriveLeads.objects.BreadcrumbsCollection.at(ThriveLeads.objects.BreadcrumbsCollection.length-1);c.set({last:0}),ThriveLeads.objects.BreadcrumbsCollection.length>2&&ThriveLeads.objects.BreadcrumbsCollection.reset(ThriveLeads.objects.BreadcrumbsCollection.first(2)),ThriveLeads.objects.BreadcrumbsCollection.add({name:"ThriveBox",url:"#2step-lightbox/"+a}),_.isObject(b)&&b.redirect_to&&ThriveLeads.router.navigate(b.redirect_to,{trigger:!0})})):void ThriveLeads.router.navigate("#dashboard",{trigger:!0})},formTypeEdit:function(a){return a?(TVE_Dash.showLoader(),ThriveLeads.objects.ShortcodeEditView&&ThriveLeads.objects.ShortcodeEditView.undelegateEvents(),ThriveLeads.objects.TwoStepLightboxEditView&&ThriveLeads.objects.TwoStepLightboxEditView.undelegateEvents(),ThriveLeads.objects.FormType?(ThriveLeads.objects.FormTypeView.FLAG_skipListener=!0,ThriveLeads.objects.FormType.set("ID",a),ThriveLeads.objects.FormTypeView.clear()):(ThriveLeads.objects.FormType=new ThriveLeads.models.FormType({ID:a}),ThriveLeads.objects.FormTypeView=new ThriveLeads.views.FormTypeEdit({model:ThriveLeads.objects.FormType})),void ThriveLeads.objects.FormType.fetch({error:_.partial(ThriveLeads.errorHandler,"#dashboard")}).always(function(b){var c=ThriveLeads.objects.BreadcrumbsCollection.at(ThriveLeads.objects.BreadcrumbsCollection.length-1);c.set({last:0}),ThriveLeads.objects.BreadcrumbsCollection.length>2&&ThriveLeads.objects.BreadcrumbsCollection.reset(ThriveLeads.objects.BreadcrumbsCollection.first(2)),ThriveLeads.objects.BreadcrumbsCollection.add({name:b.post_title,url:"#form-type/"+a}),_.isObject(b)&&b.redirect_to&&ThriveLeads.router.navigate(b.redirect_to,{trigger:!0})})):void ThriveLeads.router.navigate("#dashboard",{trigger:!0})},triggerEdit:function(a,b){ThriveLeads.ajaxModal({url:ThriveLeads["const"].url.admin+"admin-ajax.php?width=700&height=350&action=thrive_leads_backend_ajax&route=triggerSettings&form_type_id="+a+"&variation_key="+b,"max-width":"45%",view:ThriveLeads.views.TriggerSettings,form_type_id:a,variation_key:b})},positionEdit:function(a,b){ThriveLeads.ajaxModal({url:ThriveLeads["const"].url.admin+"admin-ajax.php?width=700&height=350&action=thrive_leads_backend_ajax&route=positionSettings&form_type_id="+a+"&variation_key="+b,view:ThriveLeads.views.PositionSettings,form_type_id:a,variation_key:b})},viewTest:function(a,b){TVE_Dash.showLoader();var c=new ThriveLeads.models.Test({id:parseInt(a)}),d=new ThriveLeads.views.Test({model:c});b&&(d.collection=new ThriveLeads.collections.Tests),c.fetch({success:function(){d.render();var a=ThriveLeads.objects.BreadcrumbsCollection.at(ThriveLeads.objects.BreadcrumbsCollection.length-1);a.set({last:0}),ThriveLeads.objects.BreadcrumbsCollection.add({name:d.model.get("title"),url:""});var b=new ThriveLeads.views.Breadcrumbs({collection:ThriveLeads.objects.BreadcrumbsCollection,el:"#tve-leads-breadcrumbs"});b.render(),TVE_Dash.hideLoader()},error:_.partial(ThriveLeads.errorHandler,"#dashboard")})}});ThriveLeads.router=new a,Backbone.history.start({hashChange:!0})});