'use strict';
// angular.module('mailtasticApp.modal',[]);
angular.module('mailtasticApp.sigEditFieldModal', [])

        .controller('SignatureDataModalCtrl',
                ['$scope',
                    '$modalInstance',
                    'tagObject',
                    'additionalLabel',
                    'alertService',
                    function ($scope, $modalInstance, tagObject, additionalLabel, alertService) {



                        $scope.modaloptions = {
                            heading: "",
                            headingAddition: "",
                            mode: "create"
                        };


                        $scope.formdata = {
                            tag: "",
                            value: "",
                        };
                        
                        
                        //detect if image dimensions where changed or if other data then image dimension was changed
                        //needed to determine if signature object was changed or only user/company data was changed
                        $scope.changedOtherThanDimension = false;
                        $scope.imageDimensionsAvailable = false;
                        $scope.changedImageDimension = false;
                        
                        
                        //detect if link color was changed or other data on link was changed
                        //needed to determine if signature object was changed or only user/company data was changed
                        $scope.changedLinkColor = false;
                        $scope.changedOtherThanLinkColor = false;


                        $scope.imageFormData = {
                            showAs: "image",
                            altText: "",
                            linkText: "",
                            image: "",
                            url: "",
                            whichImage: "default",
                            initialdimension : {
                                width : "",
                                height : ""
                            }
                        };
                        
                        
                        //holds data for image dimension.
                        //is not located in image form data because it is not saved when the image is saved but when the signature is saved
                        $scope.imageDimensionData = {
                               mode : "default",
                               width : "",
                               height : ""
                        };
                        
                        
                        
                        
                        
                        
                        $scope.linkFormData = {
                           linkText: "",
                            url: "",
                        };
                        
                        $scope.linkColorData = {
                            color : ""
                        };



                        /**
                         * When default image is selected then get the default image for the specific value
                         * @returns {undefined}
                         */
                        $scope.whichImageChanged = function () {
                            if ($scope.imageFormData.whichImage === "default") {
                                $scope.imageFormData.image = tagObject.defaultImage;
                            }
                            
                            $scope.changedOtherThanDimension = true;
                        };

                        


                        $scope.initData = function () {
                            
                            
                            
                            $scope.$watch('linkColorData.color', function(newValue, oldValue){
                                if(newValue !== oldValue){
                                     $scope.changedLinkColor = true;
                                }
                               
                            })
                            
                           $scope.imageDimensionsAvailable = false;
                            
                            
                            $scope.modaloptions.heading = tagObject.label;
                            $scope.modaloptions.headingAddition = additionalLabel.value;
                            $scope.formdata.tag = tagObject.tag;
                            $scope.formdata.value = tagObject.value;

                           
                           //init depending of type ob tag object
                            switch (tagObject.type) {
                                case "image" :
                                    
                                    //if value is not available or is no object then show as text per defaulf
                                    if(!tagObject.value || typeof tagObject.value !== 'object'){
                                        tagObject.value = {
                                            showAs : "text"
                                        };
                                    }
                                    
                                    //set all values to modal form
                                    $scope.imageFormData.altText = tagObject.value.altText;
                                    $scope.imageFormData.image = tagObject.value.image;
                                    $scope.imageFormData.linkText = tagObject.value.linkText;
                                    $scope.imageFormData.showAs = tagObject.value.showAs;
                                    $scope.imageFormData.url = tagObject.value.url;
                                    $scope.imageFormData.initialdimension = tagObject.value.initialdimension;
                                    
                                    //handle image dimensions
                                    
                                   
                                    $scope.imageDimensionData.mode = tagObject.imgdimension ? tagObject.imgdimension.mode : "default";
                                    
                                    if(tagObject.imgdimension && tagObject.imgdimension.width){
                                        //image dimension was set to signature data
                                        $scope.imageDimensionData.width = tagObject.imgdimension.width;
                                        $scope.imageDimensionData.height = tagObject.imgdimension.height;
                                          $scope.imageDimensionsAvailable = true;
                                    }else if(tagObject.value.initialdimension && tagObject.value.initialdimension.width){
                                        //initial dimension exist on tag object (was created on upload)
                                        $scope.imageDimensionData.width = tagObject.value.initialdimension.width;
                                        $scope.imageDimensionData.height = tagObject.value.initialdimension.height;
                                         $scope.imageDimensionsAvailable = true;
                                    }else{
                                        //no dimension data exist
                                        $scope.imageDimensionData.width = "";
                                        $scope.imageDimensionData.height = "";
                                         $scope.imageDimensionsAvailable = false;
                                    }
                                  
                                    
                                    //if value is not present set as "default" per default
                                    if(!tagObject.value.whichImage){
                                         $scope.imageFormData.whichImage = "default";
                                    }else{
                                         $scope.imageFormData.whichImage = tagObject.value.whichImage;
                                        
                                    }
                                   
                                    
                                    
                                    
                                     //set all values as single values so that the saved structure from db does not override the structure here
                                    for(var key in $scope.linkFormData){
                                        $scope.linkFormData[key] = tagObject.value[key];
                                      
                                    }
                                    break;
                                case "singlevalue" :    //nothing to do here
                                    break;
                                case "link" :           //
                                   //set all values as single values so that the saved structure from db does not override the structure here
                                    for(var key in $scope.linkFormData){
                                        $scope.linkFormData[key] = tagObject.value[key];
                                    }
                                    
                                      
                                    if(tagObject.linkcolor){
                                        $scope.linkColorData.color = tagObject.linkcolor;
                                       
                                    }else{
                                         $scope.linkColorData.color = "#000000";
                                    }
                                    break;
                                default :
                                    alertService.defaultErrorMessage(Strings.errors.DATEN_NICHT_GELADEN);
                            }


                            $scope.whichImageChanged();    //get correct default image is default image is selected
                            
                            
                            //set all has changed values to false
                              $scope.changedOtherThanDimension = false;
                           
                            $scope.changedImageDimension = false;
                            
                            $scope.changedLinkColor = false;
                        };

                        $scope.initData();


                        /**
                         * check selected file
                         * @param {type} files
                         * @returns {undefined}
                         */
                        $scope.checkfile = function (files) {
                             $scope.changedOtherThanDimension = true;
                            if (files && files.length === 0) {
                                alertService.defaultErrorMessage("Bitte stellen Sie sicher, dass die Dateigröße kleiner als 1MB ist und es sich um eine Bilddatei handelt.");
                            }else if(files && files[0].$ngfHeight){
                                //set initial dimension for image itself
                                //it is important to show the image dimension form
                               
                                $scope.imageDimensionData.width = files[0].$ngfWidth;
                                $scope.imageDimensionData.height = files[0].$ngfHeight;
                                $scope.imageDimensionsAvailable = true;
                               
                            }
                        };

                        $scope.myPromise = null;



                        /**
                         * Save changes
                         * @returns {undefined}
                         */
                        $scope.saveValue = function () {

                            function saveSingleValue() {
                                tagObject.value = $scope.formdata.value;
                                $scope.ok(tagObject);

                            }
                            ;

                            function saveImageObject() {
                                
                                
                                 
                                
                                tagObject.value = $scope.imageFormData;
                            
                                
                                if (tagObject.value.showAs === "text") {
                                    tagObject.value.image = "";
                                }else{      //show own image
                                    
                                    
                                    
                                    if(tagObject.value.image.$ngfHeight){
                                        //new image was uploaded
                                        
                                        //set initial dimension for image itself
                                        if(!tagObject.value.initialdimension){
                                            tagObject.value.initialdimension = {
                                                width : "",
                                                height : ""
                                            };
                                        }
                                        tagObject.value.initialdimension.width = tagObject.value.image.$ngfWidth;
                                        tagObject.value.initialdimension.height = tagObject.value.image.$ngfHeight;
                                        
                                        
                                        //set height and width to signature data
                                        tagObject.imgdimension.width  = tagObject.value.image.$ngfWidth;
                                        tagObject.imgdimension.height = tagObject.value.image.$ngfHeight;
                                       
                                       
                                        if($scope.imageDimensionData.mode === "custom"){
                                           //user has entered custom width
                                            //calculate the needed height of image because otherwise in outlook it will be scaled wrong
                                            var originalWidth = tagObject.value.image.$ngfWidth;
                                            var originalHeight =tagObject.value.image.$ngfHeight;

                                            //calculate factor
                                            var factor = originalWidth / $scope.imageDimensionData.width;   //get width from form
                                            var calculatedHeight = originalHeight / factor;

                                            //calc and set height
                                            tagObject.imgdimension.height = calculatedHeight;
                                            tagObject.imgdimension.width = $scope.imageDimensionData.width;
                                            tagObject.imgdimension.mode = "custom";
                                        }
                                       
                                       
                                        
                                    }else{
                                        //image was not updated
                                        
                                        
                                         if($scope.imageDimensionData.mode === "custom" && tagObject.value.initialdimension && tagObject.value.initialdimension.width){
                                             //calculate the needed height of image because otherwise in outlook it will be scaled wrong
                                            var originalWidth = tagObject.value.initialdimension.width;
                                       
                                            //calculate factor
                                            var factor = originalWidth / $scope.imageDimensionData.width;
                                            var calculatedHeight = tagObject.value.initialdimension.height / factor;

                                            //calc and set height
                                            tagObject.imgdimension.height = calculatedHeight;
                                            tagObject.imgdimension.width = $scope.imageDimensionData.width;
                                            tagObject.imgdimension.mode = "custom";
                                        }
                                        
                                    }
                                }
                                
                                
                                //determine which data was changed in image change dialog
                                //image dimension is stored at signature data level so signature has to be marked as changed
                                
                                var ret = [];
                                if($scope.changedOtherThanDimension === true && $scope.changedImageDimension === true){
                                    //changed dimension and data (employee /company)
                                    ret["result"] = "everythingchanged";
                                    ret["data"] = tagObject;
                                     $scope.ok(ret);
                                }else if($scope.changedOtherThanDimension === true){
                                     //changed  data (employee /company)
                                    ret["result"] = "everythingbutdimension";
                                    ret["data"] = tagObject;
                                    $scope.ok(ret);
                                }else if($scope.changedImageDimension === true){
                                    //changed dimension of image
                                    ret["result"] = "onlydimensionchanged";
                                    ret["data"] = tagObject;
                                    $scope.ok(ret);
                                }else{  //changed nothing
                                      $scope.ok(tagObject);
                                }
                              
                                
                                
                            }
                            
                            
                            function saveLinkObject() {
                                tagObject.value = $scope.linkFormData;
                               
                               //set link color
                                tagObject.linkcolor = $scope.linkColorData.color;
                                
                                var ret = [];
                                if($scope.changedOtherThanLinkColor === true && $scope.changedLinkColor === true){
                                    //changed linkcolor and data (employee /company)
                                    ret["result"] = "everythingchanged";
                                    ret["data"] = tagObject;
                                     $scope.ok(ret);
                                }else if($scope.changedOtherThanLinkColor === true){
                                     //changed  data (employee /company)
                                    ret["result"] = "everythingbutcolor";
                                    ret["data"] = tagObject;
                                    $scope.ok(ret);
                                }else if($scope.changedLinkColor === true){
                                    //changed dimension of image
                                    ret["result"] = "onlycolorchanged";
                                    ret["data"] = tagObject;
                                    $scope.ok(ret);
                                }else{  //changed nothing
                                      $scope.ok(tagObject);
                                }
                                
                                
                              
                            }



                            if (tagObject.tag === $scope.formdata.tag) {    //check if there was something changed other than the dimension of the image. 
                                // If only dimension was changed it must not change company or employee data because otherwise signature will be marked as not rolled out
                                
                              
                                     //check which type of field object it is
                                    switch (tagObject.type) {
                                        case "singlevalue"   :
                                            saveSingleValue();
                                            break;
                                        case "image"         :
                                            saveImageObject();
                                            break;
                                        case "link"          :
                                            saveLinkObject();
                                            break;
                                    }
                               

                               

                            } else {
                                alert(Strings.errors.DATEN_NICHT_GELADEN);
                            }

                        };




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