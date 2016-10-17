'use strict';


angular.module('mailtasticApp.modalExpired',[]).controller('AccountExpiredModalCtrl', ['$scope', '$uibModal', '$log', function ($scope, $uibModal, $log) {

        $scope.animationsEnabled = true;
        
     
        
        $scope.openExpiredModal = function () {
            $scope.openModal('booking/accountexpiredmodal/modals/account_expired_modal.html');
        };
        
         $scope.openTrialInfoModal = function () {
            $scope.openModal('booking/accountexpiredmodal/modals/trialinfo_modal.html');
        };
        
         $scope.openUnallowedActionModal = function () {
            $scope.openModal('booking/accountexpiredmodal/modals/unallowed_action_modal.html');
        };
        
        
        $scope.openModal = function(path){
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: path,
                controller: 'AccountExpiredModalInstanceCtrl',
                size: "lg",
                windowClass : "expiredmodalcontainer"
            });

            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
            
            
        };
        
        $scope.openPersonalContactModal = function(who){
            var optionObject = {
                mode: "onexit",
                who : who
            };

            $scope.openModal('snippets/livedemo/modals/personalcontact_modal.html', optionObject);
        };
        

        $scope.toggleAnimation = function () {
            $scope.animationsEnabled = !$scope.animationsEnabled;
        };

    }])

        // Please note that $modalInstance represents a modal window (instance) dependency.
        // It is not the same as the $uibModal service used above.

        .controller('AccountExpiredModalInstanceCtrl', ['$scope', '$modalInstance','$state','userService', function ($scope, $modalInstance,$state,userService) {
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
                
                
                $scope.goToBooking = function(){
                    $state.go("base.booking");
                    $scope.cancel();
                };
                
                
                $scope.modaldata = {
                    firstname : ""
                };
                $scope.initData = function(){
                    userService.getAccountData().then(function(data){
                        if(data.firstname){
                             $scope.modaldata.firstname = data.firstname;
                        }
                    });
                };
                
                $scope.initData();
                
        }]);


function alert(content) {
    bootbox.alert(content);
}