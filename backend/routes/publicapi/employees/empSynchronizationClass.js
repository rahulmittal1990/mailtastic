/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var rand = require("generate-key");
var $q = require('q');
var employeeSyncer = function(userId){
    
    this.employeesToAdd = [];
    this.employeesToChange = [];
    this.employeesToRemove = [];
    this.userId = userId;
    this.sigHelperInstance = new signatureHelper(userId);
    
    
    
    
    this.synchronizeEmployeesList = function(providedListFromCustomer, userId){
        instance = this;
        
      
        //get list of users which are already in mailtastic
        instance.getMailtasticEmployeesList(userId)
        
                .then(function(mailtasticEmployees){
                    //sort employees
                    return instance.sortEmployees(mailtasticEmployees)
                    
                    
                })
                .then(function(){   //find default group
                   return Group.findOne({where : { isDefault : 1, owner : instance.userId }});
                    
                })
                .then(function(defaultGroup){
                    if(!defaultGroup){
                        return $q.reject("no default group found")
                    }else{
                        instance.groupId = defaultGroup.id;
                        return $q.all([
                                instance.addEmployees().catch(function(e){ throw new Error("Error in sychronize emps - addEmployee: " + e)}),
                                instance.modifyEmployees().catch(function(e){ throw new Error("Error in sychronize emps - modifyEmployee: " + e )}),
                                instance.deleteEmployees().catch(function(e){ throw new Error("Error in sychronize emps - deleteEmployee:" + e )})
                        ]);
                    }
                    
                  
                }).then(function(results){
                    
                    
                }).catch(function(e){
                    
                    console.error("error in employee json sync : " + e.message ? e.message : e);
                    
                });
        
        
        
        
    };
    
    
    /**
     * update all employees for which data has changed
     * @returns {undefined}
     */
    this.modifyEmployees = function(){
        var deferred = $q.defer();
        
        var instance = this;
        
        var employeesToModify = this.employeesToChange;
        if(employeesToModify.length === 0){
             return $q.resolve(0);
        }
        var objectsToUpdate = [];
        
        for(var i = 0; i < employeesToModify.length; i++){
            objectsToUpdate.push(instance.createEmployeeObject(employeesToModify[i]));
        }
        
        
        User.bulkCreate(objectsToCreate).then(function (data) {
            if(!data){
                deferred.reject("Generating many users failed data = null");
            }else{
                deferred.resolve(data.length);  //return number of created employees
            }
            
            
        });
        
    }
    
    
    /**
     * 
     * @returns {undefined}create new employees objects
     */
    this.addEmployees = function(){
        var deferred = $q.defer();
        
        var instance = this;
        
        var employeesToCreate = this.employeesToAdd;
        if(employeesToCreate.length === 0){
            return $q.resolve(0);
        }
        var objectsToCreate = [];
        
        for(var i = 0; i < employeesToCreate.length; i++){
            objectsToCreate.push(instance.createEmployeeObject(employeesToCreate[i]));
        }
        
        
        User.bulkCreate(objectsToCreate).then(function (data) {
            if(!data){
                deferred.reject("Generating many users failed data = null");
            }else{
                deferred.resolve(data.length);  //return number of created employees
            }
            
            
        });
        
        
        
        return deferred.promise;
    };
    
    
    
    
     /**
      * merge employee object with data which has been uploaded
      * @param {type} uploadedObject
      * @returns {employeeSyncer.mergeEmployeeObject.employeeObject}
      */
    this.mergeEmployeeObject = function(uploadedObject //TODO merge with existing data ){
        
        
        var instance = this;
        
        var employeeObject = {
            firstname : uploadedObject.ma_vorname, 
            lastname : uploadedObject.ma_nachname,
            admin : this.userId,
            userInfo : instance.createUserInfoObject(uploadedObject),
            isAdmin  : false,
            isActivated: true,
            currentGroup: instance.groupId,
            activationCode: rand.generateKey(10)
            
        };
        
        return employeeObject;
        
    };
    
    
    
    /**
     * create employee object for adding new employees
     * @param {type} uploadedObject
     * @returns {employeeSyncer.createEmployeeObject.employeeObject}
     */
    this.createEmployeeObject = function(uploadedObject){
        
        
        var instance = this;
        
        var employeeObject = {
            firstname : uploadedObject.ma_vorname, 
            lastname : uploadedObject.ma_nachname,
            email : uploadedObject.ma_email,
            admin : this.userId,
            userInfo : instance.createUserInfoObject(uploadedObject),
            isAdmin  : false,
            isActivated: true,
            currentGroup: instance.groupId,
            activationCode: rand.generateKey(10)
            
        };
        
        return employeeObject;
        
    };
    
    this.createUserInfoObject = function(uploadedObject){    //TODO move to signature helper calss
        //use signature helper class
        
        var emptyStructure = this.sigHelperInstance.getEmptyFieldInfoStructure("employee");
        return this.mergeUserInfoObject(uploadedObject , emptyStructure);
        
        
    };
    
    /**
     * merge existing userInfo data with uploaded values
     */
    this.mergeUserInfoObject = function(uploadedObject, existantStructure){  //TODO move to signature helper calss
       for(var key in uploadedObject ){
           if(existantStructure[key] && existantStructure[key]["value"] &&  typeof  existantStructure[key]["value"] === 'object'){
               //image or url value
               existantStructure[key]["value"]["url"] = uploadedObject[key];
           }else if(existantStructure[key] && existantStructure[key]["value"]){
               //single text value
               existantStructure[key]["value"] = uploadedObject[key];
           }else{
               //not existing so it is a newly added value?
               //check which kind of value it is in field structure
               
              var emptyStructure = this.sigHelperInstance.getEmptyFieldInfoStructure("employee");
              if(emptyStructure[key] && emptyStructure[key]["value"] &&  typeof  emptyStructure[key]["value"] === 'object'){
                  existantStructure[key] = {
                      value : {
                          url : uploadedObject[key]
                      }
                    
                  };
                  
                  
              }else if(emptyStructure[key] && emptyStructure[key]["value"]){
                   existantStructure[key] = {
                       value : uploadedObject[key]
                   }; 
              }else{
                  //NOTHIN TO DO BECAUSE VALUE NOT KNOWN
              }
             
           }
           
       }
       
       return existantStructure;
        
    };
    
    
    
    
    /**
     * Define which employee has to be added, has to be removed or has to be modified
     * @returns {undefined}
     */
    this.sortEmployees = function(uploadedEmployeeList , mailtasticEmployees){
        var instance = this;
       if(!mailtasticEmployees || !Array.isArray(mailtasticEmployees)){
           return $q.reject("sort employees invalid parameter");
       }
       else
       {
           
           //search for employees to add and for employees to modify
             for(var i = 0 ; i < uploadedEmployeeList.length ; i++){
                 var ret =  searchObjectInArray(uploadedEmployeeList[i],"email", mailtasticEmployees);
                 if(ret.found === true){
                     var isModified = instance.testIfModified(uploadedEmployeeList[i], ret.object);
                     if(isModified === true){
                         instance.employeesToChange.push(uploadedEmployeeList[i]);
                     }
                 }else{
                      instance.employeesToAdd.push(uploadedEmployeeList[i]);
                 }
                 
             }
           
           
            //search for employees to delete
            for(var i = 0 ; i < mailtasticEmployees.length ; i++){
                 var ret =  searchObjectInArray(mailtasticEmployees[i],"email", uploadedEmployeeList);
                 if(ret.found === false){
                        instance.employeesToRemove.push(uploadedEmployeeList[i]);
                    
                 }
             }
       }
  
    };
    
    
    
    this.getMailtasticEmployeesList = function(userId){
       
       var deferred = $q.defer();
       User.findAll({
            where: {
                $or: [
                    {
                        admin: userId
                    },
                    {
                        isAdmin: true,
                        id: userId
                    }

                ]
            }
        })
                
        .then(function(emps){
            if(!data){
                 deferred.reject("getMailtastiEmployeesList : employee list could not be loaded");
            }else{
                 deferred.resolve(emps);
            }
            
        })
        .catch(function(e){
            deferred.reject(e);
            
        });
        
        return deferred.promise;
    };
    
    
    /**
     * test if employee object was modified
     * @returns {undefined}
     */
    this.testIfModified = function(uploaded, existant){
       
        if(uploaded.firstname !== existant.firstname){
            return true;
        }
        
        if(uploaded.lastname !== existant.lastname){
            return true;
        }
        
        if(uploaded.userInfo !== existant.userInfo){
            return true;
        }
        
        return false;
    };
    
   
    
    
    
};