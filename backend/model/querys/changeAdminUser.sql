/*SCIPT FOR CHANGING ADMIN USER*/
/*t.bauer@mailtastic.de*/
SET   @newAdminId = "";
SET @oldAdminId = "";


/*campaigns*/
UPDATE Campaign set owner =  @newAdminId where owner = @oldAdminId;

/*groups*/
UPDATE Groups set owner =  @newAdminId where owner = @oldAdminId;

/*signatures*/
UPDATE Signature set owner =  @newAdminId where owner = @oldAdminId;


/*users*/
/*change admin*/
UPDATE User set admin =  @newAdminId where admin = @oldAdminId;

/*set admin = 1 on new admin*/
UPDATE User set isAdmin =  1 where id = @newAdminId;

/*set admin = 0 on old admin*/
UPDATE User set isAdmin =  0 where id = @oldAdminId;

/*remove admin from new admin*/
UPDATE User set admin =  null where id = @newAdminId;

/*set admin on old admin*/
UPDATE User set admin =  @newAdminId where id = @oldAdminId;

/*set company info to new admin*/


UPDATE User u , 
(SELECT companyName, companyInfo, companyInfoUpdatedAt, tourSeen, isaacCustomerNumber, isaacCustomerToken, isaacCustomPlan, isaacCustomAddition, forceAllow, referer, password 
                        FROM User
                       WHERE id = @oldAdminId) u1
   SET u.companyInfo = u1.companyInfo, 
   u.companyInfoUpdatedAt = u1.companyInfoUpdatedAt, 
   u.isaacCustomerNumber = u1.isaacCustomerNumber, 
   u.isaacCustomerToken = u1.isaacCustomerToken, 
   u.isaacCustomPlan = u1.isaacCustomPlan, 
   u.isaacCustomAddition = u1.isaacCustomAddition, 
   u.forceAllow = u1.forceAllow, 
   u.referer = u1.referer, 
   u.password = u1.password, 
   u.companyName = u1.companyName
 WHERE u.id = @newAdminId;
   

UPDATE User u
 SET u.companyInfo = null, 
   u.companyInfoUpdatedAt = null, 
   u.isaacCustomerNumber = null, 
   u.isaacCustomerToken = null, 
   u.isaacCustomPlan = null, 
   u.isaacCustomAddition = null, 
   u.forceAllow = null,  
   u.referer = null, 
   u.password = null, 
   u.companyName = null
WHERE u.id = @oldAdminId;
