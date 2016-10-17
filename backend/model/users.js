User = sequelize.define('User', {
            id: {
                type: Sequelize.UUID,
                primaryKey: true,
                defaultValue: Sequelize.UUIDV4,
              },
        lastname: Sequelize.STRING,
        firstname: Sequelize.STRING,
        password : Sequelize.STRING(270),
        email : { type: Sequelize.STRING,allowNull: false},
        currentGroup : { type: Sequelize.INTEGER,allowNull: false},
        isActivated: { type: Sequelize.BOOLEAN, default: false},
        admin : Sequelize.UUID,
        isAdmin : { type: Sequelize.BOOLEAN, default: false},
        activationCode : Sequelize.STRING,
        companyName: Sequelize.STRING,
        isFromGoogle:{ type: Sequelize.BOOLEAN, default: false}, 
          isAutoSync: { type: Sequelize.BOOLEAN, default: false},
          adminEmail:Sequelize.STRING,
	      isSyncAdmin: { type: Sequelize.BOOLEAN, default: false},
          syncAdmin:Sequelize.UUID,
          passReset : { type: Sequelize.BOOLEAN, default: false},
          passResetCode : Sequelize.STRING,
          logins : { type: Sequelize.INTEGER, default : 0 },
          isaacCustomerNumber: { type: Sequelize.STRING,allowNull: true},
          isaacCustomerToken : { type: Sequelize.STRING,allowNull: true},
          isaacCustomPlan : { type: Sequelize.STRING,allowNull: true},
          isaacCustomAddition : { type: Sequelize.STRING,allowNull: true},
          forceAllow : { type: Sequelize.BOOLEAN, default: false},
          referer : { type: Sequelize.UUID,allowNull: true},
          companyInfo : { type: Sequelize.TEXT,allowNull: true},
          companyInfoUpdatedAt: { type: Sequelize.DATE,allowNull: true},
          userInfo: { type: Sequelize.TEXT,allowNull: true},
          userInfoUpdatedAt: {  type: Sequelize.DATE, allowNull: true},
          signatureLastRollout: {  type: Sequelize.DATE, allowNull: true},
          signatureActivated: {  type: Sequelize.UUID, allowNull: true},
          signatureActivatedAt: { type: Sequelize.DATE, allowNull: true },
          tourSeen : { type: Sequelize.BOOLEAN, default: false},
          isSyncActivated : { type: Sequelize.BOOLEAN, default: false},
          lastOutlookEasySync :  {  type: Sequelize.DATE, allowNull: true}  //needed to know if user is auto syncing to not send him an email

	});

var overallConfig = require('../config/config.js');
var resetData = false;
if((overallConfig.env === "amazon" || overallConfig.env === "local") && overallConfig.resetEnvForTests === true){
    resetData = true;
}

User.sync({force:resetData}).then(function () {
 	console.log("USER MODEL SYNCED");
});
