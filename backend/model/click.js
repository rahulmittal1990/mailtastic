

Click = sequelize.define('Click', {  
	userId: { type: Sequelize.UUID,allowNull: false},
  	groupId: { type: Sequelize.INTEGER,allowNull: false},
  	campaignId: { type: Sequelize.INTEGER,allowNull: false},
});
var overallConfig = require('../config/config.js');
var resetData = false;
if((overallConfig.env === "amazon" || overallConfig.env === "local") && overallConfig.resetEnvForTests === true){
    resetData = true;
}

Click.sync({force:resetData}).then(function () {
 	console.log("CLICK MODEL SYNCED");
});