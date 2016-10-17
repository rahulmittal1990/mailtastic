Signature = sequelize.define('Signature', {  
	id: {
                type: Sequelize.UUID,
                primaryKey: true,
                defaultValue: Sequelize.UUIDV4,
              },
	title: { type: Sequelize.STRING,allowNull: false},
  	owner : { type: Sequelize.UUID,allowNull: false},
        signatureTplToEdit : { type: Sequelize.TEXT, allowNull: true},
        signatureDataToEdit : { type: Sequelize.TEXT, allowNull: true},
        signatureTplRolledOut : { type: Sequelize.TEXT, allowNull: true},
        signatureDataRolledOut : { type: Sequelize.TEXT, allowNull: true},

        signatureUpdatedAt: { type: Sequelize.DATE,allowNull: true},    //only when the tpl or the signatureData was changed
        lastRollout : { type: Sequelize.DATE,allowNull: true}
  	
});
var overallConfig = require('../config/config.js');
var resetData = false;
if((overallConfig.env === "amazon" || overallConfig.env === "local") && overallConfig.resetEnvForTests === true){
    resetData = true;
}

Signature.sync({force : resetData}).then(function () {
 	console.log("SIGNATURE MODEL SYNCED");
});