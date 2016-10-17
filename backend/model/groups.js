Group = sequelize.define('Groups', {  
	id: {
	    type: Sequelize.INTEGER,
	    primaryKey: true,
	    autoIncrement: true 
	},
	title: { type: Sequelize.STRING,allowNull: false},
  	activeCampaign : { type: Sequelize.INTEGER,allowNull: true},
        activeSignature : { type: Sequelize.UUID,allowNull: true},
  	owner : { type: Sequelize.UUID,allowNull: false},
  	isDefault : { type: Sequelize.BOOLEAN, default: false},	//default gruppe darf nicht gelöscht werden
});
var overallConfig = require('../config/config.js');
var resetData = false;
if((overallConfig.env === "amazon" || overallConfig.env === "local") && overallConfig.resetEnvForTests === true){
    resetData = true;
}

Group.sync({force:resetData}).then(function () {
 	console.log("GROUP MODEL SYNCED");
});