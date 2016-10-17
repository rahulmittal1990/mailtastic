'use strict';
// angular.module('mailtasticApp.modal',[]);
angular.module('mailtasticApp.sigTemplatesModal', [])

        .controller('SigTemplatesModalCtrl',
                [
                    '$scope',
                    '$modalInstance',
                    'alertService',
                    '$http',
                    function ($scope, $modalInstance,  alertService, $http) {

                        $scope.modaloptions = {
                            heading: "",
                            headingAddition: "",
                            mode: "create"
                        };

                        $scope.templates = [
                            
                            {
                                title : "#1",
                                //previewPath : "signature/designer/modal/templategallery/templates/1.html",
                                //templateCode : '<span style="color: #333333;"><strong>{{ma_vorname}}&nbsp;{{ma_nachname}}</strong></span><br /><span style="color: #333333;">{{ma_position}}</span><br /><br /> <table style="height: 64px; width: 321px;"> <tbody> <tr> <td style="width: 26px;"><span style="color: #009fe3; line-height: 1;">t.</span></td> <td style="width: 283px;"><span style="line-height: 1;">{{ma_tel}}</span></td> </tr> <tr> <td style="width: 26px;"><span style="color: #009fe3; line-height: 1;">m.</span></td> <td style="width: 283px;"><span style="line-height: 1;">{{ma_mobil}}</span></td> </tr> <tr> <td style="width: 26px;"><span style="color: #009fe3; line-height: 1;">e.</span></td> <td style="width: 283px;"><span style="line-height: 1;">{{ma_email}}</span></td> </tr> <tr> <td style="width: 26px;"><span style="color: #009fe3; line-height: 1;">w.</span></td> <td style="width: 283px;"><span style="line-height: 1;">{{u_website}}</span></td> </tr> </tbody> </table> <br /><br /><span style="color: #333333;">{{u_logo}}<br /><br /></span><span style="color: #009fff;">{{u_name}}<br /></span>{{u_strasse}}<br />{{u_ort}}<br /><br />{{u_twitter}}&nbsp;{{u_fb}}&nbsp;{{u_googlep}}<br /><br />Amtsgericht Offenbach<br />HRB 46312<br />Gesch&auml;ftsf&uuml;hrer: Tao Bauer, Claudio Como,<br />Andreas Schr&ouml;der, Peer Wierzbitzki<br /><br /><span style="color: #009fe3;">-</span><br /><br />{{kampagnen_banner}}',
                                previewImagePath : "signature/designer/modal/templategallery/templates/1.jpg",
                        
                            },
                             {
                                title : "#2",
                                //previewPath : "signature/designer/modal/templategallery/templates/2.html",
                                previewImagePath : "signature/designer/modal/templategallery/templates/2.jpg",
                                //templateCode : '<strong>{{mitarbeiter_vorname}} {{mitarbeiter_nachname}}</strong> <br />{{mitarbeiter_position}}<br /><br />{{u_logo}}<br /><br /><span style="color: #999999;">{{u_name}}</span><br /><span style="color: #999999;">{{u_strasse}}</span><br /><span style="color: #999999;">{{u_ort}}</span><br /><br /><span style="color: #999999;">Office: {{mitarbeiter_tel}}</span><br /><span style="color: #999999;">Mobil:&nbsp;{{mitarbeiter_mobil}}</span><br /><br /><span style="color: #999999;">E-Mail: {{mitarbeiter_email}}</span><br /><br />{{u_disclaimer}}<br /><br />-<br /><br />{{kampagnen_banner}}'
                          
                            },
                             {
                                title : "#3",
                                //previewPath : "signature/designer/modal/templategallery/templates/3.html",
                                previewImagePath : "signature/designer/modal/templategallery/templates/3.jpg",
                                //templateCode : '<strong>{{mitarbeiter_vorname}} {{mitarbeiter_nachname}}</strong> <br />{{mitarbeiter_position}}<br /><br />{{u_logo}}<br /><br /><span style="color: #999999;">{{u_name}}</span><br /><span style="color: #999999;">{{u_strasse}}</span><br /><span style="color: #999999;">{{u_ort}}</span><br /><br /><span style="color: #999999;">Office: {{mitarbeiter_tel}}</span><br /><span style="color: #999999;">Mobil:&nbsp;{{mitarbeiter_mobil}}</span><br /><br /><span style="color: #999999;">E-Mail: {{mitarbeiter_email}}</span><br /><br />{{u_disclaimer}}<br /><br />-<br /><br />{{kampagnen_banner}}'
                          
                            }
//                            ,
//                             {
//                                title : "#4",
//                                //previewPath : "signature/designer/modal/templategallery/templates/4.html",
//                                previewImagePath : "signature/designer/modal/templategallery/templates/4.jpg",
//                              //  templateCode : '<strong>{{mitarbeiter_vorname}} {{mitarbeiter_nachname}}</strong> <br />{{mitarbeiter_position}}<br /><br />{{u_logo}}<br /><br /><span style="color: #999999;">{{u_name}}</span><br /><span style="color: #999999;">{{u_strasse}}</span><br /><span style="color: #999999;">{{u_ort}}</span><br /><br /><span style="color: #999999;">Office: {{mitarbeiter_tel}}</span><br /><span style="color: #999999;">Mobil:&nbsp;{{mitarbeiter_mobil}}</span><br /><br /><span style="color: #999999;">E-Mail: {{mitarbeiter_email}}</span><br /><br />{{u_disclaimer}}<br /><br />-<br /><br />{{kampagnen_banner}}'
//                          
//                            },
,
                             {
                                title : "#4",
                                //previewPath : "signature/designer/modal/templategallery/templates/5.html",
                                previewImagePath : "signature/designer/modal/templategallery/templates/5.jpg",
                                //templateCode : '<strong>{{mitarbeiter_vorname}} {{mitarbeiter_nachname}}</strong> <br />{{mitarbeiter_position}}<br /><br />{{u_logo}}<br /><br /><span style="color: #999999;">{{u_name}}</span><br /><span style="color: #999999;">{{u_strasse}}</span><br /><span style="color: #999999;">{{u_ort}}</span><br /><br /><span style="color: #999999;">Office: {{mitarbeiter_tel}}</span><br /><span style="color: #999999;">Mobil:&nbsp;{{mitarbeiter_mobil}}</span><br /><br /><span style="color: #999999;">E-Mail: {{mitarbeiter_email}}</span><br /><br />{{u_disclaimer}}<br /><br />-<br /><br />{{kampagnen_banner}}'
                          
                            },
//                            ,
//                             {
//                                title : "#6",
//                                //previewPath : "signature/designer/modal/templategallery/templates/6.html",
//                                previewImagePath : "signature/designer/modal/templategallery/templates/6.jpg",
//                                //templateCode : '<strong>{{mitarbeiter_vorname}} {{mitarbeiter_nachname}}</strong> <br />{{mitarbeiter_position}}<br /><br />{{u_logo}}<br /><br /><span style="color: #999999;">{{u_name}}</span><br /><span style="color: #999999;">{{u_strasse}}</span><br /><span style="color: #999999;">{{u_ort}}</span><br /><br /><span style="color: #999999;">Office: {{mitarbeiter_tel}}</span><br /><span style="color: #999999;">Mobil:&nbsp;{{mitarbeiter_mobil}}</span><br /><br /><span style="color: #999999;">E-Mail: {{mitarbeiter_email}}</span><br /><br />{{u_disclaimer}}<br /><br />-<br /><br />{{kampagnen_banner}}'
//                          
//                            },
                             {
                                title : "#5",
                                //previewPath : "signature/designer/modal/templategallery/templates/7.html",
                                previewImagePath : "signature/designer/modal/templategallery/templates/7.jpg",
                               // templateCode : '<strong>{{mitarbeiter_vorname}} {{mitarbeiter_nachname}}</strong> <br />{{mitarbeiter_position}}<br /><br />{{u_logo}}<br /><br /><span style="color: #999999;">{{u_name}}</span><br /><span style="color: #999999;">{{u_strasse}}</span><br /><span style="color: #999999;">{{u_ort}}</span><br /><br /><span style="color: #999999;">Office: {{mitarbeiter_tel}}</span><br /><span style="color: #999999;">Mobil:&nbsp;{{mitarbeiter_mobil}}</span><br /><br /><span style="color: #999999;">E-Mail: {{mitarbeiter_email}}</span><br /><br />{{u_disclaimer}}<br /><br />-<br /><br />{{kampagnen_banner}}'
                          
                            }
                            
                        ];


                    

                        $scope.initData = function () {
                           
                          
                        };


                        //user has chosen template so close dialog and provide index
                        $scope.chooseTemplate = function(index){
                            
                            
                            if($scope.templates[index]){
                               // $scope.ok($scope.templates[index].templateCode);
                                
                                var url = "signature/designer/modal/templategallery/templates/" + (index+1) + ".html";
                                $http.get(url).then(function(result){
                                    $scope.ok(result.data);
                                },function(){
                                     $scope.ok(null);
                                });
                                
                                
                                
                            }else{
                               
                            }
                        };

                        $scope.myPromise = null;


                        $scope.ok = function (retobject) {
                            $modalInstance.close(retobject);
                        };

                        $scope.cancel = function () {
                            $modalInstance.dismiss('cancel');
                        };


                    }]);


function alert(content) {
    bootbox.alert(content);
}