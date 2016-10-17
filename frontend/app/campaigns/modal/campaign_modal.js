'use strict';
angular.module('mailtasticApp.modal',[]);

angular.module('mailtasticApp.modalCampaign', [ 'ui.bootstrap']).controller('CampaignModalCtrl', ['$scope', '$uibModal', '$log', 'campaignService', function ($scope, $uibModal, $log, campaignService) {

  $scope.items = ['item1', 'item2', 'item3'];

  $scope.animationsEnabled = true;



  $scope.open = function (campaignIdToEdit) {


	var campaignIdObject = {
		id : campaignIdToEdit
	};

    var modalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'campaigns/modal/campaign_modal.html',
      controller: 'CampaignModalInstanceCtrl',
      size: "lg",
       resolve: {
       	 campaignId : campaignIdObject
       },
        windowClass : "employeeModal"
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  $scope.toggleAnimation = function () {
    $scope.animationsEnabled = !$scope.animationsEnabled;
  };

}])

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service used above.

.controller('CampaignModalInstanceCtrl', ['$scope', '$modalInstance', 'campaignId', 'campaignService', 'browseService', '$state','alertService', function ($scope, $modalInstance, campaignId,campaignService,browseService, $state,alertService) {

	

  $scope.modaloptions = {
  	heading : "Kampagne erstellen",
  	mode : "create"
  };

  $scope.campaigndata = {
  	title : '',
  	url : '',
  	image : '',
  };



	 if(campaignId && campaignId.id){
		   	campaignId = campaignId.id;
				$scope.modaloptions.heading = "Kampagne bearbeiten";
				campaignService.getOne(campaignId).then(function(data){
					$scope.campaigndata = data;
					//get name from active group
					$scope.modaloptions.mode = "update";
				});
			}
$scope.checkfile = function(files){
    if(files && files.length === 0){
        alert("Bitte stellen Sie sicher, dass die Dateigröße unter 1MB liegt und es sich um eine Bilddatei handelt.");
    }
};

 $scope.myPromise = null;

  $scope.createCampaign = function () {
  	
  	if($scope.modaloptions.mode === "create"){
	   	    $scope.loadingPromise = campaignService.add($scope.campaigndata).then(function(data){
	   		if(data.success === true){
                                var campaignId = data.id;
                                if(campaignId){
                                     $state.go('base.campaigns.campaigndetail', {campaignId: campaignId});
                                }else{
                                    browseService.reload();
                                }
	   			
	   			$modalInstance.close();
	   		}else{
	   			alert(Strings.errors.TECHNISCHER_FEHLER);
	   		}
	   			
	   		
	   	});
   }else if($scope.modaloptions.mode === "update"){
   		 $scope.loadingPromise = campaignService.update($scope.campaigndata).then(function(data){
	   			if(data.success === true){
	   				browseService.reload();
                                        
                                        alertService.defaultSuccessMessage("Ihre Änderungen wurden erfolgreich gespeichert.");

                                        
	   				$modalInstance.close();
	   			}else{
	   				alert(Strings.errors.TECHNISCHER_FEHLER);
	   			}
	   		
	   	});
   	
   }
   	
  };
  
 
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}]);


function alert(content) {
    bootbox.alert(content);
}