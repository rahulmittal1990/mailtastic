module.exports = function(config){
  config.set({

    basePath : './',

    files : [

      'app/libs/jquery/jquery-1.11.3.min.js',
      /*'bower_components/chartist/dist/chartist.min.js',
      'bower_components/angular-chartist/dist/angular-chartist.min.js',*/
      
      'app/bower_components/angular/angular.js',
      'app/bower_components/angular-route/angular-route.js',
      'app/bower_components/angular-translate/angular-translate.min.js',
      'app/bower_components/angular-translate/angular-translate.min.js',
      'app/libs/bootbox/bootbox.min.js',
      'app/bower_components/angular-ui-router/release/angular-ui-router.min.js',
      'app/libs/angular-ui-bootstrap/ui-bootstrap.min.js',
      'app/bower_components/bootstrap-select/dist/js/bootstrap-select.min.js',
      'app/bower_components/bootstrap/dist/js/bootstrap.min.js',
      'app/libs/angular-ui-bootstrap/ui-bootstrap-tpls.min.js',
      'app/bower_components/angular-mocks/angular-mocks.js',
      'app/bower_components/angular-local-storage/dist/angular-local-storage.min.js',
      'app/factories/storage.js',
      'app/components/**/*.js',
      'app/helpers/Strings.js',
      'tests/*.js',
      'tests/Campaigns/Campaign_Controllers/CampaignsCtrl_Test.js',
      'tests/Campaigns/Campaign_Controllers/CampaignListCtrl_Test.js',
      //'tests/Campaigns/Campaign_Controllers/*.js',
      //'tests/groups/details/groupDetailsCtrl_Test.js',
      //'tests/groups/list/groupListCtrl_Test.js',
      //'tests/groups/model/groupModelCtrl_Test.js',
      'tests/Employees/employeeCtrl_test.js',
      'tests/Employees/employeeService_test.js',
      'tests/Booking/*.js',
      //'tests/Dashboard/*.js',
      'tests/Tour_model/*.js',
     //'tests/Login/*.js',
      'tests/Register/*.js',
      'tests/Integration/*.js',
      'tests/installation/*.js',
      'tests/activation/*.js',
      'app/config/*.js',
      'app/dashboard/dashboard.js',
      'app/dashboard/modal/*.js',
      'app/booking/booking.js',
      'app/campaigns/campaigns.js',
      'app/campaigns/modal/*.js',
      'app/employees/employees.js',
      'app/register/*.js',
      'app/employees/modal/*.js',
      'app/tour/*.js',
      'app/login/*.js',
      'app/integration/*.js',
      'app/installation/*.js',
      'app/groups/details/*.js',
      'app/groups/list/*.js',
      'app/groups/modal/*.js',
      'app/googlesync/googlesync.js',
      'app/services/request_service.js',
      'app/services/groups_service.js',
      'app/services/employees_service.js',
      'app/services/campaigns_service.js',
      'app/services/signaturehelper.js',
      'app/services/browse.js',
      'app/services/browser.js',
      'app/services/user_service.js',
      'app/services/payment.js',
      'app/services/authService.js',
      'app/services/browse.js',
      'app/services/alert.js',
      'app/services/signature_service.js',
      'app/services/intercom_service.js',
      'app/services/googlesync_service.js',
     
    
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers: ['PhantomJS', 'PhantomJS_custom'],

    // you can define custom flags
    customLaunchers: {
      'PhantomJS_custom': {
        base: 'PhantomJS',
        options: {
          windowName: 'my-window',
          settings: {
            webSecurityEnabled: false
          },
        },
        flags: ['--load-images=true'],
        debug: true
      }
    },

    phantomjsLauncher: {
      // Have phantomjs exit if a ResourceError is encountered (useful if karma exits without killing phantom)
      exitOnResourceError: true
    },

    debug : true,

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};
