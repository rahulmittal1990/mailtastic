module.exports = function (grunt)
{
    grunt.initConfig({
        clean: {
            release: ["app/build", "app/jsm"]
        },
        'angular-builder': {
            options: {
                mainModule: 'mailtasticApp',
                externalModules: [
                    'angular-loading-bar',
                    'ui.bootstrap',
                    'ui.router',
                    'uiSwitch',
                    'ngFileUpload',
                    'cgBusy',
                    'ui.select',
                    'ngSanitize',
                    'angular-chartist',
                    'color.picker',
                    'LocalStorageModule',
                    'mailtasticApp.modal',
                    'mailtasticApp.modalGroup',
                    'mailtasticApp.modalCampaign',
                    'mailtasticApp.modalEmployee',
                    'mailtasticApp.modalPassReset',
                    'mailtasticApp.groupSigModal',
                    'mailtasticApp.sigEditFieldModal',
                    'mailtasticApp.sigTemplatesModal',
                    'mailtasticApp.employeeEditUserInfoModal',
                    'pascalprecht.translate', 
                   // 'ui.tinymce'
                   'ckeditor'
                  
                ]
            },
            app: {
                src: [
                    'app/app.js',
                    'app/campaigns/**/*.js',
                    'app/assistant/**/*.js',
                    'app/dashboard/**/*.js',
                    'app/employees/**/*.js',
                    'app/factories/**/*.js',
                    'app/groups/**/*.js',
                    'app/help/**/*.js',
                    'app/helpers/**/*.js',
                    'app/versacommerce/**/*.js',
                    'app/locale/en.js',
                    'app/installation/**/*.js',
                    'app/integration/**/*.js',
                    'app/help/**/*.js',
                    'app/login/**/*.js',
                    'app/account/**/*.js',
                    'app/account/**/*.js',
                    'app/services/**/*.js',
                    '!app/services/payment_service.js',
                    'app/register/**/*.js',
                    'app/booking/**/*.js',
                    'app/googlesync/**/*.js',
                    'app/signature/**/*.js',
                    '!app/signature/designer/signatureDesignerTinyMce.js',
                    'app/booking/accountexpiredmodal/expired_modal.js',
                   
                   
                ],
                dest: 'app/jsm/1234565455.js'
            }
    },
        // define source files and their destinations
        uglify: {
            files: {
                src: [
                    'app/helpers/Strings.js',
                    'app/booking/accountexpiredmodal/expired_modal.js',
                  
                    'app/signature/details/addtogroupmodal/group_signature_modal.js',
                    'app/signature/designer/modal/dataedit/dataedit_modal.js',
                    'app/signature/designer/modal/templategallery/sig_templates_modal.js',
                    'app/jsm/1234565455.js',
                   
                    'app/campaigns/modal/campaign_modal.js',
                    'app/employees/modal/employee_modal.js',
                    'app/groups/modal/group_modal.js',
                    'app/login/passwordlost/passwordlost_modal.js',
                    'app/tour/tour_modal.js',
                    'app/helpers/helperfunctions.js',
                    'app/locale/en.js',
                    'app/locale/debug.js',
                    'app/helpers/linegraphtooltip.js',
                    'app/config/Config.js',
                    'app/helpers/avatarhelper.js',
                    'app/employees/details/employeeDataEditModal/employeeUserInfoEdit_modalCtrl.js',
                    
                ], // source files mask
                dest: 'app/jsm/ugly', // destination folder
                expand: true, // allow dynamic building
                flatten: true, // remove all unnecessary nesting
                ext: '.min.js'   // replace .js to .min.js
            }
        },
        concat: {
            options: {
                separator: ';',
            },
            build: {
                files : {
                'app/build/274746484837.js' : ['app/jsm/ugly/*.js'],
                'app/build/lib/987645467484.js' : [
                        'app/libs/jquery/jquery-1.11.3.min.js',
                        'app/bower_components/angular/angular.js',
                        'app/bower_components/angular-sanitize/angular-sanitize.min.js',
                        'app/bower_components/ng-file-upload-shim/ng-file-upload-shim.min.js',
                        'app/bower_components/angular-ui-switch/angular-ui-switch.min.js',
                        'app/bower_components/ng-file-upload/ng-file-upload.min.js',
                        'app/bower_components/angular-local-storage/dist/angular-local-storage.min.js',
                        'app/bower_components/angular-ui-router/release/angular-ui-router.min.js',
                        'app/bower_components/bootstrap/dist/js/bootstrap.min.js',
                        'app/libs/angular-ui-bootstrap/ui-bootstrap.min.js',
                        'app/libs/angular-ui-bootstrap/ui-bootstrap-tpls.min.js',
                        'app/libs/angular-loading-bar/loading-bar.min.js',
                        'app/bower_components/angular-local-storage/dist/angular-local-storage.min.js',
                        'app/libs/bootbox/bootbox.min.js',
                        'app/bower_components/angular-ui-select/dist/select.min.js',
                        'app/bower_components/angular-busy/dist/angular-busy.min.js',
                        'app/libs/moments/moment-with-locales.min.js',
                        'app/libs/daterangep/daterangepicker.js',
                        'app/bower_components/chartist/dist/chartist.min.js',
                        'app/bower_components/angular-chartist/dist/angular-chartist.min.js',
                        'app/bower_components/tinycolor/dist/tinycolor-min.js',
                        'app/bower_components/angularjs-color-picker/angularjs-color-picker.min.js'
                    ]
                }
            }

        }
      
          

            
     



    });

    grunt.loadNpmTasks('grunt-angular-builder');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask('release', ['clean', 'angular-builder', 'uglify', 'concat']);
    // grunt.registerTask('release', ['clean']);
    grunt.registerTask('debug', ['angular-builder::debug']);
    

};