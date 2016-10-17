var overallConfig = require('../config/config.js');
Campaign = sequelize.define('Campaign', {  
id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true // Automatically gets converted to SERIAL for postgres
  },
  title: { type: Sequelize.STRING,allowNull: false},
  image: Sequelize.STRING,
  url: { type: Sequelize.STRING,allowNull: false},
  owner : { type: Sequelize.UUID,allowNull: false},
  color : { type: Sequelize.STRING,default: 'rgb(36,36,36)'},
 
});

//check if data hast to be deleted for auto tests
var resetData = false;
if((overallConfig.env === "amazon" || overallConfig.env === "local") && overallConfig.resetEnvForTests === true){
    resetData = true;
}

Campaign.sync({force : resetData}).then(function () {
 	console.log("CAMPAIGN MODEL SYNCED");
});
