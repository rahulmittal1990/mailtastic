 var async = require('async');
 var passwordTool = require('password-hash-and-salt');
 var AdminUser = {
	   lastname: "Schröder",
  	   firstname: "Andreas",
	   password : "123456",
	   email : "a.schroeder@netstag.com",
	   currentGroup : 0,
	   isActivated: true,
	   isAdmin : true
 };
 
 
 var standardGroup = {
	 title: "Standard Abteilung",
  	 owner : "dsdfsdf",				//updating afterwards
  	 isDefault : true	//default gruppe darf nicht gelöscht werden
 };
// 
// 
//   
 var adminUserId = null;
 var adminGroupId = null;
// 
 async.series([
     function(callback){
          passwordTool(AdminUser.password).hash(function (error, hash) {
                            if (error) {
                                console.error("PASSWORD HASHING FAILED");
                            } else {
                               AdminUser.password = hash;
                            }
                               callback();
                         });
         
     },
     
     
     
     
         //Load user to get userId first
         function(callback) {
	            User
			   .findAndCountAll({
			      where: {
			         isAdmin: true
			      }
			   })
			   .then(function(result) {
			    if(result.count === 0){
			   		 User.create(AdminUser).then(function(data){
				   		 console.log("User Seed data created");
				   		 adminUserId = data.id;
				   		  callback();
				   	 },function(err){
				   		 console.log("User Seed data creation error" + err);
				   		  callback();
				   	 });
			    }else{
			   		 adminUserId = result.id;
			   		 console.log("User Seed data not necessary");
			   		  callback();
			    }
			   });
 	          
         },
         //Load posts (won't be called before task 1's "task callback" has been called)
         function(callback) {
         	
        	 if(adminUserId == null){
        		 callback();
        		 console.log("Group Seed data not necessary because no admin user");
        	 }else{
        		 Group
				   .findAndCountAll({
				      where: {
				     	 owner : adminUserId,
				         isDefault: true
				      }
				   })
				   .then(function(result) {
				    if(result.count === 0){
				   		 standardGroup.owner = adminUserId;
				   		 Group.create(standardGroup).then(function(data){
				   			 adminGroupId = data.id;
					   		 console.log("Group Seed data created");
					   		   callback();
					   	 },function(err){
					   		 console.log("Group Seed data creation error" + err);
					   		   callback();
					   	 });
 				   
				    }else{
				   		 console.log("Group Seed data not necessary");
				   		   callback();
				    }
				   });
        	 }
         	   
        },
        
        //set current group to admin
        function(callback){
       		 if(adminGroupId != null){
       			 User.update({
       				 currentGroup : adminGroupId
	       		 }, {
	       			 where : {
	       				 id : adminUserId
	       			 }
 	       			
	       		 }).then(function(data){
	       			 console.log("Group to Admin Seed data set");
	       			 callback();
	       		 });
        			
       		 }else{
       			  	 callback();
       		 }
      
        }
     ], function(err) { 
		 if(err){
			 console.log("Error on creating seed data: " + err);
		 }else{
			 console.log("Seed data creation successfull");
		 }
		 adminUserId = null;
		 adminGroupId = null;	
        
    });
    
   
 
 
 
 
 
 
